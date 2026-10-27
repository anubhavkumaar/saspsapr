import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { ArrowLeft, Inbox, LayoutList, LogOut, Users } from 'lucide-react'
import { auth } from '../firebase'
import { MANAGEMENT_EMAIL, effectiveRole, useAuthWithRole } from '../lib/auth'
import { setRecruitmentOpen, useRecruitmentOpen } from '../lib/recruitment'
import { AdminBar, Alert, Button, ControlCard, Empty, Live, LoginCard, Reveal, Section, SectionHeader, Segmented } from '../components'
import { RejectionNotice } from '../shell/RejectionNotice.jsx'
import { Applications } from './admin/Applications.jsx'
import { RosterManagement } from './admin/RosterManagement.jsx'
import { UserManagement } from './admin/UserManagement.jsx'

// The three long lists sit behind tabs so the page is one screen of work at a time. The tab values are the old
// section ids, so /admin#applications (and the other two) still open the right one.
const TABS = [
  { value: 'user-management',   label: 'Officers',     icon: Users },
  { value: 'roster-management', label: 'Roster',       icon: LayoutList },
  { value: 'applications',      label: 'Applications', icon: Inbox },
]
const tabFromHash = () => {
  const h = window.location.hash.replace('#', '')
  return TABS.some(t => t.value === h) ? h : TABS[0].value
}

// /admin — reached by clicking the brand five times. Management only: login, then the recruitment switch,
// and tabs for officer accounts, the roster, and the application queue.
export default function Admin() {
  const { user, role, authLoaded, justBlocked, clearBlocked } = useAuthWithRole()
  const [loginErr,  setLoginErr]  = useState('')
  const [loginBusy, setLoginBusy] = useState(false)
  const { formOpen, configLoading } = useRecruitmentOpen()
  const [toggling,  setToggling]  = useState(false)
  const [toggleErr, setToggleErr] = useState('')
  const [tab,       setTab]       = useState(tabFromHash)

  const pickTab = v => {
    setTab(v)
    try { window.history.replaceState(null, '', '#' + v) } catch { /* history unavailable */ }
  }

  const handleLogin = async ({ email, password }) => {
    setLoginErr(''); setLoginBusy(true)
    try { await signInWithEmailAndPassword(auth, email, password) }
    catch { setLoginErr('Invalid email or password.') }
    finally { setLoginBusy(false) }
  }

  const resolvedRole = effectiveRole(user, role)

  const toggleFormOpen = async () => {
    setToggling(true); setToggleErr('')
    try { await setRecruitmentOpen(!formOpen) }
    catch (e) { setToggleErr(e.message || 'Write failed — check Firestore rules for sapr_config.') }
    finally { setToggling(false) }
  }

  // Not known yet: auth is still resolving, or the account's role document hasn't arrived (so "denied" would be a false alarm).
  const roleLoading = user && role === undefined && !MANAGEMENT_EMAIL.includes(user.email)
  if (!authLoaded || roleLoading) return <Section><Empty>Loading…</Empty></Section>

  if (!user) return (
    <Section>
      <div style={{ padding: '40px 0' }}>
        {justBlocked
          ? <RejectionNotice onDismiss={clearBlocked}/>
          : <LoginCard eyebrow="Management Access" title="SAPR Admin" error={loginErr} busy={loginBusy} onSubmit={handleLogin}/>}
      </div>
    </Section>
  )

  // Signed in but not management: deny, and point rangers at their own portal.
  if (resolvedRole !== 'management') return (
    <Section>
      <div style={{ padding: '40px 0' }}>
        <div className="login" role="alertdialog" aria-labelledby="denied-title">
          <div className="login__head"><h2 id="denied-title" className="sh__title" style={{ fontSize: 44 }}>Access Denied</h2></div>
          <div className="login__body form-stack">
            <p>
              {resolvedRole === 'ranger'
                ? 'This page is for Management only. Head to your Ranger dashboard instead.'
                : 'This page is restricted to SAPR Management.'}
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {resolvedRole === 'ranger' && <Button as={Link} to="/ranger">Go to Ranger Portal</Button>}
              <Button variant="danger" onClick={() => signOut(auth)}>Sign Out</Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )

  return (
    <>
      <Section tight id="admin-overview">
        <AdminBar name="SAPR Admin — Management Only" email={user.email}>
          <Button as={Link} to="/" size="sm" variant="ghost" icon={ArrowLeft}>Back to Site</Button>
          <Button size="sm" variant="ghost" icon={LogOut} onClick={() => signOut(auth)}>Sign Out</Button>
        </AdminBar>
        <Reveal><SectionHeader num="ADMIN" eyebrow="Management Dashboard" title="SAPR Admin Panel"/></Reveal>
        <Reveal>
          <ControlCard title="Recruitment Form" sub="Controls whether /joinsapr shows the application form to the public."
            status={<Live tone={formOpen ? 'ok' : 'danger'}>{'Status: ' + (configLoading ? '…' : formOpen ? 'OPEN' : 'CLOSED')}</Live>}
            action={<Button variant={formOpen ? 'danger' : 'primary'} onClick={toggleFormOpen} disabled={toggling || configLoading}>
              {toggling ? 'Saving…' : formOpen ? 'Close Form' : 'Open Form'}</Button>}/>
        </Reveal>
        {toggleErr && <Alert style={{ marginTop: 16 }}>{toggleErr}</Alert>}
        <div className="admin-tabs"><Segmented value={tab} onChange={pickTab} options={TABS}/></div>
      </Section>

      {/* All three stay mounted (their Firestore listeners and any half-typed edit survive a tab switch); only the active one shows. */}
      <div hidden={tab !== 'user-management'}><UserManagement user={user} role={role}/></div>
      <div hidden={tab !== 'roster-management'}><RosterManagement user={user} role={role}/></div>
      <div hidden={tab !== 'applications'}><Applications user={user} role={role}/></div>
    </>
  )
}

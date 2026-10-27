import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { ArrowLeft, LogOut, Megaphone, Target } from 'lucide-react'
import { auth } from '../firebase'
import { MANAGEMENT_EMAIL, effectiveRole, useAuthWithRole } from '../lib/auth'
import { postMillis, readAnnouncementsSeen, useAnnouncements, writeAnnouncementsSeen } from '../lib/posts'
import { useLinkedApplication, useMyProfile } from '../lib/profile'
import { AdminBar, Button, Empty, Facts, LoginCard, Panel, Reveal, Section, SectionHeader, Segmented } from '../components'
import { RejectionNotice } from '../shell/RejectionNotice.jsx'
import { PostsBoard } from './ranger/PostsBoard.jsx'

// /ranger — the Ranger Portal. Rangers and management only: login, then an overview of who you are on the books and
// the Announcements & Orders feed (management publishes there). The old avatar and bell popovers are gone: My Profile is
// the account chip in the header (it opens the My Profile panel) and the announcements are the second tab.
export default function Ranger() {
  const { user, role, authLoaded, justBlocked, clearBlocked } = useAuthWithRole()
  const profile   = useMyProfile(user)
  const linkedApp = useLinkedApplication(profile?.applicationId)
  const posts     = useAnnouncements(!!user)
  const [tab,      setTab]      = useState('overview')   // 'overview' | 'feed'
  const [lastSeen, setLastSeen] = useState(readAnnouncementsSeen)
  const [loginErr,  setLoginErr]  = useState('')
  const [loginBusy, setLoginBusy] = useState(false)

  const handleLogin = async ({ email, password }) => {
    setLoginErr(''); setLoginBusy(true)
    try { await signInWithEmailAndPassword(auth, email, password) }
    catch { setLoginErr('Invalid email or password.') }
    finally { setLoginBusy(false) }
  }

  // Announcements count as read once the feed has been open; anything posted while it is open is read too.
  const goTab = next => {
    if (next === 'feed' || tab === 'feed') { const now = Date.now(); writeAnnouncementsSeen(now); setLastSeen(now) }
    setTab(next)
  }
  const unread = tab === 'feed' ? 0 : posts.filter(p => postMillis(p) > lastSeen).length

  const resolvedRole = effectiveRole(user, role)
  // Role not known yet: auth is resolving, or the account's role document hasn't arrived (so "denied" would be a false alarm).
  const roleLoading = user && role === undefined && !MANAGEMENT_EMAIL.includes(user.email)
  if (!authLoaded || roleLoading) return <Section tight><Empty>Loading…</Empty></Section>

  if (!user) return (
    <Section tight>
      <div style={{ padding: '40px 0' }}>
        {justBlocked
          ? <RejectionNotice onDismiss={clearBlocked}/>
          : <LoginCard eyebrow="Ranger Access" title="SAPR Ranger Portal" error={loginErr} busy={loginBusy} onSubmit={handleLogin}/>}
      </div>
    </Section>
  )

  if (resolvedRole !== 'ranger' && resolvedRole !== 'management') return (
    <Section tight>
      <div style={{ padding: '40px 0' }}>
        <div className="login" role="alertdialog" aria-labelledby="denied-title">
          <div className="login__head"><h2 id="denied-title" className="sh__title" style={{ fontSize: 44 }}>Access Denied</h2></div>
          <div className="login__body form-stack">
            <p>Your account isn't associated with the Ranger Portal. If you just submitted an application, you'll receive credentials once reviewed.</p>
            <div><Button variant="danger" onClick={() => signOut(auth)}>Sign Out</Button></div>
          </div>
        </div>
      </div>
    </Section>
  )

  const displayName = profile?.displayName || linkedApp?.name || user.email
  const canEdit     = resolvedRole === 'management'

  return (
    <Section tight id="ranger-portal">
      <AdminBar name="SAPR Ranger Portal" email={user.email}>
        <Button as={Link} to="/" size="sm" variant="ghost" icon={ArrowLeft}>Back to Site</Button>
      </AdminBar>

      <div className="admin-tabs" style={{ marginTop: 0, marginBottom: 32 }}>
        <Segmented value={tab} onChange={goTab} options={[
          { value: 'overview', label: 'Overview', icon: Target },
          { value: 'feed', label: unread > 0 ? `Announcements · ${unread}` : 'Announcements', icon: Megaphone, tone: unread > 0 ? 'warn' : undefined },
        ]}/>
      </div>

      {tab === 'overview' && (
        <>
          <Reveal>
            <SectionHeader num="DUTY" eyebrow="Duty Status · Active"
              title={<>Welcome, <span className="portal-name">Ranger {displayName}</span></>}
              sub={`San Andreas Park Rangers · ${canEdit ? 'Management' : 'Field Ranger'}`}/>
          </Reveal>
          <Reveal delay={0.08}>
            <Panel body={false}>
              <Facts items={[
                { k: 'Callsign',    v: profile?.callsign || linkedApp?.rank || '—' },
                { k: 'Origin Dept', v: linkedApp?.department || '—' },
                { k: 'Citizen ID',  v: linkedApp?.citizenId || '—' },
                { k: 'Role',        v: resolvedRole.charAt(0).toUpperCase() + resolvedRole.slice(1) },
              ]}/>
            </Panel>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="portal-out"><Button variant="danger" size="sm" icon={LogOut} onClick={() => signOut(auth)}>Sign Out</Button></div>
          </Reveal>
        </>
      )}

      {tab === 'feed' && (
        <>
          <Reveal><SectionHeader num="NEWS" title="Announcements & Orders"/></Reveal>
          <PostsBoard posts={posts} canEdit={canEdit} authorEmail={user.email}/>
        </>
      )}
    </Section>
  )
}

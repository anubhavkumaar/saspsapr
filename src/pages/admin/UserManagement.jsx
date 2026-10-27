import { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updatePassword } from 'firebase/auth'
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore'
import { ChevronDown, ChevronUp, Eye, EyeOff, KeyRound, Plus, X } from 'lucide-react'
import { db } from '../../firebase'
import { USER_NAMES_FALLBACK, isManagementUser, secondaryAuth } from '../../lib/auth'
import { USER_ROLES } from '../../data/recruitment'
import {
  Alert, Button, Empty, Field, FormStack, Icon, Input, Label, Paginator, Panel, Reveal, SearchInput, Section, SectionHeader, Select,
} from '../../components'

const PER_PAGE = 10
const ROLE_TONE  = { management: 'gold', ranger: 'active', user: 'info', blocked: 'danger' }
const ROLE_LABEL = { management: 'Management', ranger: 'Ranger', user: 'User', blocked: 'Blocked' }
const ROLE_FILTERS = [['all', 'All'], ['management', 'Management'], ['ranger', 'Ranger'], ['user', 'User'], ['blocked', 'Blocked'], ['unset', 'Unset']]

// Officer Accounts: create an account without signing the admin out (a second Firebase app does the creating),
// and manage the accounts that exist — role, roster link, stored password, password reset.
// The list is one line per officer (search, role filter, 10 a page); a row opens in place to show its controls.
export function UserManagement({ user, role }) {
  const [userList,      setUserList]      = useState([])
  const [rosterEntries, setRosterEntries] = useState([])
  const [secretsMap,    setSecretsMap]    = useState({})
  const [shownPasses,   setShownPasses]   = useState(new Set())
  const [nuEmail,       setNuEmail]       = useState('')
  const [nuPass,        setNuPass]        = useState('')
  const [nuName,        setNuName]        = useState('')
  const [nuBusy,        setNuBusy]        = useState(false)
  const [nuErr,         setNuErr]         = useState('')
  const [nuOk,          setNuOk]          = useState('')
  const [nuRole,        setNuRole]        = useState('user')
  const [resetTarget,   setResetTarget]   = useState(null)
  const [resetPass,     setResetPass]     = useState('')
  const [resetBusy,     setResetBusy]     = useState(false)
  const [resetErr,      setResetErr]      = useState('')
  const [resetOk,       setResetOk]       = useState('')
  const [resetOkFor,    setResetOkFor]    = useState('')   // whose row the success message belongs to
  const [roleBusy,      setRoleBusy]      = useState('')
  const [createOpen,    setCreateOpen]    = useState(false)
  const [search,        setSearch]        = useState('')
  const [roleFilter,    setRoleFilter]    = useState('all')
  const [page,          setPage]          = useState(0)
  const [openId,        setOpenId]        = useState('')

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'sapr_roster'), orderBy('order', 'asc')), snap => {
      setRosterEntries(snap.docs
        .map(d => ({ badge: d.data().badge || '', name: d.data().name || '' }))
        .filter(r => r.badge && r.name))
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'sapr_users'), snap => {
      const list = []
      snap.docs.forEach(d => { const data = d.data(); if (data.email) list.push({ id: d.id, ...data }) })
      setUserList(list)
    })
    return unsub
  }, [])

  const mgmt = isManagementUser(user, role)

  useEffect(() => {
    if (!mgmt) return
    const unsub = onSnapshot(collection(db, 'sapr_user_secrets'), snap => {
      const m = {}
      snap.docs.forEach(d => { m[d.id] = d.data().password })
      setSecretsMap(m)
    })
    return unsub
  }, [mgmt])

  if (!mgmt) return null

  const handleCreateUser = async () => {
    setNuErr(''); setNuOk('')
    if (!nuEmail.trim() || !nuPass.trim() || !nuName.trim()) return
    setNuBusy(true)
    try {
      try {
        await createUserWithEmailAndPassword(secondaryAuth, nuEmail.trim(), nuPass.trim())
        await signOut(secondaryAuth)
      } catch (authErr) {
        if (authErr.code === 'auth/weak-password') { setNuErr('Password must be at least 6 characters.'); setNuBusy(false); return }
        if (authErr.code !== 'auth/email-already-in-use') { setNuErr(authErr.message || 'Auth error.'); setNuBusy(false); return }
      }
      const docId = nuEmail.trim().replace(/[@.]/g, '_')
      await setDoc(doc(db, 'sapr_users', docId), {
        email:       nuEmail.trim(),
        displayName: nuName.trim(),
        role:        nuRole,
        createdAt:   serverTimestamp(),
      })
      await setDoc(doc(db, 'sapr_user_secrets', docId), { password: nuPass.trim() })
      setNuOk(`Saved — ${nuName.trim()} (${nuEmail.trim()}) · ${nuRole}`)
      setNuEmail(''); setNuPass(''); setNuName(''); setNuRole('ranger')
    } catch (err) {
      setNuErr(err.message || 'Failed to save.')
    } finally { setNuBusy(false) }
  }

  const handleBadgeChange = async (docId, badge) => {
    setRoleBusy(docId)
    try   { await setDoc(doc(db, 'sapr_users', docId), { badge }, { merge: true }) }
    catch (e) { console.error(e) }
    finally   { setRoleBusy('') }
  }

  const handleRoleChange = async (docId, newRole) => {
    setRoleBusy(docId)
    try {
      await setDoc(doc(db, 'sapr_users', docId), {
        role:          newRole,
        roleUpdatedAt: serverTimestamp(),
        roleUpdatedBy: user.email,
      }, { merge: true })
    } catch (e) {
      alert(`Failed to update role: ${e.message || e}`)
    } finally { setRoleBusy('') }
  }

  const handleResetPassword = async (email, storedPass) => {
    if (!resetPass.trim() || !storedPass) return
    setResetBusy(true); setResetErr(''); setResetOk('')
    try {
      await signInWithEmailAndPassword(secondaryAuth, email, storedPass)
      await updatePassword(secondaryAuth.currentUser, resetPass.trim())
      await signOut(secondaryAuth)
      await setDoc(doc(db, 'sapr_user_secrets', email.replace(/[@.]/g, '_')), { password: resetPass.trim() }, { merge: true })
      setResetOk('Password updated.'); setResetOkFor(email)
      setResetTarget(null); setResetPass('')
    } catch (err) {
      setResetErr(err.message || 'Failed to reset.')
    } finally { setResetBusy(false) }
  }

  const togglePass = email => setShownPasses(s => { const n = new Set(s); if (n.has(email)) n.delete(email); else n.add(email); return n })
  const startReset = email => { setResetTarget(email); setResetPass(''); setResetErr(''); setResetOk('') }
  const toggleRow  = id => { setOpenId(cur => (cur === id ? '' : id)); setResetTarget(null); setResetErr('') }

  /* ── the list: accounts first, then the built-in names that have no account record yet ── */
  const items = [
    ...userList.map(u => ({ key: u.id, u })),
    ...Object.entries(USER_NAMES_FALLBACK)
      .filter(([em]) => !userList.some(u => u.email === em))
      .map(([em, name]) => ({ key: 'fb' + em, fallback: true, u: { email: em, displayName: name } })),
  ].sort((a, b) => (a.u.displayName || a.u.email).toLowerCase().localeCompare((b.u.displayName || b.u.email).toLowerCase()))

  const roleOf = it => (it.fallback ? '' : (it.u.role || 'unset'))
  const counts = Object.fromEntries(ROLE_FILTERS.map(([id]) => [id, id === 'all' ? items.length : items.filter(it => roleOf(it) === id).length]))
  const q = search.trim().toLowerCase()
  const filtered = items.filter(it => (roleFilter === 'all' || roleOf(it) === roleFilter)
    && (!q || [it.u.displayName, it.u.email, it.u.badge].some(v => v && String(v).toLowerCase().includes(q))))
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const pg = Math.min(page, Math.max(totalPages - 1, 0))
  const shown = filtered.slice(pg * PER_PAGE, (pg + 1) * PER_PAGE)

  const row = it => {
    const u = it.u
    const r = roleOf(it)
    if (it.fallback) return (
      <li key={it.key} className="officer">
        <div className="officer__row officer__row--static">
          <span className="officer__id"><b>{u.displayName}</b><span className="t-mono">{u.email}</span></span>
          <span className="officer__tags"><Label tone="info">No account record</Label></span>
        </div>
      </li>
    )
    const docId = u.email.replace(/[@.]/g, '_')
    const storedPass = secretsMap[docId]
    const busy = roleBusy === docId
    const open = openId === it.key
    return (
      <li key={it.key} className={'officer' + (open ? ' is-open' : '')}>
        <button type="button" className="officer__row" aria-expanded={open} onClick={() => toggleRow(it.key)}>
          <span className="officer__id"><b>{u.displayName}</b><span className="t-mono">{u.email}</span></span>
          <span className="officer__tags">
            <Label tone={ROLE_TONE[r]}>{ROLE_LABEL[r] || 'Unset'}</Label>
            {u.badge && <Label>{u.badge}</Label>}
          </span>
          <Icon icon={open ? ChevronUp : ChevronDown}/>
        </button>
        {open && (
          <div className="officer__more">
            <div className="user-row__ctl">
              <Field label="Role">
                <Select value={u.role || ''} disabled={busy} onChange={e => handleRoleChange(docId, e.target.value)}>
                  <option value="">— Unset —</option>
                  <option value="user">User</option>
                  <option value="ranger">Ranger</option>
                  <option value="management">Management</option>
                  <option value="blocked">Blocked</option>
                </Select>
              </Field>
              <Field label="Roster" hint={u.badge ? 'photo & profile text feed their plate' : 'link to let them fill their own plate'}>
                <Select value={u.badge || ''} disabled={busy} onChange={e => handleBadgeChange(docId, e.target.value)}>
                  <option value="">— Not linked —</option>
                  {rosterEntries.map(rr => <option key={rr.badge} value={rr.badge}>{rr.badge} · {rr.name}</option>)}
                </Select>
              </Field>
            </div>
            <div className="user-row__pass">
              <span className="t-label">Pass</span>
              <code>{shownPasses.has(u.email) ? (storedPass || '—') : '••••••••'}</code>
              <Button size="sm" variant="ghost" icon={shownPasses.has(u.email) ? EyeOff : Eye} onClick={() => togglePass(u.email)}>{shownPasses.has(u.email) ? 'Hide' : 'Show'}</Button>
              <Button size="sm" variant="ghost" icon={KeyRound} onClick={() => startReset(u.email)}>Reset</Button>
            </div>
            {resetTarget === u.email && (
              <>
                {!storedPass && <Alert>No stored password for this account. Ask the user to reset via their profile.</Alert>}
                {storedPass && (
                  <div className="user-row__reset">
                    <Input type="password" placeholder="New password (min 6)" value={resetPass} onChange={e => setResetPass(e.target.value)} minLength={6} autoComplete="new-password"/>
                    <Button size="sm" disabled={resetBusy || resetPass.length < 6} onClick={() => handleResetPassword(u.email, storedPass)}>{resetBusy ? '…' : 'Save'}</Button>
                    <Button size="sm" variant="ghost" onClick={() => setResetTarget(null)}>Cancel</Button>
                  </div>
                )}
                {resetErr && <Alert>{resetErr}</Alert>}
              </>
            )}
            {/* shown after the form has closed — the original set this message inside the form it had just closed, so it never appeared */}
            {resetOk && resetOkFor === u.email && resetTarget !== u.email && <Alert tone="ok">{resetOk}</Alert>}
          </div>
        )}
      </li>
    )
  }

  return (
    <Section alt tight id="user-management">
      <Reveal><SectionHeader num="USERS" eyebrow="Management Only" eyebrowTone="gold" title="Officer Accounts"/></Reveal>

      <div className="admin-tools">
        <div className="admin-tools__row">
          <SearchInput placeholder="Search officers…" value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}/>
          <Button size="sm" variant={createOpen ? 'ghost' : 'primary'} icon={createOpen ? X : Plus} onClick={() => setCreateOpen(o => !o)}>
            {createOpen ? 'Close' : 'New Account'}
          </Button>
        </div>
        <div className="filters">
          {ROLE_FILTERS.filter(([id]) => id === 'all' || counts[id] > 0 || roleFilter === id).map(([id, label]) => (
            <button key={id} type="button" className={roleFilter === id ? 'is-on' : ''} onClick={() => { setRoleFilter(id); setPage(0) }}>
              {label}<em>{counts[id]}</em>
            </button>
          ))}
        </div>
      </div>

      {createOpen && (
        <div className="admin-create">
          <Panel title="Create Officer Account">
            <FormStack onSubmit={handleCreateUser} autoComplete="off">
              <div className="field-row" style={{ '--cols': 2 }}>
                <Input placeholder="Display name (e.g. Sgt. Rex Davis)" value={nuName} onChange={e => setNuName(e.target.value)} required autoComplete="off"/>
                <Input type="email" placeholder="Email address" value={nuEmail} onChange={e => setNuEmail(e.target.value)} required autoComplete="off"/>
                <Input type="password" placeholder="Password (min 6 chars)" value={nuPass} onChange={e => setNuPass(e.target.value)} required minLength={6} autoComplete="new-password"/>
                <Select value={nuRole} onChange={e => setNuRole(e.target.value)}>
                  {USER_ROLES.map(r => <option key={r.value} value={r.value}>Role: {r.label}</option>)}
                </Select>
              </div>
              {nuErr && <Alert>{nuErr}</Alert>}
              {nuOk  && <Alert tone="ok">{nuOk}</Alert>}
              <div><Button type="submit" icon={Plus} disabled={nuBusy}>{nuBusy ? 'Creating…' : 'Create Account'}</Button></div>
            </FormStack>
          </Panel>
        </div>
      )}

      <Panel title="Registered Officers" meta={`(${filtered.length}${filtered.length !== items.length ? ' of ' + items.length : ''})`} body={false}>
        {shown.length === 0
          ? <Empty>No officers match.</Empty>
          : <ul className="officers">{shown.map(row)}</ul>}
      </Panel>
      <Paginator page={pg} totalPages={totalPages} onChange={setPage}/>
    </Section>
  )
}

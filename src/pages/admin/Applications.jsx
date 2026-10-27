import { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore'
import { ArrowLeftRight, Plus, RefreshCw, Trash2, Unlink } from 'lucide-react'
import { db } from '../../firebase'
import { isManagementUser, secondaryAuth } from '../../lib/auth'
import { getAppStatus } from '../../lib/applications'
import { ACTIVE_STAGES, APP_PER_PAGE, STATUS_PIPELINE, TERMINAL_STAGES } from '../../data/applications'
import { USER_ROLES } from '../../data/recruitment'
import {
  Alert, ApplicationCard, Button, Chip, ChipGroup, Empty, Field, FormStack, Input, Modal, Paginator, Reveal, SearchInput, Section, SectionHeader, Select,
} from '../../components'

const pad2 = n => String(n).padStart(2, '0')
const stageOf = id => STATUS_PIPELINE.find(s => s.id === id) || STATUS_PIPELINE[0]

// Suggest an email like "firstlast@sapr.gg" from the applicant name
const suggestEmail = name => {
  if (!name) return ''
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '')
  return slug ? `${slug}@sapr.gg` : ''
}

// The open application: pipeline stage, linked account, the answers, delete.
// Mounted per application (keyed), so the account-link form starts fresh each time one is opened.
function ApplicationDetail({ app, user, userList, onStatus, onDelete, onClose }) {
  const [linkMode,     setLinkMode]     = useState(null)        // 'create' | 'existing' | null
  const [linkEmail,    setLinkEmail]    = useState('')
  const [linkPass,     setLinkPass]     = useState('')
  const [linkExisting, setLinkExisting] = useState('')
  const [linkRole,     setLinkRole]     = useState('user')      // user | ranger | management | blocked
  const [linkBusy,     setLinkBusy]     = useState(false)
  const [linkErr,      setLinkErr]      = useState('')
  const [linkOk,       setLinkOk]       = useState('')

  const statusId = getAppStatus(app)

  // Write the cross-reference between a user doc and an application
  const writeLink = async (userDocId, userEmail, roleToSet) => {
    await setDoc(doc(db, 'sapr_users', userDocId), {
      role: roleToSet || 'user',
      applicationId: app.id,
      linkedAt: serverTimestamp(),
    }, { merge: true })
    await setDoc(doc(db, 'sapr_applications', app.id), {
      linkedUid: userDocId,
      linkedEmail: userEmail,
      linkedAt: serverTimestamp(),
      linkedBy: user.email,
    }, { merge: true })
  }

  const createAndLinkAccount = async () => {
    setLinkErr(''); setLinkOk('')
    const email = linkEmail.trim().toLowerCase()
    const pass  = linkPass.trim()
    if (!email || !pass) { setLinkErr('Email and password are required.'); return }
    if (pass.length < 6) { setLinkErr('Password must be at least 6 characters.'); return }
    setLinkBusy(true)
    try {
      try {
        await createUserWithEmailAndPassword(secondaryAuth, email, pass)
        await signOut(secondaryAuth)
      } catch (authErr) {
        if (authErr.code === 'auth/weak-password')       { setLinkErr('Password must be at least 6 characters.'); setLinkBusy(false); return }
        if (authErr.code !== 'auth/email-already-in-use') { setLinkErr(authErr.message || 'Auth error.'); setLinkBusy(false); return }
      }
      const docId = email.replace(/[@.]/g, '_')
      await setDoc(doc(db, 'sapr_users', docId), {
        email,
        displayName: app.name,
        createdAt:   serverTimestamp(),
      }, { merge: true })
      await setDoc(doc(db, 'sapr_user_secrets', docId), { password: pass }, { merge: true })
      await writeLink(docId, email, linkRole)
      setLinkOk(`Account created and linked — ${email}`)
      setLinkMode(null); setLinkEmail(''); setLinkPass('')
    } catch (err) {
      setLinkErr(err.message || 'Failed to create.')
    } finally { setLinkBusy(false) }
  }

  const linkExistingAccount = async () => {
    if (!linkExisting) return
    setLinkErr(''); setLinkOk('')
    setLinkBusy(true)
    try {
      const target = userList.find(u => u.id === linkExisting)
      if (!target) { setLinkErr('User not found.'); setLinkBusy(false); return }
      await writeLink(target.id, target.email, linkRole)
      setLinkOk(`Linked to ${target.email}`)
      setLinkMode(null); setLinkExisting('')
    } catch (err) {
      setLinkErr(err.message || 'Failed to link.')
    } finally { setLinkBusy(false) }
  }

  const unlinkAccount = async () => {
    if (!app.linkedUid) return
    setLinkErr(''); setLinkOk('')
    setLinkBusy(true)
    try {
      await setDoc(doc(db, 'sapr_users', app.linkedUid), {
        applicationId: null,
      }, { merge: true })
      await setDoc(doc(db, 'sapr_applications', app.id), {
        linkedUid:   null,
        linkedEmail: null,
      }, { merge: true })
      setLinkOk('Unlinked.')
    } catch (err) {
      setLinkErr(err.message || 'Failed to unlink.')
    } finally { setLinkBusy(false) }
  }

  const roleSelect = (
    <Select value={linkRole} onChange={e => setLinkRole(e.target.value)}>
      {USER_ROLES.map(r => <option key={r.value} value={r.value}>Role: {r.label}</option>)}
    </Select>
  )

  return (
    <div className="app-detail">
      <div>
        <div className="t-label" style={{ marginBottom: 10 }}>Pipeline</div>
        <div className="stack">
          <ChipGroup>
            {ACTIVE_STAGES.map((s, i) => <Chip key={s.id} num={pad2(i + 1)} active={s.id === statusId} onClick={() => onStatus(app.id, s.id)}>{s.label}</Chip>)}
          </ChipGroup>
          <ChipGroup>
            {TERMINAL_STAGES.map(s => <Chip key={s.id} active={s.id === statusId} onClick={() => onStatus(app.id, s.id)}>{s.label}</Chip>)}
          </ChipGroup>
        </div>
      </div>

      <div className="app-detail__row">
        <div className="t-label">Account</div>
        {app.linkedUid ? (
          <div className="stack">
            <div className="app-detail__linked">
              <div>
                <b>{app.linkedEmail || app.linkedUid}</b>
                <span className="t-small">Linked account · edit role in Users panel</span>
              </div>
              <Button size="sm" variant="danger" icon={Unlink} disabled={linkBusy} onClick={unlinkAccount}>Unlink</Button>
            </div>
            {linkErr && <Alert>{linkErr}</Alert>}
            {linkOk  && <Alert tone="ok">{linkOk}</Alert>}
          </div>
        ) : (
          <div className="stack">
            {linkMode === null && (
              <ChipGroup>
                <Chip onClick={() => { setLinkMode('create'); setLinkEmail(suggestEmail(app.name)); setLinkErr(''); setLinkOk('') }}><Plus size={12}/>Create New Account</Chip>
                <Chip onClick={() => { setLinkMode('existing'); setLinkErr(''); setLinkOk('') }}><ArrowLeftRight size={12}/>Link Existing Account</Chip>
              </ChipGroup>
            )}
            {linkMode === 'create' && (
              <FormStack onSubmit={createAndLinkAccount} autoComplete="off">
                <Input type="email" placeholder="email@sapr.gg" value={linkEmail} onChange={e => setLinkEmail(e.target.value)} autoComplete="off"/>
                <Input type="text" placeholder="Password (min 6)" value={linkPass} onChange={e => setLinkPass(e.target.value)} autoComplete="off"/>
                {roleSelect}
                <div className="stack" style={{ flexDirection: 'row' }}>
                  <Button type="submit" size="sm" disabled={linkBusy}>{linkBusy ? 'Creating…' : 'Create & Link'}</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setLinkMode(null)}>Cancel</Button>
                </div>
                {linkErr && <Alert>{linkErr}</Alert>}
              </FormStack>
            )}
            {linkMode === 'existing' && (
              <FormStack onSubmit={linkExistingAccount}>
                <Select value={linkExisting} onChange={e => setLinkExisting(e.target.value)}>
                  <option value="">— Select existing account —</option>
                  {userList.map(u => <option key={u.id} value={u.id}>{u.displayName || u.email} · {u.email}</option>)}
                </Select>
                {roleSelect}
                <div className="stack" style={{ flexDirection: 'row' }}>
                  <Button type="submit" size="sm" disabled={linkBusy || !linkExisting}>{linkBusy ? 'Linking…' : 'Link'}</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setLinkMode(null)}>Cancel</Button>
                </div>
                {linkErr && <Alert>{linkErr}</Alert>}
              </FormStack>
            )}
            {linkOk && <Alert tone="ok">{linkOk}</Alert>}
          </div>
        )}
      </div>

      {[
        { q: 'Current Department',            a: app.department },
        { q: 'Current Rank / Callsign',       a: app.rank || '—' },
        { q: 'Availability',                  a: app.availability || '—' },
        { q: 'Discord Tag',                   a: app.discord || '—' },
        { q: 'Why do you want to join SAPR?', a: app.why },
      ].map(({ q, a }) => (
        <div key={q} className="app-detail__row"><div className="t-label">{q}</div><div>{a}</div></div>
      ))}

      <div className="app-detail__actions">
        <Button variant="danger" size="sm" icon={Trash2} onClick={() => onDelete(app.id)}>Delete Application</Button>
        <Button size="sm" onClick={onClose}>Done</Button>
      </div>
    </div>
  )
}

// Recruitment Applications (management only): search, pipeline filters with counts, a paged list, and a detail view.
export function Applications({ user, role }) {
  const [apps,        setApps]        = useState([])
  const [userList,    setUserList]    = useState([])
  const [filter,      setFilter]      = useState('all')
  const [search,      setSearch]      = useState('')
  const [appPage,     setAppPage]     = useState(0)
  const [selectedApp, setSelectedApp] = useState(null)
  const [backfillBusy, setBackfillBusy] = useState(false)
  const [backfillMsg,  setBackfillMsg]  = useState('')

  const mgmt = isManagementUser(user, role)

  useEffect(() => {
    if (!mgmt) return
    const q = query(collection(db, 'sapr_applications'), orderBy('submittedAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setApps(list)
      // Keep the open detail in sync with live data
      setSelectedApp(prev => prev ? (list.find(a => a.id === prev.id) || null) : null)
    })
    return unsub
  }, [mgmt])

  useEffect(() => {
    if (!mgmt) return
    const unsub = onSnapshot(collection(db, 'sapr_users'), snap => {
      setUserList(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(u => u.email))
    })
    return unsub
  }, [mgmt])

  if (!mgmt) return null

  const setStatus = async (appId, statusId) => {
    await setDoc(doc(db, 'sapr_applications', appId), {
      status: statusId,
      tags: [statusId],
      statusUpdatedAt: serverTimestamp(),
      statusUpdatedBy: user.email,
    }, { merge: true })

    // Auto-sync the linked user's role based on pipeline stage.
    // Only touches linked accounts; unlinked apps just update status.
    const app = apps.find(a => a.id === appId)
    if (!app?.linkedUid) return

    let derivedRole = null
    if (statusId === 'ranger')   derivedRole = 'ranger'
    if (statusId === 'rejected') derivedRole = 'blocked'
    if (!derivedRole) return     // intermediate stages leave role unchanged

    await setDoc(doc(db, 'sapr_users', app.linkedUid), {
      role: derivedRole,
      roleUpdatedAt: serverTimestamp(),
      roleUpdatedBy: user.email,
      roleReason:    `auto-synced from pipeline: ${statusId}`,
    }, { merge: true })
  }

  const deleteApp = async id => {
    await deleteDoc(doc(db, 'sapr_applications', id))
    setSelectedApp(null)
  }

  // Backfill: promote every app at status=ranger to role=ranger on its linked user
  const backfillRangers = async () => {
    if (backfillBusy) return
    const targets = apps.filter(a => getAppStatus(a) === 'ranger' && a.linkedUid)
    if (targets.length === 0) { setBackfillMsg('No linked ranger apps to backfill.'); return }
    if (!window.confirm(`Promote ${targets.length} linked applicant(s) to role=ranger?`)) return
    setBackfillBusy(true); setBackfillMsg('')
    let ok = 0, fail = 0
    for (const app of targets) {
      try {
        await setDoc(doc(db, 'sapr_users', app.linkedUid), {
          role: 'ranger',
          roleUpdatedAt: serverTimestamp(),
          roleUpdatedBy: user.email,
          roleReason:    'backfill from pipeline status=ranger',
        }, { merge: true })
        ok++
      } catch { fail++ }
    }
    setBackfillBusy(false)
    setBackfillMsg(`Backfill complete — ${ok} promoted${fail ? `, ${fail} failed` : ''}.`)
  }

  const statusFiltered = filter === 'all' ? apps : apps.filter(a => getAppStatus(a) === filter)
  const counts = Object.fromEntries([
    ['all', apps.length],
    ...STATUS_PIPELINE.map(s => [s.id, apps.filter(a => getAppStatus(a) === s.id).length]),
  ])
  const q = search.trim().toLowerCase()
  const filtered = q ? statusFiltered.filter(a =>
    [a.name, a.citizenId, a.department, a.rank, a.discord, a.why, a.availability]
      .some(v => v?.toLowerCase().includes(q))
  ) : statusFiltered
  const totalPages = Math.ceil(filtered.length / APP_PER_PAGE)
  const page = Math.min(appPage, Math.max(totalPages - 1, 0))
  const pagedApps = filtered.slice(page * APP_PER_PAGE, (page + 1) * APP_PER_PAGE)

  const pickFilter = f => { setFilter(f); setAppPage(0) }

  return (
    <Section alt tight id="applications">
      <Reveal><SectionHeader num="APPS" eyebrow="Management Only" eyebrowTone="gold" title="Recruitment Applications"/></Reveal>

      <div className="admin-tools">
        <div className="admin-tools__row">
          <SearchInput placeholder="Search applications…" value={search} onChange={e => { setSearch(e.target.value); setAppPage(0) }}/>
          <Button size="sm" variant="ghost" icon={RefreshCw} onClick={backfillRangers} disabled={backfillBusy}
            title="Promote every linked applicant at status=ranger to role=ranger">{backfillBusy ? 'Backfilling…' : 'Backfill Rangers'}</Button>
        </div>
        <div className="filters">
          <button type="button" className={filter === 'all' ? 'is-on' : ''} onClick={() => pickFilter('all')}>All <em>{counts.all}</em></button>
          {STATUS_PIPELINE.map(s => (
            <button key={s.id} type="button" className={filter === s.id ? 'is-on' : ''} onClick={() => pickFilter(s.id)}>
              {s.label}{counts[s.id] > 0 && <em>{counts[s.id]}</em>}
            </button>
          ))}
        </div>
        {backfillMsg && <span className="t-label" style={{ color: 'var(--forest)' }}>{backfillMsg}</span>}
      </div>

      {filtered.length === 0 ? (
        <Empty>No applications{filter !== 'all' ? ` at stage "${stageOf(filter).label}"` : ''} yet.</Empty>
      ) : (
        <>
          <div className="app-list">
            {pagedApps.map((app, i) => {
              const statusId = getAppStatus(app)
              const st = stageOf(statusId)
              return (
                <Reveal key={app.id} delay={Math.min(i * 0.05, 0.35)}>
                  <ApplicationCard name={app.name} citizenId={app.citizenId} department={app.department} rank={app.rank}
                    tags={[{ label: st.label, tone: st.tone }]} muted={statusId === 'ranger' || statusId === 'rejected'} linked={!!app.linkedUid}
                    why={app.why} availability={app.availability} discord={app.discord} onClick={() => setSelectedApp(app)}/>
                </Reveal>
              )
            })}
          </div>
          <Paginator page={page} totalPages={totalPages} onChange={setAppPage}/>
        </>
      )}

      {selectedApp && (
        <Modal open onClose={() => setSelectedApp(null)} width={640} title={selectedApp.name}
          sub={`CID: ${selectedApp.citizenId} · ${selectedApp.department}${selectedApp.rank ? ` · ${selectedApp.rank}` : ''}`}>
          <ApplicationDetail key={selectedApp.id} app={selectedApp} user={user} userList={userList}
            onStatus={setStatus} onDelete={deleteApp} onClose={() => setSelectedApp(null)}/>
        </Modal>
      )}
    </Section>
  )
}

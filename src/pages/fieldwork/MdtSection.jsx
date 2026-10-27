import { useMemo, useState } from 'react'
import { signOut } from 'firebase/auth'
import { addDoc, collection, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { FileText, Lock, LogIn, LogOut, Plus, TriangleAlert } from 'lucide-react'
import { auth, db } from '../../firebase'
import logoLockup from '../../assets/Ci37hio.png'
import { MANAGEMENT_EMAIL, getDisplayName } from '../../lib/auth'
import { fmtDate, getISTDate } from '../../lib/dates'
import { useMdtEntries } from '../../lib/mdt'
import { mdtToasts } from '../../lib/mdtToasts'
import {
  AdminBar, Alert, Button, Chip, ChipGroup, Empty, Field, FieldRow, FormStack, Input, MdtEntry, MdtPhone, Paginator, Panel, Reveal, Section,
  SectionHeader, Segmented, Split, Textarea,
} from '../../components'

const MDT_PER_PAGE = 10
const TYPE_FILTERS = [{ value: 'all', label: 'All' }, { value: 'mdt', label: 'MDT' }, { value: 'warning', label: 'Warnings', tone: 'warn' }]

// MDT & Warning Log. Anyone can read it; signed-in officers log entries and delete their own (management delete any).
export function MdtSection({ user, userMap, onLogin }) {
  const entries = useMdtEntries()
  const [filterOfficer, setFilterOfficer] = useState('all')
  const [typeFilter,    setTypeFilter]    = useState('all')
  const [mdtPage,       setMdtPage]       = useState(0)
  const [busy,          setBusy]          = useState(false)

  // new-entry form
  const [fType,      setFType]      = useState('mdt')   // 'mdt' | 'warning'
  const [fCitizenId, setFCitizenId] = useState('')
  const [fNotes,     setFNotes]     = useState('')
  const [fDate,      setFDate]      = useState(getISTDate)

  const handleAdd = async () => {
    if (!fCitizenId.trim()) return
    setBusy(true)
    try {
      await addDoc(collection(db, 'sapr_mdt'), {
        type:           fType,                       // 'mdt' | 'warning'
        citizenId:      fCitizenId.trim(),
        notes:          fNotes.trim(),
        submittedBy:    getDisplayName(user.email, userMap),
        submitterEmail: user.email,
        date:           fDate,
        createdAt:      serverTimestamp(),
      })
      setFCitizenId(''); setFNotes(''); setFDate(getISTDate()); setFType('mdt')
    } finally { setBusy(false) }
  }

  const handleDelete = id => deleteDoc(doc(db, 'sapr_mdt', id))
  const canDelete = entry => user && (MANAGEMENT_EMAIL.includes(user.email) || user.email === entry.submitterEmail)

  // The phone drops a notification every few seconds — made from the most recent real entries, not sample text.
  const toasts = useMemo(() => mdtToasts(entries), [entries])

  const officers = ['all', ...new Set(entries.map(e => e.submittedBy || 'Unknown'))]
  const byOfficer = filterOfficer === 'all' ? entries : entries.filter(e => (e.submittedBy || 'Unknown') === filterOfficer)
  // Entries written before types existed have no `type` and read as MDTs.
  const visible = typeFilter === 'all' ? byOfficer : byOfficer.filter(e => (typeFilter === 'warning') === (e.type === 'warning'))
  const totalPages = Math.ceil(visible.length / MDT_PER_PAGE)
  const page = Math.min(mdtPage, Math.max(totalPages - 1, 0))
  const paged = visible.slice(page * MDT_PER_PAGE, (page + 1) * MDT_PER_PAGE)

  const loginBtn = !user && <Button size="sm" variant="ghost" icon={Lock} onClick={onLogin}>Officer Login</Button>

  return (
    <Section id="mdt" alt>
      <Reveal>
        <SectionHeader num="MDT" eyebrow="Mobile Data Terminal" title="MDT & Warning Log"
          sub="Record of MDTs filed and warnings issued to citizens — linked by Citizen ID" aside={loginBtn}/>
      </Reveal>

      {user && (
        <AdminBar name={getDisplayName(user.email, userMap)} email={user.email}>
          <Button size="sm" variant="ghost" icon={LogOut} onClick={() => signOut(auth)}>Sign Out</Button>
        </AdminBar>
      )}

      {entries.length > 0 && (
        <div className="filter-bar">
          <span className="t-label">Filter by officer</span>
          <ChipGroup>
            {officers.map(o => (
              <Chip key={o} active={filterOfficer === o} onClick={() => { setFilterOfficer(o); setMdtPage(0) }}>{o === 'all' ? 'All Officers' : o}</Chip>
            ))}
          </ChipGroup>
          {filterOfficer !== 'all' && <span className="t-label" style={{ color: 'var(--forest)' }}>{byOfficer.length} entr{byOfficer.length !== 1 ? 'ies' : 'y'}</span>}
        </div>
      )}

      <Split variant="even">
        <Reveal>
          {user ? (
            <Panel title="Log New Entry">
              <FormStack onSubmit={handleAdd}>
                <Segmented value={fType} onChange={setFType} options={[
                  { value: 'mdt', label: 'MDT Made', icon: FileText },
                  { value: 'warning', label: 'Warning Given', icon: TriangleAlert, tone: 'warn' },
                ]}/>
                <FieldRow>
                  <Field label="Citizen ID" required><Input mono placeholder="Citizen ID (e.g. 10942)" value={fCitizenId} onChange={e => setFCitizenId(e.target.value)} required/></Field>
                  <Field label="Date" required><Input type="date" value={fDate} onChange={e => setFDate(e.target.value)} required/></Field>
                </FieldRow>
                <Field label="Notes"><Textarea rows={2} placeholder="Notes / details (optional)" value={fNotes} onChange={e => setFNotes(e.target.value)}/></Field>
                <div><Button type="submit" icon={Plus} disabled={busy}>{busy ? 'Logging…' : `Log ${fType === 'mdt' ? 'MDT' : 'Warning'}`}</Button></div>
              </FormStack>
            </Panel>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Alert tone="info" icon={Lock}>Sign in to log or remove MDT entries.</Alert>
              <div><Button icon={LogIn} onClick={onLogin}>Officer Login</Button></div>
            </div>
          )}
        </Reveal>

        <Reveal delay={0.1}>
          <MdtPhone logo={logoLockup} eyebrow="Mobile Data Terminal" title="MDT & Warning Log" foot="Linked by Citizen ID" toasts={toasts} toastEvery={9000}>
            <Segmented value={typeFilter} onChange={v => { setTypeFilter(v); setMdtPage(0) }} options={TYPE_FILTERS}/>
            {paged.length ? paged.map((m, i) => (
              <MdtEntry key={m.id + typeFilter} type={m.type} citizenId={m.citizenId || m.mdtNumber} officer={m.submittedBy} date={fmtDate(m.date)} notes={m.notes}
                style={{ animationDelay: Math.min(i * 0.05, 0.4) + 's' }}
                onDelete={canDelete(m) ? () => handleDelete(m.id) : undefined}/>
            )) : <div style={{ padding: 16 }}><Empty>{entries.length === 0 ? 'No MDT entries logged yet.' : 'No entries match.'}</Empty></div>}
          </MdtPhone>
          <Paginator page={page} totalPages={totalPages} onChange={setMdtPage}/>
        </Reveal>
      </Split>
    </Section>
  )
}

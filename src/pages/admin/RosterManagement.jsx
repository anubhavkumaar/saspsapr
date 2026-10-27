import { useEffect, useRef, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore'
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Plus, Settings2, X } from 'lucide-react'
import { db } from '../../firebase'
import { isManagementUser } from '../../lib/auth'
import { ROSTER_CERTS, ROSTER_RANKS, ROSTER_SECTION_DEFAULT, ROSTER_STATUSES, rosterBadge, rosterCerts, rosterRank } from '../../lib/roster'
import {
  Alert, Button, Chip, ChipGroup, DataTable, Field, FieldRow, Icon, Input, Panel, Reveal, Section, SectionHeader, Select, Textarea,
} from '../../components'

const MANAGE = '__sections__'   // the picker's Sections button; stands in for a section name

const COLS = ['Badge #', 'Name', 'Rank', 'CID', 'Certifications', 'Title', 'Photo URL', 'Phone', 'Status', 'Joined', 'Promoted', 'Notes', 'Section', 'Slot']

// Extra record fields behind the "…" toggle: label, placeholder. Lists are comma-separated text stored as arrays.
const DETAIL_FIELDS = [
  ['dob',        'Date of birth', 'YYYY-MM-DD'],
  ['tags',       'Tags',          'DAVIS, MummyLover, Game Warden'],
  ['licenses',   'Licences',      'Car, Bike, Weapon, Hunting, Fishing'],
  ['vehicles',   'Vehicles',      'Plates, comma separated'],
  ['properties', 'Properties',    '[102] Marlowe Dr'],
]

// A comma-separated list stored as an array. While the box has focus it shows exactly what is typed (so a comma can be
// typed); the stored array is updated on every keystroke, and on blur the box goes back to the tidy joined form.
function ListInput({ value, onChange, onBlur, ...rest }) {
  const [draft, setDraft] = useState(null)   // null = not being edited
  const joined = Array.isArray(value) ? value.join(', ') : (value || '')
  return (
    <Input {...rest} value={draft ?? joined}
      onChange={e => { setDraft(e.target.value); onChange(e.target.value.split(',').map(x => x.trim()).filter(Boolean)) }}
      onBlur={e => { setDraft(null); if (onBlur) onBlur(e) }}/>
  )
}

// Manage Roster: reorder / add / delete sections, and edit every roster cell in place. Text cells save when they lose
// focus; selects, certification toggles and the slot toggle save the moment they change. Same Firestore writes as before.
export function RosterManagement({ user, role }) {
  const [members,    setMembers]    = useState([])
  const [sections,   setSections]   = useState(ROSTER_SECTION_DEFAULT)
  const [rows,       setRows]       = useState({})
  const [saving,     setSaving]     = useState(new Set())
  const [err,        setErr]        = useState('')
  const [newSection, setNewSection] = useState('')
  const [bioOpen,    setBioOpen]    = useState(() => new Set())
  const [secBusy,    setSecBusy]    = useState(false)
  const [pick,       setPick]       = useState('')          // the section on show, or MANAGE
  const rowDataRef = useRef({})   // the edited copy of each member — written synchronously so a save right after an edit sees it
  const editingId  = useRef(null)

  useEffect(() => {
    const unsubM = onSnapshot(
      query(collection(db, 'sapr_roster'), orderBy('order', 'asc')),
      snap => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setMembers(docs)
        // The row being typed in keeps its edits; everything else follows the live data.
        const edited = rowDataRef.current
        const next = {}
        docs.forEach(m => {
          next[m.id] = editingId.current === m.id ? (edited[m.id] || { ...m }) : { ...m }
        })
        rowDataRef.current = next
        setRows({ ...next })
      }
    )
    const unsubS = onSnapshot(doc(db, 'sapr_config', 'roster'), snap => {
      if (snap.exists() && Array.isArray(snap.data().sections))
        setSections(snap.data().sections)
    })
    return () => { unsubM(); unsubS() }
  }, [])

  if (!isManagementUser(user, role)) return null

  /* ── section helpers ── */
  const writeSections = async next => {
    setSecBusy(true)
    try   { await setDoc(doc(db, 'sapr_config', 'roster'), { sections: next }, { merge: true }) }
    catch (e) { setErr(e.message || 'Failed to save sections.') }
    finally   { setSecBusy(false) }
  }

  const addSection = async () => {
    const name = newSection.trim()
    if (!name) return
    if (sections.includes(name)) { setErr(`Section "${name}" already exists.`); return }
    await writeSections([...sections, name])
    setNewSection('')
  }

  const deleteSection = async name => {
    if (members.some(m => m.section === name)) {
      setErr(`Move all officers out of "${name}" before deleting it.`)
      return
    }
    if (!window.confirm(`Delete section "${name}"?`)) return
    await writeSections(sections.filter(s => s !== name))
  }

  const moveSection = async (idx, dir) => {
    const next = [...sections]
    const swap = dir === 'up' ? idx - 1 : idx + 1
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    await writeSections(next)
  }

  /* ── row helpers ── */
  const updateField = (id, field, value) => {
    const updated = { ...(rowDataRef.current[id] || {}), [field]: value }
    rowDataRef.current[id] = updated
    setRows(prev => ({ ...prev, [id]: updated }))
  }

  const saveRow = async id => {
    const data = rowDataRef.current[id]
    if (!data) return
    const { id: _id, ...fields } = data
    setSaving(prev => new Set(prev).add(id))
    try   { await setDoc(doc(db, 'sapr_roster', id), fields) }
    catch (e) { setErr(e.message || 'Save failed.') }
    finally   { setSaving(prev => { const s = new Set(prev); s.delete(id); return s }) }
  }

  const toggleBio = id => setBioOpen(prev => {
    const s = new Set(prev)
    if (s.has(id)) s.delete(id); else s.add(id)
    return s
  })

  const handleFocus  = id => { editingId.current = id }
  const handleBlur   = id => { editingId.current = null; saveRow(id) }
  const handleSelect = (id, field, value) => { updateField(id, field, value); saveRow(id) }

  // Keeps certs stored in ROSTER_CERTS order so the public chips read consistently.
  const toggleCert = (id, cert) => {
    const current = rosterCerts(rowDataRef.current[id] || {})
    const next    = current.includes(cert)
      ? current.filter(c => c !== cert)
      : ROSTER_CERTS.filter(c => c === cert || current.includes(c))
    handleSelect(id, 'certs', next)
  }

  const addRow = async section => {
    try {
      await addDoc(collection(db, 'sapr_roster'), {
        section, badge: '', cid: '', name: 'New Ranger',
        rank: 'Ranger', certs: [], title: '', phone: '', notes: '', photo: '', bio: '',
        dob: '', tags: [], licenses: [], vehicles: [], properties: [],
        status: 'Active', joinDate: '', promoDate: '',
        vacant: false, order: Date.now(),
      })
    } catch (e) { setErr(e.message || 'Add failed.') }
  }

  const deleteRow = async id => {
    const name = rowDataRef.current[id]?.name || '?'
    if (!window.confirm(`Remove ${name} from the roster?`)) return
    try   { await deleteDoc(doc(db, 'sapr_roster', id)) }
    catch (e) { setErr(e.message || 'Delete failed.') }
  }

  const moveRow = async (id, dir) => {
    const sectionName = rowDataRef.current[id]?.section
    const sec  = members.filter(m => m.section === sectionName).sort((a, b) => (a.order || 0) - (b.order || 0))
    const idx  = sec.findIndex(m => m.id === id)
    const swap = dir === 'up' ? idx - 1 : idx + 1
    if (swap < 0 || swap >= sec.length) return
    try {
      await Promise.all([
        setDoc(doc(db, 'sapr_roster', sec[idx].id),  { order: sec[swap].order ?? 0 }, { merge: true }),
        setDoc(doc(db, 'sapr_roster', sec[swap].id), { order: sec[idx].order  ?? 0 }, { merge: true }),
      ])
    } catch (e) { setErr(e.message || 'Reorder failed.') }
  }

  const grouped = sections.map(name => ({
    name,
    members: members.filter(m => m.section === name).sort((a, b) => (a.order || 0) - (b.order || 0)),
  }))

  /* ── cells ── */
  const rowOf = m => rows[m.id] || m
  const text = (field, { mono = false, type, placeholder, read = r => r[field] || '' } = {}) => (_, m) => (
    <Input mono={mono} type={type} placeholder={typeof placeholder === 'function' ? placeholder(rowOf(m)) : placeholder} value={read(rowOf(m))}
      onChange={e => updateField(m.id, field, e.target.value)} onFocus={() => handleFocus(m.id)} onBlur={() => handleBlur(m.id)} disabled={saving.has(m.id)}/>
  )

  const columnsFor = section => [
    { key: 'ctrl', label: '', render: (_, m) => {
      const idx = section.members.findIndex(x => x.id === m.id)
      const sav = saving.has(m.id)
      return (
        <span className="roster-edit__ctl">
          <Button size="sm" variant="ghost" icon={ArrowUp} aria-label="Move up" title="Move up" disabled={idx === 0 || sav} onClick={() => moveRow(m.id, 'up')}/>
          <Button size="sm" variant="ghost" icon={ArrowDown} aria-label="Move down" title="Move down" disabled={idx === section.members.length - 1 || sav} onClick={() => moveRow(m.id, 'down')}/>
        </span>
      )
    } },
    { key: 'badge',   label: COLS[0],  render: text('badge', { mono: true, read: rosterBadge }) },
    { key: 'name',    label: COLS[1],  render: text('name', { placeholder: r => (r.vacant ? 'Unassigned' : '') }) },
    { key: 'rank',    label: COLS[2],  render: (_, m) => (
      <Select value={rosterRank(rowOf(m)) || 'Ranger'} onChange={e => handleSelect(m.id, 'rank', e.target.value)} disabled={saving.has(m.id)}>
        {ROSTER_RANKS.map(r => <option key={r}>{r}</option>)}
      </Select>
    ) },
    { key: 'cid',     label: COLS[3],  render: text('cid', { mono: true }) },
    { key: 'certs',   label: COLS[4],  render: (_, m) => (
      <ChipGroup>{ROSTER_CERTS.map(c => <Chip key={c} active={rosterCerts(rowOf(m)).includes(c)} onClick={() => !saving.has(m.id) && toggleCert(m.id, c)}>{c}</Chip>)}</ChipGroup>
    ) },
    { key: 'title',   label: COLS[5],  render: text('title') },
    { key: 'photo',   label: COLS[6],  render: text('photo', { placeholder: 'https://…' }) },
    { key: 'phone',   label: COLS[7],  render: text('phone', { mono: true }) },
    { key: 'status',  label: COLS[8],  render: (_, m) => (
      <Select value={rowOf(m).status || 'Active'} onChange={e => handleSelect(m.id, 'status', e.target.value)} disabled={saving.has(m.id)}>
        {ROSTER_STATUSES.map(s => <option key={s}>{s}</option>)}
      </Select>
    ) },
    { key: 'joinDate',  label: COLS[9],  render: text('joinDate', { type: 'date' }) },
    { key: 'promoDate', label: COLS[10], render: text('promoDate', { type: 'date' }) },
    { key: 'notes',   label: COLS[11], render: text('notes') },
    { key: 'section', label: COLS[12], render: (_, m) => (
      <Select value={rowOf(m).section || section.name} onChange={e => handleSelect(m.id, 'section', e.target.value)} disabled={saving.has(m.id)}>
        {sections.map(s => <option key={s}>{s}</option>)}
      </Select>
    ) },
    { key: 'vacant',  label: COLS[13], render: (_, m) => {
      const vacant = !!rowOf(m).vacant
      return (
        <Button size="sm" variant={vacant ? 'danger' : 'ghost'} disabled={saving.has(m.id)} onClick={() => handleSelect(m.id, 'vacant', !vacant)}
          title={vacant ? 'Reserved badge with nobody in it' : 'Slot is filled'}>{vacant ? 'Vacant' : 'Filled'}</Button>
      )
    } },
    { key: 'end', label: '', render: (_, m) => (
      <span className="roster-edit__ctl">
        <Button size="sm" variant="ghost" icon={bioOpen.has(m.id) ? ChevronUp : ChevronDown} aria-label="Edit profile text" title="Edit profile text" disabled={saving.has(m.id)} onClick={() => toggleBio(m.id)}/>
        <Button size="sm" variant="danger" icon={X} aria-label="Remove" title="Remove" disabled={saving.has(m.id)} onClick={() => deleteRow(m.id)}/>
      </span>
    ) },
  ]

  const bioEditor = m => {
    if (!bioOpen.has(m.id)) return null
    const row = rowOf(m)
    const sav = saving.has(m.id)
    return (
      <div className="stack">
        <Field label="Profile text — shown on this ranger's personnel profile">
          <Textarea rows={4} placeholder="What they do in the department, what they are known for, what they enjoy…" value={row.bio || ''}
            onChange={e => updateField(m.id, 'bio', e.target.value)} onFocus={() => handleFocus(m.id)} onBlur={() => handleBlur(m.id)} disabled={sav}/>
        </Field>
        <FieldRow cols={5}>
          {DETAIL_FIELDS.map(([k, label, ph]) => (
            <Field key={k} label={label}>
              {k === 'dob'
                ? <Input placeholder={ph} value={row[k] || ''} onChange={e => updateField(m.id, k, e.target.value)}
                    onFocus={() => handleFocus(m.id)} onBlur={() => handleBlur(m.id)} disabled={sav}/>
                : <ListInput placeholder={ph} value={row[k]} onChange={list => updateField(m.id, k, list)}
                    onFocus={() => handleFocus(m.id)} onBlur={() => handleBlur(m.id)} disabled={sav}/>}
            </Field>
          ))}
        </FieldRow>
      </div>
    )
  }

  // One section's table on screen at a time; the Sections panel (reorder / add / delete) is its own button in the picker.
  const firstFilled = sections.find(s => members.some(m => m.section === s)) || sections[0]
  const active = pick === MANAGE ? MANAGE : (sections.includes(pick) ? pick : firstFilled)
  const activeSection = grouped.find(g => g.name === active)

  return (
    <Section tight id="roster-management">
      <Reveal><SectionHeader num="ROSTER" eyebrow="Management Only" eyebrowTone="gold" title="Manage Roster" sub="Click any cell to edit — changes save automatically on blur"/></Reveal>

      {err && (
        <Alert style={{ marginBottom: 20 }}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span>{err}</span>
            <Button size="sm" variant="text" icon={X} aria-label="Dismiss" onClick={() => setErr('')}/>
          </span>
        </Alert>
      )}

      <div className="admin-tools">
        <div className="filters">
          {grouped.map(g => (
            <button key={g.name} type="button" className={active === g.name ? 'is-on' : ''} onClick={() => setPick(g.name)}>
              {g.name}<em>{g.members.length}</em>
            </button>
          ))}
          <button type="button" className={active === MANAGE ? 'is-on' : ''} onClick={() => setPick(MANAGE)}>
            <Icon icon={Settings2} size={14}/>Sections
          </button>
        </div>
      </div>

      {active === MANAGE && (
        <Reveal>
          <div className="roster-sections">
            <Panel title="Sections" meta={`${sections.length} section${sections.length !== 1 ? 's' : ''}`} body={false}>
              {sections.map((s, idx) => (
                <div key={s} className="rsec">
                  <span className="rsec__ctl">
                    <Button size="sm" variant="ghost" icon={ArrowUp} aria-label="Move section up" disabled={idx === 0 || secBusy} onClick={() => moveSection(idx, 'up')}/>
                    <Button size="sm" variant="ghost" icon={ArrowDown} aria-label="Move section down" disabled={idx === sections.length - 1 || secBusy} onClick={() => moveSection(idx, 'down')}/>
                  </span>
                  <b>{s}</b>
                  <span className="t-label">{members.filter(m => m.section === s).length} officers</span>
                  <Button size="sm" variant="danger" icon={X} aria-label="Delete section" title="Delete section" disabled={secBusy} onClick={() => deleteSection(s)}/>
                </div>
              ))}
              <form className="rsec-add" onSubmit={e => { e.preventDefault(); addSection() }}>
                <Input placeholder="New section name…" value={newSection} onChange={e => setNewSection(e.target.value)} disabled={secBusy}/>
                <Button type="submit" size="sm" icon={Plus} disabled={secBusy || !newSection.trim()}>{secBusy ? 'Saving…' : 'Add Section'}</Button>
              </form>
            </Panel>
          </div>
        </Reveal>
      )}

      {activeSection && (
        <div className="roster-edit">
          <Reveal key={activeSection.name}>
            <Panel title={activeSection.name} meta={`${activeSection.members.length} officer${activeSection.members.length !== 1 ? 's' : ''}`} body={false}>
              {activeSection.members.length > 0 && <DataTable columns={columnsFor(activeSection)} rows={activeSection.members} rowKey="id" expand={bioEditor}/>}
              <div className="roster-edit__foot">
                <Button size="sm" variant="ghost" icon={Plus} onClick={() => addRow(activeSection.name)}>Add officer to {activeSection.name}</Button>
              </div>
            </Panel>
          </Reveal>
        </div>
      )}
    </Section>
  )
}

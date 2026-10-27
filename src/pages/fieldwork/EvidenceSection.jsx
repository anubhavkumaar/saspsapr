import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { addDoc, collection, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { Lock, LogOut, Plus, Users } from 'lucide-react'
import { auth, db } from '../../firebase'
import { MANAGEMENT_EMAIL, getDisplayName } from '../../lib/auth'
import { fmtDate, getISTDate } from '../../lib/dates'
import {
  AdminBar, Button, Chip, ChipGroup, DropZone, Empty, EvidenceCard, EvidenceGrid, FieldRow, Input, Paginator, Reveal, Section, SectionHeader,
} from '../../components'
import { Lightbox } from './Lightbox.jsx'

const IMG_PER_PAGE = 12
const TILTS = [-1.2, 0.8, -0.4, 1, -0.8, 0.5]

// 09 — Fishing Calls & Illegal Fish Evidence. Anyone can look; signed-in officers add, and delete their own
// (management delete anyone's). Same Firestore writes as before.
export function EvidenceSection({ user, userMap, images, onLogin }) {
  const [newUrl,     setNewUrl]     = useState('')
  const [newCap,     setNewCap]     = useState('')
  const [newDate,    setNewDate]    = useState(getISTDate)
  const [busy,       setBusy]       = useState(false)
  const [filterUser, setFilterUser] = useState('all')
  const [imgPage,    setImgPage]    = useState(0)
  const [lightbox,   setLightbox]   = useState(null)

  // Global paste → fill the URL field while signed in (inputs keep their own paste).
  useEffect(() => {
    if (!user) return
    const onPaste = e => {
      if (e.target.closest?.('input, textarea')) return
      const text = e.clipboardData?.getData('text/plain')?.trim()
      if (text && text.startsWith('http')) { setNewUrl(text); e.preventDefault() }
    }
    document.addEventListener('paste', onPaste)
    return () => document.removeEventListener('paste', onPaste)
  }, [user])

  const handleAdd = async e => {
    e.preventDefault()
    if (!newUrl.trim()) return
    setBusy(true)
    try {
      await addDoc(collection(db, 'fishing_evidence'), {
        url: newUrl.trim(),
        caption: newCap.trim(),
        date: newDate,
        uploadedBy: getDisplayName(user.email, userMap),
        uploaderEmail: user.email,
        createdAt: serverTimestamp(),
      })
      setNewUrl(''); setNewCap(''); setNewDate(getISTDate())
    } finally { setBusy(false) }
  }

  const handleDelete = id => deleteDoc(doc(db, 'fishing_evidence', id))
  const canDelete = img => user && (MANAGEMENT_EMAIL.includes(user.email) || user.email === img.uploaderEmail)

  const uploaders = ['all', ...new Set(images.map(img => img.uploadedBy || 'Unknown'))]
  const visible = filterUser === 'all' ? images : images.filter(img => (img.uploadedBy || 'Unknown') === filterUser)
  const totalPages = Math.ceil(visible.length / IMG_PER_PAGE)
  const page = Math.min(imgPage, Math.max(totalPages - 1, 0))
  const paged = visible.slice(page * IMG_PER_PAGE, (page + 1) * IMG_PER_PAGE)

  const loginBtn = !user && <Button size="sm" variant="ghost" icon={Lock} onClick={onLogin}>Officer Login</Button>

  return (
    <Section id="fishing-evidence">
      <Reveal>
        <SectionHeader num="09" eyebrow="Field Evidence" title="Fishing Calls & Illegal Fish Evidence"
          sub="Documented visual evidence of illegal fishing activities and violations observed in the field" aside={loginBtn}/>
      </Reveal>

      {user && (
        <>
          <AdminBar name={getDisplayName(user.email, userMap)} email={user.email}>
            {MANAGEMENT_EMAIL.includes(user.email) && <Button as={Link} to="/admin#user-management" size="sm" variant="ghost" icon={Users}>Manage Users</Button>}
            <Button size="sm" variant="ghost" icon={LogOut} onClick={() => signOut(auth)}>Sign Out</Button>
          </AdminBar>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
            <DropZone preview={newUrl} onDropUrl={setNewUrl} onClear={() => setNewUrl('')}
              onDropFile={() => alert('Please upload the image to vgy.me first, then drag or paste the link here.')}/>
            <form onSubmit={handleAdd}>
              <FieldRow cols={3}>
                <Input placeholder="Image URL — e.g. https://i.vgy.me/abc.png" value={newUrl} onChange={e => setNewUrl(e.target.value)} required/>
                <Input placeholder="Caption (optional)" value={newCap} onChange={e => setNewCap(e.target.value)}/>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} required/>
                  <Button type="submit" icon={Plus} disabled={busy}>{busy ? 'Adding…' : 'Add Evidence'}</Button>
                </div>
              </FieldRow>
            </form>
          </div>
        </>
      )}

      {images.length === 0 ? (
        <Empty>No evidence added yet. Log in as admin to upload images.</Empty>
      ) : (
        <>
          <div className="filter-bar">
            <span className="t-label">Filter by officer</span>
            <ChipGroup>
              {uploaders.map(u => (
                <Chip key={u} active={filterUser === u} onClick={() => { setFilterUser(u); setImgPage(0) }}>{u === 'all' ? 'All Officers' : u}</Chip>
              ))}
            </ChipGroup>
            {filterUser !== 'all' && <span className="t-label" style={{ color: 'var(--forest)' }}>{visible.length} image{visible.length !== 1 ? 's' : ''}</span>}
          </div>

          {visible.length === 0 ? <Empty>No evidence from this officer yet.</Empty> : (
            <EvidenceGrid>
              {paged.map((img, i) => (
                <Reveal key={img.id} delay={Math.min(i * 0.06, 0.36)}>
                  <EvidenceCard src={img.url} caption={img.caption} date={fmtDate(img.date)} uploader={img.uploadedBy || 'Unknown'}
                    tilt={TILTS[(page * IMG_PER_PAGE + i) % TILTS.length]}
                    onOpen={() => setLightbox(img)} onDelete={canDelete(img) ? () => handleDelete(img.id) : undefined}/>
                </Reveal>
              ))}
            </EvidenceGrid>
          )}
          <Paginator page={page} totalPages={totalPages} onChange={setImgPage}/>
        </>
      )}

      {lightbox && <Lightbox key={lightbox.id} item={lightbox} onClose={() => setLightbox(null)}/>}
    </Section>
  )
}

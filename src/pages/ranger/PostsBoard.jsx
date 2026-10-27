import { useEffect, useRef, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { ChevronDown, ChevronUp, Pencil, Pin, Plus, Trash2, X } from 'lucide-react'
import { db } from '../../firebase'
import { fmtPostTime, pinnedFirst } from '../../lib/posts'
import { Alert, Button, Card, CardBody, CardFoot, Empty, FormStack, Input, MediaEmbed, Paginator, Panel, Reveal, Textarea } from '../../components'

const PER_PAGE = 5

// A post's text, folded to eight lines with "Read more" — but only when it really is longer than that at the current width.
function PostBody({ text }) {
  const ref = useRef(null)
  const [open,    setOpen]    = useState(false)
  const [clipped, setClipped] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const measure = () => { if (!el.classList.contains('is-folded')) return; setClipped(el.scrollHeight > el.clientHeight + 1) }
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [text])
  return (
    <>
      <p ref={ref} className={'posts__body' + (open ? '' : ' is-folded')}>{text}</p>
      {(clipped || open) && (
        <Button size="sm" variant="text" icon={open ? ChevronUp : ChevronDown} aria-expanded={open} onClick={() => setOpen(o => !o)}>
          {open ? 'Show less' : 'Read more'}
        </Button>
      )}
    </>
  )
}

// Announcements & Orders. Everyone in the portal reads them; management also publishes, edits, pins and deletes.
// Same writes as before: addDoc with createdAt/createdBy, setDoc-merge with updatedAt/updatedBy, deleteDoc after a confirm.
export function PostsBoard({ posts, canEdit, authorEmail }) {
  const [title,    setTitle]    = useState('')
  const [body,     setBody]     = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [pinned,   setPinned]   = useState(false)
  const [busy,     setBusy]     = useState(false)
  const [err,      setErr]      = useState('')
  const [editing,  setEditing]  = useState(null)   // id of the post being edited
  const [page,     setPage]     = useState(0)

  const clear = () => { setTitle(''); setBody(''); setMediaUrl(''); setPinned(false); setEditing(null) }

  const submit = async () => {
    setErr('')
    if (!title.trim() || !body.trim()) return
    setBusy(true)
    try {
      if (editing) {
        await setDoc(doc(db, 'sapr_posts', editing), {
          title: title.trim(), body: body.trim(), mediaUrl: mediaUrl.trim(), pinned,
          updatedAt: serverTimestamp(), updatedBy: authorEmail,
        }, { merge: true })
      } else {
        await addDoc(collection(db, 'sapr_posts'), {
          title: title.trim(), body: body.trim(), mediaUrl: mediaUrl.trim(), pinned,
          createdAt: serverTimestamp(), createdBy: authorEmail,
        })
      }
      clear()
    } catch (e) { setErr(e.message || 'Failed to post.') }
    finally   { setBusy(false) }
  }

  const startEdit = p => {
    setEditing(p.id); setTitle(p.title || ''); setBody(p.body || ''); setMediaUrl(p.mediaUrl || ''); setPinned(!!p.pinned)
    document.getElementById('post-editor')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  const removePost = async id => {
    if (!window.confirm('Delete this post?')) return
    await deleteDoc(doc(db, 'sapr_posts', id))
  }

  const sorted = pinnedFirst(posts)
  const totalPages = Math.ceil(sorted.length / PER_PAGE)
  const pg = Math.min(page, Math.max(totalPages - 1, 0))
  const shown = sorted.slice(pg * PER_PAGE, (pg + 1) * PER_PAGE)

  return (
    <div className="posts">
      {canEdit && (
        <div id="post-editor">
          <Panel title={editing ? 'Edit Post' : 'New Post'}>
            <FormStack onSubmit={submit}>
              <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required/>
              <Textarea rows={4} placeholder="Body" value={body} onChange={e => setBody(e.target.value)} required/>
              <Input placeholder="Media URL (YouTube, vgy.me, image/video link — optional)" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)}/>
              <label className="check"><input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)}/><span>Pin to top</span></label>
              {err && <Alert>{err}</Alert>}
              <div className="posts__actions">
                <Button type="submit" icon={editing ? undefined : Plus} disabled={busy}>{busy ? 'Saving…' : editing ? 'Save Changes' : 'Publish Post'}</Button>
                {editing && <Button type="button" variant="ghost" icon={X} onClick={clear}>Cancel</Button>}
              </div>
            </FormStack>
          </Panel>
        </div>
      )}

      {sorted.length === 0 ? <Empty>No posts yet. Check back soon.</Empty> : (
        <div className="posts__list">
          {shown.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i * 0.05, 0.3)}>
              <Card tone={p.pinned ? 'gold' : 'plain'} icon={p.pinned ? Pin : undefined} title={p.title}
                meta={[p.createdBy, fmtPostTime(p)].filter(Boolean).join(' · ')}>
                <CardBody>
                  <PostBody text={p.body}/>
                  <MediaEmbed url={p.mediaUrl}/>
                </CardBody>
                {canEdit && (
                  <CardFoot>
                    <div className="posts__actions">
                      <Button size="sm" variant="ghost" icon={Pencil} onClick={() => startEdit(p)}>Edit</Button>
                      <Button size="sm" variant="danger" icon={Trash2} onClick={() => removePost(p.id)}>Delete</Button>
                    </div>
                  </CardFoot>
                )}
              </Card>
            </Reveal>
          ))}
        </div>
      )}
      <Paginator page={pg} totalPages={totalPages} onChange={n => { setPage(n); document.getElementById('ranger-portal')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}/>
    </div>
  )
}

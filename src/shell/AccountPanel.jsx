import { useEffect, useRef } from 'react'
import { signOut } from 'firebase/auth'
import { LogOut, X } from 'lucide-react'
import { auth } from '../firebase'
import { Button, Icon } from '../components'
import { ProfileEditor } from './ProfileEditor.jsx'

// My Profile. A small panel that drops from the account chip in the header, at the right edge, and covers only that strip of the page:
// no backdrop and no page of its own. Esc, the close button, a click anywhere outside it, or leaving the page closes it.
// It stays mounted while closed (`hidden`), so a half-typed edit survives closing it; signing out discards it.
// `anchorRef` is the element it hangs from (the chip's wrapper); `rangers` get the editor, everyone else just sees who they are.
export function AccountPanel({ open, onClose, anchorRef, user, profile, ranger }) {
  const ref      = useRef(null)
  const closeRef = useRef(onClose)
  useEffect(() => { closeRef.current = onClose })

  useEffect(() => {
    if (!open) return
    // Right edge under the chip; on a phone it simply fills the width. Set on the element so nothing re-renders.
    const place = () => {
      const el = ref.current, anchor = anchorRef.current
      if (!el || !anchor) return
      const vw    = document.documentElement.clientWidth
      const width = Math.min(400, vw - 24)
      const right = Math.min(Math.max(vw - anchor.getBoundingClientRect().right, 12), vw - width - 12)
      el.style.setProperty('--acct-w', width + 'px')
      el.style.setProperty('--acct-r', right + 'px')
    }
    place()
    ref.current?.focus({ preventScroll: true })
    const onKey  = e => { if (e.key === 'Escape') { closeRef.current(); anchorRef.current?.querySelector('a, button')?.focus() } }
    const onDown = e => { if (!ref.current?.contains(e.target) && !anchorRef.current?.contains(e.target)) closeRef.current() }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', place)
    document.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', place)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open, anchorRef])

  return (
    <div id="account-panel" ref={ref} className="acct" role="dialog" aria-label="My Profile" tabIndex={-1} hidden={!open}>
      <div className="acct__head">
        <span>My Profile</span>
        <button type="button" className="modal__close" aria-label="Close" onClick={onClose}><Icon icon={X}/></button>
      </div>
      <div className="acct__scroll">
        {ranger
          ? <ProfileEditor user={user} profile={profile}/>
          : <div className="acct__sec"><div className="t-label">Signed in as</div><div className="t-mono acct__mail">{user.email}</div></div>}
      </div>
      <div className="acct__foot">
        <Button variant="danger" size="sm" icon={LogOut} onClick={() => signOut(auth)}>Sign Out</Button>
      </div>
    </div>
  )
}

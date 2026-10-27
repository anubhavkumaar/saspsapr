import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Icon } from '../icons/Icon.jsx'

// Esc and backdrop click close it; the box pops in with a scale animation (sapr-pop).
export function Modal({ open = true, onClose = () => {}, title, sub, width = 420, children }) {
  const closeRef = useRef(onClose)
  useEffect(() => { closeRef.current = onClose })
  useEffect(() => {
    if (!open) return
    const k = e => { if (e.key === 'Escape') closeRef.current() }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])
  if (!open) return null
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__box" style={{ '--mw': width + 'px' }} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal__head">
          <div>{title && <h3 className="modal__title">{title}</h3>}{sub && <p className="modal__sub">{sub}</p>}</div>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close"><Icon icon={X}/></button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  )
}

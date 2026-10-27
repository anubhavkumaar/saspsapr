import { useState, useEffect } from 'react'
import { BatteryFull, Radio } from 'lucide-react'
import { Icon } from '../icons/Icon.jsx'
import { useInView } from '../motion/useInView.js'

const clockNow = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

// In-world phone (44px bezel, 34px screen) that carries the MDT log. It tilts up and powers on when scrolled
// into view, then breathes a soft glow. `toasts` ({ icon?, title, sub? }[]) drop in as notifications every `toastEvery` ms.
export function Phone({ eyebrow, title, foot, height = 640, toasts = [], toastEvery = 7000, className = '', children }) {
  const [clock, setClock] = useState(clockNow)
  const [toast, setToast] = useState(null)
  const [ref, iv] = useInView(0.25)
  useEffect(() => {
    const id = setInterval(() => setClock(clockNow()), 15000)
    return () => clearInterval(id)
  }, [])
  const live = iv.includes('is-in')
  useEffect(() => {
    if (!live || !toasts.length) return
    let n = 0
    const show = () => { setToast({ t: toasts[n % toasts.length], id: n }); n++ }
    const t0 = setTimeout(show, 1800)
    const id = setInterval(show, toastEvery)
    return () => { clearTimeout(t0); clearInterval(id) }
  }, [live, toasts, toastEvery])
  return (
    <div ref={ref} className={('phone ' + className).trim() + iv}>
      <div className="phone__screen" style={{ '--h': height + 'px' }}>
        <span className="phone__notch"/>
        {toast && (
          <div key={toast.id} className="phone__toast">
            <span className="phone__toast-ic"><Icon icon={toast.t.icon || Radio} size={16}/></span>
            <div><b>{toast.t.title}</b>{toast.t.sub && <span>{toast.t.sub}</span>}</div>
            <em>now</em>
          </div>
        )}
        <div className="phone__bar"><span>{clock}</span><span className="phone__sig"><i/><i/><i/><i/><Icon icon={BatteryFull} size={16}/></span></div>
        {(eyebrow || title) && <div className="phone__head">{eyebrow && <div className="phone__eb">{eyebrow}</div>}{title && <div className="phone__title">{title}</div>}</div>}
        <div className="phone__body">{children}</div>
        {foot && <div className="phone__foot">{foot}</div>}
      </div>
    </div>
  )
}

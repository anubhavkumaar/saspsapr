import { useEffect, useRef, useState } from 'react'

const canObserve = typeof IntersectionObserver !== 'undefined'

// Rubber stamp that thunks in (scale 1.9 → 1) at 40% visibility. Multiply blend in Day, set in CSS.
export function Stamp({ tone = 'stamp', size = 'md', rotate = -8, animate = true, className = '', style, children }) {
  const ref = useRef(null)
  const watch = animate && canObserve
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!watch || !el) return
    const io = new IntersectionObserver(es => {
      if (es[0].isIntersecting) { setInView(true); io.disconnect() }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [watch])
  const state = !watch ? '' : inView ? 'stamp--in' : 'stamp--pending'
  const cls = ['stamp', tone !== 'stamp' ? 'stamp--' + tone : '', size !== 'md' ? 'stamp--' + size : '', state, className].filter(Boolean).join(' ')
  return <span ref={ref} className={cls} style={{ '--rot': rotate + 'deg', ...style }}>{children}</span>
}

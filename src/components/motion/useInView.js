import { useEffect, useRef, useState } from 'react'

const canObserve = typeof IntersectionObserver !== 'undefined'
const prefersReducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Gate for a component's own in-view animation. Returns [ref, classes]:
//   ''                  — motion off (reduced motion, or no IntersectionObserver): content is simply shown
//   ' is-armed'         — about to animate: the kit's CSS hides the animated parts
//   ' is-armed is-in'   — scrolled into view: the animation plays
// Content is never left hidden: a 6s timer fires the animation even if the observer never does.
export function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [st, setSt] = useState(() => (canObserve && !prefersReducedMotion() ? 'armed' : 'static'))
  useEffect(() => {
    const el = ref.current
    if (!el || !canObserve || prefersReducedMotion()) return
    let raf = 0
    const io = new IntersectionObserver(es => {
      if (es[0].isIntersecting) { io.disconnect(); raf = requestAnimationFrame(() => setSt('in')) }
    }, { threshold, rootMargin: '0px 0px -30px 0px' })
    io.observe(el)
    const fallback = setTimeout(() => setSt('in'), 6000)
    return () => { io.disconnect(); clearTimeout(fallback); cancelAnimationFrame(raf) }
  }, [threshold])
  return [ref, st === 'armed' ? ' is-armed' : st === 'in' ? ' is-armed is-in' : '']
}

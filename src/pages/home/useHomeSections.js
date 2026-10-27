import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { HOME_SECTIONS } from '../../lib/nav'

// Sticky header (68px) + scroll-padding gap (16px) — where a section's top edge should land.
const LANDING_TOP = 84

export function useHomeSections() {
  const { pathname } = useLocation()

  // Landing on /roster, /hunting … scrolls to that section. Firestore-backed sections grow after
  // first paint, so a single scroll lands short — re-settle a couple of times, but stop the moment
  // the visitor takes over the scroll themselves.
  useEffect(() => {
    const target = HOME_SECTIONS.find(s => s.path === pathname)
    if (!target) return
    const timers = [80, 700, 1500].map((d, i) => setTimeout(() => {
      if (target.id === 'hero') { if (i === 0) window.scrollTo({ top: 0, behavior: 'smooth' }); return }
      const el = document.getElementById(target.id)
      if (!el) return
      if (Math.abs(el.getBoundingClientRect().top - LANDING_TOP) < 8) return
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, d))
    const stop = () => timers.forEach(clearTimeout)
    const events = ['wheel', 'touchstart', 'keydown']
    events.forEach(e => window.addEventListener(e, stop, { passive: true }))
    return () => { stop(); events.forEach(e => window.removeEventListener(e, stop)) }
  }, [pathname])

  // Scroll-spy: as a section with its own path takes over the screen, mirror it into the URL.
  // replaceState keeps history from flooding.
  useEffect(() => {
    const targets = HOME_SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean)
    if (!targets.length) return
    const visibility = new Map(targets.map(t => [t.id, 0]))
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => visibility.set(e.target.id, e.intersectionRatio))
      let bestId = '', bestRatio = 0
      for (const [id, ratio] of visibility) {
        if (ratio > bestRatio) { bestRatio = ratio; bestId = id }
      }
      if (!bestId || bestRatio <= 0.15) return
      const hit = HOME_SECTIONS.find(s => s.id === bestId)
      if (hit && window.location.pathname !== hit.path) window.history.replaceState(null, '', hit.path)
    }, { rootMargin: '-80px 0px -45% 0px', threshold: [0, 0.15, 0.35, 0.6, 1] })
    targets.forEach(t => io.observe(t))
    return () => io.disconnect()
  }, [])
}

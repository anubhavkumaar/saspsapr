import { useEffect, useState } from 'react'
import { INTRO_EVENT } from './replayIntro.js'

const KEY = 'sapr-intro-seen'

// The cougar plays once per session, and only on a fresh entry at '/' — deep links to
// /roster, /hunting etc. skip it. Reduced-motion visitors are not autoplayed a video.
function shouldAutoPlay() {
  try { if (sessionStorage.getItem(KEY)) return false } catch { /* storage unavailable */ }
  if (window.location.pathname !== '/') return false
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const SKIP = {
  position: 'absolute', right: 24, bottom: 24, cursor: 'pointer',
  font: "600 12px/1 'IBM Plex Mono', monospace", letterSpacing: '.1em', textTransform: 'uppercase',
  padding: '12px 16px', background: '#F2EDE1', color: '#1D221E', border: '2px solid #1D221E', boxShadow: '4px 4px 0 #000',
}

// 'off' → 'on' (video) → 'fading' (.8s) → 'off'. Auto-dismisses at 3.5s or when the video ends.
export function Intro() {
  const [phase, setPhase] = useState(() => shouldAutoPlay() ? 'on' : 'off')

  useEffect(() => {
    const replay = () => setPhase('on')
    window.addEventListener(INTRO_EVENT, replay)
    return () => window.removeEventListener(INTRO_EVENT, replay)
  }, [])

  useEffect(() => {
    if (phase === 'on') {
      const t = setTimeout(() => setPhase('fading'), 3500)
      return () => clearTimeout(t)
    }
    if (phase === 'fading') {
      try { sessionStorage.setItem(KEY, '1') } catch { /* storage unavailable */ }
      const t = setTimeout(() => setPhase('off'), 800)
      return () => clearTimeout(t)
    }
  }, [phase])

  if (phase === 'off') return null
  const fade = () => setPhase('fading')
  return (
    <div role="dialog" aria-label="Intro" style={{
      position: 'fixed', inset: 0, zIndex: 9999, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: phase === 'fading' ? 0 : 1, transition: 'opacity .8s ease', pointerEvents: phase === 'fading' ? 'none' : 'auto',
    }}>
      <video src="/cougar.mp4" muted autoPlay playsInline onEnded={fade} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
      <button type="button" style={SKIP} onClick={fade}>Skip intro</button>
    </div>
  )
}

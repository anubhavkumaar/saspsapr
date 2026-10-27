import { useEffect, useState } from 'react'

const EXTS = ['jpg', 'png', 'webp']
const found = new Map() // slot → URL that loaded ('' = none did), so a slot is only probed once per session

// For components that need a URL rather than an <img> (e.g. ZoneMap): resolves a slot to public/field/<name>.jpg|png|webp
// if a file was dropped there, otherwise to `fallback`, otherwise ''. Probes in order with real image loads, so a missing
// file (which the hosting rewrite answers with index.html) is correctly skipped.
export function useFieldSrc(name, fallback = '') {
  const key = name + '|' + fallback
  const [src, setSrc] = useState(() => found.get(key))
  useEffect(() => {
    if (found.has(key)) return
    let cancelled = false
    const candidates = [...EXTS.map(e => `/field/${name}.${e}`), fallback].filter(Boolean)
    const next = i => {
      if (i >= candidates.length) { found.set(key, ''); if (!cancelled) setSrc(''); return }
      const img = new Image()
      img.onload = () => { found.set(key, candidates[i]); if (!cancelled) setSrc(candidates[i]) }
      img.onerror = () => next(i + 1)
      img.src = candidates[i]
    }
    next(0)
    return () => { cancelled = true }
  }, [key, name, fallback])
  return src || ''
}

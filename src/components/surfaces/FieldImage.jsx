import { useState } from 'react'

const EXTS = ['jpg', 'png', 'webp']
const dead = new Set() // URLs that failed to load this session — not asked for again

// Picture for an image slot, so screenshots can be dropped in without code changes.
// Tries `src` (e.g. a Firestore URL), then public/field/<name>.jpg|png|webp, then `fallbackSrc`.
// If none loads it renders nothing and the parent's flat var(--paper-2) box shows.
// (A missing file is served index.html by the hosting rewrite, which an <img> reports as an error.)
export function FieldImage({ name, src, fallbackSrc, alt = '', link = false, className, loading = 'lazy' }) {
  const [, bump] = useState(0)
  const candidates = [src, ...(name ? EXTS.map(e => `/field/${name}.${e}`) : []), fallbackSrc].filter(Boolean)
  const current = candidates.find(u => !dead.has(u))
  if (!current) return null
  const img = <img src={current} alt={alt} className={className} loading={loading} onError={() => { dead.add(current); bump(n => n + 1) }}/>
  return link ? <a href={current} target="_blank" rel="noopener noreferrer" title="Open the full-size image">{img}</a> : img
}

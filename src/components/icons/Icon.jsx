// lucide-react glyph in currentColor. An explicit size is pinned inline, as the kit's Icon did,
// so the base `svg.lucide { 16px }` rule can't override it; without one, component CSS decides.
export function Icon({ icon: Glyph, size, strokeWidth = 2, className, style }) {
  if (!Glyph) return null
  const pinned = size ? { width: size, height: size } : null
  return (
    <Glyph size={size} strokeWidth={strokeWidth} className={className}
      style={pinned || style ? { ...pinned, ...style } : undefined} aria-hidden="true"/>
  )
}

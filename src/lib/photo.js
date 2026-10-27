// Turn a vgy.me share link into a direct image URL. Direct URLs pass through.
export function resolvePhotoUrl(raw) {
  if (!raw) return ''
  const u = raw.trim()
  if (/\.(png|jpe?g|gif|webp|bmp|svg)(\?|$)/i.test(u)) return u
  const vgy = u.match(/vgy\.me\/(?:image\/)?([A-Za-z0-9]+)/i)
  if (vgy) return `https://i.vgy.me/${vgy[1]}.jpg`
  return u
}

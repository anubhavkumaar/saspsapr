import { ExternalLink } from 'lucide-react'
import { Button } from '../actions/Button.jsx'

// A link pasted into a post, shown as what it is: a YouTube player, a vgy.me or direct image, a video file —
// or, for anything else, a plain "Open link" button. Frames are 2px ink, square.
export function MediaEmbed({ url }) {
  if (!url) return null
  const u = url.trim()
  const yt = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/)
  if (yt) return (
    <div className="embed embed--video">
      <iframe src={`https://www.youtube.com/embed/${yt[1]}`} title="video" allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"/>
    </div>
  )
  // vgy.me share links point at a page, not the picture: use the direct image (jpg first, then png)
  const vgy = u.match(/vgy\.me\/(?:image\/)?([A-Za-z0-9]+)(?:\.[a-z]+)?/i)
  if (vgy) return (
    <a className="embed" href={u} target="_blank" rel="noopener noreferrer">
      <img src={`https://i.vgy.me/${vgy[1]}.jpg`} alt="attachment"
        onError={e => { if (!e.currentTarget.dataset.retried) { e.currentTarget.dataset.retried = '1'; e.currentTarget.src = `https://i.vgy.me/${vgy[1]}.png` } }}/>
    </a>
  )
  if (/\.(png|jpe?g|gif|webp|bmp|svg)(\?|$)/i.test(u)) return (
    <a className="embed" href={u} target="_blank" rel="noopener noreferrer"><img src={u} alt="attachment"/></a>
  )
  if (/\.(mp4|webm|mov|ogg)(\?|$)/i.test(u)) return <video className="embed embed--file" src={u} controls/>
  return <div className="embed-link"><Button href={u} target="_blank" rel="noopener noreferrer" variant="ghost" size="sm" iconRight={ExternalLink}>Open link</Button></div>
}

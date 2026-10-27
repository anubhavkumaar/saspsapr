import { useEffect, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import { fmtDate } from '../../lib/dates'
import { Button, Modal } from '../../components'

const MotionImg = motion.img
const MIN = 1, MAX = 4, STEP = 0.5
const clamp = n => parseFloat(Math.min(MAX, Math.max(MIN, n)).toFixed(2))

// Full-size viewer in the design's Modal (Esc and backdrop close it). Same behaviour as before:
// click to zoom in, +/− buttons, mouse-wheel zoom, drag to pan when zoomed, reset, 100–400%.
// Mount it only while an image is open — each open starts at 100%.
export function Lightbox({ item, onClose }) {
  const [scale, setScale] = useState(1)
  const [size, setSize]   = useState({ w: 0, h: 0 })
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const reset = () => { setScale(1); x.set(0); y.set(0) }

  // Back at 100% → snap the pan back to centre.
  useEffect(() => { if (scale <= 1) { x.set(0); y.set(0) } }, [scale, x, y])

  // Mouse-wheel zoom while open (the page behind doesn't scroll).
  useEffect(() => {
    const onWheel = e => { e.preventDefault(); setScale(s => clamp(s + (e.deltaY < 0 ? 0.2 : -0.2))) }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  const room = { x: size.w * (scale - 1) / 2, y: size.h * (scale - 1) / 2 }
  const sub = [fmtDate(item.date), item.uploadedBy && '● ' + item.uploadedBy].filter(Boolean).join(' · ')

  return (
    <Modal open onClose={onClose} width={1040} title={item.caption || 'Evidence'} sub={sub || undefined}>
      <div className="lightbox__stage">
        <MotionImg src={item.url} alt={item.caption || 'Evidence'} className="lightbox__img"
          style={{ scale, x, y, cursor: scale > 1 ? 'grab' : 'zoom-in' }}
          drag={scale > 1} dragMomentum={false} dragElastic={0}
          dragConstraints={{ left: -room.x, right: room.x, top: -room.y, bottom: room.y }}
          whileDrag={{ cursor: 'grabbing' }}
          onLoad={e => setSize({ w: e.currentTarget.offsetWidth, h: e.currentTarget.offsetHeight })}
          onClick={() => { if (scale === 1) setScale(clamp(scale + STEP)) }}/>
        <div className="lightbox__hud">
          <Button size="sm" variant="ghost" icon={ZoomOut} aria-label="Zoom out" title="Zoom out" disabled={scale <= MIN} onClick={() => setScale(clamp(scale - STEP))}/>
          <span className="lightbox__pct">{Math.round(scale * 100)}%</span>
          <Button size="sm" variant="ghost" icon={ZoomIn} aria-label="Zoom in" title="Zoom in" disabled={scale >= MAX} onClick={() => setScale(clamp(scale + STEP))}/>
          {scale > 1 && <Button size="sm" variant="ghost" icon={RotateCcw} aria-label="Reset zoom" title="Reset zoom" onClick={reset}/>}
        </div>
      </div>
    </Modal>
  )
}

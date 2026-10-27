import { useState, useEffect } from 'react'
import { useInView } from '../motion/useInView.js'
import { FieldImage } from '../surfaces/FieldImage.jsx'

// Live clock in IST (UTC+5:30), as the site has always shown it.
const istClock = () => new Date(Date.now() + 330 * 60000).toISOString().slice(11, 19)

// Trail-cam frame that flickers on with a scan sweep. The picture is `src`, or public/field/<imageName>.jpg|png|webp
// when given, or custom children; with none of them it is a flat var(--paper-2) box, and the
// REC / cam / place / clock overlay still runs.
export function CameraFeed({ cam = 'CAM 01', place, src, imageName, alt = '', time, children }) {
  const [t, setT] = useState(istClock)
  const [ref, iv] = useInView(0.3)
  useEffect(() => {
    if (time) return
    const id = setInterval(() => setT(istClock()), 1000)
    return () => clearInterval(id)
  }, [time])
  return (
    <div ref={ref} className={'feed' + iv}>
      <div className="feed__media">{children || (src || imageName ? <FieldImage src={src} name={imageName} alt={alt}/> : null)}</div>
      <span className="feed__scan" aria-hidden="true"/>
      <span className="feed__corner feed__corner--tl"/><span className="feed__corner feed__corner--br"/>
      <div className="feed__ov">
        <div><span className="feed__rec"><i/>REC</span><span>{cam}</span></div>
        <div><span>{place}</span><span>{time || t}</span></div>
      </div>
    </div>
  )
}

export function FeedGrid({ cols = 3, children }) {
  return <div className="feeds" style={{ '--cols': cols }}>{children}</div>
}

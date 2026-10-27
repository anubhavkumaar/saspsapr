import { useState } from 'react'
import { ArrowDown, ImagePlus, X } from 'lucide-react'
import { Icon } from '../icons/Icon.jsx'
import { FieldImage } from '../surfaces/FieldImage.jsx'

// A white-bordered print. The picture is `src` (falling back to public/field/evidence.*), or custom `children`;
// with neither it is a flat var(--paper-2) box.
export function EvidenceCard({ src, alt = '', caption, date, uploader, tilt = 0, onOpen, onDelete, children }) {
  const open = onOpen && {
    role: 'button', tabIndex: 0, onClick: onOpen,
    onKeyDown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen() } },
  }
  return (
    <figure className="ev" style={{ '--tilt': tilt + 'deg' }}>
      {onDelete && <button type="button" className="ev__del" onClick={onDelete} aria-label="Remove"><Icon icon={X}/></button>}
      <div className="ev__media" {...open}>{children || <FieldImage src={src} name="evidence" alt={alt || caption || 'Fishing evidence'}/>}</div>
      <figcaption className="ev__body">
        {caption && <p className="ev__cap">{caption}</p>}
        <div className="ev__meta"><span>{date}</span><span>● {uploader || 'Unknown'}</span></div>
      </figcaption>
    </figure>
  )
}

export function EvidenceGrid({ children }) {
  return <div className="ev-grid">{children}</div>
}

// Drop an image URL (dragged from a browser tab). A dragged image *file* can't be hosted, so onDropFile lets the page say so.
// With `preview` set it shows that image with a clear button instead of the prompt.
export function DropZone({ label = 'Drag an image here from your browser', hint, preview, onDropUrl, onDropFile, onClear }) {
  const [over, setOver] = useState(false)
  const drop = e => {
    e.preventDefault(); setOver(false)
    const url = (e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain')).trim()
    if (url.startsWith('http')) { if (onDropUrl) onDropUrl(url); return }
    const file = e.dataTransfer.files?.[0]
    if (file?.type?.startsWith('image/') && onDropFile) onDropFile(file)
  }
  return (
    <div className={'dropzone' + (over ? ' is-over' : '') + (preview ? ' dropzone--filled' : '')}
      onDragOver={e => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)} onDrop={drop}>
      {preview ? (
        <div className="dropzone__preview">
          <img src={preview} alt="Preview" onError={e => { e.currentTarget.style.display = 'none' }}/>
          <button type="button" className="dropzone__clear" onClick={onClear} aria-label="Clear"><Icon icon={X}/></button>
        </div>
      ) : (
        <>
          <Icon icon={over ? ArrowDown : ImagePlus}/>
          <b>{over ? 'Release to use this URL' : label}</b>
          <small>{hint || <span>or press <kbd>Ctrl+V</kbd> anywhere to paste a link</span>}</small>
        </>
      )}
    </div>
  )
}

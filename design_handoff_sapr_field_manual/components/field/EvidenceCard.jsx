import { Icon } from '../icons/Icon.jsx';
export function EvidenceCard({ src, alt = '', caption, date, uploader, tilt = 0, onOpen, onDelete, children }) {
  return (
    <figure className="ev" style={{ '--tilt': tilt + 'deg' }}>
      {onDelete && <button type="button" className="ev__del" onClick={onDelete} aria-label="Remove"><Icon name="x" /></button>}
      <div className="ev__media" onClick={onOpen}>{children || (src ? <img src={src} alt={alt || caption || 'Fishing evidence'} /> : null)}</div>
      <figcaption className="ev__body">{caption && <p className="ev__cap">{caption}</p>}<div className="ev__meta"><span>{date}</span><span>● {uploader || 'Unknown'}</span></div></figcaption>
    </figure>
  );
}
export function EvidenceGrid({ children }) { return <div className="ev-grid">{children}</div>; }
export function DropZone({ label = 'Drag an image here from your browser', hint, onDropUrl }) {
  const [over, setOver] = React.useState(false);
  return (
    <div className={'dropzone' + (over ? ' is-over' : '')} onDragOver={function (e) { e.preventDefault(); setOver(true); }} onDragLeave={function () { setOver(false); }} onDrop={function (e) { e.preventDefault(); setOver(false); const u = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain'); if (u && onDropUrl) onDropUrl(u); }}>
      <Icon name={over ? 'arrow-down' : 'image-plus'} />
      <b>{over ? 'Release to use this URL' : label}</b>
      <small>{hint || <span>or press <kbd>Ctrl+V</kbd> anywhere to paste a link</span>}</small>
    </div>
  );
}

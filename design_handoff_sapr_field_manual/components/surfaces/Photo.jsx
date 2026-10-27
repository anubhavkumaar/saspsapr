import { Stamp } from '../status/Stamp.jsx';
export function Photo({ src, alt = '', caption, ratio = '4/5', tilt = 1.8, tape = true, stamp, stampTone, stampStyle, children }) {
  return (
    <figure className="photo" style={{ '--tilt': tilt + 'deg' }}>
      {tape && <span className="photo__tape" style={{ left: '16%' }} />}
      {tape && <span className="photo__tape" style={{ right: '12%', transform: 'rotate(7deg)' }} />}
      <div className="photo__media" style={{ '--ratio': ratio }}>{children || (src ? <img src={src} alt={alt} /> : null)}</div>
      {caption && <figcaption className="photo__cap">{caption}</figcaption>}
      {stamp && <span className="photo__stamp" style={stampStyle || { left: -30, bottom: 74 }}><Stamp tone={stampTone} rotate={-9}>{stamp}</Stamp></span>}
    </figure>
  );
}

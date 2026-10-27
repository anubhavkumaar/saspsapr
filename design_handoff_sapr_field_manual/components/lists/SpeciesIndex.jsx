import { Stamp } from '../status/Stamp.jsx';
import { Label } from '../status/Label.jsx';
export function SpeciesIndex({ title, items = [], danger = false, stamp, cols = 3 }) {
  return (
    <div className={'idx' + (danger ? ' idx--danger' : '')}>
      {stamp && <span className="idx__stamp"><Stamp rotate={6}>{stamp}</Stamp></span>}
      <div className="idx__head"><span>{title}</span><em>{items.length} species</em></div>
      <ol style={{ '--cols': cols }}>{items.map(function (t, i) { return <li key={t}><span>{String(i + 1).padStart(2, '0')}</span>{t}</li>; })}</ol>
    </div>
  );
}
export function RunIn({ title, items = [], sep = ' · ' }) {
  return <div>{title && <h3 className="h-sub">{title} <Label tone="legal">{items.length + ' species'}</Label></h3>}<p className="runin">{items.join(sep)}</p></div>;
}

import { Icon } from '../icons/Icon.jsx';
import { Stamp } from '../status/Stamp.jsx';
export function Notice({ eyebrow, title, lead, action, items = [], stamp }) {
  return (
    <div className="notice">
      {stamp && <span className="notice__stamp"><Stamp rotate={-6}>{stamp}</Stamp></span>}
      <div>
        {eyebrow && <span className="sh__eb">{eyebrow}</span>}
        <h2 className="notice__title">{title}</h2>
        {lead && <p className="notice__lead">{lead}</p>}
        {action}
      </div>
      {items.length > 0 && <PinList items={items} />}
    </div>
  );
}
export function PinList({ items = [], icon = 'check' }) {
  return <ul className="pins">{items.map(function (t, i) { return <li key={i}><Icon name={icon} />{t}</li>; })}</ul>;
}

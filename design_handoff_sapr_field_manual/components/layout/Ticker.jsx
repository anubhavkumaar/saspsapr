import { Icon } from '../icons/Icon.jsx';
export function Ticker({ items = [], icon = 'radio', speed = 50 }) {
  const all = items.concat(items);
  return (
    <div className="ticker" aria-label="Bulletin">
      <div className="ticker__in" style={{ '--speed': speed + 's' }}>
        {all.map(function (t, i) { return <span key={i} className="ticker__item" aria-hidden={i >= items.length}>{icon && <Icon name={icon} />}{t}</span>; })}
      </div>
    </div>
  );
}

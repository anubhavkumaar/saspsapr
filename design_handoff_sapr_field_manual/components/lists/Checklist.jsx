import { Icon } from '../icons/Icon.jsx';
export function Checklist({ items = [], cols = 2, hint = 'Tap to tick off during a briefing' }) {
  const [done, setDone] = React.useState({});
  const n = Object.keys(done).filter(function (k) { return done[k]; }).length;
  return (
    <div>
      <ul className="checklist" style={{ '--cols': cols }}>
        {items.map(function (t, i) { return <li key={i} className={done[i] ? 'is-done' : ''} onClick={function () { const d = Object.assign({}, done); d[i] = !d[i]; setDone(d); }} role="checkbox" aria-checked={!!done[i]}><span className="checklist__box"><Icon name="check" /></span><span>{t}</span></li>; })}
      </ul>
      <div className="checklist__meta"><span>{hint}</span><span>{n} / {items.length} checked{n > 0 && <button type="button" className="btn btn--text btn--sm" style={{ marginLeft: 12 }} onClick={function () { setDone({}); }}><span>Reset</span></button>}</span></div>
    </div>
  );
}

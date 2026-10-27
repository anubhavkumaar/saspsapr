import { Label } from '../status/Label.jsx';
export function Roster({ sections = [] }) {
  return (
    <div className="roster">
      {sections.map(function (s) {
        const p = s.people || [];
        return (
          <div key={s.section} className="roster__sec">
            <h4>{s.section}<em>{p.length} officer{p.length !== 1 ? 's' : ''}</em></h4>
            {p.length ? p.map(function (o, i) {
              return <div key={i} className="roster__p"><span className="roster__av">{o.initials || o.name.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2)}</span><div><b>{o.name}</b><small>{[o.callSign, o.rank].filter(Boolean).join(' · ')}</small></div><span className="roster__tags">{o.dept && <Label>{o.dept}</Label>}{o.status && <Label>{o.status}</Label>}</span></div>;
            }) : <div className="roster__empty">No personnel assigned</div>}
          </div>
        );
      })}
    </div>
  );
}

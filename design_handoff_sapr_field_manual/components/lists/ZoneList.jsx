export function ZoneList({ zones = [], active, onHover }) {
  const group = function (kind, title) {
    let n = 0;
    const z = zones.filter(function (x) { return x.kind === kind; });
    if (!z.length) return null;
    return (
      <div>
        <h4 className="zone-list__head"><span className={'mk mk--' + kind} />{title}</h4>
        <ol className="zone-list" style={{ margin: 0, marginBottom: 26 }}>{z.map(function (x) { n++; return <li key={x.name} className={active === x.name ? 'is-on' : ''} onMouseEnter={function () { if (onHover) onHover(x.name); }} onMouseLeave={function () { if (onHover) onHover(null); }}><span className={'mk mk--' + kind}>{n}</span>{x.name}</li>; })}</ol>
      </div>
    );
  };
  return <div className="zone-list-wrap" style={{ display: 'contents' }}>{group('hunt', 'Hunting Zones')}{group('fish', 'Fishing Zones')}</div>;
}

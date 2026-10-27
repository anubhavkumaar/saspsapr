export function FormBlock({ rows = [] }) {
  return <div className="formblock">{rows.map(function (r, i) { return <div key={i} className="formblock__row"><span className="formblock__k">{r.k}</span><b className="formblock__v">{r.v}</b></div>; })}</div>;
}

export function FormBlock({ rows = [] }) {
  return (
    <div className="formblock">
      {rows.map((r, i) => <div key={i} className="formblock__row"><span className="formblock__k">{r.k}</span><b className="formblock__v">{r.v}</b></div>)}
    </div>
  )
}

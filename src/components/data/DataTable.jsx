import { Fragment } from 'react'

// columns: { key, label, align?, className?, render?(value, row) }. `expand(row)` returns a node to show in a full-width
// row directly under that row (or nothing) — used by the roster editor for a ranger's profile text.
export function DataTable({ columns = [], rows = [], rowKey, rowClassName, expand }) {
  return (
    <div className="tbl-scroll"><table className="tbl">
      <thead><tr>{columns.map(c => <th key={c.key} style={c.align ? { textAlign: c.align } : undefined}>{c.label}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => {
        const more = expand ? expand(r) : null
        return (
          <Fragment key={rowKey ? r[rowKey] : i}>
            <tr className={rowClassName ? rowClassName(r) : undefined}>
              {columns.map(c => <td key={c.key} className={c.className} style={c.align ? { textAlign: c.align } : undefined}>{c.render ? c.render(r[c.key], r) : r[c.key]}</td>)}
            </tr>
            {more && <tr className="tbl__expand"><td colSpan={columns.length}>{more}</td></tr>}
          </Fragment>
        )
      })}</tbody>
    </table></div>
  )
}

export function DataTable({ columns = [], rows = [], rowKey }) {
  return (
    <div className="tbl-scroll"><table className="tbl">
      <thead><tr>{columns.map(function (c) { return <th key={c.key} style={c.align ? { textAlign: c.align } : undefined}>{c.label}</th>; })}</tr></thead>
      <tbody>{rows.map(function (r, i) { return <tr key={rowKey ? r[rowKey] : i}>{columns.map(function (c) { return <td key={c.key} className={c.className} style={c.align ? { textAlign: c.align } : undefined}>{c.render ? c.render(r[c.key], r) : r[c.key]}</td>; })}</tr>; })}</tbody>
    </table></div>
  );
}

export function Panel({ title, meta, body = true, children, style }) {
  return <div className="panel" style={style}>{title && <div className="panel__head"><span>{title}</span>{meta && <em>{meta}</em>}</div>}{body ? <div className="panel__body">{children}</div> : children}</div>;
}

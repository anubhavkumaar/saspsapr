export function Chip({ num, active = false, onClick, children }) {
  const Tag = onClick ? 'button' : 'span'
  return (
    <Tag type={onClick ? 'button' : undefined} className={'chip' + (active ? ' is-on' : '')} onClick={onClick} aria-pressed={onClick ? active : undefined}>
      {num != null && <b>{num}</b>}{children}
    </Tag>
  )
}

export function ChipGroup({ children }) {
  return <div className="chips">{children}</div>
}

export function Section({ id, alt = false, tight = false, children }) {
  return <section id={id} className={'sec' + (alt ? ' sec--alt' : '') + (tight ? ' sec--tight' : '')}><div className="wrap">{children}</div></section>;
}
export function SectionHeader({ num, eyebrow, eyebrowTone, title, sub, aside }) {
  const word = num && isNaN(Number(num));
  return (
    <div className={'sh' + (word ? ' sh--word' : '')}>
      {num && <span className="sh__num">{num}</span>}
      {eyebrow && <span className={'sh__eb' + (eyebrowTone ? ' sh__eb--' + eyebrowTone : '')}>{eyebrow}</span>}
      <h2 className="sh__title">{title}</h2>
      {sub && <p className="sh__sub">{sub}</p>}
      {aside && <div className="sh__aside">{aside}</div>}
    </div>
  );
}
export function SubHeading({ children }) { return <h3 className="h-sub">{children}</h3>; }
export function Split({ variant, children, style }) { return <div className={'split' + (variant ? ' split--' + variant : '')} style={style}>{children}</div>; }

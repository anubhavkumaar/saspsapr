export function Footer({ logo, name = 'San Andreas Park Rangers', lines = [], links = [], colophon = [], builtBy }) {
  return (
    <footer className="footer"><div className="wrap">
      <div className="footer__grid">
        {logo ? <img src={logo} alt="" /> : <span />}
        <div><div className="footer__name">{name}</div>{lines.map(function (l, i) { return <p key={i}>{l}</p>; })}</div>
        <nav>{links.map(function (l, i) { return l.onClick && !l.href ? <button key={i} type="button" onClick={l.onClick}>{l.label}</button> : <a key={i} href={l.href || '#'} onClick={l.onClick ? function (e) { e.preventDefault(); l.onClick(); } : undefined}>{l.label}</a>; })}</nav>
      </div>
      {(colophon.length > 0 || builtBy) && <div className="footer__colo">{colophon.map(function (c, i) { return <span key={i}>{c}</span>; })}{builtBy && React.createElement(builtBy.href ? 'a' : 'span', { className: 'footer__built', href: builtBy.href, target: builtBy.href ? '_blank' : undefined, rel: builtBy.href ? 'noopener' : undefined }, <span>Built by</span>, <img src={builtBy.logo} alt={builtBy.name || ''} />, builtBy.name && <span className="footer__built-name">{builtBy.name}</span>)}</div>}
    </div></footer>
  );
}

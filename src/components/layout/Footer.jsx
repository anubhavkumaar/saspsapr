import { Link } from 'react-router-dom'

// links: { label, to?, href?, onClick? } — `to` routes, `onClick` alone renders a button.
export function Footer({ logo, name = 'San Andreas Park Rangers', lines = [], links = [], colophon = [], builtBy }) {
  const BuiltTag = builtBy?.href ? 'a' : 'span'
  return (
    <footer className="footer"><div className="wrap">
      <div className="footer__grid">
        {logo ? <img src={logo} alt=""/> : <span/>}
        <div><div className="footer__name">{name}</div>{lines.map((l, i) => <p key={i}>{l}</p>)}</div>
        <nav>{links.map((l, i) => {
          if (l.to) return <Link key={i} to={l.to}>{l.label}</Link>
          if (l.onClick && !l.href) return <button key={i} type="button" onClick={l.onClick}>{l.label}</button>
          return <a key={i} href={l.href || '#'}>{l.label}</a>
        })}</nav>
      </div>
      {(colophon.length > 0 || builtBy) && (
        <div className="footer__colo">
          {colophon.map((c, i) => <span key={i}>{c}</span>)}
          {builtBy && (
            <BuiltTag className="footer__built" href={builtBy.href} target={builtBy.href ? '_blank' : undefined} rel={builtBy.href ? 'noopener' : undefined}>
              <span>Built by</span><img src={builtBy.logo} alt={builtBy.name || ''}/>{builtBy.name && <span className="footer__built-name">{builtBy.name}</span>}
            </BuiltTag>
          )}
        </div>
      )}
    </div></footer>
  )
}

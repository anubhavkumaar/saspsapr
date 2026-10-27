export function Hero({ kicker, lines = [], accent = 1, line, children, aside, below, id = 'top' }) {
  return (
    <section className="hero" id={id}>
      <div className="wrap">
        <div className="hero__grid">
          <div>
            {kicker && <div className="kicker">{kicker}</div>}
            <h1 className="cover">{lines.map(function (l, i) { return <span key={i} className={'cover__ln' + (i === accent ? ' cover__ln--accent' : '')}><span>{l}</span></span>; })}</h1>
            {line && <p className="hero__line">{line}</p>}
            {children}
          </div>
          {aside}
        </div>
        {below}
      </div>
    </section>
  );
}
export function HeroActions({ children }) { return <div className="hero__cta">{children}</div>; }

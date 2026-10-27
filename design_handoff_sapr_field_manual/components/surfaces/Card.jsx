import { Icon } from '../icons/Icon.jsx';
export function Card({ tone = 'forest', icon, title, meta, children, style, className = '' }) {
  return (
    <article className={('card ' + className).trim()} style={style}>
      {title && <div className={'card__head' + (tone !== 'forest' ? ' card__head--' + tone : '')}>{icon && <Icon name={icon} size={22} />}<h3 className="card__title">{title}</h3>{meta && <small className="card__meta">{meta}</small>}</div>}
      {children}
    </article>
  );
}
export function CardBody({ children }) { return <div className="card__body">{children}</div>; }
export function CardFoot({ title, children }) { return <div className="card__foot">{title && <strong>{title}</strong>}{children}</div>; }
export function Facts({ items = [] }) {
  return <div className="kv">{items.map(function (f, i) { return <div key={i}><span className="kv__k">{f.icon && <Icon name={f.icon} />}{f.k}</span><b className="kv__v">{f.v}</b>{f.n && <span className="kv__n">{f.n}</span>}</div>; })}</div>;
}
export function Equipment({ allowed, prohibited }) {
  const col = function (g, ok) { return g ? <div><h4 className={ok ? 'is-ok' : 'is-no'}>{g.title}</h4><ul>{g.items.map(function (t, i) { return <li key={i}><Icon name={ok ? 'check' : 'x'} className={ok ? 'is-ok' : 'is-no'} />{t}</li>; })}</ul></div> : null; };
  return <div className="eq">{col(allowed, true)}{col(prohibited, false)}</div>;
}

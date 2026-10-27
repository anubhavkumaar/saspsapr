import { Check, X } from 'lucide-react'
import { Icon } from '../icons/Icon.jsx'
import { useInView } from '../motion/useInView.js'

// The header band wipes in, then the facts pop and the equipment list slides in (--i staggers them).
export function Card({ tone = 'forest', icon, title, meta, children, style, className = '' }) {
  const [ref, iv] = useInView(0.2)
  return (
    <article ref={ref} className={('card ' + className).trim() + iv} style={style}>
      {title && (
        <div className={'card__head' + (tone !== 'forest' ? ' card__head--' + tone : '')}>
          {icon && <Icon icon={icon} size={22}/>}
          <h3 className="card__title">{title}</h3>
          {meta && <small className="card__meta">{meta}</small>}
        </div>
      )}
      {children}
    </article>
  )
}

export function CardBody({ children }) {
  return <div className="card__body">{children}</div>
}

export function CardFoot({ title, children }) {
  return <div className="card__foot">{title && <strong>{title}</strong>}{children}</div>
}

export function Facts({ items = [] }) {
  return (
    <div className="kv">
      {items.map((f, i) => (
        <div key={i} style={{ '--i': i }}>
          <span className="kv__k">{f.icon && <Icon icon={f.icon}/>}{f.k}</span>
          <b className="kv__v">{f.v}</b>
          {f.n && <span className="kv__n">{f.n}</span>}
        </div>
      ))}
    </div>
  )
}

export function Equipment({ allowed, prohibited }) {
  const col = (g, ok) => g && (
    <div>
      <h4 className={ok ? 'is-ok' : 'is-no'}>{g.title}</h4>
      <ul>{g.items.map((t, i) => <li key={i} style={{ '--i': i }}><Icon icon={ok ? Check : X} className={ok ? 'is-ok' : 'is-no'}/>{t}</li>)}</ul>
    </div>
  )
  return <div className="eq">{col(allowed, true)}{col(prohibited, false)}</div>
}

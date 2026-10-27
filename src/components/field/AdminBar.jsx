import { ShieldCheck } from 'lucide-react'
import { Icon } from '../icons/Icon.jsx'

export function AdminBar({ name, email, children }) {
  return (
    <div className="admin-bar">
      <span className="admin-bar__who"><Icon icon={ShieldCheck}/>{name}{email ? ' — ' + email : ''}</span>
      <div className="admin-bar__actions">{children}</div>
    </div>
  )
}

export function ControlCard({ title, sub, status, action }) {
  return (
    <div className="ctrl-card">
      <div><div className="ctrl-card__title">{title}</div>{sub && <p className="ctrl-card__sub">{sub}</p>}{status}</div>
      {action}
    </div>
  )
}

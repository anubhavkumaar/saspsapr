import { Anchor, CircleAlert, CircleCheck, TriangleAlert } from 'lucide-react'
import { Icon } from '../icons/Icon.jsx'

const DEFAULT_ICON = { danger: TriangleAlert, warn: CircleAlert, info: Anchor, ok: CircleCheck }

export function Alert({ tone = 'danger', icon, children, style }) {
  return (
    <div className={'alert' + (tone !== 'danger' ? ' alert--' + tone : '')} style={style} role={tone === 'danger' ? 'alert' : undefined}>
      <Icon icon={icon || DEFAULT_ICON[tone]} size={20}/>
      <div>{children}</div>
    </div>
  )
}

export function Empty({ children }) {
  return <div className="empty">{children}</div>
}

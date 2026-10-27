import { Icon } from '../icons/Icon.jsx';
export function Alert({ tone = 'danger', icon, children, style }) {
  const ic = icon || { danger: 'triangle-alert', warn: 'circle-alert', info: 'anchor', ok: 'circle-check' }[tone];
  return <div className={'alert' + (tone !== 'danger' ? ' alert--' + tone : '')} style={style} role={tone === 'danger' ? 'alert' : undefined}><Icon name={ic} size={20} /><div>{children}</div></div>;
}
export function Empty({ children }) { return <div className="empty">{children}</div>; }

import { Icon } from '../icons/Icon.jsx';
export function Button({ variant = 'primary', size, block = false, icon, iconRight, as, href, className = '', children, ...rest }) {
  const cls = ['btn', variant !== 'primary' ? 'btn--' + variant : '', size === 'sm' ? 'btn--sm' : '', block ? 'btn--block' : '', className].filter(Boolean).join(' ');
  const Tag = as || (href ? 'a' : 'button');
  return (
    <Tag className={cls} href={href} {...rest}>
      {icon && <Icon name={icon} />}
      {children != null && <span>{children}</span>}
      {iconRight && <Icon name={iconRight} />}
    </Tag>
  );
}

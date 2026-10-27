import { Icon } from '../icons/Icon.jsx'

// options: { value, label, icon?, tone?: 'warn' }
export function Segmented({ options = [], value, onChange = () => {}, style }) {
  return (
    <div className="seg" role="tablist" style={style}>
      {options.map(o => {
        const on = o.value === value
        return (
          <button key={o.value} type="button" role="tab" aria-selected={on}
            className={(on ? 'is-on' : '') + (o.tone === 'warn' ? ' is-warn' : '')} onClick={() => onChange(o.value)}>
            {o.icon && <Icon icon={o.icon} size={14}/>}{o.label}
          </button>
        )
      })}
    </div>
  )
}

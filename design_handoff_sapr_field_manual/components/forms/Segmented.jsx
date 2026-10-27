import { Icon } from '../icons/Icon.jsx';
export function Segmented({ options = [], value, onChange = function () {}, style }) {
  return (
    <div className="seg" role="tablist" style={style}>
      {options.map(function (o) { const on = o.value === value; return <button key={o.value} type="button" role="tab" aria-selected={on} className={(on ? 'is-on' : '') + (o.tone === 'warn' ? ' is-warn' : '')} onClick={function () { onChange(o.value); }}>{o.icon && <Icon name={o.icon} size={14} />}{o.label}</button>; })}
    </div>
  );
}

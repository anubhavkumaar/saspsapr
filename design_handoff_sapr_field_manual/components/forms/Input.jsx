import { Icon } from '../icons/Icon.jsx';
export function Input({ mono = false, invalid = false, className = '', ...rest }) {
  return <input className={['input', mono ? 'input--mono' : '', invalid ? 'is-invalid' : '', className].filter(Boolean).join(' ')} {...rest} />;
}
export function Textarea({ className = '', ...rest }) { return <textarea className={('input ' + className).trim()} {...rest} />; }
export function Select({ options, placeholder, className = '', children, ...rest }) {
  return <select className={('input ' + className).trim()} {...rest}>{placeholder && <option value="">{placeholder}</option>}{options ? options.map(function (o) { const v = typeof o === 'string' ? o : o.value; return <option key={v} value={v}>{typeof o === 'string' ? o : o.label}</option>; }) : children}</select>;
}
export function SearchInput(props) { return <div className="search"><Icon name="search" /><Input type="search" {...props} /></div>; }

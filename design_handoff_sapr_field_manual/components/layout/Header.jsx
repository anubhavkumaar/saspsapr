import { Icon } from '../icons/Icon.jsx';
export function Header({ logo, name = 'SAPR', sub = 'San Andreas Park Rangers', links = [], actions, onBrand }) {
  const [open, setOpen] = React.useState(false);
  const link = function (l, i) {
    return <a key={i} href={l.href || '#'} className={l.active ? 'is-on' : ''} onClick={function (e) { if (l.onClick) { e.preventDefault(); l.onClick(); } setOpen(false); }}>{l.label}</a>;
  };
  return (
    <header className="hdr">
      <div className="wrap hdr__in" style={{ position: 'relative' }}>
        <button type="button" className="brand" onClick={onBrand}>
          {logo && <img src={logo} alt="Ranger patch and San Andreas State Parks seal" />}
          <span><span className="brand__name">{name}</span><span className="brand__sub">{sub}</span></span>
        </button>
        <nav className="hdr__nav">{links.map(link)}</nav>
        <div className="hdr__actions">{actions}</div>
        <button type="button" className="hdr__burger" aria-label="Menu" onClick={function () { setOpen(!open); }}><Icon name={open ? 'x' : 'menu'} size={18} /></button>
        <nav className={'hdr__drawer' + (open ? ' is-open' : '')}>{links.map(link)}</nav>
      </div>
    </header>
  );
}

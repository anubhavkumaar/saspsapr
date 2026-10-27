import { Icon } from '../icons/Icon.jsx';
export function Phone({ eyebrow, title, foot, height = 640, children }) {
  const [clock, setClock] = React.useState('');
  React.useEffect(function () { const f = function () { setClock(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })); }; f(); const id = setInterval(f, 15000); return function () { clearInterval(id); }; }, []);
  return (
    <div className="phone">
      <div className="phone__screen" style={{ '--h': height + 'px' }}>
        <span className="phone__notch" />
        <div className="phone__bar"><span>{clock}</span><span><Icon name="signal" size={14} /><Icon name="battery-full" size={16} /></span></div>
        {(eyebrow || title) && <div className="phone__head">{eyebrow && <div className="phone__eb">{eyebrow}</div>}{title && <div className="phone__title">{title}</div>}</div>}
        <div className="phone__body">{children}</div>
        {foot && <div className="phone__foot">{foot}</div>}
      </div>
    </div>
  );
}

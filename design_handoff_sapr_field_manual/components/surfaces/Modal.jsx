import { Icon } from '../icons/Icon.jsx';
export function Modal({ open = true, onClose = function () {}, title, sub, width = 420, children }) {
  React.useEffect(function () {
    if (!open) return;
    const k = function (e) { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k); return function () { window.removeEventListener('keydown', k); };
  }, [open]);
  if (!open) return null;
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__box" style={{ '--mw': width + 'px' }} onClick={function (e) { e.stopPropagation(); }} role="dialog" aria-modal="true">
        <div className="modal__head"><div>{title && <h3 className="modal__title">{title}</h3>}{sub && <p className="modal__sub">{sub}</p>}</div><button type="button" className="modal__close" onClick={onClose} aria-label="Close"><Icon name="x" /></button></div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}

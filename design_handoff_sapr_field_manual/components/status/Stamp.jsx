export function Stamp({ tone = 'stamp', size = 'md', rotate = -8, animate = true, className = '', style, children }) {
  const ref = React.useRef(null);
  const [state, setState] = React.useState(animate ? 'pending' : 'static');
  React.useEffect(function () {
    if (!animate || !ref.current || typeof IntersectionObserver === 'undefined') { setState('static'); return; }
    const io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { setState('in'); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(ref.current); return function () { io.disconnect(); };
  }, [animate]);
  const cls = ['stamp', tone !== 'stamp' ? 'stamp--' + tone : '', size !== 'md' ? 'stamp--' + size : '', state === 'pending' ? 'stamp--pending' : state === 'in' ? 'stamp--in' : '', className].filter(Boolean).join(' ');
  return <span ref={ref} className={cls} style={Object.assign({ '--rot': rotate + 'deg' }, style)}>{children}</span>;
}

export function Reveal({ as = 'div', delay = 0, className = '', style, children, ...rest }) {
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(function () {
    if (!ref.current || typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    io.observe(ref.current); return function () { io.disconnect(); };
  }, []);
  const Tag = as;
  return <Tag ref={ref} className={('reveal ' + (seen ? 'is-in ' : '') + className).trim()} style={Object.assign({ '--delay': delay + 's' }, style)} {...rest}>{children}</Tag>;
}
export function CountUp({ value = 0, duration = 1200 }) {
  const ref = React.useRef(null);
  const [n, setN] = React.useState(value);
  React.useEffect(function () {
    if (!ref.current || typeof IntersectionObserver === 'undefined') return;
    let raf;
    const io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; io.disconnect();
      const t0 = performance.now();
      const f = function (now) { const p = Math.min(1, (now - t0) / duration); setN(Math.round(value * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(f); };
      setN(0); raf = requestAnimationFrame(f);
    }, { threshold: 0.3 });
    io.observe(ref.current); return function () { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);
  return <span ref={ref}>{n.toLocaleString()}</span>;
}

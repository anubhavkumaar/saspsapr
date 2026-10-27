function toPascal(n) { return String(n).replace(/(^|-)([a-z0-9])/g, function (_, __, c) { return c.toUpperCase(); }); }
export function Icon({ name, size = 16, strokeWidth = 2, className = '', style }) {
  const lib = typeof window !== 'undefined' && window.lucide && window.lucide.icons;
  let node = lib ? lib[toPascal(name)] : null;
  if (node && node[0] === 'svg') node = node[2];
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={('lucide lucide-' + name + ' ' + className).trim()} style={Object.assign({ width: size, height: size }, style)} aria-hidden="true">
      {(node || []).map(function (c, i) { return React.createElement(c[0], Object.assign({ key: i }, c[1])); })}
    </svg>
  );
}

// Zone radar: 5s sweep, pulsing blips (hunt = red triangle, fish = blue circle). `active` / `onSelect` link it to ZoneList.
export function Radar({ zones = [], active, onSelect, label = 'N', legend = true, size }) {
  const h = zones.filter(z => z.kind === 'hunt').length
  const f = zones.length - h
  const select = name => { if (onSelect) onSelect(name) }
  return (
    <div style={size ? { width: size, maxWidth: '100%' } : undefined}>
      <div className="radar" role="group" aria-label={'Zone radar: ' + h + ' hunting zones, ' + f + ' fishing zones'}>
        <div className="radar__rings"/><div className="radar__cross"/><div className="radar__sweep"/><span className="radar__n">{label}</span>
        {zones.map((z, i) => (
          <button key={z.name} type="button" className={'radar__blip radar__blip--' + z.kind + (active === z.name ? ' is-on' : '')}
            style={{ left: z.x + '%', top: z.y + '%', '--d': ((i * 0.37) % 2.6) + 's' }}
            onMouseEnter={() => select(z.name)} onMouseLeave={() => select(null)} onFocus={() => select(z.name)} onBlur={() => select(null)}
            aria-label={z.name}><i/><span className="radar__tip">{z.name}</span></button>
        ))}
      </div>
      {legend && (
        <div className="radar__foot">
          <span><span className="mk mk--hunt" style={{ width: 12, height: 12, padding: 0 }}/>{h} Hunting Zones</span>
          <span><span className="mk mk--fish" style={{ width: 12, height: 12 }}/>{f} Fishing Zones</span>
          <span style={{ marginLeft: 'auto', color: 'var(--ink-3)' }}>Approximate positions</span>
        </div>
      )}
    </div>
  )
}

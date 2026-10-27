import { Label } from '../status/Label.jsx'
import { useInView } from '../motion/useInView.js'

const initials = name => name.split(' ').map(w => w[0]).join('').slice(0, 2)

// sections: { section, count?, people: { id?, name, initials?, callSign?, rank?, dept?, status?, statusTone?, muted?, meta?, tags? }[] }[]
// `count` replaces the default "N officers" note in the section band; `meta` is a detail block under the name;
// `tags` appends extra labels after dept/status; `muted` dims a row (a vacant slot).
// Section bands and rows slide in one after another; --i is the running index across the whole list.
export function Roster({ sections = [] }) {
  const [ref, iv] = useInView(0.15)
  let k = 0
  return (
    <div ref={ref} className={'roster' + iv}>
      {sections.map(s => {
        const p = s.people || []
        const head = k++
        return (
          <div key={s.section} className="roster__sec">
            <h4 style={{ '--i': head }}>{s.section}<em>{s.count ?? `${p.length} officer${p.length !== 1 ? 's' : ''}`}</em></h4>
            {p.length ? p.map((o, i) => (
              <div key={o.id ?? i} className={'roster__p' + (o.muted ? ' roster__p--muted' : '')} style={{ '--i': k++ }}>
                <span className="roster__av">{o.initials ?? initials(o.name)}</span>
                <div><b>{o.name}</b><small>{[o.callSign, o.rank].filter(Boolean).join(' · ')}</small>{o.meta}</div>
                <span className="roster__tags">
                  {o.dept && <Label>{o.dept}</Label>}
                  {o.status && <Label tone={o.statusTone}>{o.status}</Label>}
                  {o.tags}
                </span>
              </div>
            )) : <div className="roster__empty" style={{ '--i': k++ }}>No personnel assigned</div>}
          </div>
        )
      })}
    </div>
  )
}

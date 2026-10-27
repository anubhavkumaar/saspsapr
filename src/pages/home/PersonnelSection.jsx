import { useState } from 'react'
import { Link } from 'react-router-dom'
import { resolvePhotoUrl } from '../../lib/photo'
import { badgeNumber, groupBySection, initialsOf, isVacant, rosterBadge, rosterRank, useSelfProfiles, withSelfProfile } from '../../lib/roster'
import { Empty, Reveal, Section, SectionHeader } from '../../components'

// The faces behind the record: the same live roster grouped by rank tier, as ID plates, one block per rank. A member's
// photo fills the window when one exists; until then the plate shows initials, so an unfilled slot
// still reads as a slot. Each plate opens that ranger's own page.
function Plate({ m }) {
  const name  = (m.name || '').trim()
  const photo = resolvePhotoUrl(m.photo)
  // Photos are links to third-party hosts; when one has gone dead the plate falls back to initials.
  const [failed, setFailed] = useState('')
  const shot = photo && failed !== photo ? photo : ''
  return (
    <li>
      <Link to={`/${encodeURIComponent(badgeNumber(m))}`} className="plate" aria-label={`Open profile for ${name}`}>
        <span className="plate__win">
          {shot ? <img src={shot} alt="" loading="lazy" onError={() => setFailed(shot)}/> : <span className="plate__ini" aria-hidden="true">{initialsOf(name) || '—'}</span>}
          <span className="plate__badge">{rosterBadge(m) || '—'}</span>
        </span>
        <span className="plate__body">
          <span className="plate__name">{name}</span>
          <span className="plate__rank">{rosterRank(m) || '—'}</span>
        </span>
      </Link>
    </li>
  )
}

export function PersonnelSection({ roster }) {
  const selfMap = useSelfProfiles()
  const { members, sections, loaded } = roster
  const grouped = groupBySection(withSelfProfile(members, selfMap), sections)

  return (
    <Section id="personnel">
      <Reveal><SectionHeader num="07" eyebrow="Active Personnel" title="Personnel" sub="Every serving ranger and every reserved badge, by rank"/></Reveal>
      {!loaded && (
        <ul className="plate-grid" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => <li key={i} className="plate plate--loading"><span className="plate__win"/></li>)}
        </ul>
      )}
      {loaded && grouped.length === 0 && (
        <Empty>
          No personnel published yet<br/>
          Rangers added in the admin roster panel appear here immediately.
        </Empty>
      )}
      <div className="plates">
        {grouped.map((g, gi) => {
          const sworn = g.members.filter(m => !isVacant(m))
          const open  = g.members.filter(isVacant)
          return (
            <Reveal key={g.name} delay={Math.min(gi * 0.06, 0.24)} className="plate-group">
              <div className="plate-group__head"><span>{g.name}</span><em>{g.members.length}</em></div>
              {sworn.length > 0 && <ul className="plate-grid">{sworn.map((m, i) => <Plate key={m.id || i} m={m}/>)}</ul>}
              {open.length > 0 && (
                <p className="plate-open">
                  <span className="plate-open__k">Open</span>
                  {open.map((m, i) => <span key={m.id || i} className="plate-open__slot"><b>{rosterBadge(m) || '—'}</b>{rosterRank(m)}</span>)}
                </p>
              )}
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}

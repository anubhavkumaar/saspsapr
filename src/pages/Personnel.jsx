import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { resolvePhotoUrl } from '../lib/photo'
import {
  ROSTER_CERTS, asList, daysSince, fmtDays, fmtRosterDate, initialsOf, isVacant, rosterBadge, rosterCallsigns, rosterCerts, rosterRank, useRosterMember,
} from '../lib/roster'
import { Button, ChipGroup, Chip, Empty, FormBlock, Label, Panel, Photo, Reveal, Section, SectionHeader, Split, SubHeading } from '../components'

// A ranger's own page, reached by its own URL (/701, /personnel/701, or a custom callsign) so it can be linked and shared.
// Mounted per badge so moving from one ranger to another never shows the previous record.
export default function Personnel() {
  const { badge, callsign } = useParams()
  const param = callsign || badge
  return <PersonnelRecord key={param} param={param}/>
}

const dated = (date, tail) => {
  if (!date) return '—'
  const days = daysSince(date)
  return days === null ? fmtRosterDate(date) : `${fmtRosterDate(date)} · ${fmtDays(days)} ${tail}`
}

function PersonnelRecord({ param }) {
  const m = useRosterMember(param)
  const [shot,   setShot]   = useState(0)
  const [failed, setFailed] = useState('')   // a photo link that has gone dead falls back to the initials

  if (m === undefined) return <Section tight><Empty>Loading personnel record…</Empty></Section>

  if (m === null) return (
    <Section tight>
      <SectionHeader num="404" eyebrow="Personnel" title="No such badge"/>
      <Empty>No personnel record matches <code>{param}</code>.</Empty>
      <div style={{ marginTop: 24 }}><Button as={Link} to="/personnel" variant="ghost" icon={ArrowLeft}>Personnel</Button></div>
    </Section>
  )

  const vacant = isVacant(m)
  const gallery = [...new Set([m.photo, ...(Array.isArray(m.photos) ? m.photos : [])].filter(Boolean).map(resolvePhotoUrl))]
  const active = gallery[Math.min(shot, Math.max(gallery.length - 1, 0))] || ''
  const showing = active && failed !== active ? active : ''

  const facts = [
    { k: 'Badge',         v: rosterBadge(m) || '—' },
    { k: 'Callsign',      v: rosterCallsigns(m).join(' · ') || '—' },
    { k: 'Rank',          v: rosterRank(m) || '—' },
    { k: 'Section',       v: m.section || '—' },
    { k: 'CID',           v: m.cid || '—' },
    { k: 'Date of birth', v: m.dob || '—' },
    { k: 'Title',         v: m.title || '—' },
    { k: 'Joined',        v: dated(m.joinDate, 'in dept') },
    { k: 'Promoted',      v: dated(m.promoDate, 'ago') },
  ]
  const tags       = asList(m.tags)
  const licences   = asList(m.licenses)
  const vehicles   = asList(m.vehicles)
  const properties = asList(m.properties)
  const certs      = rosterCerts(m)
  const chips = list => <ChipGroup>{list.map(t => <Chip key={t}>{t}</Chip>)}</ChipGroup>

  return (
    <Section tight id="personnel-record">
      <div style={{ marginBottom: 28 }}><Button as={Link} to="/personnel" size="sm" variant="ghost" icon={ArrowLeft}>Personnel</Button></div>
      <Reveal>
        <SectionHeader num={rosterBadge(m) || '—'} eyebrow={rosterRank(m) || undefined} title={vacant ? 'Unassigned' : m.name}
          aside={<Label>{vacant ? 'Vacant' : (m.status || '—')}</Label>}/>
      </Reveal>

      <Split variant="wide-right">
        <Reveal>
          <div className="pp-shots">
            <Photo ratio="4/5" caption={rosterRank(m) || undefined}>
              {showing
                ? <img src={showing} alt={`${m.name}, ${rosterRank(m)}`} onError={() => setFailed(showing)}/>
                : <span className="pp-ini" aria-hidden="true">{initialsOf(m.name) || '—'}</span>}
            </Photo>
            {gallery.length > 1 && (
              <div className="pp-thumbs" role="tablist" aria-label="Photographs">
                {gallery.map((url, i) => (
                  <button key={url} type="button" role="tab" aria-selected={i === shot} className={i === shot ? 'is-on' : ''} onClick={() => setShot(i)}>
                    <img src={url} alt="" loading="lazy"/><b>{i + 1}</b>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="pp-body">
            {tags.length > 0 && <div className="pp-tags">{tags.map(t => <Label key={t}>{t}</Label>)}</div>}
            {m.bio && <p className="pp-bio">{m.bio}</p>}

            <div><SubHeading>Service Record</SubHeading><FormBlock rows={facts}/></div>

            <div>
              <SubHeading>Certifications</SubHeading>
              {certs.length
                ? <div className="pp-tags">{ROSTER_CERTS.filter(c => certs.includes(c)).map(c => <Label key={c}>{c}</Label>)}</div>
                : <p className="t-small">none</p>}
            </div>

            {licences.length > 0 && <div><SubHeading>Licences</SubHeading>{chips(licences)}</div>}
            {vehicles.length > 0 && <div><SubHeading>Registered vehicles <em className="pp-n">{vehicles.length}</em></SubHeading>{chips(vehicles)}</div>}
            {properties.length > 0 && <div><SubHeading>Properties</SubHeading>{chips(properties)}</div>}
            {m.notes && <div><SubHeading>Notes</SubHeading><Panel><p className="pp-notes">{m.notes}</p></Panel></div>}
          </div>
        </Reveal>
      </Split>
    </Section>
  )
}

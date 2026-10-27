import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import logoLockup from '../../assets/Ci37hio.png'
import { fmtDate } from '../../lib/dates'
import { useMdtEntries } from '../../lib/mdt'
import { mdtToasts } from '../../lib/mdtToasts'
import { ROSTER_CERTS, fmtDays, fmtRosterDate, daysSince, groupBySection, initialsOf, isVacant, rosterBadge, rosterCerts, rosterRank } from '../../lib/roster'
import { Button, Empty, Label, MdtEntry, MdtPhone, Reveal, Roster, Section, SectionHeader, Segmented, Split, Tally } from '../../components'

// Date over its derived age — time in department / since promotion are never stored, so they never go stale.
const datedBit = (label, date) => {
  if (!date) return null
  const days = daysSince(date)
  return `${label} ${fmtRosterDate(date)}${days !== null ? ' · ' + fmtDays(days) : ''}`
}

function toPerson(m) {
  const vacant = isVacant(m)
  const certs  = vacant ? [] : rosterCerts(m)
  const bits   = vacant ? [] : [m.cid && `CID ${m.cid}`, m.title, datedBit('Joined', m.joinDate), datedBit('Promoted', m.promoDate)].filter(Boolean)
  const meta = (bits.length || certs.length) ? (
    <div className="roster__meta">
      {bits.map(b => <span key={b}>{b}</span>)}
      {certs.length > 0 && <span className="roster__certs">{ROSTER_CERTS.filter(c => certs.includes(c)).map(c => <Label key={c}>{c}</Label>)}</span>}
    </div>
  ) : null
  return {
    id: m.id,
    name: vacant ? 'Unassigned' : m.name,
    initials: vacant ? '—' : initialsOf(m.name),
    callSign: rosterBadge(m) || '—',
    rank: rosterRank(m),
    status: vacant ? 'Vacant' : (m.status || undefined),
    muted: vacant,
    meta,
  }
}

// The department sheet leads with a Ranger Count; this is that number plus the breakdown it implies.
// Zero-valued states are dropped rather than shown as 0.
function rosterStats(members) {
  const sworn = members.filter(m => !isVacant(m))
  return [
    { value: sworn.length, label: sworn.length === 1 ? 'ranger on the books' : 'rangers on the books' },
    { value: sworn.filter(m => m.status === 'Active').length,   label: 'Active' },
    { value: sworn.filter(m => m.status === 'Inactive').length, label: 'Inactive' },
    { value: sworn.filter(m => m.status === 'LOA').length,      label: 'On LOA' },
    { value: members.length - sworn.length,                     label: 'Open slots' },
  ].filter((t, i) => i === 0 || t.value > 0)
}

const MDT_ON_HOME = 25

export function RosterSection({ roster }) {
  const { members, sections, loaded } = roster
  const entries = useMdtEntries()
  const [mf, setMf] = useState('all')
  const toasts = useMemo(() => mdtToasts(entries), [entries])   // the phone keeps dropping alerts from the latest real entries

  const grouped = groupBySection(members, sections)
  const rows = grouped.map(g => ({
    section: g.name,
    count: `${g.members.filter(m => !isVacant(m)).length} of ${g.members.length} filled`,
    people: g.members.map(toPerson),
  }))
  const shown = entries.filter(m => mf === 'all' || m.type === mf).slice(0, MDT_ON_HOME)

  return (
    <Section id="roster" alt>
      <Reveal><SectionHeader num="06" eyebrow="Active Personnel" title="Department Roster" sub="Every badge in the San Andreas Park Rangers — updated in real time"/></Reveal>
      {loaded && members.length > 0 && <Reveal style={{ marginBottom: 40 }}><Tally items={rosterStats(members)}/></Reveal>}
      <Split>
        <Reveal>
          {!loaded ? <Empty>Loading roster…</Empty>
            : rows.length === 0 ? (
              <Empty>
                No badges published yet<br/>
                Rangers added in the admin roster panel appear here immediately — no redeploy needed.
              </Empty>
            ) : <Roster sections={rows}/>}
        </Reveal>
        <Reveal delay={0.1} className="sticky-col">
          <MdtPhone className="phone--compact" logo={logoLockup} eyebrow="Mobile Data Terminal" title="MDT & Warning Log" foot="Linked by Citizen ID" toasts={toasts} toastEvery={7000}>
            <Segmented value={mf} onChange={setMf} options={[{ value: 'all', label: 'All' }, { value: 'mdt', label: 'MDT' }, { value: 'warning', label: 'Warnings', tone: 'warn' }]}/>
            {shown.length
              ? shown.map((m, i) => (
                <MdtEntry key={m.id + mf} type={m.type} citizenId={m.citizenId || m.mdtNumber} officer={m.submittedBy} date={fmtDate(m.date)} notes={m.notes}
                  style={{ animationDelay: (i * 0.06) + 's' }}/>
              ))
              : <div className="empty" style={{ margin: 16 }}>No MDT entries logged yet.</div>}
            <div style={{ padding: 16 }}><Button as={Link} to="/fieldwork" variant="ghost" size="sm" block iconRight={ArrowRight}>Open Field Work</Button></div>
          </MdtPhone>
        </Reveal>
      </Split>
    </Section>
  )
}

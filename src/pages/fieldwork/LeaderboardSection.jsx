import { Trophy } from 'lucide-react'
import { fmtDate } from '../../lib/dates'
import { Alert, Empty, Leaderboard, Reveal, Section, SectionHeader } from '../../components'

// Contribution Leaderboard — computed from the evidence documents: submissions per uploader, last active date.
function rank(images) {
  const by = images.reduce((acc, img) => {
    const name = img.uploadedBy || 'Unknown'
    if (!acc[name]) acc[name] = { count: 0, last: '' }
    acc[name].count++
    if (!acc[name].last || (img.date && img.date > acc[name].last)) acc[name].last = img.date || ''
    return acc
  }, {})
  return Object.entries(by)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([name, s]) => ({ name, count: s.count, last: s.last ? fmtDate(s.last) : '' }))
}

export function LeaderboardSection({ images }) {
  const rows = rank(images)
  return (
    <Section id="leaderboard">
      <Reveal>
        <SectionHeader num="LB" eyebrow="Officer Activity" eyebrowTone="gold" title="Contribution Leaderboard"
          sub="Ranked by evidence submissions — every upload adds to the department's field record"/>
      </Reveal>
      {rows.length === 0
        ? <Empty>No submissions yet. Be the first to upload evidence.</Empty>
        : <Reveal><Leaderboard rows={rows}/></Reveal>}
      <Reveal style={{ marginTop: 28 }}>
        <Alert tone="warn" icon={Trophy}>Rankings update in real time. Submit evidence through the gallery above — each documented violation goes on the department's field record.</Alert>
      </Reveal>
    </Section>
  )
}

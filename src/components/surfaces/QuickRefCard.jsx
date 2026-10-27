import { Card, CardFoot, Facts, Equipment } from './Card.jsx'

export function QuickRefCard({ tone = 'forest', icon, title, meta, facts = [], allowed, prohibited, footTitle, foot }) {
  return (
    <Card tone={tone} icon={icon} title={title} meta={meta}>
      <Facts items={facts}/>
      {(allowed || prohibited) && <Equipment allowed={allowed} prohibited={prohibited}/>}
      {foot && <CardFoot title={footTitle}>{foot}</CardFoot>}
    </Card>
  )
}

export function QuickRefGrid({ children }) {
  return <div className="qr-grid">{children}</div>
}

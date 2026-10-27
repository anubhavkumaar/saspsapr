import { Clock, Link2, MessageSquare } from 'lucide-react'
import { Icon } from '../icons/Icon.jsx'
import { Label } from '../status/Label.jsx'

// tags: { label, tone }[]. `muted` dims finished applications; `linked` marks a linked account.
export function ApplicationCard({ name, citizenId, department, rank, tags = [], muted = false, linked = false, why, availability, discord, onClick }) {
  return (
    <button type="button" className={'app' + (muted ? ' app--muted' : '')} onClick={onClick}>
      <div className="app__head">
        <div>
          <span className="app__name">{name}</span>
          <span className="app__cid">CID: {citizenId} · {department}{rank ? ' · ' + rank : ''}</span>
        </div>
        <div className="app__tags">
          {tags.map(t => <Label key={t.label} tone={t.tone}>{t.label}</Label>)}
          {linked && <Label tone="info"><Icon icon={Link2} size={12}/>Linked</Label>}
        </div>
      </div>
      {why && <p className="app__why">{why}</p>}
      <div className="app__foot">
        {availability && <span><Icon icon={Clock} size={13}/>{availability}</span>}
        {discord && <span><Icon icon={MessageSquare} size={13}/>{discord}</span>}
      </div>
    </button>
  )
}

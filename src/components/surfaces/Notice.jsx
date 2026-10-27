import { Check } from 'lucide-react'
import { Icon } from '../icons/Icon.jsx'
import { Stamp } from '../status/Stamp.jsx'
import { useInView } from '../motion/useInView.js'

export function PinList({ items = [], icon = Check }) {
  const [ref, iv] = useInView(0.2)
  return <ul ref={ref} className={'pins' + iv}>{items.map((t, i) => <li key={i} style={{ '--i': i }}><Icon icon={icon}/>{t}</li>)}</ul>
}

// The forest offset shadow settles into place when the notice scrolls into view.
export function Notice({ eyebrow, title, lead, action, items = [], stamp }) {
  const [ref, iv] = useInView(0.25)
  return (
    <div ref={ref} className={'notice' + iv}>
      {stamp && <span className="notice__stamp"><Stamp rotate={-6}>{stamp}</Stamp></span>}
      <div>
        {eyebrow && <span className="sh__eb">{eyebrow}</span>}
        <h2 className="notice__title">{title}</h2>
        {lead && <p className="notice__lead">{lead}</p>}
        {action}
      </div>
      {items.length > 0 && <PinList items={items}/>}
    </div>
  )
}

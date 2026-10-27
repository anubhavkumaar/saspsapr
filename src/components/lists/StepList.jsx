import { useInView } from '../motion/useInView.js'

export function StepList({ steps = [] }) {
  const [ref, iv] = useInView(0.2)
  return <ol ref={ref} className={'steps' + iv}>{steps.map((s, i) => <li key={i} style={{ '--i': i }}>{s}</li>)}</ol>
}

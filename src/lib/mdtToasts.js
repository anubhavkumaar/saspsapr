import { FileText, TriangleAlert } from 'lucide-react'
import { fmtDate } from './dates'

// The phone's alerts, made from the most recent real MDT entries — not sample text. Memoise the result: the phone restarts its timer when it changes.
export const mdtToasts = entries => entries.slice(0, 3).map(e => ({
  icon: e.type === 'warning' ? TriangleAlert : FileText,
  title: (e.type === 'warning' ? 'Warning issued' : 'MDT filed') + ' · CID ' + (e.citizenId || e.mdtNumber || '—'),
  sub: [e.submittedBy, fmtDate(e.date)].filter(Boolean).join(' · '),
}))

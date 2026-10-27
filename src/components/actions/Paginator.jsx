import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from './Button.jsx'

export function Paginator({ page = 0, totalPages = 1, onChange = () => {} }) {
  if (totalPages <= 1) return null
  return (
    <div className="paginator">
      <Button variant="ghost" size="sm" icon={ArrowLeft} disabled={page === 0} onClick={() => onChange(page - 1)}>Prev</Button>
      <span>Page {page + 1} of {totalPages}</span>
      <Button variant="ghost" size="sm" iconRight={ArrowRight} disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)}>Next</Button>
    </div>
  )
}

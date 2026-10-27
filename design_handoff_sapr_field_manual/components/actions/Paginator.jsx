import { Button } from './Button.jsx';
export function Paginator({ page = 0, totalPages = 1, onChange = function () {} }) {
  if (totalPages <= 1) return null;
  return (
    <div className="paginator">
      <Button variant="ghost" size="sm" icon="arrow-left" disabled={page === 0} onClick={function () { onChange(page - 1); }}>Prev</Button>
      <span>Page {page + 1} of {totalPages}</span>
      <Button variant="ghost" size="sm" iconRight="arrow-right" disabled={page >= totalPages - 1} onClick={function () { onChange(page + 1); }}>Next</Button>
    </div>
  );
}

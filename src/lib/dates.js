// Today in IST (UTC+5:30) as YYYY-MM-DD — the default date on evidence and MDT forms.
export const getISTDate = () => {
  const ist = new Date(Date.now() + 330 * 60 * 1000)
  return ist.toISOString().split('T')[0]
}

// YYYY-MM-DD → "27 Mar 2026"
export const fmtDate = s => {
  if (!s) return ''
  const [y, m, d] = s.split('-')
  return `${d} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m - 1]} ${y}`
}

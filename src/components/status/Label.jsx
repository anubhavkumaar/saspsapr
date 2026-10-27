// Bordered mono tag. Tone defaults to the lower-cased text (Felony, Active, LOA…), see .lbl--* in sapr.css.
export function Label({ tone, children }) {
  const t = tone || String(children || '').toLowerCase().replace(/[^a-z]/g, '')
  return <span className={'lbl lbl--' + t}>{children}</span>
}

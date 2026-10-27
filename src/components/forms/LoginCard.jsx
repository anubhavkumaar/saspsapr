import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Input } from './Input.jsx'
import { Button } from '../actions/Button.jsx'

// Email + password form. Controlled here; onSubmit({ email, password }) may be async.
export function LoginForm({ error, busy = false, submitLabel = 'Sign In', onSubmit, autoFocus = false }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const submit = e => {
    e.preventDefault()
    if (onSubmit) onSubmit({ email, password })
  }
  return (
    <form className="form-stack" onSubmit={submit}>
      <Input type="email" placeholder="Email" required autoFocus={autoFocus} value={email} onChange={e => setEmail(e.target.value)}/>
      <Input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)}/>
      {error && <span className="field__err">{error}</span>}
      <Button type="submit" block iconRight={ArrowRight} disabled={busy}>{submitLabel}</Button>
    </form>
  )
}

export function LoginCard({ eyebrow = 'Management Access', title = 'SAPR Admin', sub, error, busy, submitLabel, onSubmit }) {
  return (
    <div className="login">
      <div className="login__head">
        <div className="sh__eb">{eyebrow}</div>
        <h2 className="sh__title" style={{ fontSize: 44, marginTop: 8 }}>{title}</h2>
        {sub && <p className="field__hint" style={{ marginTop: 6, fontSize: 14 }}>{sub}</p>}
      </div>
      <div className="login__body">
        <LoginForm error={error} busy={busy} submitLabel={submitLabel} onSubmit={onSubmit} autoFocus/>
      </div>
    </div>
  )
}

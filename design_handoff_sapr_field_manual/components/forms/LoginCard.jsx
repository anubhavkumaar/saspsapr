import { Input } from './Input.jsx';
import { Button } from '../actions/Button.jsx';
export function LoginCard({ eyebrow = 'Management Access', title = 'SAPR Admin', sub, error, submitLabel = 'Sign In', onSubmit, defaultEmail = '', defaultPassword = '' }) {
  return (
    <div className="login">
      <div className="login__head"><div className="sh__eb">{eyebrow}</div><h2 className="sh__title" style={{ fontSize: 44, marginTop: 8 }}>{title}</h2>{sub && <p className="field__hint" style={{ marginTop: 6, fontSize: 14 }}>{sub}</p>}</div>
      <form className="login__body form-stack" onSubmit={function (e) { e.preventDefault(); if (onSubmit) onSubmit(e); }}>
        <Input type="email" placeholder="Email" required defaultValue={defaultEmail} />
        <Input type="password" placeholder="Password" required defaultValue={defaultPassword} />
        {error && <span className="field__err">{error}</span>}
        <Button type="submit" block iconRight="arrow-right">{submitLabel}</Button>
      </form>
    </div>
  );
}

export function Field({ label, required = false, hint, error, children }) {
  return <label className="field"><span className="field__label">{label}{required && <span className="req"> *</span>}</span>{children}{hint && <span className="field__hint">{hint}</span>}{error && <span className="field__err">{error}</span>}</label>;
}
export function FieldRow({ cols = 2, children }) { return <div className="field-row" style={{ '--cols': cols }}>{children}</div>; }
export function FormStack({ onSubmit, children }) { return <form className="form-stack" onSubmit={function (e) { e.preventDefault(); if (onSubmit) onSubmit(e); }}>{children}</form>; }

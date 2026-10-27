import { TriangleAlert } from 'lucide-react'
import { Button, Icon } from '../components'

// Shown when an account is blocked — copy verbatim from the original.
export function RejectionNotice({ onDismiss }) {
  return (
    <div className="login" style={{ maxWidth: 520 }} role="alertdialog" aria-labelledby="rejection-title">
      <div className="login__head">
        <div className="sh__eb sh__eb--stamp" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon icon={TriangleAlert}/>Application Status</div>
        <h2 id="rejection-title" className="sh__title" style={{ fontSize: 40, marginTop: 8 }}>Sorry, your application was rejected.</h2>
      </div>
      <div className="login__body form-stack">
        <p>
          After review, your application to join the San Andreas Park Rangers was not successful.
          Your credentials have been deactivated.
        </p>
        <p className="t-small">If you believe this is in error, contact SAPR management on Discord.</p>
        <div><Button variant="danger" onClick={onDismiss}>Dismiss</Button></div>
      </div>
    </div>
  )
}

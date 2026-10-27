import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { LoginForm, Modal } from '../components'

// Real Firebase sign-in in the design's Modal. Closes itself on success.
export function LoginModal({ open, onClose, title = 'Officer Login', sub }) {
  const [err,  setErr]  = useState('')
  const [busy, setBusy] = useState(false)

  const close = () => { setErr(''); onClose() }
  const submit = async ({ email, password }) => {
    setErr(''); setBusy(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      close()
    } catch { setErr('Invalid email or password.') }
    finally { setBusy(false) }
  }

  return (
    <Modal open={open} onClose={close} title={title} sub={sub}>
      <LoginForm error={err} busy={busy} onSubmit={submit} autoFocus/>
    </Modal>
  )
}

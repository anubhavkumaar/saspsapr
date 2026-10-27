import { useState, useEffect } from 'react'
import { EmailAuthProvider, reauthenticateWithCredential, signOut, updatePassword } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { KeyRound, X } from 'lucide-react'
import { auth, db } from '../firebase'
import { userDocId } from '../lib/auth'
import { resolvePhotoUrl } from '../lib/photo'
import { initialsOf } from '../lib/roster'
import { Alert, Button, Field, FieldRow, Icon, Input, Textarea } from '../components'

// Self-service profile: photo, display name, callsign, bio, and password change.
// Same writes as before — sapr_users merge for the profile; reauth + updatePassword + passwordChangedAt for the password.
// Lives in the account panel that drops from the header (AccountPanel), so it is one narrow column: who you are, the profile
// form, then the password. The panel keeps it mounted while closed, so a half-typed edit survives closing the panel.
export function ProfileEditor({ user, profile }) {
  const [name,    setName]    = useState('')
  const [call,    setCall]    = useState('')
  const [photo,   setPhoto]   = useState('')
  const [bio,     setBio]     = useState('')
  const [pwCur,   setPwCur]   = useState('')
  const [pw1,     setPw1]     = useState('')
  const [pw2,     setPw2]     = useState('')
  const [busy,    setBusy]    = useState(false)
  const [ok,      setOk]      = useState('')
  const [err,     setErr]     = useState('')
  const [showPw,  setShowPw]  = useState(false)
  const [last,    setLast]    = useState('profile')   // which section the saved / error message belongs under

  useEffect(() => {
    setName(profile?.displayName || '')
    setCall(profile?.callsign    || '')
    setPhoto(profile?.photoUrl   || '')
    setBio(profile?.bio          || '')
  }, [profile?.displayName, profile?.callsign, profile?.photoUrl, profile?.bio])

  const full    = (profile?.displayName || user.email || '').trim()
  const surname = full.split(/\s+/).filter(Boolean).pop() || full.split('@')[0]
  const avatar  = resolvePhotoUrl(photo || profile?.photoUrl)

  const saveProfile = async e => {
    e.preventDefault(); setLast('profile'); setErr(''); setOk(''); setBusy(true)
    try {
      await setDoc(doc(db, 'sapr_users', userDocId(user.email)), {
        displayName: name.trim(),
        callsign:    call.trim(),
        photoUrl:    photo.trim(),
        bio:         bio.trim(),
        email:       user.email,
        profileUpdatedAt: serverTimestamp(),
      }, { merge: true })
      setOk('Profile saved.')
    } catch (e) { setErr(e.message || 'Failed to save profile.') }
    finally   { setBusy(false) }
  }

  const changePassword = async e => {
    e.preventDefault(); setLast('password'); setErr(''); setOk('')
    if (!pwCur)         return setErr('Enter your current password.')
    if (pw1.length < 6) return setErr('New password must be at least 6 characters.')
    if (pw1 !== pw2)    return setErr('New passwords do not match.')
    if (pw1 === pwCur)  return setErr('New password must differ from current password.')
    setBusy(true)
    try {
      const cred = EmailAuthProvider.credential(auth.currentUser.email, pwCur)
      await reauthenticateWithCredential(auth.currentUser, cred)
      await updatePassword(auth.currentUser, pw1)
      await setDoc(doc(db, 'sapr_users', userDocId(user.email)), {
        passwordChangedAt: serverTimestamp(),
      }, { merge: true })
      setOk('Password updated. Signing out of all sessions…'); setPwCur(''); setPw1(''); setPw2('')
      try { localStorage.removeItem(`sapr_pwSeen_${auth.currentUser.uid}`) } catch { /* storage unavailable */ }
      setTimeout(() => { signOut(auth).catch(() => {}) }, 1200)
    } catch (e) {
      setErr(e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential'
        ? 'Current password is incorrect.'
        : (e.message || 'Failed to update password.'))
    }
    finally { setBusy(false) }
  }

  const notes = <>
    {ok  && <Alert tone="ok">{ok}</Alert>}
    {err && <Alert>{err}</Alert>}
  </>

  return (
    <>
      <div className="acct__who">
        <span className="avatar">
          {avatar
            ? <img src={avatar} alt="" onError={e => { e.currentTarget.style.display = 'none' }}/>
            : initialsOf(full) || '—'}
        </span>
        <div className="acct__who-text">
          <div className="acct__name">Ranger {surname}</div>
          <div className="t-mono acct__mail">{user.email}</div>
        </div>
      </div>

      <form className="acct__sec form-stack" onSubmit={saveProfile}>
        <Field label="Profile Picture — vgy.me or image URL">
          <Input value={photo} onChange={e => setPhoto(e.target.value)} placeholder="https://vgy.me/image/abcdef  or  https://i.vgy.me/abc.png"/>
        </Field>
        <FieldRow cols={2}>
          <Field label="Display Name">
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Jordan Pike" required/>
          </Field>
          <Field label="Callsign">
            <Input value={call} onChange={e => setCall(e.target.value)} placeholder="e.g. SAPR-14"/>
          </Field>
        </FieldRow>
        <Field label="About You — shown on your personnel profile">
          <Textarea rows={4} value={bio} onChange={e => setBio(e.target.value)} placeholder="What you do in the department, what you're known for, what you enjoy…"/>
        </Field>
        {last === 'profile' && notes}
        <div><Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save Profile'}</Button></div>
      </form>

      <div className="acct__sec form-stack">
        <div className="acct__title">Password</div>
        {!showPw ? (
          <>
            <p className="t-small">Changing your password signs you out of every session.</p>
            <div><Button variant="ghost" size="sm" icon={KeyRound} onClick={() => setShowPw(true)}>Reset Password</Button></div>
          </>
        ) : (
          <form className="form-stack" onSubmit={changePassword}>
            <div className="acct__pw-head">
              <span className="t-label">Change Password</span>
              <button type="button" className="modal__close" aria-label="Cancel"
                onClick={() => { setShowPw(false); setPwCur(''); setPw1(''); setPw2(''); setErr('') }}><Icon icon={X}/></button>
            </div>
            <Input type="password" value={pwCur} onChange={e => setPwCur(e.target.value)} placeholder="Current password" autoComplete="current-password"/>
            <Input type="password" value={pw1}   onChange={e => setPw1(e.target.value)}   placeholder="New password (6+ chars)" autoComplete="new-password"/>
            <Input type="password" value={pw2}   onChange={e => setPw2(e.target.value)}   placeholder="Confirm new password" autoComplete="new-password"/>
            <div><Button type="submit" disabled={busy || !pwCur || !pw1}>Update Password</Button></div>
          </form>
        )}
        {last === 'password' && notes}
      </div>
    </>
  )
}

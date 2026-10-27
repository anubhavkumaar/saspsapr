import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { userDocId } from '../lib/auth'
import { RejectionNotice } from './RejectionNotice.jsx'

// Runs app-wide: whenever a signed-in user is marked role="blocked" in sapr_users,
// they're signed out immediately and a rejection notice is shown on every page.
export function BlockedGate() {
  const [user,    setUser]    = useState(null)
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u)
      if (!u) setBlocked(false)
    })
    return unsub
  }, [])

  useEffect(() => {
    if (!user) return
    const unsub = onSnapshot(doc(db, 'sapr_users', userDocId(user.email)), snap => {
      if (snap.exists() && snap.data().role === 'blocked') {
        setBlocked(true)
        signOut(auth).catch(() => {})
      }
    })
    return unsub
  }, [user])

  if (!blocked) return null
  return (
    <div className="modal">
      <RejectionNotice onDismiss={() => setBlocked(false)}/>
    </div>
  )
}

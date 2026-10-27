import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { userDocId } from './auth'

// The signed-in user's own sapr_users document (display name, callsign, photo, bio, role…), live.
// null while it loads, when nobody is signed in, or when the account has no document.
export function useMyProfile(user) {
  const [snap, setSnap] = useState({ email: null, data: null })
  useEffect(() => {
    if (!user) return
    return onSnapshot(doc(db, 'sapr_users', userDocId(user.email)), s => {
      setSnap({ email: user.email, data: s.exists() ? s.data() : null })
    })
  }, [user])
  return user && snap.email === user.email ? snap.data : null
}

// The application this account is linked to (set by management in the admin panel), live. null when there is none.
export function useLinkedApplication(applicationId) {
  const [snap, setSnap] = useState({ id: null, data: null })
  useEffect(() => {
    if (!applicationId) return
    return onSnapshot(doc(db, 'sapr_applications', applicationId), s => {
      setSnap({ id: applicationId, data: s.exists() ? s.data() : null })
    }, () => setSnap({ id: applicationId, data: null }))   // refused (applications are management-only): no linked application
  }, [applicationId])
  return applicationId && snap.id === applicationId ? snap.data : null
}

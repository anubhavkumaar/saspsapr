import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut, getAuth } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { initializeApp, getApps } from 'firebase/app'
import { db, auth, firebaseConfig } from '../firebase'

// Secondary Firebase app — creates new users without signing out the current admin
export const secondaryApp  = getApps().find(a => a.name === 'secondary') || initializeApp(firebaseConfig, 'secondary')
export const secondaryAuth = getAuth(secondaryApp)

/* ─── AUTH + ROLE HOOK ──────────────────────────────────── */
export const userDocId = email => (email || '').replace(/[@.]/g, '_')

export const MANAGEMENT_EMAIL = ['sapr@anubhav.gg', 'eddiebrock@sapr.gg']

// Static fallback — Firestore `users` collection is the live source of truth
export const USER_NAMES_FALLBACK = {
  'sapr@anubhav.gg':      'SAPR Management',
  'eddiebrock@sapr.gg':   'Eddie Brock',
  'sasp@sapr.gg':         'SASP High Command',
  'rickyshawn@saspr.gg':  'Ricky Shawn',
}

export const getDisplayName = (email, dynamicMap) =>
  (dynamicMap || {})[email] || USER_NAMES_FALLBACK[email] || email?.split('@')[0] || 'Unknown'

export function useAuthWithRole() {
  const [user,       setUser]       = useState(null)
  const [role,       setRole]       = useState(undefined)   // undefined = not loaded, null = no user doc
  const [authLoaded, setAuthLoaded] = useState(false)
  const [justBlocked,setJustBlocked]= useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u); setAuthLoaded(true)
      if (!u) { setRole(undefined); setJustBlocked(false) }
    })
    return unsub
  }, [])

  useEffect(() => {
    if (!user) return
    const sessionKey = `sapr_pwSeen_${user.uid}`
    let baseline = Number(localStorage.getItem(sessionKey) || 0)
    const unsub = onSnapshot(doc(db, 'sapr_users', userDocId(user.email)), snap => {
      const data = snap.exists() ? snap.data() : null
      const r = data?.role || null
      setRole(r)
      if (r === 'blocked') {
        setJustBlocked(true)
        signOut(auth).catch(() => {})
        return
      }
      const pwAt = data?.passwordChangedAt?.toMillis ? data.passwordChangedAt.toMillis() : 0
      if (!baseline && pwAt) {
        baseline = pwAt
        localStorage.setItem(sessionKey, String(pwAt))
      } else if (pwAt && pwAt > baseline) {
        localStorage.removeItem(sessionKey)
        signOut(auth).catch(() => {})
      }
    })
    return unsub
  }, [user])

  return { user, role, authLoaded, justBlocked, clearBlocked: () => setJustBlocked(false) }
}

// Effective role resolver — falls back to legacy email allowlist for management
export function effectiveRole(user, role) {
  if (!user) return null
  if (role) return role
  if (MANAGEMENT_EMAIL.includes(user.email)) return 'management'
  return null
}

// Convenience guard used by admin panels — accepts either role=management or legacy allowlist
export function isManagementUser(user, role) {
  return effectiveRole(user, role) === 'management'
}

// Plain-user subscription for pages that only need to know who is signed in.
export function useAuthUser() {
  const [user, setUser] = useState(null)
  useEffect(() => onAuthStateChanged(auth, u => setUser(u)), [])
  return user
}

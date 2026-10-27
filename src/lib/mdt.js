import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'

// MDT / warning log, newest first.
export function useMdtEntries() {
  const [entries, setEntries] = useState([])
  useEffect(() => {
    const q = query(collection(db, 'sapr_mdt'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, snap => setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
  }, [])
  return entries
}

// email → displayName, from the sapr_users collection.
export function useUserMap() {
  const [userMap, setUserMap] = useState({})
  useEffect(() => onSnapshot(collection(db, 'sapr_users'), snap => {
    const map = {}
    snap.docs.forEach(d => { const { email, displayName } = d.data(); if (email) map[email] = displayName })
    setUserMap(map)
  }), [])
  return userMap
}

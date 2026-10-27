import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'

// Fishing-evidence documents, newest first. One subscription feeds the gallery and the leaderboard.
export function useEvidence() {
  const [images, setImages] = useState([])
  useEffect(() => {
    const q = query(collection(db, 'fishing_evidence'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, snap => setImages(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
  }, [])
  return images
}

import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'

// Ranger announcements, newest first (pinned ones are lifted to the top where they're shown).
// Only subscribes while `enabled` — the portal reads them once somebody is signed in.
export function useAnnouncements(enabled) {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    if (!enabled) return
    return onSnapshot(query(collection(db, 'sapr_posts'), orderBy('createdAt', 'desc')), snap => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }, () => setPosts([]))   // refused (the rules let only rangers and management read them): show none
  }, [enabled])
  return enabled ? posts : []
}

export const pinnedFirst = posts => [...posts].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))

export const postMillis = p => (p.createdAt?.toMillis ? p.createdAt.toMillis() : 0)

// "27/04/2026, 15:04:05 IST" — the portal has always shown announcement times in IST.
export const fmtPostTime = p => (p.createdAt?.toDate
  ? p.createdAt.toDate().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST'
  : '')

// When the ranger last looked at the announcements, kept per browser.
const SEEN_KEY = 'sapr_alerts_seen'
export const readAnnouncementsSeen = () => { try { return Number(localStorage.getItem(SEEN_KEY) || 0) } catch { return 0 } }
export const writeAnnouncementsSeen = ms => { try { localStorage.setItem(SEEN_KEY, String(ms)) } catch { /* storage unavailable */ } }

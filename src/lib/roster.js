import { useEffect, useState } from 'react'
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'

export const ROSTER_SECTION_DEFAULT = ['Overwatch', 'Dept Head', 'High Command', 'Command', 'Supervisor', 'Rangers']
export const ROSTER_RANKS = [
  'Game Warden', 'Asst. Game Warden',
  'Lead Ranger', 'Lieutenant',
  'Head-Sergeant', 'Sergeant First Class', 'Sergeant', 'Corporal',
  'Senior-Ranger', 'Ranger First Class', 'Ranger',
]
export const ROSTER_CERTS    = ['FTO', 'ASD', 'HEAT', 'SWAT', 'CID', 'MEU', 'K-9', 'SOP']
export const ROSTER_STATUSES = ['Active', 'Inactive', 'LOA']

// SAPR stands as its own department now, so a member carries a SAPR badge and a
// SAPR rank only. Docs written while it was a SASP sub-unit used callSign/saprRank.
export const rosterBadge = m => m.badge || m.callSign || ''
export const rosterRank  = m => m.rank  || m.saprRank || ''
export const badgeNumber = m => (rosterBadge(m).match(/(\d+)\s*$/) || [null, ''])[1]
export const rosterCallsigns = m => [...new Set([
  badgeNumber(m),
  ...(Array.isArray(m.callsigns) ? m.callsigns : []),
].map(String).map(s => s.trim()).filter(Boolean))]
export const matchesCallsign = (m, q) =>
  rosterCallsigns(m).includes(String(q || '').trim())

// Free-form list fields arrive either as an array or a comma-separated string.
export const asList = v =>
  Array.isArray(v) ? v.map(String).map(s => s.trim()).filter(Boolean)
  : typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean)
  : []

export const rosterCerts = m =>
  Array.isArray(m.certs) ? m.certs
  : typeof m.certs === 'string' ? m.certs.split(',').map(c => c.trim()).filter(Boolean)
  : []

// A rank slot that exists on the org chart but has nobody in it — the badge
// number stays reserved so the ladder reads the same as the department sheet.
export const isVacant = m => !!m.vacant || !(m.name || '').trim()

// Whole days from a YYYY-MM-DD date to today. Time in department and time since
// promotion are derived rather than stored, so they never go stale.
const DAY_MS = 86400000
export function daysSince(v) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v || '')) return null
  const then = Date.parse(`${v}T00:00:00Z`)
  const now  = Date.parse(`${new Date().toISOString().slice(0, 10)}T00:00:00Z`)
  if (Number.isNaN(then) || Number.isNaN(now)) return null
  return Math.max(0, Math.round((now - then) / DAY_MS))
}
export const fmtDays = n => `${n} day${n === 1 ? '' : 's'}`

// YYYY-MM-DD  →  MM/DD/YY   (falls back to raw string for legacy data)
export function fmtRosterDate(v) {
  if (!v) return '—'
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const [y, m, d] = v.split('-')
    return `${m}/${d}/${y.slice(2)}`
  }
  return v
}

export const initialsOf = name => (name || '')
  .trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()

/* ─── live data ─────────────────────────────────────────── */

// The roster, ordered, plus the section order set in the admin panel.
export function useRoster() {
  const [members,  setMembers]  = useState([])
  const [sections, setSections] = useState(ROSTER_SECTION_DEFAULT)
  const [loaded,   setLoaded]   = useState(false)
  useEffect(() => {
    const unsubM = onSnapshot(
      query(collection(db, 'sapr_roster'), orderBy('order', 'asc')),
      snap => { setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoaded(true) },
      ()   => setLoaded(true)
    )
    const unsubS = onSnapshot(doc(db, 'sapr_config', 'roster'), snap => {
      if (snap.exists() && Array.isArray(snap.data().sections))
        setSections(snap.data().sections)
    })
    return () => { unsubM(); unsubS() }
  }, [])
  return { members, sections, loaded }
}

// Officers maintain their own photo and write-up from the profile editor;
// management links their account to a badge, which is the join key.
export function useSelfProfiles() {
  const [selfMap, setSelfMap] = useState({})
  useEffect(() => onSnapshot(collection(db, 'sapr_users'), snap => {
    const map = {}
    snap.docs.forEach(d => {
      const u = d.data()
      if (u.badge) map[u.badge] = { photo: u.photoUrl || '', bio: u.bio || '' }
    })
    setSelfMap(map)
  }), [])
  return selfMap
}

// What the officer supplied wins; the roster document is the fallback.
export const withSelfProfile = (members, selfMap) => members.map(m => {
  const mine = selfMap[rosterBadge(m)]
  return mine ? { ...m, photo: mine.photo || m.photo || '', bio: mine.bio || m.bio || '' } : m
})

// Members grouped by section name, in section order, empty sections dropped.
export const groupBySection = (members, sections) => sections
  .map(name => ({ name, members: members.filter(m => m.section === name) }))
  .filter(g => g.members.length > 0)

// One ranger by badge number or callsign: the roster document plus whatever the officer supplied for themselves.
// undefined = still loading, null = loaded and no such badge.
export function useRosterMember(badgeParam) {
  const [member, setMember] = useState(undefined)
  useEffect(() => {
    let roster, mine = null
    const merge = () => {
      if (roster === undefined) return
      setMember(roster && mine ? { ...roster, photo: mine.photo || roster.photo || '', bio: mine.bio || roster.bio || '' } : roster)
    }
    const want = (badgeParam || '').toLowerCase()
    const unsubM = onSnapshot(collection(db, 'sapr_roster'), snap => {
      const hit = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .find(m => matchesCallsign(m, badgeParam) || rosterBadge(m).toLowerCase() === want)
      roster = hit || null
      merge()
    })
    const unsubU = onSnapshot(collection(db, 'sapr_users'), snap => {
      const hit = snap.docs.map(d => d.data())
        .find(u => matchesCallsign({ badge: u.badge }, badgeParam) || (u.badge || '').toLowerCase() === want)
      mine = hit ? { photo: hit.photoUrl || '', bio: hit.bio || '' } : null
      merge()
    })
    return () => { unsubM(); unsubU() }
  }, [badgeParam])
  return member
}

import { useEffect, useState } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

/* ─── open / closed setting ─────────────────────────────── */

// sapr_config/recruitment { formOpen } — true unless an admin has set it to false.
export function useRecruitmentOpen() {
  const [formOpen,      setFormOpen]      = useState(true)
  const [configLoading, setConfigLoading] = useState(true)
  useEffect(() => onSnapshot(doc(db, 'sapr_config', 'recruitment'), snap => {
    setFormOpen(snap.exists() ? snap.data().formOpen !== false : true)
    setConfigLoading(false)
  }), [])
  return { formOpen, configLoading }
}

// The admin toggle: same write as before.
export const setRecruitmentOpen = open => setDoc(doc(db, 'sapr_config', 'recruitment'), { formOpen: open })

/* ─── spam gates for the public application form ─────────── */
export const SUBMIT_COOLDOWN_MS = 24 * 60 * 60 * 1000        // one submission per device per 24 h
export const MIN_FILL_MS        = 4000                        // humans take ≥ 4 s to fill the form

export function getDeviceFingerprint() {
  // Lightweight, best-effort fingerprint — not cryptographic, just raises the bar for spam.
  let fp = localStorage.getItem('sapr_fp')
  if (fp) return fp
  const parts = [
    navigator.userAgent || '',
    navigator.language || '',
    `${screen.width}x${screen.height}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    Math.random().toString(36).slice(2, 10),
  ].join('|')
  fp = btoa(parts).replace(/[^a-zA-Z0-9]/g, '').slice(0, 32)
  try { localStorage.setItem('sapr_fp', fp) } catch { /* storage unavailable */ }
  return fp
}

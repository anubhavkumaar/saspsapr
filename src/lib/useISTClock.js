import { useSyncExternalStore } from 'react'
import { IST_OFFSET_MS, isActiveHour } from './surveillance'

// One shared clock for every camera: a single timer, always in India Standard Time (never the visitor's own zone).
// It ticks on the second, stops while the tab is hidden and resyncs the moment the tab is visible again.
//
// Development only: ?ist=HH:MM or ?ist=HH:MM:SS starts the clock at that IST time (it keeps ticking from there), so a state
// can be looked at without waiting for it. Production builds strip this out entirely.

const IST_FMT = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' })
const parts = ms => Object.fromEntries(IST_FMT.formatToParts(new Date(ms)).map(p => [p.type, p.value]))

function startOffset() {
  if (!import.meta.env.DEV || typeof window === 'undefined') return 0
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(new URLSearchParams(window.location.search).get('ist') || '')
  if (!m || Number(m[1]) > 23 || Number(m[2]) > 59 || Number(m[3] || 0) > 59) return 0
  const want = Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3] || 0)
  const now  = parts(Date.now())
  return (want - (Number(now.hour) * 3600 + Number(now.minute) * 60 + Number(now.second))) * 1000
}
const OFFSET = startOffset()

const secondNow = () => Math.floor((Date.now() + OFFSET) / 1000)
function build(sec) {
  const ms = sec * 1000
  const p  = parts(ms)
  const h  = Number(p.hour)
  return { sec, istEpoch: ms + IST_OFFSET_MS, text: `${p.hour}:${p.minute}:${p.second}`, hour: h, active: isActiveHour(h) }
}

let snap = build(secondNow())
let timer = 0
const subs = new Set()
const running = () => subs.size > 0 && !document.hidden

function tick() {
  snap = build(secondNow())
  subs.forEach(f => f())
  schedule()
}
function schedule() {
  clearTimeout(timer)
  if (running()) timer = setTimeout(tick, 1000 - ((Date.now() + OFFSET) % 1000) + 20)
}
function onVisibility() {
  if (document.hidden) clearTimeout(timer)
  else tick()   // resync at once
}
function subscribe(cb) {
  subs.add(cb)
  if (subs.size === 1) { document.addEventListener('visibilitychange', onVisibility); tick() }
  return () => {
    subs.delete(cb)
    if (!subs.size) { clearTimeout(timer); document.removeEventListener('visibilitychange', onVisibility) }
  }
}
// Stable within a second; refreshed here only when nothing is keeping it up to date.
function getSnapshot() {
  const s = secondNow()
  if (s !== snap.sec && !running()) snap = build(s)
  return snap
}

// { sec, istEpoch, text: 'HH:MM:SS', hour, active } — istEpoch is the epoch shifted to IST wall time.
export const useISTClock = () => useSyncExternalStore(subscribe, getSnapshot)

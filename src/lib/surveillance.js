import { seededFor } from './seededRandom'

// The rules of the camera feeds, as plain functions of an IST wall-clock epoch (ms), so they are the same for every visitor
// and can be tested without a browser. `istEpochMs` is real epoch time shifted by +05:30 — see useISTClock.

export const IST_OFFSET_MS   = 330 * 60000
export const RANGER_SLOT_MS  = 3 * 60000   // a camera's ranger count is re-rolled every 3 minutes
export const WILDLIFE_SLOT_MS = 20000      // the wildlife counts every ~20 seconds

// Rangers in an area: exactly these values (there is no 3), weighted 0:15% 1:30% 2:30% 4:15% 5:10%.
export const RANGER_VALUES = [0, 1, 2, 4, 5]
const RANGER_CUM = [15, 45, 75, 90, 100]

// Live from 11:00:00 to 00:59:59 IST, every day; inactive from 01:00:00 to 10:59:59.
export const isActiveHour = hour => hour >= 11 || hour === 0
export const istHourOf = istEpochMs => Math.floor((istEpochMs % 86400000) / 3600000)

export function rangersFor(camId, istEpochMs) {
  const roll = seededFor(camId + ':rangers', Math.floor(istEpochMs / RANGER_SLOT_MS))() * 100
  return RANGER_VALUES[RANGER_CUM.findIndex(c => roll < c)]
}

// One number per readout field, each within its own min–max (inclusive).
export function wildlifeFor(camera, istEpochMs) {
  const rng = seededFor(camera.id + ':wildlife', Math.floor(istEpochMs / WILDLIFE_SLOT_MS))
  return camera.readout.map(f => f.min + Math.floor(rng() * (f.max - f.min + 1)))
}

// What the camera is doing, in words — for the label assistive tech reads (kept to the minute by the component).
export function describeFeed(camera, istEpochMs) {
  const head = `${camera.cam}, ${camera.place}.`
  if (!isActiveHour(istHourOf(istEpochMs))) return `${head} Feed inactive. Signal resumes at 11:00 IST.`
  const n = rangersFor(camera.id, istEpochMs)
  return `${head} Feed live. ${n === 0 ? 'No rangers' : n === 1 ? '1 ranger' : n + ' rangers'} in the area.`
}

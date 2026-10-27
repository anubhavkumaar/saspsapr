// Small seeded PRNG: the same seed always gives the same sequence, so "random" numbers can be shared by every visitor with no backend.

// FNV-1a: any string → a 32-bit seed.
export function hashSeed(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  return h >>> 0
}

// mulberry32: a seed → a function returning floats in [0, 1).
export function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6D2B79F5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// A generator for one named stream in one time slot, e.g. seededFor('cam-01:wildlife', 12345).
export const seededFor = (name, slot) => mulberry32(hashSeed(name + ':' + slot))

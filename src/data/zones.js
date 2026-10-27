// Zone pins. Names match the zone map legend. x/y are the label centres on the in-game zone map image, as % of its
// 1091×1600 size (the same positions drive the pins and the map's A–H / 1–12 grid readout).
export const ZONES = [
  { name: 'Mount Chiliad',   kind: 'hunt', x: 57.5, y: 20.4 },
  { name: 'Chiliad M.S.W.',  kind: 'hunt', x: 36.5, y: 24.5 },
  { name: 'Mount Gordo',     kind: 'hunt', x: 81.9, y: 15.4 },
  { name: 'Mount Josiah',    kind: 'hunt', x: 32.6, y: 36.9 },
  { name: 'Cassidy River',   kind: 'fish', x: 27.8, y: 30.9 },
  { name: 'Alamo Sea',       kind: 'fish', x: 56.0, y: 33.2 },
  { name: 'Zancudo River',   kind: 'fish', x: 39.9, y: 43.9 },
  { name: 'Lago Zancudo',    kind: 'fish', x: 16.6, y: 45.8 },
  { name: 'Tongva River',    kind: 'fish', x: 31.3, y: 50.7 },
  { name: 'Vinewood Dam',    kind: 'fish', x: 44.6, y: 57.4 },
  { name: 'Tataviam Dam',    kind: 'fish', x: 70.2, y: 61.2 },
]

// Shown on a zone's zoom caption, per kind — facts already stated in the regulations above it.
export const ZONE_DETAILS = {
  hunt: 'Hunting hours 05:00 – 19:30 · Max 150 items per trip',
  fish: 'Any Time · Catch Limit 100 / Trip · Fish Coolers',
}

export const OPEN_SEA_NOTE = 'The entirety of Open Sea is legal to fish from a Boat'

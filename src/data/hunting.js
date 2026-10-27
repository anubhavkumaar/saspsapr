// Hunting regulations — copy is verbatim from the original App.jsx; the emoji that sat beside
// species and equipment are gone (the design uses lucide icons and numerals instead).

export const HUNT_AREAS = ['Mount Chiliad', 'Mount Josiah', 'Mount Gordo', 'Chiliad Mountain State Wilderness', 'San Chianski Mountain Range']

export const HUNT_AREAS_NOTE = 'Only five legal hunting areas exist in San Andreas, designated by the hunting lodge in Paleto.'

export const HUNT_RESTRICTIONS = [
  'SASP officers may search your person, vehicle, and storage at any time to verify compliance',
  'Cannot buy, sell, or possess — dead or alive — any part of a protected species',
  'Must stay at least 15 meters from the road at all times',
  'Do not skin animals directly on hunting trails — move off to the side',
  'Hunting hours: 05:00 – 19:30 only',
  'Hunting permitted in designated areas only',
  'Maximum 150 items per trip (includes all parts removed) — exceeding this is Overhunting',
  'Move up and down trails to avoid over-hunting a single area',
  'Box trucks and large vehicles are strictly prohibited in the woods — treated as intent to poach',
  'You may kill any animal in genuine self-defense — leave the carcass and file a /311 report immediately',
]

export const HUNT_LICENSE_STEPS = [
  'Visit a Hospital to obtain a Medical Certificate',
  'Visit a Private Attorney once your medical test has cleared — they will explain your rights and restrictions',
  'Pay the $6,000 DOJ fee via attorney billing (clean record required — felons must first expunge charges)',
  'Proceed to any Police Department (e.g. Mission Row) with your attorney to have the license issued',
  'Acquire hunting equipment from Locked & Loaded or any licensed ammunition store',
]

export const HUNT_LEGAL_EQUIPMENT = ['Hunting Rifle', 'Hunting Knife', 'Hunting Decoy']
export const HUNT_ILLEGAL_EQUIPMENT = ['All Pistols', 'Automatic Weapons', 'Non-Hunting Rifles', 'Clean Barrels', 'Commercial / Industrial Vehicles']

// st = the status the original table carried; ok = hunting permitted.
export const HUNTING_SPECIES = [
  { name: 'Deer',             st: 'Common',    ok: true  },
  { name: 'Wild Boar',        st: 'Common',    ok: true  },
  { name: 'Coyotes',          st: 'Common',    ok: true  },
  { name: 'Rabbits',          st: 'Common',    ok: true  },
  { name: 'Birds',            st: 'Common',    ok: true  },
  { name: 'Cougars',          st: 'Protected', ok: false },
  { name: 'Domestic Animals', st: 'Domestic',  ok: false },
]

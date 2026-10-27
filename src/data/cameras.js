// The three surveillance cameras on Home. `image` is a slot in public/field/ (<image>.jpg|png|webp); `readout` is the wildlife
// count shown under REC, each re-rolled within min–max (inclusive). Labels are shown as typed here, with a colon.
export const CAMERAS = [
  {
    id: 'cam-01', cam: 'CAM 01', place: 'PALETO FOREST', image: 'paleto-forest',
    alt: 'Paleto Forest from above: pine-covered slopes, a winding road and a small ranger outpost in the valley',
    readout: [
      { key: 'deer',   label: 'DEER SPOTTED', min: 2, max: 7 },
      { key: 'cougar', label: 'COUGAR',       min: 0, max: 2 },
      { key: 'rabbit', label: 'RABBIT',       min: 3, max: 12 },
      { key: 'coyote', label: 'COYOTES',      min: 0, max: 5 },
      { key: 'boar',   label: 'BOAR COUNT',   min: 0, max: 4 },
    ],
  },
  {
    id: 'cam-02', cam: 'CAM 02', place: 'ALAMO SEA', image: 'alamo-sea',
    alt: 'The Alamo Sea from above: a wide inland lake between dry hills and a sandy shoreline with a road along it',
    readout: [
      { key: 'carp',    label: 'CARP',              min: 6, max: 18 },
      { key: 'catfish', label: 'CATFISH',           min: 2, max: 10 },
      { key: 'bass',    label: 'BASS',              min: 1, max: 8 },
      { key: 'coyote',  label: 'COYOTES ON SHORE',  min: 0, max: 4 },
      { key: 'boats',   label: 'BOATS',             min: 0, max: 3 },
    ],
  },
  {
    id: 'cam-03', cam: 'CAM 03', place: 'DEL PERRO PIER', image: 'del-perro-pier',
    alt: 'Del Perro Pier at dusk: the lit pier and ferris wheel over the sea, with the city skyline behind',
    readout: [
      { key: 'tuna',     label: 'TUNA SPOTTED',    min: 0, max: 6 },
      { key: 'mackerel', label: 'MACKEREL',        min: 6, max: 22 },
      { key: 'seabass',  label: 'SEA BASS',        min: 2, max: 12 },
      { key: 'anglers',  label: 'ANGLERS ON PIER', min: 2, max: 10 },
      { key: 'gulls',    label: 'SEAGULLS',        min: 8, max: 30 },
    ],
  },
]

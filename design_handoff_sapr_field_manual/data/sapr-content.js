// Verbatim SAPR content from anubhavkumaar/saspsapr src/App.jsx — shared by the three redesign directions.
window.SAPR_DATA = {
  LEGAL: ['Amberjack','Anchovy','Barracuda','Black Crappie','Blue Tang','Bluegill Sunfish','Brook Trout','Brown Trout','Butterfly Koi','Chain Pickerel','Channel Catfish','Clownfish','Cobia','Cod','Common Carp','Crab','Creek Chub','Cubera Snapper','Flounder','French Angelfish','Glassfish','Goliath Grouper','Goatfish','Gray Mullet','Hogfish','Largemouth Bass','Lingcod','Lobster','Mackerel','Moorish Idol','Mudskipper','Muskellunge','Octopus','Pacific Halibut','Parrotfish','Queen Angelfish','Rainbow Runner','Rainbow Trout','Red Drum','Red Grouper','Red Snapper','Rockfish','Sailfish','Sardine','Sea Bass','Sea Robin','Sheepshead','Skipjack Tuna','Smallmouth Bass','Snook','Sockeye Salmon','Squid','Stone Crab','Squirrelfish','Sunfish','Sweetlips','Tarpon','Tilapia','Tropical Butterflyfish','Trumpetfish','Unicornfish','Wahoo','Walleye','Yellow Perch','Yellowtail Snapper'],
  PROTECTED: ['Alligator Gar','Blacktip Shark','Blue Marlin','Bluefin Tuna','Bull Shark','Coelacanth','Cownose Ray','Dorado','Electric Eel','Ghost Fish','Goblin Shark','Golden Koi','Great White Shark','Hammerhead Shark','Lake Sturgeon','Lionfish','Mahi-Mahi','Manta Ray','Moray Eel','Needlefish','Oarfish','Paddlefish','Piranha','Porcupinefish','Pufferfish','Seahorse','Small Reef Shark','Stonefish','Stingray','Swordfish','Tiger Shark','Whale Shark','Yellowfin Tuna'],
  CODES: [
    { code: '10001', offense: 'Hunting In Restricted Areas', cls: 'Infraction', s: '0', m: 0, f: '$1,500' },
    { code: '10002', offense: 'Unlicensed Hunting or Fishing', cls: 'Infraction', s: '0', m: 0, f: '$1,500' },
    { code: '10003', offense: 'Hunting Outside of Hunting Hours', cls: 'Infraction', s: '0', m: 0, f: '$1,000' },
    { code: '10004', offense: 'Improper Storage of Fish', cls: 'Infraction', s: '0', m: 0, f: '$500' },
    { code: '10005', offense: 'Hunting With A Non-Hunting Weapon', cls: 'Misdemeanor', s: '10 months', m: 10, f: '$1,500' },
    { code: '10006', offense: 'Overhunting / Overfishing', cls: 'Misdemeanor', s: '10 months', m: 10, f: '$2,500' },
    { code: '10007', offense: 'Animal Cruelty', cls: 'Felony', s: '15 months', m: 15, f: '$5,000' },
    { code: '10008', offense: 'Poaching', cls: 'Felony', s: '25 months', m: 25, f: '$7,500' }
  ],
  HUNT_SPECIES: [
    { name: 'Mule Deer', st: 'Common', ok: true }, { name: 'Wild Boar', st: 'Common', ok: true }, { name: 'Coyotes', st: 'Common', ok: true },
    { name: 'Rabbits', st: 'Common', ok: true }, { name: 'Birds (Game)', st: 'Common', ok: true }, { name: 'Cougars', st: 'Rare', ok: false },
    { name: 'Domestic Animals', st: 'Domestic', ok: false }
  ],
  HUNT_AREAS: ['Mount Chiliad', 'Mount Josiah', 'Mount Gordo', 'Chiliad Mountain State Wilderness', 'San Chianski Mountain Range'],
  RESTRICTIONS: [
    'Conservation officers may request to inspect your game at any time',
    'Cannot buy, sell, or possess — dead or alive — any part of a protected species',
    'Must stay at least 15 meters from the road at all times',
    'Do not skin animals directly on hunting trails — move off to the side',
    'Hunting hours: 05:00 – 19:30 only',
    'Hunting permitted in designated areas only',
    'Maximum 150 items per trip (includes all parts removed) — exceeding this is Overhunting',
    'Move up and down trails to avoid over-hunting a single area',
    'Box trucks and large vehicles are strictly prohibited in the woods — treated as intent to poach'
  ],
  HUNT_STEPS: ['Consult with a licensed Attorney in San Andreas', 'Present a valid ID — required before purchase', 'Pay the licensing fee: $1,000 (clean record) or $3,250 (any misdemeanors or felonies)', 'License issued by San Andreas State Police after attorney consultation'],
  FISH_STEPS: ['Consult a Private Attorney for a licensing consultation', 'Attorney explains the complete licensing procedure and requirements', 'Pay the $650 licensing fee', 'Proceed to Del Perro Pier with attorney and a PD officer to finalize license', 'Acquire fishing equipment from a state-authorized vendor on Del Perro Pier'],
  FISH_OK: ['All Fishing Rods', 'All Lures', 'Fish Baits', 'Fish Coolers (for transport)'],
  FISH_NO: ['Chum Buckets', 'Fish Attractors', 'Clean Barrels', 'Shark Baits', 'Industrial / Commercial Vehicles'],
  // Approximate radar positions (x%, y%, north up) — illustrative, not survey-accurate
  ZONES: [
    { name: 'Mount Chiliad', kind: 'hunt', x: 47, y: 19 }, { name: 'Chiliad M.S.W.', kind: 'hunt', x: 33, y: 25 },
    { name: 'Mount Gordo', kind: 'hunt', x: 79, y: 27 }, { name: 'Mount Josiah', kind: 'hunt', x: 31, y: 45 },
    { name: 'Cassidy River', kind: 'fish', x: 42, y: 33 }, { name: 'Alamo Sea', kind: 'fish', x: 59, y: 41 },
    { name: 'Zancudo River', kind: 'fish', x: 22, y: 47 }, { name: 'Lago Zancudo', kind: 'fish', x: 17, y: 54 },
    { name: 'Tongva River', kind: 'fish', x: 27, y: 64 }, { name: 'Vinewood Dam', kind: 'fish', x: 61, y: 71 },
    { name: 'Tataviam Dam', kind: 'fish', x: 75, y: 67 }
  ],
  ROSTER: [
    { section: 'Overwatch', people: [{ name: 'Trooper Eddie', rank: 'Overwatch', dept: 'SASP', status: 'Active' }] },
    { section: 'High Command', people: [{ name: 'Rex Davis', rank: 'Game Warden · 222', dept: 'LSPD', status: 'Active' }] },
    { section: 'Command', people: [] }, { section: 'Supervisor', people: [] }, { section: 'Rangers', people: [] }
  ],
  // Sample rows — real entries live in Firestore
  MDT: [
    { type: 'mdt', cid: '10942', officer: 'Rex Davis', date: '28 Mar 2026', notes: 'Sample entry' },
    { type: 'warning', cid: '1156', officer: 'Trooper Eddie', date: '27 Mar 2026', notes: 'Sample entry' },
    { type: 'mdt', cid: '2208', officer: 'Rex Davis', date: '27 Mar 2026', notes: 'Sample entry' }
  ],
  PLACES: ['Paleto Bay', 'Mount Chiliad', 'Mount Josiah', 'Mount Gordo', 'Alamo Sea', 'Cassidy River', 'Zancudo River', 'Lago Zancudo', 'Tongva River', 'Vinewood Dam', 'Tataviam Dam', 'Del Perro Pier', 'Procopio Promenade', 'San Chianski Mountain Range']
};

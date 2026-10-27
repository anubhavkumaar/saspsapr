// Wildlife Penal Codes (Title 10). `months` is the sentence as a number — it scales the bar, 25 months being full.
export const PENAL_CODES = [
  { code: '10001', offense: 'Hunting In Restricted Areas',       cls: 'Infraction',  sentence: '0',         months: 0,  fine: '$1,500' },
  { code: '10002', offense: 'Unlicensed Hunting or Fishing',     cls: 'Infraction',  sentence: '0',         months: 0,  fine: '$1,500' },
  { code: '10003', offense: 'Hunting Outside of Hunting Hours',  cls: 'Infraction',  sentence: '0',         months: 0,  fine: '$1,000' },
  { code: '10004', offense: 'Improper Storage of Fish',          cls: 'Infraction',  sentence: '0',         months: 0,  fine: '$500'   },
  { code: '10005', offense: 'Hunting With A Non-Hunting Weapon', cls: 'Misdemeanor', sentence: '10 months', months: 10, fine: '$1,500' },
  { code: '10006', offense: 'Overhunting / Overfishing',         cls: 'Misdemeanor', sentence: '10 months', months: 10, fine: '$2,500' },
  { code: '10007', offense: 'Animal Cruelty',                    cls: 'Felony',      sentence: '15 months', months: 15, fine: '$5,000' },
  { code: '10008', offense: 'Poaching',                          cls: 'Felony',      sentence: '25 months', months: 25, fine: '$7,500' },
]

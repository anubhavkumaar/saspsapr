import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Box, Clock, Crosshair, Fish, FileBadge, MapPin, Package, Route } from 'lucide-react'
import {
  Alert, Button, Checklist, Chip, ChipGroup, DataTable, FeedGrid, FieldImage, FormBlock, Hero, HeroActions, Icon, Label, Live,
  Notice, PenalCodeTable, Photo, QuickRefCard, QuickRefGrid, Reveal, RunIn, Section, SectionHeader, Split, SpeciesIndex,
  StepList, SubHeading, SurveillanceFeed, Tally, ZoneList, ZoneMap,
} from '../components'
import { CAMERAS } from '../data/cameras'
import { useFieldSrc } from '../lib/fieldImage'
import { scrollToSection } from '../lib/nav'
import { useRoster } from '../lib/roster'
import {
  HUNTING_SPECIES, HUNT_AREAS, HUNT_AREAS_NOTE, HUNT_ILLEGAL_EQUIPMENT, HUNT_LEGAL_EQUIPMENT, HUNT_LICENSE_STEPS, HUNT_RESTRICTIONS,
} from '../data/hunting'
import { FISH_LICENSE_STEPS, FISH_PERMITTED, FISH_PROHIBITED, LEGAL_SPECIES, PROTECTED_SPECIES } from '../data/fishing'
import { PENAL_CODES } from '../data/penalCodes'
import { OPEN_SEA_NOTE, ZONES, ZONE_DETAILS } from '../data/zones'
import { RECRUIT_CHECKS, RECRUIT_LEAD, RECRUIT_TITLE } from '../data/recruitment'
import { HomeRail } from './home/HomeRail.jsx'
import { PersonnelSection } from './home/PersonnelSection.jsx'
import { RosterSection } from './home/RosterSection.jsx'
import { useHomeSections } from './home/useHomeSections'

const pad2 = n => String(n).padStart(2, '0')

const HERO_ROWS = [
  { k: 'Commanding Officer', v: 'Game Warden Rex Davis (700 · 777)' },
  { k: 'Overwatch',          v: 'Trooper Eddie Brock (299)' },
  { k: 'Jurisdiction',       v: 'Statewide — All Fishing & Hunting Zones' },
  { k: 'Partners',           v: 'San Andreas State Police (SASP)' },
  { k: 'Station',            v: 'Beaver Bush Park Ranger Station — Baytree Canyon Rd & Marlowe Dr, Vinewood Hills' },
]

// Counted from the lists below, so the tally can't drift from them.
const HERO_TALLY = [
  { value: LEGAL_SPECIES.length,     label: 'Legal Species',     sub: 'actively monitored' },
  { value: PROTECTED_SPECIES.length, label: 'Protected Species', sub: 'under SAPR jurisdiction' },
  { value: PENAL_CODES.length,       label: 'Penal Codes',       sub: 'wildlife violations enforced' },
]

export default function Home() {
  useHomeSections()
  const roster = useRoster()
  const [zone, setZone] = useState(null)   // zone being hovered, on the map or in the list
  const [zoneFocus, setZoneFocus] = useState(null)   // zone zoomed into
  const [zoneView, setZoneView] = useState('all')   // 'all' | 'hunt' | 'fish'
  // The in-game map: public/field/zone-map.jpg|png|webp if one is dropped there, otherwise the one the site has always used.
  const mapSrc = useFieldSrc('zone-map', '/images/hunting_fishing_map.png')

  return (
    <>
      <HomeRail/>
      <Hero
        kicker={<>
          <span><Icon icon={BadgeCheck}/>SAPR · Established 2026</span>
          <span><Icon icon={MapPin}/>San Andreas State</span>
          <Live>Department Active</Live>
          <Live>Recruiting Open</Live>
        </>}
        lines={['San Andreas', 'Park', 'Rangers']} line="Wildlife Enforcement · Conservation · Statewide Operations"
        aside={<Reveal><Photo caption="FIG. 1 — Beaver Bush Park Ranger Station, Vinewood Hills" stamp="Statewide Jurisdiction"><FieldImage name="hero" loading="eager" alt="Beaver Bush Park Ranger Station in the Vinewood Hills, a patrol truck under the carport"/></Photo></Reveal>}
        below={<Reveal style={{ marginTop: 48 }}><Tally items={HERO_TALLY}/></Reveal>}>
        <FormBlock rows={HERO_ROWS}/>
        <HeroActions>
          <Button iconRight={ArrowRight} onClick={() => scrollToSection('roster', '/roster')}>View Roster</Button>
          <Button as={Link} to="/joinsapr" variant="ghost">Join SAPR</Button>
        </HeroActions>
      </Hero>

      <Section tight alt>
        <FeedGrid>
          {CAMERAS.map((c, i) => <Reveal key={c.id} delay={i * 0.08}><SurveillanceFeed camera={c}/></Reveal>)}
        </FeedGrid>
      </Section>

      <Section id="quick">
        <Reveal><SectionHeader num="01" eyebrow="Active Regulations" title="Quick Reference" sub="Hunting and fishing rules at a glance. Full regulations follow in sections 02 and 03."/></Reveal>
        <QuickRefGrid>
          <Reveal>
            <QuickRefCard icon={Crosshair} title="Hunting" meta="Licensed · Designated areas"
              facts={[
                { icon: Clock,     k: 'Hours',       v: '05:00 – 19:30', n: 'Hunting hours only' },
                { icon: Package,   k: 'Trip limit',  v: '150 items',     n: 'Includes all parts removed' },
                { icon: Route,     k: 'Road buffer', v: '15 m',          n: 'Minimum distance from the road' },
                { icon: FileBadge, k: 'License Fee', v: '$6,000',        n: 'Clean record required — felons must first expunge charges' },
              ]}
              allowed={{ title: 'Legal Equipment', items: HUNT_LEGAL_EQUIPMENT }} prohibited={{ title: 'Illegal Equipment', items: HUNT_ILLEGAL_EQUIPMENT }}
              footTitle="Designated Hunting Areas"
              foot={<>
                <p style={{ marginBottom: 12 }}>{HUNT_AREAS_NOTE}</p>
                <ChipGroup>{HUNT_AREAS.map((a, i) => <Chip key={a} num={pad2(i + 1)}>{a}</Chip>)}</ChipGroup>
              </>}/>
          </Reveal>
          <Reveal delay={0.1}>
            <QuickRefCard tone="water" icon={Fish} title="Fishing" meta="Waterways · Open Sea"
              facts={[
                { icon: FileBadge, k: 'License Fee', v: '$650',         n: 'Via attorney billing' },
                { icon: Clock,     k: 'Hours',       v: 'Any Time',     n: 'No time restriction' },
                { icon: Package,   k: 'Catch Limit', v: '100 / Trip',   n: 'Exceeding is Overfishing' },
                { icon: Box,       k: 'Storage',     v: 'Fish Coolers', n: 'For transport' },
              ]}
              allowed={{ title: 'Permitted Equipment', items: FISH_PERMITTED }} prohibited={{ title: 'Prohibited Equipment', items: FISH_PROHIBITED }}
              foot={OPEN_SEA_NOTE}/>
          </Reveal>
        </QuickRefGrid>
      </Section>

      <Section id="hunting" alt>
        <Reveal><SectionHeader num="02" eyebrow="Active Regulations" title="Hunting Laws & Regulations" sub="Official SAPR-enforced hunting protocol across San Andreas — all officers are required to know and apply these rules"/></Reveal>
        <Split>
          <Reveal>
            <SubHeading>Species Status</SubHeading>
            <DataTable rows={HUNTING_SPECIES} columns={[
              { key: 'name', label: 'Species', render: v => <b>{v}</b> },
              { key: 'ok', label: 'Status', render: (v, r) => <Label tone={v ? 'legal' : r.st === 'Domestic' ? 'domestic' : 'protected'}>{v ? 'Legal' : 'Protected'}</Label> },
              { key: 'st', label: 'Hunting Permitted', className: 'is-mono', render: (v, r) => <span className={r.ok ? 'is-ok' : 'is-no'}>{r.ok ? '✓ With License' : '✗ Prohibited'}</span> },
            ]}/>
            <Alert style={{ marginTop: 20 }}>Possession of any part of a protected species constitutes <strong>Poaching</strong>. You may only act against a protected species if it poses an <strong>active threat</strong> to you or civilians. Do not fire warning shots — get in your vehicle.</Alert>
          </Reveal>
          <Reveal delay={0.1}>
            <SubHeading>Obtaining a Hunting License</SubHeading>
            <StepList steps={HUNT_LICENSE_STEPS}/>
            <Alert style={{ marginTop: 20 }}>Applicants are now required to answer <strong>basic hunting law and safety questions</strong> — failure places the application on a <strong>24-hour hold</strong> before reapplication is permitted. Prior felony or misdemeanor convictions must be <strong>fully expunged</strong> before a license can be issued. If a license is <strong>revoked</strong> by law enforcement, the underlying charge must be expunged through <strong>Traffic Court</strong> before a new one can be issued. — <em>By Order, William Hale, Attorney General, State of San Andreas</em></Alert>
          </Reveal>
        </Split>
        <Reveal style={{ marginTop: 56 }}><SubHeading>Restrictions & Regulations</SubHeading><Checklist items={HUNT_RESTRICTIONS}/></Reveal>
      </Section>

      <Section id="fishing">
        <Reveal><SectionHeader num="03" eyebrow="Active Regulations" title="Fishing Laws & Protocols" sub="Official SAPR-enforced fishing regulations across all San Andreas waterways and open sea"/></Reveal>
        <Split>
          <Reveal>
            <SubHeading>Licensing Process</SubHeading>
            <StepList steps={FISH_LICENSE_STEPS}/>
            <Alert style={{ marginTop: 20 }}>You <strong>must be accompanied by your Private Attorney</strong> at the point of issuance — no attorney, no license. If a license is <strong>revoked</strong> by law enforcement, the underlying charge must be expunged through <strong>Traffic Court</strong> before a new one can be issued. — <em>By Order, William Hale, Attorney General, State of San Andreas</em></Alert>
          </Reveal>
          <Reveal delay={0.1}><RunIn title="Legal Fishing Species" items={LEGAL_SPECIES}/></Reveal>
        </Split>
        <Reveal style={{ marginTop: 56 }}><SpeciesIndex danger title="Protected / Endangered Species" items={PROTECTED_SPECIES} stamp="Protected · Endangered"/></Reveal>
        <Reveal style={{ marginTop: 20 }}><Alert>If caught, <strong>immediately release.</strong> Possession of any EPS constitutes Poaching — P.C. 10008 — Felony: 25 months &amp; $7,500 fine.</Alert></Reveal>
      </Section>

      <Section id="zones" alt>
        <Reveal><SectionHeader num="04" eyebrow="Operational Territory" title="Hunting & Fishing Zone Map" sub="Designated zones across San Andreas — every marked zone is SAPR's jurisdiction and responsibility"/></Reveal>
        <Split>
          <Reveal>
            <ZoneMap src={mapSrc} zones={ZONES} view={zoneView} onViewChange={setZoneView} active={zone} onSelect={setZone}
              focus={zoneFocus} onFocus={setZoneFocus} details={ZONE_DETAILS}/>
          </Reveal>
          <Reveal delay={0.1}>
            <ZoneList zones={ZONES} kind={zoneView} active={zone} focus={zoneFocus} onHover={setZone}
              onSelect={n => setZoneFocus(zoneFocus === n ? null : n)}/>
            <Alert tone="info">{OPEN_SEA_NOTE}</Alert>
          </Reveal>
        </Split>
      </Section>

      <Section id="codes">
        <Reveal><SectionHeader num="05" eyebrow="Title 10" title="Wildlife Penal Codes"/></Reveal>
        <Reveal><PenalCodeTable codes={PENAL_CODES}/></Reveal>
      </Section>

      <RosterSection roster={roster}/>
      <PersonnelSection roster={roster}/>

      <Section id="join-cta">
        <Reveal style={{ paddingTop: 20 }}>
          <Notice stamp="Recruiting Open" eyebrow="Open Enrollment" title={RECRUIT_TITLE} lead={RECRUIT_LEAD}
            action={<Button as={Link} to="/joinsapr" iconRight={ArrowRight}>Submit Expression of Interest</Button>}
            items={RECRUIT_CHECKS}/>
        </Reveal>
      </Section>
    </>
  )
}

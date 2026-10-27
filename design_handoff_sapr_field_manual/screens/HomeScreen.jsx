function HomeScreen({ go }) {
  const { Hero, HeroActions, FormBlock, Button, Photo, Tally, Live, Icon, Ticker, Section, SectionHeader, SubHeading, Split, FeedGrid, CameraFeed, QuickRefGrid, QuickRefCard, ChipGroup, Chip, DataTable, Label, Alert, StepList, Checklist, RunIn, SpeciesIndex, Radar, ZoneList, Panel, PenalCodeTable, Roster, Phone, Segmented, MdtEntry, Notice, Reveal } = NS;
  const [zone, setZone] = React.useState(null);
  const [mf, setMf] = React.useState('all');
  return (
    <React.Fragment>
      <Hero
        kicker={<React.Fragment><span><Icon name="badge-check" />SAPR · Established 2026</span><span><Icon name="map-pin" />San Andreas State</span><Live>Department Active</Live><Live>Recruiting Open</Live></React.Fragment>}
        lines={['San Andreas', 'Park', 'Rangers']} line="Wildlife Enforcement · Conservation · Statewide Operations"
        aside={<Reveal><Photo caption="FIG. 1 — Field photograph, San Andreas State" stamp="Statewide Jurisdiction"><Slot id="kit-hero" ph="Drop an in-game screenshot — e.g. Mount Chiliad trailhead at dawn" /></Photo></Reveal>}
        below={<Reveal style={{ marginTop: 48 }}><Tally items={[{ value: 48, label: 'Legal Species', sub: 'actively monitored' }, { value: 33, label: 'Protected Species', sub: 'under SAPR jurisdiction' }, { value: 8, label: 'Penal Codes', sub: 'wildlife violations enforced' }]} /></Reveal>}>
        <FormBlock rows={[{ k: 'Commanding Officer', v: 'Game Warden Rex Davis (222)' }, { k: 'Overwatch', v: 'Trooper Eddie' }, { k: 'Jurisdiction', v: 'Statewide — All Fishing & Hunting Zones' }]} />
        <HeroActions><Button iconRight="arrow-right" onClick={function () { go('home', 'roster'); }}>View Roster</Button><Button variant="ghost" onClick={function () { go('join'); }}>Join SAPR</Button></HeroActions>
      </Hero>
      <Ticker items={[<span><b>10-49A</b> Suspicious Fishing · Procopio Promenade</span>, <span>Hunting hours <b>05:00 – 19:30</b></span>, <span>Fishing license <b>$650</b></span>, <span><b>P.C. 10008</b> Poaching — Felony · 25 months</span>, <span>Catch limit <b>100 / Trip</b></span>, <span>The entirety of Open Sea is legal to fish from a Boat</span>, <span><b>Recruiting Open</b> · Open to all Officers</span>, <span>Max <b>150 items</b> per hunting trip</span>]} />
      <Section tight alt>
        <FeedGrid>
          <Reveal><CameraFeed cam="CAM 01" place="Paleto Forest"><Slot id="kit-cam1" ph="In-game screenshot — Paleto Forest trail" /></CameraFeed></Reveal>
          <Reveal delay={0.08}><CameraFeed cam="CAM 02" place="Alamo Sea"><Slot id="kit-cam2" ph="In-game screenshot — Alamo Sea at dusk" /></CameraFeed></Reveal>
          <Reveal delay={0.16}><CameraFeed cam="CAM 03" place="Del Perro Pier"><Slot id="kit-cam3" ph="In-game screenshot — Del Perro Pier" /></CameraFeed></Reveal>
        </FeedGrid>
      </Section>
      <Section id="quick">
        <Reveal><SectionHeader num="01" eyebrow="Active Regulations" title="Quick Reference" sub="Hunting and fishing rules at a glance. Full regulations follow in sections 02 and 03." /></Reveal>
        <QuickRefGrid>
          <Reveal><QuickRefCard icon="crosshair" title="Hunting" meta="Licensed · Designated areas"
            facts={[{ icon: 'clock', k: 'Hours', v: '05:00 – 19:30', n: 'Hunting hours only' }, { icon: 'package', k: 'Trip limit', v: '150 items', n: 'Includes all parts removed' }, { icon: 'route', k: 'Road buffer', v: '15 m', n: 'Minimum distance from the road' }, { icon: 'file-badge', k: 'License', v: '$1,000', n: '$3,250 with any misdemeanors or felonies' }]}
            allowed={{ title: 'Legal Equipment', items: ['Hunting Rifle'] }} prohibited={{ title: 'Illegal Equipment', items: ['All Pistols', 'Automatic Weapons'] }}
            footTitle="Designated Hunting Areas" foot={<ChipGroup>{KD.HUNT_AREAS.map(function (a, i) { return <Chip key={a} num={pad2(i + 1)}>{a}</Chip>; })}</ChipGroup>} /></Reveal>
          <Reveal delay={0.1}><QuickRefCard tone="water" icon="fish" title="Fishing" meta="Waterways · Open Sea"
            facts={[{ icon: 'file-badge', k: 'License Fee', v: '$650', n: 'Via attorney consultation' }, { icon: 'clock', k: 'Hours', v: 'Any Time', n: 'No time restriction' }, { icon: 'package', k: 'Catch Limit', v: '100 / Trip', n: 'Exceeding is Overfishing' }, { icon: 'box', k: 'Storage', v: 'Fish Coolers', n: 'Required for transport' }]}
            allowed={{ title: 'Permitted Equipment', items: KD.FISH_OK }} prohibited={{ title: 'Prohibited Equipment', items: KD.FISH_NO }}
            foot="The entirety of Open Sea is legal to fish from a Boat" /></Reveal>
        </QuickRefGrid>
      </Section>
      <Section id="hunting" alt>
        <Reveal><SectionHeader num="02" eyebrow="Active Regulations" title="Hunting Laws & Regulations" sub="Official SAPR-enforced hunting protocol across San Andreas — all officers are required to know and apply these rules" /></Reveal>
        <Split>
          <Reveal>
            <SubHeading>Species Status</SubHeading>
            <DataTable rows={KD.HUNT_SPECIES} columns={[{ key: 'name', label: 'Species', render: function (v) { return <b>{v}</b>; } }, { key: 'ok', label: 'Status', render: function (v, r) { return <Label tone={v ? 'legal' : r.st === 'Domestic' ? 'domestic' : 'protected'}>{v ? 'Legal' : 'Protected'}</Label>; } }, { key: 'st', label: 'Hunting Permitted', className: 'is-mono', render: function (v, r) { return <span className={r.ok ? 'is-ok' : 'is-no'}>{r.ok ? '✓ With License' : '✗ Prohibited'}</span>; } }]} />
            <Alert style={{ marginTop: 20 }}>Possession of any part of a protected species constitutes <strong>Poaching</strong>. You may only act against a protected species if it poses an <strong>active threat</strong> to you or civilians. Do not fire warning shots — get in your vehicle.</Alert>
          </Reveal>
          <Reveal delay={0.1}><SubHeading>Obtaining a Hunting License</SubHeading><StepList steps={KD.HUNT_STEPS} /></Reveal>
        </Split>
        <Reveal style={{ marginTop: 56 }}><SubHeading>Restrictions & Regulations</SubHeading><Checklist items={KD.RESTRICTIONS} /></Reveal>
      </Section>
      <Section id="fishing">
        <Reveal><SectionHeader num="03" eyebrow="Active Regulations" title="Fishing Laws & Protocols" sub="Official SAPR-enforced fishing regulations across all San Andreas waterways and open sea" /></Reveal>
        <Split>
          <Reveal><SubHeading>Licensing Process</SubHeading><StepList steps={KD.FISH_STEPS} /></Reveal>
          <Reveal delay={0.1}><RunIn title="Legal Fishing Species" items={KD.LEGAL} /></Reveal>
        </Split>
        <Reveal style={{ marginTop: 56 }}><SpeciesIndex danger title="Protected / Endangered Species" items={KD.PROTECTED} stamp="Protected · Endangered" /></Reveal>
        <Reveal style={{ marginTop: 20 }}><Alert>If caught, <strong>immediately release.</strong> Possession of any EPS constitutes Poaching — P.C. 10008 — Felony: 25 months &amp; $7,500 fine.</Alert></Reveal>
      </Section>
      <Section id="zones" alt>
        <Reveal><SectionHeader num="04" eyebrow="Operational Territory" title="Hunting & Fishing Zone Map" sub="Designated zones across San Andreas — every marked zone is SAPR's jurisdiction and responsibility" /></Reveal>
        <Split variant="even">
          <Reveal><Radar zones={KD.ZONES} active={zone} onSelect={setZone} /></Reveal>
          <Reveal delay={0.1}><ZoneList zones={KD.ZONES} active={zone} onHover={setZone} /><Alert tone="info">The entirety of Open Sea is legal to fish from a Boat</Alert></Reveal>
        </Split>
        <Reveal style={{ marginTop: 40 }}><Panel title="Zone Map" meta="hunting_fishing_map.png" body={false}><div style={{ position: 'relative', aspectRatio: '16/10' }}><Slot id="kit-map" fit="contain" ph="Drop hunting_fishing_map.png — the in-game zone map" /></div></Panel></Reveal>
      </Section>
      <Section id="codes">
        <Reveal><SectionHeader num="05" eyebrow="Title 10" title="Wildlife Penal Codes" /></Reveal>
        <Reveal><PenalCodeTable codes={KD.CODES.map(function (c) { return { code: c.code, offense: c.offense, cls: c.cls, sentence: c.s, months: c.m, fine: c.f }; })} /></Reveal>
      </Section>
      <Section id="roster" alt>
        <Reveal><SectionHeader num="06" eyebrow="Active Personnel" title="Department Roster" sub="All active SAPR officers — updated in real time" /></Reveal>
        <Split>
          <Reveal><Roster sections={KD.ROSTER.map(function (s) { return { section: s.section, people: s.people.map(function (p) { return { name: p.name, rank: p.rank, dept: p.dept, status: p.status }; }) }; })} /></Reveal>
          <Reveal delay={0.1}>
            <Phone eyebrow="Mobile Data Terminal" title="MDT & Warning Log" foot="Sample entries · linked by Citizen ID" height={560}>
              <Segmented value={mf} onChange={setMf} options={[{ value: 'all', label: 'All' }, { value: 'mdt', label: 'MDT' }, { value: 'warning', label: 'Warnings', tone: 'warn' }]} />
              {KD.MDT.filter(function (m) { return mf === 'all' || m.type === mf; }).map(function (m, i) { return <MdtEntry key={m.cid + mf} type={m.type} citizenId={m.cid} officer={m.officer} date={m.date} notes={m.notes} style={{ animationDelay: (i * 0.06) + 's' }} />; })}
              <div style={{ padding: 16 }}><Button variant="ghost" size="sm" block iconRight="arrow-right" onClick={function () { go('fieldwork', 'mdt'); }}>Open Field Work</Button></div>
            </Phone>
          </Reveal>
        </Split>
      </Section>
      <Section id="join-cta">
        <Reveal style={{ paddingTop: 20 }}><Notice stamp="Recruiting Open" eyebrow="Open Enrollment" title="San Andreas Park Rangers — Now Recruiting" lead="Open to all Officers. Quality over quantity, we want people who mean it." action={<Button iconRight="arrow-right" onClick={function () { go('join'); }}>Submit Expression of Interest</Button>} items={['Active & Dedicated Officers only', 'Meet Eddie & Rex in person', 'Quality field evidence', 'No quantity grinding(Overfining)', 'Response within 5–6 days']} /></Reveal>
      </Section>
    </React.Fragment>
  );
}
window.HomeScreen = HomeScreen;

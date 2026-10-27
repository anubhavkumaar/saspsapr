const KIT_EVIDENCE = [
  { id: 'ev1', by: 'Rex Davis', date: '27 Mar 2026', cap: 'Sample evidence — drop an in-game screenshot', tilt: -1.2 },
  { id: 'ev2', by: 'Trooper Eddie', date: '27 Mar 2026', cap: 'Sample evidence — drop an in-game screenshot', tilt: 0.8 },
  { id: 'ev3', by: 'Rex Davis', date: '28 Mar 2026', cap: 'Sample evidence — drop an in-game screenshot', tilt: -0.4 },
];
function FieldWorkScreen({ user, setUser, openLogin }) {
  const { Section, SectionHeader, Split, Button, AdminBar, DropZone, Input, FieldRow, Field, ChipGroup, Chip, EvidenceGrid, EvidenceCard, Paginator, Panel, Segmented, Textarea, FormStack, Phone, MdtEntry, Empty, Leaderboard, Alert, Reveal } = NS;
  const [who, setWho] = React.useState('all');
  const [page, setPage] = React.useState(0);
  const [ev, setEv] = React.useState(KIT_EVIDENCE);
  const [cap, setCap] = React.useState('');
  const [type, setType] = React.useState('mdt');
  const [cid, setCid] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [mf, setMf] = React.useState('all');
  const [log, setLog] = React.useState(KD.MDT.map(function (m, i) { return Object.assign({ id: 'm' + i }, m); }));
  const vis = ev.filter(function (e) { return who === 'all' || e.by === who; });
  const counts = {}; ev.forEach(function (e) { counts[e.by] = counts[e.by] || { count: 0, last: e.date }; counts[e.by].count++; });
  const lb = Object.keys(counts).map(function (k) { return { name: k, count: counts[k].count, last: counts[k].last }; }).sort(function (a, b) { return b.count - a.count; });
  const loginBtn = !user && <Button size="sm" variant="ghost" icon="lock" onClick={openLogin}>Officer Login</Button>;
  const bar = user && <AdminBar name="SAPR Management" email="sapr@anubhav.gg"><Button size="sm" variant="ghost" icon="users">Manage Users</Button><Button size="sm" variant="ghost" icon="log-out" onClick={function () { setUser(false); }}>Sign Out</Button></AdminBar>;
  return (
    <React.Fragment>
      <Section id="evidence">
        <Reveal><SectionHeader num="09" eyebrow="Field Evidence" title="Fishing Calls & Illegal Fish Evidence" sub="Documented visual evidence of illegal fishing activities and violations observed in the field" aside={loginBtn} /></Reveal>
        {bar}
        {user && (
          <div className="stack" style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
            <DropZone />
            <form onSubmit={function (e) { e.preventDefault(); setEv([{ id: 'ev' + Date.now(), by: 'SAPR Management', date: '12 Oct 2026', cap: cap || 'New evidence', tilt: 0.6 }].concat(ev)); setCap(''); }}>
              <FieldRow cols={3}><Input placeholder="Image URL — e.g. https://i.vgy.me/abc.png" /><Input placeholder="Caption (optional)" value={cap} onChange={function (e) { setCap(e.target.value); }} /><div style={{ display: 'flex', gap: 10 }}><Input type="date" defaultValue="2026-10-12" /><Button type="submit" icon="plus">Add</Button></div></FieldRow>
            </form>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
          <span className="t-label">Filter by officer</span>
          <ChipGroup>{['all', 'Rex Davis', 'Trooper Eddie'].map(function (o) { return <Chip key={o} active={who === o} onClick={function () { setWho(o); setPage(0); }}>{o === 'all' ? 'All Officers' : o}</Chip>; })}</ChipGroup>
          {who !== 'all' && <span className="t-label" style={{ color: 'var(--forest)' }}>{vis.length} image{vis.length !== 1 ? 's' : ''}</span>}
        </div>
        {vis.length ? <EvidenceGrid>{vis.map(function (e, i) { return <Reveal key={e.id} delay={i * 0.06}><EvidenceCard caption={e.cap} date={e.date} uploader={e.by} tilt={e.tilt} onDelete={user ? function () { setEv(ev.filter(function (x) { return x.id !== e.id; })); } : undefined}><Slot id={'kit-' + e.id} ph="In-game screenshot" /></EvidenceCard></Reveal>; })}</EvidenceGrid> : <Empty>No evidence from this officer yet.</Empty>}
        <Paginator page={page} totalPages={2} onChange={setPage} />
      </Section>
      <Section id="mdt" alt>
        <Reveal><SectionHeader num="MDT" eyebrow="Mobile Data Terminal" title="MDT & Warning Log" sub="Record of MDTs filed and warnings issued to citizens — linked by Citizen ID" aside={loginBtn} /></Reveal>
        <Split variant="even">
          <Reveal>
            {user ? (
              <Panel title="Log New Entry">
                <FormStack onSubmit={function () { if (!cid) return; setLog([{ id: 'm' + Date.now(), type: type, cid: cid, officer: 'SAPR Management', date: '12 Oct 2026', notes: notes }].concat(log)); setCid(''); setNotes(''); }}>
                  <Segmented value={type} onChange={setType} options={[{ value: 'mdt', label: 'MDT Made', icon: 'file-text' }, { value: 'warning', label: 'Warning Given', icon: 'triangle-alert', tone: 'warn' }]} />
                  <FieldRow><Field label="Citizen ID" required><Input mono placeholder="Citizen ID (e.g. 10942)" value={cid} onChange={function (e) { setCid(e.target.value); }} required /></Field><Field label="Date"><Input type="date" defaultValue="2026-10-12" /></Field></FieldRow>
                  <Field label="Notes"><Textarea placeholder="Notes / details (optional)" value={notes} onChange={function (e) { setNotes(e.target.value); }} /></Field>
                  <Button type="submit" icon="plus">{'Log ' + (type === 'mdt' ? 'MDT' : 'Warning')}</Button>
                </FormStack>
              </Panel>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}><Alert tone="info" icon="lock">Sign in to log or remove MDT entries.</Alert><div><Button icon="log-in" onClick={openLogin}>Officer Login</Button></div></div>
            )}
          </Reveal>
          <Reveal delay={0.1}>
            <Phone eyebrow="Mobile Data Terminal" title="MDT & Warning Log" foot="Sample entries · linked by Citizen ID" height={560}>
              <Segmented value={mf} onChange={setMf} options={[{ value: 'all', label: 'All' }, { value: 'mdt', label: 'MDT' }, { value: 'warning', label: 'Warnings', tone: 'warn' }]} />
              {log.filter(function (m) { return mf === 'all' || m.type === mf; }).map(function (m, i) { return <MdtEntry key={m.id + mf} type={m.type} citizenId={m.cid} officer={m.officer} date={m.date} notes={m.notes} style={{ animationDelay: (i * 0.05) + 's' }} onDelete={user ? function () { setLog(log.filter(function (x) { return x.id !== m.id; })); } : undefined} />; })}
            </Phone>
          </Reveal>
        </Split>
      </Section>
      <Section id="leaderboard">
        <Reveal><SectionHeader num="LB" eyebrow="Officer Activity" eyebrowTone="gold" title="Contribution Leaderboard" sub="Ranked by evidence submissions — every upload counts toward building the case for SAPR" /></Reveal>
        <Reveal><Leaderboard rows={lb} /></Reveal>
        <Reveal style={{ marginTop: 28 }}><Alert tone="warn" icon="trophy">Rankings update in real time. Submit evidence through the gallery above — each documented violation strengthens the case for a dedicated SAPR unit.</Alert></Reveal>
      </Section>
    </React.Fragment>
  );
}
window.FieldWorkScreen = FieldWorkScreen;

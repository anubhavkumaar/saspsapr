const KIT_USERS = [{ name: 'SAPR Management', email: 'sapr@anubhav.gg' }, { name: 'Eddie Brock', email: 'eddiebrock@sapr.gg' }, { name: 'SASP High Command', email: 'sasp@sapr.gg' }, { name: 'Ricky Shawn', email: 'rickyshawn@saspr.gg' }];
const KIT_APPS = [
  { id: 'a1', name: 'Sample Applicant A', citizenId: '1156', department: 'LSPD', rank: 'Officer', tags: ['pending'], why: 'Sample pitch — real applications load from Firestore.', availability: 'Evenings IST, ~10 hrs/week', discord: '@sample_a' },
  { id: 'a2', name: 'Sample Applicant B', citizenId: '2208', department: 'SASP', rank: 'Trooper', tags: ['shortlisted'], why: 'Sample pitch — real applications load from Firestore.', availability: 'Weekends', discord: '@sample_b' },
  { id: 'a3', name: 'Sample Applicant C', citizenId: '3310', department: 'LSPD', rank: 'Deputy', tags: ['reviewed'], why: 'Sample pitch — real applications load from Firestore.', availability: '~6 hrs/week', discord: '@sample_c' }
];
const TAGS = [['pending', 'Pending'], ['on_hold', 'On Hold'], ['shortlisted', 'Shortlisted'], ['reviewed', 'Reviewed'], ['rejected', 'Rejected']];
function AdminScreen({ go, user, setUser, formOpen, setFormOpen }) {
  const { LoginCard, Section, SectionHeader, AdminBar, Button, ControlCard, Live, Split, Panel, FormStack, Input, Label, DataTable, Select, SearchInput, ApplicationCard, Modal, Chip, ChipGroup, Empty, Reveal } = NS;
  const [q, setQ] = React.useState('');
  const [tf, setTf] = React.useState('all');
  const [apps, setApps] = React.useState(KIT_APPS);
  const [sel, setSel] = React.useState(null);
  const [sections, setSections] = React.useState(KD.ROSTER.map(function (s) { return s.section; }));
  const [ns, setNs] = React.useState('');
  const [members, setMembers] = React.useState([{ call: '—', cid: '—', name: 'Trooper Eddie', sapr: 'Overwatch', sasp: 'Trooper', dept: 'SASP', status: 'Active', section: 'Overwatch' }, { call: '222', cid: '—', name: 'Rex Davis', sapr: 'Game Warden', sasp: '—', dept: 'LSPD', status: 'Active', section: 'High Command' }]);
  if (!user) return <Section><div style={{ padding: '40px 0' }}><LoginCard defaultEmail="sapr@anubhav.gg" defaultPassword="ranger" onSubmit={function () { setUser(true); }} sub="Prototype — any credentials sign in." /></div></Section>;
  const move = function (i, d) { const s = sections.slice(); const j = i + d; if (j < 0 || j >= s.length) return; const t = s[i]; s[i] = s[j]; s[j] = t; setSections(s); };
  const edit = function (i, k, v) { const m = members.slice(); m[i] = Object.assign({}, m[i]); m[i][k] = v; setMembers(m); };
  const cell = function (k, mono) { return function (v, r) { const i = members.indexOf(r); return <Input mono={mono} value={v} onChange={function (e) { edit(i, k, e.target.value); }} style={{ padding: '7px 9px', fontSize: 13.5, minWidth: 90 }} />; }; };
  const vis = apps.filter(function (a) { return (tf === 'all' || a.tags.indexOf(tf) > -1) && (!q || (a.name + a.citizenId + a.department + a.discord).toLowerCase().indexOf(q.toLowerCase()) > -1); });
  const toggleTag = function (id) { const a = Object.assign({}, sel); a.tags = a.tags.indexOf(id) > -1 ? a.tags.filter(function (t) { return t !== id; }) : a.tags.concat(id); if (!a.tags.length) a.tags = ['pending']; setSel(a); setApps(apps.map(function (x) { return x.id === a.id ? a : x; })); };
  return (
    <React.Fragment>
      <Section>
        <AdminBar name="SAPR Admin — Management Only" email="sapr@anubhav.gg"><Button size="sm" variant="ghost" icon="arrow-left" onClick={function () { go('home'); }}>Back to Site</Button><Button size="sm" variant="ghost" icon="log-out" onClick={function () { setUser(false); }}>Sign Out</Button></AdminBar>
        <Reveal><SectionHeader num="ADMIN" eyebrow="Management Dashboard" title="SAPR Admin Panel" /></Reveal>
        <Reveal><ControlCard title="Recruitment Form" sub="Controls whether /joinsapr shows the application form to the public." status={<Live tone={formOpen ? 'ok' : 'danger'}>{'Status: ' + (formOpen ? 'Open' : 'Closed')}</Live>} action={<Button variant={formOpen ? 'danger' : 'primary'} onClick={function () { setFormOpen(!formOpen); }}>{formOpen ? 'Close Form' : 'Open Form'}</Button>} /></Reveal>
      </Section>
      <Section alt id="users">
        <Reveal><SectionHeader num="USERS" eyebrow="Management Only" eyebrowTone="gold" title="Officer Accounts" /></Reveal>
        <Split variant="even">
          <Reveal><Panel title="Create Officer Account"><FormStack><Input placeholder="Display name (e.g. Sgt. Rex Davis)" /><Input type="email" placeholder="Email address" /><Input type="password" placeholder="Password (min 6 chars)" /><div><Button icon="plus">Create Account</Button></div></FormStack></Panel></Reveal>
          <Reveal delay={0.08}><Panel title="Registered Officers" meta={'(' + KIT_USERS.length + ')'} body={false}>{KIT_USERS.map(function (u) { return <div key={u.email} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 12, alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--rule)' }}><div><b style={{ display: 'block' }}>{u.name}</b><span className="t-mono" style={{ fontSize: 12, color: 'var(--ink-2)' }}>{u.email}</span></div><Button size="sm" variant="ghost" icon="key-round">Reset</Button></div>; })}</Panel></Reveal>
        </Split>
      </Section>
      <Section id="roster-management">
        <Reveal><SectionHeader num="ROSTER" eyebrow="Management Only" eyebrowTone="gold" title="Manage Roster" sub="Click any cell to edit — changes save automatically on blur" /></Reveal>
        <Split variant="wide-right">
          <Reveal><Panel title="Sections" meta={sections.length + ' sections'} body={false}>
            {sections.map(function (s, i) { return <div key={s} style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr) auto auto', gap: 10, alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid var(--rule)' }}><span style={{ display: 'flex', gap: 4 }}><Button size="sm" variant="ghost" icon="arrow-up" disabled={i === 0} onClick={function () { move(i, -1); }} /><Button size="sm" variant="ghost" icon="arrow-down" disabled={i === sections.length - 1} onClick={function () { move(i, 1); }} /></span><b>{s}</b><span className="t-label">{members.filter(function (m) { return m.section === s; }).length} officers</span><Button size="sm" variant="danger" icon="x" onClick={function () { setSections(sections.filter(function (x) { return x !== s; })); }} /></div>; })}
            <form style={{ display: 'flex', gap: 8, padding: 14 }} onSubmit={function (e) { e.preventDefault(); if (ns && sections.indexOf(ns) < 0) { setSections(sections.concat(ns)); setNs(''); } }}><Input placeholder="New section name…" value={ns} onChange={function (e) { setNs(e.target.value); }} /><Button type="submit" size="sm" icon="plus">Add</Button></form>
          </Panel></Reveal>
          <Reveal delay={0.08}><DataTable rows={members} columns={[{ key: 'call', label: 'Call Sign', render: cell('call', true) }, { key: 'name', label: 'Name', render: cell('name') }, { key: 'sapr', label: 'SAPR Rank', render: cell('sapr') }, { key: 'dept', label: 'Dept', render: function (v) { return <Label>{v}</Label>; } }, { key: 'status', label: 'Status', render: function (v) { return <Label>{v}</Label>; } }, { key: 'section', label: 'Section', render: function (v, r) { const i = members.indexOf(r); return <Select value={v} options={sections} onChange={function (e) { edit(i, 'section', e.target.value); }} />; } }]} /></Reveal>
        </Split>
      </Section>
      <Section alt id="applications">
        <Reveal><SectionHeader num="APPS" eyebrow="Management Only" eyebrowTone="gold" title="Recruitment Applications" /></Reveal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          <SearchInput placeholder="Search by name, CID, department, Discord…" value={q} onChange={function (e) { setQ(e.target.value); }} />
          <div className="filters"><button type="button" className={tf === 'all' ? 'is-on' : ''} onClick={function () { setTf('all'); }}>All <em>{apps.length}</em></button>{TAGS.map(function (t) { const n = apps.filter(function (a) { return a.tags.indexOf(t[0]) > -1; }).length; return <button key={t[0]} type="button" className={tf === t[0] ? 'is-on' : ''} onClick={function () { setTf(t[0]); }}>{t[1]}{n > 0 && <em>{n}</em>}</button>; })}</div>
        </div>
        {vis.length ? <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{vis.map(function (a, i) { return <Reveal key={a.id} delay={i * 0.05}><ApplicationCard name={a.name} citizenId={a.citizenId} department={a.department} rank={a.rank} tags={a.tags} why={a.why} availability={a.availability} discord={a.discord} onClick={function () { setSel(a); }} /></Reveal>; })}</div> : <Empty>{'No applications' + (tf !== 'all' ? ' tagged "' + TAGS.filter(function (t) { return t[0] === tf; })[0][1] + '"' : '') + ' yet.'}</Empty>}
        <Modal open={!!sel} onClose={function () { setSel(null); }} width={560} title={sel && sel.name} sub={sel && ('CID: ' + sel.citizenId + ' · ' + sel.department + (sel.rank ? ' · ' + sel.rank : ''))}>
          {sel && <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div><div className="t-label" style={{ marginBottom: 10 }}>Tags</div><ChipGroup>{TAGS.map(function (t) { return <Chip key={t[0]} active={sel.tags.indexOf(t[0]) > -1} onClick={function () { toggleTag(t[0]); }}>{t[1]}</Chip>; })}</ChipGroup></div>
            {[['Why SAPR', sel.why], ['Availability', sel.availability], ['Discord', sel.discord]].map(function (r) { return <div key={r[0]} style={{ borderTop: '1px solid var(--rule)', paddingTop: 12 }}><div className="t-label">{r[0]}</div><div style={{ marginTop: 4 }}>{r[1]}</div></div>; })}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: 'var(--bw) solid var(--frame)', paddingTop: 16 }}><Button variant="danger" size="sm" icon="trash-2" onClick={function () { setApps(apps.filter(function (x) { return x.id !== sel.id; })); setSel(null); }}>Delete</Button><Button size="sm" onClick={function () { setSel(null); }}>Done</Button></div>
          </div>}
        </Modal>
      </Section>
    </React.Fragment>
  );
}
window.AdminScreen = AdminScreen;

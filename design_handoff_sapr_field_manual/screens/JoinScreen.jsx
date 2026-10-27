function JoinScreen({ formOpen }) {
  const { Section, SectionHeader, Card, CardBody, PinList, Panel, FormStack, FieldRow, Field, Input, Select, Button, Stamp, Alert, Reveal, Icon } = NS;
  const [done, setDone] = React.useState(false);
  return (
    <Section id="recruit">
      <Reveal><SectionHeader num="JOIN" eyebrow={formOpen ? 'Open Enrollment' : 'Enrollment Closed'} title="San Andreas Park Rangers — Now Recruiting" sub="Open to all Officers. Quality over quantity, we want people who mean it." /></Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.15fr)', gap: 40, alignItems: 'start' }} className="kit-join">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <Reveal><Card icon="megaphone" title="Open to all Officers, Limited Slots"><CardBody>
            <p style={{ fontSize: 15.5, lineHeight: 1.65 }}>Fill out the form below. Keep it real, <strong>1 or 2 lines</strong>, no AI-written essays. Tell us why you want to join and what you're bringing to the table.</p>
            <p style={{ fontSize: 15.5, lineHeight: 1.65, marginTop: 12 }}>Once your form is submitted, you'll need to <strong>find a time to meet Trooper Eddie (SAPR Overwatch) and Game Warden Rex in person</strong> — sit down, give your pitch, share your ambitions. If it's a fit, your application gets marked and you'll receive your login credentials.</p>
            <p style={{ fontSize: 15.5, lineHeight: 1.65, marginTop: 12 }}>From there — upload your field evidence. <strong>Quality, not quantity.</strong> We don't want someone grinding just to show numbers. If the work is genuine, you'll hear back within <strong>5 to 6 days.</strong></p>
          </CardBody></Card></Reveal>
          <Reveal delay={0.08}><PinList items={['Active & Dedicated Officers only', 'Meet Eddie & Rex in person', 'Quality field evidence', 'No quantity grinding(Overfining)', 'Response within 5–6 days']} /></Reveal>
        </div>
        <Reveal delay={0.12}>
          {!formOpen ? (
            <Panel title="Applications"><div style={{ textAlign: 'center', padding: '40px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}><Stamp size="lg" rotate={-5}>Applications Closed</Stamp><p className="t-small" style={{ maxWidth: 380 }}>Recruitment is not currently open. Check back later or reach out to SAPR Management on Discord.</p></div></Panel>
          ) : done ? (
            <Panel title="Expression of Interest"><div style={{ textAlign: 'center', padding: '40px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}><Stamp tone="forest" size="lg" rotate={-4}>Form Received</Stamp><p className="t-body" style={{ maxWidth: 400, color: 'var(--ink-2)' }}>Now find a time to sit down with Trooper Eddie & Game Warden Rex — give your pitch in person. We'll take it from there.</p><Button variant="ghost" size="sm" onClick={function () { setDone(false); }}>Submit another</Button></div></Panel>
          ) : (
            <Panel title="Expression of Interest — Fill it yourself, keep it real">
              <FormStack onSubmit={function () { setDone(true); }}>
                <FieldRow><Field label="In-Game Name" required><Input placeholder="e.g. Rex Davis" required /></Field><Field label="Citizen ID" required><Input mono placeholder="e.g. 1156" required /></Field></FieldRow>
                <FieldRow><Field label="Current Department" required><Select placeholder="— Select —" options={['LSPD', 'SASP']} required defaultValue="" /></Field><Field label="Current Rank / Callsign"><Input placeholder="e.g. Officer, Deputy, Sgt." /></Field></FieldRow>
                <Field label="Availability (shifts / hours per week)"><Input placeholder="e.g. Evenings IST, ~10 hrs/week" /></Field>
                <Field label="Why do you want to join SAPR?" required hint="1 or 2 lines, no AI"><Input placeholder="Your pitch & ambitions — you'll explain the rest to Eddie & Rex in person" required /></Field>
                <Field label="Discord Tag" required><Input placeholder="e.g. @anubhavv" required /></Field>
                <div><Button type="submit" iconRight="arrow-right">Submit Expression of Interest</Button></div>
              </FormStack>
            </Panel>
          )}
        </Reveal>
      </div>
    </Section>
  );
}
window.JoinScreen = JoinScreen;

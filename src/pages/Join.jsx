import { useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { ArrowRight, Megaphone } from 'lucide-react'
import { db } from '../firebase'
import { MANAGEMENT_EMAIL, useAuthUser } from '../lib/auth'
import { MIN_FILL_MS, SUBMIT_COOLDOWN_MS, getDeviceFingerprint, setRecruitmentOpen, useRecruitmentOpen } from '../lib/recruitment'
import { DEPARTMENTS, RECRUIT_CHECKS, RECRUIT_LEAD, RECRUIT_TITLE } from '../data/recruitment'
import {
  AdminBar, Alert, Button, Card, CardBody, Field, FieldRow, FormStack, Input, Laptop, Panel, PinList, Reveal, Section, SectionHeader, Select, Stamp,
} from '../components'
import logoLockup from '../assets/Ci37hio.png'

const para = { fontSize: 15.5, lineHeight: 1.65 }

// /joinsapr — the announcement and what to expect, then the Expression of Interest on a laptop that boots when opened.
// Three states, as before: open (the form), closed (set in Firestore), received (after a submission).
// Validation, spam gates and the Firestore writes are unchanged from the original form.
export default function Join() {
  const [name,    setName]    = useState('')
  const [cid,     setCid]     = useState('')
  const [dept,    setDept]    = useState('')
  const [rank,    setRank]    = useState('')
  const [avail,   setAvail]   = useState('')
  const [why,     setWhy]     = useState('')
  const [discord, setDiscord] = useState('')
  const [hp,      setHp]      = useState('')          // honeypot: must remain empty
  const [busy,    setBusy]    = useState(false)
  const [done,    setDone]    = useState(false)
  const [err,     setErr]     = useState('')
  const [mountedAt] = useState(() => Date.now())

  // Admin form-open/close control
  const adminUser = useAuthUser()
  const { formOpen, configLoading } = useRecruitmentOpen()
  const [toggling,  setToggling]  = useState(false)
  const [toggleErr, setToggleErr] = useState('')

  const toggleFormOpen = async () => {
    setToggling(true); setToggleErr('')
    try { await setRecruitmentOpen(!formOpen) }
    catch (e) { setToggleErr(e.message || 'Write failed — check Firestore rules for sapr_config.') }
    finally { setToggling(false) }
  }

  const isAdmin = adminUser && MANAGEMENT_EMAIL.includes(adminUser.email)

  const handleSubmit = async () => {
    setErr('')
    if (!name.trim() || !cid.trim() || !dept || !why.trim() || !discord.trim()) return

    // Gate 1: honeypot — bots auto-fill every field.
    if (hp) { setDone(true); return }                       // silently "succeed" for bots

    // Gate 2: min fill time — submitted in <4 s is almost certainly a bot.
    if (Date.now() - mountedAt < MIN_FILL_MS) {
      setErr('Please take a moment to review your application before submitting.')
      return
    }

    // Gate 3: local cooldown — one submission per device per 24 h.
    const last = parseInt(localStorage.getItem('sapr_last_submit') || '0', 10)
    if (last && Date.now() - last < SUBMIT_COOLDOWN_MS) {
      const hrs = Math.ceil((SUBMIT_COOLDOWN_MS - (Date.now() - last)) / 3_600_000)
      setErr(`You've already submitted an application recently. Try again in ~${hrs}h.`)
      return
    }

    setBusy(true)
    try {
      const cidTrim     = cid.trim()
      const discordTrim = discord.trim()
      const fp = getDeviceFingerprint()
      await addDoc(collection(db, 'sapr_applications'), {
        name:      name.trim(),
        citizenId: cidTrim,
        department: dept,
        rank:      rank.trim(),
        availability: avail.trim(),
        why:       why.trim(),
        discord:   discordTrim,
        status:    'pending',
        tags:      ['pending'],
        submittedAt: serverTimestamp(),
        fp,
      })

      // Write an audit trail for management review (Gate 5).
      try {
        await addDoc(collection(db, 'sapr_submissions'), {
          fp,
          citizenId: cidTrim,
          discord:   discordTrim,
          userAgent: navigator.userAgent?.slice(0, 256) || '',
          submittedAt: serverTimestamp(),
        })
      } catch { /* audit write is non-fatal */ }

      try { localStorage.setItem('sapr_last_submit', String(Date.now())) } catch { /* storage unavailable */ }
      setDone(true)
    } catch { setErr('Submission failed — please try again.') }
    finally  { setBusy(false) }
  }

  const closed = !formOpen && !isAdmin

  return (
    <Section id="recruit">
      <Reveal>
        <SectionHeader num="JOIN" eyebrow={formOpen ? 'Open Enrollment' : 'Enrollment Closed'} title={RECRUIT_TITLE} sub={RECRUIT_LEAD}/>
      </Reveal>

      {/* Admin toggle bar — only visible to management */}
      {isAdmin && (
        <>
          <AdminBar name={`Admin — Recruitment form is currently ${configLoading ? '…' : formOpen ? 'OPEN' : 'CLOSED'}`}>
            <Button size="sm" variant={formOpen ? 'danger' : 'primary'} onClick={toggleFormOpen} disabled={toggling || configLoading}>
              {toggling ? 'Saving…' : formOpen ? 'Close Form' : 'Open Form'}
            </Button>
          </AdminBar>
          {toggleErr && <Alert style={{ marginBottom: 20 }}>{toggleErr}</Alert>}
        </>
      )}

      <div className="join-grid">
        <Reveal>
          <Card icon={Megaphone} title="Open to all Officers, Limited Slots">
            <CardBody>
              <p style={para}>Fill out the form below. Keep it real, <strong>1 or 2 lines</strong>, no AI-written essays. Tell us why you want to join and what you're bringing to the table.</p>
              <p style={{ ...para, marginTop: 12 }}>Once your form is submitted, you'll need to <strong>find a time to meet High Command — Game Warden Rex Davis or Lead Ranger Ricky Shawn — in person</strong> — sit down, give your pitch, share your ambitions. If it's a fit, your application gets marked and you'll receive your login credentials.</p>
              <p style={{ ...para, marginTop: 12 }}>From there — upload your field evidence. <strong>Quality, not quantity.</strong> We don't want someone grinding just to show numbers. If the work is genuine, you'll hear back within <strong>5 to 6 days.</strong></p>
            </CardBody>
          </Card>
        </Reveal>
        <Reveal delay={0.08}><PinList items={RECRUIT_CHECKS}/></Reveal>
      </div>

      {!configLoading && (
        <Reveal id="apply" style={{ marginTop: 64 }}>
          <Laptop url="saspsapr.web.app/joinsapr" logo={logoLockup}
            hint={formOpen ? 'Click to open — Apply' : 'Click to open'}
            sub={formOpen ? 'Expression of Interest · Fill it yourself, keep it real' : 'Enrollment Closed'}
            bootLines={[
              'SAPR FIELD TERMINAL — v2.6',
              'Authenticating device… OK',
              'Checking enrollment status… ' + (formOpen ? 'OPEN' : 'CLOSED'),
              formOpen ? 'Loading Expression of Interest…' : 'Loading notice…',
            ]}>
            {closed ? (
              <Panel title="Applications">
                <div className="join-state">
                  <Stamp size="lg" rotate={-5}>Applications Closed</Stamp>
                  <p className="t-small" style={{ maxWidth: 380 }}>Recruitment is not currently open. Check back later or reach out to SAPR Management on Discord.</p>
                </div>
              </Panel>
            ) : done ? (
              <Panel title="Expression of Interest">
                <div className="join-state">
                  <Stamp tone="forest" size="lg" rotate={-4}>Form Received</Stamp>
                  <p className="t-body" style={{ maxWidth: 400, color: 'var(--ink-2)' }}>Now find a time to sit down with High Command — Game Warden Rex Davis or Lead Ranger Ricky Shawn — and give your pitch in person. We'll take it from there.</p>
                </div>
              </Panel>
            ) : (
              <>
                {isAdmin && !formOpen && <Alert tone="warn" style={{ marginBottom: 16 }}>Form is closed to the public — visible to admins only.</Alert>}
                <Panel title="Expression of Interest — Fill it yourself, keep it real">
                  <FormStack onSubmit={handleSubmit} autoComplete="off">
                    {/* Honeypot — hidden from humans, filled by bots */}
                    <div className="hp" aria-hidden="true">
                      <label>Website
                        <input tabIndex="-1" autoComplete="off" type="text" value={hp} onChange={e => setHp(e.target.value)}/>
                      </label>
                    </div>
                    <FieldRow>
                      <Field label="In-Game Name" required><Input placeholder="e.g. Rex Davis" value={name} onChange={e => setName(e.target.value)} required/></Field>
                      <Field label="Citizen ID" required><Input mono placeholder="e.g. 1156" value={cid} onChange={e => setCid(e.target.value)} required/></Field>
                    </FieldRow>
                    <FieldRow>
                      <Field label="Current Department" required><Select placeholder="— Select —" options={DEPARTMENTS} value={dept} onChange={e => setDept(e.target.value)} required/></Field>
                      <Field label="Current Rank / Callsign"><Input placeholder="e.g. Officer, Deputy, Sgt." value={rank} onChange={e => setRank(e.target.value)}/></Field>
                    </FieldRow>
                    <Field label="Availability (shifts / hours per week)"><Input placeholder="e.g. Evenings IST, ~10 hrs/week" value={avail} onChange={e => setAvail(e.target.value)}/></Field>
                    <Field label="Why do you want to join SAPR?" required hint="1 or 2 lines, no AI">
                      <Input placeholder="Your pitch & ambitions — you'll explain the rest to Eddie & Rex in person" value={why} onChange={e => setWhy(e.target.value)} required/>
                    </Field>
                    <Field label="Discord Tag" required><Input placeholder="e.g. @anubhavv " value={discord} onChange={e => setDiscord(e.target.value)} required/></Field>
                    {err && <Alert>{err}</Alert>}
                    <div><Button type="submit" iconRight={ArrowRight} disabled={busy}>{busy ? 'Submitting…' : 'Submit Expression of Interest'}</Button></div>
                  </FormStack>
                </Panel>
              </>
            )}
          </Laptop>
        </Reveal>
      )}
    </Section>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Info, Maximize2, Minimize2, RefreshCw, ScanSearch, ShieldCheck, X } from 'lucide-react'
import { useAuthWithRole } from '../lib/auth'
import { Alert, Button, Empty, Icon, Notice, Section, SectionHeader } from '../components'

const SHEET_ID  = '12IUCLWEUFxP-d4e50UNahn0dzx2xGqfgYX585KonyqQ'
const SHEET_GID = '148885738'
const SHEET_EDIT_URL  = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?gid=${SHEET_GID}#gid=${SHEET_GID}`
const SHEET_EMBED_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?rm=minimal&gid=${SHEET_GID}#gid=${SHEET_GID}`
const SHEET_VIEW_URL  = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/htmlembed?gid=${SHEET_GID}&single=true&widget=false&headers=false&chrome=false`

// The hunting & weapon licence registry: a Google Sheet shown in a frame. Editors get the editable embed, everyone else
// the read-only one (this page is only reachable signed in, so it is always the editable view here).
function HuntingLicenseRegistry({ canEdit = false }) {
  const [fs,  setFs]  = useState(false)
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (!fs) return
    const onKey = e => { if (e.key === 'Escape') setFs(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fs])

  // While the pointer is over the sheet the page stops scrolling, so the wheel scrolls the sheet instead.
  const lockScroll   = () => { document.body.style.overflow = 'hidden' }
  const unlockScroll = () => { document.body.style.overflow = '' }
  useEffect(() => unlockScroll, [])   // leaving the page with the pointer still over the sheet must not leave it locked

  const tips = [
    { icon: ScanSearch, k: 'Search',     v: <>Click inside the sheet then press <kbd>Ctrl/Cmd</kbd>+<kbd>F</kbd> to find a name or CID.</> },
    { icon: Maximize2,  k: 'Fullscreen', v: 'Wide registry with many columns — use fullscreen for comfortable viewing.' },
    { icon: ShieldCheck, k: 'Access',    v: canEdit
      ? 'Sign in to Google with a whitelisted account. If editing is disabled here, use "Open in Sheets" above — browser cookie policies can block iframe auth.'
      : 'Read-only public view. Rangers and Management can edit via "Open in Sheets".' },
  ]

  return (
    <Section tight id="hunting-log">
      <SectionHeader num="LOG" eyebrow={'Live · ' + (canEdit ? 'Field Operations' : 'Public Registry')} title="Hunting License Registry"
        sub={canEdit
          ? 'Issue, verify, and track hunting & weapon licenses. Live-synced with Google Sheets.'
          : 'Verify hunting & weapon licenses issued by SAPR. Read-only view — contact a Ranger for new issuance.'}
        aside={
          <div className="sheet-actions">
            <Button size="sm" variant="ghost" icon={RefreshCw} onClick={() => setKey(k => k + 1)} title="Reload sheet">Reload</Button>
            <Button size="sm" variant="ghost" icon={fs ? Minimize2 : Maximize2} onClick={() => setFs(v => !v)} title={fs ? 'Exit fullscreen' : 'Fullscreen'}>{fs ? 'Exit Fullscreen' : 'Fullscreen'}</Button>
            <Button size="sm" href={SHEET_EDIT_URL} target="_blank" rel="noopener noreferrer" iconRight={ExternalLink}>Open in Sheets</Button>
          </div>}/>

      {canEdit && (
        <Alert tone="info" icon={Info} style={{ marginBottom: 20 }}>
          <b>Can't edit inline?</b> Your browser may be blocking third-party cookies, which Google needs to keep you signed in inside an iframe.
          Use <a href={SHEET_EDIT_URL} target="_blank" rel="noopener noreferrer">Open in Sheets</a> — it opens in a new tab with full editing.
        </Alert>
      )}

      <div className={'sheet' + (fs ? ' sheet--fs' : '')} onMouseEnter={lockScroll} onMouseLeave={unlockScroll}>
        {fs && <Button className="sheet__exit" size="sm" variant="danger" icon={X} onClick={() => setFs(false)} aria-label="Exit fullscreen">Exit Fullscreen</Button>}
        <iframe key={key} className="sheet__frame" src={canEdit ? SHEET_EMBED_URL : SHEET_VIEW_URL} title="SAPR Hunting License Registry"
          referrerPolicy="origin" allow="clipboard-read; clipboard-write; autoplay"/>
      </div>

      <div className="tips">
        {tips.map(t => (
          <div key={t.k}><span className="kv__k"><Icon icon={t.icon}/>{t.k}</span><span className="tips__v">{t.v}</span></div>
        ))}
      </div>
    </Section>
  )
}

// /licenses — signed-in users only.
export default function Licenses() {
  const { user, authLoaded } = useAuthWithRole()

  if (!authLoaded) return <Section tight><Empty>Loading…</Empty></Section>

  if (!user) return (
    <Section tight>
      <Notice eyebrow="Hunting License Registry" title="Sign-in required"
        lead="The Hunting License Registry is only visible to signed-in users. Please sign in through the Ranger Portal or Join SAPR to request access."
        action={
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Button as={Link} to="/ranger">Ranger Portal</Button>
            <Button as={Link} to="/joinsapr" variant="ghost">Join SAPR</Button>
          </div>}/>
    </Section>
  )

  return <HuntingLicenseRegistry canEdit/>
}

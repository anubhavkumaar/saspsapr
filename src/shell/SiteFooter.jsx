import { useLocation, useNavigate } from 'react-router-dom'
import { isHomePath, scrollToSection } from '../lib/nav'
import { Footer } from '../components'
import logoLockup from '../assets/Ci37hio.png'
import builderAk from '../assets/logos/builder-ak.png'
import { replayIntro } from './replayIntro.js'

export function SiteFooter() {
  const navigate = useNavigate()
  const onHome = isHomePath(useLocation().pathname)
  // Section links scroll in place on Home and route there from anywhere else.
  const section = (id, path) => () => (onHome ? scrollToSection(id, path) : navigate(path))
  return (
    <Footer logo={logoLockup}
      lines={[
        'Protecting wildlife · Enforcing regulations · Preserving the ecosystem',
        'Built & led by Game Warden Rex Davis (700 · 777) · Founding Officer, San Andreas Park Rangers',
      ]}
      links={[
        { label: 'Home',        to: '/' },
        { label: 'Roster',      onClick: section('roster', '/roster') },
        { label: 'Hunting',     onClick: section('hunting', '/hunting') },
        { label: 'Fishing',     onClick: section('fishing', '/fishing') },
        { label: 'Zone Map',    onClick: section('zones', '/map') },
        { label: 'Join SAPR',   to: '/joinsapr' },
        { label: 'Field Work',  to: '/fieldwork' },
        { label: 'Replay intro', onClick: replayIntro },
      ]}
      colophon={['SAPR Field Handbook', 'Statewide Edition 2026']}
      builtBy={{ logo: builderAk, name: 'Anubhav' }}/>
  )
}

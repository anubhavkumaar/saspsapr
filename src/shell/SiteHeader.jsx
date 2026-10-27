import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LogIn, ShieldCheck } from 'lucide-react'
import { effectiveRole, useAuthWithRole } from '../lib/auth'
import { useMyProfile } from '../lib/profile'
import { isHomePath, scrollToSection } from '../lib/nav'
import { Button, Header, ThemeToggle } from '../components'
import logoLockup from '../assets/Ci37hio.png'
import { AccountPanel } from './AccountPanel.jsx'
import { LoginModal } from './LoginModal.jsx'

export function SiteHeader() {
  const { user, role } = useAuthWithRole()
  const resolvedRole = effectiveRole(user, role)
  const isRanger = resolvedRole === 'ranger' || resolvedRole === 'management'
  const loc      = useLocation()
  const navigate = useNavigate()
  const onHome   = isHomePath(loc.pathname)

  const myProfile = useMyProfile(user)
  const [loginOpen, setLoginOpen] = useState(false)

  // My Profile panel: open for the page it was opened on, so going anywhere else closes it.
  const [panelPath, setPanelPath] = useState(null)
  const panelOpen = !!user && panelPath === loc.pathname
  const chipRef   = useRef(null)

  // Brand — secret: click 5× within 2s each to reach /admin
  const clicks = useRef(0)
  const timer  = useRef(null)
  const onBrand = () => {
    clicks.current += 1
    clearTimeout(timer.current)
    if (clicks.current >= 5) {
      clicks.current = 0
      navigate('/admin')
      return
    }
    timer.current = setTimeout(() => { clicks.current = 0 }, 2000)
    if (onHome) scrollToSection('hero', '/')
    else navigate('/')
  }

  const at = p => loc.pathname === p
  const links = [
    { label: 'Home',       to: '/',          active: onHome },
    { label: 'Field Work', to: '/fieldwork', active: at('/fieldwork') },
    ...(user ? [{ label: 'Licenses', to: '/licenses', active: at('/licenses') }] : []),
    { label: 'Join',       to: '/joinsapr',  active: at('/joinsapr') },
    ...(isRanger ? [{ label: 'Ranger', to: '/ranger', active: at('/ranger') }] : []),
    ...(resolvedRole === 'management' ? [{ label: 'Admin', to: '/admin', active: at('/admin') }] : []),
  ]

  const fullName = (myProfile?.displayName || user?.email || '').trim()
  const surname  = fullName.split(/\s+/).filter(Boolean).pop() || fullName.split('@')[0]
  const who      = !user ? '' : isRanger ? `Ranger ${surname}` : (user.email || '').split('@')[0]

  return (
    <>
      <Header logo={logoLockup} onBrand={onBrand} links={links}
        actions={<>
          <ThemeToggle/>
          {user
            ? <span ref={chipRef} className="acct-anchor">
                <Button size="sm" variant="ghost" icon={ShieldCheck} aria-label={who} title={user.email}
                  aria-haspopup="dialog" aria-expanded={panelOpen} aria-controls="account-panel"
                  onClick={() => setPanelPath(panelOpen ? null : loc.pathname)}>{who}</Button>
              </span>
            : <Button size="sm" variant="ghost" icon={LogIn} aria-label="Officer Login" onClick={() => setLoginOpen(true)}>Officer Login</Button>}
        </>}/>
      {user && <AccountPanel open={panelOpen} onClose={() => setPanelPath(null)} anchorRef={chipRef} user={user} profile={myProfile} ranger={isRanger}/>}
      <LoginModal open={loginOpen && !user} onClose={() => setLoginOpen(false)}/>
    </>
  )
}

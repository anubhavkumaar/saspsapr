import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { isHomePath } from '../lib/nav'
import { BlockedGate } from './BlockedGate.jsx'
import { Intro } from './Intro.jsx'
import { SiteFooter } from './SiteFooter.jsx'
import { SiteHeader } from './SiteHeader.jsx'

// Chrome shared by every route: intro, blocked-user watchdog, sticky header, footer.
export function Layout() {
  const { pathname } = useLocation()

  // A new page starts at the top. Home paths scroll to their own section (see useHomeSections).
  // A #hash on any route still jumps to its element once the route's DOM is mounted.
  useEffect(() => {
    if (!isHomePath(pathname)) window.scrollTo(0, 0)
    const hash = window.location.hash.replace('#', '')
    if (!hash) return
    const t = setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <>
      <Intro/>
      <BlockedGate/>
      <SiteHeader/>
      <main><Outlet/></main>
      <SiteFooter/>
    </>
  )
}

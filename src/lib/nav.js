// Home is one long page, but each section also answers on its own path (/roster, /hunting …).
// Landing on one scrolls to its section, and scrolling the page mirrors the URL back to the section in view.
export const HOME_SECTIONS = [
  { id: 'hero',      path: '/' },
  { id: 'roster',    path: '/roster' },
  { id: 'personnel', path: '/personnel' },
  { id: 'hunting',   path: '/hunting' },
  { id: 'fishing',   path: '/fishing' },
  { id: 'zones',     path: '/map' },
]
export const HOME_PATHS = HOME_SECTIONS.map(s => s.path)
export const isHomePath = p => HOME_PATHS.includes(p)

// Smooth-scroll to a section and sync the URL without a router navigation.
export function scrollToSection(id, path) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  if (path && window.location.pathname !== path) window.history.replaceState(null, '', path)
}

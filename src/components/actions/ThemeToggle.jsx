import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Icon } from '../icons/Icon.jsx'

// index.html applies the saved theme before first paint, so the DOM is already the source of truth.
const current = () => document.documentElement.getAttribute('data-theme') === 'night' ? 'night' : 'day'

export function ThemeToggle({ storageKey = 'sapr-theme', onChange }) {
  const [theme, setTheme] = useState(current)
  const flip = () => {
    const t = theme === 'night' ? 'day' : 'night'
    document.documentElement.setAttribute('data-theme', t); setTheme(t)
    try { localStorage.setItem(storageKey, t) } catch { /* storage unavailable */ }
    if (onChange) onChange(t)
  }
  return (
    <button type="button" className="theme-toggle" onClick={flip} aria-label={'Switch to ' + (theme === 'night' ? 'day' : 'night') + ' mode'}>
      <Icon icon={theme === 'night' ? Sun : Moon}/>
      <span>{theme === 'night' ? 'Day' : 'Night'}</span>
    </button>
  )
}

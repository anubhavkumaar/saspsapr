import { Icon } from '../icons/Icon.jsx';
export function ThemeToggle({ storageKey = 'sapr-theme', onChange }) {
  const read = function () { return document.documentElement.getAttribute('data-theme') === 'night' ? 'night' : 'day'; };
  const [theme, setTheme] = React.useState('day');
  React.useEffect(function () {
    let t = read();
    try { const s = localStorage.getItem(storageKey); if (s) t = s; } catch (e) {}
    document.documentElement.setAttribute('data-theme', t); setTheme(t);
  }, []);
  const flip = function () {
    const t = theme === 'night' ? 'day' : 'night';
    document.documentElement.setAttribute('data-theme', t); setTheme(t);
    try { localStorage.setItem(storageKey, t); } catch (e) {}
    if (onChange) onChange(t);
  };
  return (
    <button type="button" className="theme-toggle" onClick={flip} aria-label={'Switch to ' + (theme === 'night' ? 'day' : 'night') + ' mode'}>
      <Icon name={theme === 'night' ? 'sun' : 'moon'} />
      <span>{theme === 'night' ? 'Day' : 'Night'}</span>
    </button>
  );
}

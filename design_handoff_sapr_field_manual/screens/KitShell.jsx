// Shared chrome for the SAPR kit
const NS = window.SAPRDesignSystem_60b203;
const KD = window.SAPR_DATA;
const KLOGO = '../../assets/logos/ranger-state-lockup.png';
function Slot({ id, ph, fit }) { return <image-slot id={id} shape="rect" fit={fit || 'cover'} placeholder={ph}></image-slot>; }
function KitHeader({ route, go, openLogin, user }) {
  const { Header, ThemeToggle, Button } = NS;
  const clicks = React.useRef(0); const timer = React.useRef(null);
  const brand = function () { clicks.current += 1; clearTimeout(timer.current); if (clicks.current >= 5) { clicks.current = 0; go('admin'); return; } timer.current = setTimeout(function () { clicks.current = 0; }, 2000); go('home'); };
  return <Header logo={KLOGO} onBrand={brand}
    links={[{ label: 'Home', onClick: function () { go('home'); }, active: route === 'home' }, { label: 'Field Work', onClick: function () { go('fieldwork'); }, active: route === 'fieldwork' }, { label: 'Join', onClick: function () { go('join'); }, active: route === 'join' }, { label: 'Proposal', href: 'https://saspsapr.web.app/proposal' }]}
    actions={<React.Fragment><ThemeToggle /><Button size="sm" variant="ghost" icon={user ? 'shield-check' : 'log-in'} onClick={openLogin}>{user ? 'Signed In' : 'Officer Login'}</Button></React.Fragment>} />;
}
function KitFooter({ go }) {
  const { Footer } = NS;
  return <Footer logo={KLOGO} lines={['Protecting wildlife · Enforcing regulations · Preserving the ecosystem', 'Built & led by Game Warden Rex Davis (222) · Founding Officer, San Andreas Park Rangers']}
    links={[{ label: 'Home', onClick: function () { go('home'); } }, { label: 'Roster', onClick: function () { go('home', 'roster'); } }, { label: 'Hunting', onClick: function () { go('home', 'hunting'); } }, { label: 'Fishing', onClick: function () { go('home', 'fishing'); } }, { label: 'Zone Map', onClick: function () { go('home', 'zones'); } }, { label: 'Join SAPR', onClick: function () { go('join'); } }, { label: 'Field Work', onClick: function () { go('fieldwork'); } }, { label: 'Replay intro', onClick: function () { window.saprIntro && window.saprIntro(); } }]}
    colophon={['SAPR Field Handbook', 'Statewide Edition 2026']} builtBy={{ logo: '../../assets/logos/builder-ak.png', name: 'Anubhav' }} />;
}
function KitLogin({ open, onClose, onLogin, sub }) {
  const { Modal, Input, Button, FormStack } = NS;
  return <Modal open={open} onClose={onClose} title="Officer Login" sub={sub || 'Sign in to log or remove MDT entries.'}>
    <FormStack onSubmit={onLogin}><Input type="email" placeholder="Email" defaultValue="sapr@anubhav.gg" required /><Input type="password" placeholder="Password" defaultValue="ranger" required /><Button type="submit" block iconRight="arrow-right">Sign In</Button></FormStack>
    <p className="field__hint" style={{ marginTop: 12 }}>Prototype — any credentials sign in.</p>
  </Modal>;
}
const pad2 = function (n) { return String(n).padStart(2, '0'); };
Object.assign(window, { KitHeader, KitFooter, KitLogin, Slot, KD, KLOGO, pad2 });

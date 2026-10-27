Read design_handoff_sapr_field_manual/README.md fully, then implement the SAPR "Field Manual" redesign in this repo.

Ground rules
- This is a presentation-layer rewrite. Keep ALL existing behaviour: Firebase auth (incl. the secondary-app user creation), every Firestore read/write/onSnapshot, react-router routes (/, /fieldwork, /joinsapr, /admin, /proposal), the 5-clicks-on-brand → /admin trigger, the cougar intro video, lightbox, pagination, recruitment open/closed setting.
- Copy text stays verbatim from the current src/App.jsx.
- Match the handoff pixel-for-pixel: tokens, type, 2px ink frames, square corners, hard offset shadows, stamps, motion. No background grids/lines/hatching anywhere. No emoji anywhere — use lucide-react.

Steps
1. Install lucide-react. Copy design_handoff_sapr_field_manual/styles/* into src/styles/ (keep fonts/ next to fonts.css), import src/styles/styles.css in main.jsx, and delete App.css + index.css (and the Google Fonts @import).
2. Add an inline script to index.html <head> that applies localStorage 'sapr-theme' to <html data-theme> before paint; update meta theme-color to #F2EDE1.
3. Port the components from design_handoff_sapr_field_manual/components/** into src/components/ (same folder groups). Each .d.ts documents props. Replace the custom Icon with lucide-react.
4. Split App.jsx: move data arrays to src/data/, Firebase helpers to src/lib/, and build one file per route in src/pages/ (Home, FieldWork, Join, Admin) following design_handoff_sapr_field_manual/screens/*.jsx, wired to the real Firestore data instead of the sample data there.
5. Proposal page: keep its structure and content, restyle it only with the new tokens/components (no new layout).
6. Image spots (hero photo, camera feeds, evidence) use real image URLs where they exist; otherwise render a flat var(--paper-2) box. Zone map uses the existing hunting_fishing_map.png.
7. Verify: npm run lint and npm run build pass; check every route in Day and Night, at 1280px and 390px; check prefers-reduced-motion disables animation; check admin flows still write to Firestore.

Work route by route (Home → Field Work → Join → Admin → Proposal) and show me each one before moving on.

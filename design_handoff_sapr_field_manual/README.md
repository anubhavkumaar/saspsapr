# Handoff: SAPR "Field Manual" redesign

## Overview
This is a full visual redesign of the SAPR site (anubhavkumaar/saspsapr, React 19 + Vite + Firebase + Framer Motion) in the style of a printed ranger handbook:
- plain paper, 2px ink frames and hard offset shadows
- rubber stamps and Big Shoulders headlines
- a Day theme (default) and a Night theme
- GTA field-ops motifs: zone radar with blips, trail-cam feeds, a dispatch ticker, and the MDT shown on an in-world phone

It covers 4 routes: / Home, /fieldwork, /joinsapr, /admin. /proposal is NOT redesigned; restyle it with the new tokens only.

## About the design files
Everything here is a design reference built as HTML and React prototypes. It shows the intended look and behaviour; it is not code to paste in. Recreate it inside the existing app, keeping its Firebase auth, Firestore reads/writes, routing and admin logic exactly as they are, and replace only the presentation layer.
- styles/ is production-ready CSS and can be used as-is.
- components/*.jsx are small React components. Port them into src/components/ and swap the custom Icon for lucide-react. Each .d.ts documents props.
- screens/*.jsx show how the components compose into each route. They use sample data and fake logins; wire them to the real Firestore data instead.

## Fidelity
High-fidelity. Colours, type, spacing, borders, shadows, motion and copy are final.

## Global rules
- No background textures anywhere: no grids, ruled lines or hatching. The page is a flat --paper colour. Empty image areas are flat --paper-2.
- Square corners. The only rounded shapes are pills (99px), the phone bezel (44px outer, 34px screen) and the radar dial and blips.
- Hard offset shadows with no blur, except --shadow-photo on taped prints.
- No emoji anywhere. Replace every emoji in App.jsx with a lucide-react icon or a ranked numeral.
- Copy stays verbatim from App.jsx (data/sapr-content.js is a copy of those arrays for reference).
- prefers-reduced-motion disables all animation (motion.css already does this).

## Design tokens
Source of truth: styles/colors_and_type.css. Night = <html data-theme="night">.

Role: Day / Night
- --paper (page): #F2EDE1 / #121511
- --paper-2 (tint, headers): #E7E0CD / #191D17
- --card: #FBF8F0 / #1C211B
- --card-hi (inputs, hover): #FFFFFF / #232922
- --ink (text): #1D221E / #ECE6D6
- --ink-2: #51574F / #B5B09F
- --ink-3: #7B7D70 / #8C8B7D
- --rule (1px lines): #D2C9B2 / #353C32
- --frame (2px frames): #1D221E / #646C5F
- --forest (legal / active / primary / hunting): #2D5A3B / #86C49A
- --stamp (felony / protected / danger): #B93C27 / #EA7861
- --warn (misdemeanor / LOA / warning): #A35A16 / #E3A35E
- --gold (authority / attribution): #9C7220 / #D9B060
- --water (fishing / agency): #2B6588 / #80B8DA
- --band-bg / --band-fg (ticker, active nav): #1D221E / #F2EDE1 in Day, #ECE6D6 / #121511 in Night

Type
- Big Shoulders Display 800–900, uppercase, line-height .84–.92: covers clamp(64px,10vw,150px), section titles clamp(40px,5vw,66px), values 34px, numerals 72px.
- IBM Plex Sans 400–700: body 16/1.6, small 14.
- IBM Plex Mono 500–600, uppercase, .10–.14em tracking: every label, eyebrow, code, date and nav item (10.5–13px).
- Fonts are self-hosted in styles/fonts/ (OFL).

Spacing: 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 84. Content column 1200px, gutter 32px (20px under 720px), section padding 84px (60px on mobile).

Shadows: --shadow-hard-sm 3px 3px 0, --shadow-hard 4px 4px 0, --shadow-hard-lg 6px 6px 0, --shadow-card 6px 6px 0 at 12% ink, --shadow-notice 10px 10px 0 forest.

Motion: --ease-rise cubic-bezier(.16,1,.3,1), --ease-out (.2,.8,.2,1), --ease-stamp (.2,1.5,.4,1). Durations .15 / .3 / .7s.

## Screens

### Shared chrome
- Header
  - Sticky, 68px tall, paper at 94% with backdrop-filter blur(6px), 2px ink bottom border.
  - Left: lockup image (38px) + "SAPR" (Big Shoulders 900, 24px, .08em tracking) + "San Andreas Park Rangers" (mono 10px).
  - Nav: Home · Field Work · Join · Proposal, in mono 12px. Hover shows a 1.5px frame; the active item is the inverted band.
  - Right: ThemeToggle, then a small ghost button "Officer Login".
  - Under 900px the nav collapses into a burger drawer.
  - Keep the existing 5-clicks-on-the-brand → /admin behaviour.
- Footer
  - Lockup 56px; "San Andreas Park Rangers" (Big Shoulders 30px).
  - Two credit lines, verbatim.
  - Two-column mono link grid, including "Replay intro".
  - Colophon "SAPR Field Handbook · Statewide Edition 2026" above a 2px rule.
- Cougar intro
  - Keep the existing video.
  - Full-screen black overlay, plays once per session (sessionStorage), auto-dismisses at 3.5s or when the video ends, fades out over .8s.
  - "Skip intro" button styled as a paper button with a hard shadow. The "Replay intro" footer link calls it again.
  - See screens/intro.js.

### Home / (screens/HomeScreen.jsx)
Sections in order; outlined section numerals 01–06.
1. Hero
   - Two columns, 1.3fr / 1fr.
   - Kicker row: SAPR · Established 2026, San Andreas State, then Live indicators "Department Active" and "Recruiting Open".
   - Title lines San Andreas / Park / Rangers. Line 2 is forest. Each line rises from a mask with a 120ms stagger.
   - Mono strapline.
   - FormBlock rows: Commanding Officer / Overwatch / Jurisdiction.
   - CTAs "View Roster →" (primary) and "Join SAPR" (ghost).
   - Right column: taped Photo (1.8° tilt, white border), caption "FIG. 1 — Field photograph, San Andreas State", and a "Statewide Jurisdiction" stamp that thunks in.
   - Below: Tally 48 / 33 / 8, counting up on view.
2. Ticker
   - Inverted band, 50s loop, pauses on hover.
   - The key fact in each item is bold, in the band accent colour.
3. Camera feeds
   - Three 16:10 frames: CAM 01 Paleto Forest, CAM 02 Alamo Sea, CAM 03 Del Perro Pier.
   - Overlay: blinking REC, cam ID, place, live IST clock.
   - Images are in-game screenshots (to be supplied).
4. 01 Quick Reference: two QuickRefCards.
   - Hunting (forest header band): 2×2 facts, legal/illegal equipment, area chips.
   - Fishing (water header band): same structure.
5. 02 Hunting
   - Species status table, plus a danger Alert about poaching.
   - Licensing StepList.
   - Restrictions as an interactive Checklist: tick and untick, running count, reset.
6. 03 Fishing
   - Licensing steps and a run-in list of legal species.
   - Protected SpeciesIndex: 3 columns, numbered, "Protected · Endangered" stamp.
   - Danger alert.
7. 04 Zones
   - Radar: 5s sweep, pulsing blips (hunt = red triangle, fish = blue circle), linked both ways with the numbered ZoneList on hover.
   - Open Sea info alert.
   - A framed panel showing the existing hunting_fishing_map.png.
8. 05 Penal Codes
   - PenalCodeTable with filters: All / Infraction / Misdemeanor / Felony, with counts.
   - Rows re-animate in on filter change.
   - Sentence bars are scaled to 25 months; fines are in Big Shoulders 22px.
9. 06 Roster
   - Grouped Roster from Firestore, with initials badges and dept/status labels.
   - Next to it, a Phone showing the MDT log (All / MDT / Warnings segmented control) and a link to Field Work.
10. Recruitment Notice
    - Forest 10px offset shadow and a "Recruiting Open" stamp.
    - Existing copy, with a list of 5 checks.

### Field Work /fieldwork (screens/FieldWorkScreen.jsx)
- 09 Evidence
  - Logged out: "Officer Login" opens the Modal login (real Firebase auth).
  - Logged in: AdminBar (Manage Users / Sign Out), a DropZone, and a URL + caption + date + Add row.
  - Officer filter chips.
  - EvidenceGrid of white-bordered prints, slightly tilted, with a forest date and gold uploader. Delete is only shown to admins.
  - Lightbox: keep the existing behaviour.
  - Paginator.
- MDT
  - Logged in: a "Log New Entry" panel with MDT Made / Warning Given segmented control, Citizen ID (mono), date and notes.
  - Next to it, the Phone MDT log. Remove is only shown to admins.
- LB Leaderboard
  - Ranked 01/02/03 in gold / ink / warn. No medal emoji.
  - Counts roll up; a warn alert note sits below.

### Join /joinsapr (screens/JoinScreen.jsx)
Left column: an announcement Card with the verbatim copy, and a PinList. Right column: a Panel with the form, required fields marked with a red *. The panel has three states:
- Open: the form.
- Received: a "Form Received" forest stamp and the verbatim follow-up copy.
- Closed: an "Applications Closed" stamp, driven by the existing Firestore setting.

### Admin /admin (screens/AdminScreen.jsx)
- Logged out: LoginCard.
- Logged in, top: AdminBar (Back to Site / Sign Out) and a "Recruitment Form" ControlCard with Live status and an Open/Close toggle.
- USERS: create-account form and a list of registered officers, using the existing secondary-auth logic.
- ROSTER: a section list (reorder, add, delete) and an editable members table that saves on blur.
- APPS:
  - SearchInput, then tag filters with counts (pending, on_hold, shortlisted, reviewed, rejected).
  - ApplicationCards; reviewed and rejected cards render muted.
  - Clicking a card opens a detail Modal with toggleable tag chips and a Delete button.

## Interactions
- Buttons: hover moves -2px/-2px and grows the shadow to 6px; active moves +2px with a 1px shadow; arrow-right icons nudge 3px; disabled = 50% opacity.
- Inputs: 2px frame, square corners. Focus turns the border forest and adds --shadow-hard-sm.
- Reveal: fade in and rise 22px over .7s at 12% visibility, staggered .06–.12s.
- Stamps: scale 1.9→1 with --ease-stamp at 40% visibility; multiply blend in Day.
- Theme toggle: sets data-theme on <html> and saves it to localStorage 'sapr-theme'. An inline script in index.html applies the saved theme before first paint.
- Modal: Esc and backdrop click close it; it pops in with a scale animation.

## Assets
- assets/logos/: ranger-state-lockup.png (combined), ranger-badge.png and state-parks-seal.png (the same as the repo's src/assets PNGs). Always show the two marks together, with no filters.
- Icons: lucide-react (stroke 2, 14–22px, currentColor).
- Photos: in-game screenshots. Until they're supplied, render a flat --paper-2 box.

## Files
- styles/: styles.css (entry), fonts.css + fonts/, colors_and_type.css, base.css, sapr.css, motion.css
- components/: 66 components (icons, actions, status, motion, layout, surfaces, data, lists, field, forms) + .d.ts
- screens/: route compositions + intro.js
- data/sapr-content.js: verbatim content arrays

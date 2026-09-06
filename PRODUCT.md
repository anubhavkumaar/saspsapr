# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: an outside audience evaluating SAPR.** SASP command, LSPD and BCSO counterparts, and server staff judging whether the department is legitimate, staffed, and run to a standard. They arrive with a question about credibility, not a task to complete.

Read on **desktop, alt-tabbed out of a running game session** — wide viewports, dark room, short visits, fast glances.

Secondary audiences that the product genuinely serves but does not design for first: prospective recruits using the Join flow; serving rangers checking the roster and regulations; department leadership working in the authenticated admin and MDT surfaces.

## Product Purpose

The public institutional face of the San Andreas Park Rangers, a department on a GTA V FiveM roleplay server. It exists to demonstrate that SAPR is a real, staffed, standards-driven department: who serves in it, what authority it holds, what rules it enforces, and how to join. Success is an outside reader concluding that SAPR operates at the standard of an established department.

## Positioning

SAPR is the server's only statewide environmental-enforcement department — wildlife, hunting and fishing enforcement across every zone (Alamo Sea, Mount Chiliad, Zancudo River, Procopio Promenade) where LSPD is city-bound and BCSO is county-bound.

As of 2026-09-06 it is a **standalone department**, no longer a sub-unit of SASP. This is binding product truth: the site must read as an established department, never as a petition for one.

## Operating Context

- Read on desktop, alt-tabbed from an active game session; not a mobile-first surface, though mobile must not break.
- Roster, applications, roster configuration and evidence live in Firestore and update live. There is no build-time content for them — the site is a live view of a working department, not a brochure.
- Authenticated surfaces sit alongside the public ones: admin (user management, applications, roster management), a ranger MDT, and fishing evidence capture.
- Deployed to Firebase Hosting from the `feature/rbac-setup` branch. Roster data is seeded from a local, gitignored file.

## Capabilities and Constraints

- Public surfaces: department roster, hunting and fishing regulations, a map, field work, a join/application form.
- Authenticated surfaces: role-gated admin and MDT.
- Rank ladder (11): Game Warden, Asst. Game Warden, Lead Ranger, Lieutenant, Head-Sergeant, Sergeant First Class, Sergeant, Corporal, Senior-Ranger, Ranger First Class, Ranger.
- Certifications (8): FTO, ASD, HEAT, SWAT, CID, MEU, K-9, SOP.
- Roster records are keyed by badge number. Vacancies are first-class records holding a reserved badge, not omissions.
- Firestore rules make `sapr_roster` world-readable, so every field on a member document is public — member phone numbers included.
- **Undecided:** whether member phone numbers should remain in a world-readable collection.
- Two undefined references ship in the current build (`showBadge`, `setResetCurrentPass`); they throw on the mobile nav drawer and the admin password-reset button.

## Brand Commitments

- **The two badge/patch emblems are binding.** A new visual world is built around them, not over them.
- **The green identity is binding:** dark ground, emerald accent. The redesign changes structure, typography and motion — not the palette.
- **SAPR is a department, not a candidate for one.** No copy may present it as seeking authorization.
- The name "San Andreas Park Rangers" / "SAPR" is factual. Its *wordmark treatment* was explicitly not made binding and is open to redesign.
- The existing "Formal Proposal — Establishment of SAPR Under SASP" section is **not preserved**. It is stale; departmental status has been granted.

## Evidence on Hand

- A real roster: 14 serving rangers and 4 reserved vacancies, live in Firestore, with real ranks, badge numbers, certifications, join dates and promotion dates.
- Real imagery committed to the repo: `public/cougar.mp4`, dispatch screenshots, a hunting/fishing map.
- **No testimonials, activity metrics, arrest/citation statistics, press, or partner claims exist.** Future work must not fabricate them. The roster and the regulations are the only proof on hand.

## Product Principles

1. **Read as an established department.** Never as a pitch, an application, or a proposal.
2. **Credibility comes from real records** — the roster, the ranks, the certifications, the regulations — not from claims about them.
3. **The primary reader is judging standards**, so precision and consistency *are* the argument.
4. **Never fabricate proof.** Absent evidence stays absent.
5. **Live data is the content.** Every surface must hold up as rows are added, removed, or emptied.

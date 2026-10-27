# Removed: the scrolling bulletin ticker on Home

The black marquee strip between the hero and the camera feeds was taken out on 2026-10-27. Its items, in order, for reuse
(the strip looped them twice, pausing on hover; each had a small radio icon in front):

1. **10-49A** Suspicious Fishing · Procopio Promenade
2. Hunting hours **05:00 – 19:30**
3. Fishing license **$650**
4. **P.C. 10008** Poaching — Felony · 25 months
5. Catch limit **100 / Trip**
6. The entirety of Open Sea is legal to fish from a Boat  (from `OPEN_SEA_NOTE` in `src/data/zones.js`, which is still in use)
7. **Recruiting Open** · Open to all Officers
8. Max **150 items** per hunting trip

Also removed with it: the `Ticker` component (`src/components/layout/Ticker.jsx`, its export in `src/components/index.js`),
the `.ticker*` rules in `src/styles/sapr.css`, and the `sapr-tick` keyframes in `src/styles/motion.css`. The
`--band-bg`, `--band-fg` and `--band-accent` tokens it used are shared (active nav link, map labels) and stay.

The original markup, if it needs to come back:

```jsx
<div className="ticker" aria-label="Bulletin">
  <div className="ticker__in" style={{ '--speed': '50s' }}>{/* the items, twice; the second copy aria-hidden */}</div>
</div>
```

```css
.ticker{background:var(--band-bg);color:var(--band-fg);overflow:hidden;white-space:nowrap;border-bottom:var(--bw) solid var(--frame)}
.ticker__in{display:inline-flex;animation:sapr-tick var(--speed,50s) linear infinite}
.ticker:hover .ticker__in{animation-play-state:paused}
.ticker__item{display:inline-flex;align-items:center;gap:10px;padding:13px 28px;font:500 12px/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;border-right:1px solid color-mix(in srgb,var(--band-fg) 18%,transparent)}
.ticker__item b{color:var(--band-accent);font-weight:600}
.ticker__item svg.lucide{width:13px;height:13px;color:var(--band-accent)}
@keyframes sapr-tick{to{transform:translateX(-50%)}}
```

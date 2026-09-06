/**
 * Seeds the SAPR department roster into Firestore from scripts/roster.seed.json.
 *
 *   node scripts/seed-roster.mjs --dry-run
 *   node scripts/seed-roster.mjs             # reads SAPR_EMAIL / SAPR_PASSWORD from .env
 *   node scripts/seed-roster.mjs --email you@sapr.gg --password '...'
 *   node scripts/seed-roster.mjs --prune       # also delete roster docs not in the file
 *
 * Vacant rank slots are seeded too, so the public ladder matches the department
 * sheet. Docs are keyed by badge number (X-700 -> x-700), so re-running overwrites in
 * place rather than duplicating. `sapr_config/roster` sections are only writable
 * by the three privileged emails in the Firestore rules — if the signed-in
 * account is not one of them that single write is skipped, not fatal.
 */
import { readFile } from 'node:fs/promises'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import {
  getFirestore, collection, doc, getDocs, setDoc, deleteDoc,
} from 'firebase/firestore'

const argv = process.argv.slice(2)
const flag = (name) => argv.includes(`--${name}`)
const opt  = (name) => { const i = argv.indexOf(`--${name}`); return i === -1 ? '' : argv[i + 1] }

// Node does not read .env on its own, and SAPR_EMAIL / SAPR_PASSWORD live in the
// project's .env alongside the Vite keys. Real env vars and flags still win.
async function loadDotEnv() {
  let raw
  try { raw = await readFile(new URL('../.env', import.meta.url), 'utf8') }
  catch { return }
  for (const line of raw.split(/\r?\n/)) {
    const m = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line)
    if (!m || process.env[m[1]] !== undefined) continue
    process.env[m[1]] = m[2].trim().replace(/^(["'])(.*)\1$/, '$2')
  }
}
await loadDotEnv()

const DRY   = flag('dry-run')
const PRUNE = flag('prune')
const EMAIL = opt('email')    || process.env.SAPR_EMAIL    || ''
const PASS  = opt('password') || process.env.SAPR_PASSWORD || ''

const firebaseConfig = {
  apiKey:            'AIzaSyDbUGbnCT1Zru0UtaoxXoILMxuVL12DJUw',
  authDomain:        'saspsapr.firebaseapp.com',
  projectId:         'saspsapr',
  storageBucket:     'saspsapr.appspot.com',
  messagingSenderId: '880055273547',
  appId:             '1:880055273547:web:2bb08001f72035b89065ce',
}

const seedUrl = new URL('./roster.seed.json', import.meta.url)
const seed    = JSON.parse(await readFile(seedUrl, 'utf8'))

const docs = seed.members.map((m, i) => {
  const { id, ...fields } = m
  return { id, fields: { ...fields, order: (i + 1) * 10 } }
})

const sworn  = docs.filter(d => !d.fields.vacant)
const vacant = docs.length - sworn.length

console.log(`${docs.length} slots — ${sworn.length} rangers, ${vacant} vacant — across ${seed.sections.length} sections`)
let section = ''
for (const d of docs) {
  const f = d.fields
  if (f.section !== section) { section = f.section; console.log(`\n  [${section}]`) }
  const name = f.vacant ? '— unassigned —' : f.name
  console.log(`    ${(f.badge || '—').padEnd(7)} ${name.padEnd(20)} ${f.rank.padEnd(21)} ${(f.status || '—').padEnd(9)} ${f.certs.join(',')}`)
}
console.log('')

if (DRY) {
  console.log('\n--dry-run: nothing written.')
  process.exit(0)
}

if (!EMAIL || !PASS) {
  console.error('\nNeed credentials: SAPR_EMAIL / SAPR_PASSWORD in .env or the environment, or --email / --password.')
  process.exit(1)
}

const app  = initializeApp(firebaseConfig)
const db   = getFirestore(app)
const auth = getAuth(app)

await signInWithEmailAndPassword(auth, EMAIL, PASS)
console.log(`\nsigned in as ${EMAIL}`)

for (const d of docs) {
  await setDoc(doc(db, 'sapr_roster', d.id), d.fields)
  console.log(`  wrote sapr_roster/${d.id}`)
}

if (PRUNE) {
  const keep = new Set(docs.map(d => d.id))
  const snap = await getDocs(collection(db, 'sapr_roster'))
  for (const existing of snap.docs) {
    if (keep.has(existing.id)) continue
    await deleteDoc(existing.ref)
    console.log(`  pruned sapr_roster/${existing.id} (${existing.data().name || '?'})`)
  }
}

try {
  await setDoc(doc(db, 'sapr_config', 'roster'), { sections: seed.sections }, { merge: true })
  console.log('  wrote sapr_config/roster sections')
} catch (e) {
  console.warn(`  skipped sapr_config/roster sections — ${e.code || e.message}`)
  console.warn('  (rules limit that doc to sapr@anubhav.gg / eddiebrock@sapr.gg / rexdavis@sapr.gg)')
}

console.log('\ndone.')
process.exit(0)

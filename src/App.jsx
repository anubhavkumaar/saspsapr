import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView, useMotionValue } from 'framer-motion'
import './App.css'
import logoRanger from './assets/C1i37hio.png'
import logoState  from './assets/Ci37h33io.png'
import { db, auth, firebaseConfig } from './firebase'
import { collection, addDoc, deleteDoc, doc, setDoc, getDocs, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth'
import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Secondary Firebase app — creates new users without signing out the current admin
const secondaryApp  = getApps().find(a=>a.name==='secondary') || initializeApp(firebaseConfig,'secondary')
const secondaryAuth = getAuth(secondaryApp)

/* ─── DATA ──────────────────────────────────────────────── */
const LEGAL_SPECIES = [
  'Amberjack','Anchovy','Barracuda','Black Crappie','Blue Tang','Bluegill Sunfish',
  'Brook Trout','Brown Trout','Butterfly Koi','Chain Pickerel','Channel Catfish',
  'Clownfish','Cobia','Cod','Common Carp','Crab','Creek Chub','Cubera Snapper',
  'Flounder','French Angelfish','Glassfish','Goliath Grouper','Goatfish','Gray Mullet',
  'Hogfish','Largemouth Bass','Lingcod','Lobster','Mackerel','Moorish Idol',
  'Mudskipper','Muskellunge','Octopus','Pacific Halibut','Parrotfish','Queen Angelfish',
  'Rainbow Runner','Rainbow Trout','Red Drum','Red Grouper','Red Snapper','Rockfish',
  'Sailfish','Sardine','Sea Bass','Sea Robin','Sheepshead','Skipjack Tuna',
  'Smallmouth Bass','Snook','Sockeye Salmon','Squid','Stone Crab','Squirrelfish',
  'Sunfish','Sweetlips','Tarpon','Tilapia','Tropical Butterflyfish','Trumpetfish',
  'Unicornfish','Wahoo','Walleye','Yellow Perch','Yellowtail Snapper',
]
const PROTECTED_SPECIES = [
  'Alligator Gar','Blacktip Shark','Blue Marlin','Bluefin Tuna','Bull Shark',
  'Coelacanth','Cownose Ray','Dorado','Electric Eel','Ghost Fish','Goblin Shark',
  'Golden Koi','Great White Shark','Hammerhead Shark','Lake Sturgeon','Lionfish',
  'Mahi-Mahi','Manta Ray','Moray Eel','Needlefish','Oarfish','Paddlefish',
  'Piranha','Porcupinefish','Pufferfish','Seahorse','Small Reef Shark','Stonefish',
  'Stingray','Swordfish','Tiger Shark','Whale Shark','Yellowfin Tuna',
]
const PENAL_CODES = [
  { code:'10001', offense:'Hunting In Restricted Areas',       cls:'Infraction',  ch:'chip--em',   s:'0',         f:'$1,500' },
  { code:'10002', offense:'Unlicensed Hunting or Fishing',     cls:'Infraction',  ch:'chip--em',   s:'0',         f:'$1,500' },
  { code:'10003', offense:'Hunting Outside of Hunting Hours',  cls:'Infraction',  ch:'chip--em',   s:'0',         f:'$1,000' },
  { code:'10004', offense:'Improper Storage of Fish',          cls:'Infraction',  ch:'chip--em',   s:'0',         f:'$500'   },
  { code:'10005', offense:'Hunting With A Non-Hunting Weapon', cls:'Misdemeanor', ch:'chip--org',  s:'10 months', f:'$1,500' },
  { code:'10006', offense:'Overhunting / Overfishing',         cls:'Misdemeanor', ch:'chip--org',  s:'10 months', f:'$2,500' },
  { code:'10007', offense:'Animal Cruelty',                    cls:'Felony',      ch:'chip--red',  s:'15 months', f:'$5,000' },
  { code:'10008', offense:'Poaching',                          cls:'Felony',      ch:'chip--red',  s:'25 months', f:'$7,500' },
]
const HUNTING_SPECIES = [
  { name:'Mule Deer',       st:'Common',   ok:true  },
  { name:'Wild Boar',       st:'Common',   ok:true  },
  { name:'Coyotes',         st:'Common',   ok:true  },
  { name:'Rabbits',         st:'Common',   ok:true  },
  { name:'Birds (Game)',    st:'Common',   ok:true  },
  { name:'Cougars',         st:'Rare',     ok:false },
  { name:'Domestic Animals',st:'Domestic', ok:false },
]
const WHY = [
  { n:'01', t:'Conflict of Primary Duty',      b:"An LSPD officer's mandate is Los Santos city enforcement. A BCSO officer's is Blaine County patrol. Wildlife enforcement assigned as secondary creates an unresolvable conflict — when a 10-49A competes with a 911, wildlife always loses. Every single time." },
  { n:'02', t:'Chain of Command Confusion',    b:"A sub-department officer answers to two chains simultaneously: their primary agency and the environmental unit. When priorities conflict mid-shift, there is no protocol. This produces inconsistency, friction between supervisors, and officers forced to choose." },
  { n:'03', t:'Jurisdictional Mismatch',       b:'LSPD covers Los Santos city. BCSO covers Blaine County. Wildlife violations span the entire state — Procopio Promenade, Alamo Sea, Mount Chiliad, Zancudo River. No single agency has jurisdiction across all zones. Only a SASP-aligned statewide department can operate everywhere.' },
  { n:'04', t:'Resource Drain on Patrol Units',b:'On March 27th, 2026, over ten 10-49A calls flooded dispatch in 23 minutes alongside standard city 911s. Standard patrol cannot absorb this volume without compromising primary duties. SAPR officers handle ecological calls permanently so city units can stay focused.' },
  { n:'05', t:'Specialized Training Deficit',  b:"Game wardens require training patrol officers don't receive: species identification, ecological law, licensing procedures, backcountry patrol, watercraft operation. A patrol officer cross-trained in wildlife enforcement will always be inferior to a dedicated conservation officer." },
  { n:'06', t:'Accountability Without Clarity',b:"A sub-department's performance gets buried in its parent agency's metrics. SAPR as a standalone unit has one mandate: protect San Andreas's ecosystem. That clarity produces measurable accountability — citation rates, license compliance, poaching arrests, species protection." },
]

/* ─── USER DISPLAY NAMES ────────────────────────────────── */
const MANAGEMENT_EMAIL = 'sapr@anubhav.gg'
// Static fallback — Firestore `users` collection is the live source of truth
const USER_NAMES_FALLBACK = {
  'sapr@anubhav.gg':       'SAPR Management',
  'sasp@sapr.gg':         'SASP High Command',
  'sapr@anubhav.gg':      'SAPR Management',
  'rickyshawn@saspr.gg':  'Ricky Shawn',
}
const getDisplayName = (email, dynamicMap) =>
  (dynamicMap||{})[email] || USER_NAMES_FALLBACK[email] || email?.split('@')[0] || 'Unknown'

/* ─── SVG ANIMALS ───────────────────────────────────────── */
const DeerSvg = ({ size=90 }) => (
  <svg viewBox="0 0 110 68" width={size} height={size*.62} fill="currentColor" style={{overflow:'visible'}}>
    <ellipse cx="50" cy="38" rx="24" ry="12" transform="rotate(-6 50 38)"/>
    <path d="M 67,28 Q 72,21 77,18" stroke="currentColor" strokeWidth="9" strokeLinecap="round" fill="none"/>
    <ellipse cx="81" cy="15" rx="10" ry="8"/>
    <ellipse cx="90" cy="19" rx="5" ry="3.5"/>
    <ellipse cx="74" cy="7" rx="3.5" ry="7" transform="rotate(-25 74 7)"/>
    <path d="M 79,8 L 77,0 M 77,0 L 73,-3 M 77,0 L 80,-2" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M 84,7 L 86,-1 M 86,-1 L 90,-3 M 86,-1 L 83,-3" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <ellipse cx="23" cy="30" rx="6" ry="9" transform="rotate(25 23 30)"/>
    <path d="M 62,48 L 74,63" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none"/>
    <path d="M 54,49 L 67,63" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none"/>
    <path d="M 40,48 L 34,63" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none"/>
    <path d="M 32,47 L 21,62" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none"/>
  </svg>
)
const BoarSvg = ({ size=75 }) => (
  <svg viewBox="0 0 100 55" width={size} height={size*.55} fill="currentColor" style={{overflow:'visible'}}>
    <ellipse cx="48" cy="32" rx="28" ry="15"/>
    <ellipse cx="80" cy="28" rx="14" ry="12"/>
    <ellipse cx="93" cy="30" rx="7" ry="5"/>
    <path d="M 88,34 Q 96,38 92,42" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M 78,17 Q 74,8 80,10 Q 86,8 82,17"/>
    <path d="M 55,18 Q 60,12 68,16 Q 72,10 78,15" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M 65,46 L 66,55" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none"/>
    <path d="M 56,47 L 54,55" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none"/>
    <path d="M 38,46 L 40,55" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none"/>
    <path d="M 28,45 L 25,55" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none"/>
    <path d="M 20,28 Q 10,22 14,16" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
  </svg>
)
const FishSvg = ({ size=60 }) => (
  <svg viewBox="0 0 80 38" width={size} height={size*.475} fill="currentColor" style={{overflow:'visible'}}>
    <ellipse cx="46" cy="19" rx="24" ry="11"/>
    <path d="M 22,19 L 5,8 L 5,30 Z"/>
    <circle cx="63" cy="14" r="2.5" fill="#030810"/>
    <path d="M 52,9 Q 48,2 38,8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M 50,23 Q 44,31 38,27" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
  </svg>
)
const HoofPrintSvg = () => (
  <svg viewBox="0 0 28 32" width="22" height="25" fill="currentColor">
    <ellipse cx="9"  cy="22" rx="6.5" ry="8.5" transform="rotate(-8 9 22)"/>
    <ellipse cx="19" cy="22" rx="6.5" ry="8.5" transform="rotate(8 19 22)"/>
    <ellipse cx="7"  cy="8"  rx="3.5" ry="5"   transform="rotate(-15 7 8)"/>
    <ellipse cx="21" cy="8"  rx="3.5" ry="5"   transform="rotate(15 21 8)"/>
  </svg>
)
const BirdSvg = ({ size=60 }) => (
  <svg viewBox="0 0 80 32" width={size} height={size*.4} fill="currentColor" style={{overflow:'visible'}}>
    <ellipse cx="40" cy="18" rx="11" ry="5"/>
    <circle cx="51" cy="12" r="5"/>
    <path d="M 55,12 L 64,10 L 55,15 Z"/>
    <path d="M 22,18 L 8,12 L 8,24 Z"/>
    <motion.path d="M 31,15 Q 17,4 2,10" stroke="currentColor" strokeWidth="4.5" fill="none" strokeLinecap="round"
      animate={{d:['M 31,15 Q 17,4 2,10','M 31,17 Q 17,27 2,21','M 31,15 Q 17,4 2,10']}}
      transition={{duration:.65,repeat:Infinity,ease:'easeInOut'}}/>
    <motion.path d="M 49,15 Q 63,4 78,10" stroke="currentColor" strokeWidth="4.5" fill="none" strokeLinecap="round"
      animate={{d:['M 49,15 Q 63,4 78,10','M 49,17 Q 63,27 78,21','M 49,15 Q 63,4 78,10']}}
      transition={{duration:.65,repeat:Infinity,ease:'easeInOut'}}/>
  </svg>
)

/* ─── ANIMATION COMPONENTS ──────────────────────────────── */
function RunningAnimals({ type='forest' }) {
  const cfg = type === 'water'
    ? [{C:FishSvg,sz:65,y:28,d:22,dl:0,col:'#0c3545'},{C:FishSvg,sz:50,y:50,d:17,dl:5,col:'#0a2e3c'},{C:FishSvg,sz:74,y:66,d:14,dl:10,col:'#083040'},{C:FishSvg,sz:48,y:40,d:25,dl:2,col:'#0c3545'}]
    : [{C:DeerSvg,sz:90,y:70,d:15,dl:0,col:'#1a3828'},{C:BoarSvg,sz:78,y:79,d:11,dl:6,col:'#122d1e'},{C:DeerSvg,sz:72,y:74,d:19,dl:12,col:'#163022'},{C:BoarSvg,sz:62,y:83,d:13,dl:3,col:'#0e2518'}]
  return (
    <div className="running-animals-container">
      {cfg.map((a,i)=>(
        <motion.div key={i} className="running-animal" style={{top:`${a.y}%`,color:a.col}}
          initial={{x:'-12vw',opacity:0}}
          animate={{x:['-12vw','112vw'],opacity:[0,0.4,0.4,0]}}
          transition={{duration:a.d,delay:a.dl,repeat:Infinity,ease:'linear'}}>
          <a.C size={a.sz}/>
        </motion.div>
      ))}
    </div>
  )
}

function FlyingBirds() {
  const bs=[{y:7,s:65,d:18,dl:0,c:'#1a4030'},{y:13,s:48,d:24,dl:7,c:'#152e23'},{y:5,s:56,d:16,dl:14,c:'#1a4030'},{y:20,s:42,d:22,dl:3,c:'#101f18'}]
  return (
    <div className="flying-birds-container">
      {bs.map((b,i)=>(
        <motion.div key={i} className="flying-bird" style={{top:`${b.y}%`,color:b.c}}
          initial={{x:'-12vw',opacity:0}}
          animate={{x:['-12vw','112vw'],opacity:[0,0.65,0.65,0.4,0],y:[0,-18,8,-12,0]}}
          transition={{duration:b.d,delay:b.dl,repeat:Infinity,ease:'linear'}}>
          <BirdSvg size={b.s}/>
        </motion.div>
      ))}
    </div>
  )
}

function HuntingCrosshair() {
  const ref=useRef(null); const iv=useInView(ref,{once:false,margin:'-80px'})
  return (
    <div ref={ref} className="hunting-crosshair-wrap">
      <motion.div className="hunting-crosshair"
        initial={{scale:0,opacity:0}} animate={iv?{scale:1,opacity:1}:{scale:0,opacity:0}}
        transition={{duration:.7,ease:[.34,1.56,.64,1]}}>
        <motion.svg viewBox="0 0 120 120" animate={{rotate:[0,4,-3,2,0]}} transition={{duration:9,repeat:Infinity,ease:'easeInOut'}}>
          <motion.circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="1" fill="none"
            initial={{pathLength:0}} animate={iv?{pathLength:1}:{}} transition={{duration:.8,delay:.1}}/>
          <motion.circle cx="60" cy="60" r="28" stroke="currentColor" strokeWidth="1" fill="none"
            initial={{pathLength:0}} animate={iv?{pathLength:1}:{}} transition={{duration:.6,delay:.4}}/>
          <motion.circle cx="60" cy="60" r="4" fill="currentColor"
            initial={{scale:0}} animate={iv?{scale:[0,1.4,1]}:{}} transition={{duration:.4,delay:.9}}/>
          {[['60','4','60','30'],['60','90','60','116'],['4','60','30','60'],['90','60','116','60']].map(([x1,y1,x2,y2],i)=>(
            <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.5"
              initial={{pathLength:0}} animate={iv?{pathLength:1}:{}} transition={{duration:.4,delay:.5+i*.05}}/>
          ))}
        </motion.svg>
      </motion.div>
      <motion.div className="hunting-crosshair hunting-crosshair-ring"
        animate={{rotate:[0,360]}} transition={{duration:45,repeat:Infinity,ease:'linear'}}>
        <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="56" stroke="currentColor" strokeWidth=".5" fill="none" strokeDasharray="6 5"/></svg>
      </motion.div>
    </div>
  )
}

function AnimalTracks() {
  const ref=useRef(null); const iv=useInView(ref,{once:false,margin:'-60px'})
  const ps=Array.from({length:9},(_,i)=>({x:4+i*10.5,yOff:i%2===0?0:10,dl:i*.32,flip:i%2===1}))
  return (
    <div ref={ref} className="animal-tracks">
      {ps.map((p,i)=>(
        <motion.div key={i} className="animal-track-print"
          style={{left:`${p.x}%`,bottom:`${6+p.yOff}px`,color:'#1a4030',transform:p.flip?'scaleX(-1)':'none'}}
          initial={{opacity:0,scale:0}}
          animate={iv?{opacity:[0,.4,.4,0],scale:[.4,1,1,.4]}:{opacity:0,scale:0}}
          transition={{duration:2.2,delay:p.dl,repeat:Infinity,repeatDelay:4.5}}>
          <HoofPrintSvg/>
        </motion.div>
      ))}
    </div>
  )
}

function JumpingFish() {
  const fs=[{x:10,s:68,dl:0,a:-168,c:'#0e3a4a'},{x:28,s:54,dl:2.8,a:-205,c:'#0a2d3c'},{x:50,s:72,dl:6,a:-175,c:'#0e3a4a'},{x:68,s:56,dl:2,a:-190,c:'#08263a'},{x:84,s:60,dl:4.5,a:-162,c:'#0e3a4a'}]
  return (
    <div className="jumping-fish-container">
      {fs.map((f,i)=>(
        <motion.div key={i} className="jumping-fish" style={{left:`${f.x}%`,color:f.c}}
          animate={{y:[60,f.a,60],rotate:[0,-30,0,30,0],opacity:[0,1,1,0],scale:[.7,1.1,1,.7]}}
          transition={{duration:2,delay:f.dl,repeat:Infinity,repeatDelay:5+i*1.5,ease:[.34,1.56,.64,1]}}>
          <FishSvg size={f.s}/>
        </motion.div>
      ))}
    </div>
  )
}

/* ─── TEXT ANIMATIONS ───────────────────────────────────── */
function SplitReveal({ text, className, el:W='h2', delay=0, stagger=0.03 }) {
  const ref=useRef(null); const iv=useInView(ref,{once:true,margin:'-80px'})
  return (
    <W ref={ref} className={`${className} split-text-wrapper`}>
      {text.split('').map((c,i)=>(
        <motion.span key={i} className="split-char"
          initial={{opacity:0,y:80,rotateX:90,filter:'blur(8px)'}}
          animate={iv?{opacity:1,y:0,rotateX:0,filter:'blur(0px)'}:{}}
          transition={{duration:.55,delay:delay+i*stagger,ease:[.215,.61,.355,1]}}
          style={{display:c===' '?'inline':'inline-block',whiteSpace:c===' '?'pre':'normal'}}>
          {c===' '?'\u00A0':c}
        </motion.span>
      ))}
    </W>
  )
}

function MaskReveal({ text, className, el:W='h2', delay=0 }) {
  const ref=useRef(null); const iv=useInView(ref,{once:true,margin:'-60px'})
  return (
    <W ref={ref} className={`${className} text-reveal-mask-wrapper`}>
      {text.split(' ').map((word,i)=>(
        <span key={i} className="text-reveal-mask-word">
          <motion.span className="text-reveal-mask-inner"
            initial={{y:'110%',rotate:5}}
            animate={iv?{y:'0%',rotate:0}:{}}
            transition={{duration:.85,delay:delay+i*.14,ease:[.16,1,.3,1]}}>
            {word}
          </motion.span>
        </span>
      ))}
    </W>
  )
}

function FadeWords({ text, className }) {
  const ref=useRef(null)
  const {scrollYProgress}=useScroll({target:ref,offset:['start 0.9','start 0.3']})
  const words=text.split(' ')
  return (
    <p ref={ref} className={`gradient-scroll-text ${className||''}`}>
      {words.map((word,i)=>{
        const s=i/words.length, e=s+1/words.length
        const opacity=useTransform(scrollYProgress,[s,e],[0.15,1])
        const y=useTransform(scrollYProgress,[s,e],[8,0])
        return <motion.span key={i} style={{opacity,y,display:'inline-block',marginRight:'.3em'}}>{word}</motion.span>
      })}
    </p>
  )
}

function Shimmer({ text, el:W='span' }) {
  return <W className="shimmer-text"><span className="shimmer-text-content">{text}</span></W>
}

function CountUp({ target, delay=0 }) {
  const ref=useRef(null); const iv=useInView(ref,{once:true}); const [n,setN]=useState(0)
  useEffect(()=>{
    if(!iv)return
    const num=parseInt(target.replace(/[^0-9]/g,''))||0
    const t0=Date.now()
    const tmr=setTimeout(()=>{
      const iv2=setInterval(()=>{
        const p=Math.min((Date.now()-t0-delay*1000)/(2000),1)
        const e=1-Math.pow(1-p,3)
        setN(Math.round(num*e))
        if(p>=1)clearInterval(iv2)
      },16)
      return ()=>clearInterval(iv2)
    },delay*1000)
    return ()=>clearTimeout(tmr)
  },[iv,target,delay])
  const pfx=target.startsWith('$')?'$':''
  return <span ref={ref}>{pfx}{n}{target.includes('+')&&n>=parseInt(target)?'+':''}</span>
}

function Reveal({ children, delay=0, dir='up' }) {
  const dirs={up:{y:40,x:0},down:{y:-40,x:0},left:{y:0,x:-40},right:{y:0,x:40}}
  return (
    <motion.div initial={{opacity:0,...dirs[dir]}} whileInView={{opacity:1,y:0,x:0}}
      viewport={{once:true,margin:'-50px'}} transition={{duration:.65,delay,ease:[.25,.46,.45,.94]}}>
      {children}
    </motion.div>
  )
}

/* ─── SECTION DIVIDER ───────────────────────────────────── */
function SectionDiv({ label }) {
  return (
    <div className="div-section">
      <div className="div-line"/>
      <div className="div-dot"/>
      <span className="div-label">{label}</span>
      <div className="div-dot"/>
      <div className="div-line"/>
    </div>
  )
}

/* ─── NAVBAR ────────────────────────────────────────────── */
function Navbar() {
  const [sc,setSc]=useState(false)
  useEffect(()=>{
    const h=()=>setSc(window.scrollY>50)
    window.addEventListener('scroll',h)
    return ()=>window.removeEventListener('scroll',h)
  },[])
  const links=[
    {l:'Overview',href:'#overview'},{l:'Proposal',href:'#proposal'},
    {l:'Evidence',href:'#evidence'},{l:'Why SAPR',href:'#why'},
    {l:'Before Hunting',href:'#hunting-urgency'},{l:'Fishing Laws',href:'#fishing'},{l:'Map',href:'#map'},
    {l:'Fishing Calls',href:'#fishing-evidence'},
  ]
  return (
    <motion.nav className={`nav ${sc?'scrolled':''}`}
      initial={{y:-60}} animate={{y:0}} transition={{duration:.6,ease:'easeOut'}}>
      <a href="#hero" className="nav-brand">
        <div className="nav-logos">
          <div className="nav-logo" style={{backgroundImage:`url(${logoRanger})`}}/>
          <div className="nav-logo" style={{backgroundImage:`url(${logoState})`}}/>
        </div>
        <div className="nav-wordmark">
          <span className="nav-title">SAPR</span>
          <span className="nav-sub">San Andreas Park Rangers</span>
        </div>
      </a>
      <ul className="nav-links">
        {links.map((l,i)=>(
          <motion.li key={l.href} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.15+i*.05}}>
            <a className="nav-link" href={l.href}>{l.l}</a>
          </motion.li>
        ))}
      </ul>
      <span className="nav-tag">2026</span>
    </motion.nav>
  )
}

/* ─── HERO ──────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="hero" id="hero">
      {/* Background animals */}
      <FlyingBirds/>
      <RunningAnimals type="forest"/>

      {/* Giant watermark text */}
      <div className="hero-watermark" aria-hidden="true">
        <span className="hero-watermark-text">SAPR</span>
      </div>

      {/* Status pills — top right */}
      <div className="hero-pills">
        {[
          {dot:'sdot--em',  col:'var(--em)',  border:'rgba(16,185,129,.2)',  label:'Fishing Laws Active'},
          {dot:'sdot--org', col:'var(--org)', border:'rgba(249,115,22,.22)', label:'Dispatch Overloaded'},
          {dot:'sdot--red', col:'var(--red)', border:'rgba(239,68,68,.22)',  label:'0 Dedicated Officers'},
        ].map((p,i)=>(
          <motion.div key={i} className="hero-pill"
            style={{color:p.col, borderColor:p.border}}
            initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{delay:1.2+i*.12}}>
            <span className={`sdot ${p.dot}`}/>
            {p.label}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="hero-body">
        <motion.div className="hero-eyebrow"
          initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} transition={{delay:.2}}>
          <div className="hero-logos">
            <div className="hero-logo-sm" style={{backgroundImage:`url(${logoRanger})`}}/>
            <div className="hero-logo-sm" style={{backgroundImage:`url(${logoState})`}}/>
          </div>
          <div className="hero-eyebrow-text">
            <span className="hero-eyebrow-dept">SAPR · Field Proposal</span>
            <span className="hero-eyebrow-date">March 28, 2026</span>
          </div>
        </motion.div>

        <MaskReveal text="Letter of Proposal" className="hero-h1" el="h1" delay={.4}/>

        <motion.p className="hero-dept-line"
          initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:.95,duration:.6}}>
          <Shimmer text="San Andreas Park Rangers"/>
        </motion.p>

        <motion.div className="hero-meta"
          initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:1.1,duration:.6}}>
          {[
            {k:'From', v:'Sgt. Rex Davis (222) · Los Santos Police Department'},
            {k:'To',   v:'SASP Commissioner · High Command'},
            {k:'Re',   v:'Establishment of a Dedicated Environmental Enforcement Department'},
          ].map((r,i)=>(
            <div key={i}>
              {i>0 && <div className="hero-meta-sep"/>}
              <div className="hero-meta-row">
                <span className="hero-meta-key">{r.k}</span>
                <span className="hero-meta-val">{r.v}</span>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div className="hero-actions"
          initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:1.25,duration:.5}}>
          <motion.a href="#overview" className="btn-primary"
            whileHover={{scale:1.04}} whileTap={{scale:.96}}>
            Read the Proposal
            <motion.span animate={{x:[0,5,0]}} transition={{duration:1.4,repeat:Infinity}}>→</motion.span>
          </motion.a>
          <a href="#evidence" className="btn-secondary">View Evidence ↓</a>
        </motion.div>

        <motion.div className="hero-stats-row"
          initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.4,duration:.6}}>
          {[
            {n:'10+', l:'Dispatch Calls',    s:'in 23 min · one location', col:'var(--org)'},
            {n:'0',   l:'Dedicated Officers',s:'for ecological enforcement',col:'var(--red)'},
            {n:'33',  l:'Protected Species', s:'at risk without SAPR',      col:'var(--em)' },
          ].map((s,i)=>(
            <div key={i} className="hero-stat">
              <span className="hero-stat-n" style={{color:s.col}}>
                <CountUp target={s.n} delay={1.45+i*.18}/>
              </span>
              <span className="hero-stat-l">{s.l}</span>
              <span className="hero-stat-s">{s.s}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll">
        <motion.div className="hero-scroll-line"
          animate={{scaleY:[0,1,0],opacity:[0,1,0]}}
          transition={{duration:2,repeat:Infinity,ease:'easeInOut'}}
          style={{transformOrigin:'top'}}/>
        <span className="hero-scroll-text">scroll</span>
      </div>
    </section>
  )
}

/* ─── OVERVIEW ──────────────────────────────────────────── */
function OverviewSection() {
  return (
    <section className="sec" id="overview">
      <RunningAnimals type="forest"/>
      <div className="sec-inner">
        <Reveal>
          <div className="sec-head">
            <span className="sec-num">01</span>
            <p className="sec-tag">Current State · March 2026</p>
            <SplitReveal text="The Situation Has Arrived" className="sec-title" delay={.1} stagger={.025}/>
            <FadeWords text="Fishing laws are live, licenses are being issued, and the enforcement gap is already visible" className="sec-sub"/>
            <div className="sec-rule"/>
          </div>
        </Reveal>
        <div className="ov-grid">
          {[
            {icon:'📜',st:'Active',       sd:'sdot--em',  sc:'var(--em)',  title:'Fishing Laws Live',         cl:'',        body:'Official fishing regulations are now in force. Citizens are actively obtaining $650 licenses through the attorney licensing system. The regulatory framework exists — but enforcement does not.'},
            {icon:'📡',st:'Mar 27, 2026', sd:'sdot--org', sc:'var(--org)', title:'Dispatch Overloaded',        cl:'card--org',body:'Over ten Code 10-49A calls hit dispatch in under 23 minutes from a single location — Procopio Promenade. They competed directly with standard city calls. Most went unresponded.'},
            {icon:'🎯',st:'Not Yet Open', sd:'sdot--gold',sc:'var(--gold)',title:'Hunting Window Approaching', cl:'card--gold',body:'Hunting licenses have not been issued yet. This is our only window to establish SAPR before firearms, remote terrain, and endangered species simultaneously enter the equation.'},
            {icon:'⚠', st:'0 Officers',  sd:'sdot--red', sc:'var(--red)', title:'No Dedicated Unit Exists',   cl:'card--red', body:'There is no dedicated environmental enforcement officer, no independent chain of command, and no dedicated protocol for wildlife calls. All violations are handled — or more often not handled — by general patrol.'},
          ].map((c,i)=>(
            <Reveal key={i} delay={i*.09}>
              <motion.div className={`card ${c.cl} ov-card`} whileHover={{scale:1.02,y:-4}} transition={{type:'spring',stiffness:280}}>
                <div className="ov-top">
                  <span className="ov-icon">{c.icon}</span>
                  <span className="ov-status" style={{color:c.sc}}>
                    <span className={`sdot ${c.sd}`}/>
                    {c.st}
                  </span>
                </div>
                <h4 className="ov-title">{c.title}</h4>
                <p className="ov-body">{c.body}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── PROPOSAL LETTER ───────────────────────────────────── */
function ProposalSection() {
  return (
    <section className="sec sec--dark" id="proposal">
      <div className="sec-inner">
        <Reveal>
          <div className="sec-head">
            <span className="sec-num">02</span>
            <p className="sec-tag">Official Document</p>
            <MaskReveal text="Letter of Proposal" className="sec-title" delay={.1}/>
            <FadeWords text="Formal proposal for the establishment of San Andreas Park Rangers as a standalone department under SASP" className="sec-sub"/>
            <div className="sec-rule"/>
          </div>
        </Reveal>
        <Reveal delay={.2}>
          <div className="letter-wrap">
            <div className="letter">
              <div className="letter-header">
                <div>
                  <div className="letter-author">Rex Davis</div>
                  <div className="letter-rank">Sergeant (222), Los Santos Police Department (LSPD)</div>
                </div>
                <div className="letter-date">March 28, 2026</div>
              </div>
              <div className="letter-meta">
                {[{k:'To',v:'SASP Commissioner\nSan Andreas State Police (SASP) High Commands'}].map((r,i)=>(
                  <div key={i} className="letter-meta-row">
                    <span className="letter-meta-k">{r.k}</span>
                    <span className="letter-meta-v" style={{whiteSpace:'pre-line'}}>{r.v}</span>
                  </div>
                ))}
              </div>
              <div className="letter-subject">
                Subject: Formal Proposal — Establishment of San Andreas Park Rangers (SAPR) as a Dedicated Environmental Enforcement Department Under SASP
              </div>
              <div className="letter-body">
                <p>Dear Commissioner,</p>
                <p>I am Sergeant Rex Davis (Badge #222), currently serving with the Los Santos Police Department. I write today not strictly as an LSPD officer, but as an officer with firsthand experience in ecological enforcement failures — having previously served as a Corporal with the Blaine County Sheriff's Office, where I witnessed the same gaps in wildlife oversight play out repeatedly with no dedicated unit to address them.</p>
                <p>That experience made clear that the problem is structural, not circumstantial. Today, the same issues exist in San Andreas — and they are already escalating. <strong style={{color:'var(--gold)'}}>Fishing laws are already live. Licenses are already being issued. And our dispatch system is already overwhelmed.</strong></p>
                <h4>The Enforcement Gap Is Already Here</h4>
                <p>On March 27th, 2026 — within a single 23-minute window — I documented over ten (10) separate Code 10-49A "Suspicious Fishing" calls flooding our dispatch system. All originated from the same location: <strong>Procopio Promenade and the Pacific Ocean</strong>. These calls competed on the same screen with standard 311 calls, traffic accidents, and active city emergencies. No dedicated officer existed to respond to them.</p>
                <p>This is what enforcement failure looks like in practice: laws exist, violations happen openly, and there is no one mandated, authorized, and equipped to respond.</p>
                <h4 style={{color:'var(--red)'}}>The Hunting Argument — Act Before It Is Too Late</h4>
                <p>Fishing violations are already generating ten-plus calls in twenty minutes from a single pier. When hunting licenses are issued, we simultaneously introduce <strong>licensed firearms, remote wilderness terrain,</strong> and <strong style={{color:'var(--red)'}}>33 documented protected and endangered species</strong> into the enforcement equation.</p>
                <ul>
                  <li>Poaching will go unchecked in remote hunting zones where patrol units cannot quickly respond</li>
                  <li>Endangered species — cougars, rare deer, protected birds — will be hunted or poached before we can document their presence</li>
                  <li>Illegal weapons will be used under the legal cover of hunting licenses with no specialist to distinguish</li>
                  <li>Overhunting of common species will deplete populations before any cap can be enforced</li>
                  <li>Dispatch will be paralyzed by a wave of wildlife calls with no dedicated route or response</li>
                </ul>
                <p><strong style={{color:'var(--gold)'}}>We cannot build the fire department after the fire. SAPR must exist before hunting licenses are issued — not concurrently, and not after.</strong></p>
                <h4>The Formal Request</h4>
                <ul>
                  <li>Statewide jurisdiction for all environmental and wildlife enforcement across San Andreas</li>
                  <li>Independent rank structure and chain of command operating directly under SASP</li>
                  <li>Full authority to issue, verify, and revoke fishing and hunting licenses</li>
                  <li>Authority to patrol, inspect, and enforce in all designated wildlife zones statewide</li>
                  <li>Coordination authority with LSPD, BCSO, and SASP as operational needs require</li>
                </ul>
                <p>The laws are live. The violations are happening. The hunting window is approaching. The window to act responsibly is now.</p>
              </div>
              <div className="letter-sig">
                <div className="letter-sig-name">Rex Davis</div>
                <div className="letter-sig-rank">Sergeant (222) · Los Santos Police Department (LSPD)</div>
                <div className="letter-sig-rank" style={{color:'var(--gold)',marginTop:'.2rem'}}>Proposed Founding Officer · San Andreas Park Rangers (SAPR)</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── EVIDENCE ──────────────────────────────────────────── */
function EvidenceSection() {
  return (
    <section className="sec sec--alt" id="evidence">
      <RunningAnimals type="forest"/>
      <div className="sec-inner">
        <Reveal>
          <div className="sec-head">
            <span className="sec-num">03</span>
            <p className="sec-tag">Field Evidence</p>
            <SplitReveal text="The Case in Numbers" className="sec-title" delay={.1} stagger={.028}/>
            <FadeWords text="Dispatch logs from March 27th, 2026 — demonstrating real-time enforcement collapse" className="sec-sub"/>
            <div className="sec-rule"/>
          </div>
        </Reveal>
        <Reveal delay={.1}>
          <div className="ev-bar">
            {[
              {v:'10+',l:'10-49A Calls',   n:'Suspicious Fishing',       col:'var(--org)'},
              {v:'23', l:'Minutes',         n:'Total observed timespan',  col:'var(--em)' },
              {v:'1',  l:'Hotspot',         n:'Procopio Promenade',       col:'var(--em)' },
              {v:'0',  l:'Units Dedicated', n:'To respond to any of them',col:'var(--red)'},
            ].map((s,i)=>(
              <motion.div key={i} className="ev-cell" whileHover={{scale:1.04}}>
                <div className="ev-num" style={{color:s.col}}><CountUp target={s.v} delay={.2+i*.12}/></div>
                <div className="ev-lbl">{s.l}</div>
                <div className="ev-note">{s.n}</div>
              </motion.div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={.2}>
          <div className="disp-grid">
            {[
              {src:'https://i.vgy.me/kmBpMZ.png', badge:'First Wave',       bg:'#b45309',cap:'Calls from 3–15 minutes ago — the initial flood begins at Procopio Promenade'},
              {src:'https://i.vgy.me/HGBUER.png',badge:'Competing Priority',bg:'#dc2626',cap:'Mid-window — 10-49A calls continue while a standard 311 car accident competes for unit attention'},
              {src:'https://i.vgy.me/hClmYI.png',badge:'Peak Overload',     bg:'#dc2626',cap:'Every visible entry is 10-49A Suspicious Fishing — dispatch saturated with no dedicated route'},
            ].map((img,i)=>(
              <Reveal key={i} delay={i*.12} dir={i%2===0?'left':'right'}>
                <motion.div className="card card--flat disp-card" whileHover={{scale:1.02,y:-4}}>
                  <span className="disp-badge" style={{background:img.bg}}>{img.badge}</span>
                  <img src={img.src} alt={img.cap} className="disp-img" loading="lazy"/>
                  <p className="disp-cap">{img.cap}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </Reveal>
        <Reveal delay={.3}>
          <div className="alert alert--danger" style={{marginTop:'1.5rem'}}>
            <span className="alert-icon">▶</span>
            <span>All entries above are Code <strong>10-49A "Suspicious Fishing"</strong> logged on <strong>March 27th, 2026</strong> at <strong>Procopio Promenade, Pacific Ocean</strong>. No dedicated unit existed to respond. Standard patrol was simultaneously handling city 311 calls — the exact conflict this proposal resolves.</span>
          </div>
        </Reveal>
        <Reveal delay={.35}>
          <h3 style={{marginTop:'3rem',marginBottom:'.5rem',font:'700 22px/1 var(--ui)',letterSpacing:'-.3px'}}>From My Experience: Documented Wildlife Violations</h3>
          <p style={{color:'var(--t2)',fontSize:'.88rem',marginBottom:'.9rem'}}>Incidents I personally observed and documented — each went unaddressed due to the absence of a dedicated enforcement unit.</p>
          <div className="incident-list">
            {[
              'Cows harassed and run over near Paleto farm areas without consequence',
              'Injured dogs at Legion Square due to public negligence — no ecological response unit',
              'Coyotes frequently run over on highways, no wildlife report or response protocol',
              'Deer run over off-road near windmill area — zero enforcement follow-up',
            ].map((inc,i)=>(
              <Reveal key={i} delay={.06*i} dir="right">
                <motion.div className="incident-row" whileHover={{scale:1.01}}>
                  <span className="incident-marker">▸</span>
                  <span>{inc}</span>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── WHY DEPARTMENT ────────────────────────────────────── */
function WhySection() {
  return (
    <section className="sec" id="why">
      <RunningAnimals type="forest"/>
      <div className="sec-inner">
        <Reveal>
          <div className="sec-head">
            <span className="sec-num">04</span>
            <p className="sec-tag">The Structural Argument</p>
            <SplitReveal text="Why a Department, Not a Sub-Unit" className="sec-title" delay={.1} stagger={.022}/>
            <FadeWords text="Six reasons why environmental enforcement embedded in LSPD or BCSO is structurally broken" className="sec-sub"/>
            <div className="sec-rule"/>
          </div>
        </Reveal>
        <div className="why-grid">
          {WHY.map((w,i)=>(
            <Reveal key={i} delay={i*.07} dir={i%2===0?'left':'right'}>
              <motion.div className="card why-card" whileHover={{scale:1.02,y:-4}}>
                <span className="why-num">{w.n}</span>
                <h4 className="why-title">{w.t}</h4>
                <p className="why-body">{w.b}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={.42}>
          <div className="card cmp-outer" style={{marginTop:'2.5rem',padding:0,overflow:'hidden'}}>
            <div className="cmp-head-row">SAPR Standalone vs. Sub-Department</div>
            <div className="cmp-grid">
              <div className="cmp-col cmp-col--no">
                <div className="cmp-colhead">LSPD / BCSO Sub-Department</div>
                {['Dual chain of command — conflicts inevitable','City or county jurisdiction only','Ecological calls compete with primary duties','No dedicated conservation training path','Metrics buried in parent agency reporting','Cannot operate statewide independently'].map((t,i)=>(
                  <div key={i} className="cmp-row"><span className="cmp-icon cmp-icon--no">✗</span><span>{t}</span></div>
                ))}
              </div>
              <div className="cmp-col cmp-col--yes">
                <div className="cmp-colhead">SAPR — Standalone Under SASP</div>
                {['Single clear chain of command — SASP','Statewide jurisdiction across all zones','Environmental enforcement is the only mandate','Dedicated game warden training track','Clear KPIs: licenses, citations, species data','Full authority in every wildlife zone statewide'].map((t,i)=>(
                  <div key={i} className="cmp-row"><span className="cmp-icon cmp-icon--yes">✓</span><span>{t}</span></div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── HUNTING URGENCY ───────────────────────────────────── */
function HuntingSection() {
  return (
    <section className="sec sec--alt" id="hunting-urgency">
      <RunningAnimals type="forest"/>
      <FlyingBirds/>
      <HuntingCrosshair/>
      <AnimalTracks/>
      <div className="sec-inner">
        <Reveal>
          <div className="sec-head">
            <span className="sec-num">05</span>
            <p className="sec-tag sec-tag--red">Critical Urgency</p>
            <SplitReveal text="SAPR Must Exist Before Hunting Opens" className="sec-title" delay={.1} stagger={.022}/>
            <FadeWords text="Allowing hunting without a dedicated warden will cause irreversible ecological damage" className="sec-sub"/>
            <div className="sec-rule"/>
          </div>
        </Reveal>
        <Reveal delay={.1}>
          <div className="alert alert--danger" style={{marginBottom:'2.5rem'}}>
            <span className="alert-icon">▶</span>
            <span><strong>Critical Window:</strong> Hunting licenses have not been issued yet. This is the only opportunity to establish SAPR before firearms, remote terrain, and 33 endangered species enter the enforcement equation simultaneously.</span>
          </div>
        </Reveal>
        <div className="tl">
          {[
            {s:'1',t:'active',tag:'Current State',         title:'Fishing Laws Active — Dispatch Already Strained',desc:'Regulations are live. Licenses are being issued. Dispatch is logging 10+ ecological calls per session with zero dedicated officers. We are already falling behind before hunting has even started.'},
            {s:'2',t:'danger',tag:'Without SAPR',          title:'Hunting Begins — No Warden in the Field',       desc:'Licenses issued while no dedicated enforcement unit exists. Hunting rifles enter the wilderness. License verification in remote zones is impossible. Poachers operate freely with no risk of interception.'},
            {s:'3',t:'danger',tag:'Irreversible Outcome',  title:'Endangered Species Casualties',                  desc:'Cougars, protected deer populations, and rare birds are hunted or poached before any enforcement response can be organized. Ecological damage at this level cannot be undone.'},
            {s:'✓',t:'safe',  tag:'With SAPR — Correct Path',title:'Controlled, Sustainable Hunting Rollout',     desc:'SAPR established and operational before hunting opens. License verification active. Wildlife zones patrolled by dedicated wardens. Poaching deterred by visible enforcement presence.'},
          ].map((item,i)=>(
            <Reveal key={i} delay={i*.09}>
              <motion.div className={`tl-item tl-item--${item.t}`} whileHover={{x:5}}>
                <div className={`tl-dot tl-dot--${item.t}`}>{item.s}</div>
                <div className="tl-body">
                  <span className="tl-tag" style={{color:item.t==='safe'?'var(--em)':item.t==='active'?'var(--org)':'var(--red)'}}>{item.tag}</span>
                  <h4 className="tl-title">{item.title}</h4>
                  <p className="tl-desc">{item.desc}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={.42}>
          <h3 style={{marginTop:'3rem',marginBottom:'.5rem',font:'700 20px/1 var(--ui)',letterSpacing:'-.3px'}}>Species Status Without SAPR</h3>
          <p style={{color:'var(--t2)',fontSize:'.88rem',marginBottom:'1.1rem'}}>What is at immediate risk the moment hunting licenses are issued without a dedicated enforcement unit:</p>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Species</th><th>Status</th><th>Risk Without SAPR</th><th>Hunting Permitted</th></tr></thead>
              <tbody>
                {HUNTING_SPECIES.map((sp,i)=>(
                  <motion.tr key={i} initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.05}}>
                    <td style={{fontWeight:500}}>{sp.name}</td>
                    <td><span className={`chip ${sp.st==='Rare'?'chip--red':sp.st==='Domestic'?'chip--org':'chip--em'}`}>{sp.st}</span></td>
                    <td style={{color:sp.ok?'var(--org)':'var(--red)',fontWeight:500}}>{sp.ok?'Overhunting, no limits enforced':'Poaching / Illegal kill'}</td>
                    <td style={{color:sp.ok?'var(--em)':'var(--red)',fontWeight:600,fontFamily:'var(--mono)',fontSize:'.85rem'}}>{sp.ok?'✓ With License':'✗ Prohibited'}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── FISHING LAWS ──────────────────────────────────────── */
function FishingSection() {
  return (
    <section className="sec" id="fishing">
      <RunningAnimals type="water"/>
      <JumpingFish/>
      <div className="sec-inner">
        <Reveal>
          <div className="sec-head">
            <span className="sec-num">06</span>
            <p className="sec-tag">Active Regulations</p>
            <MaskReveal text="Current Fishing Laws" className="sec-title" delay={.1}/>
            <FadeWords text="The active fishing framework — already in force, already generating violations, already proving the need for SAPR" className="sec-sub"/>
            <div className="sec-rule"/>
          </div>
        </Reveal>
        <Reveal delay={.1}>
          <div className="rule-grid">
            {[{ic:'💰',k:'License Fee',v:'$650'},{ic:'⏰',k:'Hours',v:'Any Time'},{ic:'🐟',k:'Catch Limit',v:'100 / Trip'},{ic:'📦',k:'Storage',v:'Fish Coolers'}].map((r,i)=>(
              <motion.div key={i} className="card rule-card" whileHover={{scale:1.04,y:-4}}>
                <div className="rule-icon"><motion.span animate={{y:[0,-4,0]}} transition={{duration:3,repeat:Infinity,delay:i*.3}}>{r.ic}</motion.span></div>
                <div className="rule-key">{r.k}</div>
                <div className="rule-val">{r.v}</div>
              </motion.div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={.15}>
          <h3 style={{marginBottom:'.7rem',font:'700 20px/1 var(--ui)',letterSpacing:'-.2px'}}>Licensing Process</h3>
          <div className="step-list">
            {['Consult a Private Attorney for a licensing consultation','Attorney explains the complete licensing procedure and requirements','Pay the $650 licensing fee','Proceed to Del Perro Pier with attorney and a PD officer to finalize license','Acquire fishing equipment from a state-authorized vendor on Del Perro Pier'].map((step,i)=>(
              <motion.div key={i} className="step-item" whileHover={{x:8}}>
                <div className="step-num">{i+1}</div>
                <div>{step}</div>
              </motion.div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={.2}>
          <div className="equip-grid">
            <div className="equip-block">
              <div className="equip-title" style={{color:'var(--em)'}}>Permitted Equipment</div>
              {['All Fishing Rods','All Lures','Fish Baits','Fish Coolers (for transport)'].map((item,i)=>(
                <div key={i} className="equip-row"><span className="equip-icon equip-icon--ok">✓</span><span>{item}</span></div>
              ))}
            </div>
            <div className="equip-block">
              <div className="equip-title" style={{color:'var(--red)'}}>Prohibited Equipment</div>
              {['Chum Buckets','Fish Attractors','Clean Barrels','Shark Baits','Industrial / Commercial Vehicles'].map((item,i)=>(
                <div key={i} className="equip-row"><span className="equip-icon equip-icon--no">✗</span><span>{item}</span></div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={.25}>
          <div className="sp-block">
            <div className="sp-head">
              <h3 className="sp-title">Legal Fishing Species</h3>
              <span className="sp-count">{LEGAL_SPECIES.length} species</span>
            </div>
            <div className="sp-list">
              {LEGAL_SPECIES.map((sp,i)=>(
                <motion.span key={i} className="sp-tag" initial={{opacity:0,scale:.85}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:i*.009}} whileHover={{scale:1.07}}>{sp}</motion.span>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={.3}>
          <div className="sp-block">
            <div className="sp-head">
              <h3 className="sp-title">Protected / Endangered Species</h3>
              <span className="sp-count sp-count--danger">{PROTECTED_SPECIES.length} species</span>
            </div>
            <div className="sp-list">
              {PROTECTED_SPECIES.map((sp,i)=>(
                <motion.span key={i} className="sp-tag sp-tag--danger" initial={{opacity:0,scale:.85}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:i*.014}} whileHover={{scale:1.07}}>{sp}</motion.span>
              ))}
            </div>
            <div className="alert alert--danger" style={{marginTop:'.9rem'}}>
              <span className="alert-icon">▶</span>
              <span>If caught, <strong>immediately release.</strong> Possession of any EPS constitutes Poaching — P.C. 10008 — Felony: 25 months &amp; $7,500 fine.</span>
            </div>
          </div>
        </Reveal>
        <Reveal delay={.35}>
          <h3 style={{marginTop:'2.5rem',marginBottom:'1rem',font:'700 20px/1 var(--ui)',letterSpacing:'-.2px'}}>Wildlife Penal Codes (Title 10)</h3>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Code</th><th>Offense</th><th>Class</th><th>Sentence</th><th>Fine</th></tr></thead>
              <tbody>
                {PENAL_CODES.map((pc,i)=>(
                  <motion.tr key={i} initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.055}}>
                    <td style={{fontWeight:700,color:'var(--em)',fontFamily:'var(--mono)',fontSize:'.85rem'}}>P.C. {pc.code}</td>
                    <td style={{fontWeight:500}}>{pc.offense}</td>
                    <td><span className={`chip ${pc.ch}`}>{pc.cls}</span></td>
                    <td style={{fontFamily:'var(--mono)',fontSize:'.85rem'}}>{pc.s}</td>
                    <td style={{fontWeight:700,color:'var(--gold)',fontFamily:'var(--mono)',fontSize:'.85rem'}}>{pc.f}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── MAP ───────────────────────────────────────────────── */
function MapSection() {
  return (
    <section className="sec sec--dark" id="map">
      <div className="sec-inner">
        <Reveal>
          <div className="sec-head">
            <span className="sec-num">07</span>
            <p className="sec-tag">Operational Territory</p>
            <SplitReveal text="Hunting & Fishing Zone Map" className="sec-title" delay={.1} stagger={.028}/>
            <FadeWords text="Designated zones across San Andreas — every marked zone is SAPR's jurisdiction and responsibility" className="sec-sub"/>
            <div className="sec-rule"/>
          </div>
        </Reveal>
        <Reveal delay={.15}>
          <div className="map-notice">The entirety of Open Sea is legal to fish from a Boat</div>
        </Reveal>
        <Reveal delay={.25}>
          <motion.div className="map-wrap" whileHover={{borderColor:'rgba(16,185,129,.35)'}} transition={{duration:.3}}>
            <img src="/images/hunting_fishing_map.png" alt="San Andreas Designated Hunting & Fishing Zone Map" className="map-img"/>
          </motion.div>
        </Reveal>
        <Reveal delay={.35}>
          <div className="map-legend">
            <div className="map-legend-row"><div className="map-dot map-dot--hunt"/><span>Hunting Zones — Mount Gordo, Mount Chiliad, Chiliad M.S.W., Mount Josiah</span></div>
            <div className="map-legend-row"><div className="map-dot map-dot--fish"/><span>Fishing Zones — Cassidy River, Alamo Sea, Zancudo River, Lago Zancudo, Tongva River, Vinewood Dam, Tataviam Dam</span></div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── FINAL ASK ─────────────────────────────────────────── */
function FinalAskSection() {
  return (
    <section className="sec sec--alt" id="finalask">
      <RunningAnimals type="forest"/>
      <FlyingBirds/>
      <div className="sec-inner">
        <Reveal>
          <div className="sec-head">
            <span className="sec-num">08</span>
            <p className="sec-tag sec-tag--gold">Formal Request</p>
            <MaskReveal text="The Ask" className="sec-title" delay={.1}/>
            <FadeWords text="One authorization. One department. One chance to protect what cannot be replaced." className="sec-sub"/>
            <div className="sec-rule"/>
          </div>
        </Reveal>
        <Reveal delay={.2}>
          <div className="card card--gold ask-card">
            <p className="ask-lead">Commissioner, this proposal asks for one thing:</p>
            <div className="ask-headline">Authorization to establish SAPR as a standalone department under SASP.</div>
            <p className="ask-body">The framework is built. The penal codes are written. The species are classified. The zones are mapped. The licensing process is documented. The equipment regulations are finalized. Everything needed to operate is ready. The only missing piece is the authority to exist — and the clock is running.</p>
            <div className="ask-list">
              {[
                'Authorize SAPR as a standalone department operating directly under SASP',
                'Grant statewide environmental enforcement jurisdiction to SAPR officers',
                "Establish SAPR's independent rank structure and chain of command, separate from LSPD and BCSO",
                'Mandate that hunting licenses are not issued to the public until SAPR is operational',
              ].map((ask,i)=>(
                <motion.div key={i} className="ask-item" initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.1}}>
                  <span className="ask-num">{String(i+1).padStart(2,'0')}</span>
                  <span>{ask}</span>
                </motion.div>
              ))}
            </div>
            <div className="ask-sig">
              <div className="ask-sig-name">Rex Davis</div>
              <div className="ask-sig-rank">Sergeant (222) · Los Santos Police Department (LSPD)</div>
              <div className="ask-sig-rank" style={{color:'var(--t2)'}}>Proposed Founding Officer · San Andreas Park Rangers (SAPR)</div>
              <div className="ask-sig-date">March 28, 2026</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── FOOTER ────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="footer">
      <Reveal>
        <div className="footer-logos">
          <div className="footer-logo-img" style={{backgroundImage:`url(${logoRanger})`}}/>
          <div className="footer-logo-img" style={{backgroundImage:`url(${logoState})`}}/>
        </div>
        <div className="footer-name">San Andreas Park Rangers</div>
        <div className="footer-rule"/>
        <div className="footer-sub">Protecting wildlife · Enforcing regulations · Preserving the ecosystem</div>
        <div className="footer-sub" style={{marginTop:'.4rem'}}>Proposal submitted March 28, 2026 · Sgt. Rex Davis (222) · LSPD · To SASP Commissioner</div>
      </Reveal>
    </footer>
  )
}

/* ─── FISHING EVIDENCE ──────────────────────────────────── */
const getISTDate = () => {
  const ist = new Date(Date.now() + 330 * 60 * 1000)
  return ist.toISOString().split('T')[0]
}
const fmtDate = s => {
  if(!s) return ''
  const [y,m,d] = s.split('-')
  return `${d} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m-1]} ${y}`
}

function FishingEvidenceSection() {
  const [images,   setImages]   = useState([])
  const [user,     setUser]     = useState(null)
  const [showLogin,setShowLogin]= useState(false)
  const [email,    setEmail]    = useState('')
  const [pass,     setPass]     = useState('')
  const [loginErr, setLoginErr] = useState('')
  const [newUrl,   setNewUrl]   = useState('')
  const [newCap,   setNewCap]   = useState('')
  const [newDate,  setNewDate]  = useState(getISTDate())
  const [busy,     setBusy]     = useState(false)
  const [filterUser,setFilterUser]= useState('all')
  const [userMap,   setUserMap]   = useState({})   // email→displayName from Firestore
  const [showUserMgmt,setShowUserMgmt]= useState(false)
  const [nuEmail,  setNuEmail]    = useState('')
  const [nuPass,   setNuPass]     = useState('')
  const [nuName,   setNuName]     = useState('')
  const [nuBusy,   setNuBusy]     = useState(false)
  const [nuErr,    setNuErr]      = useState('')
  const [nuOk,     setNuOk]       = useState('')
  const [lightbox, setLightbox] = useState(null)
  const [lbScale,  setLbScale]  = useState(1)
  const lbX      = useMotionValue(0)
  const lbY      = useMotionValue(0)
  const lbImgRef = useRef(null)

  const lbZoom  = delta => setLbScale(s => parseFloat(Math.min(4, Math.max(1, s+delta)).toFixed(2)))
  const lbReset = () => { setLbScale(1); lbX.set(0); lbY.set(0) }

  useEffect(()=>{
    const onKey = e => { if(e.key==='Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return ()=>window.removeEventListener('keydown', onKey)
  },[])

  // Reset zoom when lightbox opens/closes
  useEffect(()=>{ lbReset() },[lightbox])

  // Scale back to 1 → snap pan back to center
  useEffect(()=>{ if(lbScale<=1){ lbX.set(0); lbY.set(0) } },[lbScale])

  // Mouse-wheel zoom while lightbox is open
  useEffect(()=>{
    if(!lightbox) return
    const onWheel = e => {
      e.preventDefault()
      setLbScale(s => parseFloat(Math.min(4, Math.max(1, s+(e.deltaY<0?0.2:-0.2))).toFixed(2)))
    }
    window.addEventListener('wheel', onWheel, {passive:false})
    return ()=>window.removeEventListener('wheel', onWheel)
  },[lightbox])

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, u => setUser(u))
    return unsub
  },[])

  useEffect(()=>{
    const q = query(collection(db,'fishing_evidence'), orderBy('createdAt','desc'))
    const unsub = onSnapshot(q, snap =>
      setImages(snap.docs.map(d=>({ id:d.id, ...d.data() })))
    )
    return unsub
  },[])

  useEffect(()=>{
    const unsub = onSnapshot(collection(db,'sapr_users'), snap => {
      const map = {}
      snap.docs.forEach(d=>{ const {email,displayName}=d.data(); if(email) map[email]=displayName })
      setUserMap(map)
    })
    return unsub
  },[])

  const handleCreateUser = async e => {
    e.preventDefault(); setNuErr(''); setNuOk('')
    if(!nuEmail.trim()||!nuPass.trim()||!nuName.trim()) return
    setNuBusy(true)
    try {
      const cred = await createUserWithEmailAndPassword(secondaryAuth, nuEmail.trim(), nuPass.trim())
      await signOut(secondaryAuth)
      await setDoc(doc(db,'users', nuEmail.trim().replace(/[@.]/g,'_')), {
        email:       nuEmail.trim(),
        displayName: nuName.trim(),
        uid:         cred.user.uid,
        createdAt:   serverTimestamp(),
      })
      setNuOk(`Account created — ${nuName.trim()} (${nuEmail.trim()})`)
      setNuEmail(''); setNuPass(''); setNuName('')
    } catch(err) {
      const msg = err.code==='auth/email-already-in-use'
        ? 'That email already has an account.'
        : err.code==='auth/weak-password'
        ? 'Password must be at least 6 characters.'
        : (err.message||'Failed to create account.')
      setNuErr(msg)
    } finally { setNuBusy(false) }
  }

  const [dragOver, setDragOver] = useState(false)

  // Global paste → fill URL field when admin panel is open
  useEffect(()=>{
    if(!user) return
    const onPaste = e => {
      if(e.target.closest('.fe-input')) return   // let the input handle it normally
      const text = e.clipboardData?.getData('text/plain')?.trim()
      if(text && text.startsWith('http')) { setNewUrl(text); e.preventDefault() }
    }
    document.addEventListener('paste', onPaste)
    return ()=>document.removeEventListener('paste', onPaste)
  },[user])

  const handleDrop = e => {
    e.preventDefault(); setDragOver(false)
    // Prefer uri-list (dragged image from browser), fall back to plain text
    const url = (e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain')).trim()
    if(url.startsWith('http')) { setNewUrl(url); return }
    // Dragged image file — we can't host it, so just warn
    if(e.dataTransfer.files?.[0]?.type?.startsWith('image/'))
      alert('Please upload the image to vgy.me first, then drag or paste the link here.')
  }

  const handleLogin = async e => {
    e.preventDefault(); setLoginErr('')
    try {
      await signInWithEmailAndPassword(auth, email, pass)
      setShowLogin(false); setEmail(''); setPass('')
    } catch { setLoginErr('Invalid email or password.') }
  }

  const handleAdd = async e => {
    e.preventDefault()
    if(!newUrl.trim()) return
    setBusy(true)
    try {
      await addDoc(collection(db,'fishing_evidence'),{
        url: newUrl.trim(),
        caption: newCap.trim(),
        date: newDate,
        uploadedBy: getDisplayName(user.email, userMap),
        uploaderEmail: user.email,
        createdAt: serverTimestamp(),
      })
      setNewUrl(''); setNewCap(''); setNewDate(getISTDate())
    } finally { setBusy(false) }
  }

  const handleDelete = id => deleteDoc(doc(db,'fishing_evidence',id))

  const uploaders = ['all',...Array.from(new Set(images.map(img=>img.uploadedBy||'Unknown')))]
  const visibleImages = filterUser==='all' ? images : images.filter(img=>(img.uploadedBy||'Unknown')===filterUser)

  return (
    <section className="sec sec--alt" id="fishing-evidence">
      <JumpingFish/>
      <div className="sec-inner">

        {/* Header */}
        <Reveal>
          <div className="sec-head">
            <span className="sec-num">09</span>
            <p className="sec-tag">Field Evidence</p>
            <MaskReveal text="Fishing Calls & Illegal Fish Evidence" className="sec-title" delay={.1}/>
            <p className="sec-sub" style={{opacity:.7}}>Documented visual evidence of illegal fishing activities and violations observed in the field</p>
            <div className="fe-rule-row">
              <div className="sec-rule" style={{margin:0}}/>
              {!user && (
                <button className="fe-lock" onClick={()=>setShowLogin(true)} title="Admin Login">&#128274;</button>
              )}
            </div>
          </div>
        </Reveal>

        {/* Admin bar + add form */}
        {user && (
          <Reveal>
            <div className="fe-admin-bar">
              <span className="fe-admin-tag">&#9679; {getDisplayName(user.email,userMap)} — {user.email}</span>
              <div className="fe-admin-actions">
                {user.email===MANAGEMENT_EMAIL && (
                  <button className="fe-admin-mgmt" onClick={()=>{setShowUserMgmt(v=>!v);setNuErr('');setNuOk('')}}>
                    {showUserMgmt?'▲ Close':'👤 Manage Users'}
                  </button>
                )}
                <button className="fe-admin-signout" onClick={()=>signOut(auth)}>Sign Out</button>
              </div>
            </div>

            {/* Manage Users panel — management only */}
            {showUserMgmt && user.email===MANAGEMENT_EMAIL && (
              <div className="fe-mgmt-panel">
                <h4 className="fe-mgmt-title">Create Officer Account</h4>
                <form className="fe-mgmt-form" onSubmit={handleCreateUser}>
                  <input className="fe-input" placeholder="Display name (e.g. Sgt. Rex Davis)" value={nuName} onChange={e=>setNuName(e.target.value)} required/>
                  <input className="fe-input" type="email" placeholder="Email address" value={nuEmail} onChange={e=>setNuEmail(e.target.value)} required/>
                  <input className="fe-input" type="password" placeholder="Password (min 6 chars)" value={nuPass} onChange={e=>setNuPass(e.target.value)} required minLength={6}/>
                  {nuErr && <p className="fe-err">&#9888; {nuErr}</p>}
                  {nuOk  && <p className="fe-ok">&#10003; {nuOk}</p>}
                  <button className="fe-add-btn" type="submit" disabled={nuBusy}>{nuBusy?'Creating…':'+ Create Account'}</button>
                </form>
                <h4 className="fe-mgmt-title" style={{marginTop:'1.25rem'}}>Registered Officers</h4>
                <div className="fe-mgmt-list">
                  {Object.entries({...USER_NAMES_FALLBACK,...userMap}).map(([em,name],i)=>(
                    <div key={i} className="fe-mgmt-row">
                      <span className="fe-mgmt-name">{name}</span>
                      <span className="fe-mgmt-email">{em}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Drop zone */}
            <div
              className={`fe-drop-zone ${dragOver?'fe-drop-zone--over':''} ${newUrl?'fe-drop-zone--filled':''}`}
              onDragOver={e=>{e.preventDefault();setDragOver(true)}}
              onDragLeave={()=>setDragOver(false)}
              onDrop={handleDrop}
            >
              {newUrl ? (
                <div className="fe-drop-preview">
                  <img src={newUrl} alt="Preview" className="fe-drop-preview-img" onError={e=>e.target.style.display='none'}/>
                  <button className="fe-drop-clear" onClick={()=>setNewUrl('')} title="Clear">&#10005;</button>
                </div>
              ) : (
                <>
                  <span className="fe-drop-arrow">{dragOver?'↓':'⬇'}</span>
                  <span className="fe-drop-label">{dragOver?'Release to use this URL':'Drag an image here from your browser'}</span>
                  <span className="fe-drop-hint">or press <kbd className="fe-kbd">Ctrl+V</kbd> anywhere to paste a link</span>
                </>
              )}
            </div>

            <form className="fe-add-form" onSubmit={handleAdd}>
              <input className="fe-input" placeholder="Image URL — e.g. https://i.vgy.me/abc.png" value={newUrl} onChange={e=>setNewUrl(e.target.value)} required/>
              <input className="fe-input fe-input--cap" placeholder="Caption (optional)" value={newCap} onChange={e=>setNewCap(e.target.value)}/>
              <input className="fe-input fe-input--date" type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} required/>
              <button className="fe-add-btn" type="submit" disabled={busy}>{busy?'Adding…':'+ Add Evidence'}</button>
            </form>
          </Reveal>
        )}

        {/* Gallery */}
        {images.length===0 ? (
          <Reveal delay={.2}>
            <div className="fe-empty">No evidence added yet. Log in as admin to upload images.</div>
          </Reveal>
        ) : (
          <>
            {/* Filter bar */}
            <div className="fe-filter-bar">
              <span className="fe-filter-label">&#9660; Filter by officer</span>
              <select className="fe-filter-select" value={filterUser} onChange={e=>setFilterUser(e.target.value)}>
                {uploaders.map(u=>(
                  <option key={u} value={u}>{u==='all'?'All Officers':u}</option>
                ))}
              </select>
              {filterUser!=='all' && (
                <span className="fe-filter-count">{visibleImages.length} image{visibleImages.length!==1?'s':''}</span>
              )}
            </div>

            {visibleImages.length===0 ? (
              <div className="fe-empty">No evidence from this officer yet.</div>
            ) : (
              <div className="fe-grid">
                {visibleImages.map((img,i)=>(
                  <Reveal key={img.id} delay={Math.min(i*.08,.48)} dir={i%2===0?'left':'right'}>
                    <motion.div className="card card--flat fe-card" whileHover={{scale:1.02,y:-4}}>
                      {user && (
                        <button className="fe-del" onClick={()=>handleDelete(img.id)} title="Remove">&#10005;</button>
                      )}
                      <img src={img.url} alt={img.caption||'Fishing evidence'} className="fe-img" loading="lazy"
                        onClick={()=>setLightbox(img)}/>
                      <div className="fe-card-footer">
                        {img.caption && <p className="fe-cap">{img.caption}</p>}
                        <div className="fe-card-meta">
                          {img.date && <span className="fe-date">{fmtDate(img.date)}</span>}
                          <span className="fe-uploader">&#9679; {img.uploadedBy||'Unknown'}</span>
                        </div>
                      </div>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Login modal */}
      {showLogin && (
        <div className="fe-modal" onClick={()=>setShowLogin(false)}>
          <motion.div className="fe-modal-box" onClick={e=>e.stopPropagation()}
            initial={{opacity:0,scale:.92,y:20}} animate={{opacity:1,scale:1,y:0}}
            transition={{duration:.25,ease:'easeOut'}}>
            <button className="fe-modal-close" onClick={()=>setShowLogin(false)}>&#10005;</button>
            <h3 className="fe-modal-title">Admin Login</h3>
            <p className="fe-modal-sub">Sign in to add or remove evidence images.</p>
            <form onSubmit={handleLogin} style={{display:'flex',flexDirection:'column',gap:'.7rem'}}>
              <input className="fe-input" type="email" placeholder="Email" value={email}
                onChange={e=>setEmail(e.target.value)} required autoFocus/>
              <input className="fe-input" type="password" placeholder="Password" value={pass}
                onChange={e=>setPass(e.target.value)} required/>
              {loginErr && <p className="fe-err">{loginErr}</p>}
              <button className="fe-add-btn" type="submit">Sign In</button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fe-lightbox" onClick={()=>setLightbox(null)}>
          <motion.div className="fe-lightbox-inner" onClick={e=>e.stopPropagation()}
            initial={{opacity:0,scale:.88}} animate={{opacity:1,scale:1}}
            transition={{duration:.22,ease:'easeOut'}}>
            <button className="fe-lightbox-close" onClick={()=>setLightbox(null)}>&#10005; Close</button>

            {/* Image stage — clips the panned/zoomed image */}
            <div className="fe-lightbox-stage">
              <motion.img
                ref={lbImgRef}
                src={lightbox.url}
                alt={lightbox.caption||'Evidence'}
                className="fe-lightbox-img"
                style={{
                  scale: lbScale,
                  x: lbX,
                  y: lbY,
                  cursor: lbScale>1 ? 'grab' : 'zoom-in',
                }}
                drag={lbScale>1}
                dragMomentum={false}
                dragElastic={0}
                dragConstraints={{
                  left:   -(lbImgRef.current ? lbImgRef.current.offsetWidth  * (lbScale-1)/2 : 0),
                  right:    lbImgRef.current ? lbImgRef.current.offsetWidth  * (lbScale-1)/2 : 0,
                  top:    -(lbImgRef.current ? lbImgRef.current.offsetHeight * (lbScale-1)/2 : 0),
                  bottom:   lbImgRef.current ? lbImgRef.current.offsetHeight * (lbScale-1)/2 : 0,
                }}
                whileDrag={{cursor:'grabbing'}}
                onClick={()=>{ if(lbScale===1) lbZoom(0.5) }}
              />

              {/* Zoom HUD — bottom-right of image */}
              <div className="fe-zoom-hud">
                <button className="fe-zoom-btn" onClick={()=>lbZoom(-0.5)} disabled={lbScale<=1} title="Zoom out">−</button>
                <span className="fe-zoom-pct">{Math.round(lbScale*100)}%</span>
                <button className="fe-zoom-btn" onClick={()=>lbZoom(0.5)}  disabled={lbScale>=4} title="Zoom in">+</button>
                {lbScale>1 && <button className="fe-zoom-btn fe-zoom-reset" onClick={lbReset} title="Reset zoom">&#8635;</button>}
              </div>
            </div>

            {(lightbox.caption||lightbox.date||lightbox.uploadedBy) && (
              <div className="fe-lightbox-meta">
                {lightbox.caption && <p className="fe-lightbox-caption">{lightbox.caption}</p>}
                <div className="fe-lightbox-row">
                  {lightbox.date && <span className="fe-lightbox-date">{fmtDate(lightbox.date)}</span>}
                  {lightbox.uploadedBy && <span className="fe-lightbox-uploader">&#9679; {lightbox.uploadedBy}</span>}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </section>
  )
}

/* ─── INTRO ─────────────────────────────────────────────── */
function Intro({ onDone }) {
  return (
    <motion.div initial={{opacity:1}} animate={{opacity:0}} transition={{delay:3.5,duration:.8,ease:'easeOut'}}
      onAnimationComplete={onDone}
      style={{position:'fixed',inset:0,zIndex:999999,background:'#04060a',display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none',overflow:'hidden'}}>
      <video src="/cougar.mp4" autoPlay muted playsInline style={{width:'100%',height:'100%',objectFit:'cover'}}/>
    </motion.div>
  )
}

/* ─── APP ───────────────────────────────────────────────── */
export default function App() {
  const [done,setDone]=useState(false)
  return (
    <>
      {!done && <Intro onDone={()=>setDone(true)}/>}
      <Navbar/>
      <Hero/>
      <SectionDiv label="Section 01 — Overview"/>
      <OverviewSection/>
      <SectionDiv label="Section 02 — Proposal Letter"/>
      <ProposalSection/>
      <SectionDiv label="Section 03 — Evidence"/>
      <EvidenceSection/>
      <SectionDiv label="Section 04 — Why SAPR"/>
      <WhySection/>
      <SectionDiv label="Section 05 — Hunting Urgency"/>
      <HuntingSection/>
      <SectionDiv label="Section 06 — Fishing Laws"/>
      <FishingSection/>
      <SectionDiv label="Section 07 — Zone Map"/>
      <MapSection/>
      <SectionDiv label="Section 08 — Formal Request"/>
      <FinalAskSection/>
      <SectionDiv label="Section 09 — Fishing Calls & Illegal Fish Evidence"/>
      <FishingEvidenceSection/>
      <Footer/>
    </>
  )
}

// Vector redraw of the SAPR zone map, same 1091×1600 coordinate space as the in-game image. Simplified, not survey-accurate.
// Theme-aware: every colour is a token, so it follows Day / Night.
function sm(pts, closed) {
  const n = pts.length
  if (n < 2) return ''
  const P = i => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))])
  let d = 'M' + pts[0][0] + ' ' + pts[0][1]
  const last = closed ? n : n - 1
  for (let i = 0; i < last; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2)
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += 'C' + c1[0].toFixed(1) + ' ' + c1[1].toFixed(1) + ' ' + c2[0].toFixed(1) + ' ' + c2[1].toFixed(1) + ' ' + p2[0] + ' ' + p2[1]
  }
  return d + (closed ? 'Z' : '')
}

function shrink(pts, k) {
  const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length
  const cy = pts.reduce((a, p) => a + p[1], 0) / pts.length
  return pts.map(p => [Math.round(cx + (p[0] - cx) * k), Math.round(cy + (p[1] - cy) * k)])
}

const COAST = [[497,62],[540,112],[610,134],[700,140],[800,146],[900,172],[962,216],[978,268],[968,330],[990,392],[1036,452],[1052,530],[1046,620],[1012,690],[978,752],[982,818],[954,884],[938,960],[914,1036],[890,1100],[870,1176],[856,1240],[812,1296],[740,1336],[676,1372],[652,1430],[640,1500],[612,1560],[520,1574],[452,1560],[372,1566],[262,1550],[214,1500],[232,1440],[290,1400],[318,1340],[290,1290],[250,1220],[214,1160],[176,1104],[110,1040],[62,968],[44,900],[58,820],[72,752],[60,690],[62,628],[96,596],[118,548],[150,470],[176,404],[200,340],[262,262],[340,214],[400,172],[446,128]]
const CITY = [[236,1150],[300,1040],[380,1000],[470,990],[560,1010],[640,1060],[700,1120],[760,1200],[800,1270],[730,1320],[660,1360],[630,1440],[600,1530],[500,1540],[400,1540],[300,1500],[300,1420],[330,1340],[290,1260]]
const Z = {
  chiliad: [[436,262],[490,206],[560,188],[640,182],[716,184],[780,224],[812,282],[800,346],[756,398],[712,432],[660,462],[604,470],[552,456],[500,468],[472,420],[450,340]],
  msw: [[210,412],[262,384],[332,370],[392,356],[440,330],[466,400],[478,462],[410,462],[332,462],[262,442]],
  gordo: [[716,150],[856,150],[944,214],[972,262],[962,330],[930,372],[884,378],[846,312],[800,250],[748,196]],
  josiah: [[174,460],[262,446],[340,466],[472,474],[506,528],[514,592],[490,638],[410,672],[326,694],[272,700],[244,640],[206,596],[174,536]],
  lago: [[128,666],[200,680],[290,704],[286,738],[204,744],[134,740],[116,700]],
  alamo: [[478,486],[560,474],[650,474],[738,446],[822,440],[826,496],[784,528],[708,540],[628,562],[548,560],[486,540]],
  vinewood: [[452,958],[476,950],[488,972],[506,980],[512,962],[528,958],[520,984],[500,996],[480,986],[462,976]],
  tataviam: [[748,1018],[772,1008],[782,1034],[770,1060],[778,1080],[748,1084],[728,1076],[742,1056],[736,1036]],
}
const RIVERS = {
  cassidy: [[212,412],[262,434],[330,462],[404,462],[472,474]],
  zancudo: [[522,560],[506,614],[452,648],[380,678],[300,700],[200,710],[88,712]],
  tongva: [[290,742],[300,790],[286,842],[280,884]],
}
const HWY = [[720,150],[836,250],[884,340],[896,480],[876,620],[840,720],[790,830],[740,960],[690,1080],[640,1160]]
const PLACES = [['Paleto Bay', 580, 112], ['Grapeseed', 790, 410], ['Sandy Shores', 660, 600], ['Fort Zancudo', 170, 628], ['Blaine County', 650, 760], ['Los Santos', 470, 1250], ['LSIA', 300, 1500]]

export function ZoneMapArt({ zones = [], labels = true, className = '' }) {
  const lbl = z => [z.x / 100 * 1091, z.y / 100 * 1600]
  return (
    <svg className={('zmap__art zart ' + className).trim()} viewBox="0 0 1091 1600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect className="zart__sea" width="1091" height="1600"/>
      <path className="zart__shore3" d={sm(COAST, true)}/>
      <path className="zart__shore2" d={sm(COAST, true)}/>
      <path className="zart__shore1" d={sm(COAST, true)}/>
      <path className="zart__land" d={sm(COAST, true)}/>
      <path className="zart__city" d={sm(CITY, true)}/>
      <path className="zart__hwy" d={sm(HWY, false)}/>
      {['chiliad', 'msw', 'gordo', 'josiah', 'lago'].map(k => <path key={k} className="zart__hunt" d={sm(Z[k], true)}/>)}
      {['chiliad', 'gordo', 'josiah'].map(k => [0.72, 0.46, 0.22].map(s => <path key={k + s} className="zart__topo" d={sm(shrink(Z[k], s), true)}/>))}
      {['alamo', 'vinewood', 'tataviam'].map(k => <path key={k} className="zart__lake" d={sm(Z[k], true)}/>)}
      {['alamo', 'vinewood', 'tataviam'].map(k => <path key={k + 'o'} className="zart__fish" d={sm(Z[k], true)}/>)}
      <path className="zart__fish" d={sm(RIVERS.cassidy, false)}/>
      <path className="zart__fish" d={sm(RIVERS.zancudo, false)}/>
      <path className="zart__fish zart__fish--alt" d={sm(RIVERS.tongva, false)}/>
      <path className="zart__coast" d={sm(COAST, true)}/>
      {labels && PLACES.map(p => <text key={p[0]} className={'zart__place' + (p[0] === 'Los Santos' || p[0] === 'Blaine County' ? ' zart__place--lg' : '')} x={p[1]} y={p[2]} textAnchor="middle">{p[0]}</text>)}
      {labels && zones.map(z => { const p = lbl(z); return <text key={z.name} className={'zart__zl zart__zl--' + z.kind} x={p[0]} y={p[1] + 7} textAnchor="middle">{z.name}</text> })}
    </svg>
  )
}

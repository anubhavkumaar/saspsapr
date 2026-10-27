import { useMemo } from 'react'
import { describeFeed, rangersFor, wildlifeFor } from '../../lib/surveillance'
import { useISTClock } from '../../lib/useISTClock'
import { useInView } from '../motion/useInView.js'
import { FieldImage } from '../surfaces/FieldImage.jsx'

// A surveillance camera: a still of the place with a live overlay in HTML — REC, camera number, location, the IST clock,
// a wildlife readout and how many rangers are in the area. The numbers come from seeded randomness keyed on the camera and the
// IST time slot (see lib/surveillance), so every visitor sees the same ones at the same moment. Outside 11:00–00:59 IST the
// feed is "inactive": dimmed, dashes for every count, no rangers.
// `camera` is one entry of data/cameras. The picture is public/field/<camera.image>.jpg|png|webp and must have no overlay baked in.
export function SurveillanceFeed({ camera }) {
  const clock = useISTClock()
  const [ref, iv] = useInView(0.3)
  const live    = clock.active
  const rangers = live ? rangersFor(camera.id, clock.istEpoch) : 0
  const counts  = live ? wildlifeFor(camera, clock.istEpoch) : null
  // Assistive tech hears the state once a minute, not every second.
  const minute = Math.floor(clock.istEpoch / 60000)
  const label  = useMemo(() => describeFeed(camera, minute * 60000), [camera, minute])

  return (
    <div ref={ref} className={'sv' + (live ? '' : ' is-off') + iv} role="img" aria-label={label}>
      <div className="sv__media"><FieldImage name={camera.image} alt={camera.alt}/></div>
      <span className="sv__shade"/><span className="sv__noise"/><span className="sv__scan"/>
      <span className="sv__c sv__c--tl"/><span className="sv__c sv__c--tr"/><span className="sv__c sv__c--bl"/><span className="sv__c sv__c--br"/>

      <div className="sv__top">
        <span className="sv__rec"><i/>REC</span>
        <span className="sv__hdr">SAN ANDREAS STATE PARK RANGERS</span>
        <span className="sv__cam">{camera.cam}</span>
      </div>

      <ul className="sv__readout">
        {camera.readout.map((f, i) => (
          <li key={f.key}>
            <span className="sv__type" style={{ '--n': f.label.length + 1, '--i': i }}>{f.label}:</span>{' '}
            <b key={live ? counts[i] : '--'} className="sv__val">{live ? counts[i] : '--'}</b>
          </li>
        ))}
      </ul>

      {!live && (
        <div className="sv__off">
          <b>FEED INACTIVE</b>
          <span>SIGNAL RESUMES 11:00 IST</span>
        </div>
      )}

      <div className="sv__bottom">
        <div className="sv__status">
          <i className={'sv__dot ' + (rangers > 0 ? 'is-go' : 'is-wait')}/>
          <span>ACTIVE RANGERS IN AREA: <b key={rangers} className="sv__val">{rangers}</b></span>
        </div>
        <div className="sv__row">
          <span className="sv__type" style={{ '--n': camera.place.length, '--i': 6 }}>{camera.place}</span>
          <span className="sv__clock">{clock.text}</span>
        </div>
      </div>
    </div>
  )
}

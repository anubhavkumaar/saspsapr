import { Icon } from '../icons/Icon.jsx';
import { Label } from '../status/Label.jsx';
export const APP_TAGS = { pending: ['Pending', 'warn'], on_hold: ['On Hold', 'gold'], shortlisted: ['Shortlisted', 'info'], reviewed: ['Reviewed', 'legal'], rejected: ['Rejected', 'danger'] };
export function ApplicationCard({ name, citizenId, department, rank, tags = ['pending'], why, availability, discord, onClick }) {
  const muted = tags.indexOf('reviewed') > -1 || tags.indexOf('rejected') > -1;
  return (
    <button type="button" className={'app' + (muted ? ' app--muted' : '')} onClick={onClick}>
      <div className="app__head">
        <div><span className="app__name">{name}</span><span className="app__cid">CID: {citizenId} · {department}{rank ? ' · ' + rank : ''}</span></div>
        <div className="app__tags">{tags.map(function (t) { const m = APP_TAGS[t] || [t, 'gold']; return <Label key={t} tone={m[1]}>{m[0]}</Label>; })}</div>
      </div>
      {why && <p className="app__why">{why}</p>}
      <div className="app__foot">{availability && <span><Icon name="clock" size={13} />{availability}</span>}{discord && <span><Icon name="message-square" size={13} />{discord}</span>}</div>
    </button>
  );
}

export function CameraFeed({ cam = 'CAM 01', place, src, alt = '', time, children }) {
  const [t, setT] = React.useState(time || '');
  React.useEffect(function () {
    if (time) return;
    const f = function () { setT(new Date(Date.now() + 330 * 60000).toISOString().slice(11, 19)); };
    f(); const id = setInterval(f, 1000); return function () { clearInterval(id); };
  }, [time]);
  return (
    <div className="feed">
      <div className="feed__media">{children || (src ? <img src={src} alt={alt} /> : null)}</div>
      <span className="feed__corner feed__corner--tl" /><span className="feed__corner feed__corner--br" />
      <div className="feed__ov"><div><span className="feed__rec"><i />REC</span><span>{cam}</span></div><div><span>{place}</span><span>{t}</span></div></div>
    </div>
  );
}
export function FeedGrid({ cols = 3, children }) { return <div className="feeds" style={{ '--cols': cols }}>{children}</div>; }

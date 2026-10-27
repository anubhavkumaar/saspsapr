export function StepList({ steps = [] }) { return <ol className="steps">{steps.map(function (s, i) { return <li key={i}>{s}</li>; })}</ol>; }

import { STATUS_PIPELINE, STATUS_PRIORITY } from '../data/applications'

// An application's stage: its `status`, else the highest-priority known tag, else pending (older documents only had tags).
export function getAppStatus(app) {
  const ids = STATUS_PIPELINE.map(s => s.id)
  if (app.status && ids.includes(app.status)) return app.status
  if (app.tags?.length) {
    const matched = app.tags.filter(t => ids.includes(t))
    if (matched.length)
      return matched.sort((a, b) => STATUS_PRIORITY.indexOf(a) - STATUS_PRIORITY.indexOf(b))[0]
  }
  return 'pending'
}

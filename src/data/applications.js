// The recruitment pipeline an application moves through. `tone` is the Label tone it wears on a card
// (see .lbl--* in sapr.css); the order here is the order of the stepper in the application's detail.
export const STATUS_PIPELINE = [
  { id: 'pending',     label: 'Pending',     group: 'active', tone: 'warn' },
  { id: 'reviewed',    label: 'Reviewed',    group: 'active', tone: 'info' },
  { id: 'pass_given',  label: 'Pass Given',  group: 'active', tone: 'gold' },
  { id: 'interviewed', label: 'Interviewed', group: 'active', tone: 'info' },
  { id: 'shortlisted', label: 'Shortlisted', group: 'active', tone: 'gold' },
  { id: 'ranger',      label: 'Ranger',      group: 'active', tone: 'legal' },
  { id: 'on_hold',     label: 'On Hold',     group: 'hold',   tone: undefined },
  { id: 'rejected',    label: 'Rejected',    group: 'reject', tone: 'danger' },
]
export const ACTIVE_STAGES   = STATUS_PIPELINE.filter(s => s.group === 'active')
export const TERMINAL_STAGES = STATUS_PIPELINE.filter(s => s.group !== 'active')
export const STATUS_PRIORITY = ['ranger', 'shortlisted', 'interviewed', 'pass_given', 'reviewed', 'on_hold', 'rejected', 'pending']

export const APP_PER_PAGE = 8

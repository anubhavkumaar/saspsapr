// Calls the cougar intro again from anywhere (the footer's "Replay intro"). Intro listens for this event.
export const INTRO_EVENT = 'sapr:intro'
export const replayIntro = () => window.dispatchEvent(new Event(INTRO_EVENT))

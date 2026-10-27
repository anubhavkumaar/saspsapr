export function Live({ tone = 'ok', children }) {
  return <span className={'live' + (tone !== 'ok' ? ' live--' + tone : '')}><i/>{children}</span>
}

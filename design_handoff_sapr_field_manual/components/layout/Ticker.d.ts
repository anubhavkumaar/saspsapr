import type { ReactNode } from 'react';
export interface TickerProps {
  /** Bulletin items. Wrap the key fact in <b> — it renders in the band accent. */
  items: ReactNode[];
  icon?: string;
  /** Seconds per loop */
  speed?: number;
}
/** Inverted ink band with a scrolling dispatch bulletin. Pauses on hover. */
export declare function Ticker(props: TickerProps): JSX.Element;

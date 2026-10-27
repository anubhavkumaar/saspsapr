import type { ReactNode } from 'react';
export interface HeroProps {
  /** Row of mono facts / <Live/> indicators above the title */
  kicker?: ReactNode;
  /** Display title, one entry per line — each line rises in */
  lines: ReactNode[];
  /** Which line renders forest green (default 1) */
  accent?: number;
  /** Tracked mono strapline under the title */
  line?: ReactNode;
  /** Left column extras: <FormBlock/>, <HeroActions/> */
  children?: ReactNode;
  /** Right column, usually <Photo/> */
  aside?: ReactNode;
  /** Full-width under the grid, usually <Tally/> */
  below?: ReactNode;
  id?: string;
}
/** Handbook-cover hero: huge stacked Big Shoulders title, memo block, taped photo. */
export declare function Hero(props: HeroProps): JSX.Element;
export interface HeroActionsProps { children?: ReactNode; }
export declare function HeroActions(props: HeroActionsProps): JSX.Element;

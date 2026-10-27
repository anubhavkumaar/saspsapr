import type { ReactNode, CSSProperties } from 'react';
export interface StampProps {
  tone?: 'stamp' | 'forest' | 'water' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  /** Degrees. Keep between -12 and 12. */
  rotate?: number;
  /** Thunks in when scrolled into view (default true) */
  animate?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}
/** Rubber-stamp mark: double border, multiply blend, tilted. Use 1–2 per screen for status ("Recruiting Open", "Protected · Endangered"). */
export declare function Stamp(props: StampProps): JSX.Element;

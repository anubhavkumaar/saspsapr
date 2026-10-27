import type { ReactNode, CSSProperties, ElementType } from 'react';
export interface RevealProps { as?: ElementType; /** seconds */ delay?: number; className?: string; style?: CSSProperties; id?: string; children?: ReactNode; }
/** Fades + rises 22px when scrolled into view. Stagger siblings with delay .06–.12. */
export declare function Reveal(props: RevealProps): JSX.Element;
export interface CountUpProps { value: number; /** ms */ duration?: number; }
/** Counts from 0 to value (ease-out cubic) once visible. */
export declare function CountUp(props: CountUpProps): JSX.Element;

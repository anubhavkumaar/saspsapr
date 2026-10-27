import type { ReactNode, CSSProperties } from 'react';
export interface SectionProps { id?: string; /** Tinted paper-2 band — alternate down the page */ alt?: boolean; tight?: boolean; children?: ReactNode; }
/** Full-width section, 84px padding, 2px ink bottom rule, 1200px column. */
export declare function Section(props: SectionProps): JSX.Element;
export interface SectionHeaderProps {
  /** Outlined Big Shoulders numeral ("01") or word ("MDT", "ADMIN") */
  num?: string;
  /** Mono eyebrow — use the product's verbatim section tag */
  eyebrow?: ReactNode;
  eyebrowTone?: 'gold' | 'stamp';
  title: ReactNode;
  sub?: ReactNode;
  /** Buttons / filters under the title */
  aside?: ReactNode;
}
/** Outlined numeral + eyebrow + uppercase title + sub. */
export declare function SectionHeader(props: SectionHeaderProps): JSX.Element;
export interface SubHeadingProps { children?: ReactNode; }
/** 28px uppercase block heading inside a section. */
export declare function SubHeading(props: SubHeadingProps): JSX.Element;
export interface SplitProps { /** default 1.15fr/1fr · even · wide-right */ variant?: 'even' | 'wide-right'; style?: CSSProperties; children?: ReactNode; }
/** Two-column layout that stacks under 900px. */
export declare function Split(props: SplitProps): JSX.Element;

import type { ReactNode, CSSProperties } from 'react';
export interface CardProps {
  /** Header band colour: forest (hunting / default) · water (fishing) · stamp · gold · plain */
  tone?: 'forest' | 'water' | 'stamp' | 'gold' | 'plain';
  icon?: string;
  title?: ReactNode;
  /** Small mono text on the right of the header band */
  meta?: ReactNode;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}
/** Laminated reference card: 2px frame, coloured header band, soft offset shadow. */
export declare function Card(props: CardProps): JSX.Element;
export interface CardBodyProps { children?: ReactNode; }
export declare function CardBody(props: CardBodyProps): JSX.Element;
export interface CardFootProps { title?: ReactNode; children?: ReactNode; }
export declare function CardFoot(props: CardFootProps): JSX.Element;
export interface Fact { icon?: string; k: ReactNode; v: ReactNode; n?: ReactNode; }
export interface FactsProps { items: Fact[]; }
/** 2-up grid of big Big Shoulders values with mono keys — the scannable core of a quick-reference card. */
export declare function Facts(props: FactsProps): JSX.Element;
export interface EquipmentGroup { title: ReactNode; items: ReactNode[]; }
export interface EquipmentProps { allowed?: EquipmentGroup; prohibited?: EquipmentGroup; }
/** ✓ permitted / ✗ prohibited columns. */
export declare function Equipment(props: EquipmentProps): JSX.Element;

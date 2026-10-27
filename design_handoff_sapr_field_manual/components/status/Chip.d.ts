import type { ReactNode } from 'react';
export interface ChipProps { /** Leading forest index, e.g. "01" */ num?: ReactNode; active?: boolean; /** Makes it a button */ onClick?: () => void; children?: ReactNode; }
/** Framed mono tag for places and areas. */
export declare function Chip(props: ChipProps): JSX.Element;
export interface ChipGroupProps { children?: ReactNode; }
export declare function ChipGroup(props: ChipGroupProps): JSX.Element;

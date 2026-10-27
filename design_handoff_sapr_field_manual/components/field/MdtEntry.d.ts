import type { CSSProperties } from 'react';
export interface MdtEntryProps { type?: 'mdt' | 'warning'; citizenId?: string; notes?: string; /** Submitting officer (gold) */ officer?: string; /** pre-formatted, e.g. "28 Mar 2026" */ date?: string; /** Shows a remove button */ onDelete?: () => void; style?: CSSProperties; }
/** One MDT / warning log row: type icon, Big Shoulders Citizen ID, officer + date. */
export declare function MdtEntry(props: MdtEntryProps): JSX.Element;

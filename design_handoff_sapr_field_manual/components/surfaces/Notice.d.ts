import type { ReactNode } from 'react';
export interface NoticeProps { eyebrow?: ReactNode; title: ReactNode; lead?: ReactNode; /** CTA button */ action?: ReactNode; /** Right-column checklist */ items?: ReactNode[]; /** Stamp text pinned top-right, e.g. "Recruiting Open" */ stamp?: ReactNode; }
/** Pinned bulletin with a forest offset shadow — recruitment and announcements. */
export declare function Notice(props: NoticeProps): JSX.Element;
export interface PinListProps { items: ReactNode[]; icon?: string; }
/** Ruled ✓ list. */
export declare function PinList(props: PinListProps): JSX.Element;

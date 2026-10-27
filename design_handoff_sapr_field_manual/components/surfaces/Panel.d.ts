import type { ReactNode, CSSProperties } from 'react';
export interface PanelProps { title?: ReactNode; meta?: ReactNode; /** false = no inner padding (for lists) */ body?: boolean; style?: CSSProperties; children?: ReactNode; }
/** Plain framed container with a paper-2 mono header. Admin tools and forms. */
export declare function Panel(props: PanelProps): JSX.Element;

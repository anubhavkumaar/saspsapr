import type { ReactNode, CSSProperties } from 'react';
export interface SegmentedOption { value: string; label: ReactNode; icon?: string; /** warn = amber underline (warnings) */ tone?: 'default' | 'warn'; }
export interface SegmentedProps { options: SegmentedOption[]; value?: string; onChange?: (value: string) => void; style?: CSSProperties; }
/** Framed tab strip — MDT / Warning toggle, phone app tabs. */
export declare function Segmented(props: SegmentedProps): JSX.Element;

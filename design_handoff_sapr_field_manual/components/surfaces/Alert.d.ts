import type { ReactNode, CSSProperties } from 'react';
export interface AlertProps { tone?: 'danger' | 'warn' | 'info' | 'ok'; /** Lucide name; defaults per tone */ icon?: string; style?: CSSProperties; /** Use <strong> for the key fact */ children?: ReactNode; }
/** Framed tinted notice. Danger = protected species / poaching warnings; info = dashed water note. */
export declare function Alert(props: AlertProps): JSX.Element;
export interface EmptyProps { children?: ReactNode; }
/** Dashed empty state ("No MDT entries logged yet."). */
export declare function Empty(props: EmptyProps): JSX.Element;

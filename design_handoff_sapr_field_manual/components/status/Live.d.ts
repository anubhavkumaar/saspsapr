import type { ReactNode } from 'react';
export interface LiveProps { /** ok blinks forest · warn · danger · off = static grey */ tone?: 'ok' | 'warn' | 'danger' | 'off'; children?: ReactNode; }
/** Blinking status dot + mono label ("Department Active"). */
export declare function Live(props: LiveProps): JSX.Element;

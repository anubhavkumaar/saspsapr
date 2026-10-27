import type { ReactNode } from 'react';
export interface ChecklistProps { items: ReactNode[]; cols?: 1 | 2; hint?: ReactNode; }
/** Interactive tick-box list for restrictions and briefings, with a running count. */
export declare function Checklist(props: ChecklistProps): JSX.Element;

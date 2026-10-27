import type { ReactNode } from 'react';
export interface FormBlockProps { rows: { k: ReactNode; v: ReactNode }[]; }
/** Filled-in form rows — Commanding Officer / Overwatch / Jurisdiction, or From / To / Re. */
export declare function FormBlock(props: FormBlockProps): JSX.Element;

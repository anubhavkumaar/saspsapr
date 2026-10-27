import type { ReactNode } from 'react';
export interface FieldProps { label: ReactNode; required?: boolean; hint?: ReactNode; error?: ReactNode; children?: ReactNode; }
/** Mono label (red * when required) above an input, with hint / error line. */
export declare function Field(props: FieldProps): JSX.Element;
export interface FieldRowProps { cols?: number; children?: ReactNode; }
export declare function FieldRow(props: FieldRowProps): JSX.Element;
export interface FormStackProps { onSubmit?: (e: any) => void; children?: ReactNode; }
/** <form> with 16px vertical rhythm; prevents default submit. */
export declare function FormStack(props: FormStackProps): JSX.Element;

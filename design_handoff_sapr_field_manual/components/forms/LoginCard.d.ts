import type { ReactNode } from 'react';
export interface LoginCardProps { eyebrow?: ReactNode; title?: ReactNode; sub?: ReactNode; error?: ReactNode; submitLabel?: string; onSubmit?: (e: any) => void; defaultEmail?: string; defaultPassword?: string; }
/** Officer / management sign-in card. */
export declare function LoginCard(props: LoginCardProps): JSX.Element;

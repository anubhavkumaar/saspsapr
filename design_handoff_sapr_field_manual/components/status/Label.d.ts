import type { ReactNode } from 'react';
export interface LabelProps {
  /** Omit to infer from the text: "Infraction", "Misdemeanor", "Felony", "Legal", "Protected", "Active", "LOA", "Inactive", "SASP", "LSPD", "BCSO" all map automatically. */
  tone?: 'legal' | 'infraction' | 'misdemeanor' | 'felony' | 'protected' | 'domestic' | 'active' | 'inactive' | 'loa' | 'warn' | 'danger' | 'info' | 'gold' | 'sasp' | 'lspd' | 'bcso';
  children?: ReactNode;
}
/** Outlined uppercase mono classification label. */
export declare function Label(props: LabelProps): JSX.Element;

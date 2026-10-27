import type { ReactNode } from 'react';
export interface ModalProps { open?: boolean; onClose?: () => void; title?: ReactNode; sub?: ReactNode; /** max width px, default 420 */ width?: number; children?: ReactNode; }
/** Framed dialog that pops in over a paper-tinted blur. Esc and backdrop close it. */
export declare function Modal(props: ModalProps): JSX.Element | null;

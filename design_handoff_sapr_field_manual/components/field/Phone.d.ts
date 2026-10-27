import type { ReactNode } from 'react';
export interface PhoneProps { eyebrow?: ReactNode; title?: ReactNode; foot?: ReactNode; /** screen min-height px, default 640 */ height?: number; children?: ReactNode; }
/** In-world phone frame (dark bezel in both themes) for the MDT and other field apps. */
export declare function Phone(props: PhoneProps): JSX.Element;

import type { ReactNode, CSSProperties } from 'react';
export interface PhotoProps {
  src?: string;
  alt?: string;
  /** "FIG. 1 — …" mono caption on the white border */
  caption?: ReactNode;
  /** CSS aspect-ratio, default "4/5" */
  ratio?: string;
  /** degrees, straightens on hover */
  tilt?: number;
  tape?: boolean;
  stamp?: ReactNode;
  stampTone?: 'stamp' | 'forest' | 'water' | 'gold';
  stampStyle?: CSSProperties;
  /** Custom media (e.g. an <image-slot>) instead of src */
  children?: ReactNode;
}
/** Taped field photograph: white border, tilt, optional stamp. Use for in-game screenshots. */
export declare function Photo(props: PhotoProps): JSX.Element;

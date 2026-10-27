import type { CSSProperties } from 'react';
export interface IconProps {
  /** Lucide icon name in kebab-case, e.g. "crosshair", "fish", "triangle-alert". Requires the lucide UMD script on the page. */
  name: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
}
/** Inline Lucide line icon in currentColor. SAPR uses 2px strokes at 14–22px. */
export declare function Icon(props: IconProps): JSX.Element;

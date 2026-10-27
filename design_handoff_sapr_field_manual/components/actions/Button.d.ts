import type { ReactNode, ElementType } from 'react';
export interface ButtonProps {
  /** primary = forest fill · ghost = paper fill · danger = stamp red · text = bare link-style */
  variant?: 'primary' | 'ghost' | 'danger' | 'text';
  size?: 'md' | 'sm';
  block?: boolean;
  /** Lucide icon before the label */
  icon?: string;
  /** Lucide icon after the label — use "arrow-right" on forward CTAs (it nudges on hover) */
  iconRight?: string;
  as?: ElementType;
  href?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: (e: any) => void;
  className?: string;
  children?: ReactNode;
}
/** Square, 2px-framed button with a hard offset shadow that lifts on hover and presses in on click. */
export declare function Button(props: ButtonProps): JSX.Element;

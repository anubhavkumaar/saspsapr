import type { ReactNode } from 'react';
export interface HeaderLink { label: string; href?: string; onClick?: () => void; active?: boolean; }
export interface HeaderProps {
  /** Lockup image — assets/logos/ranger-state-lockup.png */
  logo?: string;
  name?: string;
  sub?: string;
  links?: HeaderLink[];
  /** Right side: <ThemeToggle/> + login <Button size="sm" variant="ghost"/> */
  actions?: ReactNode;
  /** The product opens /admin after 5 brand clicks — count them here */
  onBrand?: () => void;
}
/** Sticky 68px paper header with a 2px ink rule. Nav collapses into a drawer under 900px. */
export declare function Header(props: HeaderProps): JSX.Element;

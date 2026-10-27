import type { ReactNode } from 'react';
export interface FooterProps { logo?: string; name?: string; lines?: ReactNode[]; links?: { label: string; href?: string; onClick?: () => void }[]; /** Small mono line under the rule, e.g. ["SAPR Field Handbook", "Statewide Edition 2026"] */ colophon?: ReactNode[]; /** Maker credit at the end of the colophon: "Built by" + logo (assets/logos/builder-ak.png) */ builtBy?: { logo: string; name?: string; href?: string }; }
/** Lockup, uppercase name, credits, two-column link grid, colophon. */
export declare function Footer(props: FooterProps): JSX.Element;

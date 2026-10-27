export interface SpeciesIndexProps { title: string; items: string[]; /** Protected styling */ danger?: boolean; /** Stamp text on the corner */ stamp?: string; cols?: number; }
/** Numbered multi-column species register. */
export declare function SpeciesIndex(props: SpeciesIndexProps): JSX.Element;
export interface RunInProps { title?: string; items: string[]; sep?: string; }
/** Long lists as one compact run-in paragraph with a count label. */
export declare function RunIn(props: RunInProps): JSX.Element;

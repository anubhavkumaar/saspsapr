export interface TallyItem { value: string | number; label: string; sub?: string; tone?: 'forest' | 'stamp' | 'warn' | 'gold' | 'water'; }
export interface TallyProps { items: TallyItem[]; /** Count up plain integers on view (default true) */ count?: boolean; style?: any; }
/** Framed stat strip with 72px numerals. */
export declare function Tally(props: TallyProps): JSX.Element;

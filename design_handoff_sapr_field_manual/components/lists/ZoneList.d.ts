export interface Zone { name: string; kind: 'hunt' | 'fish'; /** radar position, % (north up) */ x?: number; y?: number; }
export interface ZoneListProps { zones: Zone[]; /** Highlighted zone name — share with <Radar active> */ active?: string | null; onHover?: (name: string | null) => void; }
/** Numbered hunting (red triangle) and fishing (blue circle) zone legend. */
export declare function ZoneList(props: ZoneListProps): JSX.Element;

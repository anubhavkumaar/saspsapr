export interface RadarZone { name: string; kind: 'hunt' | 'fish'; /** % from left */ x: number; /** % from top (north up) */ y: number; }
export interface RadarProps { zones: RadarZone[]; /** Highlighted blip — share with <ZoneList active> */ active?: string | null; onSelect?: (name: string | null) => void; label?: string; legend?: boolean; size?: number | string; }
/** Printed-dial radar with a forest sweep and pulsing zone blips. Positions are illustrative, not survey-accurate. */
export declare function Radar(props: RadarProps): JSX.Element;

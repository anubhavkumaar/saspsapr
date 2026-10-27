export interface PenalCode { code: string; offense: string; cls: 'Infraction' | 'Misdemeanor' | 'Felony'; /** e.g. "10 months" or "0" */ sentence: string; /** numeric months for the bar */ months?: number; fine: string; }
export interface PenalCodeTableProps { codes: PenalCode[]; /** Show All / Infraction / Misdemeanor / Felony filter buttons (default true) */ filterable?: boolean; /** Bar scale, default 25 */ maxMonths?: number; }
/** Title 10 table with class filters, severity bars and Big Shoulders fines. */
export declare function PenalCodeTable(props: PenalCodeTableProps): JSX.Element;

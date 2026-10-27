export interface RosterPerson { name: string; callSign?: string; rank?: string; dept?: 'SASP' | 'LSPD' | 'BCSO' | 'SAPR' | string; status?: 'Active' | 'Inactive' | 'LOA'; initials?: string; }
export interface RosterSection { /** Overwatch · High Command · Command · Supervisor · Rangers */ section: string; people: RosterPerson[]; }
export interface RosterProps { sections: RosterSection[]; }
/** Grouped personnel register with initials badges and dept/status labels. */
export declare function Roster(props: RosterProps): JSX.Element;

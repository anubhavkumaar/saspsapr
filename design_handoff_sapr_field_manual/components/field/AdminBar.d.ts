import type { ReactNode } from 'react';
export interface AdminBarProps { name: string; email?: string; /** Action buttons: Manage Users, Sign Out */ children?: ReactNode; }
/** Signed-in strip shown above editable sections. */
export declare function AdminBar(props: AdminBarProps): JSX.Element;
export interface ControlCardProps { title: ReactNode; sub?: ReactNode; /** e.g. <Live>Open</Live> */ status?: ReactNode; action?: ReactNode; }
/** Setting row for the admin panel (Recruitment Form open/closed). */
export declare function ControlCard(props: ControlCardProps): JSX.Element;

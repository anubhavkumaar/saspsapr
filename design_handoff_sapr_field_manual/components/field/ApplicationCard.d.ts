export interface ApplicationCardProps { name: string; citizenId: string; department: string; rank?: string; /** pending · on_hold · shortlisted · reviewed · rejected */ tags?: string[]; why?: string; availability?: string; discord?: string; onClick?: () => void; }
/** Recruitment application summary for the admin queue. Reviewed / rejected render muted. */
export declare function ApplicationCard(props: ApplicationCardProps): JSX.Element;

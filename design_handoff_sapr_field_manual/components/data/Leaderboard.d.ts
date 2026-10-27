export interface LeaderboardRow { name: string; /** pre-formatted, e.g. "28 Mar 2026" */ last?: string; count: number; }
export interface LeaderboardProps { rows: LeaderboardRow[]; }
/** Ranked contribution list. 01 gold, 02 ink, 03 amber — no emoji medals. */
export declare function Leaderboard(props: LeaderboardProps): JSX.Element;

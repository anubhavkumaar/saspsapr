import type { ReactNode } from 'react';
export interface CameraFeedProps { cam?: string; /** San Andreas place name */ place: string; src?: string; alt?: string; /** Fixed time; omit for a live IST clock */ time?: string; /** Custom media, e.g. an <image-slot> for in-game screenshots */ children?: ReactNode; }
/** 16:10 trail-cam frame: REC blink, cam ID, place, live clock over an in-game screenshot. */
export declare function CameraFeed(props: CameraFeedProps): JSX.Element;
export interface FeedGridProps { cols?: number; children?: ReactNode; }
export declare function FeedGrid(props: FeedGridProps): JSX.Element;

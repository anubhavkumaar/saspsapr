import type { ReactNode } from 'react';
export interface EvidenceCardProps { src?: string; alt?: string; caption?: string; date?: string; uploader?: string; /** degrees */ tilt?: number; onOpen?: () => void; onDelete?: () => void; /** custom media, e.g. <image-slot> */ children?: ReactNode; }
/** Field-evidence print: white border, 16:10 photo, forest date, gold uploader. */
export declare function EvidenceCard(props: EvidenceCardProps): JSX.Element;
export interface EvidenceGridProps { children?: ReactNode; }
export declare function EvidenceGrid(props: EvidenceGridProps): JSX.Element;
export interface DropZoneProps { label?: ReactNode; hint?: ReactNode; onDropUrl?: (url: string) => void; }
/** Dashed drag-and-drop target for evidence image URLs. */
export declare function DropZone(props: DropZoneProps): JSX.Element;

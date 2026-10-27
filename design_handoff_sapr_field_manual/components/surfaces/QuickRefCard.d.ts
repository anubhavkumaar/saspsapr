import type { ReactNode } from 'react';
import type { Fact, EquipmentGroup } from './Card';
export interface QuickRefCardProps {
  tone?: 'forest' | 'water';
  icon?: string;
  title: ReactNode;
  meta?: ReactNode;
  /** 4 facts reads best (2×2) */
  facts: Fact[];
  allowed?: EquipmentGroup;
  prohibited?: EquipmentGroup;
  footTitle?: ReactNode;
  foot?: ReactNode;
}
/** One activity's rules on one card: facts, equipment, areas/notes. */
export declare function QuickRefCard(props: QuickRefCardProps): JSX.Element;
export interface QuickRefGridProps { children?: ReactNode; }
/** Two cards side by side; stacks under 900px. */
export declare function QuickRefGrid(props: QuickRefGridProps): JSX.Element;

import type { ReactNode } from 'react';
export interface DataTableColumn { key: string; label: ReactNode; render?: (value: any, row: any) => ReactNode; /** "is-code" | "is-fine" | "is-mono" */ className?: string; align?: 'left' | 'right' | 'center'; }
export interface DataTableProps { columns: DataTableColumn[]; rows: Record<string, any>[]; rowKey?: string; }
/** Ruled ledger table: 2px frame, paper-2 mono header, hover lifts to white. */
export declare function DataTable(props: DataTableProps): JSX.Element;

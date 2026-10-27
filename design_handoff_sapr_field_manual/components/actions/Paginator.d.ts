export interface PaginatorProps { /** 0-indexed */ page?: number; totalPages?: number; onChange?: (page: number) => void; }
/** Prev / "Page n of N" / Next. Renders nothing for a single page. */
export declare function Paginator(props: PaginatorProps): JSX.Element | null;

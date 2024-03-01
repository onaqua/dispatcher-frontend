export interface PagedList<T> extends PaginationMetaData {
    items: T[];
}

export interface PaginationMetaData {
    firstItemOnPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    isFirstPage: boolean;
    isLastPage: boolean;
    lastItemOnPage: number;
    pageCount: number;
    pageNumber: number;
    pageSize: number;
    totalItemCount: number;
}
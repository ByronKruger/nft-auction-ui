import { SortDirection } from "@angular/material/sort";

export interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems?: number;
    totalPages?: number;
}

export class PaginatedResult<T> {
    result?: T;
    pagination?: Pagination;   
}

export interface UserParams {
    username?: SortDirection;
    nftOwnerUsername?: string;
}
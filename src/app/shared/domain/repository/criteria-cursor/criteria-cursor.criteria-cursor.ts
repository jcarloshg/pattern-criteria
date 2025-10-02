import { FilterCursor } from "./filter-cursor.criteria-cursor";
import { OrderCursor } from "./order-cursor.criteria-cursor";
import { PaginationCursor } from "./pagination-cursor.criteria-cursor";

export class CriteriaCursor {
    public filters: FilterCursor[];
    public pagination: PaginationCursor;
    public order: OrderCursor;

    constructor(
        filters: FilterCursor[],
        pagination: PaginationCursor,
        order: OrderCursor
    ) {
        this.filters = filters;
        this.pagination = pagination;
        this.order = order;
    }
}

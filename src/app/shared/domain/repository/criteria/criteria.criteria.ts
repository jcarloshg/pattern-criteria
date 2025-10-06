import { Filter } from "./filter.criteria";
import { Order } from "./order.criteria";
import { Pagination } from "./pagination.criteria";

export class Criteria {
    public filters: Filter[];
    public orders: Order;
    public pagination: Pagination;

    constructor(filters: Filter[], orders: Order, pagination: Pagination) {
        this.filters = filters;
        this.orders = orders;
        this.pagination = pagination;
    }
}

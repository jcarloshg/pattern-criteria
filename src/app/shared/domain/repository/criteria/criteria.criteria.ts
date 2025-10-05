import { Filter } from "./filter.criteria";
import { Order } from "./order.criteria";
import { Pagination } from "./pagination.criteria";

interface CriteriaA {
    filtersOr: {
        firstPart: Filter,
        secondPart: Filter
    }[];
    filtersAnd: {
        firstPart: Filter,
        secondPart: Filter
    }[];
    order: Order;
    pagination: Pagination;
}


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

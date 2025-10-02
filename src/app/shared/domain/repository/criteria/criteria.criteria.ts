import { Filter } from "./filter.criteria";
import { Order } from "./order.criteria";

export class Criteria {
    public filters: Filter[];
    public orders: Order;
    constructor(filters: Filter[], orders: Order) {
        this.filters = filters;
        this.orders = orders;
    }
}

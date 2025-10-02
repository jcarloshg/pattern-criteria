import { CriteriaError } from "../../errors/criteria.error";

export class Criteria {
    private filters: Filter[] = [];
    private orders: Order;
    constructor(filters: Filter[], orders: Order) {
        this.filters = filters;
        this.orders = orders;
    }
}

export enum Operator {
    EQUAL = "=",
    NOT_EQUAL = "!=",
    GT = ">",
    LT = "<",
    CONTAINS = "CONTAINS",
    NOT_CONTAINS = "NOT_CONTAINS",
}


export type FiltersPrimitives = {
    field: string;
    operator: string;
    value: string;
};

export class Filter {
    private field: string;
    private operator: Operator;
    private value: string;

    constructor(field: string, operator: Operator, value: string) {
        this.field = field;
        this.operator = operator;
        this.value = value;
    }

    public static fromPrimitives(primitives: FiltersPrimitives): Filter {
        try {
            return new Filter(
                primitives.field,
                primitives.operator as Operator,
                primitives.value
            );
        } catch (error) {
            throw new CriteriaError(error);
        }
    }
}

export enum OrderType {
    ASC = "ASC",
    DESC = "DESC",
    NONE = "NONE",
}

export type OrderPrimitives = {
    orderBy: string;
    order: string;
}

export class Order {
    private orderBy: string;
    private order: OrderType;
    constructor(orderBy: string, order: OrderType) {
        this.orderBy = orderBy;
        this.order = order;
    }

    static fromPrimitives(primitives: OrderPrimitives): Order {
        try {
            return new Order(
                primitives.orderBy,
                primitives.order as OrderType
            );
        } catch (error) {
            throw new CriteriaError(error);
        }
    }
}

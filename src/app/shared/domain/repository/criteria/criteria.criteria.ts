import { CriteriaError } from "../../errors/criteria.error";

export class Criteria {
    public filters: Filter[];
    public orders: Order;
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
    public field: string;
    public operator: Operator;
    public value: string;

    constructor(field: string, operator: Operator, value: string) {
        this.field = field;
        this.operator = operator;
        this.value = value;
    }

    public static fromPrimitives(primitives: FiltersPrimitives): Filter {
        try {

            const operatorKey = primitives.operator as keyof typeof Operator;
            const op = Operator[operatorKey];
            if (op === undefined)
                throw new CriteriaError(`Unknown operator: ${primitives.operator}`);

            return new Filter(primitives.field, op, primitives.value);
        } catch (error) {
            throw new CriteriaError("Invalid filter primitives");
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
};

export class Order {
    public orderBy: string;
    public order: OrderType;
    constructor(orderBy: string, order: OrderType) {
        this.orderBy = orderBy;
        this.order = order;
    }

    static fromPrimitives(primitives: OrderPrimitives): Order {
        try {
            return new Order(primitives.orderBy, primitives.order as OrderType);
        } catch (error) {
            throw new CriteriaError(error);
        }
    }
}

import { CriteriaError } from "@/app/shared/domain/errors/criteria.error";

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
        if (!Object.values(OrderType).includes(primitives.order as OrderType)) {
            throw new CriteriaError(`[order] is invalid`);
        }

        return new Order(primitives.orderBy, primitives.order as OrderType);
    }
}

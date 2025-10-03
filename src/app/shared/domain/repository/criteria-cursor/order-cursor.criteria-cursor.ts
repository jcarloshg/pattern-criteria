import { CriteriaError } from "../../errors/criteria.error";

export enum OrderCursorType {
    ASC = "ASC",
    DESC = "DESC",
}

export class OrderCursor {
    constructor(
        public value: string,
        public cursor: string,
        public direction: OrderCursorType
    ) { }

    public static fromPrimitives(
        value: string,
        cursor: string,
        direction: string
    ): OrderCursor {
        try {
            if (value.length === 0) {
                throw new CriteriaError("value is required");
            }

            if (cursor.length === 0) {
                throw new CriteriaError("cursor is required");
            }

            if (!(direction in OrderCursorType)) {
                throw new CriteriaError("Invalid direction");
            }

            return new OrderCursor(value, cursor, direction as OrderCursorType);
        } catch (error) {
            throw new CriteriaError(error);
        }
    }
}

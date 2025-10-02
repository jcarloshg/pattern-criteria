import { CriteriaError } from "../../errors/criteria.error";

export enum OrderCursorType {
    ASC = "ASC",
    DESC = "DESC",
}

export class OrderCursor {
    constructor(public cursor: string, public direction: OrderCursorType) { }

    public static fromPrimitives(cursor: string, direction: string): OrderCursor {
        try {
            if (cursor.length === 0) {
                throw new CriteriaError("cursor is required");
            }

            if (!(direction in OrderCursorType)) {
                throw new CriteriaError("Invalid direction");
            }

            return new OrderCursor(cursor, direction as OrderCursorType);
        } catch (error) {
            throw new CriteriaError(error);
        }
    }
}

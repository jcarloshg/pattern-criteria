import { CriteriaError } from "@/app/shared/domain/errors/criteria.error";

export type FiltersPrimitives = {
    field: string;
    operator: string;
    value: string;
};

export enum Operator {
    EQUAL = "=",
    NOT_EQUAL = "!=",
    GT = ">",
    GET = ">=",
    LT = "<",
    LET = "<=",
    IN = "IN",
    NOT_IN = "NOT IN",
    CONTAINS = "CONTAINS",
    NOT_CONTAINS = "NOT_CONTAINS",
}

export class FilterCursor {
    public field: string;
    public operator: Operator;
    public value: string;

    constructor(field: string, operator: Operator, value: string) {
        this.field = field;
        this.operator = operator;
        this.value = value;
    }

    public static fromPrimitives(primitives: FiltersPrimitives): FilterCursor {
        try {
            const operatorKey = primitives.operator as keyof typeof Operator;
            const op = Operator[operatorKey];
            if (op === undefined)
                throw new CriteriaError(`Unknown operator: ${primitives.operator}`);

            return new FilterCursor(primitives.field, op, primitives.value);
        } catch (error) {
            throw new CriteriaError("Invalid filter primitives");
        }
    }
}

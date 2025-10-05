import { CriteriaError } from "@/app/shared/domain/errors/criteria.error";

export type FiltersPrimitives = {
    field: string;
    operator: string;
    value: string[];
};

// AND, OR, NOT, EQUAL, NOT_EQUAL, LESS_THAN, GREATER_THAN, LESS_THAN_OR_EQUAL, GREATER_THAN_OR_EQUAL, 
// IN, NOT_IN, BETWEEN, NOT_BETWEEN, LIKE, NOT_LIKE, IS_NULL, IS_NOT_NULL

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

export class Filter {
    public field: string;
    public operator: Operator;
    public value: string[];

    constructor(field: string, operator: Operator, value: string[]) {
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

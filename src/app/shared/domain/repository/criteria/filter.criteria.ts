import { CriteriaError } from "@/app/shared/domain/errors/criteria.error";

// AND, OR, NOT, EQUAL, NOT_EQUAL, LESS_THAN, GREATER_THAN, LESS_THAN_OR_EQUAL, GREATER_THAN_OR_EQUAL,
// IN, NOT_IN, BETWEEN, NOT_BETWEEN, LIKE, NOT_LIKE, IS_NULL, IS_NOT_NULL

export type FiltersPrimitives = {
    field: string;
    operator: string;
    values: string;
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

export class Filter {
    public field: string;
    public operator: Operator;
    public values: string[];

    constructor(field: string, operator: Operator, value: string[]) {
        this.field = field;
        this.operator = operator;
        this.values = value;
    }

    public static fromPrimitives(primitives: FiltersPrimitives): Filter {
        // Validate field
        const field = primitives.field?.trim();
        if (!field) {
            throw new CriteriaError("[field] is required");
        }

        // Validate operator
        const operator = primitives.operator as Operator;
        if (!Object.keys(Operator).includes(operator)) {
            throw new CriteriaError("[operator] is invalid");
        }

        // Parse and validate values
        const values = primitives.values
            .replace(/^\[|\]$/g, "") // Remove leading/trailing brackets
            .split(",")
            .map((v) => v.trim())
            .filter((v) => v.length > 0);

        if (values.length === 0) {
            throw new CriteriaError(
                "[values] must contain at least one non-empty value"
            );
        }

        return new Filter(field, operator, values);
    }
}

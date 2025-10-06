import { CriteriaError } from "../../errors/criteria.error";

export const OperatorPrimitivesArray = [
    "EQUAL",
    "NOT_EQUAL",
    "GT",
    "GTOE",
    "LT",
    "LET",
    "IN",
    "NOT_IN",
    "CONTAINS",
    "NOT_CONTAINS",
] as const;
export type OperatorType = (typeof OperatorPrimitivesArray)[number];

export class Operator {
    public value: OperatorType;
    public static OrdersPrimitivesArray = OperatorPrimitivesArray;

    constructor(value: OperatorType) {
        this.value = value;
    }

    public static fromType(value: OperatorType): Operator {
        return new Operator(value);
    }

    public static fromPrimitives(value: string): Operator {
        if (value.length === 0) {
            throw new CriteriaError("[operator] is required");
        }
        const isValid = OperatorPrimitivesArray.includes(value as OperatorType);
        if (!isValid) {
            throw new CriteriaError("[operator] is invalid");
        }
        return new Operator(value as OperatorType);
    }

    public static isEqual(operator: OperatorType, operator2: Operator): boolean {
        const existsOperator1 = OperatorPrimitivesArray.includes(
            operator as OperatorType
        );
        return existsOperator1 && operator === operator2.value;
    }

    public toSqlOperator(): string {
        return Operator.getSqlOperator(this.value);
    }

    public static getSqlOperator(value: OperatorType): string {
        const map: Record<OperatorType, string> = {
            EQUAL: "=",
            NOT_EQUAL: "!=",
            GT: ">",
            GTOE: ">=",
            LT: "<",
            LET: "<=",
            IN: "IN",
            NOT_IN: "NOT IN",
            CONTAINS: "LIKE", // This will be handled specially
            NOT_CONTAINS: "NOT LIKE", // This will be handled specially
        };
        return map[value];
    }
}

import { CriteriaError } from "../../errors/criteria.error";

export const OrdersPrimitivesArray = [
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
export type OrdersPrimitives = (typeof OrdersPrimitivesArray)[number];

export class Operator {
    public value: OrdersPrimitives;
    public static OrdersPrimitivesArray = OrdersPrimitivesArray;

    constructor(value: OrdersPrimitives) {
        this.value = value;
    }

    public fromPrimitives(value: string): Operator {
        const isValid = OrdersPrimitivesArray.includes(value as OrdersPrimitives);
        if (!isValid) {
            throw new CriteriaError("[operator] is invalid");
        }
        return new Operator(value as OrdersPrimitives);
    }

    public static getSqlOperator(value: OrdersPrimitives): string {
        const map: Record<OrdersPrimitives, string> = {
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

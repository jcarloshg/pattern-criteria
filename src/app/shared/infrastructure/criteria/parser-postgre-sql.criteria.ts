import { Criteria } from "@/app/shared/domain/repository/criteria/criteria.criteria";
import { Operator } from "@/app/shared/domain/repository/criteria/filter.criteria";

export interface ParameterizedQuery {
    query: string;
    parameters: any[];
}

export class ParserPostgreSql {
    public readonly criteria: Criteria;

    constructor(criteria: Criteria) {
        this.criteria = criteria;
    }

    public getParameterizedWhereClause(propertiesMap: Map<string, string>): ParameterizedQuery {
        const { filters } = this.criteria;
        const parameters: any[] = [];
        let parameterIndex = 1;

        const whereClauses = filters
            .map((filter) => {
                const column = propertiesMap.get(filter.field);
                if (!column) return undefined;

                const sqlOperator = this.mapOperatorToSQL(filter.operator);

                if (filter.operator === Operator.CONTAINS) {
                    parameters.push(`%${filter.value}%`);
                    return `lower(${column}) LIKE lower($${parameterIndex++})`;
                } else if (filter.operator === Operator.NOT_CONTAINS) {
                    parameters.push(`%${filter.value}%`);
                    return `lower(${column}) NOT LIKE lower($${parameterIndex++})`;
                } else {
                    parameters.push(filter.value);
                    return `${column} ${sqlOperator} $${parameterIndex++}`;
                }
            })
            .filter((clause) => clause !== undefined)
            .join(" AND ");

        const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses}` : "";

        return {
            query: whereClause,
            parameters: parameters
        };
    }

    private mapOperatorToSQL(operator: Operator): string {
        const operatorMap: Record<Operator, string> = {
            [Operator.EQUAL]: "=",
            [Operator.NOT_EQUAL]: "!=",
            [Operator.GT]: ">",
            [Operator.LT]: "<",
            [Operator.CONTAINS]: "LIKE", // This will be handled specially
            [Operator.NOT_CONTAINS]: "NOT LIKE", // This will be handled specially
        };

        return operatorMap[operator];
    }

    public getOrderByClause(propertiesMap: Map<string, string>): string {
        const { orders } = this.criteria;
        if (!orders || orders.order === "NONE") return "";

        const orderClauses = `${propertiesMap.get(orders.orderBy)} ${orders.order}`;

        return `ORDER BY ${orderClauses}`;
    }

    public getPaginationClause(propertiesMap: Map<string, string>): string {
        const { pagination } = this.criteria;
        if (!pagination) return "";

        const limit = pagination.pageSize;
        const offset = (pagination.page - 1) * pagination.pageSize;

        return `LIMIT ${limit} OFFSET ${offset}`;
    }
}
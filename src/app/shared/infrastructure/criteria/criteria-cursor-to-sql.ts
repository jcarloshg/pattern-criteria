import { CriteriaCursor } from "../../domain/repository/criteria-cursor/criteria-cursor.criteria-cursor";
import { Operator } from "@/app/shared/domain/repository/criteria-cursor/filter-cursor.criteria-cursor";
import { OrderCursorType } from "../../domain/repository/criteria-cursor/order-cursor.criteria-cursor";

export interface ParameterizedQuery {
    query: string;
    parameters: any[];
}

export class CriteriaCursorToSql {
    private readonly _criteria: CriteriaCursor;
    private _selectBody: string;
    private _fromBody: string;
    private _operatorSql: Record<Operator, string>;

    constructor(
        criteria: CriteriaCursor,
        select_body: string,
        from_body: string
    ) {
        this._criteria = criteria;
        this._selectBody = select_body;
        this._fromBody = from_body;
        this._operatorSql = {
            [Operator.EQUAL]: "=",
            [Operator.NOT_EQUAL]: "!=",
            [Operator.GT]: ">",
            [Operator.LT]: "<",
            [Operator.CONTAINS]: "LIKE", // This will be handled specially
            [Operator.NOT_CONTAINS]: "NOT LIKE", // This will be handled specially
        };
    }

    public toSql(propertiesMap: Map<string, string>): ParameterizedQuery {
        const whereBody = this._getWhereBody(propertiesMap);
        const orderBody: string = this._getOrderByBody(propertiesMap);
        const limitBody: string = this._criteria.pagination.pageSize.toString();

        const queryArray: string[] = [
            "SELECT",
            this._selectBody,
            "FROM",
            this._fromBody,
            "WHERE",
            whereBody.query,
            "ORDER BY",
            orderBody,
            "LIMIT",
            limitBody,
        ];

        const query = queryArray.join(" ");

        return {
            query,
            parameters: whereBody.parameters,
        };
    }

    private _getWhereBody(
        propertiesMap: Map<string, string>
    ): ParameterizedQuery {
        const { filters, order } = this._criteria;
        const parameters: any[] = [];
        let parameterIndex = 1;

        // ─────────────────────────────────────
        // Handle cursor-based pagination
        // ─────────────────────────────────────
        const whereFilters = filters
            .map((filter) => {
                const column = propertiesMap.get(filter.field);
                if (!column) return undefined;

                const sqlOperator = this._operatorSql[filter.operator];

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
            .filter((clause) => clause !== undefined);

        // ─────────────────────────────────────
        // Handle cursor-based pagination
        // ─────────────────────────────────────
        parameters.push(order.value);
        const whereCursors =
            order.direction === OrderCursorType.ASC
                ? `${propertiesMap.get(order.cursor)} > $${parameterIndex++}`
                : `${propertiesMap.get(order.cursor)} < $${parameterIndex++}`;

        // ─────────────────────────────────────
        // Combine all WHERE clauses
        // ─────────────────────────────────────
        const whereQuery = [...whereFilters, whereCursors].join(" AND ");

        return {
            query: whereQuery,
            parameters,
        };
    }

    private _getOrderByBody(propertiesMap: Map<string, string>): string {
        const { order } = this._criteria;
        const orderClauses = `${propertiesMap.get(order.cursor)} ${order.direction
            }`;
        return orderClauses;
    }
}

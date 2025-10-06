import { Criteria } from "@/app/shared/domain/repository/criteria/criteria.criteria";
import { Operator } from "@/app/shared/domain/repository/criteria/filter.criteria";
import { OrderType } from "../../domain/repository/criteria/order.criteria";

export interface ParameterizedQuery {
    query: string;
    parameters: any[];
}

export class CriteriaToSql {
    private selectBody: string[] = [];

    private fromBody: string = "";
    private joinsBody: string[] = [];

    private whereBody: string = "";
    private parameters: string[] = [];

    private groupByBody: string[] = [];
    private orderByBody: string = "";
    private limitBody: string = "";

    constructor() { }

    public buildSelect(value: string[]): CriteriaToSql {
        this.selectBody.push(...value);
        return this;
    }

    public buildFrom(value: string): CriteriaToSql {
        this.fromBody = value;
        return this;
    }

    public addJoin(
        join: "JOIN" | "LEFT JOIN" | "RIGHT JOIN",
        tableName: string,
        on: string,
        compare: string
    ): CriteriaToSql {
        this.joinsBody.push(`${join} ${tableName} ON ${on} = ${compare}`);
        return this;
    }

    public buildWhere(
        criteria: Criteria,
        propertiesMap: Map<string, string>
    ): CriteriaToSql {
        const { filters, orders } = criteria;
        let parameterIndex = 1;

        const whereFilters: string[] = filters.map((filter) => {

            const fieldMapped = propertiesMap.get(filter.field);

            if (filter.operator === Operator.CONTAINS) {
                const sectionsTemp: string[] = filter.values.map((value) => {
                    this.parameters.push(`%${value}%`);
                    return `lower(${fieldMapped}) LIKE lower($${parameterIndex++})`;
                });
                return sectionsTemp.length > 1
                    ? `(${sectionsTemp.join(" OR ")})`
                    : sectionsTemp[0];
            }

            if (filter.operator === Operator.NOT_CONTAINS) {
                const sectionsTemp: string[] = filter.values.map((value) => {
                    this.parameters.push(`%${value}%`);
                    return `lower(${fieldMapped}) NOT LIKE lower($${parameterIndex++})`;
                });
                return sectionsTemp.length > 1
                    ? `(${sectionsTemp.join(" OR ")})`
                    : sectionsTemp[0];
            }

            const sectionsTemp: string[] = filter.values.map((value) => {
                this.parameters.push(value);
                return `${fieldMapped} ${this._getOperatorSql(filter.operator)} $${parameterIndex++}`;
            });

            return sectionsTemp.length > 1
                ? `(${sectionsTemp.join(" OR ")})`
                : sectionsTemp[0];
        });

        this.whereBody = whereFilters.join(" AND ");

        return this;
    }

    private _getOperatorSql(operator: Operator): string {
        const entries = Object.entries(Operator);
        const operatorEntry = entries.find(([key, value]) => key === operator);
        if (!operatorEntry) {
            throw new Error(`Operator ${operator} not found`);
        }
        const [, value] = operatorEntry;
        return value;
    }

    public addGroupBy(value: string[]): CriteriaToSql {
        this.groupByBody.push(...value);
        return this;
    }

    public buildOrderBy(criteria: Criteria): CriteriaToSql {
        const { orders } = criteria;
        if (orders.order === OrderType.NONE) {
            this.orderByBody = "";
            return this;
        }
        this.orderByBody = `${orders.orderBy} ${orders.order}`;
        return this;
    }

    public buildPagination(criteria: Criteria): CriteriaToSql {
        const { pagination } = criteria;
        const offset = pagination.pageSize * (pagination.page - 1);
        this.limitBody = `${pagination.pageSize} OFFSET ${offset}`;
        return this;
    }

    public getResult(): ParameterizedQuery {
        const query: string[] = [];
        if (this.selectBody.length > 0) {
            query.push(`SELECT ${this.selectBody.join(", ")}`);
        }
        if (this.fromBody) query.push(`FROM ${this.fromBody}`);
        if (this.joinsBody.length > 0) {
            query.push(this.joinsBody.join(" "));
        }
        if (this.whereBody) query.push(`WHERE ${this.whereBody}`);
        if (this.groupByBody.length > 0) {
            const groupBy = this.groupByBody.join(", ");
            query.push(`GROUP BY ${groupBy}`);
        }
        if (this.orderByBody) query.push(`ORDER BY ${this.orderByBody}`);
        if (this.limitBody) query.push(`LIMIT ${this.limitBody}`);

        const queryString = query.join(" ") + ";";
        return {
            query: queryString,
            parameters: this.parameters,
        };
    }
}

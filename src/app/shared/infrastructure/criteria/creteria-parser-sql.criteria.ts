import { Criteria } from "@/app/shared/domain/repository/criteria/criteria.criteria";

export class CriteriaParserSql {
    public readonly criteria: Criteria;

    constructor(criteria: Criteria) {
        this.criteria = criteria;
    }

    public getWhereClause(propertiesMap: Map<string, string>): string {
        const { filters } = this.criteria;

        const whereClauses = filters
            .map(
                (filter) => {
                    const column = propertiesMap.get(filter.field);
                    if (!column) return undefined;
                    return `${column} ${filter.operator} '${filter.value}'`
                }
            )
            .filter((clause) => clause !== undefined)
            .join(" AND ");

        return whereClauses.length > 0 ? `WHERE ${whereClauses}` : "";
    }


}
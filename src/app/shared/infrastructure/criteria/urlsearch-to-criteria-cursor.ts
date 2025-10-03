import { CriteriaCursor } from "../../domain/repository/criteria-cursor/criteria-cursor.criteria-cursor";
import {
    FilterCursor,
    FiltersPrimitives,
} from "../../domain/repository/criteria-cursor/filter-cursor.criteria-cursor";
import { OrderCursor } from "../../domain/repository/criteria-cursor/order-cursor.criteria-cursor";
import { PaginationCursor } from "../../domain/repository/criteria-cursor/pagination-cursor.criteria-cursor";

export class UrlsearchToCriteriaCursor {
    public static parse(searchParams: URLSearchParams): CriteriaCursor {

        const filters: FilterCursor[] = this._getFilters(searchParams);
        const pagination: PaginationCursor = this._getPagination(searchParams);
        const order: OrderCursor = this._getOrder(searchParams);

        const cursor = new CriteriaCursor(filters, pagination, order);
        return cursor;
    }

    private static _getOrder(searchParams: URLSearchParams): OrderCursor {
        const value = searchParams.get("orderBy") || "";
        const cursor = searchParams.get("cursor") || "";
        const direction = searchParams.get("order") || "NONE";
        return OrderCursor.fromPrimitives(value, cursor, direction);
    }

    private static _getFilters(searchParams: URLSearchParams): FilterCursor[] {
        // index of filters / object with field, operator, value
        const filtersMap: Map<string, {}> = new Map();

        for (const [key, value] of searchParams.entries()) {
            const match = key.match(/\[(\d+)]\[(.+)]/);

            if (!match) continue;

            const index = match[1];
            const field = match[2];

            if (!filtersMap.has(index)) filtersMap.set(index, {});

            const filter = filtersMap.get(index) as any;
            filter[field] = value;

            filtersMap.set(index, filter);
        }

        const rawFilters = Array.from(filtersMap.values());
        const filters: FilterCursor[] = rawFilters.map((rawFilter) =>
            FilterCursor.fromPrimitives(rawFilter as FiltersPrimitives)
        );

        return filters;
    }

    private static _getPagination(searchParams: URLSearchParams): PaginationCursor {
        const pageSize = searchParams.get("pageSize");
        if (!pageSize) return new PaginationCursor();
        return PaginationCursor.fromPrimitives(pageSize);
    }
}

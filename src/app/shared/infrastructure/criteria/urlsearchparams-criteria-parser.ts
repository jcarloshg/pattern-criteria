import { Request } from "express";

import { Criteria } from "@/app/shared/domain/repository/criteria/criteria.criteria";
import { Filter, FiltersPrimitives } from "@/app/shared/domain/repository/criteria/filter.criteria";
import { Order } from "@/app/shared/domain/repository/criteria/order.criteria";


export class URLSearchParamsCriteriaParser {

    private static getFilters(searchParams: URLSearchParams): Filter[] {

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
        const filters: Filter[] = rawFilters.map(rawFilter => Filter.fromPrimitives(rawFilter as FiltersPrimitives));

        return filters;
    }

    private static getOrder(searchParams: URLSearchParams): Order {
        const orderBy = searchParams.get('orderBy') || '';
        const order = searchParams.get('order') || 'NONE';
        return Order.fromPrimitives({ orderBy, order });
    }

    public static parse(req: Request): any {

        const searchParams = new URLSearchParams(req.url);
        const filters = this.getFilters(searchParams);
        const order = this.getOrder(searchParams);

        const criteria = new Criteria(filters, order);
        return criteria;
    }
}

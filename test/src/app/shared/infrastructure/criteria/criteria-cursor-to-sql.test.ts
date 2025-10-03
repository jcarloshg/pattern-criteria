import { CriteriaCursor } from "@/app/shared/domain/repository/criteria-cursor/criteria-cursor.criteria-cursor";
import { FilterCursor, Operator } from "@/app/shared/domain/repository/criteria-cursor/filter-cursor.criteria-cursor";
import {
    OrderCursor,
    OrderCursorType,
} from "@/app/shared/domain/repository/criteria-cursor/order-cursor.criteria-cursor";
import { PaginationCursor } from "@/app/shared/domain/repository/criteria-cursor/pagination-cursor.criteria-cursor";
import { CriteriaCursorToSql } from "@/app/shared/infrastructure/criteria/criteria-cursor-to-sql";

describe("criteria-cursor-to-sql.test", () => {
    it("should get simple query", () => {
        const paginationCursor = new PaginationCursor();
        const orderCursor = new OrderCursor("50", "price", OrderCursorType.ASC);
        const criteriaCursor = new CriteriaCursor(
            [],
            paginationCursor,
            orderCursor
        );

        const selectBody = "*";
        const fromBody = "product";

        const propertiesMap: Map<string, string> = new Map<string, string>([
            ["price", "price"],
        ]);

        const criteria = new CriteriaCursorToSql(
            criteriaCursor,
            selectBody,
            fromBody
        );
        const querySql = criteria.toSql(propertiesMap);

        expect(querySql).toBeDefined();
        expect(querySql.parameters.length).toEqual(1);
        expect(querySql.parameters).toEqual(["50"]);
        expect(querySql.query).toBe(
            "SELECT * FROM product WHERE price > $1 ORDER BY price ASC LIMIT 10"
        );
    });

    it("should get query with pageSize in 30", () => {
        const paginationCursor = new PaginationCursor(30);
        const orderCursor = new OrderCursor("50", "price", OrderCursorType.ASC);
        const criteriaCursor = new CriteriaCursor(
            [],
            paginationCursor,
            orderCursor
        );

        const selectBody = "*";
        const fromBody = "product";

        const propertiesMap: Map<string, string> = new Map<string, string>([
            ["price", "price"],
        ]);

        const criteria = new CriteriaCursorToSql(
            criteriaCursor,
            selectBody,
            fromBody
        );
        const querySql = criteria.toSql(propertiesMap);

        expect(querySql).toBeDefined();
        expect(querySql.parameters.length).toEqual(1);
        expect(querySql.parameters).toEqual(["50"]);
        expect(querySql.query).toBe(
            "SELECT * FROM product WHERE price > $1 ORDER BY price ASC LIMIT 30"
        );
    });

    it("should get query with multiple filters", () => {
        const filters: FilterCursor[] = [
            new FilterCursor("category", Operator.EQUAL, "electronics"),
            new FilterCursor("brand", Operator.NOT_EQUAL, "apple"),
        ];
        const paginationCursor = new PaginationCursor();
        const orderCursor = new OrderCursor("50", "price", OrderCursorType.ASC);
        const criteriaCursor = new CriteriaCursor(
            filters,
            paginationCursor,
            orderCursor
        );

        const selectBody = "*";
        const fromBody = "product";

        const propertiesMap: Map<string, string> = new Map<string, string>([
            ["price", "price"],
            ["category", "category"],
            ["brand", "brand"],
        ]);

        const criteria = new CriteriaCursorToSql(
            criteriaCursor,
            selectBody,
            fromBody
        );
        const querySql = criteria.toSql(propertiesMap);

        expect(querySql).toBeDefined();
        expect(querySql.parameters.length).toEqual(3);
        expect(querySql.parameters).toEqual(["electronics", "apple", "50"]);
        expect(querySql.query).toBe(
            "SELECT * FROM product WHERE category = $1 AND brand != $2 AND price > $3 ORDER BY price ASC LIMIT 10"
        );
    });

    it("should get query DESC", () => {
        const paginationCursor = new PaginationCursor();
        const orderCursor = new OrderCursor("100", "price", OrderCursorType.DESC);
        const criteriaCursor = new CriteriaCursor(
            [],
            paginationCursor,
            orderCursor
        );

        const selectBody = "*";
        const fromBody = "product";

        const propertiesMap: Map<string, string> = new Map<string, string>([
            ["price", "price"],
        ]);

        const criteria = new CriteriaCursorToSql(
            criteriaCursor,
            selectBody,
            fromBody
        );
        const querySql = criteria.toSql(propertiesMap);

        expect(querySql).toBeDefined();
        expect(querySql.parameters.length).toEqual(1);
        expect(querySql.parameters).toEqual(["100"]);
        expect(querySql.query).toBe(
            "SELECT * FROM product WHERE price < $1 ORDER BY price DESC LIMIT 10"
        );
    });

    it("should get query with group by", () => {
        const paginationCursor = new PaginationCursor();
        const orderCursor = new OrderCursor("100", "price", OrderCursorType.DESC);
        const criteriaCursor = new CriteriaCursor(
            [],
            paginationCursor,
            orderCursor
        );

        const selectBody = "*";
        const fromBody = "product";
        const groupByBody = "category";

        const propertiesMap: Map<string, string> = new Map<string, string>([
            ["price", "price"],
        ]);

        const criteria = new CriteriaCursorToSql(
            criteriaCursor,
            selectBody,
            fromBody,
            groupByBody
        );
        const querySql = criteria.toSql(propertiesMap);

        expect(querySql).toBeDefined();
        expect(querySql.parameters.length).toEqual(1);
        expect(querySql.parameters).toEqual(["100"]);
        expect(querySql.query).toBe(
            "SELECT * FROM product WHERE price < $1 GROUP BY category ORDER BY price DESC LIMIT 10"
        );
    });


});

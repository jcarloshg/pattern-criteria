"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const criteria_cursor_criteria_cursor_1 = require("@/app/shared/domain/repository/criteria-cursor/criteria-cursor.criteria-cursor");
const filter_cursor_criteria_cursor_1 = require("@/app/shared/domain/repository/criteria-cursor/filter-cursor.criteria-cursor");
const order_cursor_criteria_cursor_1 = require("@/app/shared/domain/repository/criteria-cursor/order-cursor.criteria-cursor");
const pagination_cursor_criteria_cursor_1 = require("@/app/shared/domain/repository/criteria-cursor/pagination-cursor.criteria-cursor");
const criteria_cursor_to_sql_1 = require("@/app/shared/infrastructure/criteria/criteria-cursor-to-sql");
describe("criteria-cursor-to-sql.test", () => {
    it("should get simple query", () => {
        const paginationCursor = new pagination_cursor_criteria_cursor_1.PaginationCursor();
        const orderCursor = new order_cursor_criteria_cursor_1.OrderCursor("50", "price", order_cursor_criteria_cursor_1.OrderCursorType.ASC);
        const criteriaCursor = new criteria_cursor_criteria_cursor_1.CriteriaCursor([], paginationCursor, orderCursor);
        const selectBody = "*";
        const fromBody = "product";
        const propertiesMap = new Map([
            ["price", "price"],
        ]);
        const criteria = new criteria_cursor_to_sql_1.CriteriaCursorToSql(criteriaCursor, selectBody, fromBody);
        const querySql = criteria.toSql(propertiesMap);
        expect(querySql).toBeDefined();
        expect(querySql.parameters.length).toEqual(1);
        expect(querySql.parameters).toEqual(["50"]);
        expect(querySql.query).toBe("SELECT * FROM product WHERE price > $1 ORDER BY price ASC LIMIT 10");
    });
    it("should get query with pageSize in 30", () => {
        const paginationCursor = new pagination_cursor_criteria_cursor_1.PaginationCursor(30);
        const orderCursor = new order_cursor_criteria_cursor_1.OrderCursor("50", "price", order_cursor_criteria_cursor_1.OrderCursorType.ASC);
        const criteriaCursor = new criteria_cursor_criteria_cursor_1.CriteriaCursor([], paginationCursor, orderCursor);
        const selectBody = "*";
        const fromBody = "product";
        const propertiesMap = new Map([
            ["price", "price"],
        ]);
        const criteria = new criteria_cursor_to_sql_1.CriteriaCursorToSql(criteriaCursor, selectBody, fromBody);
        const querySql = criteria.toSql(propertiesMap);
        expect(querySql).toBeDefined();
        expect(querySql.parameters.length).toEqual(1);
        expect(querySql.parameters).toEqual(["50"]);
        expect(querySql.query).toBe("SELECT * FROM product WHERE price > $1 ORDER BY price ASC LIMIT 30");
    });
    it("should get query with multiple filters", () => {
        const filters = [
            new filter_cursor_criteria_cursor_1.FilterCursor("category", filter_cursor_criteria_cursor_1.Operator.EQUAL, "electronics"),
            new filter_cursor_criteria_cursor_1.FilterCursor("brand", filter_cursor_criteria_cursor_1.Operator.NOT_EQUAL, "apple"),
        ];
        const paginationCursor = new pagination_cursor_criteria_cursor_1.PaginationCursor();
        const orderCursor = new order_cursor_criteria_cursor_1.OrderCursor("50", "price", order_cursor_criteria_cursor_1.OrderCursorType.ASC);
        const criteriaCursor = new criteria_cursor_criteria_cursor_1.CriteriaCursor(filters, paginationCursor, orderCursor);
        const selectBody = "*";
        const fromBody = "product";
        const propertiesMap = new Map([
            ["price", "price"],
            ["category", "category"],
            ["brand", "brand"],
        ]);
        const criteria = new criteria_cursor_to_sql_1.CriteriaCursorToSql(criteriaCursor, selectBody, fromBody);
        const querySql = criteria.toSql(propertiesMap);
        expect(querySql).toBeDefined();
        expect(querySql.parameters.length).toEqual(3);
        expect(querySql.parameters).toEqual(["electronics", "apple", "50"]);
        expect(querySql.query).toBe("SELECT * FROM product WHERE category = $1 AND brand != $2 AND price > $3 ORDER BY price ASC LIMIT 10");
    });
    it("should get query DESC", () => {
        const paginationCursor = new pagination_cursor_criteria_cursor_1.PaginationCursor();
        const orderCursor = new order_cursor_criteria_cursor_1.OrderCursor("100", "price", order_cursor_criteria_cursor_1.OrderCursorType.DESC);
        const criteriaCursor = new criteria_cursor_criteria_cursor_1.CriteriaCursor([], paginationCursor, orderCursor);
        const selectBody = "*";
        const fromBody = "product";
        const propertiesMap = new Map([
            ["price", "price"],
        ]);
        const criteria = new criteria_cursor_to_sql_1.CriteriaCursorToSql(criteriaCursor, selectBody, fromBody);
        const querySql = criteria.toSql(propertiesMap);
        expect(querySql).toBeDefined();
        expect(querySql.parameters.length).toEqual(1);
        expect(querySql.parameters).toEqual(["100"]);
        expect(querySql.query).toBe("SELECT * FROM product WHERE price < $1 ORDER BY price DESC LIMIT 10");
    });
    it("should get query with group by", () => {
        const paginationCursor = new pagination_cursor_criteria_cursor_1.PaginationCursor();
        const orderCursor = new order_cursor_criteria_cursor_1.OrderCursor("100", "price", order_cursor_criteria_cursor_1.OrderCursorType.DESC);
        const criteriaCursor = new criteria_cursor_criteria_cursor_1.CriteriaCursor([], paginationCursor, orderCursor);
        const selectBody = "*";
        const fromBody = "product";
        const groupByBody = "category";
        const propertiesMap = new Map([
            ["price", "price"],
        ]);
        const criteria = new criteria_cursor_to_sql_1.CriteriaCursorToSql(criteriaCursor, selectBody, fromBody, groupByBody);
        const querySql = criteria.toSql(propertiesMap);
        expect(querySql).toBeDefined();
        expect(querySql.parameters.length).toEqual(1);
        expect(querySql.parameters).toEqual(["100"]);
        expect(querySql.query).toBe("SELECT * FROM product WHERE price < $1 GROUP BY category ORDER BY price DESC LIMIT 10");
    });
});
//# sourceMappingURL=criteria-cursor-to-sql.test.js.map
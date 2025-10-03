import { CriteriaCursor } from "@/app/shared/domain/repository/criteria-cursor/criteria-cursor.criteria-cursor";
import { OrderCursor, OrderCursorType } from "@/app/shared/domain/repository/criteria-cursor/order-cursor.criteria-cursor";
import { PaginationCursor } from "@/app/shared/domain/repository/criteria-cursor/pagination-cursor.criteria-cursor";
import { CriteriaCursorToSql } from "@/app/shared/infrastructure/criteria/criteria-cursor-to-sql";


describe("criteria-cursor-to-sql.test", () => {
    it("should convert criteria to SQL query", () => { });

    const paginationCursor = new PaginationCursor();
    const orderCursor = new OrderCursor("price", OrderCursorType.ASC);
    const criteriaCursor = new CriteriaCursor([], paginationCursor, orderCursor);

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
    const queryString = querySql.query;

    expect(queryString).toBe("SELECT * FROM product WHERE price > $1 ORDER BY price ASC LIMIT 10");
});

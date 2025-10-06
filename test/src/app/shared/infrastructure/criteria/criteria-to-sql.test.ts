import { Criteria } from "@/app/shared/domain/repository/criteria/criteria.criteria";
import {
    Filter,
    Operator,
} from "@/app/shared/domain/repository/criteria/filter.criteria";
import {
    Order,
    OrderType,
} from "@/app/shared/domain/repository/criteria/order.criteria";
import { Pagination } from "@/app/shared/domain/repository/criteria/pagination.criteria";
import { CriteriaToSql } from "@/app/shared/infrastructure/criteria/criteria-to-sql";

describe("criteria-to-sql.test", () => {
    it("should get simple query", () => {
        const expectedQuery = "SELECT * FROM product;";
        const order = new Order("", OrderType.NONE);
        const pagination = new Pagination(1, 10);
        const criteria = new Criteria([], order, pagination);

        const parameterizedQuery = new CriteriaToSql()
            .buildSelect(["*"])
            .buildFrom("product")
            .buildWhere(criteria)
            .getResult();

        expect(parameterizedQuery).toBeDefined();
        expect(parameterizedQuery.query).toBe(expectedQuery);
        expect(parameterizedQuery.parameters.length).toEqual(0);
    });


    it("should be query with name selected", () => {
        const expectedQuery = "SELECT name FROM product;";
        const order = new Order("", OrderType.NONE);
        const pagination = new Pagination(1, 10);
        const criteria = new Criteria([], order, pagination);

        const parameterizedQuery = new CriteriaToSql()
            .buildSelect(["name"])
            .buildFrom("product")
            .buildWhere(criteria)
            .getResult();

        expect(parameterizedQuery).toBeDefined();
        expect(parameterizedQuery.query).toBe(expectedQuery);
        expect(parameterizedQuery.parameters.length).toEqual(0);
    });


    it("should be query with name & price selected", () => {
        const expectedQuery = "SELECT name, price FROM product;";
        const order = new Order("", OrderType.NONE);
        const pagination = new Pagination(1, 10);
        const criteria = new Criteria([], order, pagination);

        const parameterizedQuery = new CriteriaToSql()
            .buildSelect(["name", "price"])
            .buildFrom("product")
            .buildWhere(criteria)
            .getResult();

        expect(parameterizedQuery).toBeDefined();
        expect(parameterizedQuery.query).toBe(expectedQuery);
        expect(parameterizedQuery.parameters.length).toEqual(0);
    });

    it("should get simple pagination", () => {
        const expectedQuery = "SELECT * FROM product LIMIT 10 OFFSET 0;";
        const order = new Order("", OrderType.NONE);
        const pagination = new Pagination(1, 10);
        const criteria = new Criteria([], order, pagination);

        const parameterizedQuery = new CriteriaToSql()
            .buildSelect(["*"])
            .buildFrom("product")
            .buildWhere(criteria)
            .buildPagination(criteria)
            .getResult();

        expect(parameterizedQuery).toBeDefined();
        expect(parameterizedQuery.query).toBe(expectedQuery);
        expect(parameterizedQuery.parameters.length).toEqual(0);
    });

    it("should get simple pagination page 1 pageSize 10", () => {
        const expectedQuery = "SELECT * FROM product LIMIT 10 OFFSET 0;";
        const order = new Order("", OrderType.NONE);
        const pagination = new Pagination(1, 10);
        const criteria = new Criteria([], order, pagination);

        const parameterizedQuery = new CriteriaToSql()
            .buildSelect(["*"])
            .buildFrom("product")
            .buildWhere(criteria)
            .buildPagination(criteria)
            .getResult();

        expect(parameterizedQuery).toBeDefined();
        expect(parameterizedQuery.query).toBe(expectedQuery);
        expect(parameterizedQuery.parameters.length).toEqual(0);
    });
    it("should get simple pagination page 2 pageSize 10", () => {
        const expectedQuery = "SELECT * FROM product LIMIT 10 OFFSET 10;";
        const order = new Order("", OrderType.NONE);
        const pagination = new Pagination(2, 10);
        const criteria = new Criteria([], order, pagination);

        const parameterizedQuery = new CriteriaToSql()
            .buildSelect(["*"])
            .buildFrom("product")
            .buildWhere(criteria)
            .buildPagination(criteria)
            .getResult();

        expect(parameterizedQuery).toBeDefined();
        expect(parameterizedQuery.query).toBe(expectedQuery);
        expect(parameterizedQuery.parameters.length).toEqual(0);
    });

    it("should get simple LEFT JOIN & RIGHT JOIN", () => {
        const expectedQuery = `
            SELECT *
            FROM product
                LEFT JOIN brand ON product.brand_id = brand.uuid
                RIGHT JOIN category ON product.category_id = category.uuid
            LIMIT 10
            OFFSET
                0;
        `.trim()
            .replace(/\n+/g, ' ')
            .replace(/\t+/g, '')
            .replace(/\s+/g, ' ')
            ;
        const order = new Order("", OrderType.NONE);
        const pagination = new Pagination(1, 10);
        const criteria = new Criteria([], order, pagination);

        const parameterizedQuery = new CriteriaToSql()
            .buildSelect(["*"])
            .buildFrom("product")
            .addJoin("LEFT JOIN", "brand", "product.brand_id", "brand.uuid")
            .addJoin("RIGHT JOIN", "category", "product.category_id", "category.uuid")
            .buildWhere(criteria)
            .buildPagination(criteria)
            .getResult();

        expect(parameterizedQuery).toBeDefined();
        expect(parameterizedQuery.query).toBe(expectedQuery);
        expect(parameterizedQuery.parameters.length).toEqual(0);
    });

    it("should get GROUP BY price && rating", () => {
        const expectedQuery = `
            SELECT product.price, product.rating, COUNT(product.uuid) AS product_count
            FROM product
                LEFT JOIN brand ON product.brand_id = brand.uuid
                RIGHT JOIN category ON product.category_id = category.uuid
            GROUP BY
                product.price,
                product.rating
            ORDER BY product.price ASC
            LIMIT 10
            OFFSET
                0;
        `.trim()
            .replace(/\n+/g, ' ')
            .replace(/\t+/g, '')
            .replace(/\s+/g, ' ')
            ;
        const order = new Order("product.price", OrderType.ASC);
        const pagination = new Pagination(1, 10);
        const criteria = new Criteria([], order, pagination);

        const parameterizedQuery = new CriteriaToSql()
            .buildSelect(["product.price", "product.rating", "COUNT(product.uuid) AS product_count"])
            .buildFrom("product")
            .addJoin("LEFT JOIN", "brand", "product.brand_id", "brand.uuid")
            .addJoin("RIGHT JOIN", "category", "product.category_id", "category.uuid")
            .buildWhere(criteria)
            .buildOrderBy(criteria)
            .buildPagination(criteria)
            .addGroupBy(["product.price", "product.rating"])
            .getResult();

        expect(parameterizedQuery).toBeDefined();
        expect(parameterizedQuery.query).toBe(expectedQuery);
        expect(parameterizedQuery.parameters.length).toEqual(0);
    });

});

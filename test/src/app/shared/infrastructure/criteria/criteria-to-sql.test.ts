import { Criteria } from "@/app/shared/domain/repository/criteria/criteria.criteria";
import { Filter } from "@/app/shared/domain/repository/criteria/filter.criteria";
import { Operator } from "@/app/shared/domain/repository/criteria/operator.criteria";
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
        `
            .trim()
            .replace(/\n+/g, " ")
            .replace(/\t+/g, "")
            .replace(/\s+/g, " ");
        const order = new Order("", OrderType.NONE);
        const pagination = new Pagination(1, 10);
        const criteria = new Criteria([], order, pagination);

        const parameterizedQuery = new CriteriaToSql()
            .buildSelect(["*"])
            .buildFrom("product")
            .addJoin("LEFT JOIN", "brand", "product.brand_id", "brand.uuid")
            .addJoin("RIGHT JOIN", "category", "product.category_id", "category.uuid")
            .buildPagination(criteria)
            .getResult();

        expect(parameterizedQuery).toBeDefined();
        expect(parameterizedQuery.query).toBe(expectedQuery);
        expect(parameterizedQuery.parameters.length).toEqual(0);
    });

    it("should get query with unique filter", () => {
        const expectedQuery = `
            SELECT product.uuid, product.price, brand.name, category.name, product.rating, COUNT(product.uuid) AS product_count
            FROM product
                LEFT JOIN brand ON product.brand_id = brand.uuid
                RIGHT JOIN category ON product.category_id = category.uuid
            WHERE
                lower(brand.name) LIKE lower(%Puma%)
            GROUP BY
                product.uuid,
                brand.uuid,
                category.uuid
            ORDER BY product.price ASC
            LIMIT 10
            OFFSET
                0;
        `
            .trim()
            .replace(/\n+/g, " ")
            .replace(/\t+/g, "")
            .replace(/\s+/g, " ");
        const order = new Order("product.price", OrderType.ASC);
        const pagination = new Pagination(1, 10);
        const filters: Filter[] = [
            new Filter("brandName", Operator.fromType("CONTAINS"), ["Puma"]),
        ];
        const criteria = new Criteria(filters, order, pagination);

        const propertiesMap: Map<string, string> = new Map([
            ["brandName", "brand.name"],
        ]);

        const parameterizedQuery = new CriteriaToSql()
            .buildSelect([
                "product.uuid",
                "product.price",
                "brand.name",
                "category.name",
                "product.rating",
                "COUNT(product.uuid) AS product_count",
            ])
            .buildFrom("product")
            .addJoin("LEFT JOIN", "brand", "product.brand_id", "brand.uuid")
            .addJoin("RIGHT JOIN", "category", "product.category_id", "category.uuid")
            .buildWhere(criteria, propertiesMap)
            .buildOrderBy(criteria)
            .buildPagination(criteria)
            .addGroupBy(["product.uuid", "brand.uuid", "category.uuid"])
            .getResult();

        expect(parameterizedQuery).toBeDefined();
        expect(parameterizedQuery.parameters.length).toBeGreaterThan(0);
        let queryFormatted = parameterizedQuery.query;
        parameterizedQuery.parameters.forEach((param, index) => {
            queryFormatted = queryFormatted.replace(`$${index + 1}`, `${param}`);
        });
        expect(queryFormatted).toBe(expectedQuery);
    });

    it("should get query with two filters", () => {
        const expectedQuery = `
            SELECT product.uuid, product.price, brand.name, category.name, product.rating, COUNT(product.uuid) AS product_count
            FROM product
                LEFT JOIN brand ON product.brand_id = brand.uuid
                RIGHT JOIN category ON product.category_id = category.uuid
            WHERE
                lower(brand.name) LIKE lower(%Puma%)
                AND product.price >= 50
            GROUP BY
                product.uuid,
                brand.uuid,
                category.uuid
            ORDER BY product.price ASC
            LIMIT 10
            OFFSET
                0;
        `
            .trim()
            .replace(/\n+/g, " ")
            .replace(/\t+/g, "")
            .replace(/\s+/g, " ");
        const order = new Order("product.price", OrderType.ASC);
        const pagination = new Pagination(1, 10);
        const filters: Filter[] = [
            new Filter("brandName", Operator.fromType("CONTAINS"), ["Puma"]),
            new Filter("price", Operator.fromType("GTOE"), ["50"]),
        ];
        const criteria = new Criteria(filters, order, pagination);

        const propertiesMap: Map<string, string> = new Map([
            ["brandName", "brand.name"],
            ["price", "product.price"],
        ]);

        const parameterizedQuery = new CriteriaToSql()
            .buildSelect([
                "product.uuid",
                "product.price",
                "brand.name",
                "category.name",
                "product.rating",
                "COUNT(product.uuid) AS product_count",
            ])
            .buildFrom("product")
            .addJoin("LEFT JOIN", "brand", "product.brand_id", "brand.uuid")
            .addJoin("RIGHT JOIN", "category", "product.category_id", "category.uuid")
            .buildWhere(criteria, propertiesMap)
            .buildOrderBy(criteria)
            .buildPagination(criteria)
            .addGroupBy(["product.uuid", "brand.uuid", "category.uuid"])
            .getResult();

        expect(parameterizedQuery).toBeDefined();
        expect(parameterizedQuery.parameters.length).toBeGreaterThan(0);
        let queryFormatted = parameterizedQuery.query;
        parameterizedQuery.parameters.forEach((param, index) => {
            queryFormatted = queryFormatted.replace(`$${index + 1}`, `${param}`);
        });
        expect(queryFormatted).toBe(expectedQuery);
    });

    it("should get query with nested filters", () => {
        const expectedQuery = `
            SELECT product.uuid, product.price, brand.name, category.name, product.rating, COUNT(product.uuid) AS product_count
            FROM product
                LEFT JOIN brand ON product.brand_id = brand.uuid
                RIGHT JOIN category ON product.category_id = category.uuid
            WHERE 
                (lower(brand.name) LIKE lower(%Puma%) OR lower(brand.name) LIKE lower(%Adidas%))
                AND (lower(category.name) LIKE lower(%Elec%) OR lower(category.name) LIKE lower(%Toys%))
                AND product.price > 10
            GROUP BY
                product.uuid,
                brand.uuid,
                category.uuid
            ORDER BY product.price ASC
            LIMIT 15
            OFFSET
                0;
        `
            .trim()
            .replace(/\n+/g, " ")
            .replace(/\t+/g, "")
            .replace(/\s+/g, " ");
        const order = new Order("product.price", OrderType.ASC);
        const pagination = new Pagination(1, 15);
        const filters: Filter[] = [
            new Filter("brandName", Operator.fromType("CONTAINS"), ["Puma", "Adidas"]),
            new Filter("categoryName", Operator.fromType("CONTAINS"), ["Elec", "Toys"]),
            new Filter("price", Operator.fromType("GT"), ["10"]),
        ];
        const criteria = new Criteria(filters, order, pagination);

        const propertiesMap: Map<string, string> = new Map([
            ["brandName", "brand.name"],
            ["price", "product.price"],
            ["categoryName", "category.name"],
        ]);

        const parameterizedQuery = new CriteriaToSql()
            .buildSelect([
                "product.uuid",
                "product.price",
                "brand.name",
                "category.name",
                "product.rating",
                "COUNT(product.uuid) AS product_count",
            ])
            .buildFrom("product")
            .addJoin("LEFT JOIN", "brand", "product.brand_id", "brand.uuid")
            .addJoin("RIGHT JOIN", "category", "product.category_id", "category.uuid")
            .buildWhere(criteria, propertiesMap)
            .buildOrderBy(criteria)
            .buildPagination(criteria)
            .addGroupBy(["product.uuid", "brand.uuid", "category.uuid"])
            .getResult();

        expect(parameterizedQuery).toBeDefined();
        expect(parameterizedQuery.parameters.length).toBeGreaterThan(0);
        let queryFormatted = parameterizedQuery.query;
        parameterizedQuery.parameters.forEach((param, index) => {
            queryFormatted = queryFormatted.replace(`$${index + 1}`, `${param}`);
        });
        expect(queryFormatted).toBe(expectedQuery);
    });
});

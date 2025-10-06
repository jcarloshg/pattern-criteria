import { GetAllProductsPostgres } from "@/app/products/infra/postgres/get-all-products.postgres";
import { Criteria } from "@/app/shared/domain/repository/criteria/criteria.criteria";
import { Filter } from "@/app/shared/domain/repository/criteria/filter.criteria";
import { Operator } from "@/app/shared/domain/repository/criteria/operator.criteria";
import {
    Order,
    OrderType,
} from "@/app/shared/domain/repository/criteria/order.criteria";
import { Pagination } from "@/app/shared/domain/repository/criteria/pagination.criteria";
import { postgresManager } from "@/app/shared/infrastructure/database/postgres/postgress-manager";

describe("get-all-products.postgres.test", () => {
    it("should do something", async () => {
        // ─────────────────────────────────────
        // criteria specification
        // ─────────────────────────────────────
        const filters: Filter[] = [
            new Filter("brandName", Operator.fromType("CONTAINS"), ["Puma", "Adidas"]),
            new Filter("categoryName", Operator.fromType("CONTAINS"), ["Elec", "Toys"]),
            new Filter("price", Operator.fromType("GTOE"), ["10"]),
        ];
        const order = new Order("product.price", OrderType.ASC);
        const pagination = new Pagination(1, 15);
        const criteria = new Criteria(filters, order, pagination);

        // ─────────────────────────────────────
        // execution
        // ─────────────────────────────────────
        const getAllProductsPostgres = new GetAllProductsPostgres(postgresManager);
        const res = await getAllProductsPostgres.run(criteria);

        expect(getAllProductsPostgres).toBeDefined();
        expect(res).toBeDefined();
        expect(res.length).toBeGreaterThan(0);
        expect(res.length).toBeLessThanOrEqual(15);
    });
});

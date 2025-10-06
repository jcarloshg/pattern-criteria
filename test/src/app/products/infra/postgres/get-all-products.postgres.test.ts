import { GetAllProductsPostgres } from "@/app/products/infra/postgres/get-all-products.postgres"
import { Criteria } from "@/app/shared/domain/repository/criteria/criteria.criteria";
import { Filter, Operator } from "@/app/shared/domain/repository/criteria/filter.criteria";
import { Order, OrderType } from "@/app/shared/domain/repository/criteria/order.criteria";
import { Pagination } from "@/app/shared/domain/repository/criteria/pagination.criteria";
import { postgresManager } from "@/app/shared/infrastructure/database/postgres/postgress-manager"

describe('get-all-products.postgres.test', () => {
    it('should do something', async () => {

        // ─────────────────────────────────────
        // criteria specification
        // ─────────────────────────────────────
        const filters: Filter[] = [
            new Filter("brandName", Operator.CONTAINS, ["Puma", "Adidas"]),
            new Filter("categoryName", Operator.CONTAINS, ["Elec", "Toys"]),
            new Filter("price", Operator.GET, ["10"]),
        ];
        const order = new Order("product.price", OrderType.ASC);
        const pagination = new Pagination(1, 15);
        const criteria = new Criteria(filters, order, pagination);

        // ─────────────────────────────────────
        // execution
        // ─────────────────────────────────────
        const getAllProductsPostgres = new GetAllProductsPostgres(postgresManager);
        const res = await getAllProductsPostgres.run(criteria);

        expect(res).toBeDefined();
        expect(res.length).toBeGreaterThan(0);
        expect(getAllProductsPostgres).toBeDefined();

    })
})
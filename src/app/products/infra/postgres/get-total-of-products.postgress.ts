import { GetTotalOfProductsRepository } from "@/app/products/domain/repository/get-total-of-products.repository";
import { PostgresManagerType } from "@/app/shared/infrastructure/database/postgres/postgress-manager";

export class GetTotalOfProductsPostgres implements GetTotalOfProductsRepository {
    constructor(
        private readonly PostgresManager: PostgresManagerType
    ) { }

    public async run(): Promise<number> {
        const query = `SELECT COUNT(DISTINCT product.uuid) AS product_count FROM product;`;
        try {
            const result = await this.PostgresManager.runQuery(query);
            return parseInt(result.rows[0].product_count, 10);
        } catch (error) {
            throw error;
        }
    }
}
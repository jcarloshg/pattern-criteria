import { postgresManager, PostgresManagerType } from "@/app/shared/infrastructure/database/postgres/postgress-manager";
import { ProductToRead } from "../../domain/models/product.model";
import { GetAllProductsRepository } from "../../domain/repository/get-all.repository";

export class GetAllProductsPostgres implements GetAllProductsRepository {

    private readonly PostgresManager: PostgresManagerType;

    constructor() {
        this.PostgresManager = postgresManager;
    }

    public async run(): Promise<ProductToRead[]> {
        const query = "SELECT * FROM product;"
        try {
            const result = await this.PostgresManager.runQuery(query);
            console.log(`result.command: `, result.rows);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

}
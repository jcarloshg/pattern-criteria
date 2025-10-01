import { GetAllProductsRepository } from "@/app/products/domain/repository/get-all.repository";
import { GetAllProductsPostgres } from "../infra/postgres/get-all.postgres";

export class GetAllProductsApplication {

    private readonly GetAllProductsRepository: GetAllProductsRepository;

    constructor() {
        this.GetAllProductsRepository = new GetAllProductsPostgres();
    }

    public async run(): Promise<any> {
        try {
            const products = await this.GetAllProductsRepository.run();
            return products;
        } catch (error) {
            return []
        }

    }
}
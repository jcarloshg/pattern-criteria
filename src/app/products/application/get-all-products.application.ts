import { GetAllProductsRepository } from "@/app/products/domain/repository/get-all.repository";
import { GetAllProductsPostgres } from "../infra/postgres/get-all.postgres";
import { Criteria } from "@/app/shared/domain/repository/criteria/criteria.criteria";

export class GetAllProductsApplication {

    private readonly GetAllProductsRepository: GetAllProductsRepository;

    constructor() {
        this.GetAllProductsRepository = new GetAllProductsPostgres();
    }

    public async run(req: GetAllProductsRequest): Promise<any> {
        try {
            const products = await this.GetAllProductsRepository.run();
            return products;
        } catch (error) {
            return []
        }

    }
}

export interface GetAllProductsRequest {
    criteria: Criteria,
    // add the user making the request
    // jwtToken: string
}
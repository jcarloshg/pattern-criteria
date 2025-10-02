import { GetAllProductsRepository } from "@/app/products/domain/repository/get-all-products.repository";
import { GetAllProductsPostgres } from "../infra/postgres/get-all-products.postgres";
import { Criteria } from "@/app/shared/domain/repository/criteria/criteria.criteria";

export class GetAllProductsApplication {

    private readonly GetAllProductsRepository: GetAllProductsRepository;

    constructor() {
        this.GetAllProductsRepository = new GetAllProductsPostgres();
    }

    public async run(req: GetAllProductsRequest): Promise<any> {
        try {
            const { criteria } = req;
            const products = await this.GetAllProductsRepository.run(criteria);
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
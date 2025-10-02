import { GetAllProductsRepository } from "@/app/products/domain/repository/get-all-products.repository";
import { Criteria } from "@/app/shared/domain/repository/criteria/criteria.criteria";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { ProductToRead } from "../domain/models/product.model";

export interface GetAllProductsRequest {
    criteria: Criteria;
    // add the user making the request
    // jwtToken: string
}

export class GetAllProductsApplication {
    private readonly GetAllProductsRepository: GetAllProductsRepository;

    constructor(getAllProductsRepository: GetAllProductsRepository) {
        this.GetAllProductsRepository = getAllProductsRepository;
    }

    public async run(
        req: GetAllProductsRequest
    ): Promise<CustomResponse<ProductToRead[] | undefined>> {
        try {
            const { criteria } = req;
            const products = await this.GetAllProductsRepository.run(criteria);
            if (products.length === 0) {
                return CustomResponse.notFound("No products found");
            }
            return CustomResponse.ok(products);
        } catch (error) {
            return CustomResponse.badRequest("Error fetching products");
        }
    }
}

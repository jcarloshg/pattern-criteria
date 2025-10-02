import { GetAllProductsRepository } from "@/app/products/domain/repository/get-all-products.repository";
import { Criteria } from "@/app/shared/domain/repository/criteria/criteria.criteria";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { GetTotalOfProductsRepository } from "@/app/products/domain/repository/get-total-of-products.repository";
import { ProductToRead } from "@/app/products/domain/models/product.model";

export interface GetAllProductsRequest {
    criteria: Criteria;
    // add the user making the request
    // jwtToken: string
}

export interface GetAllProductsResponse {
    data: ProductToRead[];
    total: number;
    totalPages: number;
}

export class GetAllProductsApplication {
    constructor(
        private readonly GetAllProductsRepository: GetAllProductsRepository,
        private readonly GetTotalOfProductsRepository: GetTotalOfProductsRepository
    ) { }

    public async run(
        req: GetAllProductsRequest
    ): Promise<CustomResponse<GetAllProductsResponse | undefined>> {
        try {
            const { criteria } = req;
            const products = await this.GetAllProductsRepository.run(criteria);
            if (products.length === 0) {
                return CustomResponse.notFound("No products found");
            }

            const totalProducts = await this.GetTotalOfProductsRepository.run();
            const pageSize = criteria.pagination.pageSize;
            const totalPages = Math.ceil(totalProducts / pageSize);
            const resp: GetAllProductsResponse = {
                data: products,
                total: totalProducts,
                totalPages: totalPages
            }
            return CustomResponse.ok(resp, "Products fetched successfully");
        } catch (error) {
            return CustomResponse.badRequest("Error fetching products");
        }
    }
}

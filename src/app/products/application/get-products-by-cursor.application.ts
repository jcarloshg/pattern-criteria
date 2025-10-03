import { ProductToRead } from "@/app/products/domain/models/product.model";
import {
    GetAllProductsByCursorRepository,
    GetAllProductsRepository,
} from "@/app/products/domain/repository/get-all-products.repository";
import { GetTotalOfProductsRepository } from "@/app/products/domain/repository/get-total-of-products.repository";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { CriteriaCursor } from "@/app/shared/domain/repository/criteria-cursor/criteria-cursor.criteria-cursor";

export interface GetProductsByCursorRequest {
    criteria: CriteriaCursor;
}

export interface GetProductsByCursorResponse {
    data: ProductToRead[];
    cursor: {
        value: string;
        direction: string;
        pageSize: number;
    };
}

export class GetProductsByCursorApplication {
    private readonly GetAllProductsRepository: GetAllProductsByCursorRepository;

    constructor(
        GetAllProductsRepository: GetAllProductsByCursorRepository
    ) {
        this.GetAllProductsRepository = GetAllProductsRepository;
    }

    public async run(
        req: GetProductsByCursorRequest
    ): Promise<CustomResponse<GetProductsByCursorResponse | undefined>> {
        try {
            const { criteria } = req;

            const products = await this.GetAllProductsRepository.run(criteria);

            const criteriaOrder = criteria.order;
            const criteriaPagination = criteria.pagination;
            const resp: GetProductsByCursorResponse = {
                data: products,
                cursor: {
                    value: criteriaOrder.value,
                    direction: criteriaOrder.direction,
                    pageSize: criteriaPagination.pageSize,
                },
            };

            return CustomResponse.ok(resp, "Products fetched successfully");
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
            console.error("Error in GetProductsByCursorApplication:", errorMessage);
            return CustomResponse.badRequest("Error fetching products");
        }
    }
}

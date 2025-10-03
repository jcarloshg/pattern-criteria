import { ProductToRead } from "@/app/products/domain/models/product.model";
import {
    GetAllProductsByCursorRepository,
    GetAllProductsRepository,
} from "@/app/products/domain/repository/get-all-products.repository";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { CriteriaCursor } from "@/app/shared/domain/repository/criteria-cursor/criteria-cursor.criteria-cursor";
import { GetValueRepository } from "@/app/products/domain/repository/get-value.repository";

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
    private readonly GetValueRepository: GetValueRepository;

    constructor(
        GetAllProductsRepository: GetAllProductsByCursorRepository,
        GetValueRepository: GetValueRepository
    ) {
        this.GetAllProductsRepository = GetAllProductsRepository;
        this.GetValueRepository = GetValueRepository;
    }

    public async run(
        req: GetProductsByCursorRequest
    ): Promise<CustomResponse<GetProductsByCursorResponse | undefined>> {
        try {
            const { criteria } = req;
            const criteriaOrder = criteria.order;
            const criteriaPagination = criteria.pagination;

            if (criteriaOrder.value === "") {
                const value = await this.GetValueRepository.run(
                    criteriaOrder.cursor,
                    criteriaOrder.direction
                );
                if (value.length === 0) {
                    return CustomResponse.badRequest("No data found");
                }
                criteriaOrder.value = value;
            }

            const products = await this.GetAllProductsRepository.run(criteria);
            if (products.length === 0) {
                return CustomResponse.badRequest("No data found");
            }

            const lastProduct = products[products.length - 1];
            const value = String(lastProduct[criteriaOrder.cursor as keyof typeof lastProduct]);

            const resp: GetProductsByCursorResponse = {
                data: products,
                cursor: {
                    value: value,
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

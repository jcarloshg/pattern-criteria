import { ProductToRead } from "@/app/products/domain/models/product.model";
import { GetAllProductsByCursorRepository, GetAllProductsRepository } from "@/app/products/domain/repository/get-all-products.repository";
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
    }
}

export class GetProductsByCursorApplication {

    private readonly GetAllProductsRepository: GetAllProductsByCursorRepository;
    private readonly GetTotalOfProductsRepository: GetTotalOfProductsRepository;

    constructor(
        GetAllProductsRepository: GetAllProductsByCursorRepository,
        GetTotalOfProductsRepository: GetTotalOfProductsRepository
    ) {
        this.GetAllProductsRepository = GetAllProductsRepository;
        this.GetTotalOfProductsRepository = GetTotalOfProductsRepository;
    }

    public async run(
        req: GetProductsByCursorRequest
    ): Promise<CustomResponse<GetProductsByCursorResponse | undefined>> {

        try {

            const { criteria } = req;


            const resp: GetProductsByCursorResponse = {
                data: [],
                cursor: {
                    value: "",
                    direction: "ASC",
                    pageSize: 10
                }
            };

            return CustomResponse.ok(resp, "Products fetched successfully");

        } catch (error) {
            return CustomResponse.badRequest("Error fetching products");
        }

    }
}
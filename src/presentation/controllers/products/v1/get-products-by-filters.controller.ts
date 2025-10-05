import { Request, Response } from "express";

import { GetAllProductsApplication } from "@/app/products/application/get-all-products.application";
import { URLSearchToCriteria } from "@/app/shared/infrastructure/criteria/urlsearch-to-criteria";
import { GetAllProductsPostgres } from "@/app/products/infra/postgres/get-all-products.postgres";
import { postgresManager } from "@/app/shared/infrastructure/database/postgres/postgress-manager";
import { CriteriaError } from "@/app/shared/domain/errors/criteria.error";
import { makeResponse } from "@/presentation/utils/make-response";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { GetTotalOfProductsPostgres } from "@/app/products/infra/postgres/get-total-of-products.postgress";

export const getProductsByFilters = async (req: Request, res: Response) => {
    try {

        // init services
        const criteria = URLSearchToCriteria.parse(req);
        const getAllProductsRepo = new GetAllProductsPostgres(postgresManager);
        const getTotalOfProductsRepo = new GetTotalOfProductsPostgres(postgresManager);

        // init and run application
        const getAllProductsApplication = new GetAllProductsApplication(
            getAllProductsRepo,
            getTotalOfProductsRepo
        );
        const productsFound = await getAllProductsApplication.run({
            criteria,
        });

        // send response
        makeResponse(res, productsFound);
        return

    } catch (error) {
        console.error("Error fetching products by filters:", error);
        if (error instanceof CriteriaError) {
            makeResponse(res, CriteriaError.getCustomResponse(error));
            return
        }
        makeResponse(res, CustomResponse.internalServerError());
        return
    }
};

import { Request, Response } from "express";

import { postgresManager } from "@/app/shared/infrastructure/database/postgres/postgress-manager";
import { UrlsearchToCriteriaCursor } from "@/app/shared/infrastructure/criteria/urlsearch-to-criteria-cursor";
import { GetProductsByCursorApplication } from "@/app/products/application/get-products-by-cursor.application";
import { GetProductsByCursorPostgres } from "@/app/products/infra/postgres/get-products-by-cursor.postgres";
import { makeResponse } from "@/presentation/utils/make-response";
import { CriteriaError } from "@/app/shared/domain/errors/criteria.error";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { GetValuePostgres } from "@/app/products/infra/postgres/get-value.postgres";

export const getProductsByCursor = async (req: Request, res: Response) => {
    try {
        // init criteria cursor
        const searchParams = new URLSearchParams(req.url);
        const criteriaCursor = UrlsearchToCriteriaCursor.parse(searchParams);
        // external services
        const getAllProductsRepo = new GetProductsByCursorPostgres(postgresManager);
        const getValuePostgres = new GetValuePostgres(postgresManager);

        // init use case
        const useCase = new GetProductsByCursorApplication(
            getAllProductsRepo,
            getValuePostgres
        );
        const result = await useCase.run({ criteria: criteriaCursor });

        // send response
        makeResponse(res, result);
        return;
    } catch (error) {
        console.error("Error fetching products by filters:", error);
        if (error instanceof CriteriaError) {
            makeResponse(res, CriteriaError.getCustomResponse(error));
            return;
        }
        makeResponse(res, CustomResponse.internalServerError());
        return;
    }
};

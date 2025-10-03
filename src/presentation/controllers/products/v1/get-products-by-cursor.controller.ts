import { Request, Response } from "express";

import { postgresManager } from "@/app/shared/infrastructure/database/postgres/postgress-manager";
import { GetAllProductsPostgres } from "@/app/products/infra/postgres/get-all-products.postgres";
import { GetTotalOfProductsPostgres } from "@/app/products/infra/postgres/get-total-of-products.postgress";
import { UrlsearchToCriteriaCursor } from "@/app/shared/infrastructure/criteria/urlsearch-to-criteria-cursor";

export const getProductsByCursor = async (req: Request, res: Response) => {

    try {

        const searchParams = new URLSearchParams(req.url);
        const criteriaCursor = UrlsearchToCriteriaCursor.parse(searchParams);
        // external services
        const getAllProductsRepo = new GetAllProductsPostgres(postgresManager);
        const getTotalOfProductsRepo = new GetTotalOfProductsPostgres(postgresManager);


    } catch (error) {

    }

}
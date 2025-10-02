import { Request, Response } from "express";

import { GetAllProductsApplication } from "@/app/products/application/get-all-products.application";
import { URLSearchParamsCriteriaParser } from "@/app/shared/infrastructure/criteria/urlsearchparams-criteria-parser";
import { GetAllProductsPostgres } from "@/app/products/infra/postgres/get-all-products.postgres";
import { postgresManager } from "@/app/shared/infrastructure/database/postgres/postgress-manager";

export const getProductsByFilters = async (req: Request, res: Response) => {
    try {
        // ─────────────────────────────────────
        // init services
        // ─────────────────────────────────────
        const criteria = URLSearchParamsCriteriaParser.parse(req);
        const getAllProductsRepository = new GetAllProductsPostgres(postgresManager);

        // ─────────────────────────────────────
        // init and run application
        // ─────────────────────────────────────
        const getAllProductsApplication = new GetAllProductsApplication(
            getAllProductsRepository
        );
        const productsFound = await getAllProductsApplication.run({
            criteria,
        });

        res
            .status(200)
            .json({ message: "Products fetched successfully", data: productsFound });
    } catch (error) {
        console.error("Error fetching products by filters:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

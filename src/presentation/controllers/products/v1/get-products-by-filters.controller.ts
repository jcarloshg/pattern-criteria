import { Request, Response } from "express";

import { GetAllProductsApplication } from "@/app/products/application/get-all-products.application";
import { URLSearchParamsCriteriaParser } from "@/app/shared/infrastructure/criteria/urlsearchparams-criteria-parser";

export const getProductsByFilters = async (req: Request, res: Response) => {
    try {

        const criteria = URLSearchParamsCriteriaParser.parse(req);

        const getAllProductsApplication = new GetAllProductsApplication();
        const productsFound = await getAllProductsApplication.run({
            criteria
        });

        res
            .status(200)
            .json({ message: "Products fetched successfully", data: productsFound });
    } catch (error) {
        console.error("Error fetching products by filters:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

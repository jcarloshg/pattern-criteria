import { Request, Response } from "express";

import { GetAllProductsApplication } from "@/app/products/application/get-all.application";

export const getProductsByFilters = async (req: Request, res: Response) => {
    try {
        const getAllProductsApplication = new GetAllProductsApplication();
        // Log query parameters for debugging in a structured way
        console.log(req.url);
        console.log(req.query);
        console.log(req.baseUrl);

        
        const products = await getAllProductsApplication.run();
        res.status(200).json({ message: "Products fetched successfully", data: products });
    } catch (error) {
        console.error("Error fetching products by filters:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

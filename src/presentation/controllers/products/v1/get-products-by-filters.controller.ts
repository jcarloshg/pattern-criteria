import { GetAllProductsApplication } from "@/app/products/application/get-all.application";
import { Request, Response } from "express";

export const getProductsByFilters = async (req: Request, res: Response) => {
    try {
        const getAllProductsApplication = new GetAllProductsApplication();
        const products = await getAllProductsApplication.run();
        res.status(200).json({ message: "Products fetched successfully", data: products });
    } catch (error) {
        console.error("Error fetching products by filters:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

import { Request, Response } from "express";

/**
 * Controller for getting products by filters.
 * @param req - Express request object
 * @param res - Express response object
 */
export const getProductsByFilters = async (req: Request, res: Response) => {
    try {
        console.log(`req:`, req.query);
        res.status(200).json({ message: "Products fetched successfully" });
    } catch (error) {
        console.error("Error fetching products by filters:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

import { Express, Router, Request, Response, NextFunction } from "express";

import { getProductsByFilters } from "@/presentation/controllers/products/v1/get-products-by-filters.controller";

export const registerProductRoutesV1 = (app: Express) => {

    const router = Router();

    router.get("/", getProductsByFilters);

    app.use("/api/products/v1", router);

}



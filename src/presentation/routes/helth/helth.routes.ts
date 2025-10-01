import { Express, Router, Request, Response } from "express";

import { enviromentVariables } from "@/app/shared/infrastructure/utils/enviroment-variables";

export const registerHealthRoutes = (app: Express) => {
    const router = Router();

    router.get("/", (req: Request, res: Response) => {
        res.json({
            message: "Welcome to the API",
        });
    });

    router.get("/health", (req: Request, res: Response) => {
        res.json({
            status: "OK",
            timestamp: new Date().toISOString(),
            environment: enviromentVariables.nodeEnv,
            version: process.env.npm_package_version || "1.0.0",
        });
    });

    app.use("/api", router);
};
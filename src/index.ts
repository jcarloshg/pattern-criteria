import express from "express";
import cors from "cors";
import { enviromentVariables } from "@/app/infrastructure/utils/enviroment-variables";
import { registerProductRoutesV1 } from "@/presentation/routes/products/products.v1.routes";
import { registerHealthRoutes } from "./presentation/routes/helth/helth.routes";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: enviromentVariables.cors.origin,
        credentials: enviromentVariables.cors.credentials,
    })
);

// ─────────────────────────────────────
// add routes here
// ─────────────────────────────────────
registerProductRoutesV1(app);
registerHealthRoutes(app);

// Start server
const PORT = enviromentVariables.port;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📖 Environment: ${enviromentVariables.nodeEnv}`);
});

export default app;

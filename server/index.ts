import "dotenv/config";
import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { createServer as createViteServer } from "vite";

async function startServer() {
    const app = express();
    app.use(cors());
    app.use(express.json());

    // API Routes
    app.use(
        "/api/trpc",
        createExpressMiddleware({
            router: appRouter,
            createContext,
        })
    );

    // Vite Middleware (Frontend)
    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
    });
    app.use(vite.middlewares);

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}

startServer();

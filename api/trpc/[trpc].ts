import { createHTTPHandler } from "@trpc/server/adapters/node-http";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";

// Vercel / Next.js API handler
export default createHTTPHandler({
    router: appRouter,
    createContext,
    onError: ({ error, path }) => {
        console.error(`TRPC Error on '${path}':`, error);
    },
});

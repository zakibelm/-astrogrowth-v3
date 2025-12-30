import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../server/routers";

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
    links: [
        httpBatchLink({
            url: "/api/trpc",
            fetch(url, options) {
                return fetch(url, {
                    ...options,
                    credentials: "include",
                }).then(async (res) => {
                    const clone = res.clone();
                    const text = await clone.text();
                    console.log("[TRPC Client] Raw response:", text);
                    return res;
                });
            },
        }),
    ],
});

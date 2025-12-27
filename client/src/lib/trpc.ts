// Mock TRPC for frontend-only preview
const noop = () => { };

function createProxy(path: string[] = []): any {
    return new Proxy(noop, {
        get(_target, prop) {
            if (typeof prop !== "string") return undefined;

            // Handle top-level exports
            if (path.length === 0) {
                if (prop === "Provider") {
                    return ({ children }: any) => children;
                }
                if (prop === "createClient") {
                    return () => ({});
                }
            }

            return createProxy([...path, prop]);
        },
        apply(_target, _this, _args) {
            const lastProp = path[path.length - 1];

            if (lastProp === "useQuery") {
                const isMeQuery = path.includes("auth") && path.includes("me");
                return {
                    data: isMeQuery ? { id: "demo-user", email: "demo@astrogrowth.com", role: "admin" } : undefined,
                    isLoading: false,
                    error: null,
                    refetch: noop,
                };
            }

            if (lastProp === "useMutation") {
                return { mutate: noop, mutateAsync: async () => { }, isLoading: false };
            }

            if (lastProp === "useContext" || lastProp === "useUtils") {
                return { invalidate: noop };
            }

            return undefined;
        },
    });
}

export const trpc = createProxy();

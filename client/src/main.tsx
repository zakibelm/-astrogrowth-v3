import { trpc } from "@/lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n/config";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

// Mock client for the provider
const trpcClient = trpc.createClient();

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors closeButton />
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);

import { trpc } from "@/lib/trpc";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const { data: user, isLoading, error } = trpc.auth.me.useQuery(undefined, {
        retry: false,
        refetchOnWindowFocus: false,
    });
    const [, setLocation] = useLocation();

    useEffect(() => {
        // If query finishes loading and there's no user (or error), redirect to login
        if (!isLoading && (!user || error)) {
            setLocation("/auth");
        }
    }, [user, isLoading, error, setLocation]);

    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground animate-pulse">Vérification de l'accréditation...</p>
                </div>
            </div>
        );
    }

    // If we have a user, render the protected content
    if (user) {
        return <>{children}</>;
    }

    // Should assume redirect happens in useEffect, render nothing or basic loader while redirecting
    return null;
}

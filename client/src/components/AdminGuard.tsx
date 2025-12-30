import { trpc } from "@/lib/trpc";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

interface AdminGuardProps {
    children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
    const { data: user, isLoading, error } = trpc.auth.me.useQuery(undefined, {
        retry: false,
        refetchOnWindowFocus: false,
    });
    const [, setLocation] = useLocation();

    useEffect(() => {
        if (!isLoading) {
            if (!user || error) {
                // Not logged in
                setLocation("/auth");
            } else if (user.role !== 'admin') {
                // Logged in but not admin
                toast.error("Accès refusé. Privilèges administrateur requis.");
                setLocation("/dashboard");
            }
        }
    }, [user, isLoading, error, setLocation]);

    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                    <p className="text-sm text-muted-foreground animate-pulse">Vérification des privilèges Super Admin...</p>
                </div>
            </div>
        );
    }

    // Only render if user is admin
    if (user && user.role === 'admin') {
        return <>{children}</>;
    }

    return null;
}

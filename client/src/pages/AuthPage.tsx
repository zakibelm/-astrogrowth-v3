import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function AuthPage() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [, setLocation] = useLocation();
    const { t } = useTranslation();

    const loginMutation = trpc.auth.login.useMutation({
        onSuccess: (data) => {
            if (data.isAdmin) {
                toast.success("Bienvenue, Commandant Suprême (Admin).");
            } else {
                toast.success("Authentifié avec succès !");
            }
            // Force reload to pick up the new cookie and auth state
            window.location.href = "/dashboard";
        },
        onError: (error) => {
            toast.error(`Erreur: ${error.message}`);
            setLoading(false);
        }
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Veuillez entrer une adresse email");
            return;
        }

        setLoading(true);
        loginMutation.mutate({ email, password });
    };

    const handleGoogleLogin = () => {
        // Mock Google Login for demonstration
        toast.info("Redirection vers Google Auth (Simulé)...");
        setTimeout(() => {
            loginMutation.mutate({
                email: "google-user@gmail.com",
                googleIdToken: "mock-google-token-123",
                name: "Utilisateur Google"
            });
        }, 1000);
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />
            </div>

            <div className="relative z-10 w-full max-w-md px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black tracking-tighter text-white mb-2 italic uppercase">
                        Astro<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Growth</span>
                    </h1>
                    <p className="text-slate-400 text-sm">Terminal d'accès sécurisé v.2.0</p>
                </div>

                <Card className="border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl text-white">Connexion</CardTitle>
                        <CardDescription className="text-slate-400">
                            Accès réservé au personnel autorisé.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-200">Identifiant / Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="commander@astrogrowth.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-200">Mot de passe (Admin)</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter className="flex flex-col gap-3">
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Vérification des accréditations...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                        Connexion Sécurisée
                                    </>
                                )}
                            </Button>

                            <div className="relative w-full">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-black/40 px-2 text-slate-500">Ou continuer avec</span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                            >
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Google
                            </Button>
                        </CardFooter>
                    </form>
                    <div className="px-6 pb-6 text-center">
                        <p className="text-xs text-slate-600">
                            En vous connectant, vous acceptez les protocoles de sécurité du Flux Neural.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Rocket, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/stores';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        if (isSignUp) {
            // Mock Signup
            // In a real app, this would call signup(email, password)
            await new Promise(r => setTimeout(r, 1000));
            // Just log them in automatically after "signup"
            const success = await login(email, password); // reuse login for demo
            if (success) {
                navigate(from, { replace: true });
            }
            return;
        }

        const success = await login(email, password);
        if (success) {
            navigate(from, { replace: true });
        } else {
            setError('Email ou mot de passe incorrect');
        }
    };

    const handleDemoLogin = async () => {
        setError('');
        const success = await login('admin@astroleads.com', 'demo');
        if (success) {
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-astro-950 flex">
            {/* Left Side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-astro-gold/10 via-astro-900 to-astro-950" />
                <div className="neon-grid-background" />

                <div className="relative z-10 flex flex-col justify-center px-16">
                    <div className="w-16 h-16 bg-astro-gold/10 border border-astro-gold/20 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                        <Rocket className="text-astro-gold" size={32} />
                    </div>

                    <h1 className="text-5xl font-bold text-white mb-4 neon-text-glow">
                        AstroLeads
                    </h1>

                    <p className="text-xl text-neutral-400 mb-8 max-w-md">
                        La plateforme d'automatisation de prospection B2B propulsée par l'IA
                    </p>

                    <div className="space-y-4">
                        {['Génération de leads automatisée', 'Campagnes email IA', 'Analytics en temps réel'].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 text-neutral-300">
                                <Sparkles className="text-astro-gold" size={16} />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-0 right-0 w-96 h-96 bg-astro-gold/5 rounded-full blur-3xl" />
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="lg:hidden text-center mb-10">
                        <div className="w-12 h-12 bg-astro-gold/10 border border-astro-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                            <Rocket className="text-astro-gold" size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-white neon-text-glow-small">AstroLeads</h1>
                    </div>

                    <div className="neon-glass-card p-8">
                        {/* Tabs */}
                        <div className="flex bg-astro-900/50 p-1 rounded-lg mb-8 border border-astro-800">
                            <button
                                onClick={() => setIsSignUp(false)}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isSignUp ? 'bg-astro-800 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300'
                                    }`}
                            >
                                Se connecter
                            </button>
                            <button
                                onClick={() => setIsSignUp(true)}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isSignUp ? 'bg-astro-800 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300'
                                    }`}
                            >
                                S'inscrire
                            </button>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {isSignUp ? 'Créer un compte' : 'Connexion'}
                            </h2>
                            <p className="text-neutral-500">
                                {isSignUp ? 'Rejoignez la révolution AstroLeads' : 'Accédez à votre espace de prospection'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {isSignUp && (
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Nom"
                                        placeholder="John"
                                    />
                                    <Input
                                        label="Prénom"
                                        placeholder="Doe"
                                    />
                                </div>
                            )}

                            <Input
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="vous@entreprise.com"
                                leftIcon={<Mail size={18} />}
                            />

                            <div className="space-y-2">
                                <Input
                                    label="Mot de passe"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    leftIcon={<Lock size={18} />}
                                />
                                {!isSignUp && (
                                    <div className="flex justify-end">
                                        <button type="button" className="text-xs text-astro-gold hover:text-yellow-400 transition-colors">
                                            Mot de passe oublié ?
                                        </button>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                    {error}
                                </p>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={isLoading}
                                rightIcon={<ArrowRight size={18} />}
                            >
                                {isSignUp ? "S'inscrire gratuitement" : 'Se connecter'}
                            </Button>
                        </form>

                        {!isSignUp && (
                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-astro-700" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-astro-800 px-2 text-neutral-500">Ou</span>
                                    </div>
                                </div>

                                <Button
                                    variant="secondary"
                                    className="w-full mt-4"
                                    onClick={handleDemoLogin}
                                    isLoading={isLoading}
                                >
                                    Accès Démo (admin@astroleads.com)
                                </Button>
                            </div>
                        )}

                        <p className="text-center text-xs text-neutral-500 mt-6">
                            En vous connectant, vous acceptez nos conditions d'utilisation
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

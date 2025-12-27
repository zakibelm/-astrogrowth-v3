
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Check, ArrowRight, Brain, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="relative z-10">
            {/* Header */}
            <header className="container mx-auto px-6 py-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-astro-gold to-yellow-600 flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                        <Rocket className="text-black fill-black" size={24} />
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tight">
                        Astro<span className="text-astro-gold">Leads</span>
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="text-white hover:text-astro-gold" onClick={() => navigate('/login')}>
                        Se connecter
                    </Button>
                    <Button variant="primary" onClick={() => navigate('/login')} rightIcon={<ArrowRight size={16} />}>
                        Essai Gratuit
                    </Button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20 lg:py-32 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-astro-800/50 border border-astro-700 text-astro-gold text-sm font-medium mb-8 animate-fade-in-up">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Nouvelle Version 2.0 Enterprise
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up delay-100">
                    Propulsez votre prospection <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-astro-gold to-yellow-200">
                        à la vitesse de la lumière
                    </span>
                </h1>
                <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
                    La première plateforme d'acquisition B2B pilotée par Intelligence Artificielle.
                    Orchestrez des agents autonomes pour trouver, qualifier et convertir vos futurs clients.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                    <Button size="lg" variant="primary" className="w-full sm:w-auto text-lg h-14 px-8" onClick={() => navigate('/login')}>
                        Démarrer la mise en orbite
                    </Button>
                    <Button size="lg" variant="ghost" className="w-full sm:w-auto text-lg h-14 px-8 border border-astro-700 hover:bg-astro-800">
                        Voir la démo
                    </Button>
                </div>
            </section>

            {/* Features Info */}
            <section className="container mx-auto px-6 py-20 border-t border-astro-800/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="p-6 rounded-2xl bg-astro-900/40 border border-astro-800/60 hover:border-astro-gold/30 transition-all group">
                        <div className="w-16 h-16 mx-auto rounded-full bg-astro-gold/10 flex items-center justify-center text-astro-gold mb-6 group-hover:scale-110 transition-transform">
                            <Brain size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Agents Intelligents</h3>
                        <p className="text-neutral-400">
                            Nos agents IA travaillent 24/7 pour scraper LinkedIn, valider des emails et rédiger des messages ultra-personnalisés.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-astro-900/40 border border-astro-800/60 hover:border-astro-gold/30 transition-all group">
                        <div className="w-16 h-16 mx-auto rounded-full bg-astro-gold/10 flex items-center justify-center text-astro-gold mb-6 group-hover:scale-110 transition-transform">
                            <Globe size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Sourcing Global</h3>
                        <p className="text-neutral-400">
                            Accédez à une base de données mondiale. Ciblez par industrie, taille d'entreprise, localisation et technologie.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-astro-900/40 border border-astro-800/60 hover:border-astro-gold/30 transition-all group">
                        <div className="w-16 h-16 mx-auto rounded-full bg-astro-gold/10 flex items-center justify-center text-astro-gold mb-6 group-hover:scale-110 transition-transform">
                            <Zap size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Automatisation Totale</h3>
                        <p className="text-neutral-400">
                            Connectez vos outils favoris (CRM, Slack, Gmail). Laissez Astroleads gérer le pipeline de la découverte au rendez-vous.
                        </p>
                    </div>
                </div>
            </section>

            {/* Social Proof / Stats */}
            <section className="container mx-auto px-6 pb-20 text-center">
                <p className="text-neutral-500 text-sm uppercase tracking-widest mb-8 font-semibold">
                    Ils font confiance à Astroleads
                </p>
                <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Fake Logos for Design */}
                    <div className="text-2xl font-bold font-serif text-white">Acme Corp</div>
                    <div className="text-2xl font-bold font-mono text-white">Globex</div>
                    <div className="text-2xl font-bold text-white italic">Soylent</div>
                    <div className="text-2xl font-bold font-sans text-white">Initech</div>
                    <div className="text-2xl font-bold text-white tracking-widest">UMBRELLA</div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;

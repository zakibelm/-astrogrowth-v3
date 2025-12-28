import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();
  const starsContainerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Star Generation
    if (starsContainerRef.current) {
      starsContainerRef.current.innerHTML = ""; // Clear existing stars
      for (let i = 0; i < 150; i++) {
        const star = document.createElement("div");
        star.className = "star";
        const size = Math.random() * 2 + 0.5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.setProperty("--duration", `${Math.random() * 3 + 2}s`);
        starsContainerRef.current.appendChild(star);
      }
    }

    // Cursor Movement
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current && cursorGlowRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
        cursorGlowRef.current.style.left = `${e.clientX}px`;
        cursorGlowRef.current.style.top = `${e.clientY}px`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    // Intersection Observer for Reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal").forEach((r) => observer.observe(r));

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
    };
  }, []);

  const handleStart = () => {
    setLocation("/dashboard");
  };

  return (
    <div className="landing-page bg-slate-950 text-slate-100 min-h-screen selection:bg-indigo-500/30">
      <div id="custom-cursor" className="hidden lg:block" ref={cursorRef}></div>
      <div id="cursor-glow" className="hidden lg:block" ref={cursorGlowRef}></div>
      <div className="stars-container" ref={starsContainerRef}></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-slate-950/40 backdrop-blur-3xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={handleStart}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)] group-hover:rotate-12 transition-transform">
              <span className="text-xl">🚀</span>
            </div>
            <span className="text-2xl font-black tracking-tighter">
              Astro<span className="text-indigo-500">Growth</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            <a href="#product" className="text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest">
              Le Produit
            </a>
            <a href="#agents" className="text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest">
              48 Agents AI
            </a>
            <a href="#pricing" className="text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest">
              Tarifs
            </a>
            <button
              onClick={handleStart}
              className="px-6 py-2.5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-lg shadow-white/5"
            >
              Démarrer
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-6xl mx-auto">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 reveal">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">
                48 Agents AI • 8 Départements Intégrés
              </span>
            </div>

            <h1 className="text-5xl lg:text-[8rem] font-black leading-[0.95] tracking-tighter title-mask mb-8 reveal" style={{ transitionDelay: "100ms" }}>
              DOMINEZ VOTRE<br />
              <span className="gradient-text">ESPACE DIGITAL</span>
            </h1>

            <p className="text-lg lg:text-2xl text-slate-400 max-w-3xl leading-relaxed mb-12 reveal" style={{ transitionDelay: "200ms" }}>
              Une équipe complète d'agents IA gère votre stratégie, création, publication et analyse. De la planification à l'optimisation, tout est automatisé en 15 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 reveal" style={{ transitionDelay: "300ms" }}>
              <button
                onClick={handleStart}
                className="px-10 py-5 bg-indigo-600 rounded-2xl font-black text-lg lg:text-xl hover:bg-indigo-500 transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)] flex items-center justify-center gap-4 group"
              >
                Prendre les commandes
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </button>
              <button className="px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl font-black text-lg lg:text-xl hover:bg-white/10 transition-all">
                Voir la démo (2 min)
              </button>
            </div>
          </div>

          {/* Dashboard Immersif */}
          <div className="mt-24 relative max-w-5xl mx-auto reveal" style={{ transitionDelay: "400ms" }}>
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full"></div>
            <div className="glass-card rounded-[2.5rem] lg:rounded-[3.5rem] p-6 lg:p-10 shadow-2xl relative">
              <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
                <div className="flex gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/40"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/40"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/40"></div>
                </div>
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">AstroGrowth_Engine_v4.2</div>
              </div>

              <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5 text-center">
                      <div className="text-indigo-400 text-[10px] font-bold uppercase mb-2">Génération</div>
                      <div className="text-3xl font-black">127 posts</div>
                    </div>
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5 text-center">
                      <div className="text-indigo-400 text-[10px] font-bold uppercase mb-2">Engagement</div>
                      <div className="text-3xl font-black">89%</div>
                    </div>
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5 text-center">
                      <div className="text-indigo-400 text-[10px] font-bold uppercase mb-2">Croissance</div>
                      <div className="text-3xl font-black">+47%</div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-[2rem] p-6 lg:p-8 border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-black text-lg uppercase">Agents AI Actifs</h4>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">48 agents synchronisés</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-4 bg-white/5 rounded-2xl flex items-center justify-between border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold">S</div>
                          <div className="text-sm font-bold text-slate-300">Strategy Builder AI</div>
                        </div>
                        <div className="text-[9px] text-indigo-400 font-black">CALCUL...</div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl flex items-center justify-between border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center font-bold">C</div>
                          <div className="text-sm font-bold text-slate-300">Content Generator AI</div>
                        </div>
                        <div className="text-[9px] text-purple-400 font-black">RÉDACTION...</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-indigo-600/10 rounded-[2.5rem] p-8 border border-indigo-500/20 flex flex-col items-center justify-center text-center">
                  <div className="text-5xl mb-6">🛸</div>
                  <h4 className="text-xl font-black mb-3 italic">Pilotage Auto</h4>
                  <p className="text-xs text-slate-400 mb-8 leading-relaxed">Les agents AI gèrent l'entièreté de votre marketing sans intervention humaine.</p>
                  <button onClick={handleStart} className="w-full py-4 bg-indigo-600 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-600/30">
                    Activer le système
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid Pro */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center reveal">
              <div className="text-5xl font-black gradient-text mb-2">48</div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Agents AI Spécialisés</div>
            </div>
            <div className="text-center reveal" style={{ transitionDelay: "100ms" }}>
              <div className="text-5xl font-black gradient-text mb-2">8</div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Départements Complets</div>
            </div>
            <div className="text-center reveal" style={{ transitionDelay: "200ms" }}>
              <div className="text-5xl font-black gradient-text mb-2">100%</div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Processus Automatisé</div>
            </div>
            <div className="text-center reveal" style={{ transitionDelay: "300ms" }}>
              <div className="text-5xl font-black gradient-text mb-2">24/7</div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Disponibilité Totale</div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section (Bento Hybrid) */}
      <section id="agents" className="py-40">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mb-24 reveal">
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter title-mask mb-8 uppercase leading-[0.9]">
              Une équipe complète <br /> <span className="gradient-text">à votre service</span>
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl font-medium">
              48 agents spécialisés répartis en 8 départements travaillent en synergie totale pour propulser votre marque dans l'espace digital.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Strategy */}
            <div className="glass-card rounded-[2.5rem] p-10 reveal">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-xl mb-6 shadow-lg shadow-indigo-600/30">🎯</div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-indigo-400">Strategy</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">6 agents spécialisés en planification stratégique haut niveau.</p>
              <ul className="space-y-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Brand Strategy Builder
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Content Strategy Architect
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Audience Targeting Agent
                </li>
              </ul>
            </div>

            {/* Creative */}
            <div className="glass-card rounded-[2.5rem] p-10 reveal" style={{ transitionDelay: "100ms" }}>
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-xl mb-6 shadow-lg shadow-purple-600/30">🎨</div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-purple-400">Creative</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">6 agents créatifs qui maîtrisent le design et la vidéo par IA.</p>
              <ul className="space-y-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Graphic Design Pro
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Video Editing Engine
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Template Designer
                </li>
              </ul>
            </div>

            {/* Content */}
            <div className="glass-card rounded-[2.5rem] p-10 reveal" style={{ transitionDelay: "200ms" }}>
              <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center text-xl mb-6 shadow-lg shadow-pink-600/30">🖋️</div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-pink-400">Content</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">8 agents rédacteurs capables d'adopter n'importe quel ton.</p>
              <ul className="space-y-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span> Caption Writer AI
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span> SEO Optimizer Agent
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span> Viral Content Creator
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture EVV Section */}
      <section className="py-40 bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-32 reveal">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-600/20 border border-indigo-500/30 mb-6">
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Protocoles de Sécurité</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-tight">
              Architecture <span className="gradient-text">Execute-Verify-Validate</span>
            </h2>
            <p className="text-slate-500 font-bold uppercase text-sm mt-4 tracking-widest">La perfection à chaque octet</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center reveal">
              <div className="w-20 h-20 bg-indigo-600/20 border border-indigo-500/30 rounded-3xl flex items-center justify-center text-4xl font-black mb-10 mx-auto">1</div>
              <h4 className="text-2xl font-black mb-4 uppercase tracking-tighter">Execute</h4>
              <p className="text-slate-400 text-sm leading-relaxed">L'agent spécialisé génère le contenu initial selon les paramètres définis.</p>
            </div>
            <div className="text-center reveal" style={{ transitionDelay: "100ms" }}>
              <div className="w-20 h-20 bg-purple-600/20 border border-purple-500/30 rounded-3xl flex items-center justify-center text-4xl font-black mb-10 mx-auto">2</div>
              <h4 className="text-2xl font-black mb-4 uppercase tracking-tighter">Verify</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Un second agent analyse la qualité, la cohérence et le ton pour une précision totale.</p>
            </div>
            <div className="text-center reveal" style={{ transitionDelay: "200ms" }}>
              <div className="w-20 h-20 bg-pink-600/20 border border-pink-500/30 rounded-3xl flex items-center justify-center text-4xl font-black mb-10 mx-auto">3</div>
              <h4 className="text-2xl font-black mb-4 uppercase tracking-tighter">Validate</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Validation finale avant distribution automatique sur vos plateformes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Space Style */}
      <section id="pricing" className="py-40">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24 reveal">
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase mb-6">
              Investissez dans <br /> <span className="gradient-text">votre futur</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto items-center">
            {/* Plan Pro */}
            <div className="glass-card rounded-[3rem] p-12 reveal">
              <div className="mb-10">
                <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest mb-2">Pro</h3>
                <div className="text-6xl font-black mb-4">
                  149$ <span className="text-sm font-medium text-slate-500">/mo</span>
                </div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Pour les entrepreneurs solo</p>
              </div>
              <ul className="space-y-4 mb-12 text-sm text-slate-400 font-medium">
                <li className="flex items-center gap-3">✓ 30 posts par mois</li>
                <li className="flex items-center gap-3">✓ Tous les 48 agents AI</li>
                <li className="flex items-center gap-3">✓ 3 plateformes sociales</li>
              </ul>
              <button
                onClick={handleStart}
                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Choisir Pro
              </button>
            </div>

            {/* Plan Business (Highlight) */}
            <div className="glass-card rounded-[3rem] p-12 border-indigo-500/50 bg-indigo-600/5 relative scale-110 shadow-[0_40px_100px_-30px_rgba(79,70,229,0.3)] reveal" style={{ transitionDelay: "100ms" }}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                Le Plus Populaire
              </div>
              <div className="mb-10">
                <h3 className="text-xl font-bold text-indigo-400 uppercase tracking-widest mb-2 italic">Business</h3>
                <div className="text-6xl font-black mb-4">
                  499$ <span className="text-sm font-medium text-slate-500">/mo</span>
                </div>
                <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest">Pour les PME en croissance</p>
              </div>
              <ul className="space-y-4 mb-12 text-sm text-slate-300 font-medium">
                <li className="flex items-center gap-3 italic">✓ 100 posts par mois</li>
                <li className="flex items-center gap-3">✓ Plateformes illimitées</li>
                <li className="flex items-center gap-3">✓ Account Manager Dédié</li>
                <li className="flex items-center gap-3 font-black text-indigo-400">✓ Priorité de Calcul IA</li>
              </ul>
              <button
                onClick={handleStart}
                className="w-full py-5 bg-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 shadow-xl transition-all"
              >
                Prendre le Contrôle
              </button>
            </div>

            {/* Plan Enterprise */}
            <div className="glass-card rounded-[3rem] p-12 reveal" style={{ transitionDelay: "200ms" }}>
              <div className="mb-10">
                <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">Elite</h3>
                <div className="text-4xl font-black mb-4 text-center">SUR MESURE</div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest text-center">Pour les grandes organisations</p>
              </div>
              <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                Nous Contacter
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Elite */}
      <footer className="py-32 border-t border-white/5 relative z-10">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row justify-between items-center gap-16">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl">🚀</div>
              <span className="text-3xl font-black tracking-tighter italic uppercase">AstroGrowth</span>
            </div>
            <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.4em]">Le Futur du Marketing Est Arrivé</p>
          </div>

          <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            <a href="#" className="hover:text-white transition-colors">
              Univers
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Vaisseau
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Missions
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Statu
            </a>
          </div>

          <div className="text-center lg:text-right">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 italic">Design Excellence</p>
            <div className="text-sm font-black text-slate-400">
              Propulsé avec précision par <span className="gradient-text font-black italic">Zakibelm</span>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-16 text-center text-[9px] text-slate-700 font-bold uppercase tracking-[0.5em]">
          © 2025 AstroGrowth Space Systems - Tous droits réservés
        </div>
      </footer>
    </div>
  );
}

import { useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Footer from "@/components/landing/Footer";
import "./Home.css";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const starsContainerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();

  // Data for Vortex
  const polesData = [
    { icon: "🎯", name: "Strategy Unit" }, { icon: "🖋️", name: "Content Core" },
    { icon: "🎨", name: "Creative Lab" }, { icon: "🛰️", name: "Distro Node" },
    { icon: "📊", name: "Oracle Data" }, { icon: "💬", name: "Comm Hub" },
    { icon: "⚡", name: "Perf Tuning" }, { icon: "🧠", name: "Core Brain" }
  ];
  const agentNames = [
    "Market Sniper", "Neural Writer", "Ad Oracle", "Sync Master", "Trend Scout", "Story Architect",
    "Lead Hunter", "Visual Synth", "ROI Master", "Logic Hub", "Brand Scout", "Audit Unit",
    "Conversion AI", "Vibe Checker", "SEO Master", "Growth Bot"
  ];

  useGSAP(() => {
    // --- STARS ---
    if (starsContainerRef.current) {
      starsContainerRef.current.innerHTML = "";
      for (let i = 0; i < 120; i++) {
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

    // --- VORTEX GENERATOR ---
    const generateVortex = (containerId: string, data: any[], count: number, isPoles = false) => {
      const container = document.getElementById(containerId);
      if (!container) return;

      // Clean up previous cards if any (for HMR)
      container.innerHTML = "";

      for (let i = 0; i < count; i++) {
        const item = data[i % data.length];
        const card = document.createElement('div');
        card.className = 'neural-card';
        card.innerHTML = isPoles ? `<b>0${(i % 8) + 1}</b><span>${item.icon} ${item.name}</span>` : `<b>AI</b><span>${item}</span>`;
        // Centering fix for absolute positioning
        card.style.left = "50%";
        card.style.top = "50%";
        // Styles for agents
        if (!isPoles) {
          card.style.background = "rgba(10, 10, 20, 0.6)";
          card.style.borderColor = "rgba(99, 102, 241, 0.3)";
        }
        container.appendChild(card);

        const animate = () => {
          // Check if component is still mounted
          if (!document.body.contains(card)) return;

          const duration = isPoles ? 7 + Math.random() * 4 : 8 + Math.random() * 6;
          // Use % relative to container (visual-col) instead of vw/vh to prevent bleeding
          // Container is 50vw wide roughly. +/- 50% stays inside.
          const startX = (Math.random() - 0.5) * 80; // +/- 40%
          const startY = (Math.random() - 0.5) * 60; // +/- 30%

          if (isPoles) {
            gsap.fromTo(card,
              {
                xPercent: -50, // Center pivot
                yPercent: -50,
                x: `${startX}%`,
                y: `${startY}%`,
                z: -2000,
                autoAlpha: 0,
                scale: 0.1,
              },
              {
                z: 1500,
                autoAlpha: 1,
                scale: 3,
                duration: duration,
                ease: "none",
                onComplete: animate
              }
            );
          } else {
            gsap.fromTo(card,
              {
                xPercent: -50,
                yPercent: -50,
                x: `${startX}%`,
                y: `${startY}%`,
                z: -1000 + Math.random() * 500,
                autoAlpha: 0,
                scale: 0.5,
              },
              {
                z: 500,
                autoAlpha: 1,
                scale: 1,
                duration: duration,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                onRepeat: () => {
                  gsap.set(card, { x: `+=${(Math.random() - 0.5) * 10}%` });
                }
              }
            );

            // Add a separate subtle continuous rotation/drift
            gsap.to(card, {
              rotation: (Math.random() - 0.5) * 10,
              duration: duration * 1.5,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true
            });
          }
        }

        setTimeout(animate, i * (isPoles ? 800 : 200));
      }
    };

    generateVortex('poles-vortex', polesData, 8, true);
    generateVortex('agents-vortex', agentNames, 24, false); // Reduced count for clarity

    // --- MASTER SCROLL ---
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5 // Snappier scroll
      }
    });

    mainTl
      // Act 0 -> Act 1
      .to(".act-0", { autoAlpha: 0, scale: 0.85, duration: 2 }, "+=0.5")
      .to(".act-1", { autoAlpha: 1, duration: 1.5 }, "-=1.2")
      .to(".act-1", { autoAlpha: 0, y: -80, scale: 0.95, duration: 1.5 }, "+=1")

      // Act 2 (Poles)
      .to(".act-2", { autoAlpha: 1, duration: 1.5 }, "-=1.2")
      .to("#poles-vortex", { z: 2500, scale: 3.5, duration: 6, ease: "power2.in" }, "vortex-poles")
      .to(".act-2", { autoAlpha: 0, duration: 1.5 }, "-=1")

      // Act 3 (Agents)
      .to(".act-3", { autoAlpha: 1, duration: 1.5 }, "-=1.2")
      .to("#agents-vortex", { z: 2500, scale: 4, duration: 6, ease: "power2.in" }, "vortex-agents")
      .to(".act-3", { autoAlpha: 0, duration: 1.5 }, "-=1")

      // Act 4 (Terminal)
      .to(".act-4", { autoAlpha: 1, scale: 1, duration: 1.5, ease: "back.out(1.1)" }, "-=1.2")
      .add(() => {
        const counters = document.querySelectorAll('.act-4 .counter-num');
        counters.forEach((n: any) => {
          if (!n._tween) { // Simple guard
            n._tween = gsap.to(n, {
              textContent: n.dataset.target,
              duration: 2.5,
              ease: "power2.out",
              snap: { textContent: 1 }
            });
          }
        });
      })
      .to(".act-4", { autoAlpha: 0, scale: 1.1, duration: 1.5 }, "+=1.5")

      // Act 5 (Results)
      .to(".act-5", { autoAlpha: 1, y: 0, duration: 1.5 }, "-=1.2")
      .add(() => {
        const counters = document.querySelectorAll('.act-5 .counter-num');
        counters.forEach((n: any) => {
          if (!n._tween) {
            n._tween = gsap.to(n, {
              textContent: n.dataset.target,
              duration: 2.5,
              ease: "power2.out",
              snap: { textContent: 1 }
            });
          }
        });
      })

      // Footer (Act 6)
      .to(".act-5", { autoAlpha: 0, scale: 0.9, duration: 1.5 }, "+=1")
      .to(".act-6", { autoAlpha: 1, duration: 1.5 }, "-=1");

    // Progress Bar
    gsap.to("#progress-bar", {
      width: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3
      }
    });

  }, { scope: containerRef });

  // Cursor Effect (Separate from GSAP context to avoid refresh issues or keep global if needed)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.matchMedia("(pointer: fine)").matches) {
        gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(cursorGlowRef.current, { x: e.clientX, y: e.clientY, duration: 0.8, opacity: 1 });
      }
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleStart = () => {
    setLocation("/dashboard");
  };

  return (
    <div ref={containerRef} className="neural-landing bg-[#010204] text-slate-100 min-h-screen overflow-x-hidden selection:bg-indigo-500/30">
      <div id="cursor-dot" ref={cursorRef}></div>
      <div id="cursor-glow" ref={cursorGlowRef}></div>
      <div className="tech-grid"></div>
      <div className="stars-container" ref={starsContainerRef}></div>
      <div id="progress-bar" className="scroll-progress"></div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-[110] px-8 h-20 flex items-center justify-between bg-black/10 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={handleStart}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:rotate-12 transition-all">
            <span className="text-xl">🚀</span>
          </div>
          <span className="text-xl font-black tracking-tighter uppercase text-white">AstroGrowth</span>
        </div>
        <div className="hidden md:flex gap-10 text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">
          <a href="#" className="hover:text-white transition-colors">Univers</a>
          <a href="#" className="hover:text-white transition-colors">Architecture</a>
          <button onClick={handleStart} className="px-6 py-2 bg-indigo-600 text-white rounded-full font-black text-[10px] hover:bg-indigo-500 shadow-lg transition-all">
            ACCÈS ELITE
          </button>
        </div>
      </nav>

      <div className="scroll-container"></div>

      <div
        ref={scrollIndicatorRef}
        className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4"
      >
        <div
          onClick={() => window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' })}
          className="p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-indigo-600/20 transition-all cursor-pointer shadow-lg shadow-indigo-500/10 hover:scale-110 group"
        >
          <ChevronUp className="w-6 h-6 text-indigo-400 group-hover:text-white transition-colors" />
        </div>
        <div
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
          className="p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-indigo-600/20 transition-all cursor-pointer shadow-lg shadow-indigo-500/10 hover:scale-110 group animate-bounce"
        >
          <ChevronDown className="w-6 h-6 text-indigo-400 group-hover:text-white transition-colors" />
        </div>
      </div>

      <div className="stage">

        {/* ACTE 0: HERO */}
        <div className="act act-0">
          <div className="max-w-7xl text-center px-6 relative z-50">
            <div className="inline-block px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8 hero-reveal">
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-indigo-400 italic">Solution Marketing de Niveau 5</span>
            </div>
            <h1 className="hero-title mb-8 uppercase hero-reveal">DOMINEZ VOTRE<br /><span className="gradient-text italic">ESPACE DIGITAL</span></h1>
            <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 hero-reveal font-medium leading-relaxed">
              Activez une orchestration synchrone de <span className="text-white font-black underline decoration-indigo-500 underline-offset-8">48 agents experts</span>.
              Une armée numérique dédiée à votre expansion commerciale.
            </p>
            <div className="hero-reveal">
              <button onClick={handleStart} className="px-16 py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black text-2xl hover:bg-indigo-500 shadow-[0_30px_80px_rgba(99,102,241,0.4)] uppercase tracking-widest transition-all">
                Lancer la mission →
              </button>
            </div>
          </div>
        </div>

        {/* ACTE 1: PROBLÈME */}
        <div className="act act-1 px-6 text-center">
          <div className="relative z-50">
            <span className="text-indigo-400 font-bold text-[10px] uppercase tracking-[0.6em] mb-6 block italic">Audit Interne</span>
            <h2 className="hero-title title-mask mb-10 tracking-tighter italic uppercase">Votre Marketing<br />Est-il <span className="text-red-500">Limité?</span></h2>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="glass px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400 border-red-500/20">Processus Manuels</div>
              <div className="glass px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400 border-red-500/20">Zéro Scalabilité</div>
            </div>
          </div>
        </div>

        {/* ACTE 2: LES 8 PÔLES (Split Screen) */}
        <div className="act act-2">
          <div className="split-layout">
            {/* Left: Narrative */}
            <div className="narrative-col text-left">
              <span className="text-indigo-400 font-bold text-[10px] uppercase tracking-[0.6em] mb-4 block italic">Architecture de Commandement</span>
              <h2 className="text-4xl lg:text-5xl font-black uppercase title-mask mb-6 tracking-tighter leading-[0.9] italic">Synergie<br />Opérationnelle</h2>

              <div className="space-y-6 text-slate-300 text-base lg:text-lg leading-relaxed max-w-lg">
                <p>
                  <b className="text-white">Mission :</b> Orchestrer votre croissance avec une précision militaire. Nos 8 pôles ne sont pas de simples catégories, ce sont des centres de commandement autonomes qui structurent l'effort de guerre commercial.
                </p>
                <p>
                  <b className="text-white">L'avantage Tactique :</b> Pourquoi segmenter l'intelligence ? Parce qu'un agent généraliste ne suffit pas. En divisant les compétences ( Stratégie, Création, Données, etc. ), nous garantissons que chaque micro-tâche est exécutée par un spécialiste absolu.
                </p>
                <p className="text-sm border-l-2 border-indigo-500 pl-4 italic text-slate-400">
                  "Un écosystème où la stratégie nourrit la création, et où la donnée valide l'intuition en temps réel."
                </p>
              </div>
            </div>
            {/* Right: Visual */}
            <div className="visual-col">
              <div className="vortex-container relative w-full h-full" id="poles-vortex"></div>
            </div>
          </div>
        </div>

        {/* ACTE 3: LE FLUX NEURAL (Split Screen) */}
        <div className="act act-3">
          <div className="split-layout">
            {/* Left: Narrative & Customization */}
            <div className="narrative-col text-left">
              <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-[0.6em] mb-4 block italic">Personnalisation Totale</span>
              <h2 className="text-4xl lg:text-5xl font-black uppercase title-mask mb-6 tracking-tighter leading-[0.9] italic">Votre Cerveau,<br />Vos Règles</h2>

              <div className="space-y-6 text-slate-300 text-base lg:text-lg leading-relaxed max-w-lg">
                <p>
                  Ne louez pas une IA, <b className="text-white">construisez la vôtre</b>. AstroGrowth vous donne les clés du moteur pour une pertinence absolue.
                </p>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                  <div>
                    <h4 className="font-bold text-white text-sm uppercase flex items-center gap-2"><span className="text-emerald-400">01.</span> Choix du Modèle (LLM)</h4>
                    <p className="text-xs text-slate-400">Décidez qui pilote : la créativité de <span className="text-slate-300">Claude 3.5</span> ou la logique implacable de <span className="text-slate-300">GPT-4o</span>. Adaptez le cerveau à la tâche.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm uppercase flex items-center gap-2"><span className="text-purple-400">02.</span> Injection Système</h4>
                    <p className="text-xs text-slate-400">Définissez la personnalité, le ton, et les règles strictes via des prompts système avancés. Ils ne dévieront jamais de votre ligne directrice.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm uppercase flex items-center gap-2"><span className="text-orange-400">03.</span> RAG & Connaissance</h4>
                    <p className="text-xs text-slate-400">Nourrissez vos agents avec vos propres données (PDF, Docs). Ils deviennent les experts mondiaux de *votre* entreprise.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Right: Visual */}
            <div className="visual-col">
              <div className="vortex-container relative w-full h-full" id="agents-vortex"></div>
            </div>
          </div>
        </div>

        {/* ACTE 4: TERMINAL */}
        <div className="act act-4 px-6">
          <div className="glass max-w-6xl w-full p-10 lg:p-16 relative shadow-2xl overflow-hidden rounded-[3.5rem]">
            <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-8">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic font-mono">ASTRO_CMD // TERMINAL_V.20.0</div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
            </div>
            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-7 space-y-10">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                    <div className="text-[9px] text-indigo-400 font-bold uppercase mb-4 tracking-widest">Calculs</div>
                    <div className="text-5xl font-black counter-num" data-target="2847">0</div>
                  </div>
                  <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                    <div className="text-[9px] text-emerald-400 font-bold uppercase mb-4 tracking-widest">Sync</div>
                    <div className="text-5xl font-black counter-num" data-target="100">0</div><span className="text-xs">%</span>
                  </div>
                  <div className="p-8 bg-white/5 rounded-3xl border border-white/5 text-pink-400">
                    <div className="text-[9px] font-bold uppercase mb-4 tracking-widest">Gain Temps</div>
                    <div className="text-5xl font-black counter-num" data-target="47">0</div><span className="text-xs">H</span>
                  </div>
                </div>
                <div className="p-6 bg-indigo-600/5 border border-indigo-500/20 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white shadow-xl">AI</div>
                    <span className="text-sm font-bold text-slate-300">Synchronisation: Unit Strategist #04</span>
                  </div>
                  <span className="text-[10px] font-black text-indigo-400 tracking-[0.2em] animate-pulse uppercase italic">Processus Actif</span>
                </div>
              </div>
              <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center">
                <div className="text-8xl mb-8">🤖</div>
                <h4 className="text-2xl font-black uppercase tracking-tighter text-white">APEX CORE</h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-4 font-bold tracking-widest">Autonomie Totale</p>
              </div>
            </div>
          </div>
        </div>

        {/* ACTE 5: RESULTATS */}
        <div className="act act-5 px-6 text-center">
          <h2 className="hero-title uppercase mb-20 tracking-tighter italic">Impact <span className="gradient-text">Mesurable</span></h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
            <div className="glass p-12 text-center hover:scale-105 transition-transform duration-500">
              <div className="text-5xl mb-6">📈</div>
              <div className="text-6xl font-black mb-4 counter-num" data-target="247">0</div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em]">Leads / Mois</p>
            </div>
            <div className="glass p-12 text-center hover:scale-105 transition-transform duration-500 border-indigo-500/20">
              <div className="text-5xl mb-6">💰</div>
              <div className="text-6xl font-black mb-4 counter-num" data-target="380">0</div><span className="text-xl">%</span>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em]">ROI Moyen</p>
            </div>
            <div className="glass p-12 text-center hover:scale-105 transition-transform duration-500">
              <div className="text-5xl mb-6">⚡</div>
              <div className="text-6xl font-black mb-4 counter-num" data-target="47">0</div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em]">H Gagnées</p>
            </div>
            <div className="glass p-12 text-center hover:scale-105 transition-transform duration-500">
              <div className="text-5xl mb-6">🛡️</div>
              <div className="text-6xl font-black mb-4 counter-num" data-target="100">0</div><span className="text-xl">%</span>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em]">Qualifié</p>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="act act-6 w-full">
          <Footer />
        </div>

      </div>
    </div>
  );
}

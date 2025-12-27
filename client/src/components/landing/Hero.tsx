import { motion } from 'framer-motion';
import { Link } from "wouter";
import { useTranslation } from 'react-i18next';

export default function Hero() {
    const { t } = useTranslation();

    const stats = [
        { number: '10x', label: t('landing.hero.stats.faster'), badge: '+12.5%', color: 'icon-blue' },
        { number: '80%', label: t('landing.hero.stats.cheaper'), badge: '+8.3%', color: 'icon-purple' },
        { number: '48', label: t('landing.hero.stats.specialists'), badge: '+15.7%', color: 'icon-green' },
        { number: '24/7', label: t('landing.hero.stats.automation'), badge: '+23.1%', color: 'icon-lime' },
    ];

    return (
        <section className="hero mt-[100px] px-8 py-32 max-w-[1400px] mx-auto relative z-10">
            <div className="text-center max-w-[900px] mx-auto">
                <div className="hero-badge">
                    <span className="pulse-dot"></span>
                    <span>{t('landing.hero.badge')}</span>
                </div>

                <motion.h1
                    className="landing-h1"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {t('landing.hero.titlePre')} <span className="text-gradient">{t('landing.hero.titleGradient')}</span><br />
                    {t('landing.hero.titlePost')}
                </motion.h1>

                <motion.p
                    className="text-xl md:text-2xl text-gray-500 mb-12 font-light leading-relaxed"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {t('landing.hero.subtitle')}
                </motion.p>

                <motion.div
                    className="flex flex-col md:flex-row gap-6 justify-center mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <Link href="/dashboard">
                        <button className="btn btn-primary bg-gradient-to-br from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all">
                            <span>{t('landing.hero.ctaStart')}</span>
                            <span className="ml-2">→</span>
                        </button>
                    </Link>
                    <button className="bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-full font-bold text-lg hover:border-emerald-500 hover:-translate-y-1 transition-all shadow-md">
                        <span>📺 {t('landing.hero.ctaDemo')}</span>
                    </button>
                </motion.div>

                <motion.div
                    className="stats-container"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card group">
                            <div className={`stat-icon ${stat.color} text-4xl mb-8`}>
                                {index === 0 && '🚀'}
                                {index === 1 && '💰'}
                                {index === 2 && '🤖'}
                                {index === 3 && '⚡'}
                            </div>
                            <div className="stat-number">{stat.number}</div>
                            <div className="stat-label">{stat.label}</div>
                            <div className="stat-badge">↗ {stat.badge}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function AgentsShowcase() {
    const { t } = useTranslation();
    const agents = [
        { emoji: '🎨', name: t('landing.agentsShowcase.roles.content.name'), role: t('landing.agentsShowcase.roles.content.role'), desc: t('landing.agentsShowcase.roles.content.desc') },
        { emoji: '🔎', name: t('landing.agentsShowcase.roles.hunter.name'), role: t('landing.agentsShowcase.roles.hunter.role'), desc: t('landing.agentsShowcase.roles.hunter.desc') },
        { emoji: '📱', name: t('landing.agentsShowcase.roles.publisher.name'), role: t('landing.agentsShowcase.roles.publisher.role'), desc: t('landing.agentsShowcase.roles.publisher.desc') },
        { emoji: '📊', name: t('landing.agentsShowcase.roles.analytics.name'), role: t('landing.agentsShowcase.roles.analytics.role'), desc: t('landing.agentsShowcase.roles.analytics.desc') },
        { emoji: '🎯', name: t('landing.agentsShowcase.roles.manager.name'), role: t('landing.agentsShowcase.roles.manager.role'), desc: t('landing.agentsShowcase.roles.manager.desc') },
        { emoji: '💡', name: t('landing.agentsShowcase.roles.strategy.name'), role: t('landing.agentsShowcase.roles.strategy.role'), desc: t('landing.agentsShowcase.roles.strategy.desc') },
    ];

    return (
        <section className="section py-32 px-8 max-w-[1400px] mx-auto z-10 relative" id="agents">
            <div className="text-center mb-20">
                <div className="inline-block bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-600 px-6 py-3 rounded-full font-bold mb-6">
                    {t('landing.agentsShowcase.badge')}
                </div>
                <h2 className="section-title">
                    {t('landing.agentsShowcase.titlePre')} <span className="text-gradient">{t('landing.agentsShowcase.titleGradient')}</span>
                </h2>
                <p className="text-xl text-gray-500 max-w-[700px] mx-auto">
                    {t('landing.agentsShowcase.subtitle')}
                </p>
            </div>

            <div className="agents-grid">
                {agents.map((agent, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ y: -20, scale: 1.05 }}
                        className="agent-card group"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="agent-emoji group-hover:scale-125 group-hover:rotate-[360deg] transition-transform duration-500">{agent.emoji}</div>
                        <h3 className="text-2xl font-extrabold mb-3 text-gray-900 group-hover:text-emerald-600 transition-colors">{agent.name}</h3>
                        <p className="text-emerald-500 font-bold mb-6">{agent.role}</p>
                        <p className="text-gray-500 leading-relaxed">
                            {agent.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

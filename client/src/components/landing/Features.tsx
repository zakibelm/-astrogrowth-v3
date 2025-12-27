import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Features() {
    const { t } = useTranslation();
    return (
        <section className="section py-32 px-8 max-w-[1400px] mx-auto z-10 relative" id="features">
            <div className="text-center mb-20">
                <div className="inline-block bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-600 px-6 py-3 rounded-full font-bold mb-6">
                    {t('landing.features.badge')}
                </div>
                <h2 className="section-title">
                    {t('landing.features.titlePre')}<br />
                    <span className="text-gradient">{t('landing.features.titleGradient')}</span>
                </h2>
                <p className="text-xl text-gray-500 max-w-[700px] mx-auto">
                    {t('landing.features.subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12">
                <motion.div
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-[32px] p-12 shadow-sm border border-black/5 md:col-span-8"
                >
                    <div className="text-6xl mb-8">🔍</div>
                    <h3 className="text-3xl font-bold mb-6 text-gray-900">{t('landing.features.astroleads.title')}</h3>
                    <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                        {t('landing.features.astroleads.description')}
                    </p>
                    <ul className="feature-list space-y-4">
                        <li className="flex items-center gap-4 text-gray-600 font-medium">{t('landing.features.astroleads.items.scraping')}</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">{t('landing.features.astroleads.items.enrichment')}</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">{t('landing.features.astroleads.items.scoring')}</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">{t('landing.features.astroleads.items.crm')}</li>
                    </ul>
                </motion.div>

                <motion.div
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-[32px] p-12 shadow-sm border border-black/5 md:col-span-4"
                >
                    <div className="text-6xl mb-8">✨</div>
                    <h3 className="text-3xl font-bold mb-6 text-gray-900">{t('landing.features.astromedia.title')}</h3>
                    <p className="text-lg text-gray-500 leading-relaxed">
                        {t('landing.features.astromedia.description')}
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-[32px] p-12 shadow-sm border border-black/5 md:col-span-6"
                >
                    <div className="text-6xl mb-8">💼</div>
                    <h3 className="text-3xl font-bold mb-6 text-gray-900">{t('landing.features.distribution.title')}</h3>
                    <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                        {t('landing.features.distribution.description')}
                    </p>
                    <ul className="feature-list space-y-4">
                        <li className="flex items-center gap-4 text-gray-600 font-medium">{t('landing.features.distribution.items.scheduling')}</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">{t('landing.features.distribution.items.timing')}</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">{t('landing.features.distribution.items.multiAccount')}</li>
                    </ul>
                </motion.div>

                <motion.div
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-[32px] p-12 shadow-sm border border-black/5 md:col-span-6"
                >
                    <div className="text-6xl mb-8">🤖</div>
                    <h3 className="text-3xl font-bold mb-6 text-gray-900">{t('landing.features.agents.title')}</h3>
                    <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                        {t('landing.features.agents.description')}
                    </p>
                    <ul className="feature-list space-y-4">
                        <li className="flex items-center gap-4 text-gray-600 font-medium">{t('landing.features.agents.items.content')}</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">{t('landing.features.agents.items.hunting')}</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">{t('landing.features.agents.items.publishing')}</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">{t('landing.features.agents.items.optimization')}</li>
                    </ul>
                </motion.div>
            </div>
        </section>
    );
}

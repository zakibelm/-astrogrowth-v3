import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="bg-white pt-24 pb-12 border-t border-black/5 relative z-10">
            <div className="max-w-[1400px] mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-16 mb-20">
                    <div className="md:col-span-2">
                        <h3 className="text-3xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-600">
                            AstroGrowth
                        </h3>
                        <p className="text-gray-500 text-lg leading-relaxed mb-8">
                            {t('landing.footer.description')}
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-8">{t('landing.footer.columns.product')}</h4>
                        <ul className="space-y-4">
                            <li><a href="#features" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">{t('landing.footer.links.features')}</a></li>
                            <li><a href="#agents" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">{t('landing.footer.links.agents')}</a></li>
                            <li><a href="#pricing" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">{t('landing.footer.links.pricing')}</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">{t('landing.footer.links.integrations')}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-8">{t('landing.footer.columns.resources')}</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">{t('landing.footer.links.docs')}</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">{t('landing.footer.links.blog')}</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">{t('landing.footer.links.cases')}</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">{t('landing.footer.links.support')}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-8">{t('landing.footer.columns.company')}</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">{t('landing.footer.links.about')}</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">{t('landing.footer.links.careers')}</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">{t('landing.footer.links.contact')}</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">{t('landing.footer.links.legal')}</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-black/5 pt-12 text-center">
                    <p className="text-gray-500 font-medium">
                        © 2025 AstroGrowth. {t('landing.footer.copyright')} <strong className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-500">Zakibelm</strong> 🚀
                    </p>
                </div>
            </div>
        </footer>
    );
}

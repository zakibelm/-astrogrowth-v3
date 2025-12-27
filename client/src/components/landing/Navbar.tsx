import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-4 bg-white/95 shadow-lg backdrop-blur-md' : 'py-6 bg-white/80 backdrop-blur-md border-b border-black/5'
            }`}>
            <div className="nav-container flex items-center justify-between px-8 max-w-[1400px] mx-auto">
                <div className="landing-logo text-2xl">
                    🚀 AstroGrowth
                </div>
                <div className="nav-menu hidden lg:flex items-center gap-8">
                    <a href="#features" className="hover:text-emerald-600 transition-colors">{t('landing.nav.features')}</a>
                    <a href="#agents" className="hover:text-emerald-600 transition-colors">{t('landing.nav.agents')}</a>
                    <a href="#pricing" className="hover:text-emerald-600 transition-colors">{t('landing.nav.pricing')}</a>
                    <LanguageSwitcher />
                    <Link href="/dashboard">
                        <Button className="nav-cta">
                            {t('landing.nav.getStarted')}
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

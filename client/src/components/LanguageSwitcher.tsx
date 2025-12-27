import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'fr' ? 'en' : 'fr';
        i18n.changeLanguage(newLang);
    };

    return (
        <Button
            variant="ghost"
            onClick={toggleLanguage}
            className="font-medium hover:bg-transparent hover:text-emerald-600 transition-colors"
        >
            {i18n.language === 'fr' ? 'EN' : 'FR'}
        </Button>
    );
}


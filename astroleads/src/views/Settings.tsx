import React, { useState, useEffect } from 'react';
import { Save, Key, Eye, EyeOff, CheckCircle, AlertCircle, Shield, Mail, TestTube } from 'lucide-react';
import { Card, Button, Input, useToast } from '@/components/ui';
import { ApiSettings, getStoredSettings, STORAGE_KEY } from '@/utils/settings';

const Settings: React.FC = () => {
    const toast = useToast();
    const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
    const [settings, setSettings] = useState<ApiSettings>({
        openRouterKey: '',
        supabaseUrl: '',
        supabaseKey: '',
        hunterApiKey: '',
        phantombusterApiKey: '',
        newsApiKey: '',
        testEmail: '',
        testModeEnabled: true,
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setSettings(getStoredSettings());
    }, []);

    const handleSave = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        setSaved(true);
        toast.success('Paramètres sauvegardés !', 'Configuration stockée localement');
        setTimeout(() => setSaved(false), 3000);
    };

    const toggleVisibility = (key: string) => {
        setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const getKeyStatus = (value: string, prefix?: string) => {
        if (!value) return { valid: false, message: 'Non configuré' };
        if (prefix && !value.startsWith(prefix)) {
            return { valid: false, message: `Doit commencer par ${prefix}` };
        }
        return { valid: true, message: 'Configuré ✓' };
    };

    const apiConfigs = [
        {
            id: 'openRouterKey',
            label: 'OpenRouter API Key',
            placeholder: 'sk-or-v1-xxxx...',
            prefix: 'sk-or',
            description: 'Pour la génération de leads et emails via IA',
            link: 'https://openrouter.ai/keys',
        },
        {
            id: 'hunterApiKey',
            label: 'Hunter.io API Key',
            placeholder: 'Votre clé API Hunter',
            description: 'Pour la vérification des emails (requis)',
            link: 'https://hunter.io/api_keys',
        },
        {
            id: 'phantombusterApiKey',
            label: 'PhantomBuster API Key',
            placeholder: 'Votre clé API PhantomBuster',
            description: 'Pour le scraping multi-plateforme (LinkedIn, Facebook, Instagram, TikTok...)',
            link: 'https://phantombuster.com/api',
        },
        {
            id: 'newsApiKey',
            label: 'News API Key',
            placeholder: 'Votre clé API NewsAPI',
            description: 'Pour le contexte "Actualités" des entreprises',
            link: 'https://newsapi.org/register',
        },
        {
            id: 'supabaseUrl',
            label: 'Supabase URL',
            placeholder: 'https://xxxxx.supabase.co',
            prefix: 'https://',
            description: 'URL de votre projet Supabase',
            link: 'https://supabase.com/dashboard',
        },
        {
            id: 'supabaseKey',
            label: 'Supabase Anon Key',
            placeholder: 'sb_publishable_xxxx...',
            prefix: 'sb_',
            description: 'Clé publique de Supabase',
            link: 'https://supabase.com/dashboard',
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-astro-gold/20 to-orange-500/20">
                    <Shield className="w-8 h-8 text-astro-gold" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Paramètres</h1>
                    <p className="text-neutral-400">Configurez vos clés API en toute sécurité</p>
                </div>
            </div>

            <Card className="border-astro-gold/30 bg-astro-gold/5">
                <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-astro-gold flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-astro-gold">Stockage sécurisé</h3>
                        <p className="text-sm text-neutral-300 mt-1">
                            Vos clés API sont stockées <strong>uniquement dans votre navigateur</strong> (localStorage).
                            Elles ne sont jamais envoyées à nos serveurs.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Test Mode Section */}
            <Card className="border-blue-500/30 bg-blue-500/5">
                <div className="flex items-start gap-4">
                    <TestTube className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-blue-400">Mode Test Email</h3>
                            <button
                                onClick={() => setSettings({ ...settings, testModeEnabled: !settings.testModeEnabled })}
                                className={`relative w-12 h-6 rounded-full transition-colors ${settings.testModeEnabled ? 'bg-blue-500' : 'bg-neutral-600'
                                    }`}
                            >
                                <span
                                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.testModeEnabled ? 'left-7' : 'left-1'
                                        }`}
                                />
                            </button>
                        </div>
                        <p className="text-sm text-neutral-300 mt-1 mb-4">
                            {settings.testModeEnabled
                                ? '✅ Activé : Tous les emails sont redirigés vers votre adresse de test (évite les limitations Resend)'
                                : '⚠️ Désactivé : Les emails seront envoyés aux vrais destinataires (nécessite un domaine vérifié sur Resend)'}
                        </p>

                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-blue-400" />
                            <Input
                                type="email"
                                placeholder="votre-email@gmail.com"
                                value={settings.testEmail}
                                onChange={(e) => setSettings({ ...settings, testEmail: e.target.value })}
                                className="flex-1"
                            />
                        </div>
                        <p className="text-xs text-neutral-500 mt-2">
                            Cet email recevra tous les emails de test. Utilisez l'email vérifié sur Resend.
                        </p>
                    </div>
                </div>
            </Card>

            {/* API Keys */}
            <div className="space-y-6">
                {apiConfigs.map((config) => {
                    const value = settings[config.id as keyof ApiSettings] as string;
                    const status = getKeyStatus(value, config.prefix);
                    const isVisible = showKeys[config.id];

                    return (
                        <Card key={config.id} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Key className="w-5 h-5 text-astro-gold" />
                                    <div>
                                        <h3 className="font-semibold text-white">{config.label}</h3>
                                        <p className="text-sm text-neutral-400">{config.description}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-2 text-sm ${status.valid ? 'text-green-400' : 'text-neutral-500'}`}>
                                    {status.valid ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                    {status.message}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <Input
                                        type={isVisible ? 'text' : 'password'}
                                        placeholder={config.placeholder}
                                        value={value}
                                        onChange={(e) => setSettings({ ...settings, [config.id]: e.target.value })}
                                        className="pr-12 font-mono text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleVisibility(config.id)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                                    >
                                        {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <a
                                    href={config.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 rounded-lg bg-astro-700 text-neutral-300 hover:bg-astro-600 hover:text-white transition-colors text-sm whitespace-nowrap"
                                >
                                    Obtenir une clé
                                </a>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    leftIcon={saved ? <CheckCircle size={18} /> : <Save size={18} />}
                    className={saved ? 'bg-green-600 hover:bg-green-600' : ''}
                >
                    {saved ? 'Sauvegardé !' : 'Sauvegarder les paramètres'}
                </Button>
            </div>
        </div>
    );
};

export default Settings;

/**
 * Founding Member Program Page (renamed from Beta)
 * Multi-language: FR (default) + EN
 */

import React, { useState } from 'react';
import { CheckCircle, Zap, Code, Lock, ArrowRight, Globe } from 'lucide-react';
import { Button, Input, Textarea } from '@/components/ui';
import { supabase } from '@/lib/supabaseClient';
import { t, type Language } from '@/lib/i18n';

const FoundingMemberPage: React.FC = () => {
    const [lang, setLang] = useState<Language>('fr');
    const [formData, setFormData] = useState({
        email: '',
        company: '',
        role: '',
        useCase: '',
        techStack: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase
                .from('founding_member_signups')
                .insert({
                    email: formData.email,
                    company: formData.company,
                    role: formData.role,
                    use_case: formData.useCase,
                    tech_stack: formData.techStack,
                    language: lang,
                    status: 'pending'
                });

            if (error) throw error;

            setIsSubmitted(true);
        } catch (error) {
            console.error('Error submitting signup:', error);
            alert('Erreur lors de la soumission. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-astro-900 via-astro-950 to-black flex items-center justify-center p-8">
                <div className="max-w-2xl text-center">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">
                        {t('foundingMember.success.title', lang)}
                    </h1>
                    <p className="text-xl text-neutral-300 mb-8">
                        {t('foundingMember.success.subtitle', lang)}
                    </p>
                    <div className="bg-astro-800/50 border border-astro-700 rounded-xl p-6">
                        <p className="text-neutral-400 mb-4">
                            {t('foundingMember.success.checkInbox', lang)}
                        </p>
                        <ul className="text-left text-neutral-300 space-y-2">
                            <li className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-400" />
                                {t('foundingMember.success.welcome', lang)}
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-400" />
                                {t('foundingMember.success.credentials', lang)}
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-400" />
                                {t('foundingMember.success.discord', lang)}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-astro-900 via-astro-950 to-black">
            {/* Language Switcher */}
            <div className="absolute top-8 right-8 z-50">
                <div className="bg-astro-800/50 border border-astro-700 rounded-lg p-1 flex gap-1">
                    <button
                        onClick={() => setLang('fr')}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${lang === 'fr'
                            ? 'bg-astro-gold text-black'
                            : 'text-neutral-400 hover:text-white'
                            }`}
                    >
                        🇫🇷 FR
                    </button>
                    <button
                        onClick={() => setLang('en')}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${lang === 'en'
                            ? 'bg-astro-gold text-black'
                            : 'text-neutral-400 hover:text-white'
                            }`}
                    >
                        🇬🇧 EN
                    </button>
                </div>
            </div>

            {/* Hero */}
            <div className="max-w-6xl mx-auto px-8 pt-20 pb-12">
                <div className="text-center mb-16">
                    <div className="inline-block bg-astro-gold/20 border border-astro-gold/30 rounded-full px-4 py-2 mb-6">
                        <p className="text-astro-gold font-semibold text-sm">
                            {t('foundingMember.badge', lang)}
                        </p>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        {t('foundingMember.hero.title', lang)}<br />
                        <span className="bg-gradient-to-r from-astro-gold to-yellow-400 bg-clip-text text-transparent">
                            {t('foundingMember.hero.subtitle', lang)}
                        </span>
                    </h1>

                    <p className="text-xl text-neutral-300 mb-8 max-w-3xl mx-auto">
                        {t('foundingMember.hero.description', lang)} <strong className="text-white">{t('foundingMember.hero.free', lang)}</strong> {t('foundingMember.hero.support', lang)}
                    </p>

                    <div className="flex gap-4 justify-center items-center flex-wrap">
                        <div className="flex items-center gap-2 text-neutral-400">
                            <CheckCircle size={20} className="text-green-400" />
                            <span>{t('foundingMember.benefits.noCard', lang)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400">
                            <CheckCircle size={20} className="text-green-400" />
                            <span>{t('foundingMember.benefits.fullApi', lang)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400">
                            <CheckCircle size={20} className="text-green-400" />
                            <span>{t('foundingMember.benefits.cancel', lang)}</span>
                        </div>
                    </div>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-astro-800/50 border border-astro-700 rounded-xl p-6">
                        <Zap className="w-12 h-12 text-astro-gold mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">{t('foundingMember.cards.free.title', lang)}</h3>
                        <p className="text-neutral-400">
                            {t('foundingMember.cards.free.description', lang)}
                        </p>
                    </div>

                    <div className="bg-astro-800/50 border border-astro-700 rounded-xl p-6">
                        <Code className="w-12 h-12 text-blue-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">{t('foundingMember.cards.ready.title', lang)}</h3>
                        <p className="text-neutral-400">
                            {t('foundingMember.cards.ready.description', lang)}
                        </p>
                    </div>

                    <div className="bg-astro-800/50 border border-astro-700 rounded-xl p-6">
                        <Lock className="w-12 h-12 text-green-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">{t('foundingMember.cards.priority.title', lang)}</h3>
                        <p className="text-neutral-400">
                            {t('foundingMember.cards.priority.description', lang)}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-2xl mx-auto bg-astro-800/50 border border-astro-700 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">{t('foundingMember.form.title', lang)}</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label={t('foundingMember.form.email', lang)}
                            type="email"
                            placeholder={t('foundingMember.form.emailPlaceholder', lang)}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />

                        <Input
                            label={t('foundingMember.form.company', lang)}
                            placeholder={t('foundingMember.form.companyPlaceholder', lang)}
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            required
                        />

                        <Input
                            label={t('foundingMember.form.role', lang)}
                            placeholder={t('foundingMember.form.rolePlaceholder', lang)}
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            required
                        />

                        <Textarea
                            label={t('foundingMember.form.useCase', lang)}
                            placeholder={t('foundingMember.form.useCasePlaceholder', lang)}
                            value={formData.useCase}
                            onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                            rows={4}
                            required
                        />

                        <Textarea
                            label={t('foundingMember.form.techStack', lang)}
                            placeholder={t('foundingMember.form.techStackPlaceholder', lang)}
                            value={formData.techStack}
                            onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                            rows={2}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                            rightIcon={<ArrowRight size={18} />}
                        >
                            {t('foundingMember.form.submit', lang)}
                        </Button>

                        <p className="text-xs text-neutral-500 text-center">
                            {t('foundingMember.form.terms', lang)}
                        </p>
                    </form>
                </div>

                {/* Social Proof */}
                <div className="mt-16 text-center">
                    <p className="text-neutral-500 mb-4">{t('foundingMember.social.trusted', lang)}</p>
                    <div className="flex gap-8 justify-center items-center flex-wrap opacity-50">
                        <span className="text-white font-semibold">{t('foundingMember.social.yc', lang)}</span>
                        <span className="text-white font-semibold">{t('foundingMember.social.saas', lang)}</span>
                        <span className="text-white font-semibold">{t('foundingMember.social.agencies', lang)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoundingMemberPage;

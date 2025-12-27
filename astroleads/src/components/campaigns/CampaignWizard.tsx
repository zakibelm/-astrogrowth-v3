/**
 * Campaign Creation Wizard - Multi-step intelligent questionnaire
 */

import React, { useState } from 'react';
import { Building2, Users, Shuffle, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { Button, Input, Textarea } from '@/components/ui';
import {
    COMPANY_SIZES,
    BUSINESS_SECTORS,
    TARGET_POSITIONS,
    SENIORITY_LEVELS,
    REVENUE_RANGES,
    FOLLOWER_RANGES,
    ENGAGEMENT_RATES,
    INFLUENCER_CATEGORIES,
    AGE_RANGES,
    LANGUAGES,
    URGENCY_OPTIONS,
    B2B_PRIORITIES,
    B2C_PRIORITIES,
    MIN_SCORES,
} from '@/lib/campaignOptions';
import type { Campaign } from '@/types';

interface CampaignWizardProps {
    onComplete: (campaignData: Partial<Campaign>) => void;
    onCancel: () => void;
}

type WizardStep = 'type' | 'basic' | 'qualification' | 'exclusion' | 'budget' | 'scoring' | 'preview';

export const CampaignWizard: React.FC<CampaignWizardProps> = ({ onComplete, onCancel }) => {
    const [currentStep, setCurrentStep] = useState<WizardStep>('type');
    const [formData, setFormData] = useState<Partial<Campaign>>({
        campaignType: 'b2b',
        preferredSources: [],
        b2bCriteria: {},
        b2cCriteria: {},
        exclusionCriteria: {},
        budget: {},
        scoringPriorities: { minScore: 80 },
    });

    const updateFormData = (updates: Partial<Campaign>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handleNext = () => {
        const steps: WizardStep[] = ['type', 'basic', 'qualification', 'exclusion', 'budget', 'scoring', 'preview'];
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex < steps.length - 1) {
            setCurrentStep(steps[currentIndex + 1]);
        }
    };

    const handleBack = () => {
        const steps: WizardStep[] = ['type', 'basic', 'qualification', 'exclusion', 'budget', 'scoring', 'preview'];
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex > 0) {
            setCurrentStep(steps[currentIndex - 1]);
        }
    };

    const handleComplete = () => {
        onComplete(formData);
    };

    // Step 1: Campaign Type
    const renderTypeStep = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Type de Campagne
                </h3>
                <p className="text-sm text-neutral-400">
                    Sélectionnez le type pour optimiser automatiquement les critères
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <button
                    onClick={() => {
                        updateFormData({ campaignType: 'b2b' });
                        handleNext();
                    }}
                    className="p-6 bg-astro-800 border-2 border-transparent hover:border-astro-gold rounded-xl transition-all text-center group"
                >
                    <Building2 className="w-12 h-12 mx-auto text-blue-400 mb-3 group-hover:text-astro-gold transition-colors" />
                    <h4 className="text-lg font-semibold text-white mb-2">B2B</h4>
                    <p className="text-xs text-neutral-400 mb-3">
                        Entreprises et professionnels
                    </p>
                    <div className="flex flex-wrap gap-1 justify-center">
                        <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                            LinkedIn
                        </span>
                        <span className="text-[10px] bg-green-500/20 text-green-300 px-2 py-1 rounded">
                            Google Maps
                        </span>
                    </div>
                </button>

                <button
                    onClick={() => {
                        updateFormData({ campaignType: 'b2c' });
                        handleNext();
                    }}
                    className="p-6 bg-astro-800 border-2 border-transparent hover:border-astro-gold rounded-xl transition-all text-center group"
                >
                    <Users className="w-12 h-12 mx-auto text-pink-400 mb-3 group-hover:text-astro-gold transition-colors" />
                    <h4 className="text-lg font-semibold text-white mb-2">B2C</h4>
                    <p className="text-xs text-neutral-400 mb-3">
                        Particuliers et influenceurs
                    </p>
                    <div className="flex flex-wrap gap-1 justify-center">
                        <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-1 rounded">
                            Instagram
                        </span>
                        <span className="text-[10px] bg-black/40 text-white px-2 py-1 rounded">
                            TikTok
                        </span>
                    </div>
                </button>

                <button
                    onClick={() => {
                        updateFormData({ campaignType: 'hybrid' });
                        handleNext();
                    }}
                    className="p-6 bg-astro-800 border-2 border-transparent hover:border-astro-gold rounded-xl transition-all text-center group"
                >
                    <Shuffle className="w-12 h-12 mx-auto text-purple-400 mb-3 group-hover:text-astro-gold transition-colors" />
                    <h4 className="text-lg font-semibold text-white mb-2">Hybride</h4>
                    <p className="text-xs text-neutral-400 mb-3">
                        Mix B2B et B2C
                    </p>
                    <div className="flex flex-wrap gap-1 justify-center">
                        <span className="text-[10px] bg-astro-gold/20 text-astro-gold px-2 py-1 rounded">
                            Toutes sources
                        </span>
                    </div>
                </button>
            </div>
        </div>
    );

    // Step 2: Basic Info
    const renderBasicStep = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Informations de Base</h3>

            <Input
                label="Nom de la campagne"
                placeholder="Ex: Prospection CTO Tech Q1 2025"
                value={formData.name || ''}
                onChange={(e) => updateFormData({ name: e.target.value })}
                required
            />

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Nom du produit/service"
                    placeholder="Ex: AstroLeads CRM"
                    value={formData.productName || ''}
                    onChange={(e) => updateFormData({ productName: e.target.value })}
                />
                <Input
                    label="Audience cible"
                    placeholder="Ex: CTOs SaaS B2B"
                    value={formData.targetAudience || ''}
                    onChange={(e) => updateFormData({ targetAudience: e.target.value })}
                />
            </div>

            <Textarea
                label="Description du service"
                placeholder="Décrivez brièvement votre produit/service..."
                value={formData.serviceDescription || ''}
                onChange={(e) => updateFormData({ serviceDescription: e.target.value })}
                rows={3}
            />

            <Input
                label="Géolocalisation"
                placeholder="Ex: France, Europe, Amérique du Nord"
                value={formData.geolocation || ''}
                onChange={(e) => updateFormData({ geolocation: e.target.value })}
            />

            <div className="flex gap-3">
                <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft size={16} className="mr-2" />
                    Retour
                </Button>
                <Button onClick={handleNext} className="flex-1" disabled={!formData.name}>
                    Continuer
                    <ArrowRight size={16} className="ml-2" />
                </Button>
            </div>
        </div>
    );

    // Step 3: Qualification Criteria
    const renderQualificationStep = () => {
        const isB2B = formData.campaignType === 'b2b' || formData.campaignType === 'hybrid';
        const isB2C = formData.campaignType === 'b2c' || formData.campaignType === 'hybrid';

        return (
            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Critères de Qualification</h3>

                {isB2B && (
                    <div className="space-y-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                        <h4 className="text-sm font-bold text-blue-300">B2B - Professionnels</h4>

                        {/* Company Size */}
                        <div>
                            <label className="block text-xs font-bold text-neutral-400 mb-2">
                                Taille d'entreprise ciblée
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {COMPANY_SIZES.map(size => (
                                    <button
                                        key={size.value}
                                        type="button"
                                        onClick={() => {
                                            const sizes = formData.b2bCriteria?.companySize || [];
                                            const newSizes = sizes.includes(size.value)
                                                ? sizes.filter(s => s !== size.value)
                                                : [...sizes, size.value];
                                            updateFormData({
                                                b2bCriteria: { ...formData.b2bCriteria, companySize: newSizes }
                                            });
                                        }}
                                        className={`px-3 py-2 rounded-lg border text-sm transition-all ${formData.b2bCriteria?.companySize?.includes(size.value)
                                            ? 'bg-astro-gold/20 border-astro-gold text-astro-gold'
                                            : 'bg-astro-800 border-astro-700 text-neutral-400 hover:text-white'
                                            }`}
                                    >
                                        {size.icon} {size.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sectors */}
                        <div>
                            <label className="block text-xs font-bold text-neutral-400 mb-2">
                                Secteurs d'activité
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {BUSINESS_SECTORS.map(sector => (
                                    <button
                                        key={sector}
                                        type="button"
                                        onClick={() => {
                                            const sectors = formData.b2bCriteria?.sectors || [];
                                            const newSectors = sectors.includes(sector)
                                                ? sectors.filter(s => s !== sector)
                                                : [...sectors, sector];
                                            updateFormData({
                                                b2bCriteria: { ...formData.b2bCriteria, sectors: newSectors }
                                            });
                                        }}
                                        className={`px-3 py-2 rounded-lg border text-sm transition-all ${formData.b2bCriteria?.sectors?.includes(sector)
                                            ? 'bg-astro-gold/20 border-astro-gold text-astro-gold'
                                            : 'bg-astro-800 border-astro-700 text-neutral-400 hover:text-white'
                                            }`}
                                    >
                                        {sector}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Target Positions - only show top ones */}
                        <div>
                            <label className="block text-xs font-bold text-neutral-400 mb-2">
                                Postes ciblés
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {TARGET_POSITIONS.slice(0, 8).map(position => (
                                    <button
                                        key={position.value}
                                        type="button"
                                        onClick={() => {
                                            const positions = formData.b2bCriteria?.targetPositions || [];
                                            const newPositions = positions.includes(position.value)
                                                ? positions.filter(p => p !== position.value)
                                                : [...positions, position.value];
                                            updateFormData({
                                                b2bCriteria: { ...formData.b2bCriteria, targetPositions: newPositions }
                                            });
                                        }}
                                        className={`px-3 py-2 rounded-lg border text-sm transition-all ${formData.b2bCriteria?.targetPositions?.includes(position.value)
                                            ? 'bg-astro-gold/20 border-astro-gold text-astro-gold'
                                            : 'bg-astro-800 border-astro-700 text-neutral-400 hover:text-white'
                                            }`}
                                    >
                                        {position.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {isB2C && (
                    <div className="space-y-4 p-4 bg-pink-500/10 border border-pink-500/30 rounded-xl">
                        <h4 className="text-sm font-bold text-pink-300">B2C - Influenceurs</h4>

                        {/* Min Followers */}
                        <div>
                            <label className="block text-xs font-bold text-neutral-400 mb-2">
                                Audience minimale
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {FOLLOWER_RANGES.map(range => (
                                    <button
                                        key={range.value}
                                        type="button"
                                        onClick={() => {
                                            updateFormData({
                                                b2cCriteria: { ...formData.b2cCriteria, minFollowers: range.value }
                                            });
                                        }}
                                        className={`px-3 py-2 rounded-lg border text-sm transition-all ${formData.b2cCriteria?.minFollowers === range.value
                                            ? 'bg-astro-gold/20 border-astro-gold text-astro-gold'
                                            : 'bg-astro-800 border-astro-700 text-neutral-400 hover:text-white'
                                            }`}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Categories */}
                        <div>
                            <label className="block text-xs font-bold text-neutral-400 mb-2">
                                Catégories
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {INFLUENCER_CATEGORIES.map(cat => (
                                    <button
                                        key={cat.value}
                                        type="button"
                                        onClick={() => {
                                            const categories = formData.b2cCriteria?.categories || [];
                                            const newCategories = categories.includes(cat.value)
                                                ? categories.filter(c => c !== cat.value)
                                                : [...categories, cat.value];
                                            updateFormData({
                                                b2cCriteria: { ...formData.b2cCriteria, categories: newCategories }
                                            });
                                        }}
                                        className={`px-3 py-2 rounded-lg border text-sm transition-all ${formData.b2cCriteria?.categories?.includes(cat.value)
                                            ? 'bg-astro-gold/20 border-astro-gold text-astro-gold'
                                            : 'bg-astro-800 border-astro-700 text-neutral-400 hover:text-white'
                                            }`}
                                    >
                                        {cat.icon} {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Verified Required */}
                        <div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.b2cCriteria?.requireVerified || false}
                                    onChange={(e) => updateFormData({
                                        b2cCriteria: { ...formData.b2cCriteria, requireVerified: e.target.checked }
                                    })}
                                    className="w-5 h-5"
                                />
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        ✅ Exiger un compte vérifié
                                    </p>
                                    <p className="text-xs text-neutral-400">
                                        Filtrer uniquement les comptes avec badge de vérification
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>
                )}

                <div className="flex gap-3">
                    <Button variant="ghost" onClick={handleBack}>
                        <ArrowLeft size={16} className="mr-2" />
                        Retour
                    </Button>
                    <Button onClick={handleNext} className="flex-1">
                        Continuer
                        <ArrowRight size={16} className="ml-2" />
                    </Button>
                </div>
            </div>
        );
    };

    // Step 4: Exclusion Criteria
    const renderExclusionStep = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Critères d'Exclusion</h3>
            <p className="text-sm text-neutral-400">Leads à éviter automatiquement</p>

            <div className="space-y-4">
                {formData.campaignType !== 'b2c' && (
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-astro-800 rounded-lg hover:bg-astro-700 transition-colors">
                        <input
                            type="checkbox"
                            checked={formData.exclusionCriteria?.excludePersonalEmails || false}
                            onChange={(e) => updateFormData({
                                exclusionCriteria: { ...formData.exclusionCriteria, excludePersonalEmails: e.target.checked }
                            })}
                            className="w-5 h-5"
                        />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-white">
                                Exclure emails personnels (@gmail.com, @yahoo.com, etc.)
                            </p>
                            <p className="text-xs text-neutral-400">
                                Recommandé pour B2B - garde uniquement emails professionnels
                            </p>
                        </div>
                    </label>
                )}

                <label className="flex items-center gap-3 cursor-pointer p-4 bg-astro-800 rounded-lg hover:bg-astro-700 transition-colors">
                    <input
                        type="checkbox"
                        checked={formData.exclusionCriteria?.excludeContacted || false}
                        onChange={(e) => updateFormData({
                            exclusionCriteria: { ...formData.exclusionCriteria, excludeContacted: e.target.checked }
                        })}
                        className="w-5 h-5"
                    />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                            Exclure leads déjà contactés dans d'autres campagnes
                        </p>
                        <p className="text-xs text-neutral-400">
                            Évite de contacter 2 fois la même personne
                        </p>
                    </div>
                </label>

                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Mots-clés à exclure (optionnel)
                    </label>
                    <Input
                        placeholder="Ex: concurrent, spam, test (séparés par des virgules)"
                        value={formData.exclusionCriteria?.excludeKeywords?.join(', ') || ''}
                        onChange={(e) => {
                            const keywords = e.target.value
                                .split(',')
                                .map(k => k.trim())
                                .filter(Boolean);
                            updateFormData({
                                exclusionCriteria: { ...formData.exclusionCriteria, excludeKeywords: keywords }
                            });
                        }}
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                        Exclut les leads contenant ces mots dans leur bio/description
                    </p>
                </div>
            </div>

            <div className="flex gap-3">
                <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft size={16} className="mr-2" />
                    Retour
                </Button>
                <Button onClick={handleNext} className="flex-1">
                    Continuer
                    <ArrowRight size={16} className="ml-2" />
                </Button>
            </div>
        </div>
    );

    // Step 5: Budget & Volume
    const renderBudgetStep = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Budget & Volume</h3>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Nombre de leads ciblés
                    </label>
                    <Input
                        type="number"
                        placeholder="Ex: 500"
                        value={formData.budget?.targetLeadCount || ''}
                        onChange={(e) => updateFormData({
                            budget: { ...formData.budget, targetLeadCount: parseInt(e.target.value) || 0 }
                        })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Budget max (crédits API)
                    </label>
                    <Input
                        type="number"
                        placeholder="Ex: 1000"
                        value={formData.budget?.maxCredits || ''}
                        onChange={(e) => updateFormData({
                            budget: { ...formData.budget, maxCredits: parseInt(e.target.value) || 0 }
                        })}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-white mb-3">
                    Urgence du lancement
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {URGENCY_OPTIONS.map(option => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => updateFormData({
                                budget: { ...formData.budget, urgency: option.value }
                            })}
                            className={`p-4 rounded-lg border-2 text-center transition-all ${formData.budget?.urgency === option.value
                                ? 'border-astro-gold bg-astro-gold/10'
                                : 'border-astro-700 bg-astro-800 hover:border-astro-gold/50'
                                }`}
                        >
                            <p className="text-sm font-semibold text-white mb-1">
                                {option.label}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-3">
                <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft size={16} className="mr-2" />
                    Retour
                </Button>
                <Button onClick={handleNext} className="flex-1">
                    Continuer
                    <ArrowRight size={16} className="ml-2" />
                </Button>
            </div>
        </div>
    );

    // Step 6: Scoring Priorities
    const renderScoringStep = () => {
        const priorities = formData.campaignType === 'b2c' ? B2C_PRIORITIES : B2B_PRIORITIES;

        return (
            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Priorités de Scoring</h3>

                <div>
                    <label className="block text-sm font-medium text-white mb-3">
                        Critère le plus important
                    </label>
                    <div className="space-y-2">
                        {priorities.map(priority => (
                            <button
                                key={priority.value}
                                type="button"
                                onClick={() => updateFormData({
                                    scoringPriorities: { ...formData.scoringPriorities, topPriority: priority.value }
                                })}
                                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${formData.scoringPriorities?.topPriority === priority.value
                                    ? 'border-astro-gold bg-astro-gold/10'
                                    : 'border-astro-700 bg-astro-800 hover:border-astro-gold/50'
                                    }`}
                            >
                                <p className="text-sm font-semibold text-white mb-1">
                                    {priority.label}
                                </p>
                                <p className="text-xs text-neutral-400">
                                    {priority.description}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-3">
                        Score minimal acceptable
                    </label>
                    <div className="space-y-2">
                        {MIN_SCORES.map(scoreOption => (
                            <button
                                key={scoreOption.value}
                                type="button"
                                onClick={() => updateFormData({
                                    scoringPriorities: { ...formData.scoringPriorities, minScore: scoreOption.value }
                                })}
                                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${formData.scoringPriorities?.minScore === scoreOption.value
                                    ? 'border-astro-gold bg-astro-gold/10'
                                    : 'border-astro-700 bg-astro-800 hover:border-astro-gold/50'
                                    }`}
                            >
                                <p className="text-sm font-semibold text-white mb-1">
                                    {scoreOption.label}
                                </p>
                                <p className="text-xs text-neutral-400">
                                    {scoreOption.description}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="ghost" onClick={handleBack}>
                        <ArrowLeft size={16} className="mr-2" />
                        Retour
                    </Button>
                    <Button onClick={handleNext} className="flex-1">
                        Voir l'estimation
                        <ArrowRight size={16} className="ml-2" />
                    </Button>
                </div>
            </div>
        );
    };

    // Step 7: Preview & Estimation
    const renderPreviewStep = () => {
        // Simple estimation logic
        const estimatedLeads = formData.budget?.targetLeadCount || 100;
        const qualificationRate = formData.scoringPriorities?.minScore === 90 ? 0.1 :
            formData.scoringPriorities?.minScore === 80 ? 0.2 :
                formData.scoringPriorities?.minScore === 80 ? 0.35 : 0.5;
        const qualifiedLeads = Math.round(estimatedLeads * qualificationRate);
        const estimatedCost = qualifiedLeads;

        return (
            <div className="space-y-6">
                <div className="text-center">
                    <Sparkles className="w-12 h-12 mx-auto text-astro-gold mb-3" />
                    <h3 className="text-2xl font-bold text-white mb-2">Estimation de Résultats</h3>
                    <p className="text-sm text-neutral-400">Basée sur vos critères</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="p-6 bg-astro-800 rounded-xl text-center">
                        <p className="text-3xl font-bold text-astro-gold">{estimatedLeads}</p>
                        <p className="text-xs text-neutral-500 mt-2">Leads à analyser</p>
                    </div>
                    <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
                        <p className="text-3xl font-bold text-green-400">{qualifiedLeads}</p>
                        <p className="text-xs text-neutral-500 mt-2">Leads qualifiés estimés</p>
                    </div>
                    <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center">
                        <p className="text-3xl font-bold text-blue-400">{estimatedCost}</p>
                        <p className="text-xs text-neutral-500 mt-2">Crédits API estimés</p>
                    </div>
                </div>

                {/* Summary */}
                <div className="p-4 bg-astro-800 rounded-xl space-y-3">
                    <h4 className="text-sm font-bold text-white">Résumé de votre campagne</h4>
                    <div className="space-y-2 text-sm">
                        <p><span className="text-neutral-400">Type:</span> <span className="text-white font-semibold">{formData.campaignType?.toUpperCase()}</span></p>
                        <p><span className="text-neutral-400">Nom:</span> <span className="text-white">{formData.name}</span></p>
                        <p><span className="text-neutral-400">Score minimal:</span> <span className="text-astro-gold font-bold">{formData.scoringPriorities?.minScore}/100</span></p>
                        {formData.b2bCriteria?.companySize && formData.b2bCriteria.companySize.length > 0 && (
                            <p><span className="text-neutral-400">Taille entreprise:</span> <span className="text-white">{formData.b2bCriteria.companySize.join(', ')}</span></p>
                        )}
                        {formData.b2cCriteria?.minFollowers && (
                            <p><span className="text-neutral-400">Followers min:</span> <span className="text-white">{formData.b2cCriteria.minFollowers.toLocaleString()}+</span></p>
                        )}
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="ghost" onClick={handleBack}>
                        <ArrowLeft size={16} className="mr-2" />
                        Modifier
                    </Button>
                    <Button onClick={handleComplete} className="flex-1">
                        <Check size={16} className="mr-2" />
                        Créer la Campagne
                    </Button>
                </div>
            </div>
        );
    };

    // Render current step
    const renderCurrentStep = () => {
        switch (currentStep) {
            case 'type': return renderTypeStep();
            case 'basic': return renderBasicStep();
            case 'qualification': return renderQualificationStep();
            case 'exclusion': return renderExclusionStep();
            case 'budget': return renderBudgetStep();
            case 'scoring': return renderScoringStep();
            case 'preview': return renderPreviewStep();
            default: return null;
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            {renderCurrentStep()}
        </div>
    );
};

/**
 * Internationalization translations
 * FR = Default, EN = Available
 */

export const translations = {
    fr: {
        // Founding Member Page
        foundingMember: {
            badge: '⚡ Places Limitées - Programme Membres Fondateurs',
            hero: {
                title: 'Construisez Votre Stack Lead Gen',
                subtitle: 'De Manière Composable',
                description: 'Rejoignez 50 équipes techniques qui testent l\'alternative API-first à ZoomInfo. Obtenez',
                free: '3 mois gratuits',
                support: '+ support prioritaire.',
            },
            benefits: {
                noCard: 'Sans carte bancaire',
                fullApi: 'API complète',
                cancel: 'Annulation libre',
            },
            cards: {
                free: {
                    title: '3 Mois Gratuits',
                    description: 'Accès Pro complet (valeur 149€/mois). Sans engagement.',
                },
                ready: {
                    title: 'n8n/Make Ready',
                    description: 'Templates pré-construits pour démarrer en minutes.',
                },
                priority: {
                    title: 'Support Prioritaire',
                    description: 'Accès direct aux fondateurs + Discord Membres Fondateurs.',
                },
            },
            form: {
                title: 'Postuler au Programme Membres Fondateurs',
                email: 'Email Professionnel *',
                emailPlaceholder: 'vous@entreprise.com',
                company: 'Nom de l\'Entreprise *',
                companyPlaceholder: 'Acme Inc',
                role: 'Votre Rôle *',
                rolePlaceholder: 'ex: Growth Engineer, Founder, CTO',
                useCase: 'Use Case Principal *',
                useCasePlaceholder: 'ex: Lead gen pour équipe SaaS, prospection agence, pipeline scoring custom...',
                techStack: 'Stack Technique (optionnel)',
                techStackPlaceholder: 'ex: n8n, HubSpot, Slack, scripts Python...',
                submit: 'Postuler au Programme',
                terms: 'En postulant, vous acceptez de tester la plateforme et fournir un feedback. Nous vous inviterons à laisser un avis après votre premier lead qualifié.',
            },
            success: {
                title: 'Candidature Reçue! 🎉',
                subtitle: 'Nous examinerons votre candidature sous 24h et vous enverrons vos accès.',
                checkInbox: 'Vérifiez votre boîte mail pour:',
                welcome: 'Email de bienvenue avec guide setup',
                credentials: 'Identifiants API (3 mois gratuits)',
                discord: 'Invitation Discord Membres Fondateurs',
            },
            social: {
                trusted: 'Utilisé par des équipes techniques chez',
                yc: 'Startups YC',
                saas: 'Scale-ups SaaS',
                agencies: 'Agences Growth',
            },
        },
        // Common
        common: {
            loading: 'Chargement...',
            error: 'Erreur',
            success: 'Succès',
            cancel: 'Annuler',
            save: 'Enregistrer',
            delete: 'Supprimer',
            edit: 'Modifier',
        },
    },
    en: {
        // Founding Member Page
        foundingMember: {
            badge: '⚡ Limited Spots - Founding Member Program',
            hero: {
                title: 'Build Your Lead Gen Stack',
                subtitle: 'The Composable Way',
                description: 'Join 50 technical teams testing the API-first alternative to ZoomInfo. Get',
                free: '3 months free',
                support: '+ priority support.',
            },
            benefits: {
                noCard: 'No credit card',
                fullApi: 'Full API access',
                cancel: 'Cancel anytime',
            },
            cards: {
                free: {
                    title: '3 Months Free',
                    description: 'Full Pro access ($149/mo value). No strings attached.',
                },
                ready: {
                    title: 'n8n/Make Ready',
                    description: 'Pre-built templates to get started in minutes.',
                },
                priority: {
                    title: 'Priority Support',
                    description: 'Direct access to founders + Founding Member Discord.',
                },
            },
            form: {
                title: 'Apply for Founding Member Program',
                email: 'Work Email *',
                emailPlaceholder: 'you@company.com',
                company: 'Company Name *',
                companyPlaceholder: 'Acme Inc',
                role: 'Your Role *',
                rolePlaceholder: 'e.g., Growth Engineer, Technical Founder, CTO',
                useCase: 'Primary Use Case *',
                useCasePlaceholder: 'e.g., Lead gen for SaaS sales team, prospecting for agency clients, building custom lead scoring pipeline...',
                techStack: 'Current Tech Stack (optional)',
                techStackPlaceholder: 'e.g., n8n, HubSpot, Slack, Python scripts...',
                submit: 'Apply for Program',
                terms: 'By applying, you agree to test the platform and provide feedback. We\'ll invite you to leave a review after your first qualified lead.',
            },
            success: {
                title: 'Application Received! 🎉',
                subtitle: 'We\'ll review your application within 24h and send you access credentials.',
                checkInbox: 'Check your inbox for:',
                welcome: 'Welcome email with setup guide',
                credentials: 'API credentials (3 months free)',
                discord: 'Founding Member Discord invite',
            },
            social: {
                trusted: 'Trusted by technical teams at',
                yc: 'YC Startups',
                saas: 'SaaS Scale-ups',
                agencies: 'Growth Agencies',
            },
        },
        // Common
        common: {
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            cancel: 'Cancel',
            save: 'Save',
            delete: 'Delete',
            edit: 'Edit',
        },
    },
};

export type Language = 'fr' | 'en';

export function t(key: string, lang: Language = 'fr'): string {
    const keys = key.split('.');
    let value: any = translations[lang];

    for (const k of keys) {
        value = value?.[k];
    }

    return value || key;
}

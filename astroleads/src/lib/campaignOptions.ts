/**
 * Campaign Qualification Options & Constants
 */

// B2B Options
export const COMPANY_SIZES = [
    { value: 'TPE', label: 'TPE (1-10 employés)', icon: '🏪' },
    { value: 'PME', label: 'PME (11-250 employés)', icon: '🏢' },
    { value: 'ETI', label: 'ETI (251-5000 employés)', icon: '🏭' },
    { value: 'GE', label: 'Grande Entreprise (5000+)', icon: '🏛️' },
];

export const BUSINESS_SECTORS = [
    'Tech & SaaS',
    'Finance & Banque',
    'Santé & Pharma',
    'Retail & E-commerce',
    'Industrie & Manufacturing',
    'Services Professionnels',
    'Éducation & Formation',
    'Marketing & Publicité',
    'Immobilier',
    'Énergie',
    'Transport & Logistique',
    'Autre',
];

export const TARGET_POSITIONS = [
    { value: 'CEO', label: 'CEO / Président', seniority: 'C-Level' },
    { value: 'CTO', label: 'CTO / Directeur Technique', seniority: 'C-Level' },
    { value: 'CFO', label: 'CFO / Directeur Financier', seniority: 'C-Level' },
    { value: 'CMO', label: 'CMO / Directeur Marketing', seniority: 'C-Level' },
    { value: 'COO', label: 'COO / Directeur Opérations', seniority: 'C-Level' },
    { value: 'VP Sales', label: 'VP Sales', seniority: 'VP' },
    { value: 'VP Marketing', label: 'VP Marketing', seniority: 'VP' },
    { value: 'VP Engineering', label: 'VP Engineering', seniority: 'VP' },
    { value: 'Director Sales', label: 'Sales Director', seniority: 'Director' },
    { value: 'Director Marketing', label: 'Marketing Director', seniority: 'Director' },
    { value: 'Sales Manager', label: 'Sales Manager', seniority: 'Manager' },
    { value: 'Marketing Manager', label: 'Marketing Manager', seniority: 'Manager' },
    { value: 'Product Manager', label: 'Product Manager', seniority: 'Manager' },
];

export const SENIORITY_LEVELS = [
    { value: 'C-Level', label: 'C-Level (CEO, CTO, CFO...)', weight: 100 },
    { value: 'VP', label: 'Vice-Président', weight: 75 },
    { value: 'Director', label: 'Directeur', weight: 60 },
    { value: 'Manager', label: 'Manager', weight: 40 },
    { value: 'IC', label: 'Individual Contributor', weight: 20 },
];

export const REVENUE_RANGES = [
    { value: '<1M', label: 'Moins de 1M€' },
    { value: '1-10M', label: '1M€ - 10M€' },
    { value: '10-100M', label: '10M€ - 100M€' },
    { value: '>100M', label: 'Plus de 100M€' },
];

// B2C Options
export const FOLLOWER_RANGES = [
    { value: 1000, label: '1k+ followers (Micro)' },
    { value: 10000, label: '10k+ followers (Influenceur)' },
    { value: 50000, label: '50k+ followers (Macro)' },
    { value: 100000, label: '100k+ followers (Mega)' },
    { value: 500000, label: '500k+ followers (Célébrité)' },
];

export const ENGAGEMENT_RATES = [
    { value: 1, label: '1%+ (Minimum)' },
    { value: 2, label: '2%+ (Bon)' },
    { value: 5, label: '5%+ (Très bon)' },
    { value: 10, label: '10%+ (Excellent)' },
];

export const INFLUENCER_CATEGORIES = [
    { value: 'Beauty', label: 'Beauté & Cosmétiques', icon: '💄' },
    { value: 'Fashion', label: 'Mode & Style', icon: '👗' },
    { value: 'Tech', label: 'Tech & Gadgets', icon: '📱' },
    { value: 'Food', label: 'Food & Cuisine', icon: '🍔' },
    { value: 'Travel', label: 'Voyage & Aventure', icon: '✈️' },
    { value: 'Fitness', label: 'Fitness & Sport', icon: '💪' },
    { value: 'Lifestyle', label: 'Lifestyle', icon: '✨' },
    { value: 'Gaming', label: 'Gaming & Esport', icon: '🎮' },
    { value: 'Business', label: 'Business & Entrepreneuriat', icon: '💼' },
    { value: 'Entertainment', label: 'Entertainment', icon: '🎬' },
];

export const AGE_RANGES = [
    { value: '13-17', label: '13-17 ans (Ados)' },
    { value: '18-24', label: '18-24 ans (Jeunes adultes)' },
    { value: '25-34', label: '25-34 ans (Millennials)' },
    { value: '35-44', label: '35-44 ans' },
    { value: '45-54', label: '45-54 ans' },
    { value: '55+', label: '55+ ans (Seniors)' },
];

export const LANGUAGES = [
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'en', label: 'Anglais', flag: '🇬🇧' },
    { value: 'es', label: 'Espagnol', flag: '🇪🇸' },
    { value: 'de', label: 'Allemand', flag: '🇩🇪' },
    { value: 'it', label: 'Italien', flag: '🇮🇹' },
    { value: 'pt', label: 'Portugais', flag: '🇵🇹' },
    { value: 'ar', label: 'Arabe', flag: '🇸🇦' },
];

// Budget & Urgency
export const URGENCY_OPTIONS = [
    { value: 'immediate', label: '🚀 Immédiat (Aujourd\'hui)', days: 0 },
    { value: 'week', label: '📅 Cette semaine', days: 7 },
    { value: 'month', label: '🗓️ Ce mois', days: 30 },
];

// Scoring Priorities
export const B2B_PRIORITIES = [
    { value: 'position', label: 'Poste (Décideur)', description: 'Prioriser les CEO, CTO, VP...' },
    { value: 'company_size', label: 'Taille d\'entreprise', description: 'Prioriser les entreprises de la bonne taille' },
    { value: 'sector', label: 'Secteur d\'activité', description: 'Prioriser le secteur ciblé' },
    { value: 'email', label: 'Email professionnel', description: 'Prioriser les emails @entreprise.com' },
    { value: 'linkedin', label: 'Présence LinkedIn', description: 'Prioriser les profils LinkedIn complets' },
];

export const B2C_PRIORITIES = [
    { value: 'followers', label: 'Nombre de followers', description: 'Prioriser la taille de l\'audience' },
    { value: 'engagement', label: 'Taux d\'engagement', description: 'Prioriser l\'interaction' },
    { value: 'verified', label: 'Compte vérifié', description: 'Prioriser les comptes vérifiés' },
    { value: 'category', label: 'Catégorie/Niche', description: 'Prioriser la bonne catégorie' },
    { value: 'content_quality', label: 'Qualité du contenu', description: 'Prioriser le contenu professionnel' },
];

export const MIN_SCORES = [
    { value: 70, label: '70/100 (Large)', description: 'Accepte plus de leads, qualité moyenne' },
    { value: 75, label: '75/100 (Équilibré)', description: 'Bon équilibre quantité/qualité' },
    { value: 80, label: '80/100 (Sélectif)', description: 'Qualité au-dessus de la moyenne' },
    { value: 85, label: '85/100 (Strict)', description: 'Haute qualité uniquement' },
    { value: 90, label: '90/100 (Très strict)', description: 'Très haute qualité, peu de leads' },
];

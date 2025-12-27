import React from 'react';
import { LayoutTemplate, Star, Clock, Users, ArrowRight } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { useNavigate } from 'react-router-dom';

interface Template {
    id: number;
    name: string;
    description: string;
    category: string;
    tags: string[];
    rating: number;
    usageCount: number;
    estimatedTime: number;
    isFeatured: boolean;
    isPremium: boolean;
}

const TEMPLATES: Template[] = [
    {
        id: 1,
        name: 'Prospection LinkedIn B2B',
        description: 'Trouvez et contactez des décideurs B2B sur LinkedIn',
        category: 'LinkedIn',
        tags: ['B2B', 'Outreach', 'Automation'],
        rating: 4.8,
        usageCount: 12500,
        estimatedTime: 30,
        isFeatured: true,
        isPremium: false,
    },
    {
        id: 2,
        name: 'Cold Email SaaS',
        description: 'Séquences d\'emails optimisées pour les entreprises SaaS',
        category: 'Email',
        tags: ['SaaS', 'Cold Email', 'Sequences'],
        rating: 4.9,
        usageCount: 8300,
        estimatedTime: 20,
        isFeatured: true,
        isPremium: true,
    },
    {
        id: 3,
        name: 'Lead Scoring Automatique',
        description: 'Qualifiez automatiquement vos leads avec l\'IA',
        category: 'Automation',
        tags: ['AI', 'Scoring', 'Qualification'],
        rating: 4.7,
        usageCount: 5200,
        estimatedTime: 45,
        isFeatured: false,
        isPremium: true,
    },
    {
        id: 4,
        name: 'Scraping Google Maps',
        description: 'Extrayez des leads d\'entreprises locales depuis Google Maps',
        category: 'Scraping',
        tags: ['Local', 'Maps', 'Business'],
        rating: 4.6,
        usageCount: 9800,
        estimatedTime: 15,
        isFeatured: false,
        isPremium: false,
    },
    {
        id: 5,
        name: 'Campagne Multi-Canal',
        description: 'Orchestrez des campagnes sur Email, LinkedIn et Twitter',
        category: 'Multi-Canal',
        tags: ['Omnichannel', 'Automation', 'Sequences'],
        rating: 4.9,
        usageCount: 3200,
        estimatedTime: 60,
        isFeatured: true,
        isPremium: true,
    },
    {
        id: 6,
        name: 'Enrichissement de Données',
        description: 'Enrichissez vos leads avec des données de contact vérifiées',
        category: 'Data',
        tags: ['Enrichment', 'Verification', 'Data'],
        rating: 4.5,
        usageCount: 6700,
        estimatedTime: 10,
        isFeatured: false,
        isPremium: false,
    },
];

const CATEGORIES = ['Tous', 'LinkedIn', 'Email', 'Automation', 'Scraping', 'Multi-Canal', 'Data'];

const Templates: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = React.useState('Tous');

    const filteredTemplates = selectedCategory === 'Tous'
        ? TEMPLATES
        : TEMPLATES.filter((t) => t.category === selectedCategory);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <LayoutTemplate className="text-astro-gold" />
                    Modèles de Campagne
                </h1>
                <p className="text-neutral-500">
                    Lancez rapidement vos campagnes avec des modèles pré-configurés
                </p>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${selectedCategory === cat
                            ? 'bg-astro-gold text-black font-bold'
                            : 'bg-astro-800 text-neutral-400 hover:text-white border border-astro-700'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                    <Card
                        key={template.id}
                        variant={template.isFeatured ? 'featured' : 'default'}
                        className="relative group"
                    >
                        {template.isPremium && (
                            <Badge variant="premium" className="absolute top-4 right-4">
                                Premium
                            </Badge>
                        )}

                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
                            <p className="text-sm text-neutral-400">{template.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {template.tags.map((tag) => (
                                <Badge key={tag} variant="default" size="sm">
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        <div className="flex items-center justify-between text-xs text-neutral-500 mb-4">
                            <div className="flex items-center gap-1">
                                <Star size={14} className="text-yellow-400" fill="currentColor" />
                                <span>{template.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users size={14} />
                                <span>{template.usageCount.toLocaleString()} utilisations</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>{template.estimatedTime} min</span>
                            </div>
                        </div>

                        <Button
                            variant="secondary"
                            className="w-full group-hover:bg-astro-gold/10 group-hover:border-astro-gold group-hover:text-astro-gold"
                            rightIcon={<ArrowRight size={16} />}
                            onClick={() => navigate(`/campaigns?template=${template.id}`)}
                        >
                            Utiliser ce modèle
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Templates;

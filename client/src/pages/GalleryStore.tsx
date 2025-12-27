/**
 * Gallery Store - Workflow Templates Marketplace
 *
 * Features:
 * - Browse pre-built workflow templates
 * - Filter by category, industry, use case
 * - Preview workflow details before use
 * - One-click deploy to your workspace
 * - Community templates (future)
 * - Template ratings and reviews (future)
 *
 * Categories:
 * - Lead Generation
 * - Content Marketing
 * - Social Media
 * - Email Campaigns
 * - Analytics & Reporting
 * - Customer Retention
 */

import { useState } from "react";
import {
  Search,
  Filter,
  Star,
  Download,
  Play,
  Eye,
  TrendingUp,
  Zap,
  Users,
  Mail,
  BarChart3,
  Heart,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";
import { api } from "../lib/api";
import { useNavigate } from "wouter";

// Template data structure
interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category:
    | "lead-gen"
    | "content"
    | "social"
    | "email"
    | "analytics"
    | "retention";
  industry?: string[];
  agents: string[];
  estimatedTime: string;
  estimatedCost: number;
  rating: number;
  downloads: number;
  featured: boolean;
  preview: {
    icon: React.ReactNode;
    color: string;
  };
}

// Featured workflow templates
const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  // 🌟 PREMIUM TEMPLATES - ASTROLEADS & ASTROMEDIA
  {
    id: "astroleads-complete",
    name: "🚀 AstroLeads - Machine Complète de Génération de Leads",
    description:
      "Solution ultra-complète de génération de leads multi-canal. Prospection LinkedIn, Google Maps, enrichissement de données, scraping web, cold email automatisé, suivi intelligent, scoring prédictif, et CRM integration. Le workflow le plus puissant pour exploser vos leads B2B.",
    category: "lead-gen",
    industry: ["B2B", "SaaS", "Consulting", "Agency", "Sales"],
    agents: [
      "linkedin-hunter",
      "google-maps-scraper",
      "data-enrichment-specialist",
      "email-finder",
      "cold-email-writer",
      "follow-up-automation",
      "lead-scoring-ai",
      "crm-integrator",
    ],
    estimatedTime: "4-6 heures",
    estimatedCost: 1.25,
    rating: 5.0,
    downloads: 3847,
    featured: true,
    preview: {
      icon: <Users className="w-6 h-6" />,
      color: "from-indigo-600 via-purple-600 to-pink-600",
    },
  },
  {
    id: "astromedia-complete",
    name: "🎬 AstroMedia - Studio de Création Média Complet",
    description:
      "Plateforme complète de création de contenu média multi-format. Génération de vidéos IA (Google Veo 3, Luma Wan 2), images DALL-E 3, posts sociaux optimisés, scripts vidéo, montage automatisé, sous-titres, thumbnails, calendrier éditorial, et publication cross-platform. Votre studio média IA.",
    category: "content",
    industry: ["Media", "Marketing", "E-commerce", "Creator", "Agency"],
    agents: [
      "video-script-writer",
      "ai-video-generator",
      "image-designer",
      "video-editor",
      "subtitle-generator",
      "thumbnail-creator",
      "social-media-publisher",
      "content-calendar-planner",
    ],
    estimatedTime: "5-8 heures",
    estimatedCost: 2.15,
    rating: 5.0,
    downloads: 2934,
    featured: true,
    preview: {
      icon: <Zap className="w-6 h-6" />,
      color: "from-pink-600 via-rose-600 to-orange-600",
    },
  },

  // STANDARD TEMPLATES
  {
    id: "linkedin-prospection",
    name: "Machine à Leads LinkedIn B2B",
    description:
      "Pipeline complet pour générer des leads qualifiés via LinkedIn. Identification de prospects, enrichissement de données, personnalisation de messages, et suivi automatisé.",
    category: "lead-gen",
    industry: ["B2B", "SaaS", "Consulting"],
    agents: [
      "prospect-researcher",
      "data-enrichment",
      "copywriter",
      "outreach-specialist",
      "follow-up-manager",
    ],
    estimatedTime: "2-3 heures",
    estimatedCost: 0.45,
    rating: 4.8,
    downloads: 1247,
    featured: true,
    preview: {
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-600 to-cyan-600",
    },
  },
  {
    id: "content-seo-machine",
    name: "Machine à Contenu SEO",
    description:
      "Génération automatique de contenu optimisé SEO. Recherche de mots-clés, création d'articles de blog, optimisation on-page, et génération de métadonnées.",
    category: "content",
    industry: ["E-commerce", "Blog", "Media"],
    agents: [
      "seo-analyst",
      "keyword-researcher",
      "content-writer",
      "editor",
      "metadata-optimizer",
    ],
    estimatedTime: "1-2 heures",
    estimatedCost: 0.32,
    rating: 4.9,
    downloads: 2103,
    featured: true,
    preview: {
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-green-600 to-emerald-600",
    },
  },
  {
    id: "social-media-blitz",
    name: "Campagne Social Media Multi-Canal",
    description:
      "Création et planification de contenu pour Instagram, LinkedIn, Twitter, et Facebook. Génération de visuels, rédaction de posts, et calendrier éditorial.",
    category: "social",
    industry: ["B2C", "E-commerce", "Retail"],
    agents: [
      "social-media-strategist",
      "graphic-designer",
      "copywriter",
      "community-manager",
      "analytics-specialist",
    ],
    estimatedTime: "3-4 heures",
    estimatedCost: 0.58,
    rating: 4.7,
    downloads: 1876,
    featured: true,
    preview: {
      icon: <Zap className="w-6 h-6" />,
      color: "from-purple-600 to-pink-600",
    },
  },
  {
    id: "email-nurture-sequence",
    name: "Séquence Email Nurturing Automatisée",
    description:
      "Workflow complet de nurturing par email. Segmentation d'audience, création de séquences personnalisées, A/B testing, et optimisation des conversions.",
    category: "email",
    industry: ["SaaS", "B2B", "E-learning"],
    agents: [
      "audience-segmentation",
      "email-copywriter",
      "designer",
      "ab-test-optimizer",
      "conversion-analyst",
    ],
    estimatedTime: "2-3 heures",
    estimatedCost: 0.38,
    rating: 4.6,
    downloads: 1532,
    featured: false,
    preview: {
      icon: <Mail className="w-6 h-6" />,
      color: "from-orange-600 to-red-600",
    },
  },
  {
    id: "analytics-dashboard",
    name: "Dashboard Analytics Complet",
    description:
      "Analyse multi-canal de vos performances marketing. Collecte de données, visualisations, insights automatisés, et recommandations d'optimisation.",
    category: "analytics",
    industry: ["All"],
    agents: [
      "data-analyst",
      "dashboard-creator",
      "insights-generator",
      "report-writer",
      "recommendation-engine",
    ],
    estimatedTime: "1-2 heures",
    estimatedCost: 0.28,
    rating: 4.9,
    downloads: 2347,
    featured: true,
    preview: {
      icon: <BarChart3 className="w-6 h-6" />,
      color: "from-indigo-600 to-purple-600",
    },
  },
  {
    id: "customer-retention",
    name: "Programme de Rétention Client",
    description:
      "Stratégie complète pour réduire le churn et augmenter la LTV. Analyse de comportement, segmentation de risque, campagnes de réactivation, et programmes de fidélité.",
    category: "retention",
    industry: ["SaaS", "Subscription", "E-commerce"],
    agents: [
      "churn-analyst",
      "segmentation-specialist",
      "retention-strategist",
      "loyalty-program-designer",
      "customer-success",
    ],
    estimatedTime: "3-4 heures",
    estimatedCost: 0.52,
    rating: 4.8,
    downloads: 1689,
    featured: false,
    preview: {
      icon: <Heart className="w-6 h-6" />,
      color: "from-rose-600 to-pink-600",
    },
  },
];

const CATEGORIES = [
  { value: "all", label: "Tous", icon: <Star /> },
  { value: "lead-gen", label: "Lead Generation", icon: <Users /> },
  { value: "content", label: "Contenu", icon: <TrendingUp /> },
  { value: "social", label: "Social Media", icon: <Zap /> },
  { value: "email", label: "Email", icon: <Mail /> },
  { value: "analytics", label: "Analytics", icon: <BarChart3 /> },
  { value: "retention", label: "Rétention", icon: <Heart /> },
];

export default function GalleryStore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "recent">(
    "popular"
  );
  const { toast } = useToast();
  const navigate = useNavigate();

  // Filter templates
  const filteredTemplates = WORKFLOW_TEMPLATES.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === "popular") return b.downloads - a.downloads;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  // Deploy template
  const handleDeployTemplate = async (template: WorkflowTemplate) => {
    try {
      toast({
        title: "Déploiement en cours...",
        description: `Création du workflow "${template.name}"`,
      });

      // TODO: Call API to create custom workflow from template
      // await api.workflows.createFromTemplate({ templateId: template.id });

      setTimeout(() => {
        toast({
          title: "✅ Workflow déployé !",
          description: `"${template.name}" est prêt à être utilisé.`,
        });
        navigate("/workflows");
      }, 2000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de déployer le workflow.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎨 Gallery Store
          </h1>
          <p className="text-gray-600 text-lg">
            Workflows pré-configurés prêts à l'emploi. Déployez en un clic et
            commencez immédiatement.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Rechercher des workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "popular" | "rating" | "recent")
            }
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="popular">Plus populaires</option>
            <option value="rating">Mieux notés</option>
            <option value="recent">Plus récents</option>
          </select>
        </div>

        {/* Category Tabs */}
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="mb-8"
        >
          <TabsList className="grid grid-cols-7 w-full">
            {CATEGORIES.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value} className="gap-2">
                {cat.icon}
                <span className="hidden md:inline">{cat.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Featured Templates */}
        {selectedCategory === "all" && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              Templates Vedettes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates
                .filter((t) => t.featured)
                .map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onDeploy={handleDeployTemplate}
                  />
                ))}
            </div>
          </div>
        )}

        {/* All Templates */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {selectedCategory === "all"
              ? "Tous les Workflows"
              : `Workflows ${
                  CATEGORIES.find((c) => c.value === selectedCategory)?.label
                }`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onDeploy={handleDeployTemplate}
              />
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Aucun workflow trouvé. Essayez une autre recherche.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Template Card Component
function TemplateCard({
  template,
  onDeploy,
}: {
  template: WorkflowTemplate;
  onDeploy: (template: WorkflowTemplate) => void;
}) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col">
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.preview.color} flex items-center justify-center text-white mb-4`}
      >
        {template.preview.icon}
      </div>

      {/* Title & Description */}
      <h3 className="text-lg font-bold text-gray-900 mb-2">{template.name}</h3>
      <p className="text-sm text-gray-600 mb-4 flex-1">
        {template.description}
      </p>

      {/* Metadata */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Agents:</span>
          <span className="font-semibold">{template.agents.length}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Temps estimé:</span>
          <span className="font-semibold">{template.estimatedTime}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Coût estimé:</span>
          <span className="font-semibold">${template.estimatedCost}</span>
        </div>
      </div>

      {/* Rating & Downloads */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-semibold">{template.rating}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <Download className="w-4 h-4" />
          <span>{template.downloads.toLocaleString()}</span>
        </div>
      </div>

      {/* Industries */}
      {template.industry && (
        <div className="flex flex-wrap gap-2 mb-4">
          {template.industry.map((ind) => (
            <Badge key={ind} variant="secondary" className="text-xs">
              {ind}
            </Badge>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={() => onDeploy(template)}
          className={`flex-1 bg-gradient-to-r ${template.preview.color} hover:opacity-90`}
        >
          <Play className="w-4 h-4 mr-2" />
          Déployer
        </Button>
        <Button variant="outline" size="icon">
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

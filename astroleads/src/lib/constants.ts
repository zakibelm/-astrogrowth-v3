import {
    LayoutDashboard,
    Users,
    Send,
    Settings,
    BarChart3,
    Zap,
    Bot,
    LayoutTemplate,
} from 'lucide-react';
import type { NavItem, DashboardStats } from '@/types';

export const APP_NAME = 'AstroLeads';

export const NAV_ITEMS: NavItem[] = [
    { label: 'Tableau de bord', path: '/', icon: LayoutDashboard },
    { label: 'Campagnes', path: '/campaigns', icon: Send },
    { label: 'Modèles', path: '/templates', icon: LayoutTemplate },
    { label: 'Équipe Agents', path: '/agents', icon: Bot },
    { label: 'Suivi des Leads', path: '/leads', icon: Users },
    { label: 'Analytique', path: '/analytics', icon: BarChart3 },
    { label: 'AI Studio', path: '/ai-studio', icon: Zap },
    { label: 'Paramètres', path: '/settings', icon: Settings },
];

export const MOCK_STATS: DashboardStats = {
    totalLeads: 12450,
    activeCampaigns: 8,
    avgOpenRate: 42.5,
    conversionsThisMonth: 342,
};

// Chart colors
export const CHART_COLORS = {
    primary: '#FFD700',
    secondary: '#2DD4BF',
    accent: '#6366f1',
    danger: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
};

// Platform options
export const PLATFORMS = ['LinkedIn', 'Email', 'X', 'Instagram', 'Facebook', 'TikTok'] as const;

// Status colors mapping
export const STATUS_COLORS = {
    BROUILLON: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
    ACTIF: 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]',
    PAUSE: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    TERMINÉ: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

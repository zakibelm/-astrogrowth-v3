import React from 'react';
import {
    TrendingUp,
    Users,
    Send,
    Target,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Card, Badge } from '@/components/ui';
import { useCampaignStore, useLeadStore } from '@/stores';
import { formatNumber, formatPercentage } from '@/utils';
import { MOCK_STATS, CHART_COLORS } from '@/lib/constants';

// Sample chart data
const chartData = [
    { name: 'Jan', leads: 400, engagement: 240 },
    { name: 'Fév', leads: 300, engagement: 139 },
    { name: 'Mar', leads: 200, engagement: 980 },
    { name: 'Avr', leads: 278, engagement: 390 },
    { name: 'Mai', leads: 189, engagement: 480 },
    { name: 'Juin', leads: 239, engagement: 380 },
    { name: 'Juil', leads: 349, engagement: 430 },
];

interface StatCardProps {
    title: string;
    value: string | number;
    change: number;
    icon: React.ReactNode;
    trend: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, trend }) => (
    <Card className="relative overflow-hidden group">
        <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-astro-gold/10 border border-astro-gold/20 flex items-center justify-center text-astro-gold group-hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-shadow">
                {icon}
            </div>
            <Badge variant={trend === 'up' ? 'success' : 'danger'} size="sm">
                {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {change}%
            </Badge>
        </div>
        <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">
            {title}
        </p>
        <p className="text-3xl font-bold text-white">{value}</p>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-astro-gold/5 rounded-full blur-2xl group-hover:bg-astro-gold/10 transition-colors" />
    </Card>
);

const Dashboard: React.FC = () => {
    const campaigns = useCampaignStore((state) => state.campaigns);
    const leads = useLeadStore((state) => state.leads);

    const activeCampaigns = campaigns.filter((c) => c.status === 'ACTIF').length;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                    Tableau de bord
                </h1>
                <p className="text-neutral-500">
                    Vue d'ensemble de vos campagnes et prospects
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Prospects"
                    value={formatNumber(leads.length + MOCK_STATS.totalLeads)}
                    change={12.5}
                    trend="up"
                    icon={<Users size={24} />}
                />
                <StatCard
                    title="Campagnes Actives"
                    value={activeCampaigns || MOCK_STATS.activeCampaigns}
                    change={8.2}
                    trend="up"
                    icon={<Send size={24} />}
                />
                <StatCard
                    title="Taux d'Ouverture"
                    value={formatPercentage(MOCK_STATS.avgOpenRate)}
                    change={-2.1}
                    trend="down"
                    icon={<Target size={24} />}
                />
                <StatCard
                    title="Conversions"
                    value={formatNumber(MOCK_STATS.conversionsThisMonth)}
                    change={15.3}
                    trend="up"
                    icon={<TrendingUp size={24} />}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-lg font-semibold text-white mb-6">
                        Acquisition de Leads
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                            <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666' }} />
                            <YAxis stroke="#666" tick={{ fill: '#666' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e1e1e',
                                    border: '1px solid rgba(255,215,0,0.2)',
                                    borderRadius: '12px',
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="leads"
                                stroke={CHART_COLORS.primary}
                                fillOpacity={1}
                                fill="url(#colorLeads)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-white mb-6">
                        Engagement
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                            <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666' }} />
                            <YAxis stroke="#666" tick={{ fill: '#666' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e1e1e',
                                    border: '1px solid rgba(45,212,191,0.2)',
                                    borderRadius: '12px',
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="engagement"
                                stroke={CHART_COLORS.secondary}
                                fillOpacity={1}
                                fill="url(#colorEngagement)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <h3 className="text-lg font-semibold text-white mb-6">Activité Récente</h3>
                <div className="space-y-4">
                    {[
                        { action: 'Nouvelle campagne créée', target: 'Prospection Q4', time: 'Il y a 2h' },
                        { action: 'Lead converti', target: 'Sarah Connor - Cyberdyne', time: 'Il y a 5h' },
                        { action: 'Email envoyé', target: 'Campagne Startup', time: 'Il y a 8h' },
                    ].map((activity, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                            <div>
                                <p className="text-sm text-white font-medium">{activity.action}</p>
                                <p className="text-xs text-neutral-500">{activity.target}</p>
                            </div>
                            <span className="text-xs text-neutral-500">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;

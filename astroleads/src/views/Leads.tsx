import React from 'react';
import { Search, Filter, Mail, Star } from 'lucide-react';
import { Card, Input, Button, useToast, VerificationBadge, CompanyLogo, LocalTimeBadge } from '@/components/ui';
import { LeadDetailsModal } from '@/components/leads/LeadDetailsModal';
import { useLeadStore } from '@/stores';
import { LeadStatus } from '@/types';

const Leads: React.FC = () => {
    const { leads, filters, setFilter, getFilteredLeads, updateStatus, fetchLeads } = useLeadStore();
    const toast = useToast();
    const [selectedLeadForModal, setSelectedLeadForModal] = React.useState<import('@/types').Lead | null>(null);

    React.useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    const filteredLeads = getFilteredLeads();

    const handleStatusChange = (id: string, newStatus: LeadStatus) => {
        updateStatus(id, newStatus);
        toast.success('Statut mis à jour');
    };

    const handleVerifyEmail = async (lead: import('@/types').Lead) => {
        if (!lead.email) return;

        try {
            // Optimistic update (loading state handled inside badge if we passed a loading prop, 
            // but for now we'll just toast)
            toast.info('Vérification en cours...');

            // Dynamic import to avoid circular dependency issues if any
            const { verifyEmail } = await import('@/services/verificationService');
            const result = await verifyEmail(lead.email);

            // Update local store
            useLeadStore.getState().updateLead(lead.id, {
                verification_status: result.status,
                verification_score: result.score,
                last_verified_at: new Date().toISOString()
            });

            if (result.status === 'valid') {
                toast.success('Email valide !');
            } else if (result.status === 'invalid') {
                toast.error('Email invalide');
            } else {
                toast.warning('Email risqué ou inconnu');
            }
        } catch (error) {
            console.error(error);
            toast.error('Erreur lors de la vérification');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Prospects</h1>
                <p className="text-neutral-500">Gérez et qualifiez vos prospects</p>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Rechercher un prospect..."
                        leftIcon={<Search size={18} />}
                        value={filters.search}
                        onChange={(e) => setFilter({ search: e.target.value })}
                    />
                </div>
                <Button variant="secondary" leftIcon={<Filter size={18} />}>
                    Filtres
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.values(LeadStatus).map((status) => {
                    const count = leads.filter((l) => l.status === status).length;
                    return (
                        <button
                            key={status}
                            onClick={() => setFilter({ status: filters.status === status ? null : status })}
                            className={`p-4 rounded-xl border transition-all ${filters.status === status
                                ? 'bg-astro-gold/10 border-astro-gold'
                                : 'bg-astro-800/50 border-astro-700 hover:border-astro-600'
                                }`}
                        >
                            <p className="text-2xl font-bold text-white">{count}</p>
                            <p className="text-xs text-neutral-500">{status}</p>
                        </button>
                    );
                })}
            </div>

            {/* Leads Table */}
            <Card padding="none" className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="text-left text-xs font-bold text-neutral-500 uppercase tracking-wider p-4">
                                    Prospect
                                </th>
                                <th className="text-left text-xs font-bold text-neutral-500 uppercase tracking-wider p-4">
                                    Entreprise
                                </th>
                                <th className="text-left text-xs font-bold text-neutral-500 uppercase tracking-wider p-4">
                                    Position
                                </th>
                                <th className="text-left text-xs font-bold text-neutral-500 uppercase tracking-wider p-4">
                                    Score
                                </th>
                                <th className="text-left text-xs font-bold text-neutral-500 uppercase tracking-wider p-4">
                                    Statut
                                </th>
                                <th className="text-right text-xs font-bold text-neutral-500 uppercase tracking-wider p-4">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeads.map((lead) => (
                                <tr
                                    key={lead.id}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                >
                                    <td className="p-4">
                                        <div
                                            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => setSelectedLeadForModal(lead)}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-astro-gold/20 to-orange-500/20 flex items-center justify-center text-xs font-bold text-astro-gold">
                                                {lead.firstName[0]}{lead.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white hover:text-astro-gold transition-colors">
                                                    {lead.firstName} {lead.lastName}
                                                </p>
                                            </div>
                                        </div>

                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1 items-start">
                                            <p className="text-xs text-neutral-500 flex items-center gap-1">
                                                <Mail size={12} />
                                                {lead.email}
                                            </p>
                                            <div className="mt-1">
                                                <VerificationBadge
                                                    status={lead.verification_status}
                                                    score={lead.verification_score}
                                                    onClick={() => handleVerifyEmail(lead)}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-neutral-300">
                                            <CompanyLogo email={lead.email} companyName={lead.company} />
                                            {lead.company}
                                        </div>
                                        {lead.timezone && (
                                            <div className="mt-1 ml-8">
                                                <LocalTimeBadge timezone={lead.timezone} location={lead.location_str} />
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 text-neutral-400">{lead.position}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Star
                                                size={14}
                                                className={lead.score >= 70 ? 'text-astro-gold' : 'text-neutral-500'}
                                                fill={lead.score >= 70 ? 'currentColor' : 'none'}
                                            />
                                            <span className={lead.score >= 70 ? 'text-astro-gold' : 'text-neutral-400'}>
                                                {lead.score}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={lead.status}
                                            onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                                            className="neon-input text-xs py-1 px-2"
                                        >
                                            {Object.values(LeadStatus).map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button variant="ghost" size="sm">
                                            <Mail size={16} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredLeads.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-neutral-500">Aucun prospect trouvé</p>
                    </div>
                )}
            </Card>

            <LeadDetailsModal
                lead={selectedLeadForModal}
                isOpen={!!selectedLeadForModal}
                onClose={() => setSelectedLeadForModal(null)}
            />
        </div>
    );
};

export default Leads;

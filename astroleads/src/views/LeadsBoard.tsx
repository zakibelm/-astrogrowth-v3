import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, Button, useToast } from '@/components/ui';
import { Mail, CheckCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { getSupabaseUrl, getSupabaseKey } from '@/lib/apiKeys';

const supabase = createClient(getSupabaseUrl(), getSupabaseKey());

interface Lead {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    company: string;
    position: string;
    status: 'new' | 'contacted' | 'interested' | 'converted' | 'rejected';
    score: number;
    last_contacted_at: string;
    campaign_name?: string;
}

const LeadsBoard: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    const fetchLeads = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('leads')
            .select('*, campaigns(name)')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching leads:', error);
            // Mock data if table doesn't exist yet
            setLeads([
                {
                    id: '1',
                    first_name: 'Karim',
                    last_name: 'Benali',
                    email: 'k.benali@desjardins.com',
                    company: 'Desjardins',
                    position: 'Conseiller',
                    status: 'contacted',
                    score: 92,
                    last_contacted_at: new Date().toISOString(),
                    campaign_name: 'Campagne Immo',
                },
            ]);
        } else {
            setLeads(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800';
            case 'contacted': return 'bg-yellow-100 text-yellow-800';
            case 'interested': return 'bg-green-100 text-green-800';
            case 'converted': return 'bg-purple-100 text-purple-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleAction = async (_leadId: string, action: string) => {
        toast.info(`Action ${action} lancée pour le lead...`);
        // Placeholder for actual logic
    };

    return (
        <div className="space-y-6 animate-fade-in p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">📋 Suivi des Leads</h1>
                    <p className="text-neutral-400">Gérez vos contacts et vos relances</p>
                </div>
                <Button onClick={fetchLeads} leftIcon={<RefreshCw size={16} />} variant="secondary">
                    Actualiser
                </Button>
            </div>

            <Card className="overflow-hidden border-astro-gold/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-800 bg-neutral-900/50">
                                <th className="p-4 text-neutral-400 font-medium">Lead</th>
                                <th className="p-4 text-neutral-400 font-medium">Contact</th>
                                <th className="p-4 text-neutral-400 font-medium">Statut</th>
                                <th className="p-4 text-neutral-400 font-medium">Dernier Contact</th>
                                <th className="p-4 text-neutral-400 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-neutral-500">Chargement...</td></tr>
                            ) : leads.map((lead) => (
                                <tr key={lead.id} className="border-b border-neutral-800 hover:bg-neutral-800/30 transition-colors">
                                    <td className="p-4">
                                        <div className="font-semibold text-white">{lead.first_name} {lead.last_name}</div>
                                        <div className="text-sm text-neutral-500">{lead.position} @ {lead.company}</div>
                                    </td>
                                    <td className="p-4 text-neutral-300">
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="text-neutral-500" /> {lead.email}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(lead.status)} uppercase tracking-wide`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-neutral-400 text-sm">
                                        {lead.last_contacted_at ? new Date(lead.last_contacted_at).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleAction(lead.id, 'relance')}
                                                className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 transition"
                                                title="Envoyer une relance"
                                            >
                                                <Mail size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleAction(lead.id, 'note')}
                                                className="p-2 rounded-lg bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/40 transition"
                                                title="Ajouter une note"
                                            >
                                                <MessageSquare size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleAction(lead.id, 'convert')}
                                                className="p-2 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/40 transition"
                                                title="Marquer comme intéressé"
                                            >
                                                <CheckCircle size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {leads.length === 0 && !loading && (
                        <div className="p-8 text-center text-neutral-500">Aucun lead trouvé. Lancez une campagne !</div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default LeadsBoard;

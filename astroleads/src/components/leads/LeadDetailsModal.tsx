import React, { useEffect, useState } from 'react';
import { Newspaper, Building } from 'lucide-react';
import { Modal, ModalBody, ModalFooter, Button, NewsFeed, CompanyLogo, Badge } from '@/components/ui';
import { Lead } from '@/types';
import { fetchCompanyNews, NewsArticle } from '@/services/newsService';

interface LeadDetailsModalProps {
    lead: Lead | null;
    isOpen: boolean;
    onClose: () => void;
}

export const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({ lead, isOpen, onClose }) => {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [isLoadingNews, setIsLoadingNews] = useState(false);
    const [isMock, setIsMock] = useState(false);

    useEffect(() => {
        if (isOpen && lead?.company) {
            loadNews(lead.company);
        } else {
            setNews([]);
        }
    }, [isOpen, lead]);

    const loadNews = async (company: string) => {
        setIsLoadingNews(true);
        try {
            // Check if generic domain to avoid noise (optional, domain utils)
            const result = await fetchCompanyNews(company);
            setNews(result.articles);
            setIsMock(!!result._mock);
        } catch (error) {
            console.error('Failed to load news', error);
        } finally {
            setIsLoadingNews(false);
        }
    };

    if (!lead) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Détails du Prospect" size="lg">
            <ModalBody>
                <div className="space-y-6">
                    {/* Header Info */}
                    <div className="flex items-start gap-4">
                        <CompanyLogo
                            email={lead.email}
                            companyName={lead.company}
                            size={64}
                            className="bg-white p-2 rounded-xl shadow-lg shadow-astro-gold/5" // Added styling
                        />
                        <div>
                            <h2 className="text-2xl font-bold text-white">{lead.firstName} {lead.lastName}</h2>
                            <p className="text-astro-gold font-medium flex items-center gap-2">
                                <Building size={16} />
                                {lead.company}
                            </p>
                            <p className="text-neutral-400 text-sm mt-1">{lead.position}</p>

                            <div className="flex items-center gap-2 mt-3">
                                <Badge variant="info">{lead.status}</Badge>
                                {(lead.verification_status) && (
                                    <Badge variant={lead.verification_status === 'valid' ? 'success' : lead.verification_status === 'invalid' ? 'danger' : 'warning'}>
                                        Email: {lead.verification_status}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-white/10" />

                    {/* News Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Newspaper className="text-astro-gold" size={20} />
                            <h3 className="text-lg font-semibold text-white">Actualités de l'entreprise</h3>
                        </div>

                        <div className="bg-astro-900/50 rounded-xl p-4 border border-white/5">
                            <NewsFeed articles={news} isLoading={isLoadingNews} isMock={isMock} />
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button variant="secondary" onClick={onClose}>Fermer</Button>
            </ModalFooter>
        </Modal>
    );
};

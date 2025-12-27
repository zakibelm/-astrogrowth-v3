import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Pause, Trash2, Eye, Sparkles, Building2, Users, Shuffle } from 'lucide-react';
import { Button, Card, Badge, Modal, ModalBody, ModalFooter, Input, Textarea, useToast } from '@/components/ui';
import { CampaignWizard } from '@/components/campaigns/CampaignWizard';
import { useCampaignStore } from '@/stores';
import { CampaignStatus } from '@/types';
import { STATUS_COLORS, PLATFORMS } from '@/lib/constants';
import { generateCampaignStrategy } from '@/services/aiService';

const Campaigns: React.FC = () => {
    const navigate = useNavigate();
    const { campaigns, addCampaign, updateStatus, deleteCampaign } = useCampaignStore();
    const toast = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [useWizard, setUseWizard] = useState(true); // Use new wizard by default
    const [isLoading, setIsLoading] = useState(false);
    const [aiStrategy, setAiStrategy] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        productName: '',
        serviceDescription: '',
        targetAudience: '',
        geolocation: '',
        platforms: [] as string[],
        senderName: '',  // For email signature
        campaignType: 'b2b' as 'b2b' | 'b2c' | 'hybrid',
        preferredSources: [] as string[],
    });

    const handlePlatformToggle = (platform: string) => {
        setFormData((prev) => ({
            ...prev,
            platforms: prev.platforms.includes(platform)
                ? prev.platforms.filter((p) => p !== platform)
                : [...prev.platforms, platform],
        }));
    };

    const handleGenerateStrategy = async () => {
        if (!formData.productName || !formData.targetAudience) {
            toast.warning('Veuillez remplir le nom du produit et l\'audience cible');
            return;
        }

        setIsLoading(true);
        try {
            const strategy = await generateCampaignStrategy(
                formData.productName,
                formData.serviceDescription,
                formData.targetAudience,
                formData.geolocation,
                formData.platforms
            );
            setAiStrategy(strategy);
            toast.success('Stratégie générée avec succès!');
        } catch (error) {
            toast.error('Erreur lors de la génération', (error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCampaign = () => {
        if (!formData.name) {
            toast.warning('Veuillez donner un nom à la campagne');
            return;
        }

        addCampaign({
            ...formData,
            status: CampaignStatus.DRAFT,
            leadsCount: 0,
            sentCount: 0,
            openRate: 0,
            aiStrategy,
        });

        toast.success('Campagne créée!', formData.name);
        setIsModalOpen(false);
        setFormData({
            name: '',
            productName: '',
            serviceDescription: '',
            targetAudience: '',
            geolocation: '',
            platforms: [],
            senderName: '',
            campaignType: 'b2b' as 'b2b' | 'b2c' | 'b2c',
            preferredSources: [],
        });
        setAiStrategy('');
    };

    const handleToggleStatus = (id: string, currentStatus: CampaignStatus) => {
        const newStatus = currentStatus === CampaignStatus.ACTIVE
            ? CampaignStatus.PAUSED
            : CampaignStatus.ACTIVE;
        updateStatus(id, newStatus);
        toast.info(`Campagne ${newStatus === CampaignStatus.ACTIVE ? 'activée' : 'mise en pause'}`);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Campagnes</h1>
                    <p className="text-neutral-500">Gérez vos campagnes de prospection</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus size={18} />}>
                    Nouvelle Campagne
                </Button>
            </div>

            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                    <Card key={campaign.id} className="relative group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">
                                    {campaign.name}
                                </h3>
                                <p className="text-sm text-neutral-500">{campaign.targetAudience}</p>
                            </div>
                            <Badge
                                className={STATUS_COLORS[campaign.status as keyof typeof STATUS_COLORS]}
                            >
                                {campaign.status}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                                <p className="text-2xl font-bold text-white">{campaign.leadsCount}</p>
                                <p className="text-xs text-neutral-500">Leads</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{campaign.sentCount}</p>
                                <p className="text-xs text-neutral-500">Envoyés</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-astro-gold">{campaign.openRate}%</p>
                                <p className="text-xs text-neutral-500">Ouverture</p>
                            </div>
                        </div>

                        {campaign.platforms && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {campaign.platforms.map((platform) => (
                                    <span
                                        key={platform}
                                        className="text-xs bg-astro-700/50 text-neutral-300 px-2 py-1 rounded"
                                    >
                                        {platform}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Visible Workflow Button */}
                        <Button
                            variant="secondary"
                            size="sm"
                            className="w-full mb-3"
                            onClick={() => navigate(`/campaigns/${campaign.id}`)}
                            leftIcon={<Eye size={16} />}
                        >
                            Voir Workflow & Actions
                        </Button>

                        {/* Hover Actions */}
                        <div className="flex gap-2 justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant={campaign.status === CampaignStatus.ACTIVE ? 'secondary' : 'primary'}
                                size="sm"
                                onClick={() => handleToggleStatus(campaign.id, campaign.status)}
                            >
                                {campaign.status === CampaignStatus.ACTIVE ? (
                                    <><Pause size={14} /> Pause</>
                                ) : (
                                    <><Play size={14} /> Démarrer</>
                                )}
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                    deleteCampaign(campaign.id);
                                    toast.info('Campagne supprimée');
                                }}
                            >
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {campaigns.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-neutral-500 mb-4">Aucune campagne pour le moment</p>
                    <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus size={18} />}>
                        Créer ma première campagne
                    </Button>
                </div>
            )}

            {/* Create Campaign Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nouvelle Campagne"
                size="lg"
            >
                <ModalBody className="space-y-6">
                    {/* Campaign Type Selection */}
                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">
                            Type de Campagne
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, campaignType: 'b2b' })}
                                className={`p-4 rounded-xl border-2 transition-all text-center ${formData.campaignType === 'b2b'
                                    ? 'border-astro-gold bg-astro-gold/10'
                                    : 'border-astro-700 bg-astro-800 hover:border-astro-gold/50'
                                    }`}
                            >
                                <Building2 className={`w-8 h-8 mx-auto mb-2 ${formData.campaignType === 'b2b' ? 'text-astro-gold' : 'text-blue-400'
                                    }`} />
                                <h4 className="text-sm font-semibold text-white mb-1">B2B</h4>
                                <p className="text-xs text-neutral-400">Entreprises</p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, campaignType: 'b2c' })}
                                className={`p-4 rounded-xl border-2 transition-all text-center ${formData.campaignType === 'b2c'
                                    ? 'border-astro-gold bg-astro-gold/10'
                                    : 'border-astro-700 bg-astro-800 hover:border-astro-gold/50'
                                    }`}
                            >
                                <Users className={`w-8 h-8 mx-auto mb-2 ${formData.campaignType === 'b2c' ? 'text-astro-gold' : 'text-pink-400'
                                    }`} />
                                <h4 className="text-sm font-semibold text-white mb-1">B2C</h4>
                                <p className="text-xs text-neutral-400">Particuliers</p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, campaignType: 'hybrid' })}
                                className={`p-4 rounded-xl border-2 transition-all text-center ${formData.campaignType === 'hybrid'
                                    ? 'border-astro-gold bg-astro-gold/10'
                                    : 'border-astro-700 bg-astro-800 hover:border-astro-gold/50'
                                    }`}
                            >
                                <Shuffle className={`w-8 h-8 mx-auto mb-2 ${formData.campaignType === 'hybrid' ? 'text-astro-gold' : 'text-purple-400'
                                    }`} />
                                <h4 className="text-sm font-semibold text-white mb-1">Hybride</h4>
                                <p className="text-xs text-neutral-400">Mix B2B+B2C</p>
                            </button>
                        </div>
                    </div>

                    <Input
                        label="Nom de la campagne"
                        placeholder="Ex: Prospection Q4 2024"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Nom du produit"
                            placeholder="Ex: AstroAPI"
                            value={formData.productName}
                            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                        />
                        <Input
                            label="Audience cible"
                            placeholder="Ex: CTOs Fintech"
                            value={formData.targetAudience}
                            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                        />
                    </div>

                    <Textarea
                        label="Description du service"
                        placeholder="Décrivez votre produit/service..."
                        value={formData.serviceDescription}
                        onChange={(e) => setFormData({ ...formData, serviceDescription: e.target.value })}
                        rows={3}
                    />

                    <Input
                        label="Géolocalisation"
                        placeholder="Ex: Europe, Amérique du Nord"
                        value={formData.geolocation}
                        onChange={(e) => setFormData({ ...formData, geolocation: e.target.value })}
                    />

                    <Input
                        label="📝 Signature Email (Nom ou Entreprise)"
                        placeholder="Ex: Jean Dupont - Mon Entreprise SAS"
                        value={formData.senderName}
                        onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                    />
                    <p className="text-xs text-neutral-500 -mt-4">Ce nom apparaîtra dans la signature de vos emails</p>

                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">
                            Plateformes
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {PLATFORMS.map((platform) => (
                                <button
                                    key={platform}
                                    onClick={() => handlePlatformToggle(platform)}
                                    className={`px-4 py-2 rounded-lg border transition-all ${formData.platforms.includes(platform)
                                        ? 'bg-astro-gold/20 border-astro-gold text-astro-gold'
                                        : 'bg-astro-800 border-astro-700 text-neutral-400 hover:text-white'
                                        }`}
                                >
                                    {platform}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        variant="secondary"
                        className="w-full"
                        onClick={handleGenerateStrategy}
                        isLoading={isLoading}
                        leftIcon={<Sparkles size={18} />}
                    >
                        Générer Stratégie IA
                    </Button>

                    {aiStrategy && (
                        <div className="p-4 bg-astro-gold/5 border border-astro-gold/20 rounded-xl">
                            <h4 className="text-sm font-bold text-astro-gold mb-2">Stratégie IA</h4>
                            <p className="text-sm text-neutral-300 whitespace-pre-wrap">{aiStrategy}</p>
                        </div>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                        Annuler
                    </Button>
                    <Button onClick={handleCreateCampaign}>
                        Créer la campagne
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default Campaigns;

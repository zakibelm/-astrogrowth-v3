import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Play,
    Pause,
    Rocket,
    CheckCircle,
    Clock,
    AlertCircle,
    Users,
    Mail,
    BarChart3,
    Zap,
    Search,
    FileText,
    Send,
    Eye,
    Reply,
    ThumbsUp,
    ThumbsDown,
    Loader2,
} from 'lucide-react';
import { Card, Badge, Button, useToast } from '@/components/ui';
import { useCampaignStore } from '@/stores';
import { CampaignStatus } from '@/types';
import { useActivityStore, type ActivityType } from '@/stores/activityStore';
import { executeWorkflow, type WorkflowContext, type WorkflowStepType } from '@/services/workflowService';
import type { GeneratedLead } from '@/services/leadGeneratorService';

const ACTIVITY_ICONS: Record<ActivityType, React.ElementType> = {
    campaign_started: Play,
    campaign_paused: Pause,
    lead_scraped: Search,
    lead_qualified: Users,
    email_generated: FileText,
    email_sent: Send,
    email_opened: Eye,
    email_replied: Reply,
    email_bounced: AlertCircle,
    ai_analysis: Zap,
    error: AlertCircle,
};

const ACTIVITY_COLORS: Record<ActivityType, string> = {
    campaign_started: 'text-green-400',
    campaign_paused: 'text-yellow-400',
    lead_scraped: 'text-blue-400',
    lead_qualified: 'text-purple-400',
    email_generated: 'text-astro-gold',
    email_sent: 'text-cyan-400',
    email_opened: 'text-green-400',
    email_replied: 'text-emerald-400',
    email_bounced: 'text-red-400',
    ai_analysis: 'text-astro-gold',
    error: 'text-red-400',
};

const CampaignDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();

    const { campaigns, updateCampaign } = useCampaignStore();
    const { activities, workflows, addActivity, initWorkflow, updateWorkflowStep } = useActivityStore();

    const campaign = campaigns.find((c) => c.id === id);
    const campaignActivities = activities.filter((a) => a.campaignId === id);
    const workflow = id ? workflows[id] : null;

    const [isRunning, setIsRunning] = useState(false);
    const [currentStep, setCurrentStep] = useState<WorkflowStepType | null>(null);
    const [pendingLead, setPendingLead] = useState<GeneratedLead | null>(null);
    const [pendingEmail, setPendingEmail] = useState<{ lead: GeneratedLead; email: { subject: string; body: string } } | null>(null);

    // Callbacks for lead/email approval
    const [leadResolve, setLeadResolve] = useState<((value: boolean) => void) | null>(null);
    const [emailResolve, setEmailResolve] = useState<((value: boolean) => void) | null>(null);

    useEffect(() => {
        if (campaign?.status === CampaignStatus.ACTIVE && id && !workflow) {
            initWorkflow(id);
        }
    }, [campaign?.status, id, workflow]);

    const handleStartWorkflow = async () => {
        if (!campaign || !id) return;

        setIsRunning(true);
        updateCampaign(id, { status: CampaignStatus.ACTIVE });
        initWorkflow(id);

        addActivity({
            campaignId: id,
            campaignName: campaign.name,
            type: 'campaign_started',
            title: '🚀 Workflow démarré',
            description: 'Le workflow de prospection est maintenant actif',
            status: 'completed',
        });

        const context: WorkflowContext = {
            campaignId: id,
            campaignName: campaign.name,
            productName: campaign.productName || 'AstroLeads',
            serviceDescription: campaign.serviceDescription || campaign.content || '',
            targetAudience: campaign.targetAudience,
            geolocation: campaign.geolocation || 'France',
            platforms: campaign.platforms || ['LinkedIn'],
            numberOfLeads: campaign.leadTarget || 10,
            senderName: campaign.senderName || 'L\'équipe commerciale',
            companyName: campaign.companyName || campaign.productName || 'Notre entreprise',
            senderEmail: campaign.senderEmail,
        };

        try {
            const result = await executeWorkflow(
                context,
                (step, message) => {
                    setCurrentStep(step);
                    // Update workflow step progress
                    if (workflow && workflow.steps.length > 0) {
                        const stepIndex = getStepIndex(step);
                        if (stepIndex >= 0) {
                            updateWorkflowStep(id, `step-${stepIndex}`, {
                                status: 'running',
                                progress: 50,
                            });
                        }
                    }
                },
                // Lead approval callback
                async (lead) => {
                    setPendingLead(lead);
                    return new Promise((resolve) => {
                        setLeadResolve(() => resolve);
                    });
                },
                // Email approval callback
                async (lead, email) => {
                    setPendingEmail({ lead, email });
                    return new Promise((resolve) => {
                        setEmailResolve(() => resolve);
                    });
                }
            );

            toast.success(
                'Workflow terminé!',
                `${result.leadsGenerated} leads, ${result.emailsSent} emails envoyés`
            );
        } catch (error) {
            toast.error('Erreur', (error as Error).message);
        } finally {
            setIsRunning(false);
            setCurrentStep(null);
        }
    };

    const handleApproveLead = (approved: boolean) => {
        if (leadResolve) {
            leadResolve(approved);
            setLeadResolve(null);
            setPendingLead(null);
            if (!approved) {
                toast.info('Lead ignoré');
            }
        }
    };

    const handleApproveEmail = (approved: boolean) => {
        if (emailResolve) {
            emailResolve(approved);
            setEmailResolve(null);
            setPendingEmail(null);
            if (!approved) {
                toast.info('Email non envoyé');
            }
        }
    };

    const getStepIndex = (step: WorkflowStepType): number => {
        const mapping: Record<WorkflowStepType, number> = {
            'generating_leads': 0,
            'qualifying_leads': 1,
            'generating_emails': 3,
            'reviewing_emails': 3,
            'sending_emails': 4,
            'tracking': 5,
        };
        return mapping[step] ?? -1;
    };

    if (!campaign) {
        return (
            <div className="text-center py-20">
                <p className="text-neutral-500">Campagne non trouvée</p>
                <Button variant="secondary" onClick={() => navigate('/campaigns')} className="mt-4">
                    Retour aux campagnes
                </Button>
            </div>
        );
    }

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const isActive = campaign.status === CampaignStatus.ACTIVE;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/campaigns')}>
                        <ArrowLeft size={18} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            {campaign.name}
                            <Badge className={isActive ? 'bg-green-500' : 'bg-neutral-500'}>
                                {isActive ? 'Actif' : campaign.status}
                            </Badge>
                        </h1>
                        <p className="text-neutral-500">{campaign.targetAudience}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {!isRunning && (
                        <Button
                            variant="primary"
                            onClick={handleStartWorkflow}
                            leftIcon={<Rocket size={16} />}
                            className="bg-gradient-to-r from-astro-gold to-yellow-500 text-black font-bold shadow-lg hover:brightness-110 border-none"
                        >
                            Lancer le Workflow Réel
                        </Button>
                    )}
                    {isRunning && (
                        <Button variant="secondary" disabled leftIcon={<Loader2 size={16} className="animate-spin" />}>
                            Workflow en cours...
                        </Button>
                    )}
                </div>
            </div>

            {/* Pending Lead Approval */}
            {pendingLead && (
                <Card className="border-2 border-astro-gold animate-pulse-slow">
                    <h3 className="text-lg font-bold text-astro-gold mb-3 flex items-center gap-2">
                        <Users size={20} />
                        Nouveau Lead - Approuver ?
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-white font-semibold">{pendingLead.firstName} {pendingLead.lastName}</p>
                            <p className="text-sm text-neutral-400">{pendingLead.position}</p>
                            <p className="text-sm text-neutral-500">{pendingLead.company}</p>
                        </div>
                        <div>
                            <p className="text-sm text-neutral-400">📧 {pendingLead.email}</p>
                            <p className="text-sm text-astro-gold font-bold">Score: {pendingLead.score}/100</p>
                        </div>
                    </div>
                    <p className="text-xs text-neutral-500 mb-4">{pendingLead.reasoning}</p>
                    <div className="flex gap-3">
                        <Button onClick={() => handleApproveLead(true)} leftIcon={<ThumbsUp size={16} />}>
                            Approuver
                        </Button>
                        <Button variant="secondary" onClick={() => handleApproveLead(false)} leftIcon={<ThumbsDown size={16} />}>
                            Ignorer
                        </Button>
                    </div>
                </Card>
            )}

            {/* Pending Email Approval */}
            {pendingEmail && (
                <Card className="border-2 border-cyan-400">
                    <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
                        <Mail size={20} />
                        Preview Email - Envoyer ?
                    </h3>
                    <p className="text-white font-semibold mb-2">
                        À: {pendingEmail.lead.firstName} {pendingEmail.lead.lastName} ({pendingEmail.lead.email})
                    </p>
                    <p className="text-sm text-astro-gold mb-2">Objet: {pendingEmail.email.subject}</p>
                    <div className="bg-astro-950 p-4 rounded-lg mb-4 max-h-40 overflow-y-auto">
                        <p className="text-sm text-neutral-300 whitespace-pre-wrap">{pendingEmail.email.body}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={() => handleApproveEmail(true)} leftIcon={<Send size={16} />} className="bg-cyan-500 hover:bg-cyan-400">
                            Envoyer
                        </Button>
                        <Button variant="secondary" onClick={() => handleApproveEmail(false)} leftIcon={<ThumbsDown size={16} />}>
                            Ne pas envoyer
                        </Button>
                    </div>
                </Card>
            )}

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="text-center">
                    <Users className="mx-auto text-blue-400 mb-2" size={24} />
                    <p className="text-2xl font-bold text-white">{campaign.leadsCount || 0}</p>
                    <p className="text-xs text-neutral-500">Leads</p>
                </Card>
                <Card className="text-center">
                    <Mail className="mx-auto text-astro-gold mb-2" size={24} />
                    <p className="text-2xl font-bold text-white">{campaign.sentCount || 0}</p>
                    <p className="text-xs text-neutral-500">Emails envoyés</p>
                </Card>
                <Card className="text-center">
                    <Eye className="mx-auto text-green-400 mb-2" size={24} />
                    <p className="text-2xl font-bold text-white">{campaign.openRate || 0}%</p>
                    <p className="text-xs text-neutral-500">Ouverture</p>
                </Card>
                <Card className="text-center">
                    <Reply className="mx-auto text-purple-400 mb-2" size={24} />
                    <p className="text-2xl font-bold text-white">0%</p>
                    <p className="text-xs text-neutral-500">Réponse</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Workflow Progress */}
                <Card className="lg:col-span-1">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <BarChart3 size={20} className="text-astro-gold" />
                        Workflow
                    </h3>

                    {workflow ? (
                        <div className="space-y-4">
                            {workflow.steps.map((step, index) => {
                                const isStepActive = index === workflow.currentStepIndex && isRunning;
                                const isCompleted = step.status === 'completed';
                                const isPending = step.status === 'pending';

                                return (
                                    <div key={step.id} className="relative">
                                        {index < workflow.steps.length - 1 && (
                                            <div className={`absolute left-3 top-8 w-0.5 h-8 ${isCompleted ? 'bg-green-400' : 'bg-astro-800'}`} />
                                        )}

                                        <div className={`flex items-start gap-3 ${isPending ? 'opacity-50' : ''}`}>
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-green-400' : isStepActive ? 'bg-astro-gold' : 'bg-astro-800'
                                                }`}>
                                                {isCompleted ? (
                                                    <CheckCircle size={14} className="text-black" />
                                                ) : isStepActive ? (
                                                    <Loader2 size={14} className="text-black animate-spin" />
                                                ) : (
                                                    <span className="text-xs text-neutral-500">{index + 1}</span>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium ${isStepActive ? 'text-astro-gold' : isCompleted ? 'text-green-400' : 'text-neutral-500'}`}>
                                                    {step.name}
                                                </p>
                                                {isStepActive && step.progress > 0 && (
                                                    <div className="mt-1 w-full bg-astro-800 rounded-full h-1">
                                                        <div
                                                            className="bg-astro-gold h-1 rounded-full transition-all duration-500"
                                                            style={{ width: `${step.progress}%` }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-neutral-500 text-sm text-center py-8">
                            Cliquez sur "Lancer le Workflow" pour commencer
                        </p>
                    )}
                </Card>

                {/* Activity Timeline */}
                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Zap size={20} className="text-astro-gold" />
                            Actions en Temps Réel
                        </h3>
                        <Badge variant="default">
                            {campaignActivities.length} actions
                        </Badge>
                    </div>

                    {campaignActivities.length === 0 ? (
                        <div className="text-center py-12">
                            <Clock className="mx-auto text-neutral-600 mb-3" size={40} />
                            <p className="text-neutral-500">Aucune action pour l'instant</p>
                            <p className="text-xs text-neutral-600 mt-1">
                                Lancez le workflow pour voir les actions réelles
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                            {campaignActivities.map((activity) => {
                                const Icon = ACTIVITY_ICONS[activity.type] || Zap;
                                const colorClass = ACTIVITY_COLORS[activity.type] || 'text-neutral-400';

                                return (
                                    <div
                                        key={activity.id}
                                        className="p-3 bg-astro-800/30 rounded-lg border border-astro-800 hover:border-astro-700 transition-all"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg bg-astro-800 ${colorClass} shrink-0`}>
                                                <Icon size={16} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium text-white">{activity.title}</p>
                                                    {activity.agentName && (
                                                        <Badge variant="default" size="sm">{activity.agentName}</Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-neutral-400 mt-1 whitespace-pre-wrap">{activity.description}</p>
                                            </div>
                                            <p className="text-xs text-neutral-500 shrink-0">{formatTime(activity.timestamp)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default CampaignDetail;

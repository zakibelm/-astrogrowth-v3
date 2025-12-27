import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ActivityType =
    | 'campaign_started'
    | 'campaign_paused'
    | 'lead_scraped'
    | 'lead_qualified'
    | 'email_generated'
    | 'email_sent'
    | 'email_opened'
    | 'email_replied'
    | 'email_bounced'
    | 'ai_analysis'
    | 'error';

export type ActivityStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface CampaignActivity {
    id: string;
    campaignId: string;
    campaignName: string;
    type: ActivityType;
    title: string;
    description: string;
    status: ActivityStatus;
    result?: string | Record<string, unknown>;
    agentId?: string;
    agentName?: string;
    leadId?: string;
    leadName?: string;
    timestamp: string;
    duration?: number;
}

export interface WorkflowStep {
    id: string;
    name: string;
    status: ActivityStatus;
    progress: number;
    current: number;
    total: number;
    startedAt?: string;
    completedAt?: string;
}

export interface CampaignWorkflow {
    campaignId: string;
    steps: WorkflowStep[];
    currentStepIndex: number;
    status: ActivityStatus;
    startedAt: string;
    lastUpdatedAt: string;
}

interface ActivityState {
    activities: CampaignActivity[];
    workflows: Record<string, CampaignWorkflow>;
    addActivity: (activity: Omit<CampaignActivity, 'id' | 'timestamp'>) => void;
    updateActivity: (id: string, updates: Partial<CampaignActivity>) => void;
    clearCampaignActivities: (campaignId: string) => void;
    initWorkflow: (campaignId: string) => void;
    updateWorkflowStep: (campaignId: string, stepId: string, updates: Partial<WorkflowStep>) => void;
    advanceWorkflow: (campaignId: string) => void;
    getActivitiesByCampaign: (campaignId: string) => CampaignActivity[];
    getRecentActivities: (limit?: number) => CampaignActivity[];
}

const DEFAULT_WORKFLOW_STEPS: Omit<WorkflowStep, 'id'>[] = [
    { name: 'Recherche de Leads', status: 'pending', progress: 0, current: 0, total: 0 },
    { name: 'Qualification IA', status: 'pending', progress: 0, current: 0, total: 0 },
    { name: 'Validation Emails', status: 'pending', progress: 0, current: 0, total: 0 },
    { name: 'Génération Cold Emails', status: 'pending', progress: 0, current: 0, total: 0 },
    { name: 'Envoi Campagne', status: 'pending', progress: 0, current: 0, total: 0 },
    { name: 'Suivi & Relances', status: 'pending', progress: 0, current: 0, total: 0 },
];

export const useActivityStore = create<ActivityState>()(
    persist(
        (set, get) => ({
            activities: [],
            workflows: {},

            addActivity: (activityData) => {
                const newActivity: CampaignActivity = {
                    ...activityData,
                    id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    timestamp: new Date().toISOString(),
                };
                set((state) => ({
                    activities: [newActivity, ...state.activities].slice(0, 500),
                }));
            },

            updateActivity: (id, updates) => {
                set((state) => ({
                    activities: state.activities.map((a) =>
                        a.id === id ? { ...a, ...updates } : a
                    ),
                }));
            },

            clearCampaignActivities: (campaignId) => {
                set((state) => ({
                    activities: state.activities.filter((a) => a.campaignId !== campaignId),
                }));
            },

            initWorkflow: (campaignId) => {
                const workflow: CampaignWorkflow = {
                    campaignId,
                    steps: DEFAULT_WORKFLOW_STEPS.map((step, i) => ({
                        ...step,
                        id: `step-${i}`,
                    })),
                    currentStepIndex: 0,
                    status: 'running',
                    startedAt: new Date().toISOString(),
                    lastUpdatedAt: new Date().toISOString(),
                };
                set((state) => ({
                    workflows: { ...state.workflows, [campaignId]: workflow },
                }));
            },

            updateWorkflowStep: (campaignId, stepId, updates) => {
                set((state) => {
                    const workflow = state.workflows[campaignId];
                    if (!workflow) return state;
                    return {
                        workflows: {
                            ...state.workflows,
                            [campaignId]: {
                                ...workflow,
                                steps: workflow.steps.map((s) =>
                                    s.id === stepId ? { ...s, ...updates } : s
                                ),
                                lastUpdatedAt: new Date().toISOString(),
                            },
                        },
                    };
                });
            },

            advanceWorkflow: (campaignId) => {
                set((state) => {
                    const workflow = state.workflows[campaignId];
                    if (!workflow) return state;
                    const nextIndex = workflow.currentStepIndex + 1;
                    const isComplete = nextIndex >= workflow.steps.length;
                    return {
                        workflows: {
                            ...state.workflows,
                            [campaignId]: {
                                ...workflow,
                                currentStepIndex: isComplete ? workflow.currentStepIndex : nextIndex,
                                status: isComplete ? 'completed' : 'running',
                                lastUpdatedAt: new Date().toISOString(),
                            },
                        },
                    };
                });
            },

            getActivitiesByCampaign: (campaignId) => {
                return get().activities.filter((a) => a.campaignId === campaignId);
            },

            getRecentActivities: (limit = 20) => {
                return get().activities.slice(0, limit);
            },
        }),
        { name: 'astroleads-activities' }
    )
);


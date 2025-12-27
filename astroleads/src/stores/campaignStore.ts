import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Campaign, CampaignStatus } from '@/types';
import { CampaignStatus as CampaignStatusEnum } from '@/types';

interface CampaignState {
    // State
    campaigns: Campaign[];
    isLoading: boolean;
    selectedCampaign: Campaign | null;

    // Actions
    addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt'>) => Campaign;
    updateCampaign: (id: string, updates: Partial<Campaign>) => void;
    deleteCampaign: (id: string) => void;
    setCampaigns: (campaigns: Campaign[]) => void;
    selectCampaign: (campaign: Campaign | null) => void;
    updateStatus: (id: string, status: CampaignStatus) => void;

    // Computed
    getActiveCampaigns: () => Campaign[];
    getCampaignById: (id: string) => Campaign | undefined;
}

// Initial mock data
// Initial data (Empty for Production)
const INITIAL_CAMPAIGNS: Campaign[] = [];

export const useCampaignStore = create<CampaignState>()(
    persist(
        (set, get) => ({
            // Initial State
            campaigns: INITIAL_CAMPAIGNS,
            isLoading: false,
            selectedCampaign: null,

            // Actions
            addCampaign: (campaignData) => {
                const newCampaign: Campaign = {
                    ...campaignData,
                    id: `c-${Date.now()}`,
                    createdAt: new Date().toISOString().split('T')[0],
                };

                set((state) => ({
                    campaigns: [newCampaign, ...state.campaigns],
                }));

                return newCampaign;
            },

            updateCampaign: (id, updates) => {
                set((state) => ({
                    campaigns: state.campaigns.map((campaign) =>
                        campaign.id === id ? { ...campaign, ...updates } : campaign
                    ),
                }));
            },

            deleteCampaign: (id) => {
                set((state) => ({
                    campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
                    selectedCampaign:
                        state.selectedCampaign?.id === id ? null : state.selectedCampaign,
                }));
            },

            setCampaigns: (campaigns) => {
                set({ campaigns });
            },

            selectCampaign: (campaign) => {
                set({ selectedCampaign: campaign });
            },

            updateStatus: (id, status) => {
                set((state) => ({
                    campaigns: state.campaigns.map((campaign) =>
                        campaign.id === id ? { ...campaign, status } : campaign
                    ),
                }));
            },

            // Computed
            getActiveCampaigns: () => {
                return get().campaigns.filter(
                    (c) => c.status === CampaignStatusEnum.ACTIVE
                );
            },

            getCampaignById: (id) => {
                return get().campaigns.find((c) => c.id === id);
            },
        }),
        {
            name: 'astroleads-campaigns',
        }
    )
);

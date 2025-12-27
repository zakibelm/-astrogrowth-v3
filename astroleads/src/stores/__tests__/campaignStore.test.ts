import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCampaignStore } from '../campaignStore';
import { CampaignStatus } from '@/types';

describe('campaignStore', () => {
    beforeEach(() => {
        // Reset to default campaigns
        useCampaignStore.getState().setCampaigns([
            {
                id: 'c-test-1',
                name: 'Test Campaign',
                targetAudience: 'Test Audience',
                productName: 'Test Product',
                status: CampaignStatus.DRAFT,
                leadsCount: 0,
                sentCount: 0,
                openRate: 0,
                createdAt: '2023-01-01',
            },
        ]);
    });

    it('should add a new campaign', () => {
        const { result } = renderHook(() => useCampaignStore());
        const initialCount = result.current.campaigns.length;

        act(() => {
            result.current.addCampaign({
                name: 'New Campaign',
                targetAudience: 'New Audience',
                productName: 'New Product',
                status: CampaignStatus.DRAFT,
                leadsCount: 0,
                sentCount: 0,
                openRate: 0,
            });
        });

        expect(result.current.campaigns.length).toBe(initialCount + 1);
        expect(result.current.campaigns[0].name).toBe('New Campaign');
    });

    it('should update a campaign', () => {
        const { result } = renderHook(() => useCampaignStore());

        act(() => {
            result.current.updateCampaign('c-test-1', { name: 'Updated Name' });
        });

        const campaign = result.current.getCampaignById('c-test-1');
        expect(campaign?.name).toBe('Updated Name');
    });

    it('should delete a campaign', () => {
        const { result } = renderHook(() => useCampaignStore());

        act(() => {
            result.current.deleteCampaign('c-test-1');
        });

        expect(result.current.getCampaignById('c-test-1')).toBeUndefined();
    });

    it('should update campaign status', () => {
        const { result } = renderHook(() => useCampaignStore());

        act(() => {
            result.current.updateStatus('c-test-1', CampaignStatus.ACTIVE);
        });

        const campaign = result.current.getCampaignById('c-test-1');
        expect(campaign?.status).toBe(CampaignStatus.ACTIVE);
    });

    it('should get active campaigns', () => {
        const { result } = renderHook(() => useCampaignStore());

        act(() => {
            result.current.updateStatus('c-test-1', CampaignStatus.ACTIVE);
        });

        const activeCampaigns = result.current.getActiveCampaigns();
        expect(activeCampaigns.length).toBeGreaterThan(0);
        expect(activeCampaigns[0].status).toBe(CampaignStatus.ACTIVE);
    });
});

/**
 * Lead Source Detection & Quality Scoring Service
 */

export type LeadSource =
    | 'linkedin'
    | 'google-maps'
    | 'facebook'
    | 'instagram'
    | 'tiktok'
    | 'twitter'
    | 'youtube'
    | 'custom';

export type CampaignType = 'b2b' | 'b2c' | 'hybrid';

export interface QualityScore {
    score: number; // 0-100
    breakdown: {
        email?: number;
        position?: number;
        company?: number;
        socialProfile?: number;
        followers?: number;
        verified?: number;
        engagement?: number;
        contact?: number;
    };
    qualified: boolean; // score >= 85
    reasons: string[];
}

/**
 * Detect lead source from CSV row data
 */
export function detectLeadSource(row: Record<string, any>): LeadSource {
    const data = JSON.stringify(row).toLowerCase();

    // LinkedIn detection
    if (
        row.linkedin_url ||
        row.profile_url?.includes('linkedin') ||
        data.includes('linkedin')
    ) {
        return 'linkedin';
    }

    // Instagram detection
    if (
        row.instagram_handle ||
        row.instagram_username ||
        row.profile_url?.includes('instagram') ||
        (row.username && row.followers) || // Likely social media
        data.includes('instagram')
    ) {
        return 'instagram';
    }

    // TikTok detection
    if (
        row.tiktok_username ||
        row.profile_url?.includes('tiktok') ||
        data.includes('tiktok')
    ) {
        return 'tiktok';
    }

    // Facebook detection
    if (
        row.facebook_id ||
        row.facebook_url ||
        row.profile_url?.includes('facebook') ||
        data.includes('facebook')
    ) {
        return 'facebook';
    }

    // Twitter/X detection
    if (
        row.twitter_handle ||
        row.twitter_username ||
        row.profile_url?.includes('twitter') ||
        row.profile_url?.includes('x.com') ||
        data.includes('twitter')
    ) {
        return 'twitter';
    }

    // YouTube detection
    if (
        row.youtube_channel ||
        row.profile_url?.includes('youtube') ||
        data.includes('youtube')
    ) {
        return 'youtube';
    }

    // Google Maps detection (business with address)
    if (
        (row.business_name && row.address) ||
        (row.company && row.address && row.phone)
    ) {
        return 'google-maps';
    }

    return 'custom';
}

/**
 * Check if email is personal (Gmail, Hotmail, Yahoo, etc.)
 */
function isPersonalEmail(email: string): boolean {
    const personalDomains = [
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
        'live.com', 'icloud.com', 'aol.com', 'protonmail.com'
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    return personalDomains.includes(domain);
}

/**
 * Check if position indicates decision maker
 */
function isDecisionMaker(position?: string): boolean {
    if (!position) return false;

    const title = position.toLowerCase();
    const decisionMakerKeywords = [
        'ceo', 'cto', 'cfo', 'coo', 'cmo',
        'president', 'vp', 'vice president',
        'director', 'head of', 'chief',
        'founder', 'owner', 'partner'
    ];

    return decisionMakerKeywords.some(keyword => title.includes(keyword));
}

/**
 * Calculate quality score for B2B lead
 */
function calculateB2BScore(lead: Record<string, any>): QualityScore {
    const breakdown: QualityScore['breakdown'] = {};
    const reasons: string[] = [];
    let score = 0;

    // Professional email (30 points)
    if (lead.email) {
        if (!isPersonalEmail(lead.email)) {
            breakdown.email = 30;
            score += 30;
            reasons.push('✅ Email professionnel');
        } else {
            breakdown.email = 5;
            score += 5;
            reasons.push('⚠️ Email personnel (faible valeur)');
        }
    } else {
        reasons.push('❌ Email manquant');
    }

    // Position (25 points for decision maker, 10 for others)
    if (lead.position) {
        if (isDecisionMaker(lead.position)) {
            breakdown.position = 25;
            score += 25;
            reasons.push(`✅ Décideur: ${lead.position}`);
        } else {
            breakdown.position = 10;
            score += 10;
            reasons.push(`⚠️ Poste: ${lead.position}`);
        }
    } else {
        reasons.push('❌ Poste manquant');
    }

    // Company with website (20 points)
    if (lead.company && lead.website) {
        breakdown.company = 20;
        score += 20;
        reasons.push('✅ Entreprise vérifiée');
    } else if (lead.company) {
        breakdown.company = 10;
        score += 10;
        reasons.push('⚠️ Entreprise non vérifiée');
    }

    // LinkedIn URL (15 points)
    if (lead.linkedin_url) {
        breakdown.socialProfile = 15;
        score += 15;
        reasons.push('✅ Profil LinkedIn');
    }

    // Phone (10 points)
    if (lead.phone) {
        breakdown.contact = 10;
        score += 10;
        reasons.push('✅ Téléphone disponible');
    }

    return {
        score,
        breakdown,
        qualified: score >= 85,
        reasons
    };
}

/**
 * Calculate quality score for B2C lead
 */
function calculateB2CScore(lead: Record<string, any>): QualityScore {
    const breakdown: QualityScore['breakdown'] = {};
    const reasons: string[] = [];
    let score = 0;

    // Email (20 points)
    if (lead.email) {
        breakdown.email = 20;
        score += 20;
        reasons.push('✅ Email disponible');
    }

    // Followers (35 points max)
    const followers = parseInt(lead.followers || lead.follower_count || '0');
    if (followers > 50000) {
        breakdown.followers = 35;
        score += 35;
        reasons.push(`✅ Mega influenceur (${followers.toLocaleString()} followers)`);
    } else if (followers > 10000) {
        breakdown.followers = 25;
        score += 25;
        reasons.push(`✅ Influenceur (${followers.toLocaleString()} followers)`);
    } else if (followers > 1000) {
        breakdown.followers = 10;
        score += 10;
        reasons.push(`⚠️ Micro influenceur (${followers.toLocaleString()} followers)`);
    } else {
        reasons.push(`❌ Faible audience (${followers} followers)`);
    }

    // Verified account (20 points)
    if (lead.verified || lead.is_verified) {
        breakdown.verified = 20;
        score += 20;
        reasons.push('✅ Compte vérifié');
    }

    // Engagement rate (15 points)
    const engagement = parseFloat(lead.engagement_rate || '0');
    if (engagement > 5) {
        breakdown.engagement = 15;
        score += 15;
        reasons.push(`✅ Fort engagement (${engagement}%)`);
    } else if (engagement > 2) {
        breakdown.engagement = 10;
        score += 10;
        reasons.push(`⚠️ Engagement moyen (${engagement}%)`);
    }

    // Complete profile (10 points)
    if (lead.bio && lead.profile_url) {
        breakdown.socialProfile = 10;
        score += 10;
        reasons.push('✅ Profil complet');
    }

    return {
        score,
        breakdown,
        qualified: score >= 80,
        reasons
    };
}

/**
 * Calculate quality score based on campaign type
 */
export function calculateQualityScore(
    lead: Record<string, any>,
    campaignType: CampaignType,
    source?: LeadSource
): QualityScore {
    // Detect source if not provided
    const leadSource = source || detectLeadSource(lead);

    // Determine if B2B or B2C based on source or campaign type
    const isB2B = campaignType === 'b2b' ||
        ['linkedin', 'google-maps'].includes(leadSource);

    const isB2C = campaignType === 'b2c' ||
        ['instagram', 'tiktok', 'facebook', 'twitter', 'youtube'].includes(leadSource);

    // Calculate score based on type
    if (campaignType === 'hybrid') {
        // For hybrid, use source to determine scoring method
        if (isB2B) {
            return calculateB2BScore(lead);
        } else if (isB2C) {
            return calculateB2CScore(lead);
        }
        // If unclear, use B2B scoring (more strict)
        return calculateB2BScore(lead);
    } else if (campaignType === 'b2b') {
        return calculateB2BScore(lead);
    } else {
        return calculateB2CScore(lead);
    }
}

/**
 * Filter leads by minimum quality score
 */
export function filterByQuality(
    leads: Record<string, any>[],
    campaignType: CampaignType,
    minScore: number = 80
): {
    qualified: Array<Record<string, any> & { qualityScore: QualityScore; source: LeadSource }>;
    rejected: Array<Record<string, any> & { qualityScore: QualityScore; source: LeadSource }>;
} {
    const qualified: any[] = [];
    const rejected: any[] = [];

    for (const lead of leads) {
        const source = detectLeadSource(lead);
        const qualityScore = calculateQualityScore(lead, campaignType, source);

        const enrichedLead = { ...lead, qualityScore, source };

        if (qualityScore.score >= minScore) {
            qualified.push(enrichedLead);
        } else {
            rejected.push(enrichedLead);
        }
    }

    return { qualified, rejected };
}

/**
 * Source icons and colors
 */
export const SOURCE_CONFIG = {
    linkedin: { icon: '🔗', color: 'bg-blue-600', name: 'LinkedIn' },
    'google-maps': { icon: '📍', color: 'bg-green-600', name: 'Google Maps' },
    facebook: { icon: '👥', color: 'bg-blue-500', name: 'Facebook' },
    instagram: { icon: '📸', color: 'bg-pink-500', name: 'Instagram' },
    tiktok: { icon: '🎵', color: 'bg-black', name: 'TikTok' },
    twitter: { icon: '🐦', color: 'bg-sky-500', name: 'X/Twitter' },
    youtube: { icon: '▶️', color: 'bg-red-600', name: 'YouTube' },
    custom: { icon: '📄', color: 'bg-gray-600', name: 'Custom' },
};

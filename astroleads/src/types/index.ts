import React from 'react';

// ============================================
// DOMAIN ENTITIES
// ============================================

// Campaign Types
export enum CampaignStatus {
    DRAFT = 'BROUILLON',
    ACTIVE = 'ACTIF',
    PAUSED = 'PAUSE',
    COMPLETED = 'TERMINÉ',
}

export interface Campaign {
    id: string;
    name: string;
    targetAudience: string;
    productName: string;
    serviceDescription?: string;
    geolocation?: string;
    platforms?: string[];
    aiStrategy?: string;
    status: CampaignStatus;
    leadsCount: number;
    sentCount: number;
    openRate: number;
    createdAt: string;
    content?: string;
    // Client signature fields
    senderName?: string;      // Ex: "Jean Dupont"
    senderEmail?: string;     // Ex: "jean@monentreprise.com"
    companyName?: string;     // Ex: "Mon Entreprise SAS"
    leadTarget?: number;      // Target number of leads
    // Campaign type and sources
    campaignType?: 'b2b' | 'b2c' | 'hybrid';
    preferredSources?: string[];

    // B2B Qualification Criteria
    b2bCriteria?: {
        companySize?: string[];        // ['TPE', 'PME', 'ETI', 'GE']
        sectors?: string[];            // ['Tech', 'Finance', 'Healthcare', etc.]
        targetPositions?: string[];    // ['CEO', 'CTO', 'VP Sales', etc.]
        minSeniority?: string;         // 'C-Level' | 'VP' | 'Director' | 'Manager'
        minRevenue?: string;           // '<1M' | '1-10M' | '10-100M' | '>100M'
    };

    // B2C Qualification Criteria
    b2cCriteria?: {
        minFollowers?: number;         // 1000, 10000, 50000, etc.
        minEngagement?: number;        // 1, 2, 5, 10 (%)
        requireVerified?: boolean;
        categories?: string[];         // ['Beauty', 'Fashion', 'Tech', etc.]
        targetAge?: string[];          // ['18-24', '25-34', '35-44', '45+']
        languages?: string[];          // ['French', 'English', etc.]
    };

    // Exclusion Criteria
    exclusionCriteria?: {
        excludePersonalEmails?: boolean;   // Exclude @gmail, @yahoo for B2B
        excludeKeywords?: string[];        // Words to avoid in bio/company
        excludeContacted?: boolean;        // Exclude leads from other campaigns
    };

    // Budget & Volume
    budget?: {
        maxCredits?: number;           // Max API credits to spend
        targetLeadCount?: number;      // Desired number of qualified leads
        urgency?: 'immediate' | 'week' | 'month';
    };

    // Scoring Priorities
    scoringPriorities?: {
        topPriority?: string;          // Most important criterion
        minScore?: number;             // Minimum acceptable score (70-90)
    };
}

// Lead Types
export enum LeadStatus {
    NEW = 'NOUVEAU',
    CONTACTED = 'CONTACTÉ',
    INTERESTED = 'INTÉRESSÉ',
    CONVERTED = 'CONVERTI',
    DISQUALIFIED = 'DISQUALIFIÉ',
}

export interface Lead {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    position: string;
    status: LeadStatus;
    score: number;
    first_contact_at?: string;

    // Verification
    verification_status?: 'valid' | 'risky' | 'invalid' | 'unknown';
    verification_score?: number;
    last_verified_at?: string;

    // Location
    timezone?: string; // e.g. "Europe/Paris"
    location_str?: string; // e.g. "Paris, France"
    ip_address?: string; // e.g. "192.168.1.1"
}

// Agent Types
export interface Agent {
    id: string;
    name: string;
    role: string;
    model: string;
    status: 'actif' | 'inactif' | 'hors-ligne';
    currentTask: string;
    performance: number;
    costInfo: string;
    capabilities: string[];
    icon?: React.FC<{ size?: number; className?: string }>;
    poweredBy?: string;
}

// Template Types
export interface TargetPersona {
    job_titles: string[];
    industries: string[];
    company_size: string[];
    seniority: string[];
}

export interface WorkflowStep {
    step: number;
    action: string;
    automated: boolean;
}

export interface MessageTemplate {
    type: string;
    template: string;
}

export interface Template {
    id: number;
    name: string;
    description: string;
    icon: React.ReactNode;
    category: string;
    tags: string[];
    difficulty_level: 'debutant' | 'intermediaire' | 'avance';
    estimated_leads_per_week: number;
    estimated_setup_time: number;
    usage_count: number;
    rating: number;
    is_featured: boolean;
    is_premium: boolean;
    target_persona?: TargetPersona;
    search_criteria?: {
        keywords: string[];
        locations: string[];
        exclude_keywords?: string[];
    };
    qualification_rules?: {
        min_score: number;
        criteria: unknown[];
    };
    message_templates?: MessageTemplate[];
    workflow_steps?: WorkflowStep[];
}

// Dashboard Types
export interface DashboardStats {
    totalLeads: number;
    activeCampaigns: number;
    avgOpenRate: number;
    conversionsThisMonth: number;
}

// Navigation Types
export interface NavItem {
    label: string;
    path: string;
    icon: React.FC<{ size?: number; className?: string }>;
}

// ============================================
// USER & AUTH TYPES
// ============================================

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: 'admin' | 'user';
    createdAt: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// ============================================
// UI TYPES
// ============================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

export interface ModalState {
    isOpen: boolean;
    content: React.ReactNode | null;
}

// ============================================
// API TYPES
// ============================================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ============================================
// INTEGRATION TYPES
// ============================================

export interface BusinessHours {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
}

export interface ReviewAnalysis {
    total_reviews: number;
    average_rating: number;
    rating_distribution: Record<string, number>;
    sentiment_score: number;
    common_keywords: string[];
}

export interface GoogleMapsLead {
    business_name: string;
    address: string;
    phone?: string;
    website?: string;
    email?: string;
    rating?: number;
    total_reviews: number;
    category?: string;
    coordinates: {
        latitude?: number;
        longitude?: number;
    };
    business_hours?: BusinessHours;
    contact_details?: {
        phone?: string;
        email?: string;
        website?: string;
        social_media: Record<string, string>;
    };
    review_analysis?: ReviewAnalysis;
    data_quality_score: number;
    scraping_metadata: Record<string, unknown>;
    source: 'google_maps';
}

export interface SocialProfile {
    platform: string;
    username: string;
    display_name: string;
    bio: string;
    profile_url: string;
    followers_count: number;
    following_count: number;
    posts_count: number;
    is_verified: boolean;
    is_business: boolean;
    category?: string;
}

export interface InstagramLead {
    username: string;
    profile_url: string;
    social_profile: SocialProfile;
    contact_info: {
        email?: string;
        phone?: string;
        website?: string;
        whatsapp?: string;
    };
    engagement_metrics: {
        average_likes: number;
        average_comments: number;
        engagement_rate: number;
        analyzed_posts: number;
    };
    recent_posts: Array<{
        url: string;
        thumbnail?: string;
        description: string;
        type: string;
    }>;
    data_quality_score: number;
    scraping_metadata: Record<string, unknown>;
    source: 'instagram';
    business_name?: string;
}

export interface FacebookLead {
    page_name: string;
    page_url: string;
    business_info: {
        category: string;
        description: string;
        likes_count: number;
        followers_count: number;
        check_ins: number;
        price_range: string;
        services: string[];
    };
    contact_info: {
        phone?: string;
        email?: string;
        website?: string;
        address?: string;
        messenger?: string;
    };
    review_data: {
        total_reviews: number;
        average_rating: number;
        rating_distribution: Record<string, number>;
        recent_reviews: Array<{
            author: string;
            text: string;
            rating?: number;
        }>;
    };
    recent_posts: Array<{
        text: string;
        date: string;
        reactions: number;
        type: string;
    }>;
    business_hours?: Record<string, string>;
    data_quality_score: number;
    scraping_metadata: Record<string, unknown>;
    source: 'facebook';
    business_name?: string;
}

export type LeadResult = GoogleMapsLead | InstagramLead | FacebookLead;

export interface SearchRequest {
    query: string;
    max_results?: number;
    source?: 'google_maps' | 'instagram' | 'yelp' | 'facebook';
    filters?: Record<string, unknown>;
}

export interface SearchResponse {
    results: LeadResult[];
    total_found: number;
    query: string;
    execution_time: number;
    metadata: Record<string, unknown>;
}

export interface AuthStatus {
    source: string;
    authenticated: boolean;
    expires_at: string | null;
    capabilities: string[];
}

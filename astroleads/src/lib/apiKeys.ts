/**
 * API Keys Helper - Get settings from localStorage (configured in Settings)
 */

interface ApiSettings {
    openRouterKey: string;
    supabaseUrl: string;
    supabaseKey: string;
    hunterApiKey?: string;
    phantombusterApiKey?: string;
    newsApiKey?: string;
    testEmail: string;
    testModeEnabled: boolean;
}

const STORAGE_KEY = 'astroleads_api_keys';

export const getStoredSettings = (): ApiSettings => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        console.warn('Failed to parse stored settings');
    }

    return {
        openRouterKey: '',
        supabaseUrl: '',
        supabaseKey: '',
        hunterApiKey: '',
        phantombusterApiKey: '',
        newsApiKey: '',
        testEmail: '',
        testModeEnabled: true,
    };
};


export const getSupabaseUrl = (): string => getStoredSettings().supabaseUrl || import.meta.env.VITE_SUPABASE_URL || '';
export const getSupabaseKey = (): string => getStoredSettings().supabaseKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const getOpenRouterKey = (): string => getStoredSettings().openRouterKey || import.meta.env.VITE_OPENROUTER_API_KEY || '';
export const getHunterApiKey = (): string => getStoredSettings().hunterApiKey || import.meta.env.VITE_HUNTER_API_KEY || '';
export const getPhantomBusterApiKey = (): string => getStoredSettings().phantombusterApiKey || import.meta.env.VITE_PHANTOMBUSTER_API_KEY || '';
export const getNewsApiKey = (): string => getStoredSettings().newsApiKey || import.meta.env.VITE_NEWS_API_KEY || '';
export const getTestEmail = (): string => getStoredSettings().testEmail;
export const isTestModeEnabled = (): boolean => getStoredSettings().testModeEnabled;

/**
 * Get the actual recipient email - redirects to test email if test mode is enabled
 */
export const getEffectiveRecipient = (originalEmail: string): string => {
    const settings = getStoredSettings();
    console.log('🔍 [TestMode] Current settings:', {
        testModeEnabled: settings.testModeEnabled,
        testEmail: settings.testEmail,
        hasTestEmail: !!settings.testEmail,
    });

    if (settings.testModeEnabled && settings.testEmail) {
        console.log(`✅ [TestMode] Redirecting email from ${originalEmail} → ${settings.testEmail}`);
        return settings.testEmail;
    }

    console.log(`⚠️ [TestMode] NOT redirecting - testModeEnabled: ${settings.testModeEnabled}, testEmail: "${settings.testEmail}"`);
    return originalEmail;
};

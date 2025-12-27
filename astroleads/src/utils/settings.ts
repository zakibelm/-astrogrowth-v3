export interface ApiSettings {
    openRouterKey: string;
    supabaseUrl: string;
    supabaseKey: string;
    hunterApiKey: string;
    phantombusterApiKey: string;
    newsApiKey: string;
    testEmail: string;
    testModeEnabled: boolean;
}

export const STORAGE_KEY = 'astroleads_api_keys';

// Helper to get settings from localStorage
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

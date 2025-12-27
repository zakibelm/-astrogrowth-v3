import { supabase } from '@/lib/supabaseClient';
import { getStoredSettings } from '@/utils/settings';

export interface VerificationResult {
    status: 'valid' | 'risky' | 'invalid' | 'unknown';
    score: number;
    provider_data?: unknown;
}

export const verifyEmail = async (email: string): Promise<VerificationResult> => {
    try {
        const settings = getStoredSettings();
        const { data, error } = await supabase.functions.invoke('verify-email', {
            body: {
                email,
                apiKey: settings.hunterApiKey
            },
        });

        if (error) throw error;

        return data as VerificationResult;
    } catch (error) {
        console.error('Error verifying email:', error);
        // Return unknown state if things fail, rather than blocking the UI
        return { status: 'unknown', score: 0 };
    }
};

export const updateLeadVerification = async (leadId: string, result: VerificationResult) => {
    const { error } = await supabase
        .from('leads')
        .update({
            verification_status: result.status,
            verification_score: result.score,
            last_verified_at: new Date().toISOString()
        })
        .eq('id', leadId);

    if (error) throw error;
};

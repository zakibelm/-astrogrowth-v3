/**
 * Lead Enrichment Service - Validate and find emails using Hunter.io
 */

import { getHunterApiKey } from '@/lib/apiKeys';

export interface EmailValidationResult {
    email: string;
    valid: boolean;
    score: number; // 0-100
    status: 'valid' | 'invalid' | 'accept_all' | 'webmail' | 'disposable' | 'unknown';
}

export interface EmailFinderResult {
    email: string | null;
    confidence: number; // 0-100
    sources: string[];
}

export interface EnrichmentResult {
    success: boolean;
    originalEmail?: string;
    foundEmail?: string;
    validatedEmail?: string;
    emailValid?: boolean;
    confidence?: number;
    error?: string;
}

/**
 * Validate email with Hunter.io Email Verifier
 */
export async function validateEmail(email: string): Promise<EmailValidationResult> {
    const apiKey = getHunterApiKey();

    if (!apiKey) {
        console.warn('⚠️ [Enrichment] Hunter.io API key not configured');
        // Return optimistic validation
        return {
            email,
            valid: true,
            score: 50,
            status: 'unknown',
        };
    }

    try {
        console.log(`🔍 [Enrichment] Validating email: ${email}`);

        const response = await fetch(
            `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(`Hunter.io API returned ${response.status}`);
        }

        const data = await response.json();

        if (data.errors) {
            throw new Error(data.errors[0].details);
        }

        const result = data.data;

        console.log(`✅ [Enrichment] Email validation: ${result.status} (score: ${result.score})`);

        return {
            email: result.email,
            valid: result.status === 'valid',
            score: result.score,
            status: result.status,
        };
    } catch (error) {
        console.error('❌ [Enrichment] Email validation error:', error);
        // Return optimistic validation on error
        return {
            email,
            valid: true,
            score: 50,
            status: 'unknown',
        };
    }
}

/**
 * Find email using Hunter.io Email Finder
 */
export async function findEmail(
    firstName: string,
    lastName: string,
    domain: string
): Promise<EmailFinderResult> {
    const apiKey = getHunterApiKey();

    if (!apiKey) {
        console.warn('⚠️ [Enrichment] Hunter.io API key not configured');
        return {
            email: null,
            confidence: 0,
            sources: [],
        };
    }

    try {
        console.log(`🔍 [Enrichment] Finding email for ${firstName} ${lastName} at ${domain}`);

        const response = await fetch(
            `https://api.hunter.io/v2/email-finder?domain=${encodeURIComponent(domain)}&first_name=${encodeURIComponent(firstName)}&last_name=${encodeURIComponent(lastName)}&api_key=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(`Hunter.io API returned ${response.status}`);
        }

        const data = await response.json();

        if (data.errors) {
            console.warn(`⚠️ [Enrichment] Hunter.io error: ${data.errors[0].details}`);
            return {
                email: null,
                confidence: 0,
                sources: [],
            };
        }

        const result = data.data;

        if (result.email) {
            console.log(`✅ [Enrichment] Found email: ${result.email} (confidence: ${result.score}%)`);
        } else {
            console.log(`❌ [Enrichment] No email found`);
        }

        return {
            email: result.email,
            confidence: result.score,
            sources: result.sources || [],
        };
    } catch (error) {
        console.error('❌ [Enrichment] Email finder error:', error);
        return {
            email: null,
            confidence: 0,
            sources: [],
        };
    }
}

/**
 * Extract domain from company name or website
 */
export function extractDomain(companyOrWebsite: string): string {
    // Remove common prefixes
    let domain = companyOrWebsite
        .toLowerCase()
        .replace(/^(https?:\/\/)?(www\.)?/, '')
        .split('/')[0];

    // If it doesn't have a TLD, try to guess it
    if (!domain.includes('.')) {
        domain = `${domain}.com`;
    }

    return domain;
}

/**
 * Enrich a single lead with email validation and finding
 */
export async function enrichLead(
    lead: {
        first_name?: string;
        last_name?: string;
        email?: string;
        company?: string;
        website?: string;
    },
    options: {
        validateEmail?: boolean;
        findEmail?: boolean;
    } = {}
): Promise<EnrichmentResult> {
    try {
        const result: EnrichmentResult = { success: false };

        // Step 1: Validate existing email
        if (options.validateEmail && lead.email) {
            const validation = await validateEmail(lead.email);
            result.originalEmail = lead.email;
            result.validatedEmail = validation.email;
            result.emailValid = validation.valid;
            result.confidence = validation.score;

            if (validation.valid) {
                result.success = true;
                return result;
            }
        }

        // Step 2: Try to find email if missing or invalid
        if (
            options.findEmail &&
            lead.first_name &&
            lead.last_name &&
            (lead.company || lead.website)
        ) {
            const domain = extractDomain(lead.company || lead.website!);
            const found = await findEmail(lead.first_name, lead.last_name, domain);

            if (found.email) {
                result.foundEmail = found.email;
                result.confidence = found.confidence;
                result.success = true;
                return result;
            }
        }

        // Step 3: If we have an email (even unvalidated), mark as success
        if (lead.email) {
            result.originalEmail = lead.email;
            result.success = true;
            return result;
        }

        return result;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Enrich multiple leads in batch (with rate limiting)
 */
export async function enrichLeadsBatch(
    leads: Array<{
        first_name?: string;
        last_name?: string;
        email?: string;
        company?: string;
        website?: string;
    }>,
    options: {
        validateEmail?: boolean;
        findEmail?: boolean;
        onProgress?: (current: number, total: number, result: EnrichmentResult) => void;
    } = {}
): Promise<EnrichmentResult[]> {
    const results: EnrichmentResult[] = [];
    const apiKey = getHunterApiKey();

    // If no API key, skip enrichment
    if (!apiKey) {
        console.warn('⚠️ [Enrichment] Skipping batch enrichment - no API key');
        return leads.map(() => ({ success: false, error: 'No API key configured' }));
    }

    for (let i = 0; i < leads.length; i++) {
        const lead = leads[i];
        const result = await enrichLead(lead, options);
        results.push(result);

        if (options.onProgress) {
            options.onProgress(i + 1, leads.length, result);
        }

        // Rate limiting: 1 request per second (Hunter.io free tier)
        if (i < leads.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return results;
}

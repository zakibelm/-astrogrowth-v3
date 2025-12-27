/**
 * List of generic email providers that we should NOT try to fetch logos for.
 */
export const GENERIC_DOMAINS = new Set([
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'live.com',
    'icloud.com',
    'aol.com',
    'protonmail.com',
    'zoho.com',
    'mail.com',
    'gmx.com',
    'yandex.com',
]);

/**
 * Extracts the domain from an email address.
 * @param email The email address to parse
 * @returns The domain string (lowercase) or null if invalid
 */
export const extractDomainFromEmail = (email: string): string | null => {
    if (!email || !email.includes('@')) return null;

    try {
        const parts = email.split('@');
        if (parts.length !== 2) return null;

        if (!parts[1]) return null;
        const domain = parts[1].toLowerCase().trim();
        return domain;
    } catch (e) {
        return null;
    }
};

/**
 * Checks if a domain is a generic email provider.
 * @param domain The domain to check
 * @returns true if generic, false if likely a company domain
 */
export const isGenericDomain = (domain: string): boolean => {
    if (!domain) return false;
    return GENERIC_DOMAINS.has(domain.toLowerCase());
};

/**
 * Gets a clean domain for logo fetching, or null if it's generic/invalid.
 */
export const getCompanyDomain = (email: string): string | null => {
    const domain = extractDomainFromEmail(email);
    if (!domain) return null;
    if (isGenericDomain(domain)) return null;
    return domain;
};

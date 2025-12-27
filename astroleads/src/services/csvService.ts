/**
 * CSV Service - Parse and validate CSV files for lead import
 */

import Papa from 'papaparse';

export interface CSVRow {
    [key: string]: string;
}

export interface ColumnMapping {
    firstName?: string;
    lastName?: string;
    email?: string;
    company?: string;
    position?: string;
    phone?: string;
    linkedin_url?: string;
    website?: string;
    notes?: string;
}

export interface ParsedCSV {
    headers: string[];
    rows: CSVRow[];
    detectedColumns: ColumnMapping;
    errors: string[];
}

// Common column name variations for auto-detection
const COLUMN_PATTERNS: Record<keyof ColumnMapping, RegExp[]> = {
    firstName: [/first.?name/i, /prenom/i, /fname/i, /given.?name/i],
    lastName: [/last.?name/i, /nom/i, /lname/i, /family.?name/i, /surname/i],
    email: [/e.?mail/i, /courriel/i, /contact/i],
    company: [/company/i, /entreprise/i, /organization/i, /business/i, /societe/i],
    position: [/position/i, /title/i, /job/i, /role/i, /poste/i, /fonction/i],
    phone: [/phone/i, /tel/i, /telephone/i, /mobile/i, /cell/i],
    linkedin_url: [/linkedin/i, /linked.?in/i, /profile/i],
    website: [/website/i, /site/i, /web/i, /url/i, /domain/i],
    notes: [/notes/i, /comment/i, /description/i, /remarque/i],
};

/**
 * Auto-detect column mappings from CSV headers
 */
function detectColumns(headers: string[]): ColumnMapping {
    const mapping: ColumnMapping = {};

    for (const [field, patterns] of Object.entries(COLUMN_PATTERNS)) {
        for (const header of headers) {
            if (patterns.some(pattern => pattern.test(header))) {
                mapping[field as keyof ColumnMapping] = header;
                break;
            }
        }
    }

    return mapping;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Parse CSV file
 */
export async function parseCSV(file: File): Promise<ParsedCSV> {
    return new Promise((resolve, reject) => {
        const errors: string[] = [];

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const headers = results.meta.fields || [];
                const rows = results.data as CSVRow[];

                // Detect column mappings
                const detectedColumns = detectColumns(headers);

                // Collect parsing errors
                if (results.errors.length > 0) {
                    results.errors.forEach(err => {
                        errors.push(`Row ${err.row}: ${err.message}`);
                    });
                }

                resolve({
                    headers,
                    rows,
                    detectedColumns,
                    errors,
                });
            },
            error: (error) => {
                reject(new Error(`CSV parsing failed: ${error.message}`));
            },
        });
    });
}

/**
 * Validate CSV data before import
 */
export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}

export function validateCSVData(
    rows: CSVRow[],
    columnMapping: ColumnMapping
): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (rows.length === 0) {
        errors.push('CSV file is empty');
        return { valid: false, errors, warnings };
    }

    // Check if at least email OR (firstName + lastName + company) is mapped
    const hasEmail = !!columnMapping.email;
    const hasNameAndCompany = !!(
        columnMapping.firstName &&
        columnMapping.lastName &&
        columnMapping.company
    );

    if (!hasEmail && !hasNameAndCompany) {
        errors.push(
            'CSV must have either "email" column OR "firstName" + "lastName" + "company" columns'
        );
        return { valid: false, errors, warnings };
    }

    // Validate each row
    rows.forEach((row, index) => {
        const rowNum = index + 2; // +2 because header is row 1, data starts at row 2

        // Check email if column is mapped
        if (columnMapping.email) {
            const email = row[columnMapping.email];
            if (email && !isValidEmail(email)) {
                warnings.push(`Row ${rowNum}: Invalid email format "${email}"`);
            } else if (!email) {
                warnings.push(`Row ${rowNum}: Missing email`);
            }
        }

        // Check required fields for email finding
        if (!columnMapping.email || !row[columnMapping.email]) {
            if (columnMapping.firstName && !row[columnMapping.firstName]) {
                warnings.push(`Row ${rowNum}: Missing first name`);
            }
            if (columnMapping.lastName && !row[columnMapping.lastName]) {
                warnings.push(`Row ${rowNum}: Missing last name`);
            }
            if (columnMapping.company && !row[columnMapping.company]) {
                warnings.push(`Row ${rowNum}: Missing company`);
            }
        }
    });

    // Limit warnings to first 10
    if (warnings.length > 10) {
        const remaining = warnings.length - 10;
        warnings.splice(10);
        warnings.push(`... and ${remaining} more warnings`);
    }

    return {
        valid: true,
        errors,
        warnings,
    };
}

/**
 * Map CSV row to Lead object
 */
export function mapRowToLead(row: CSVRow, columnMapping: ColumnMapping): Partial<any> {
    return {
        first_name: columnMapping.firstName ? row[columnMapping.firstName] : undefined,
        last_name: columnMapping.lastName ? row[columnMapping.lastName] : undefined,
        email: columnMapping.email ? row[columnMapping.email] : undefined,
        company: columnMapping.company ? row[columnMapping.company] : undefined,
        position: columnMapping.position ? row[columnMapping.position] : undefined,
        phone: columnMapping.phone ? row[columnMapping.phone] : undefined,
        linkedin_url: columnMapping.linkedin_url ? row[columnMapping.linkedin_url] : undefined,
        website: columnMapping.website ? row[columnMapping.website] : undefined,
        notes: columnMapping.notes ? row[columnMapping.notes] : undefined,
    };
}

/**
 * Generate sample CSV template
 */
export function generateSampleCSV(type: 'linkedin' | 'google-maps' | 'social-media'): string {
    const templates = {
        linkedin: `first_name,last_name,email,company,position,linkedin_url
Marie,Martin,marie@techcorp.com,TechCorp,CTO,https://linkedin.com/in/marie-m
Jean,Dupont,jean.dupont@innovate.com,Innovate Inc,CEO,https://linkedin.com/in/jdupont`,

        'google-maps': `business_name,phone,website,address,category
Restaurant Le Gourmet,514-555-0123,www.legourmet.com,"123 Main St, Montreal",Restaurant
Café Bistro,514-555-0456,www.cafebistro.com,"456 Oak Ave, Montreal",Cafe`,

        'social-media': `name,username,email,followers,notes
Sophie Tremblay,@sophiet,sophie@example.com,1234,Influencer mode
Marc Leblanc,@marcl,marc@example.com,5678,Tech enthusiast`,
    };

    return templates[type];
}

/**
 * Download sample CSV
 */
export function downloadSampleCSV(type: 'linkedin' | 'google-maps' | 'social-media') {
    const csv = generateSampleCSV(type);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `astroleads-template-${type}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
}

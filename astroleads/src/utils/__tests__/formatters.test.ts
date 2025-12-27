import { describe, it, expect } from 'vitest';
import {
    formatNumber,
    formatCurrency,
    formatPercentage,
    formatDate,
    formatDateShort,
    truncate,
    capitalize,
    slugify,
} from '../formatters';

describe('formatters', () => {
    describe('formatNumber', () => {
        it('should format numbers with thousands separator', () => {
            // French locale uses space or non-breaking space as separator
            const result = formatNumber(1234567);
            expect(result.replace(/\s/g, ' ')).toContain('234');
        });

        it('should handle zero', () => {
            expect(formatNumber(0)).toBe('0');
        });
    });

    describe('formatCurrency', () => {
        it('should format currency with symbol', () => {
            const result = formatCurrency(1234.56);
            expect(result).toContain('€');
        });
    });

    describe('formatPercentage', () => {
        it('should format percentage with one decimal', () => {
            expect(formatPercentage(42.5)).toBe('42.5%');
        });

        it('should handle custom decimals', () => {
            expect(formatPercentage(42.567, 2)).toBe('42.57%');
        });
    });

    describe('formatDate', () => {
        it('should format date in French locale', () => {
            const result = formatDate('2023-10-15');
            expect(result).toContain('octobre');
            expect(result).toContain('2023');
        });
    });

    describe('formatDateShort', () => {
        it('should format date in short format', () => {
            const result = formatDateShort('2023-10-15');
            expect(result).toContain('2023');
        });
    });

    describe('truncate', () => {
        it('should truncate long text', () => {
            expect(truncate('This is a very long text', 10)).toBe('This is a...');
        });

        it('should not truncate short text', () => {
            expect(truncate('Short', 10)).toBe('Short');
        });
    });

    describe('capitalize', () => {
        it('should capitalize first letter', () => {
            expect(capitalize('hello')).toBe('Hello');
        });

        it('should handle empty string', () => {
            expect(capitalize('')).toBe('');
        });
    });

    describe('slugify', () => {
        it('should convert to slug format', () => {
            expect(slugify('Hello World')).toBe('hello-world');
        });

        it('should remove special characters', () => {
            expect(slugify('Hello, World!')).toBe('hello-world');
        });

        it('should handle multiple spaces', () => {
            expect(slugify('Hello   World')).toBe('hello-world');
        });
    });
});

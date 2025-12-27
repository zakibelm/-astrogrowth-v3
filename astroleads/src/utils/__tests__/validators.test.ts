import { describe, it, expect } from 'vitest';
import {
    emailSchema,
    campaignNameSchema,
    isValidEmail,
    isValidUrl,
    isNotEmpty,
    validate,
    loginFormSchema,
} from '../validators';

describe('validators', () => {
    describe('emailSchema', () => {
        it('should validate correct email', () => {
            expect(emailSchema.safeParse('test@example.com').success).toBe(true);
        });

        it('should reject invalid email', () => {
            expect(emailSchema.safeParse('invalid-email').success).toBe(false);
        });

        it('should reject empty email', () => {
            expect(emailSchema.safeParse('').success).toBe(false);
        });
    });

    describe('campaignNameSchema', () => {
        it('should validate valid campaign name', () => {
            expect(campaignNameSchema.safeParse('My Campaign').success).toBe(true);
        });

        it('should reject too short name', () => {
            expect(campaignNameSchema.safeParse('AB').success).toBe(false);
        });
    });

    describe('isValidEmail', () => {
        it('should return true for valid email', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
        });

        it('should return false for invalid email', () => {
            expect(isValidEmail('not-an-email')).toBe(false);
        });
    });

    describe('isValidUrl', () => {
        it('should return true for valid URL', () => {
            expect(isValidUrl('https://example.com')).toBe(true);
        });

        it('should return false for invalid URL', () => {
            expect(isValidUrl('not-a-url')).toBe(false);
        });
    });

    describe('isNotEmpty', () => {
        it('should return true for non-empty string', () => {
            expect(isNotEmpty('hello')).toBe(true);
        });

        it('should return false for empty string', () => {
            expect(isNotEmpty('')).toBe(false);
        });

        it('should return false for whitespace only', () => {
            expect(isNotEmpty('   ')).toBe(false);
        });
    });

    describe('validate function', () => {
        it('should return success for valid data', () => {
            const result = validate(loginFormSchema, {
                email: 'test@example.com',
                password: 'password123',
            });

            expect(result.success).toBe(true);
        });

        it('should return errors for invalid data', () => {
            const result = validate(loginFormSchema, {
                email: 'invalid',
                password: '',
            });

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.errors).toHaveProperty('email');
                expect(result.errors).toHaveProperty('password');
            }
        });
    });
});

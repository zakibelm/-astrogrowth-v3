import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z
    .string()
    .min(1, 'Email requis')
    .email('Email invalide');

/**
 * Password validation schema
 */
export const passwordSchema = z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre');

/**
 * Campaign name validation schema
 */
export const campaignNameSchema = z
    .string()
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères');

/**
 * API key validation schema
 */
export const apiKeySchema = z
    .string()
    .min(10, 'Clé API trop courte')
    .max(200, 'Clé API trop longue');

/**
 * URL validation schema
 */
export const urlSchema = z
    .string()
    .url('URL invalide')
    .optional()
    .or(z.literal(''));

/**
 * Phone validation schema (international format)
 */
export const phoneSchema = z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Numéro de téléphone invalide')
    .optional()
    .or(z.literal(''));

/**
 * Login form schema
 */
export const loginFormSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Mot de passe requis'),
});

/**
 * Register form schema
 */
export const registerFormSchema = z.object({
    name: z.string().min(2, 'Nom requis'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
});

/**
 * Campaign creation form schema
 */
export const campaignFormSchema = z.object({
    name: campaignNameSchema,
    productName: z.string().min(1, 'Nom du produit requis'),
    serviceDescription: z.string().optional(),
    targetAudience: z.string().min(1, 'Audience cible requise'),
    geolocation: z.string().optional(),
    platforms: z.array(z.string()).min(1, 'Sélectionnez au moins une plateforme'),
});

/**
 * Lead form schema
 */
export const leadFormSchema = z.object({
    firstName: z.string().min(1, 'Prénom requis'),
    lastName: z.string().min(1, 'Nom requis'),
    email: emailSchema,
    company: z.string().optional(),
    position: z.string().optional(),
    phone: phoneSchema,
});

// Type exports
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type CampaignFormData = z.infer<typeof campaignFormSchema>;
export type LeadFormData = z.infer<typeof leadFormSchema>;

/**
 * Validate data against a schema
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: Record<string, string> } {
    const result = schema.safeParse(data);

    if (result.success) {
        return { success: true, data: result.data };
    }

    const errors: Record<string, string> = {};
    result.error.errors.forEach((error) => {
        const path = error.path.join('.');
        errors[path] = error.message;
    });

    return { success: false, errors };
}

/**
 * Simple validation helpers
 */
export const isValidEmail = (email: string): boolean => {
    return emailSchema.safeParse(email).success;
};

export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const isNotEmpty = (value: string): boolean => {
    return value.trim().length > 0;
};

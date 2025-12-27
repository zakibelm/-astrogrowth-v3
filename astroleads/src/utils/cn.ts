import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx for conditional class handling
 * This prevents class conflicts and ensures proper specificity
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

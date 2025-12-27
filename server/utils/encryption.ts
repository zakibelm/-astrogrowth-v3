import * as crypto from 'crypto';

// Use a secure key from environment variables, or generate one if missing (dev only)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'dev-key-must-be-32-bytes-long!!!!'; // Must be 32 chars
const IV_LENGTH = 16; // For AES, this is always 16

export function encrypt(text: string): string {
    if (!text) return text;

    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const key = Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32));

        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
        console.error('[Encryption] Failed to encrypt:', error);
        return text; // Fallback to raw text (not ideal but prevents dataloss in dev)
    }
}

export function decrypt(text: string): string {
    if (!text) return text;

    try {
        const textParts = text.split(':');
        if (textParts.length !== 2) return text; // Not encrypted or invalid format

        const iv = Buffer.from(textParts[0], 'hex');
        const encryptedText = Buffer.from(textParts[1], 'hex');
        const key = Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32));

        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    } catch (error) {
        console.error('[Encryption] Failed to decrypt:', error);
        return text;
    }
}

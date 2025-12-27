/**
 * Email Service - Send emails via Supabase Edge Function (bypasses CORS)
 */

import { getSupabaseUrl, getSupabaseKey, getEffectiveRecipient, isTestModeEnabled } from '@/lib/apiKeys';

export interface EmailPayload {
    to: string;
    subject: string;
    html: string;
    text?: string;
    from?: string;
    replyTo?: string;
}

export interface SendEmailResult {
    success: boolean;
    id?: string;
    error?: string;
    testMode?: boolean;
    originalRecipient?: string;
}

/**
 * Send a real email via Supabase Edge Function
 */
export async function sendEmail(payload: EmailPayload): Promise<SendEmailResult> {
    const supabaseUrl = getSupabaseUrl();
    const supabaseKey = getSupabaseKey();

    if (!supabaseUrl || !supabaseKey) {
        console.warn('⚠️ [Email] Supabase not configured, simulating send');
        return { success: true, id: `simulated-${Date.now()}` };
    }

    // Get effective recipient (may be redirected in test mode)
    const effectiveRecipient = getEffectiveRecipient(payload.to);
    const testMode = isTestModeEnabled();

    // Update subject to indicate test mode and original recipient
    const subject = testMode && effectiveRecipient !== payload.to
        ? `[TEST pour ${payload.to}] ${payload.subject}`
        : payload.subject;

    try {
        console.log(`📧 [Email] Sending to ${effectiveRecipient}${testMode ? ' (TEST MODE)' : ''}...`);

        // Ensure URL doesn't have double slash or missing /functions/v1
        const baseUrl = supabaseUrl.replace(/\/+$/, '');
        const functionUrl = `${baseUrl}/functions/v1/send-email`;

        console.log('🔗 [Email] Target URL:', functionUrl);

        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: effectiveRecipient,
                subject: subject,
                html: payload.html,
                text: payload.text,
                from: payload.from,
                replyTo: payload.replyTo,
            }),
        });

        const data = await response.json();

        console.log('📧 [Email] Response:', data);

        if (!response.ok || !data.success) {
            const errorMsg = data.error || 'Failed to send email';
            console.error('❌ [Email] Send failed:', errorMsg);
            return { success: false, error: errorMsg };
        }

        console.log('✅ [Email] Successfully sent, ID:', data.id);
        return { success: true, id: data.id };
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ [Email] Error:', errorMsg);

        // Provide helpful guidance based on error type
        if (errorMsg.includes('fetch') || errorMsg.includes('Failed to fetch')) {
            console.error('💡 [Email] Possible causes:');
            console.error('   1. RESEND_API_KEY not configured in Supabase Edge Functions');
            console.error('   2. Edge Function not deployed or not accessible');
            console.error('   3. Network connectivity issue');
            console.error('   See RESEND_SETUP.md for configuration instructions');
        }

        return {
            success: false,
            error: errorMsg
        };
    }
}

/**
 * Send a batch of emails (with delay to avoid rate limiting)
 */
export async function sendEmailBatch(
    emails: EmailPayload[],
    onProgress?: (sent: number, total: number, result: SendEmailResult) => void,
    delayMs: number = 1000
): Promise<{ sent: number; failed: number; results: SendEmailResult[] }> {
    const results: SendEmailResult[] = [];
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < emails.length; i++) {
        const email = emails[i];
        if (!email) continue;

        const result = await sendEmail(email);
        results.push(result);

        if (result.success) {
            sent++;
        } else {
            failed++;
        }

        if (onProgress) {
            onProgress(i + 1, emails.length, result);
        }

        // Delay between emails to avoid rate limiting
        if (i < emails.length - 1) {
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }

    return { sent, failed, results };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Create HTML email template
 */
export function createEmailTemplate(
    body: string,
    footer?: string
): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    ${body}
    ${footer ? `<div class="footer">${footer}</div>` : ''}
  </div>
</body>
</html>
  `.trim();
}

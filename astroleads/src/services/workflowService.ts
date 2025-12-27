/**
 * Workflow Orchestrator Service
 * Manages the complete campaign workflow execution
 */

import { generateLeads, generateColdEmail, type GeneratedLead } from './leadGeneratorService';
import { sendEmail, createEmailTemplate, type SendEmailResult } from './emailService';
import { leadOperations, emailOperations, type DbLead, type DbSentEmail, supabase } from './supabaseService';
import { useActivityStore } from '@/stores/activityStore';

export type WorkflowStepType =
    | 'generating_leads'
    | 'qualifying_leads'
    | 'generating_emails'
    | 'reviewing_emails'
    | 'sending_emails'
    | 'tracking';

export interface WorkflowContext {
    campaignId: string;
    campaignName: string;
    productName: string;
    serviceDescription: string;
    targetAudience: string;
    geolocation: string;
    platforms: string[];
    numberOfLeads: number;
    senderEmail?: string;
    senderName?: string;      // Client's name for email signature
    companyName?: string;     // Client's company name
}

export interface WorkflowResult {
    success: boolean;
    leadsGenerated: number;
    emailsSent: number;
    errors: string[];
}

export type WorkflowCallback = (
    step: WorkflowStepType,
    message: string,
    data?: unknown
) => void;

/**
 * Execute the full campaign workflow
 */
export async function executeWorkflow(
    context: WorkflowContext,
    onProgress: WorkflowCallback,
    onLeadGenerated?: (lead: GeneratedLead, index: number) => Promise<boolean>,
    onEmailPreview?: (lead: GeneratedLead, email: { subject: string; body: string }) => Promise<boolean>
): Promise<WorkflowResult> {
    const result: WorkflowResult = {
        success: false,
        leadsGenerated: 0,
        emailsSent: 0,
        errors: [],
    };

    // DEMO MODE LIMIT CHECK
    try {
        const { count } = await supabase.from('campaigns').select('*', { count: 'exact', head: true });
        // Allow up to 10 campaigns in demo mode
        if (count !== null && count >= 10) {
            const errorMsg = "⚠️ Mode Démo : Limite de 10 campagnes atteinte. Veuillez contacter l'administrateur.";
            console.error(errorMsg);
            // Notify via callback to show in UI immediately
            onProgress('tracking', errorMsg);
            throw new Error(errorMsg);
        }
    } catch (err) {
        // If the error is our own limit, rethrow it to stop execution
        if (err instanceof Error && err.message.includes('Mode Démo')) {
            throw err;
        }
        // Otherwise ignore DB error (e.g. table doesn't exist yet) and proceed
        console.warn('⚠️ Could not verify campaign limit:', err);
    }

    const addActivity = useActivityStore.getState().addActivity;

    console.log('🚀 [Workflow] Starting with context:', context);

    try {
        // Step 1: Generate Leads
        console.log('🔍 [Workflow] Step 1: Generating leads...');
        onProgress('generating_leads', '🔍 Génération des leads en cours...');

        // Determine primary agent based on platform
        const primaryPlatform = context.platforms?.[0] || 'LinkedIn';
        const agentName = primaryPlatform.toLowerCase().includes('linkedin')
            ? 'Éclaireur LinkedIn'
            : `Éclaireur ${primaryPlatform}`;

        addActivity({
            campaignId: context.campaignId,
            campaignName: context.campaignName,
            type: 'ai_analysis',
            title: '🚀 Démarrage de la génération de leads',
            description: `Critères: ${context.targetAudience}\nNombre demandé: ${context.numberOfLeads}\n\n⏳ Appel à l'IA en cours...`,
            status: 'running',
            agentName: agentName,
        });

        console.log('🔍 [Workflow] Calling generateLeads API...');
        const leads = await generateLeads({
            targetAudience: context.targetAudience,
            productName: context.productName,
            serviceDescription: context.serviceDescription,
            geolocation: context.geolocation,
            platforms: context.platforms,
            numberOfLeads: context.numberOfLeads,
        });

        console.log(`✅ [Workflow] Generated ${leads.length} leads:`, leads);

        // Step 2: Process each lead
        const approvedLeads: GeneratedLead[] = [];

        for (const lead of leads) {
            console.log(`📋 [Workflow] Processing lead:`, lead);
            onProgress('qualifying_leads', `✅ Lead: ${lead.firstName} ${lead.lastName}`);

            addActivity({
                campaignId: context.campaignId,
                campaignName: context.campaignName,
                type: 'lead_scraped',
                title: `🔍 Lead trouvé: ${lead.firstName} ${lead.lastName}`,
                description: `📍 ${lead.company} | 💼 ${lead.position}\n📧 ${lead.email}\n🎯 Score: ${lead.score}/100\n\n💡 ${lead.reasoning}`,
                status: 'completed',
                agentName: agentName,
            });

            // Allow user to approve/skip lead
            const approved = onLeadGenerated ? await onLeadGenerated(lead, approvedLeads.length) : true;

            if (approved) {
                approvedLeads.push(lead);
                result.leadsGenerated++;

                // Save to database (silent fail)
                try {
                    const dbLead: DbLead = {
                        campaign_id: context.campaignId,
                        first_name: lead.firstName,
                        last_name: lead.lastName,
                        email: lead.email,
                        company: lead.company,
                        position: lead.position,
                        linkedin_url: lead.linkedinUrl,
                        score: lead.score,
                        status: 'qualified',
                    };
                    await leadOperations.create(dbLead);
                } catch (dbError) {
                    console.warn('DB save failed:', dbError);
                }
            }

            // Small delay between leads
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Step 3: Generate and send emails for approved leads
        for (const lead of approvedLeads) {
            console.log(`📧 [Workflow] Generating email for:`, lead.email);
            onProgress('generating_emails', `✍️ Génération email pour ${lead.firstName}`);

            // Generate personalized email with CLIENT's signature
            const senderSignature = context.senderName
                ? `${context.senderName}${context.companyName ? `\n${context.companyName}` : ''}`
                : 'L\'équipe commerciale';

            const emailContent = await generateColdEmail(
                lead,
                context.productName,
                context.serviceDescription,
                senderSignature
            );

            console.log(`📧 [Workflow] Email generated:`, emailContent);

            addActivity({
                campaignId: context.campaignId,
                campaignName: context.campaignName,
                type: 'email_generated',
                title: `✍️ Email généré pour ${lead.firstName} ${lead.lastName}`,
                description: `📝 Objet: "${emailContent.subject}"\n\n💬 Aperçu:\n"${emailContent.body.substring(0, 150)}..."`,
                status: 'completed',
                agentName: 'Rédacteur Cold Email',
            });

            // Allow user to preview/approve email
            const sendApproved = onEmailPreview
                ? await onEmailPreview(lead, emailContent)
                : true;

            if (sendApproved) {
                console.log(`📤 [Workflow] Sending email to:`, lead.email);
                onProgress('sending_emails', `📤 Envoi à ${lead.email}...`);

                // Send real email via Resend
                const sendResult: SendEmailResult = await sendEmail({
                    to: lead.email,
                    subject: emailContent.subject,
                    html: createEmailTemplate(emailContent.htmlBody),
                    text: emailContent.body,
                });

                console.log(`📤 [Workflow] Send result:`, sendResult);

                if (sendResult.success) {
                    result.emailsSent++;

                    addActivity({
                        campaignId: context.campaignId,
                        campaignName: context.campaignName,
                        type: 'email_sent',
                        title: `📤 Email envoyé à ${lead.firstName} ${lead.lastName}`,
                        description: `📧 ${lead.email}\n🏢 ${lead.company}\n✅ ID Resend: ${sendResult.id}`,
                        status: 'completed',
                        agentName: 'Orchestrateur Maître',
                    });

                    // Save to database (silent fail)
                    try {
                        const dbEmail: DbSentEmail = {
                            campaign_id: context.campaignId,
                            lead_id: '',
                            subject: emailContent.subject,
                            body: emailContent.body,
                            status: 'sent',
                            resend_id: sendResult.id,
                            sent_at: new Date().toISOString(),
                        };
                        await emailOperations.create(dbEmail);
                    } catch (dbError) {
                        console.warn('DB save failed:', dbError);
                    }
                } else {
                    result.errors.push(`Échec envoi à ${lead.email}: ${sendResult.error}`);

                    addActivity({
                        campaignId: context.campaignId,
                        campaignName: context.campaignName,
                        type: 'error',
                        title: `❌ Échec d'envoi à ${lead.email}`,
                        description: `Erreur: ${sendResult.error}`,
                        status: 'failed',
                        agentName: 'Orchestrateur Maître',
                    });
                }
            }

            // Delay between emails
            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        // Step 4: Summary
        console.log('🎉 [Workflow] Complete!', result);
        onProgress('tracking', '📊 Workflow terminé!');

        addActivity({
            campaignId: context.campaignId,
            campaignName: context.campaignName,
            type: 'ai_analysis',
            title: '🎉 Workflow terminé',
            description: `📊 Résumé:\n• ${result.leadsGenerated} leads générés\n• ${result.emailsSent} emails envoyés\n• ${result.errors.length} erreurs`,
            status: 'completed',
            agentName: 'Orchestrateur Maître',
        });

        result.success = true;

    } catch (error) {
        console.error('❌ [Workflow] Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        result.errors.push(errorMessage);

        addActivity({
            campaignId: context.campaignId,
            campaignName: context.campaignName,
            type: 'error',
            title: '❌ Erreur dans le workflow',
            description: errorMessage,
            status: 'failed',
            agentName: 'Orchestrateur Maître',
        });
    }

    return result;
}

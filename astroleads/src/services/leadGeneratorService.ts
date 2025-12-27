/**
 * Lead Generator Service
 * Uses OpenRouter AI to generate realistic leads based on campaign criteria
 */

import { getOpenRouterKey } from '@/lib/apiKeys';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const getApiKey = (): string => {
    return getOpenRouterKey();
};

export interface GeneratedLead {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    position: string;
    platform: string;
    profileUrl: string;
    score: number;
    reasoning: string;
    linkedinUrl?: string;
}

export interface LeadGenerationCriteria {
    targetAudience: string;
    productName: string;
    serviceDescription: string;
    geolocation: string;
    platforms: string[];
    numberOfLeads: number;
}

/**
 * Generate fallback leads when AI fails
 */
function generateFallbackLeads(criteria: LeadGenerationCriteria): GeneratedLead[] {
    const platforms = criteria.platforms.length > 0 ? criteria.platforms : ['LinkedIn'];
    const leads: GeneratedLead[] = [];

    const firstNames = ['Marie', 'Jean', 'Sophie', 'Thomas', 'Emma', 'Lucas', 'Léa', 'Hugo', 'Chloé', 'Louis'];
    const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau'];
    const companies = ['TechCorp', 'InnovateSAS', 'DataFlow', 'CloudView', 'AI Solutions', 'SmartBiz', 'NextGen', 'FutureTech', 'DigiLab', 'CyberNet'];
    const positions = ['CEO', 'CTO', 'Directeur Marketing', 'VP Sales', 'Head of Product', 'Founder', 'COO', 'CMO', 'Director', 'Manager'];

    for (let i = 0; i < Math.min(criteria.numberOfLeads, 10); i++) {
        const firstName = firstNames[i % firstNames.length] || 'User';
        const lastName = lastNames[i % lastNames.length] || 'Lead';
        const platform = platforms[i % platforms.length] || 'LinkedIn';
        const company = companies[i % companies.length] || 'Company';

        let profileUrl = '';
        switch (platform) {
            case 'Facebook':
                profileUrl = `https://facebook.com/${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
                break;
            case 'Instagram':
                profileUrl = `https://instagram.com/${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
                break;
            default:
                profileUrl = `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`;
        }

        leads.push({
            firstName,
            lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s/g, '')}.com`,
            company,
            position: positions[i % positions.length] || 'Manager',
            platform,
            profileUrl,
            linkedinUrl: profileUrl,
            score: 75 + Math.floor(Math.random() * 20),
            reasoning: `Lead qualifié basé sur les critères: ${criteria.targetAudience}`,
        });
    }

    return leads;
}

/**
 * Generate leads using AI based on campaign criteria
 */
export async function generateLeads(criteria: LeadGenerationCriteria): Promise<GeneratedLead[]> {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.warn('⚠️ [LeadGenerator] No API key, using fallback leads');
        return generateFallbackLeads(criteria);
    }

    console.log('📊 [LeadGenerator] Generating leads with criteria:', criteria);

    const platformsList = criteria.platforms.length > 0 ? criteria.platforms.join(', ') : 'LinkedIn';

    const prompt = `Tu es un expert en génération de leads B2B. Génère exactement ${criteria.numberOfLeads} leads réalistes.

Critères:
- Audience: ${criteria.targetAudience}
- Produit: ${criteria.productName}
- Géo: ${criteria.geolocation || 'France'}
- Plateformes: ${platformsList}

Génère un JSON array. Champs: firstName, lastName, email, company, position, platform, profileUrl, score (70-100), reasoning

IMPORTANT: JSON array uniquement, pas de texte.`;

    try {
        console.log('🔄 [LeadGenerator] Calling OpenRouter API...');

        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'AstroLeads',
            },
            body: JSON.stringify({
                model: 'anthropic/claude-3.5-sonnet',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 4000,
            }),
        });

        if (!response.ok) {
            console.error('❌ [LeadGenerator] API Error');
            return generateFallbackLeads(criteria);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content || '';

        console.log('📥 [LeadGenerator] Response length:', content.length);

        let leads: GeneratedLead[] = [];

        try {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed)) leads = parsed;
        } catch {
            const match = content.match(/\[[\s\S]*\]/);
            if (match) {
                try { leads = JSON.parse(match[0]); } catch { /* fallback */ }
            }
        }

        if (leads.length === 0) {
            console.warn('⚠️ [LeadGenerator] Parsing failed, using fallback');
            return generateFallbackLeads(criteria);
        }

        leads.forEach(lead => {
            lead.platform = lead.platform || 'LinkedIn';
            lead.profileUrl = lead.profileUrl || lead.linkedinUrl || '';
            lead.linkedinUrl = lead.linkedinUrl || lead.profileUrl;
        });

        console.log(`✅ [LeadGenerator] Generated ${leads.length} leads`);
        return leads;

    } catch (error) {
        console.error('❌ [LeadGenerator] Error:', error);
        return generateFallbackLeads(criteria);
    }
}

/**
 * Generate a bilingual email for Morocco investment opportunities
 * Targets individuals for: real estate, vehicle purchase, retirement, investments
 */
export async function generateColdEmail(
    lead: GeneratedLead,
    productName: string,
    serviceDescription: string,
    senderName: string = "Votre conseiller"
): Promise<{ subject: string; body: string; htmlBody: string }> {
    const apiKey = getApiKey();

    // Fallback email for Morocco investment opportunities
    const fallbackEmail = {
        subject: `${lead.firstName}, votre projet au Maroc commence ici | Your Morocco project starts here`,
        body: `[FRANÇAIS]

Bonjour ${lead.firstName},

Avez-vous déjà pensé à investir au Maroc ? 🇲🇦

Que ce soit pour :
🏠 Une résidence secondaire au soleil
🚗 L'achat d'une voiture (au lieu de louer à chaque visite)
🌴 Préparer votre retraite dans un cadre de vie exceptionnel
💰 Un investissement rentable avec des rendements attractifs

Le Maroc offre aujourd'hui des opportunités uniques pour les Marocains du monde et les investisseurs avisés.

${serviceDescription}

Je serais ravi(e) de vous présenter nos solutions personnalisées lors d'un appel de 15 minutes.

À très bientôt,
${senderName}

---

[ENGLISH]

Hello ${lead.firstName},

Have you ever considered investing in Morocco? 🇲🇦

Whether it's for:
🏠 A vacation home in the sun
🚗 Buying a car (instead of renting on every visit)
🌴 Planning your retirement in an exceptional setting
💰 A profitable investment with attractive returns

Morocco now offers unique opportunities for Moroccans abroad and savvy investors.

${serviceDescription}

I would be delighted to present our personalized solutions during a 15-minute call.

Looking forward to connecting,
${senderName}`,
        htmlBody: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="display: flex; border-bottom: 2px solid #e5e7eb; margin-bottom: 20px;">
    <div style="padding: 12px 24px; background: #c1272d; color: white; font-weight: bold; border-radius: 8px 8px 0 0;">Français</div>
    <div style="padding: 12px 24px; background: #006233; color: white; font-weight: bold; border-radius: 8px 8px 0 0; margin-left: 4px;">English</div>
  </div>
  
  <div style="background: #fef7f7; padding: 24px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #c1272d;">
    <h3 style="color: #c1272d; margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase;">Version Française</h3>
    <p>Bonjour <strong>${lead.firstName}</strong>,</p>
    <p>Avez-vous déjà pensé à <strong>investir au Maroc</strong> ? 🇲🇦</p>
    <p>Que ce soit pour :</p>
    <ul style="color: #444;">
      <li>🏠 Une <strong>résidence secondaire</strong> au soleil</li>
      <li>🚗 L'<strong>achat d'une voiture</strong> (au lieu de louer)</li>
      <li>🌴 Préparer votre <strong>retraite</strong> dans un cadre exceptionnel</li>
      <li>💰 Un <strong>investissement rentable</strong> avec des rendements attractifs</li>
    </ul>
    <p style="color: #666;">${serviceDescription}</p>
    <p>Je serais ravi(e) de vous présenter nos solutions lors d'un appel de 15 minutes.</p>
    <p style="margin-top: 20px;">À très bientôt,<br><strong>${senderName}</strong></p>
  </div>
  
  <div style="text-align: center; margin: 24px 0; color: #9ca3af;">───────────────</div>
  
  <div style="background: #f0fdf4; padding: 24px; border-radius: 8px; border-left: 4px solid #006233;">
    <h3 style="color: #006233; margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase;">English Version</h3>
    <p>Hello <strong>${lead.firstName}</strong>,</p>
    <p>Have you ever considered <strong>investing in Morocco</strong>? 🇲🇦</p>
    <p>Whether it's for:</p>
    <ul style="color: #444;">
      <li>🏠 A <strong>vacation home</strong> in the sun</li>
      <li>🚗 <strong>Buying a car</strong> (instead of renting)</li>
      <li>🌴 Planning your <strong>retirement</strong> in an exceptional setting</li>
      <li>💰 A <strong>profitable investment</strong> with attractive returns</li>
    </ul>
    <p style="color: #666;">${serviceDescription}</p>
    <p>I would be delighted to present our solutions during a 15-minute call.</p>
    <p style="margin-top: 20px;">Looking forward to connecting,<br><strong>${senderName}</strong></p>
  </div>
</div>`,
    };

    if (!apiKey) {
        return fallbackEmail;
    }

    console.log('✉️ [EmailGenerator] Generating Morocco investment email for:', lead.email);

    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'AstroLeads',
            },
            body: JSON.stringify({
                model: 'anthropic/claude-3.5-sonnet',
                messages: [{
                    role: 'user', content: `Rédige un email bilingue (FR + EN) personnalisé pour ${lead.firstName} ${lead.lastName}.

CONTEXTE: On cible les Marocains de l'étranger et investisseurs pour:
- Achat immobilier au Maroc (résidence secondaire)
- Achat de voiture au Maroc (au lieu de louer)
- Projet retraite au Maroc
- Investissements rentables au Maroc

Offre: ${productName}
Détails: ${serviceDescription}
Signature: ${senderName}

Ton: Chaleureux, personnel, inspirant (pas commercial agressif)
Format JSON: {"subject":"FR | EN","body":"[FRANÇAIS]...---[ENGLISH]...","htmlBody":"..."}` }],
                temperature: 0.7,
                max_tokens: 2500,
            }),
        });

        if (!response.ok) return fallbackEmail;

        const data = await response.json();
        const content = data.choices[0]?.message?.content || '';
        const jsonMatch = content.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            console.log('✅ [EmailGenerator] Morocco investment email generated');
            return JSON.parse(jsonMatch[0]);
        }

        return fallbackEmail;
    } catch (error) {
        console.error('❌ [EmailGenerator] Error:', error);
        return fallbackEmail;
    }
}

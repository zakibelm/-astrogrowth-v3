/**
 * OpenRouter AI Service
 * Single API key for all AI models (Claude, GPT-4, Gemini, Llama, etc.)
 */

import { getStoredSettings } from '@/utils/settings';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Get API key from user settings
const getApiKey = (): string => {
    const settings = getStoredSettings();
    return settings.openRouterKey || import.meta.env.VITE_OPENROUTER_API_KEY || '';
};

export interface OpenRouterMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface OpenRouterResponse {
    id: string;
    choices: Array<{
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }>;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

// Available models on OpenRouter
export const AI_MODELS = [
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
    { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
    { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5', provider: 'Google' },
    { id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5', provider: 'Google' },
    { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', provider: 'Meta' },
    { id: 'mistralai/mistral-large', name: 'Mistral Large', provider: 'Mistral' },
] as const;

export type ModelId = typeof AI_MODELS[number]['id'];

/**
 * Core function to call OpenRouter API
 */
export const callOpenRouter = async (
    messages: OpenRouterMessage[],
    model: string = 'anthropic/claude-3.5-sonnet',
    temperature: number = 0.7
): Promise<string> => {
    const apiKey = getApiKey();

    if (!apiKey) {
        throw new Error('Clé API OpenRouter non configurée. Ajoutez-la dans Paramètres → OpenRouter API Key');
    }

    const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'AstroLeads',
        },
        body: JSON.stringify({
            model,
            messages,
            temperature,
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `Erreur API: ${response.status}`);
    }

    const data: OpenRouterResponse = await response.json();
    return data.choices[0]?.message?.content || '';
};

/**
 * Generates a comprehensive campaign strategy.
 */
export const generateCampaignStrategy = async (
    productName: string,
    serviceDescription: string,
    audience: string,
    geolocation: string,
    platforms: string[],
    model: string = 'anthropic/claude-3.5-sonnet'
): Promise<string> => {
    const messages: OpenRouterMessage[] = [
        {
            role: 'system',
            content: 'Tu es un Stratège Marketing Senior expert en prospection B2B. Tu réponds toujours en français de manière concise et actionnable.'
        },
        {
            role: 'user',
            content: `Développe une stratégie de campagne brève mais impactante.

**Détails de la Campagne :**
- Produit/Service : ${productName}
- Description : ${serviceDescription}
- Audience Cible : ${audience}
- Géolocalisation : ${geolocation}
- Plateformes : ${platforms.join(', ')}

**Exigences :**
1. **Approche** : Comment approcher cette audience.
2. **Ton & Voix** : Style de communication recommandé.
3. **Tactiques Plateforme** : 1 conseil par plateforme.
4. **Argument Clé** : L'angle le plus persuasif.

Reste concis (moins de 200 mots), professionnel et actionnable.`
        }
    ];

    return callOpenRouter(messages, model, 0.7);
};

/**
 * Generates a cold outreach email.
 */
export const generateColdEmail = async (
    productName: string,
    audience: string,
    tone = 'professionnel',
    extraContext = '',
    model: string = 'anthropic/claude-3.5-sonnet'
): Promise<string> => {
    const messages: OpenRouterMessage[] = [
        {
            role: 'system',
            content: 'Tu es un expert copywriter pour le SaaS B2B. Tu rédiges des emails de prospection efficaces et personnalisés en français.'
        },
        {
            role: 'user',
            content: `Rédige un email de prospection à froid pour "${productName}".
Audience cible : ${audience}
Ton : ${tone}
${extraContext ? `Contexte : ${extraContext}` : ''}

Structure :
1. Objet accrocheur
2. Ouverture personnalisée
3. Proposition de valeur
4. Appel à l'action clair

Réponds UNIQUEMENT le contenu du message.`
        }
    ];

    return callOpenRouter(messages, model, 0.8);
};

/**
 * Analyzes a lead's quality.
 */
export const analyzeLeadQuality = async (
    leadData: { position: string; company: string; industry?: string },
    model: string = 'openai/gpt-4o-mini'
): Promise<{ score: number; reason: string }> => {
    try {
        const messages: OpenRouterMessage[] = [
            {
                role: 'system',
                content: 'Tu es un expert en qualification de prospects B2B. Tu réponds uniquement en JSON valide.'
            },
            {
                role: 'user',
                content: `Analyse ce prospect pour un logiciel B2B :
Poste : ${leadData.position}
Entreprise : ${leadData.company}
${leadData.industry ? `Industrie : ${leadData.industry}` : ''}

Retourne un JSON avec :
- "score" : nombre entre 0 et 100
- "reason" : courte phrase en français expliquant le score

Réponds uniquement le JSON.`
            }
        ];

        const response = await callOpenRouter(messages, model, 0.3);

        // Parse JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return { score: 50, reason: 'Analyse non conclusive' };
    } catch (error) {
        console.error('Erreur Analyse Prospect:', error);
        return { score: 0, reason: 'Analyse échouée' };
    }
};

/**
 * Generic AI completion for AI Studio
 */
export const generateCompletion = async (
    prompt: string,
    systemPrompt: string = '',
    model: string = 'anthropic/claude-3.5-sonnet',
    temperature: number = 0.7
): Promise<string> => {
    const messages: OpenRouterMessage[] = [];

    if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
    }

    messages.push({ role: 'user', content: prompt });

    return callOpenRouter(messages, model, temperature);
};

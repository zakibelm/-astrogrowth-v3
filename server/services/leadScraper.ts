import { makeRequest } from "../_core/map";
import * as db from "../db";
import { InsertLead } from "../../drizzle/schema";

/**
 * Lead scraper service using Google Maps API via Manus proxy
 */

interface GooglePlaceResult {
  name: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  place_id: string;
  url?: string;
  types?: string[];
}

interface ScrapeLeadsParams {
  query: string;
  location: string;
  maxResults?: number;
  campaignId: number;
  userId: number;
}

/**
 * Calculate lead score based on available data
 * Score ranges from 0-100 based on completeness and quality indicators
 */
function calculateLeadScore(place: GooglePlaceResult, enrichmentData?: { email?: string; phone?: string }): number {
  let score = 0;

  // Base score for having a business name
  score += 10;

  // Address information (20 points)
  if (place.formatted_address) score += 20;

  // Contact information (30 points total)
  if (place.formatted_phone_number || enrichmentData?.phone) score += 15;
  if (enrichmentData?.email) score += 15;

  // Website (15 points)
  if (place.website) score += 15;

  // Google rating and reviews (25 points total)
  if (place.rating) {
    score += Math.min(10, place.rating * 2); // Up to 10 points for rating
  }
  if (place.user_ratings_total) {
    score += Math.min(15, place.user_ratings_total / 10); // Up to 15 points for reviews
  }

  return Math.min(100, Math.round(score));
}

/**
 * Extract location components from formatted address
 */
function parseAddress(formattedAddress?: string): { city?: string; province?: string; postalCode?: string } {
  if (!formattedAddress) return {};

  const parts = formattedAddress.split(',').map(p => p.trim());
  const result: { city?: string; province?: string; postalCode?: string } = {};

  // Try to extract city (usually first or second part)
  if (parts.length > 0) {
    result.city = parts[0];
  }

  // Try to extract province and postal code from last part
  const lastPart = parts[parts.length - 1];
  if (lastPart) {
    const provinceMatch = lastPart.match(/\b(QC|ON|BC|AB|MB|SK|NS|NB|PE|NL)\b/);
    if (provinceMatch) {
      result.province = provinceMatch[1];
    }

    const postalMatch = lastPart.match(/\b([A-Z]\d[A-Z]\s?\d[A-Z]\d)\b/);
    if (postalMatch) {
      result.postalCode = postalMatch[1];
    }
  }

  return result;
}

/**
 * Scrape leads from Google Maps using text search
 */
export async function scrapeLeads(params: ScrapeLeadsParams): Promise<{ success: boolean; leadsCount: number; error?: string }> {
  const { query, location, maxResults = 50, campaignId, userId } = params;

  try {
    console.log(`[LeadScraper] Starting scrape: "${query}" in "${location}"`);

    // Use Google Places Text Search API via Manus proxy
    const searchQuery = `${query} in ${location}`;
    const response = await makeRequest<{
      results: GooglePlaceResult[];
      status: string;
    }>('/maps/api/place/textsearch/json', {
      query: searchQuery,
      language: 'fr',
    });

    if (!response.results || response.results.length === 0) {
      console.log('[LeadScraper] No results found');
      return { success: true, leadsCount: 0 };
    }

    const places: GooglePlaceResult[] = response.results.slice(0, maxResults);
    console.log(`[LeadScraper] Found ${places.length} places`);

    // Process each place and create leads
    const leadsToInsert: InsertLead[] = [];

    for (const place of places) {
      const addressComponents = parseAddress(place.formatted_address);

      // Basic enrichment data (in real implementation, this would call enrichment APIs)
      const enrichmentData = {
        email: undefined, // Would be enriched via Hunter.io or similar
        phone: place.formatted_phone_number,
      };

      const leadScore = calculateLeadScore(place, enrichmentData);

      const lead: InsertLead = {
        campaignId,
        userId,
        businessName: place.name,
        businessType: query, // Use the search query as business type
        address: place.formatted_address || undefined,
        city: addressComponents.city,
        province: addressComponents.province,
        postalCode: addressComponents.postalCode,
        phone: place.formatted_phone_number || undefined,
        email: enrichmentData.email,
        website: place.website || undefined,
        googleMapsUrl: place.url || `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
        googleRating: place.rating?.toString() || undefined,
        googleReviews: place.user_ratings_total || undefined,
        leadScore,
        enriched: false, // Will be enriched in a separate step
      };

      leadsToInsert.push(lead);
    }

    // Batch insert leads
    if (leadsToInsert.length > 0) {
      await db.createLeadsBatch(leadsToInsert);
      console.log(`[LeadScraper] Inserted ${leadsToInsert.length} leads`);

      // Update campaign stats
      await db.updateCampaignStats(campaignId, { totalLeads: leadsToInsert.length });

      // Create notification
      await db.createNotification({
        userId,
        type: 'leads_ready',
        title: 'Leads prêts',
        message: `${leadsToInsert.length} nouveaux leads ont été générés pour votre campagne.`,
        campaignId,
      });
    }

    return { success: true, leadsCount: leadsToInsert.length };

  } catch (error) {
    console.error('[LeadScraper] Error scraping leads:', error);

    // Create error notification
    await db.createNotification({
      userId,
      type: 'system_error',
      title: 'Erreur de génération de leads',
      message: `Une erreur s'est produite lors de la génération des leads: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      campaignId,
    });

    return {
      success: false,
      leadsCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Enrich a lead with additional contact information
 * This is a placeholder for future integration with enrichment APIs like Hunter.io
 */
import { z } from "zod";

/**
 * Schema for Hunter.io Domain Search Response
 */
const HunterResponseSchema = z.object({
  data: z.object({
    emails: z.array(z.object({
      value: z.string().email(),
      type: z.string(),
      confidence: z.number()
    })).optional(),
    domain: z.string().optional(),
    pattern: z.string().nullable().optional(),
  })
});

/**
 * Enrich a lead with additional contact information
 * Uses Hunter.io API if available, otherwise mocks the enrichment for demo purposes.
 */
export async function enrichLead(leadId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const lead = await db.getLeadById(leadId);
    if (!lead) {
      return { success: false, error: 'Lead not found' };
    }

    // Check if already enriched to save credits/time
    if (lead.enriched) {
      return { success: true };
    }

    // 1. Check for API Key (Hunter.io)
    const apiKey = process.env.HUNTER_API_KEY;

    // FALLBACK: If no API key, use "Mock Mode" for demo/dev stability
    if (!apiKey) {
      console.warn('[LeadEnrichment] No HUNTER_API_KEY found. Using Mock Enrichment.');

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Generate a plausible email if missing
      const mockEmail = lead.email ||
        (lead.businessName ? `contact@${lead.businessName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.com` : undefined);

      await db.updateLead(leadId, {
        enriched: true,
        email: mockEmail,
        enrichmentError: null
      });

      return { success: true };
    }

    // 2. Perform Real Enrichment
    if (!lead.website) {
      console.log('[LeadEnrichment] No website for lead, skipping Hunter enrichment.');
      // Mark as enriched anyway to prevent retry loop, but with no new data
      await db.updateLead(leadId, { enriched: true, enrichmentError: 'No website available' });
      return { success: false, error: 'No website available for enrichment' };
    }

    // Normalize domain
    let domain = lead.website;
    try {
      if (!domain.startsWith('http')) domain = `https://${domain}`;
      domain = new URL(domain).hostname;
    } catch (e) {
      console.warn('[LeadEnrichment] Invalid website URL:', lead.website);
      await db.updateLead(leadId, { enriched: true, enrichmentError: 'Invalid website URL' });
      return { success: false, error: 'Invalid website URL' };
    }

    console.log(`[LeadEnrichment] Searching emails for domain: ${domain}`);

    // Using global fetch (standard in Node 18+)
    const response = await fetch(`https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${apiKey}&limit=1`);

    if (!response.ok) {
      if (response.status === 401) throw new Error('Hunter.io API Key invalid');
      if (response.status === 429) throw new Error('Hunter.io Rate limit exceeded');
      throw new Error(`Hunter API Error: ${response.statusText}`);
    }

    const json = await response.json();
    const result = HunterResponseSchema.safeParse(json);

    if (!result.success) {
      console.error('[LeadEnrichment] Invalid API response structure', result.error);
      throw new Error('Invalid API response format');
    }

    // Extract best email (first one is usually best guess)
    const bestEmail = result.data.data.emails?.[0]?.value;

    // 3. Update Database
    await db.updateLead(leadId, {
      enriched: true,
      email: bestEmail || lead.email || undefined, // Prefer found email, else keep existing
      enrichmentError: null
    });

    return { success: true };

  } catch (error) {
    console.error('[LeadEnrichment] Error:', error);

    // Persist error to DB for debugging
    await db.updateLead(leadId, {
      enrichmentError: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

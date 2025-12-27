/**
 * RAG (Retrieval-Augmented Generation) + Vector Search
 *
 * Features:
 * - Document embedding with OpenAI embeddings
 * - FAISS vector store for similarity search
 * - Semantic search in marketing knowledge base
 * - Document chunking and preprocessing
 * - Context-aware agent responses
 *
 * Use Cases:
 * - Marketing best practices knowledge base
 * - Client document analysis (RFPs, contracts)
 * - Historical campaign data retrieval
 * - Agent memory and context persistence
 */

import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs/promises";
import * as path from "path";

// Initialize OpenAI embeddings
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY || '',
  model: "text-embedding-3-small", // Cheaper and faster
});

// Vector store instances (in-memory caches)
let marketingKnowledgeStore: FaissStore | null = null;
let userDocumentsStore: Map<number, FaissStore> = new Map();

/**
 * Marketing Knowledge Base
 * Pre-loaded best practices, templates, and guides
 */
export class MarketingKnowledgeBase {
  private static vectorStore: FaissStore | null = null;
  private static readonly STORE_PATH = "./data/vector-stores/marketing-kb";

  /**
   * Initialize knowledge base from documents
   */
  static async initialize(documents?: Document[]): Promise<void> {
    console.log("[RAG] Initializing Marketing Knowledge Base...");

    try {
      // Try loading existing vector store
      this.vectorStore = await FaissStore.load(
        this.STORE_PATH,
        embeddings
      );
      console.log("[RAG] ✅ Loaded existing knowledge base from disk");
    } catch (error) {
      console.log("[RAG] No existing knowledge base found, creating new one...");

      // Create from documents or default knowledge
      const docs = documents || await this.loadDefaultKnowledge();
      this.vectorStore = await FaissStore.fromDocuments(docs, embeddings);

      // Save to disk
      await this.vectorStore.save(this.STORE_PATH);
      console.log("[RAG] ✅ Created and saved new knowledge base");
    }
  }

  /**
   * Load default marketing knowledge
   */
  private static async loadDefaultKnowledge(): Promise<Document[]> {
    const knowledgeTexts = [
      // Lead Generation Best Practices
      `Lead Generation Best Practices:
      1. Multi-channel approach: Use email, social media, content marketing, and paid ads
      2. Lead scoring: Prioritize leads based on engagement and fit
      3. Personalization: Tailor messages to specific segments
      4. A/B testing: Continuously optimize landing pages and CTAs
      5. Follow-up timing: Contact leads within 5 minutes for 9x higher conversion
      6. Value proposition: Clearly communicate unique benefits
      7. Social proof: Use testimonials, case studies, and reviews`,

      // Content Marketing Strategy
      `Content Marketing Strategy:
      1. SEO optimization: Target high-intent keywords with search volume
      2. Content calendar: Plan 3-6 months ahead for consistency
      3. Pillar content: Create comprehensive guides for authority
      4. Content repurposing: Transform blog posts into videos, infographics, podcasts
      5. Guest posting: Build backlinks and reach new audiences
      6. Gated content: Offer valuable resources in exchange for contact info
      7. Analytics: Track engagement metrics and ROI`,

      // Social Media Marketing
      `Social Media Marketing Guidelines:
      1. Platform selection: Focus on where your audience spends time
      2. Posting frequency: LinkedIn (3-5x/week), Instagram (1-2x/day), Twitter (3-5x/day)
      3. Visual content: Images get 2.3x more engagement than text-only
      4. Engagement: Respond to comments within 1 hour
      5. Hashtags: Use 3-5 relevant hashtags per post
      6. User-generated content: Encourage and share customer content
      7. Influencer partnerships: Collaborate with industry thought leaders`,

      // Email Marketing Best Practices
      `Email Marketing Best Practices:
      1. Subject lines: Keep under 50 characters, use personalization
      2. Send timing: Tuesday-Thursday 10am-11am has highest open rates
      3. Segmentation: Create 5-10 segments based on behavior and demographics
      4. Mobile optimization: 60% of emails are opened on mobile
      5. CTAs: Use clear, action-oriented buttons above the fold
      6. Automation: Set up welcome series, abandoned cart, re-engagement flows
      7. Testing: A/B test subject lines, content, and send times`,

      // PPC Advertising Strategy
      `PPC Advertising Strategy:
      1. Quality Score: Optimize ad relevance, landing page experience, CTR
      2. Negative keywords: Exclude irrelevant searches to reduce waste
      3. Ad extensions: Use sitelinks, callouts, structured snippets
      4. Remarketing: Target previous visitors with tailored messages
      5. Conversion tracking: Set up proper attribution and tracking
      6. Bid strategy: Start with manual CPC, then test automated bidding
      7. Ad copy: Include keywords, benefits, and clear CTAs`,

      // Analytics and Measurement
      `Analytics and Measurement Framework:
      1. KPIs: Define metrics aligned with business goals (CAC, LTV, ROI)
      2. Attribution: Use multi-touch attribution for accurate reporting
      3. Dashboards: Create real-time dashboards for key stakeholders
      4. Cohort analysis: Track user behavior over time
      5. Funnel analysis: Identify drop-off points in conversion path
      6. Benchmarking: Compare against industry standards
      7. Regular reporting: Weekly tactical, monthly strategic reviews`,

      // Customer Retention Strategies
      `Customer Retention Strategies:
      1. Onboarding: Create structured onboarding process (30-60-90 days)
      2. Customer success: Proactive check-ins and support
      3. Loyalty programs: Reward repeat purchases and referrals
      4. Feedback loops: Regular surveys and feedback collection
      5. Community building: Create forums, groups, or events
      6. Personalized communication: Segment by usage and preferences
      7. Win-back campaigns: Re-engage churned customers`,
    ];

    // Create documents from knowledge texts
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });

    const documents: Document[] = [];
    for (const text of knowledgeTexts) {
      const chunks = await splitter.createDocuments([text]);
      documents.push(...chunks);
    }

    return documents;
  }

  /**
   * Search knowledge base
   */
  static async search(
    query: string,
    topK: number = 3
  ): Promise<Document[]> {
    if (!this.vectorStore) {
      await this.initialize();
    }

    console.log(`[RAG] Searching knowledge base for: "${query}"`);
    const results = await this.vectorStore!.similaritySearch(query, topK);
    console.log(`[RAG] Found ${results.length} relevant documents`);

    return results;
  }

  /**
   * Add new knowledge to base
   */
  static async addKnowledge(documents: Document[]): Promise<void> {
    if (!this.vectorStore) {
      await this.initialize();
    }

    await this.vectorStore!.addDocuments(documents);
    await this.vectorStore!.save(this.STORE_PATH);
    console.log(`[RAG] Added ${documents.length} new documents to knowledge base`);
  }
}

/**
 * User Document Store
 * Per-user document storage for client files, RFPs, etc.
 */
export class UserDocumentStore {
  /**
   * Add documents for a user
   */
  static async addDocuments(
    userId: number,
    documents: Document[]
  ): Promise<void> {
    console.log(`[RAG] Adding ${documents.length} documents for user ${userId}`);

    // Get or create user's vector store
    let userStore = userDocumentsStore.get(userId);

    if (!userStore) {
      userStore = await FaissStore.fromDocuments(documents, embeddings);
      userDocumentsStore.set(userId, userStore);
    } else {
      await userStore.addDocuments(documents);
    }

    // Save to disk
    const storePath = `./data/vector-stores/user-${userId}`;
    await userStore.save(storePath);
    console.log(`[RAG] ✅ Saved documents for user ${userId}`);
  }

  /**
   * Search user's documents
   */
  static async search(
    userId: number,
    query: string,
    topK: number = 3
  ): Promise<Document[]> {
    console.log(`[RAG] Searching user ${userId} documents for: "${query}"`);

    // Try loading from disk if not in memory
    let userStore = userDocumentsStore.get(userId);

    if (!userStore) {
      try {
        const storePath = `./data/vector-stores/user-${userId}`;
        userStore = await FaissStore.load(storePath, embeddings);
        userDocumentsStore.set(userId, userStore);
      } catch (error) {
        console.log(`[RAG] No documents found for user ${userId}`);
        return [];
      }
    }

    const results = await userStore.similaritySearch(query, topK);
    console.log(`[RAG] Found ${results.length} relevant documents`);

    return results;
  }

  /**
   * Process and add PDF document
   */
  static async addPdfDocument(
    userId: number,
    pdfPath: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    // TODO: Integrate PDF parsing library (pdf-parse or similar)
    console.log(`[RAG] Processing PDF for user ${userId}: ${pdfPath}`);

    // For now, placeholder
    throw new Error("PDF processing not yet implemented - add pdf-parse dependency");
  }
}

/**
 * RAG-Enhanced Agent Prompt Builder
 * Augments agent prompts with relevant context from knowledge base
 */
export async function buildRAGEnhancedPrompt(
  agentPrompt: string,
  query: string,
  userId?: number,
  includeUserDocs: boolean = false
): Promise<string> {
  // Search marketing knowledge base
  const knowledgeDocs = await MarketingKnowledgeBase.search(query, 2);

  // Optionally search user documents
  let userDocs: Document[] = [];
  if (includeUserDocs && userId) {
    userDocs = await UserDocumentStore.search(userId, query, 2);
  }

  // Build enhanced prompt
  let enhancedPrompt = agentPrompt;

  if (knowledgeDocs.length > 0) {
    enhancedPrompt += `\n\n# BEST PRACTICES ET CONNAISSANCES PERTINENTES\n`;
    knowledgeDocs.forEach((doc, i) => {
      enhancedPrompt += `\n## Référence ${i + 1}:\n${doc.pageContent}\n`;
    });
  }

  if (userDocs.length > 0) {
    enhancedPrompt += `\n\n# DOCUMENTS CLIENT PERTINENTS\n`;
    userDocs.forEach((doc, i) => {
      enhancedPrompt += `\n## Document ${i + 1}:\n${doc.pageContent}\n`;
    });
  }

  return enhancedPrompt;
}

// Initialize knowledge base on module load
MarketingKnowledgeBase.initialize().catch(console.error);

/**
 * Schéma de Base de Données pour Monitoring API et LLM Router
 * 
 * Tables:
 * - platform_connections: Connexions aux plateformes externes (Note: Check for conflict with schema.ts)
 * - api_usage: Logs d'utilisation des APIs
 * - llm_requests: Historique détaillé des requêtes LLM
 */

import { pgTable, serial, integer, varchar, text, decimal, timestamp, json, pgEnum } from "drizzle-orm/pg-core";

/**
 * Table: platform_connections
 * Stocke les connexions aux plateformes externes (OAuth, API keys)
 * (Renamed to platform_connections_monitoring to avoid conflict, or kept same if intended to merge)
 * We will keep it but acknowledge potential conflict.
 */
// Define enums
export const platformCategoryEnum = pgEnum("platform_category", ["social", "media", "scraping", "llm"]);
export const platformStatusEnum = pgEnum("platform_status", ["connected", "disconnected", "error"]);

export const platformConnectionsMonitoring = pgTable("platform_connections_monitoring", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),

  // Identification de la partie
  provider: varchar("provider", { length: 50 }).notNull(), // 'linkedin', 'openrouter', 'google-maps', etc.
  category: platformCategoryEnum("category").notNull(),

  // Credentials (encrypted)
  apiKey: text("api_key"), // Encrypted
  apiSecret: text("api_secret"), // Encrypted
  accessToken: text("access_token"), // OAuth token
  refreshToken: text("refresh_token"), // OAuth refresh

  // Configuration
  config: json("config"), // JSON pour paramètres spécifiques

  // Status
  status: platformStatusEnum("status").notNull().default("disconnected"),
  lastError: text("last_error"),

  // Timestamps
  connectedAt: timestamp("connected_at"),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * Table: api_usage
 * Logs d'utilisation des APIs pour tracking et facturation
 */
export const apiCategoryEnum = pgEnum("api_category", ["llm", "image", "scraping", "other"]);

export const apiUsage = pgTable("api_usage", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),

  // Identification
  provider: varchar("provider", { length: 50 }).notNull(), // 'openrouter', 'huggingface', 'ollama', etc.
  category: apiCategoryEnum("category").notNull(),

  // Métriques
  requestCount: integer("request_count").notNull().default(1),
  tokensUsed: integer("tokens_used").default(0),
  creditsUsed: decimal("credits_used", { precision: 10, scale: 4 }).default("0"),
  cost: decimal("cost", { precision: 10, scale: 4 }).default("0"), // En USD

  // Contexte
  campaignId: integer("campaign_id"),
  leadId: integer("lead_id"),
  contentId: integer("content_id"),

  // Timestamps
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  date: varchar("date", { length: 10 }).notNull(), // Format: YYYY-MM-DD pour agrégation
});

/**
 * Table: llm_requests
 * Historique détaillé des requêtes LLM pour debugging et analytics
 */
export const llmProviderEnum = pgEnum("llm_provider", ["openrouter", "huggingface", "ollama"]);
export const llmStatusEnum = pgEnum("llm_status", ["success", "error", "fallback"]);

export const llmRequests = pgTable("llm_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),

  // Request
  requestId: varchar("request_id", { length: 100 }).notNull().unique(),
  provider: llmProviderEnum("provider").notNull(),
  model: varchar("model", { length: 100 }).notNull(),

  // Content
  prompt: text("prompt").notNull(),
  response: text("response"),

  // Métriques
  promptTokens: integer("prompt_tokens").default(0),
  completionTokens: integer("completion_tokens").default(0),
  totalTokens: integer("total_tokens").default(0),
  cost: decimal("cost", { precision: 10, scale: 6 }).default("0"),
  duration: integer("duration").default(0), // En millisecondes

  // Status
  status: llmStatusEnum("status").notNull(),
  errorMessage: text("error_message"),
  fallbackTier: integer("fallback_tier"), // 1, 2, ou 3

  // Contexte
  campaignId: integer("campaign_id"),
  leadId: integer("lead_id"),
  contentId: integer("content_id"),

  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * Table: api_credits
 * Gestion des crédits et limites par utilisateur
 */
export const apiCredits = pgTable("api_credits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),

  // Crédits
  totalCredits: decimal("total_credits", { precision: 10, scale: 2 }).notNull().default("100.00"),
  usedCredits: decimal("used_credits", { precision: 10, scale: 2 }).notNull().default("0.00"),
  remainingCredits: decimal("remaining_credits", { precision: 10, scale: 2 }).notNull().default("100.00"),

  // Limites mensuelles
  monthlyLimit: decimal("monthly_limit", { precision: 10, scale: 2 }).default("50.00"),
  currentMonthUsage: decimal("current_month_usage", { precision: 10, scale: 2 }).default("0.00"),

  // Alertes
  lowCreditThreshold: decimal("low_credit_threshold", { precision: 10, scale: 2 }).default("10.00"),
  alertSent: timestamp("alert_sent"),

  // Timestamps
  lastResetAt: timestamp("last_reset_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

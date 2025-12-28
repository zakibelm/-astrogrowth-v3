CREATE TYPE "public"."content_status" AS ENUM('pending', 'approved', 'rejected', 'published');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('campaign_created', 'leads_ready', 'content_generated', 'post_published', 'system_error');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('draft', 'running', 'completed', 'error');--> statement-breakpoint
CREATE TYPE "public"."api_category" AS ENUM('llm', 'image', 'scraping', 'other');--> statement-breakpoint
CREATE TYPE "public"."llm_provider" AS ENUM('openrouter', 'huggingface', 'ollama');--> statement-breakpoint
CREATE TYPE "public"."llm_status" AS ENUM('success', 'error', 'fallback');--> statement-breakpoint
CREATE TYPE "public"."platform_category" AS ENUM('social', 'media', 'scraping', 'llm');--> statement-breakpoint
CREATE TYPE "public"."platform_status" AS ENUM('connected', 'disconnected', 'error');--> statement-breakpoint
CREATE TYPE "public"."agent_type" AS ENUM('lead_scraper', 'content_generator', 'publisher', 'analyzer');--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"targetIndustry" varchar(100) NOT NULL,
	"targetLocation" text NOT NULL,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"totalLeads" integer DEFAULT 0 NOT NULL,
	"totalContent" integer DEFAULT 0 NOT NULL,
	"totalPublished" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"completedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "contents" (
	"id" serial PRIMARY KEY NOT NULL,
	"leadId" integer NOT NULL,
	"campaignId" integer NOT NULL,
	"userId" integer NOT NULL,
	"textContent" text NOT NULL,
	"imageUrl" text,
	"imageS3Key" text,
	"hashtags" text,
	"qualityScore" integer NOT NULL,
	"status" "content_status" DEFAULT 'pending' NOT NULL,
	"approvedAt" timestamp,
	"rejectedAt" timestamp,
	"publishedAt" timestamp,
	"linkedinPostId" text,
	"linkedinPostUrl" text,
	"likes" integer DEFAULT 0,
	"comments" integer DEFAULT 0,
	"shares" integer DEFAULT 0,
	"impressions" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"campaignId" integer NOT NULL,
	"userId" integer NOT NULL,
	"businessName" varchar(255) NOT NULL,
	"businessType" varchar(100),
	"address" text,
	"city" varchar(100),
	"province" varchar(100),
	"postalCode" varchar(20),
	"phone" varchar(50),
	"email" varchar(320),
	"website" text,
	"googleMapsUrl" text,
	"googleRating" numeric(2, 1),
	"googleReviews" integer,
	"leadScore" integer NOT NULL,
	"enriched" boolean DEFAULT false NOT NULL,
	"enrichmentError" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"readAt" timestamp,
	"campaignId" integer,
	"leadId" integer,
	"contentId" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_connections" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"platform" varchar(50) NOT NULL,
	"apiKeyEncrypted" text,
	"config" json,
	"isValid" boolean DEFAULT false NOT NULL,
	"lastCheckedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rateLimits" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"postsToday" integer DEFAULT 0 NOT NULL,
	"lastPostAt" timestamp,
	"lastResetAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rateLimits_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"businessName" text,
	"businessType" varchar(100),
	"businessLocation" text,
	"businessPhone" varchar(50),
	"businessWebsite" text,
	"linkedinAccessToken" text,
	"linkedinRefreshToken" text,
	"linkedinTokenExpiry" timestamp,
	"linkedinConnected" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
CREATE TABLE "api_credits" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"total_credits" numeric(10, 2) DEFAULT '100.00' NOT NULL,
	"used_credits" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"remaining_credits" numeric(10, 2) DEFAULT '100.00' NOT NULL,
	"monthly_limit" numeric(10, 2) DEFAULT '50.00',
	"current_month_usage" numeric(10, 2) DEFAULT '0.00',
	"low_credit_threshold" numeric(10, 2) DEFAULT '10.00',
	"alert_sent" timestamp,
	"last_reset_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "api_credits_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "api_usage" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"provider" varchar(50) NOT NULL,
	"category" "api_category" NOT NULL,
	"request_count" integer DEFAULT 1 NOT NULL,
	"tokens_used" integer DEFAULT 0,
	"credits_used" numeric(10, 4) DEFAULT '0',
	"cost" numeric(10, 4) DEFAULT '0',
	"campaign_id" integer,
	"lead_id" integer,
	"content_id" integer,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"date" varchar(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "llm_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"request_id" varchar(100) NOT NULL,
	"provider" "llm_provider" NOT NULL,
	"model" varchar(100) NOT NULL,
	"prompt" text NOT NULL,
	"response" text,
	"prompt_tokens" integer DEFAULT 0,
	"completion_tokens" integer DEFAULT 0,
	"total_tokens" integer DEFAULT 0,
	"cost" numeric(10, 6) DEFAULT '0',
	"duration" integer DEFAULT 0,
	"status" "llm_status" NOT NULL,
	"error_message" text,
	"fallback_tier" integer,
	"campaign_id" integer,
	"lead_id" integer,
	"content_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "llm_requests_request_id_unique" UNIQUE("request_id")
);
--> statement-breakpoint
CREATE TABLE "platform_connections_monitoring" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"provider" varchar(50) NOT NULL,
	"category" "platform_category" NOT NULL,
	"api_key" text,
	"api_secret" text,
	"access_token" text,
	"refresh_token" text,
	"config" json,
	"status" "platform_status" DEFAULT 'disconnected' NOT NULL,
	"last_error" text,
	"connected_at" timestamp,
	"last_used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"agentId" integer NOT NULL,
	"fileName" varchar(255) NOT NULL,
	"fileUrl" text NOT NULL,
	"fileKey" text NOT NULL,
	"fileSize" integer NOT NULL,
	"mimeType" varchar(100) NOT NULL,
	"processed" boolean DEFAULT false NOT NULL,
	"vectorized" boolean DEFAULT false NOT NULL,
	"uploadedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agents" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "agent_type" NOT NULL,
	"description" text,
	"model" varchar(100) DEFAULT 'gemini-2.0-flash' NOT NULL,
	"systemPrompt" text NOT NULL,
	"temperature" integer DEFAULT 70,
	"maxTokens" integer DEFAULT 2000,
	"enabled" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_agents" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"agentId" varchar(100) NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"llmModel" varchar(50) DEFAULT 'gemini-2.0-flash' NOT NULL,
	"systemPrompt" text,
	"ragDocuments" json,
	"config" json,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_workflows" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"workflowId" integer NOT NULL,
	"workflowConfig" json,
	"active" boolean DEFAULT true NOT NULL,
	"activatedAt" timestamp DEFAULT now() NOT NULL,
	"deactivatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "workflows" (
	"id" serial PRIMARY KEY NOT NULL,
	"workflowId" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"icon" varchar(10) NOT NULL,
	"targetSector" varchar(100) NOT NULL,
	"agentIds" json NOT NULL,
	"estimatedTimeSaved" varchar(50),
	"estimatedROI" varchar(50),
	"monthlyPrice" integer,
	"isActive" boolean DEFAULT true NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workflows_workflowId_unique" UNIQUE("workflowId")
);

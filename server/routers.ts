import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import * as dbAgents from "./db-agents";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),

    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().optional(),
        name: z.string().optional(),
        googleIdToken: z.string().optional(), // For Google Auth
      }))
      .mutation(async ({ input, ctx }) => {
        const { sdk } = await import("./_core/sdk");

        let openId = "";
        let name = input.name;
        let isAdmin = false;

        // 1. ADMIN LOGIN FLOW
        if (input.email === "zakibelm66@gmail.com" && input.password === "belz1204") {
          console.log("[Auth] Admin Login detected");
          openId = "admin-zakibelm66";
          name = "Super Admin";
          isAdmin = true;

          // Upsert Admin User with role 'admin'
          await db.upsertUser({
            openId,
            email: input.email,
            name,
            loginMethod: 'admin_password',
            role: 'admin', // Enforce admin role
            lastSignedIn: new Date(),
          });
        }
        // 2. GOOGLE LOGIN FLOW
        else if (input.googleIdToken) {
          // Verify Google Token (Mock for now, or use library)
          // In production, use: await verifyGoogleToken(input.googleIdToken)
          console.log("[Auth] Google Login detected");
          const googleProfile = await sdk.verifyGoogleToken(input.googleIdToken).catch(() => null);

          if (!googleProfile) {
            // Fallback for dev/mock if verification fails or not configured
            openId = `google-${input.email.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
          } else {
            openId = googleProfile.sub;
            name = googleProfile.name;
          }

          await db.upsertUser({
            openId,
            email: input.email,
            name: name || input.email.split('@')[0],
            loginMethod: 'google',
            lastSignedIn: new Date(),
          });
        }
        // 3. DEV/MAGIC LOGIN FLOW (Fallback)
        else {
          openId = `dev-${input.email.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
          await db.upsertUser({
            openId,
            email: input.email,
            name: input.name || input.email.split('@')[0],
            loginMethod: 'email_dev',
            lastSignedIn: new Date(),
          });
        }

        // 4. Create Session
        const sessionToken = await sdk.createSessionToken(openId, {
          name: name || input.email,
          expiresInMs: 30 * 24 * 60 * 60 * 1000,
        });

        // 5. Set Cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, cookieOptions);

        return { success: true, isAdmin };
      }),
  }),

  // User profile management
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserById(ctx.user.id);
    }),

    update: protectedProcedure
      .input(z.object({
        businessName: z.string().optional(),
        businessType: z.string().optional(),
        businessLocation: z.string().optional(),
        businessPhone: z.string().optional(),
        businessWebsite: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),
  }),

  // Campaign management
  campaigns: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getCampaignsByUserId(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCampaignById(input.id);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        targetIndustry: z.string().min(1),
        targetLocation: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        console.log("[API] campaigns.create called with input:", input);
        try {
          const campaignId = await db.createCampaign({
            userId: ctx.user.id,
            ...input,
            status: 'draft',
          });
          console.log("[API] Campaign created with ID:", campaignId);

          // Create notification
          await db.createNotification({
            userId: ctx.user.id,
            type: 'campaign_created',
            title: 'Nouvelle campagne créée',
            message: `La campagne "${input.name}" a été créée avec succès.`,
            campaignId,
          });
          console.log("[API] Notification created for campaign:", campaignId);

          return { id: campaignId };
        } catch (error) {
          console.error("[API] Error in campaigns.create:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create campaign",
            cause: error,
          });
        }
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['draft', 'running', 'completed', 'error']),
      }))
      .mutation(async ({ input }) => {
        await db.updateCampaign(input.id, { status: input.status });
        return { success: true };
      }),
  }),

  // Lead management
  leads: router({
    listByCampaign: protectedProcedure
      .input(z.object({ campaignId: z.number() }))
      .query(async ({ input }) => {
        return await db.getLeadsByCampaignId(input.campaignId);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getLeadById(input.id);
      }),
  }),

  // Content management
  contents: router({
    listByCampaign: protectedProcedure
      .input(z.object({ campaignId: z.number() }))
      .query(async ({ input }) => {
        return await db.getContentsByCampaignId(input.campaignId);
      }),

    listByUser: protectedProcedure
      .input(z.object({ status: z.string().optional() }))
      .query(async ({ ctx, input }) => {
        return await db.getContentsByUserId(ctx.user.id, input.status);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getContentById(input.id);
      }),

    approve: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.approveContent(input.id);
        return { success: true };
      }),

    reject: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.rejectContent(input.id);
        return { success: true };
      }),
  }),

  // Notifications
  notifications: router({
    list: protectedProcedure
      .input(z.object({ unreadOnly: z.boolean().optional() }))
      .query(async ({ ctx, input }) => {
        return await db.getNotificationsByUserId(ctx.user.id, input.unreadOnly);
      }),

    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.markNotificationAsRead(input.id);
        return { success: true };
      }),
  }),

  // Dashboard metrics
  dashboard: router({
    metrics: protectedProcedure.query(async ({ ctx }) => {
      return await db.getDashboardMetrics(ctx.user.id);
    }),
  }),

  // Lead scraping and generation
  scraper: router({
    scrapeLeads: protectedProcedure
      .input(z.object({
        campaignId: z.number(),
        query: z.string(),
        location: z.string(),
        maxResults: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { scrapeLeads } = await import('./services/leadScraper');
        return await scrapeLeads({
          ...input,
          userId: ctx.user.id,
        });
      }),
  }),

  // Content generation
  generator: router({
    generateForLead: protectedProcedure
      .input(z.object({
        leadId: z.number(),
        campaignId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const lead = await db.getLeadById(input.leadId);
        if (!lead) {
          throw new Error('Lead not found');
        }
        const { generateContent } = await import('./services/contentGenerator');
        return await generateContent({
          lead,
          campaignId: input.campaignId,
          userId: ctx.user.id,
        });
      }),

    generateForCampaign: protectedProcedure
      .input(z.object({
        campaignId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { generateContentForCampaign } = await import('./services/contentGenerator');
        return await generateContentForCampaign(input.campaignId, ctx.user.id);
      }),
  }),

  // Platform connections management
  platformConnections: router({
    saveApiKey: protectedProcedure
      .input(z.object({
        platform: z.string(),
        apiKey: z.string(),
        config: z.record(z.string(), z.any()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { encrypt } = await import('./utils/encryption');
        const encryptedKey = encrypt(input.apiKey);

        await db.savePlatformConnection(
          ctx.user.id,
          input.platform,
          encryptedKey,
          input.config
        );

        return { success: true };
      }),

    getStatus: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      if (!user) throw new Error('User not found');

      const openrouter = await db.getPlatformConnection(ctx.user.id, 'openrouter');
      const googlemaps = await db.getPlatformConnection(ctx.user.id, 'googlemaps');
      const imagen = await db.getPlatformConnection(ctx.user.id, 'imagen3');
      const linkedin = await db.getPlatformConnection(ctx.user.id, 'linkedin'); // Can also check user.linkedinConnected

      return {
        linkedin: {
          connected: user.linkedinConnected || (linkedin?.isValid ?? false),
          status: user.linkedinConnected ? 'connected' : 'disconnected',
        },
        openrouter: {
          connected: openrouter?.isValid ?? false,
          status: openrouter?.isValid ? 'connected' : 'disconnected',
          usage: '1.2M tokens ce mois', // TODO: Implement real usage tracking
          credits: '$42.30 restants',
        },
        huggingface: {
          connected: true,
          status: 'connected',
          usage: '500K tokens ce mois',
          credits: 'Gratuit',
        },
        ollama: {
          connected: true,
          status: 'connected',
          usage: 'Local',
          credits: 'Gratuit',
        },
        imagen: {
          connected: imagen?.isValid ?? false,
          status: imagen?.isValid ? 'connected' : 'disconnected',
          usage: '45/1000 images',
          credits: '$15.80 restants',
        },
        googlemaps: {
          connected: googlemaps?.isValid ?? false,
          status: googlemaps?.isValid ? 'connected' : 'disconnected',
          usage: '1,250 requêtes',
          credits: '$8.50 restants',
        },
      };
    }),

    disconnect: protectedProcedure
      .input(z.object({ platform: z.string() }))
      .mutation(async ({ ctx, input }) => {
        // TODO: Implement disconnect logic (delete or clear key)
        return { success: true, message: `Déconnecté de ${input.platform}` };
      }),
  }),

  // AI Agents management
  agents: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await dbAgents.getUserAgents(ctx.user.id);
    }),

    toggle: protectedProcedure
      .input(z.object({
        agentId: z.string(),
        enabled: z.boolean(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await dbAgents.toggleUserAgent(ctx.user.id, input.agentId, input.enabled);
      }),

    updateConfig: protectedProcedure
      .input(z.object({
        agentId: z.string(),
        llmModel: z.string().optional(),
        systemPrompt: z.string().optional(),
        ragDocuments: z.array(z.string()).optional(),
        config: z.record(z.string(), z.any()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { agentId, ...config } = input;
        return await dbAgents.updateUserAgentConfig(ctx.user.id, agentId, config);
      }),
  }),

  // Workflows management
  workflows: router({
    list: publicProcedure.query(async () => {
      return await dbAgents.getAllWorkflows();
    }),

    activate: protectedProcedure
      .input(z.object({
        workflowId: z.number(),
        config: z.object({
          businessInfo: z.object({
            businessName: z.string(),
            address: z.string(),
            city: z.string(),
            province: z.string(),
            postalCode: z.string(),
            phone: z.string(),
            website: z.string(),
            sector: z.string(),
            description: z.string(),
          }).optional(),
          marketingGoals: z.object({
            primaryGoal: z.string(),
            leadsPerMonth: z.string(),
            budget: z.string(),
            targetAudience: z.string(),
            uniqueSellingPoint: z.string(),
          }).optional(),
          agentPreferences: z.object({
            contentTone: z.string(),
            postingFrequency: z.string(),
            responseTime: z.string(),
            customInstructions: z.string(),
          }).optional(),
        }).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await dbAgents.activateWorkflow(ctx.user.id, input.workflowId, input.config);
      }),

    deactivate: protectedProcedure
      .input(z.object({
        workflowId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await dbAgents.deactivateWorkflow(ctx.user.id, input.workflowId);
      }),

    getUserWorkflows: protectedProcedure.query(async ({ ctx }) => {
      return await dbAgents.getUserWorkflows(ctx.user.id);
    }),
  }),

  // LinkedIn publishing
  linkedin: router({
    publish: protectedProcedure
      .input(z.object({
        contentId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { publishToLinkedIn } = await import('./services/linkedinPublisher');
        return await publishToLinkedIn(input.contentId, ctx.user.id);
      }),

    batchPublish: protectedProcedure
      .input(z.object({
        contentIds: z.array(z.number()),
      }))
      .mutation(async ({ ctx, input }) => {
        const { batchPublish } = await import('./services/linkedinPublisher');
        return await batchPublish(input.contentIds, ctx.user.id);
      }),
  }),

  // Custom Workflows
  customWorkflows: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string(),
        mission: z.string(),
        agents: z.array(z.object({
          id: z.string(),
          position: z.number(),
        })),
        totalPrice: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createCustomWorkflow } = await import("./db-agents");
        const result = await createCustomWorkflow(
          ctx.user.id,
          input.name,
          input.description,
          input.mission,
          input.agents,
          input.totalPrice
        );
        return { success: true, id: result.id };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      const { listCustomWorkflows } = await import("./db-agents");
      return await listCustomWorkflows(ctx.user.id);
    }),
  }),

  // Custom Agents
  customAgents: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        emoji: z.string(),
        role: z.string(),
        description: z.string(),
        mission: z.string(),
        systemPrompt: z.string(),
        model: z.string(),
        tools: z.array(z.string()),
        department: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // For now, return mock success - will implement proper DB insert later
        return { success: true, id: Date.now() };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      // For now, return empty array - will implement proper DB query later
      return [];
    }),
  }),
});

export type AppRouter = typeof appRouter;

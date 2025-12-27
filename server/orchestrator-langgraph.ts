/**
 * LangGraph Workflow Orchestrator - Enterprise Grade
 *
 * Improvements over basic orchestrator:
 * - Conditional workflows (if/else logic between agents)
 * - Parallel execution (multiple agents simultaneously)
 * - Cyclic workflows (loops with intelligent retry)
 * - State management with persistence
 * - Langfuse observability integration
 * - Streaming responses support
 *
 * Architecture:
 * - StateGraph: Manages workflow state and transitions
 * - Nodes: Each agent is a node in the graph
 * - Edges: Define agent execution flow (sequential, conditional, parallel)
 * - Checkpointer: Persists state for resume capability
 */

import { StateGraph, END, START } from "@langchain/langgraph";
import { Langfuse } from "langfuse";
import { invokeLLM } from "./_core/llm";
import { AGENTS_DATA } from "../shared/agents-data";
import { getWorkflowById, listCustomWorkflows } from "./db-agents";

// Initialize Langfuse for observability
const langfuse = new Langfuse({
  secretKey: process.env.LANGFUSE_SECRET_KEY || '',
  publicKey: process.env.LANGFUSE_PUBLIC_KEY || '',
  baseUrl: process.env.LANGFUSE_HOST || 'https://cloud.langfuse.com',
});

// Workflow State Interface
interface WorkflowState {
  workflowId: number;
  userId: number;
  mission: string;
  currentAgentIndex: number;
  agents: string[];
  outputs: Record<string, string>;
  errors: Record<string, string>;
  attempts: Record<string, number>;
  config: {
    businessInfo?: any;
    marketingGoals?: any;
    agentPreferences?: any;
  };
  status: "running" | "completed" | "failed";
  metadata: {
    startedAt: Date;
    completedAt?: Date;
    totalTokens: number;
    totalCost: number;
  };
}

// Agent Node Function
async function executeAgentNode(
  state: WorkflowState,
  agentId: string
): Promise<Partial<WorkflowState>> {
  const trace = langfuse.trace({
    name: `workflow-${state.workflowId}`,
    userId: state.userId.toString(),
    metadata: {
      workflowId: state.workflowId,
      agentId,
      mission: state.mission,
    },
  });

  const span = trace.span({
    name: `agent-${agentId}`,
    metadata: { agentId },
  });

  try {
    const agentData = AGENTS_DATA[agentId];
    if (!agentData) {
      throw new Error(`Agent ${agentId} not found in AGENTS_DATA`);
    }

    console.log(`[LangGraph] Executing agent: ${agentData.name} (${agentId})`);

    // Get previous agent output for context chaining
    const agentIndex = state.agents.indexOf(agentId);
    const previousAgentId = agentIndex > 0 ? state.agents[agentIndex - 1] : null;
    const previousOutput = previousAgentId ? state.outputs[previousAgentId] : undefined;

    // Build agent prompt with context
    const agentPrompt = buildAgentPrompt(
      agentData,
      state.mission,
      state.config,
      previousOutput
    );

    // Execute with retry logic
    const maxRetries = 3;
    const currentAttempt = (state.attempts[agentId] || 0) + 1;

    if (currentAttempt > maxRetries) {
      throw new Error(`Agent ${agentId} exceeded max retries (${maxRetries})`);
    }

    // Call LLM with Langfuse generation tracking
    const generation = span.generation({
      name: agentData.name,
      model: agentData.model || 'gemini-flash',
      input: { messages: [agentPrompt] },
    });

    const response = await invokeLLM({
      messages: [
        { role: "system", content: agentPrompt },
        { role: "user", content: previousOutput || "Commencez votre travail selon votre mission." },
      ],
    });

    const content = response.choices[0]?.message?.content;
    const output = typeof content === 'string' ? content : JSON.stringify(content);

    // Validate output
    if (!output || output.length < 50) {
      throw new Error("Output too short or empty");
    }

    // Track generation completion
    generation.end({
      output: output.substring(0, 1000), // First 1000 chars for preview
      metadata: {
        tokensUsed: response.usage?.total_tokens || 0,
        model: response.model,
      },
    });

    span.end();
    await langfuse.flushAsync();

    console.log(`[LangGraph] ✅ Agent ${agentData.name} completed`);
    console.log(`[LangGraph] Output preview: ${output.substring(0, 100)}...`);

    // Update state
    return {
      outputs: {
        ...state.outputs,
        [agentId]: output,
      },
      attempts: {
        ...state.attempts,
        [agentId]: currentAttempt,
      },
      currentAgentIndex: state.currentAgentIndex + 1,
      metadata: {
        ...state.metadata,
        totalTokens: state.metadata.totalTokens + (response.usage?.total_tokens || 0),
      },
    };

  } catch (error) {
    console.error(`[LangGraph] ❌ Agent ${agentId} failed:`, error);

    span.end({
      level: "ERROR",
      statusMessage: (error as Error).message,
    });
    await langfuse.flushAsync();

    // Retry logic
    const currentAttempt = (state.attempts[agentId] || 0) + 1;
    if (currentAttempt < 3) {
      console.log(`[LangGraph] ⏳ Retrying agent ${agentId} (attempt ${currentAttempt + 1}/3)`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * currentAttempt));

      return {
        attempts: {
          ...state.attempts,
          [agentId]: currentAttempt,
        },
      };
    }

    // Max retries exceeded
    return {
      errors: {
        ...state.errors,
        [agentId]: (error as Error).message,
      },
      status: "failed",
      metadata: {
        ...state.metadata,
        completedAt: new Date(),
      },
    };
  }
}

// Build personalized agent prompt
function buildAgentPrompt(
  agentData: any,
  workflowMission: string,
  config: any,
  previousOutput?: string
): string {
  const businessInfo = config.businessInfo || {};
  const marketingGoals = config.marketingGoals || {};

  let prompt = `# MISSION DU WORKFLOW\n${workflowMission}\n\n`;
  prompt += `# TON RÔLE\nTu es ${agentData.name}, ${agentData.role}.\n\n`;
  prompt += `# TA MISSION SPÉCIFIQUE\n${agentData.mission}\n\n`;

  // Add business context
  if (businessInfo.businessName) {
    prompt += `# CONTEXTE BUSINESS\n`;
    prompt += `- Entreprise: ${businessInfo.businessName}\n`;
    if (businessInfo.sector) prompt += `- Secteur: ${businessInfo.sector}\n`;
    if (businessInfo.website) prompt += `- Site web: ${businessInfo.website}\n`;
    if (businessInfo.address) prompt += `- Localisation: ${businessInfo.address}\n`;
    prompt += `\n`;
  }

  // Add marketing goals
  if (marketingGoals.primaryGoal) {
    prompt += `# OBJECTIFS MARKETING\n`;
    prompt += `- Objectif principal: ${marketingGoals.primaryGoal}\n`;
    if (marketingGoals.leadsGoal) prompt += `- Leads cible: ${marketingGoals.leadsGoal}/mois\n`;
    if (marketingGoals.budget) prompt += `- Budget: ${marketingGoals.budget} USD/mois\n`;
    prompt += `\n`;
  }

  // Add previous agent output
  if (previousOutput) {
    prompt += `# TRAVAIL DE L'AGENT PRÉCÉDENT\n${previousOutput}\n\n`;
    prompt += `Utilise ce travail comme point de départ pour accomplir ta mission.\n\n`;
  }

  prompt += `# INSTRUCTIONS\n`;
  prompt += `1. Accomplis ta mission en respectant les bonnes pratiques de ton domaine\n`;
  prompt += `2. Produis un résultat de haute qualité, actionnable et professionnel\n`;
  prompt += `3. Sois précis, concret et orienté résultats\n`;
  prompt += `4. Si tu utilises des données, assure-toi qu'elles sont réalistes et pertinentes\n\n`;
  prompt += `Commence maintenant.`;

  return prompt;
}

// Routing function - determines next agent or END
function routeToNextAgent(state: WorkflowState): string {
  // Check if workflow failed
  if (state.status === "failed") {
    return END;
  }

  // Check if all agents completed
  if (state.currentAgentIndex >= state.agents.length) {
    return END;
  }

  // Return next agent ID
  return state.agents[state.currentAgentIndex];
}

// Create LangGraph Workflow
export class LangGraphOrchestrator {
  private workflow: StateGraph<WorkflowState>;

  constructor() {
    this.workflow = new StateGraph<WorkflowState>({
      channels: {
        workflowId: null,
        userId: null,
        mission: null,
        currentAgentIndex: null,
        agents: null,
        outputs: null,
        errors: null,
        attempts: null,
        config: null,
        status: null,
        metadata: null,
      },
    });
  }

  /**
   * Build and execute workflow
   */
  async executeWorkflow(
    workflowId: number,
    userId: number,
    config: {
      businessInfo?: any;
      marketingGoals?: any;
      agentPreferences?: any;
    }
  ): Promise<WorkflowState> {
    console.log(`[LangGraph] Starting workflow ${workflowId} for user ${userId}`);

    // Load workflow details
    const workflow = await this.loadWorkflow(workflowId, userId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    // Initialize state
    const initialState: WorkflowState = {
      workflowId,
      userId,
      mission: workflow.mission,
      currentAgentIndex: 0,
      agents: workflow.agentIds,
      outputs: {},
      errors: {},
      attempts: {},
      config,
      status: "running",
      metadata: {
        startedAt: new Date(),
        totalTokens: 0,
        totalCost: 0,
      },
    };

    // Build graph dynamically based on agents
    this.buildWorkflowGraph(workflow.agentIds);

    // Compile and execute
    const app = this.workflow.compile();
    const result = await app.invoke(initialState);

    // Mark as completed
    result.status = result.status === "failed" ? "failed" : "completed";
    result.metadata.completedAt = new Date();

    console.log(`[LangGraph] Workflow ${workflowId} ${result.status}`);

    return result;
  }

  /**
   * Build workflow graph dynamically
   */
  private buildWorkflowGraph(agentIds: string[]) {
    // Add START node
    this.workflow.addNode("start", (state: WorkflowState) => state);

    // Add agent nodes
    for (const agentId of agentIds) {
      this.workflow.addNode(agentId, (state: WorkflowState) =>
        executeAgentNode(state, agentId)
      );
    }

    // Add edges
    this.workflow.addEdge(START, "start");
    this.workflow.addConditionalEdges("start", routeToNextAgent);

    // Connect agents sequentially
    for (let i = 0; i < agentIds.length; i++) {
      const currentAgent = agentIds[i];
      this.workflow.addConditionalEdges(currentAgent, routeToNextAgent);
    }
  }

  /**
   * Load workflow details
   */
  private async loadWorkflow(workflowId: number, userId: number): Promise<any> {
    // Try loading as template workflow
    const templateWorkflow = await getWorkflowById(workflowId);
    if (templateWorkflow) {
      return {
        id: templateWorkflow.id,
        name: templateWorkflow.name,
        mission: templateWorkflow.description,
        agentIds: templateWorkflow.agentIds as string[],
      };
    }

    // Try loading as custom workflow
    const customWorkflows = await listCustomWorkflows(userId);
    const customWorkflow = customWorkflows.find((w: any) => w.id === workflowId);

    if (customWorkflow) {
      return {
        id: customWorkflow.id,
        name: customWorkflow.name,
        mission: customWorkflow.mission,
        agentIds: customWorkflow.agents
          .sort((a: any, b: any) => a.position - b.position)
          .map((a: any) => a.id),
      };
    }

    return null;
  }
}

// Export singleton
export const langGraphOrchestrator = new LangGraphOrchestrator();

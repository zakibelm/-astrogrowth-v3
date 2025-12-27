import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

export interface AgentRAGFile {
    id: string;
    name: string;
    type: 'pdf' | 'png' | 'csv' | 'json';
    size: number;
    uploadedAt: string;
    content?: string;
}

export interface AIAgent {
    id: string;
    name: string;
    role: string;
    description: string;
    model: string;
    systemPrompt: string;
    status: 'active' | 'inactive' | 'offline' | 'working' | 'idle' | 'paused';
    currentTask: string;
    performance: number;
    capabilities: string[];
    ragFiles: AgentRAGFile[];
    createdAt: string;
    updatedAt: string;
}

interface AgentState {
    agents: AIAgent[];
    selectedAgentId: string | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchAgents: () => Promise<void>;
    addAgent: (agent: Omit<AIAgent, 'id' | 'createdAt' | 'updatedAt' | 'ragFiles'>) => Promise<void>;
    updateAgent: (id: string, updates: Partial<AIAgent>) => Promise<void>;
    deleteAgent: (id: string) => Promise<void>;
    selectAgent: (id: string | null) => void;
    updateModel: (id: string, model: string) => Promise<void>;
    updateSystemPrompt: (id: string, prompt: string) => Promise<void>;
    addRAGFile: (agentId: string, file: Omit<AgentRAGFile, 'id' | 'uploadedAt'>) => Promise<void>;
    removeRAGFile: (agentId: string, fileId: string) => Promise<void>;
    getAgentById: (id: string) => AIAgent | undefined;
}

export const useAgentStore = create<AgentState>((set, get) => ({
    agents: [],
    selectedAgentId: null,
    isLoading: false,
    error: null,

    fetchAgents: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('agents')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;

            // Map DB response to UI model
            const mappedAgents = data.map((a: any) => ({
                id: a.id,
                name: a.name,
                role: a.role,
                description: a.description,
                model: a.model,
                systemPrompt: a.system_prompt, // DB column snake_case
                status: a.status,
                currentTask: a.current_task || 'En attente...',
                performance: a.performance,
                capabilities: a.capabilities || [],
                createdAt: a.created_at,
                updatedAt: a.updated_at,
                ragFiles: [] // Empty for now until FK is fixed
            }));

            set({ agents: mappedAgents });
        } catch (err: any) {
            console.error('Error fetching agents:', err);
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addAgent: async (agentData) => {
        try {
            const { data, error } = await supabase
                .from('agents')
                .insert({
                    name: agentData.name,
                    role: agentData.role,
                    description: agentData.description,
                    model: agentData.model,
                    system_prompt: agentData.systemPrompt,
                    status: agentData.status,
                    performance: agentData.performance,
                    capabilities: agentData.capabilities
                })
                .select()
                .single();

            if (error) throw error;

            // Refetch to be safe or append optimistically
            get().fetchAgents();
        } catch (err: any) {
            console.error('Error adding agent:', err);
        }
    },

    updateAgent: async (id, updates) => {
        // Optimistic update
        const originalAgents = get().agents;
        set({
            agents: originalAgents.map(a =>
                a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
            )
        });

        try {
            // Map keys back to snake_case if needed
            const dbUpdates: any = {};
            if (updates.name) dbUpdates.name = updates.name;
            if (updates.role) dbUpdates.role = updates.role;
            if (updates.status) dbUpdates.status = updates.status;
            if (updates.model) dbUpdates.model = updates.model;
            if (updates.systemPrompt) dbUpdates.system_prompt = updates.systemPrompt;
            if (updates.performance) dbUpdates.performance = updates.performance;

            const { error } = await supabase
                .from('agents')
                .update({ ...dbUpdates, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) throw error;
        } catch (err) {
            console.error('Error updating agent:', err);
            set({ agents: originalAgents }); // Revert
        }
    },

    deleteAgent: async (id) => {
        const originalAgents = get().agents;
        set({ agents: originalAgents.filter(a => a.id !== id) });

        try {
            const { error } = await supabase.from('agents').delete().eq('id', id);
            if (error) throw error;
        } catch (err) {
            set({ agents: originalAgents });
        }
    },

    selectAgent: (id) => set({ selectedAgentId: id }),

    updateModel: async (id, model) => {
        get().updateAgent(id, { model });
    },

    updateSystemPrompt: async (id, prompt) => {
        get().updateAgent(id, { systemPrompt: prompt });
    },

    addRAGFile: async (agentId, fileData) => {
        try {
            const { error } = await supabase
                .from('agent_rag_files')
                .insert({
                    agent_id: agentId, // Ensure DB has foreign key defined in migration
                    name: fileData.name,
                    type: fileData.type,
                    size: fileData.size,
                    content: fileData.content,
                });

            if (error) throw error;
            get().fetchAgents(); // Refresh to retrieve ID
        } catch (err) {
            console.error('Error adding file:', err);
        }
    },

    removeRAGFile: async (agentId, fileId) => {
        try {
            const { error } = await supabase
                .from('agent_rag_files')
                .delete()
                .eq('id', fileId);

            if (error) throw error;

            // Optimistic update local state
            set((state) => ({
                agents: state.agents.map((agent) =>
                    agent.id === agentId
                        ? {
                            ...agent,
                            ragFiles: agent.ragFiles.filter((f) => f.id !== fileId),
                        }
                        : agent
                ),
            }));
        } catch (err) {
            console.error('Error removing file:', err);
        }
    },

    getAgentById: (id) => get().agents.find((a) => a.id === id),
}));

import React, { useState, useRef, useEffect } from 'react';
import {
    Brain,
    Zap,
    Activity,
    Cpu,
    Target,
    Search,
    Mail,
    Upload,
    FileText,
    Image,
    FileJson,
    Table,
    Trash2,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { Card, Badge, StatusBadge, Button, Textarea, useToast } from '@/components/ui';
import { useAgentStore, type AIAgent, type AgentRAGFile } from '@/stores/agentStore';
import { AI_MODELS } from '@/services/aiService';

const AGENT_ICONS: Record<string, React.ElementType> = {
    'agent-orchestrator': Brain,
    'agent-linkedin-scout': Search,
    'agent-email-validator': Mail,
    'agent-copywriter': Zap,
    'agent-analyst': Activity,
    'agent-lead-scorer': Target,
};

const FILE_ICONS: Record<string, React.ElementType> = {
    pdf: FileText,
    png: Image,
    csv: Table,
    json: FileJson,
};

interface AgentCardProps {
    agent: AIAgent;
    isExpanded: boolean;
    onToggle: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, isExpanded, onToggle }) => {
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { updateModel, updateSystemPrompt, addRAGFile, removeRAGFile } = useAgentStore();

    const [editedPrompt, setEditedPrompt] = useState(agent.systemPrompt);
    const [editedModel, setEditedModel] = useState(agent.model);
    const [hasChanges, setHasChanges] = useState(false);

    const IconComponent = AGENT_ICONS[agent.id] || Brain;
    const modelInfo = AI_MODELS.find(m => m.id === agent.model);

    const handleModelChange = (newModel: string) => {
        setEditedModel(newModel);
        setHasChanges(true);
    };

    const handlePromptChange = (newPrompt: string) => {
        setEditedPrompt(newPrompt);
        setHasChanges(true);
    };

    const handleSave = () => {
        updateModel(agent.id, editedModel);
        updateSystemPrompt(agent.id, editedPrompt);
        setHasChanges(false);
        toast.success('Configuration sauvegardée!');
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const file = e.target.files[0];
        if (!file) return;

        const extension = file.name.split('.').pop()?.toLowerCase() as AgentRAGFile['type'];

        if (!['pdf', 'png', 'csv', 'json'].includes(extension)) {
            toast.error('Format non supporté', 'Utilisez PDF, PNG, CSV ou JSON');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            addRAGFile(agent.id, {
                name: file.name,
                type: extension,
                size: file.size,
                content: reader.result as string,
            });
            toast.success('Fichier RAG ajouté', file.name);
        };

        if (extension === 'json' || extension === 'csv') {
            reader.readAsText(file);
        } else {
            reader.readAsDataURL(file);
        }

        e.target.value = '';
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <Card className="relative group hover:border-astro-gold/30 transition-all overflow-hidden">
            {/* Header - Always Visible */}
            <div
                className="flex items-start gap-4 cursor-pointer"
                onClick={onToggle}
            >
                <div className="w-14 h-14 rounded-xl bg-astro-gold/10 border border-astro-gold/20 flex items-center justify-center text-astro-gold group-hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] transition-all shrink-0">
                    <IconComponent size={28} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white truncate">{agent.name}</h3>
                        <StatusBadge status={agent.status} />
                    </div>
                    <p className="text-sm text-astro-gold font-medium">{agent.role}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                        Modèle: {modelInfo?.name || agent.model}
                    </p>
                </div>
                <button className="p-2 text-neutral-500 hover:text-white transition-colors">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-400 mt-4 mb-4">{agent.description}</p>

            {/* Performance Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-500">Performance</span>
                    <span className="text-astro-gold font-bold">{agent.performance}%</span>
                </div>
                <div className="w-full bg-astro-950 rounded-full h-1.5">
                    <div
                        className="bg-astro-gold h-1.5 rounded-full shadow-[0_0_8px_rgba(255,215,0,0.4)]"
                        style={{ width: `${agent.performance}%` }}
                    />
                </div>
            </div>

            {/* Capabilities */}
            <div className="flex flex-wrap gap-1 mb-4">
                {agent.capabilities.map((cap) => (
                    <Badge key={cap} variant="default" size="sm">
                        {cap}
                    </Badge>
                ))}
            </div>

            {/* Accordion Content - Configuration */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pt-4 border-t border-astro-800 space-y-4">
                    {/* Model Selection */}
                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">
                            Modèle IA
                        </label>
                        <select
                            value={editedModel}
                            onChange={(e) => handleModelChange(e.target.value)}
                            className="w-full neon-input py-2.5"
                        >
                            {AI_MODELS.map((model) => (
                                <option key={model.id} value={model.id}>
                                    {model.name} ({model.provider})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* System Prompt */}
                    <Textarea
                        label="Prompt Système"
                        value={editedPrompt}
                        onChange={(e) => handlePromptChange(e.target.value)}
                        rows={4}
                        placeholder="Instructions pour l'agent..."
                    />

                    {/* RAG Files */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                                Documents RAG
                            </label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                leftIcon={<Upload size={14} />}
                            >
                                Ajouter
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.png,.csv,.json"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </div>

                        {agent.ragFiles.length === 0 ? (
                            <div className="text-center py-4 border border-dashed border-astro-700 rounded-lg">
                                <p className="text-xs text-neutral-500">
                                    PDF, PNG, CSV, JSON acceptés
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {agent.ragFiles.map((file) => {
                                    const FileIcon = FILE_ICONS[file.type] || FileText;
                                    return (
                                        <div
                                            key={file.id}
                                            className="flex items-center gap-2 p-2 bg-astro-800/50 rounded-lg border border-astro-700"
                                        >
                                            <FileIcon size={16} className="text-astro-gold shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-white truncate">{file.name}</p>
                                                <p className="text-[10px] text-neutral-500">
                                                    {formatFileSize(file.size)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    removeRAGFile(agent.id, file.id);
                                                    toast.info('Fichier supprimé');
                                                }}
                                                className="p-1 text-red-400 hover:text-red-300"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Save Button */}
                    {hasChanges && (
                        <Button onClick={handleSave} className="w-full">
                            Sauvegarder les modifications
                        </Button>
                    )}
                </div>
            </div>

            {/* RAG Files indicator when collapsed */}
            {!isExpanded && agent.ragFiles.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-neutral-500 mt-2">
                    <FileText size={12} />
                    {agent.ragFiles.length} fichier(s) RAG
                </div>
            )}
        </Card>
    );
};

const Agents: React.FC = () => {
    const { agents, fetchAgents } = useAgentStore();
    const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);

    // Fetch agents from Supabase on component mount
    useEffect(() => {
        fetchAgents();
    }, [fetchAgents]);

    const toggleAgent = (agentId: string) => {
        setExpandedAgentId(prev => prev === agentId ? null : agentId);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Cpu className="text-astro-gold" />
                    Équipe d'Agents IA
                </h1>
                <p className="text-neutral-500">
                    Configurez votre équipe d'agents autonomes. Cliquez sur un agent pour accéder à ses paramètres.
                </p>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="text-center">
                    <p className="text-3xl font-bold text-green-400">
                        {agents.filter((a) => a.status === 'active').length}
                    </p>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Actifs</p>
                </Card>
                <Card className="text-center">
                    <p className="text-3xl font-bold text-yellow-400">
                        {agents.filter((a) => a.status === 'inactive').length}
                    </p>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Inactifs</p>
                </Card>
                <Card className="text-center">
                    <p className="text-3xl font-bold text-astro-gold">
                        {Math.round(agents.reduce((acc, a) => acc + a.performance, 0) / agents.length)}%
                    </p>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Performance Moy.</p>
                </Card>
            </div>

            {/* Agents Grid with Accordion */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {agents.map((agent) => (
                    <AgentCard
                        key={agent.id}
                        agent={agent}
                        isExpanded={expandedAgentId === agent.id}
                        onToggle={() => toggleAgent(agent.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Agents;

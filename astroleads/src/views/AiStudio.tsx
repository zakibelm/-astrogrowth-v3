import React, { useState } from 'react';
import { Play, Copy, Sparkles, Settings as SettingsIcon } from 'lucide-react';
import { Button, Card, Textarea, useToast } from '@/components/ui';
import { generateCompletion, AI_MODELS } from '@/services/aiService';

const AiStudio: React.FC = () => {
    const toast = useToast();

    const [prompt, setPrompt] = useState('');
    const [systemPrompt, setSystemPrompt] = useState('Tu es un assistant expert en prospection B2B et génération de leads.');
    const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id);
    const [temperature, setTemperature] = useState(0.7);
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const handleRun = async () => {
        if (!prompt.trim()) {
            toast.warning('Veuillez entrer un prompt');
            return;
        }

        setIsLoading(true);
        setResponse('');

        try {
            const result = await generateCompletion(prompt, systemPrompt, selectedModel, temperature);
            setResponse(result);
            toast.success('Génération terminée!');
        } catch (error) {
            console.error('AI Studio Error:', error);
            toast.error('Erreur', (error as Error).message);
            setResponse(`Erreur: ${(error as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(response);
        toast.info('Copié dans le presse-papier');
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Sparkles className="text-astro-gold" />
                        AI Studio
                    </h1>
                    <p className="text-neutral-500">Testez et expérimentez avec différents modèles IA via OpenRouter</p>
                </div>
                <Button
                    variant="secondary"
                    onClick={() => setShowSettings(!showSettings)}
                    leftIcon={<SettingsIcon size={18} />}
                >
                    Paramètres
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {showSettings && (
                    <Card className="lg:col-span-1">
                        <h3 className="text-lg font-semibold text-white mb-4">Configuration</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">
                                    Modèle IA
                                </label>
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="w-full neon-input py-2.5"
                                >
                                    {AI_MODELS.map((model) => (
                                        <option key={model.id} value={model.id}>
                                            {model.name} ({model.provider})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">
                                    Température: {temperature}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={temperature}
                                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                    className="w-full accent-astro-gold"
                                />
                                <div className="flex justify-between text-xs text-neutral-500 mt-1">
                                    <span>Précis</span>
                                    <span>Créatif</span>
                                </div>
                            </div>

                            <Textarea
                                label="Instructions Système"
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                                rows={4}
                                placeholder="Instructions pour le modèle..."
                            />
                        </div>
                    </Card>
                )}

                <Card className={showSettings ? 'lg:col-span-2' : 'lg:col-span-3'}>
                    <div className="space-y-4">
                        <Textarea
                            label="Votre Prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={6}
                            placeholder="Écrivez votre prompt ici..."
                        />

                        <Button
                            onClick={handleRun}
                            isLoading={isLoading}
                            leftIcon={<Play size={18} />}
                            className="w-full"
                        >
                            Exécuter
                        </Button>

                        {response && (
                            <div className="mt-6">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                                        Réponse
                                    </label>
                                    <Button variant="ghost" size="sm" onClick={handleCopy}>
                                        <Copy size={14} /> Copier
                                    </Button>
                                </div>
                                <div className="neon-input p-4 whitespace-pre-wrap text-sm text-neutral-300 max-h-96 overflow-y-auto custom-scrollbar">
                                    {response}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AiStudio;

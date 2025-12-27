/**
 * Enhanced Lead Import Modal with Smart Filtering
 * - B2B/B2C/Hybrid campaign type selection
 * - Automatic source detection
 * - Quality scoring (min 85)
 * - Interactive lead selection
 */

import React, { useState, useRef, useMemo } from 'react';
import { Upload, FileText, Check, AlertCircle, Download, X, Filter, Building2, Users, Shuffle } from 'lucide-react';
import { Card, Button, Modal, useToast } from '@/components/ui';
import {
    parseCSV,
    validateCSVData,
    mapRowToLead,
    downloadSampleCSV,
    type ParsedCSV,
    type ColumnMapping,
} from '@/services/csvService';
import { enrichLeadsBatch } from '@/services/enrichmentService';
import {
    detectLeadSource,
    calculateQualityScore,
    filterByQuality,
    SOURCE_CONFIG,
    type CampaignType,
    type LeadSource,
} from '@/services/leadScoringService';
import { useLeadStore } from '@/stores/leadStore';

interface LeadImportModalProps {
    campaignId: string;
    onClose: () => void;
    onSuccess: (imported: number) => void;
}

type Step = 'type' | 'upload' | 'mapping' | 'review' | 'options' | 'importing' | 'complete';

export const LeadImportModal: React.FC<LeadImportModalProps> = ({
    campaignId,
    onClose,
    onSuccess,
}) => {
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { bulkImportLeads } = useLeadStore();

    // State
    const [step, setStep] = useState<Step>('type');
    const [campaignType, setCampaignType] = useState<CampaignType>('b2b');
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<ParsedCSV | null>(null);
    const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
    const [selectedLeads, setSelectedLeads] = useState<Set<number>>(new Set());
    const [sourceFilter, setSourceFilter] = useState<LeadSource | 'all'>('all');
    const [options, setOptions] = useState({
        validateEmails: false,
        findMissingEmails: false,
        skipDuplicates: true,
    });
    const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });
    const [importResults, setImportResults] = useState({
        inserted: 0,
        skipped: 0,
        errors: 0,
    });

    // Process leads with quality scoring
    const processedLeads = useMemo(() => {
        if (!parsedData) return [];

        return parsedData.rows.map((row, index) => {
            const lead = mapRowToLead(row, columnMapping);
            const source = detectLeadSource(lead);
            const qualityScore = calculateQualityScore(lead, campaignType, source);

            return {
                index,
                ...lead,
                source,
                qualityScore,
            };
        });
    }, [parsedData, columnMapping, campaignType]);

    // Filter leads
    const { qualified, rejected } = useMemo(() => {
        const filtered = filterByQuality(
            processedLeads.map(l => ({ ...l })),
            campaignType,
            85
        );
        return filtered;
    }, [processedLeads, campaignType]);

    // Apply source filter
    const filteredLeads = useMemo(() => {
        if (sourceFilter === 'all') return qualified;
        return qualified.filter(l => l.source === sourceFilter);
    }, [qualified, sourceFilter]);

    // Source distribution
    const sourceDistribution = useMemo(() => {
        const dist: Record<LeadSource, number> = {
            linkedin: 0,
            'google-maps': 0,
            facebook: 0,
            instagram: 0,
            tiktok: 0,
            twitter: 0,
            youtube: 0,
            custom: 0,
        };

        qualified.forEach(lead => {
            dist[lead.source]++;
        });

        return dist;
    }, [qualified]);

    // Handle file upload
    const handleFileSelect = async (selectedFile: File) => {
        if (!selectedFile.name.endsWith('.csv')) {
            toast.error('Format invalide', 'Veuillez importer un fichier CSV');
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            toast.error('Fichier trop volumineux', 'Maximum 10 MB');
            return;
        }

        try {
            setFile(selectedFile);
            const parsed = await parseCSV(selectedFile);
            setParsedData(parsed);
            setColumnMapping(parsed.detectedColumns);
            setStep('mapping');
        } catch (error) {
            toast.error('Erreur', error instanceof Error ? error.message : 'Impossible de lire le fichier');
        }
    };

    // Handle import
    const handleImport = async () => {
        const leadsToImport = Array.from(selectedLeads).map(index =>
            qualified.find(l => l.index === index)
        ).filter(Boolean);

        if (leadsToImport.length === 0) {
            toast.warning('Aucun lead sélectionné');
            return;
        }

        setStep('importing');

        try {
            // Enrich if requested
            let enrichedLeads = leadsToImport;

            if (options.validateEmails || options.findMissingEmails) {
                // Only enrich B2B leads
                const shouldEnrich = campaignType !== 'b2c';

                if (shouldEnrich) {
                    const enrichmentResults = await enrichLeadsBatch(enrichedLeads, {
                        validateEmail: options.validateEmails,
                        findEmail: options.findMissingEmails,
                        onProgress: (current, total) => {
                            setImportProgress({ current, total });
                        },
                    });

                    enrichedLeads = enrichedLeads.map((lead, index) => {
                        const enrichment = enrichmentResults[index];
                        if (enrichment && enrichment.success) {
                            return {
                                ...lead,
                                email: enrichment.foundEmail || enrichment.validatedEmail || lead.email,
                            };
                        }
                        return lead;
                    });
                }
            }

            // Import to database
            const result = await bulkImportLeads(campaignId, enrichedLeads, {
                skipDuplicates: options.skipDuplicates,
            });

            setImportResults(result);
            setStep('complete');
            onSuccess(result.inserted);
        } catch (error) {
            toast.error('Erreur d\'importation', error instanceof Error ? error.message : 'Une erreur est survenue');
            setStep('review');
        }
    };

    // Select/deselect handlers
    const handleSelectAll = () => {
        setSelectedLeads(new Set(filteredLeads.map(l => l.index)));
    };

    const handleDeselectAll = () => {
        setSelectedLeads(new Set());
    };

    const handleToggleSelect = (index: number) => {
        const newSelected = new Set(selectedLeads);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedLeads(newSelected);
    };

    // Render steps
    const renderStep = () => {
        switch (step) {
            case 'type':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Type de Campagne
                            </h3>
                            <p className="text-sm text-neutral-400">
                                Sélectionnez le type pour optimiser les ressources
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => {
                                    setCampaignType('b2b');
                                    setStep('upload');
                                }}
                                className="p-6 bg-astro-800 border-2 border-transparent hover:border-astro-gold rounded-xl transition-all text-center group"
                            >
                                <Building2 className="w-12 h-12 mx-auto text-blue-400 mb-3" />
                                <h4 className="text-lg font-semibold text-white mb-2">B2B</h4>
                                <p className="text-xs text-neutral-400 mb-3">
                                    Entreprises et professionnels
                                </p>
                                <div className="flex flex-wrap gap-1 justify-center">
                                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                                        LinkedIn
                                    </span>
                                    <span className="text-[10px] bg-green-500/20 text-green-300 px-2 py-1 rounded">
                                        Google Maps
                                    </span>
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    setCampaignType('b2c');
                                    setStep('upload');
                                }}
                                className="p-6 bg-astro-800 border-2 border-transparent hover:border-astro-gold rounded-xl transition-all text-center group"
                            >
                                <Users className="w-12 h-12 mx-auto text-pink-400 mb-3" />
                                <h4 className="text-lg font-semibold text-white mb-2">B2C</h4>
                                <p className="text-xs text-neutral-400 mb-3">
                                    Particuliers et influenceurs
                                </p>
                                <div className="flex flex-wrap gap-1 justify-center">
                                    <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-1 rounded">
                                        Instagram
                                    </span>
                                    <span className="text-[10px] bg-black/40 text-white px-2 py-1 rounded">
                                        TikTok
                                    </span>
                                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                                        Facebook
                                    </span>
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    setCampaignType('hybrid');
                                    setStep('upload');
                                }}
                                className="p-6 bg-astro-800 border-2 border-transparent hover:border-astro-gold rounded-xl transition-all text-center group"
                            >
                                <Shuffle className="w-12 h-12 mx-auto text-astro-gold mb-3" />
                                <h4 className="text-lg font-semibold text-white mb-2">Hybride</h4>
                                <p className="text-xs text-neutral-400 mb-3">
                                    Mix B2B et B2C
                                </p>
                                <div className="flex flex-wrap gap-1 justify-center">
                                    <span className="text-[10px] bg-astro-gold/20 text-astro-gold px-2 py-1 rounded">
                                        Toutes sources
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                );

            case 'upload':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Import CSV - {campaignType.toUpperCase()}
                            </h3>
                        </div>

                        <div
                            className="border-2 border-dashed border-astro-700 rounded-xl p-12 text-center cursor-pointer hover:border-astro-gold/50 transition-colors"
                            onDrop={(e) => {
                                e.preventDefault();
                                const droppedFile = e.dataTransfer.files[0];
                                if (droppedFile) handleFileSelect(droppedFile);
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-16 h-16 mx-auto text-astro-gold mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Déposez votre fichier CSV ici
                            </h3>
                            <p className="text-neutral-400 mb-4">
                                ou cliquez pour sélectionner un fichier
                            </p>
                            <p className="text-xs text-neutral-500">
                                Maximum 10 MB • Format CSV uniquement
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                                className="hidden"
                            />
                        </div>

                        {/* Sample templates */}
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-3">
                                Télécharger un modèle :
                            </h4>
                            <div className="grid grid-cols-3 gap-3">
                                {campaignType !== 'b2c' && (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            leftIcon={<Download size={14} />}
                                            onClick={() => downloadSampleCSV('linkedin')}
                                        >
                                            LinkedIn
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            leftIcon={<Download size={14} />}
                                            onClick={() => downloadSampleCSV('google-maps')}
                                        >
                                            Google Maps
                                        </Button>
                                    </>
                                )}
                                {campaignType !== 'b2b' && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        leftIcon={<Download size={14} />}
                                        onClick={() => downloadSampleCSV('social-media')}
                                    >
                                        Social Media
                                    </Button>
                                )}
                            </div>
                        </div>

                        <Button variant="ghost" onClick={() => setStep('type')}>
                            Retour
                        </Button>
                    </div>
                );

            case 'mapping':
                const validation = parsedData ? validateCSVData(parsedData.rows, columnMapping) : null;

                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Mappage des colonnes
                            </h3>
                            <p className="text-sm text-neutral-400">
                                {parsedData?.rows.length} lignes détectées
                            </p>
                        </div>

                        {/* Column mappings - shortened list */}
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {Object.entries({
                                firstName: 'Prénom',
                                lastName: 'Nom',
                                email: 'Email',
                                company: 'Entreprise',
                                position: 'Poste',
                                linkedin_url: 'LinkedIn',
                            }).map(([field, label]) => (
                                <div key={field} className="flex items-center gap-3">
                                    <label className="w-32 text-sm text-neutral-400">{label}</label>
                                    <select
                                        value={columnMapping[field as keyof ColumnMapping] || ''}
                                        onChange={(e) => {
                                            setColumnMapping({
                                                ...columnMapping,
                                                [field]: e.target.value || undefined,
                                            });
                                        }}
                                        className="flex-1 neon-input text-sm"
                                    >
                                        <option value="">-- Non mappé --</option>
                                        {parsedData?.headers.map(header => (
                                            <option key={header} value={header}>
                                                {header}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>

                        {validation && validation.warnings.length > 0 && (
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-yellow-400 mb-2">
                                            Avertissements
                                        </h4>
                                        <ul className="text-xs text-yellow-300 space-y-1">
                                            {validation.warnings.slice(0, 3).map((warning, i) => (
                                                <li key={i}>• {warning}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button variant="ghost" onClick={() => setStep('upload')}>
                                Retour
                            </Button>
                            <Button
                                onClick={() => setStep('review')}
                                disabled={!validation?.valid}
                                className="flex-1"
                            >
                                Analyser la qualité
                            </Button>
                        </div>
                    </div>
                );

            case 'review':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Review & Sélection
                            </h3>
                            <p className="text-sm text-neutral-400">
                                Seuil de qualité: <span className="text-astro-gold font-bold">80/100</span>
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <Card className="text-center">
                                <p className="text-3xl font-bold text-green-400">
                                    {qualified.length}
                                </p>
                                <p className="text-xs text-neutral-500">✅ Qualifiés (≥80)</p>
                            </Card>
                            <Card className="text-center">
                                <p className="text-3xl font-bold text-red-400">
                                    {rejected.length}
                                </p>
                                <p className="text-xs text-neutral-500">❌ Rejetés (<80)</p>
                            </Card>
                            <Card className="text-center">
                                <p className="text-3xl font-bold text-astro-gold">
                                    {selectedLeads.size}
                                </p>
                                <p className="text-xs text-neutral-500">👆 Sélectionnés</p>
                            </Card>
                        </div>

                        {/* Source filters */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Filter className="w-4 h-4 text-neutral-400" />
                                <span className="text-sm text-neutral-400">Filtrer par source:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSourceFilter('all')}
                                    className={`px-3 py-1 rounded text-xs ${sourceFilter === 'all' ? 'bg-astro-gold text-black' : 'bg-astro-700 text-neutral-300'}`}
                                >
                                    Toutes ({qualified.length})
                                </button>
                                {Object.entries(sourceDistribution).map(([source, count]) => {
                                    if (count === 0) return null;
                                    const config = SOURCE_CONFIG[source as LeadSource];
                                    return (
                                        <button
                                            key={source}
                                            onClick={() => setSourceFilter(source as LeadSource)}
                                            className={`px-3 py-1 rounded text-xs flex items-center gap-1 ${sourceFilter === source
                                                ? `${config.color} text-white`
                                                : 'bg-astro-700 text-neutral-300'
                                                }`}
                                        >
                                            <span>{config.icon}</span>
                                            <span>{config.name} ({count})</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Leads table */}
                        <div className="border border-astro-700 rounded-lg overflow-hidden">
                            <div className="max-h-80 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-astro-800 sticky top-0">
                                        <tr>
                                            <th className="p-2 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0}
                                                    onChange={() => {
                                                        if (selectedLeads.size === filteredLeads.length) {
                                                            handleDeselectAll();
                                                        } else {
                                                            handleSelectAll();
                                                        }
                                                    }}
                                                />
                                            </th>
                                            <th className="p-2 text-left text-neutral-400">Nom</th>
                                            <th className="p-2 text-left text-neutral-400">Email</th>
                                            <th className="p-2 text-left text-neutral-400">Source</th>
                                            <th className="p-2 text-left text-neutral-400">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredLeads.map((lead) => (
                                            <tr key={lead.index} className="border-t border-astro-700 hover:bg-astro-800/50">
                                                <td className="p-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedLeads.has(lead.index)}
                                                        onChange={() => handleToggleSelect(lead.index)}
                                                    />
                                                </td>
                                                <td className="p-2 text-white">
                                                    {lead.firstName || lead.first_name} {lead.lastName || lead.last_name}
                                                </td>
                                                <td className="p-2 text-neutral-300">
                                                    {lead.email || <span className="text-red-400">❌</span>}
                                                </td>
                                                <td className="p-2">
                                                    <span className={`px-2 py-1 rounded text-xs ${SOURCE_CONFIG[lead.source].color} text-white`}>
                                                        {SOURCE_CONFIG[lead.source].icon} {SOURCE_CONFIG[lead.source].name}
                                                    </span>
                                                </td>
                                                <td className="p-2">
                                                    <span className={`font-bold ${lead.qualityScore.score >= 90 ? 'text-green-400' :
                                                        lead.qualityScore.score >= 80 ? 'text-yellow-400' :
                                                            'text-red-400'
                                                        }`}>
                                                        {lead.qualityScore.score}/100
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="ghost" onClick={() => setStep('mapping')}>
                                Retour
                            </Button>
                            <Button
                                onClick={() => setStep('options')}
                                disabled={selectedLeads.size === 0}
                                className="flex-1"
                            >
                                Continuer ({selectedLeads.size} leads)
                            </Button>
                        </div>
                    </div>
                );

            case 'options':
                // Smart options based on campaign type
                const showHunterOptions = campaignType !== 'b2c';

                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-white">
                            Options d'enrichissement
                        </h3>

                        <div className="space-y-4">
                            {showHunterOptions && (
                                <>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={options.validateEmails}
                                            onChange={(e) => setOptions({ ...options, validateEmails: e.target.checked })}
                                            className="w-5 h-5"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                Valider les emails avec Hunter.io
                                            </p>
                                            <p className="text-xs text-neutral-400">
                                                Vérifie que les emails sont valides ({selectedLeads.size} crédits)
                                            </p>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={options.findMissingEmails}
                                            onChange={(e) => setOptions({ ...options, findMissingEmails: e.target.checked })}
                                            className="w-5 h-5"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                Trouver les emails manquants
                                            </p>
                                            <p className="text-xs text-neutral-400">
                                                Recherche automatique avec Hunter.io
                                            </p>
                                        </div>
                                    </label>
                                </>
                            )}

                            {!showHunterOptions && (
                                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                    <p className="text-sm text-blue-300">
                                        💡 Hunter.io désactivé pour les campagnes B2C (non pertinent pour réseaux sociaux)
                                    </p>
                                </div>
                            )}

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={options.skipDuplicates}
                                    onChange={(e) => setOptions({ ...options, skipDuplicates: e.target.checked })}
                                    className="w-5 h-5"
                                />
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        Ignorer les doublons
                                    </p>
                                    <p className="text-xs text-neutral-400">
                                        Ne pas importer les emails déjà présents
                                    </p>
                                </div>
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="ghost" onClick={() => setStep('review')}>
                                Retour
                            </Button>
                            <Button onClick={handleImport} className="flex-1">
                                Lancer l'importation
                            </Button>
                        </div>
                    </div>
                );

            case 'importing':
                return (
                    <div className="space-y-6 text-center">
                        <div className="w-16 h-16 mx-auto border-4 border-astro-gold border-t-transparent rounded-full animate-spin" />
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Importation en cours...
                            </h3>
                            {importProgress.total > 0 && (
                                <p className="text-sm text-neutral-400">
                                    {importProgress.current} / {importProgress.total} traités
                                </p>
                            )}
                        </div>
                    </div>
                );

            case 'complete':
                return (
                    <div className="space-y-6 text-center">
                        <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                            <Check className="w-8 h-8 text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Importation terminée !
                            </h3>
                            <div className="grid grid-cols-3 gap-4 mt-6">
                                <div>
                                    <p className="text-2xl font-bold text-green-400">
                                        {importResults.inserted}
                                    </p>
                                    <p className="text-xs text-neutral-500">Importés</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-yellow-400">
                                        {importResults.skipped}
                                    </p>
                                    <p className="text-xs text-neutral-500">Ignorés</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-red-400">
                                        {importResults.errors}
                                    </p>
                                    <p className="text-xs text-neutral-500">Erreurs</p>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-astro-gold/10 border border-astro-gold/30 rounded-lg">
                                <p className="text-sm text-astro-gold">
                                    💰 {rejected.length} leads rejetés (score &#60; 80) - économie de {rejected.length} crédits!
                                </p>
                            </div>
                        </div>
                        <Button onClick={onClose} className="w-full">
                            Fermer
                        </Button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-astro-gold" />
                    <h2 className="text-xl font-bold text-white">Importer des leads</h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-astro-800 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5 text-neutral-400" />
                </button>
            </div>

            {renderStep()}
        </Modal>
    );
};

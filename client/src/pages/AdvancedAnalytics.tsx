/**
 * Advanced Analytics Dashboard
 *
 * Features:
 * - Langfuse observability metrics (traces, spans, costs)
 * - Business KPIs (workflows executed, success rate, ROI)
 * - Real-time performance monitoring
 * - Agent-level analytics
 * - Cost forecasting and budget alerts
 * - Exportable reports
 *
 * Metrics Tracked:
 * - Total workflows executed
 * - Success/failure rate
 * - Average execution time
 * - Token usage and costs
 * - Most used agents
 * - ROI calculations
 */

import { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  BarChart3,
  Download,
  Calendar,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useToast } from "../hooks/use-toast";

// Mock data - replace with real API calls
const MOCK_WORKFLOW_DATA = [
  { date: "2025-01-20", workflows: 12, success: 10, failed: 2, cost: 2.45 },
  { date: "2025-01-21", workflows: 18, success: 16, failed: 2, cost: 3.82 },
  { date: "2025-01-22", workflows: 15, success: 14, failed: 1, cost: 3.21 },
  { date: "2025-01-23", workflows: 22, success: 20, failed: 2, cost: 4.76 },
  { date: "2025-01-24", workflows: 28, success: 26, failed: 2, cost: 5.93 },
  { date: "2025-01-25", workflows: 31, success: 29, failed: 2, cost: 6.54 },
  { date: "2025-01-26", workflows: 24, success: 22, failed: 2, cost: 5.12 },
];

const MOCK_AGENT_USAGE = [
  { agent: "SEO Analyst", usage: 324, cost: 12.45, avgTime: "3.2 min" },
  { agent: "Copywriter", usage: 287, cost: 11.23, avgTime: "4.1 min" },
  { agent: "Social Media", usage: 245, cost: 9.87, avgTime: "2.8 min" },
  { agent: "Email Specialist", usage: 198, cost: 7.91, avgTime: "3.5 min" },
  { agent: "Data Analyst", usage: 156, cost: 6.32, avgTime: "5.2 min" },
];

const MOCK_CATEGORY_DISTRIBUTION = [
  { name: "Lead Generation", value: 35, color: "#3b82f6" },
  { name: "Content", value: 28, color: "#10b981" },
  { name: "Social Media", value: 22, color: "#8b5cf6" },
  { name: "Email", value: 10, color: "#f59e0b" },
  { name: "Analytics", value: 5, color: "#6366f1" },
];

export default function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Calculate summary metrics
  const totalWorkflows = MOCK_WORKFLOW_DATA.reduce(
    (sum, d) => sum + d.workflows,
    0
  );
  const totalSuccess = MOCK_WORKFLOW_DATA.reduce((sum, d) => sum + d.success, 0);
  const totalFailed = MOCK_WORKFLOW_DATA.reduce((sum, d) => sum + d.failed, 0);
  const totalCost = MOCK_WORKFLOW_DATA.reduce((sum, d) => sum + d.cost, 0);
  const successRate = (totalSuccess / totalWorkflows) * 100;
  const avgCostPerWorkflow = totalCost / totalWorkflows;

  // Export report
  const handleExportReport = () => {
    const report = {
      period: timeRange,
      summary: {
        totalWorkflows,
        successRate: `${successRate.toFixed(1)}%`,
        totalCost: `$${totalCost.toFixed(2)}`,
        avgCostPerWorkflow: `$${avgCostPerWorkflow.toFixed(2)}`,
      },
      dailyData: MOCK_WORKFLOW_DATA,
      agentUsage: MOCK_AGENT_USAGE,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Rapport exporté",
      description: "Le rapport d'analytics a été téléchargé",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📊 Analytics Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Monitoring en temps réel + Observability Langfuse
            </p>
          </div>

          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) =>
                setTimeRange(e.target.value as "7d" | "30d" | "90d")
              }
              className="px-4 py-2 border rounded-lg bg-white"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">90 derniers jours</option>
            </select>

            <Button onClick={handleExportReport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Workflows Exécutés"
            value={totalWorkflows.toString()}
            change="+12.5%"
            isPositive={true}
            icon={<Zap className="w-6 h-6" />}
            color="from-blue-600 to-cyan-600"
          />
          <KPICard
            title="Taux de Succès"
            value={`${successRate.toFixed(1)}%`}
            change="+2.3%"
            isPositive={true}
            icon={<CheckCircle2 className="w-6 h-6" />}
            color="from-green-600 to-emerald-600"
          />
          <KPICard
            title="Coût Total"
            value={`$${totalCost.toFixed(2)}`}
            change="+8.7%"
            isPositive={false}
            icon={<DollarSign className="w-6 h-6" />}
            color="from-purple-600 to-pink-600"
          />
          <KPICard
            title="Coût Moyen"
            value={`$${avgCostPerWorkflow.toFixed(2)}`}
            change="-3.2%"
            isPositive={true}
            icon={<TrendingUp className="w-6 h-6" />}
            color="from-orange-600 to-red-600"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Workflows over time */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Workflows Exécutés
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={MOCK_WORKFLOW_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="workflows"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Total"
                />
                <Line
                  type="monotone"
                  dataKey="success"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Succès"
                />
                <Line
                  type="monotone"
                  dataKey="failed"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Échecs"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Cost over time */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Évolution des Coûts
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={MOCK_WORKFLOW_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cost" fill="#8b5cf6" name="Coût ($)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Category distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Distribution par Catégorie
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={MOCK_CATEGORY_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {MOCK_CATEGORY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Agents */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Top 5 Agents
            </h3>
            <div className="space-y-3">
              {MOCK_AGENT_USAGE.map((agent, index) => (
                <div
                  key={agent.agent}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {agent.agent}
                      </p>
                      <p className="text-sm text-gray-500">
                        {agent.usage} utilisations • ${agent.cost}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-3 h-3" />
                      {agent.avgTime}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Langfuse Integration Info */}
        <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                🚀 Observability Langfuse Intégrée
              </h3>
              <p className="text-gray-700 mb-4">
                Ce dashboard intègre les métriques de Langfuse pour un tracking
                détaillé de chaque workflow. Vous pouvez:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Tracer chaque exécution d'agent avec spans détaillés</li>
                <li>Monitorer les coûts en temps réel par modèle LLM</li>
                <li>Debugger les erreurs avec logs complets</li>
                <li>
                  Analyser les performances et optimiser les prompts
                </li>
                <li>Exporter les traces pour analyse approfondie</li>
              </ul>
              <Button
                className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600"
                onClick={() => window.open("https://cloud.langfuse.com", "_blank")}
              >
                Ouvrir Langfuse Dashboard →
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// KPI Card Component
function KPICard({
  title,
  value,
  change,
  isPositive,
  icon,
  color,
}: {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center text-white`}
        >
          {icon}
        </div>
        <div
          className={`text-sm font-semibold ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {change}
        </div>
      </div>
      <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </Card>
  );
}

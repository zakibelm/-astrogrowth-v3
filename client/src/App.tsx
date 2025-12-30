import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/DashboardV2";
import NewCampaign from "./pages/NewCampaign";
import CampaignDetails from "./pages/CampaignDetails";
import LeadsList from "./pages/LeadsList";
import LeadDetails from "./pages/LeadDetails";
import ContentApproval from "./pages/ContentApproval";
import Campaigns from "./pages/Campaigns";
import Contents from "./pages/Contents";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import AgentTeamComplete from "./pages/AgentTeamComplete";
import AgentsTeamFull from "./pages/AgentsTeamFull";
import Workflows from "@/pages/Workflows";
import WorkflowCreator from "@/pages/WorkflowCreator";
import AgentCreator from "@/pages/AgentCreator";
import WorkflowConfigure from "./pages/WorkflowConfigure";
import MyWorkflow from "./pages/MyWorkflow";
import PlatformConnections from "./pages/PlatformConnections";
import AgentWorkflows from "./pages/AgentWorkflows";
import AppLayout from "./components/AppLayout";

import AuthPage from "./pages/AuthPage";
import AuthGuard from "./components/AuthGuard";
import AdminGuard from "./components/AdminGuard";

function Router() {
  return (
    <Switch>
      <Route path={"/"}>
        <Home />
      </Route>

      {/* Public Auth Route */}
      <Route path={"/auth"}>
        <AuthPage />
      </Route>

      {/* Protected Routes */}
      <Route path={"/dashboard"}>
        <AuthGuard><AppLayout><Dashboard /></AppLayout></AuthGuard>
      </Route>
      <Route path={"/campaigns/new"}>
        <AuthGuard><AppLayout><NewCampaign /></AppLayout></AuthGuard>
      </Route>
      <Route path={"/campaigns/:id"}>
        <AuthGuard><AppLayout><CampaignDetails /></AppLayout></AuthGuard>
      </Route>
      <Route path={"/campaigns/:campaignId/leads"}>
        <AuthGuard><AppLayout><LeadsList /></AppLayout></AuthGuard>
      </Route>
      <Route path={"/lead/:id"}>
        <AuthGuard><AppLayout><LeadDetails /></AppLayout></AuthGuard>
      </Route>
      <Route path={"/content/:id"}>
        <AuthGuard><AppLayout><ContentApproval /></AppLayout></AuthGuard>
      </Route>
      <Route path={"/campaigns"}>
        <AuthGuard><AppLayout><Campaigns /></AppLayout></AuthGuard>
      </Route>
      <Route path={"/contents"}>
        <AuthGuard><AppLayout><Contents /></AppLayout></AuthGuard>
      </Route>
      <Route path={"/profile"}>
        <AuthGuard><AppLayout><Profile /></AppLayout></AuthGuard>
      </Route>
      <Route path={"/analytics"}>
        <AuthGuard><AppLayout><Analytics /></AppLayout></AuthGuard>
      </Route>
      <Route path={"/settings"}>
        <AdminGuard><AppLayout><Settings /></AppLayout></AdminGuard>
      </Route>
      <Route path={"/agents"}>
        <AuthGuard><AppLayout><AgentsTeamFull /></AppLayout></AuthGuard>
      </Route>
      <Route path={"/agents/create"}>
        <AuthGuard><AppLayout><AgentCreator /></AppLayout></AuthGuard>
      </Route>
      <Route path={"/workflows"}>
        <AuthGuard><AppLayout><Workflows /></AppLayout></AuthGuard>
      </Route>
      <Route path={"/workflows/create"}>
        <AuthGuard><AppLayout><WorkflowCreator /></AppLayout></AuthGuard>
      </Route>
      <Route path={"/workflows/:id/configure"}>
        <AuthGuard><AppLayout><WorkflowConfigure /></AppLayout></AuthGuard>
      </Route>
      <Route path={"/my-workflow"}>
        <AuthGuard><AppLayout><MyWorkflow /></AppLayout></AuthGuard>
      </Route>
      <Route path={"/platforms"}>
        <AuthGuard><AppLayout><PlatformConnections /></AppLayout></AuthGuard>
      </Route>
      <Route path={"/settings/connections"}>
        <AdminGuard><AppLayout><PlatformConnections /></AppLayout></AdminGuard>
      </Route>
      <Route path={"/agent-workflows"}>
        <AuthGuard><AppLayout><AgentWorkflows /></AppLayout></AuthGuard>
      </Route>

      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

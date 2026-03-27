import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Wizard from "./pages/Wizard";
import Dashboard from "./pages/Dashboard";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import CookiePolicy from "./pages/Cookies";

// Admin pages
import AdminOverview from "./pages/admin/AdminOverview";
import AdminCases from "./pages/admin/AdminCases";
import AdminCaseDetail from "./pages/admin/AdminCaseDetail";
import AdminProviders from "./pages/admin/AdminProviders";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (!user.isAdmin) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/wizard" component={Wizard} />
      <Route path="/dashboard" component={Dashboard} />

      {/* Legal pages */}
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/cookies" component={CookiePolicy} />

      {/* Admin routes */}
      <Route path="/admin">
        {() => (
          <AdminGuard>
            <AdminOverview />
          </AdminGuard>
        )}
      </Route>
      <Route path="/admin/cases">
        {() => (
          <AdminGuard>
            <AdminCases />
          </AdminGuard>
        )}
      </Route>
      <Route path="/admin/cases/:id">
        {(params) => (
          <AdminGuard>
            <AdminCaseDetail id={params.id} />
          </AdminGuard>
        )}
      </Route>
      <Route path="/admin/providers">
        {() => (
          <AdminGuard>
            <AdminProviders />
          </AdminGuard>
        )}
      </Route>
      <Route path="/admin/settings">
        {() => (
          <AdminGuard>
            <AdminSettings />
          </AdminGuard>
        )}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

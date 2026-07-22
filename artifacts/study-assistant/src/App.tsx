import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { AppLayout } from '@/components/layout/app-layout';

import Home from '@/pages/index';
import Login from '@/pages/login';
import Dashboard from '@/pages/dashboard';
import Todos from '@/pages/todos';
import Summarize from '@/pages/summarize';
import Quiz from '@/pages/quiz';
import StudyPlan from '@/pages/study-plan';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function ProtectedRoutes() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/todos" component={Todos} />
        <Route path="/summarize" component={Summarize} />
        <Route path="/quiz" component={Quiz} />
        <Route path="/study-plan" component={StudyPlan} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      {/* Any route other than / and /login falls into ProtectedRoutes */}
      <Route path="/:rest*">
        <ProtectedRoutes />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Link } from "wouter";
import { format } from "date-fns";
import { 
  CheckSquare, 
  BrainCircuit, 
  CalendarDays, 
  FileText,
  TrendingUp,
  Clock,
  ArrowRight
} from "lucide-react";
import { useGetTodoStats, getGetTodoStatsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: stats, isLoading } = useGetTodoStats({
    query: { queryKey: getGetTodoStatsQueryKey() }
  });

  const today = new Date();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground">
          Welcome back.
        </h1>
        <p className="text-lg text-muted-foreground">
          Today is {format(today, 'EEEE, MMMM do')}. Ready to focus?
        </p>
      </header>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardHeader className="pb-2">
            <CardDescription className="text-primary-foreground/80 font-medium">Pending Tasks</CardDescription>
            <CardTitle className="text-4xl font-serif">
              {isLoading ? <Skeleton className="h-10 w-16 bg-primary-foreground/20" /> : stats?.pending ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              Completed
            </CardDescription>
            <CardTitle className="text-4xl font-serif text-foreground">
              {isLoading ? <Skeleton className="h-10 w-16" /> : stats?.completed ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-destructive" />
              High Priority
            </CardDescription>
            <CardTitle className="text-4xl font-serif text-foreground">
              {isLoading ? <Skeleton className="h-10 w-16" /> : stats?.highPriority ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="font-medium text-muted-foreground">Total Tasks</CardDescription>
            <CardTitle className="text-4xl font-serif text-foreground">
              {isLoading ? <Skeleton className="h-10 w-16" /> : stats?.total ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      {/* Quick Tools */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl">Study Tools</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/summarize">
            <Card className="hover-elevate cursor-pointer transition-all border-border hover:border-primary/50 group">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1 flex items-center gap-2">
                    Summarize Notes <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Distill long chapters or lecture transcripts into concise study guides.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/quiz">
            <Card className="hover-elevate cursor-pointer transition-all border-border hover:border-primary/50 group">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <BrainCircuit className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1 flex items-center gap-2">
                    Practice Quiz <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Test your knowledge. Generate active recall questions from your materials.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/study-plan">
            <Card className="hover-elevate cursor-pointer transition-all border-border hover:border-primary/50 group">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <CalendarDays className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1 flex items-center gap-2">
                    Study Planner <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Map out a personalized schedule to prepare for your next big exam.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/todos">
            <Card className="hover-elevate cursor-pointer transition-all border-border hover:border-primary/50 group">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <CheckSquare className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1 flex items-center gap-2">
                    Task List <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Manage your assignments and prioritize what needs your attention right now.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}

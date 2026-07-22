import { Link } from "wouter";
import { BrainCircuit, ArrowRight, Sparkles, BookOpen, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center selection:bg-primary/20">
      <header className="w-full max-w-6xl mx-auto p-6 flex justify-between items-center animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <span className="font-serif text-2xl tracking-tight text-primary">Athena</span>
        </div>
        <Button variant="outline" asChild className="font-medium border-primary/20 hover:bg-primary/5 hover:text-primary">
          <Link href="/login">
            Log in
          </Link>
        </Button>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center px-6 py-20 relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <Sparkles className="w-4 h-4 text-accent" />
          <span>Your AI-powered study hub</span>
        </div>
        
        <h1 className="font-serif text-6xl md:text-8xl tracking-tight text-foreground max-w-4xl leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          Focus deeper. <br/><span className="text-primary italic">Study smarter.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          A dedicated workspace for students. Organize your tasks, summarize complex notes, generate instant practice quizzes, and plan your study sessions with AI.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-400">
          <Button size="lg" asChild className="h-14 px-8 text-lg rounded-xl gap-2 hover-elevate shadow-lg shadow-primary/20 cursor-pointer">
            <Link href="/login">
              Get Started <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl text-left animate-in fade-in duration-1000 delay-500">
          <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-6">
              <CheckSquare className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-serif text-2xl mb-3 text-foreground">Task Tracking</h3>
            <p className="text-muted-foreground leading-relaxed">
              Keep track of assignments, essays, and exams. Tag them by subject and prioritize what matters.
            </p>
          </div>
          
          <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-6">
              <BrainCircuit className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-serif text-2xl mb-3 text-foreground">Active Recall</h3>
            <p className="text-muted-foreground leading-relaxed">
              Paste your lecture notes and instantly generate practice quizzes tailored to your difficulty level.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-6">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-serif text-2xl mb-3 text-foreground">Distill Knowledge</h3>
            <p className="text-muted-foreground leading-relaxed">
              Turn long textbook chapters into concise, readable summaries. Choose between detailed notes or quick bullets.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

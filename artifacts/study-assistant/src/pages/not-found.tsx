import { Link } from "wouter";
import { BrainCircuit, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-primary mb-8">
        <BrainCircuit className="h-8 w-8" />
      </div>
      
      <h1 className="font-serif text-6xl md:text-8xl tracking-tight text-primary mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Page not found</h2>
      
      <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
        The page you're looking for doesn't exist or has been moved. Let's get you back to your studies.
      </p>
      
      <Button asChild size="lg" className="h-12 px-8 gap-2">
        <Link href="/dashboard">
          <Home className="w-5 h-5 mr-2" />
          Return to Dashboard
        </Link>
      </Button>
    </div>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
import { BrainCircuit, Lock, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("demo");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      if (username === "demo" && password === "demo") {
        login();
        toast.success("Welcome back!");
        setLocation("/dashboard");
      } else {
        toast.error("Invalid credentials. Try demo/demo.");
      }
    }, 800);
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      
      <Card className="w-full max-w-md relative z-10 border-border shadow-xl animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="space-y-3 pb-8 pt-8 items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-2">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <CardTitle className="font-serif text-4xl">Log In to Athena</CardTitle>
          <CardDescription className="text-base">
            Enter your credentials to access your study space.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-9 h-12 bg-secondary/30"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 h-12 bg-secondary/30"
                  required
                />
              </div>
            </div>
            <div className="text-sm text-center text-muted-foreground pt-4">
              Hint: use <span className="font-mono bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">demo</span> / <span className="font-mono bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">demo</span>
            </div>
          </CardContent>
          <CardFooter className="pt-2 pb-8">
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-medium shadow-md shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

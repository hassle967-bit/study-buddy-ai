import { useState, useRef, useEffect } from "react";
import { CalendarDays, Sparkles, Map, Target, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useSSE } from "@/hooks/use-sse";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export default function StudyPlan() {
  const [subject, setSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState([2]);
  const [topics, setTopics] = useState("");
  
  const { data: plan, isStreaming, startStream, error } = useSSE("/api/ai/study-plan");
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !examDate) return;
    
    // Convert local date string back to ISO date for API
    const dateObj = new Date(examDate);
    
    startStream({ 
      subject, 
      examDate: dateObj.toISOString(), 
      hoursPerDay: hoursPerDay[0], 
      topics: topics || undefined 
    });
  };

  useEffect(() => {
    if (isStreaming && resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [plan, isStreaming]);

  // Today as minimum date for input
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarDays className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-serif text-4xl tracking-tight text-foreground">Study Planner</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Don't cram the night before. Let AI build a structured, day-by-day roadmap leading up to your exam.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="border-border shadow-sm lg:col-span-4 h-fit sticky top-6">
          <CardHeader className="bg-secondary/20 border-b border-border/50 pb-4">
            <CardTitle className="font-serif text-2xl flex items-center gap-2">
              <Map className="w-5 h-5 text-primary" />
              Exam Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subject" className="flex items-center gap-2 text-base">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  Subject / Exam Name
                </Label>
                <Input
                  id="subject"
                  placeholder="e.g. Organic Chemistry Final"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-background h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2 text-base">
                  <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  Exam Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  min={todayStr}
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="bg-background h-11"
                  required
                />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-base">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    Study Hours / Day
                  </Label>
                  <span className="font-mono font-bold text-primary">{hoursPerDay[0]}h</span>
                </div>
                <Slider
                  value={hoursPerDay}
                  onValueChange={setHoursPerDay}
                  max={12}
                  min={1}
                  step={1}
                  className="py-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topics" className="text-base flex justify-between items-center">
                  Specific Topics to Cover
                  <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded">Optional</span>
                </Label>
                <Textarea
                  id="topics"
                  placeholder="e.g. Krebs cycle, nomenclature, stereochemistry..."
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                  className="resize-none min-h-[100px] bg-background text-sm"
                />
              </div>

              <Button 
                type="submit" 
                disabled={!subject || !examDate || isStreaming}
                className="w-full h-12 text-lg shadow-md shadow-primary/20 hover-elevate"
              >
                {isStreaming ? (
                  <><Sparkles className="w-4 h-4 mr-2 animate-spin text-accent" /> Generating Plan...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> Generate Study Plan</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm lg:col-span-8 flex flex-col min-h-[600px] bg-card overflow-hidden">
          <div className="bg-primary px-6 py-4 flex items-center justify-between shrink-0">
            <h3 className="font-serif text-xl text-primary-foreground m-0">Your Roadmap</h3>
            {examDate && (
              <div className="text-primary-foreground/80 text-sm font-medium">
                Target: {format(new Date(examDate), 'MMMM do, yyyy')}
              </div>
            )}
          </div>
          
          <CardContent className="flex-1 p-0 relative">
            <div 
              ref={resultRef}
              className="absolute inset-0 overflow-y-auto p-6 md:p-10"
            >
              {error ? (
                <div className="flex items-start gap-3 text-destructive bg-destructive/10 p-6 rounded-xl border border-destructive/20">
                  <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-lg mb-1">Failed to generate plan</p>
                    <p>{error}</p>
                  </div>
                </div>
              ) : plan ? (
                <div className="prose prose-slate max-w-none prose-headings:font-serif prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-10 prose-h2:text-primary prose-h2:border-b prose-h2:border-border prose-h2:pb-2 prose-ul:my-2 prose-li:my-1 prose-p:leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: formatPlanMarkdown(plan) }} />
                  {isStreaming && (
                    <span className="inline-block w-2 h-5 bg-primary ml-2 animate-pulse align-middle" />
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 max-w-md mx-auto text-center">
                  <Map className="h-16 w-16 mb-6 text-muted-foreground/30" />
                  <h3 className="font-serif text-2xl text-foreground mb-2">No plan generated yet</h3>
                  <p>Fill out the details on the left and hit generate to create your personalized study schedule.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function formatPlanMarkdown(text: string) {
  if (!text) return "";
  
  return text
    // Replace headings
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Bullet lists
    .replace(/^\s*[-*] (.*)/gim, '<ul><li>$1</li></ul>')
    // Fix multiple ul tags back to back
    .replace(/<\/ul>\n<ul>/g, '\n')
    // Day formatting (e.g. Day 1: or Week 1:)
    .replace(/^(Day \d+:|Week \d+:)/gim, '<strong class="text-primary text-lg block mt-6 mb-2">$1</strong>')
    // Paragraphs
    .split('\n\n').map(p => {
      if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<strong')) return p;
      return `<p>${p}</p>`;
    }).join('\n')
    // Single newlines
    .replace(/\n/g, '<br/>');
}

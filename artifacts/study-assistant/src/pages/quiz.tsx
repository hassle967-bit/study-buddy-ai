import { useState, useRef, useEffect } from "react";
import { BrainCircuit, Sparkles, CheckCircle2, RotateCcw } from "lucide-react";
import { useSSE } from "@/hooks/use-sse";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function Quiz() {
  const [notes, setNotes] = useState("");
  const [numQuestions, setNumQuestions] = useState([5]);
  const [difficulty, setDifficulty] = useState("medium");
  const [isQuizMode, setIsQuizMode] = useState(false);
  
  const { data: rawQuizData, isStreaming, startStream, error, setData } = useSSE("/api/ai/quiz");
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (!notes.trim()) return;
    setIsQuizMode(true);
    setData("");
    startStream({ notes, numQuestions: numQuestions[0], difficulty });
  };

  const handleReset = () => {
    setIsQuizMode(false);
    setData("");
  };

  useEffect(() => {
    if (isStreaming && resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [rawQuizData, isStreaming]);

  // Try to parse the complete JSON if streaming is done
  let parsedQuiz = null;
  if (!isStreaming && rawQuizData) {
    try {
      // The API returns markdown formatted text, typically with questions and answers
      // We'll just render it as markdown for now unless we can parse it
    } catch (e) {
      // It's just text
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <BrainCircuit className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-serif text-4xl tracking-tight text-foreground">Quiz Generator</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Active recall is the most effective way to learn. Paste your notes to instantly generate practice questions.
        </p>
      </header>

      {!isQuizMode ? (
        <Card className="border-border shadow-md max-w-3xl">
          <CardHeader className="pb-4 border-b border-border/50 bg-secondary/10">
            <CardTitle className="font-serif text-2xl">Generate New Quiz</CardTitle>
            <CardDescription>Configure your practice session</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="notes" className="text-base">Study Material</Label>
                <Badge variant="outline" className="font-mono text-xs">{notes.length} chars</Badge>
              </div>
              <Textarea
                id="notes"
                placeholder="Paste the notes, transcript, or chapter you want to be quizzed on..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[200px] resize-none bg-background text-base leading-relaxed p-4"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Number of Questions</Label>
                  <span className="font-mono font-medium text-primary">{numQuestions[0]}</span>
                </div>
                <Slider
                  value={numQuestions}
                  onValueChange={setNumQuestions}
                  max={20}
                  min={1}
                  step={1}
                  className="py-2"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base">Difficulty Level</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="bg-background h-10">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy (Definitions & Concepts)</SelectItem>
                    <SelectItem value="medium">Medium (Application & Examples)</SelectItem>
                    <SelectItem value="hard">Hard (Analysis & Synthesis)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={!notes.trim()}
              className="w-full h-14 text-lg font-medium shadow-md shadow-primary/20 hover-elevate gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Generate Quiz
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-background text-sm py-1 border-primary/20 text-primary">
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Mode
              </Badge>
              {isStreaming && (
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Sparkles className="w-3 h-3 animate-spin text-accent" />
                  Generating...
                </span>
              )}
            </div>
            <Button variant="ghost" onClick={handleReset} className="gap-2">
              <RotateCcw className="w-4 h-4" /> Start Over
            </Button>
          </div>

          <Card className="border-border shadow-md overflow-hidden bg-card">
            <div 
              ref={resultRef}
              className="max-h-[70vh] overflow-y-auto p-8 sm:p-12 prose prose-slate max-w-none prose-headings:font-serif prose-h3:text-primary prose-li:my-1 prose-p:leading-relaxed"
            >
              {error ? (
                <div className="text-destructive bg-destructive/10 p-6 rounded-lg border border-destructive/20 text-center">
                  <p className="font-semibold text-lg mb-2">Error generating quiz</p>
                  <p>{error}</p>
                  <Button variant="outline" onClick={handleReset} className="mt-4">Try Again</Button>
                </div>
              ) : rawQuizData ? (
                <div>
                  <div dangerouslySetInnerHTML={{ __html: formatQuizMarkdown(rawQuizData) }} />
                  {isStreaming && (
                    <span className="inline-block w-3 h-5 bg-primary ml-1 animate-pulse align-middle" />
                  )}
                  {!isStreaming && (
                    <div className="mt-12 pt-8 border-t border-border flex flex-col items-center text-center">
                      <CheckCircle2 className="w-12 h-12 text-primary mb-4" />
                      <h3 className="font-serif text-2xl m-0 mb-2">Quiz Completed!</h3>
                      <p className="text-muted-foreground m-0 mb-6">Review your answers and try again when you're ready.</p>
                      <Button onClick={handleReset} size="lg" className="gap-2">
                        <RotateCcw className="w-4 h-4" /> Create Another Quiz
                      </Button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function formatQuizMarkdown(text: string) {
  if (!text) return "";
  
  return text
    // Replace headings
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Numbered lists (questions)
    .replace(/^\d+\. (.*)/gim, '<h3 class="mt-8 mb-4">$1</h3>')
    // Lettered lists (answers)
    .replace(/^\s*([A-D])\) (.*)/gim, '<div class="pl-4 py-2 my-2 border border-border rounded-md bg-secondary/10 hover:bg-secondary/30 transition-colors"><span class="font-bold mr-2 text-primary">$1)</span> $2</div>')
    // Answers/Explanations
    .replace(/Answer: (.*)/gim, '<div class="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg text-sm"><strong>Answer:</strong> $1</div>')
    // Paragraphs
    .split('\n\n').map(p => {
      if (p.startsWith('<h') || p.startsWith('<div')) return p;
      return `<p>${p}</p>`;
    }).join('\n')
    // Single newlines
    .replace(/\n/g, '');
}

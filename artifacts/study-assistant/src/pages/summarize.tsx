import { useState, useRef, useEffect } from "react";
import { FileText, Sparkles, Wand2, Copy, CheckCircle2 } from "lucide-react";
import { useSSE } from "@/hooks/use-sse";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function Summarize() {
  const [notes, setNotes] = useState("");
  const [style, setStyle] = useState("bullet-points");
  const [copied, setCopied] = useState(false);
  
  const { data: summary, isStreaming, startStream, error } = useSSE("/api/ai/summarize");
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (!notes.trim()) return;
    startStream({ notes, style });
  };

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Auto-scroll to bottom of summary while streaming
  useEffect(() => {
    if (isStreaming && resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [summary, isStreaming]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-serif text-4xl tracking-tight text-foreground">AI Summarizer</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Paste your messy lecture notes, transcripts, or textbook chapters and let AI distill them.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border shadow-sm flex flex-col h-[600px]">
          <CardHeader className="pb-4 shrink-0">
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl font-serif">Source Notes</span>
              <Badge variant="secondary" className="font-mono text-xs">
                {notes.length} chars
              </Badge>
            </CardTitle>
            <CardDescription>Paste your raw text here.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 pb-6 min-h-0">
            <Textarea
              placeholder="Paste your notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="flex-1 resize-none bg-background focus-visible:ring-primary border-muted font-sans text-base leading-relaxed p-4"
            />
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2 shrink-0">
              <div className="flex-1">
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Output Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bullet-points">Bullet Points</SelectItem>
                    <SelectItem value="concise">Concise Paragraph</SelectItem>
                    <SelectItem value="detailed">Detailed Study Guide</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleGenerate} 
                disabled={!notes.trim() || isStreaming}
                className="gap-2 sm:w-auto w-full px-8 shadow-sm shadow-primary/20 hover-elevate"
              >
                {isStreaming ? (
                  <Sparkles className="w-4 h-4 animate-spin text-accent" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
                {isStreaming ? "Summarizing..." : "Summarize"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm flex flex-col h-[600px] bg-secondary/10">
          <CardHeader className="pb-4 shrink-0 border-b border-border/50 bg-card">
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl font-serif text-primary">Summary</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCopy}
                disabled={!summary}
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
                title="Copy to clipboard"
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden relative">
            <div 
              ref={resultRef}
              className="absolute inset-0 overflow-y-auto p-6 prose prose-slate max-w-none prose-headings:font-serif prose-p:leading-relaxed"
            >
              {error ? (
                <div className="text-destructive bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                  <p className="font-semibold mb-1">Error generating summary:</p>
                  <p className="text-sm">{error}</p>
                </div>
              ) : summary ? (
                <div dangerouslySetInnerHTML={{ __html: formatOutput(summary) }} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                  <Sparkles className="h-12 w-12 mb-4 text-muted-foreground/30" />
                  <p>Your summary will appear here</p>
                </div>
              )}
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Simple markdown to HTML formatter for the streaming response
function formatOutput(text: string) {
  if (!text) return "";
  
  return text
    // Replace headings (### Heading)
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold (**text**)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Bullet lists (- item or * item)
    .replace(/^\s*[-*] (.*)/gim, '<ul><li>$1</li></ul>')
    // Fix multiple ul tags back to back
    .replace(/<\/ul>\n<ul>/g, '\n')
    // Paragraphs (double newlines)
    .split('\n\n').map(p => {
      if (p.startsWith('<h') || p.startsWith('<ul>')) return p;
      return `<p>${p}</p>`;
    }).join('\n')
    // Single newlines to br
    .replace(/\n/g, '<br/>');
}

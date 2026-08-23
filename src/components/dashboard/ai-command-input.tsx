"use client";

import React, { useState } from "react";
import { Sparkles, Terminal, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

export function AICommandInput() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const suggestedQueries = [
    "Identify top 10 at-risk customers",
    "Forecast next month's cash flow",
    "Which products have excess inventory?"
  ];

  const handleSubmit = async (queryToSubmit: string = question) => {
    if (!queryToSubmit.trim()) return;
    
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: queryToSubmit }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch AI response");
      }

      setResponse(data.response);
      setQuestion("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border bg-card/80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="size-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Ask Nexa AI</CardTitle>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
            Powered by Gemini 2.5 Flash
          </span>
        </div>
        <CardDescription>
          Ask questions about your sales, customers, or inventory using plain English.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="e.g., What was our best-selling product last Friday?"
            className="flex-1 font-mono text-xs bg-muted/30"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={loading}
          />
          <Button 
            size="sm" 
            className="gap-1.5 text-xs shrink-0" 
            onClick={() => handleSubmit()} 
            disabled={loading}
          >
            {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
            <span>{loading ? "Analyzing..." : "Generate Insight"}</span>
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground">Suggested Queries:</span>
          {suggestedQueries.map((query) => (
            <button 
              key={query}
              onClick={() => {
                setQuestion(query);
                handleSubmit(query);
              }}
              disabled={loading}
              className="rounded border border-border px-2 py-0.5 hover:bg-muted transition-colors disabled:opacity-50 text-left"
            >
              {query}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
            <AlertCircle className="size-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {response && (
          <div className="mt-4 p-4 rounded-md border border-border bg-muted/20">
            <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed">
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

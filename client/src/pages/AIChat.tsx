/**
 * AI Chat Interface - MarketInsight Style
 *
 * Features:
 * - Real-time streaming responses
 * - Conversational UI with message history
 * - RAG-powered knowledge base access
 * - Multi-agent tool selection
 * - Export conversation to PDF/Markdown
 * - Voice input support (future)
 *
 * Use Cases:
 * - Quick marketing questions
 * - Strategy brainstorming
 * - Campaign analysis
 * - Competitor research
 */

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, FileText, Download, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Card } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { useToast } from "../hooks/use-toast";
import { api } from "../lib/api";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokens?: number;
    sources?: string[];
  };
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "system",
      content:
        "👋 Bonjour ! Je suis votre assistant marketing IA. Posez-moi vos questions sur le marketing, les stratégies de croissance, l'analyse de campagnes, etc. J'ai accès à une base de connaissances de best practices marketing.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingMessage]);

  // Send message
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setStreamingMessage("");

    try {
      // Call AI chat endpoint with streaming
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          history: messages.slice(-5), // Last 5 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  fullResponse += parsed.content;
                  setStreamingMessage(fullResponse);
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }
      }

      // Add completed message
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: fullResponse,
        timestamp: new Date(),
        metadata: {
          model: "gemini-flash",
          tokens: fullResponse.length,
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingMessage("");
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat
  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "system",
        content:
          "👋 Conversation réinitialisée. Comment puis-je vous aider ?",
        timestamp: new Date(),
      },
    ]);
    toast({
      title: "Conversation effacée",
      description: "L'historique a été réinitialisé.",
    });
  };

  // Export chat to markdown
  const handleExportChat = () => {
    const markdown = messages
      .filter((m) => m.role !== "system")
      .map((m) => {
        const role = m.role === "user" ? "Vous" : "Assistant";
        const time = m.timestamp.toLocaleTimeString("fr-FR");
        return `### ${role} (${time})\n\n${m.content}\n\n---\n`;
      })
      .join("\n");

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exporté",
      description: "Conversation exportée en Markdown",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Assistant Marketing IA
            </h1>
            <p className="text-sm text-gray-500">
              Propulsé par RAG + 48 agents IA spécialisés
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportChat}
            disabled={messages.length <= 1}
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            disabled={messages.length <= 1}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Effacer
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-6 py-4" ref={scrollRef}>
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <Card
                className={`max-w-[80%] p-4 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : message.role === "system"
                    ? "bg-gray-100 text-gray-700 border-gray-200"
                    : "bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="prose prose-sm max-w-none">
                      {message.content.split("\n").map((line, i) => (
                        <p key={i} className="mb-2">
                          {line}
                        </p>
                      ))}
                    </div>
                    {message.metadata && (
                      <div className="text-xs opacity-70 mt-2">
                        {message.metadata.model && (
                          <span className="mr-3">
                            Model: {message.metadata.model}
                          </span>
                        )}
                        {message.metadata.tokens && (
                          <span>Tokens: {message.metadata.tokens}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ))}

          {/* Streaming message */}
          {streamingMessage && (
            <div className="flex justify-start">
              <Card className="max-w-[80%] p-4 bg-white">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="prose prose-sm max-w-none">
                      {streamingMessage}
                      <span className="inline-block w-2 h-4 bg-blue-600 ml-1 animate-pulse" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && !streamingMessage && (
            <div className="flex justify-start">
              <Card className="max-w-[80%] p-4 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-white border-t px-6 py-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Posez votre question marketing... (Shift+Enter pour nouvelle ligne)"
            className="flex-1 min-h-[60px] max-h-[200px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>

        {/* Example questions */}
        {messages.length <= 1 && (
          <div className="max-w-4xl mx-auto mt-4">
            <p className="text-sm text-gray-500 mb-2">
              Questions d'exemple :
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Comment améliorer mon taux de conversion ?",
                "Stratégie LinkedIn pour B2B ?",
                "Analyser une campagne Google Ads",
                "Best practices pour email marketing",
              ].map((example) => (
                <Button
                  key={example}
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(example)}
                  className="text-xs"
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

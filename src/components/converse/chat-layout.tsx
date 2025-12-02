"use client";

import React, { useState, useCallback } from "react";
import { Header } from "@/components/converse/header";
import { ChatMessages } from "@/components/converse/chat-messages";
import { ChatInputForm } from "@/components/converse/chat-input-form";
import type { Message } from "@/lib/types";
import { getAiResponse, getFeedback, getSummary } from "@/app/actions";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const conversationHistory = [...messages, userMessage]
          .map((msg) => `${msg.role}: ${msg.content}`)
          .join("\n");

        const aiResponse = await getAiResponse({
          text: content,
          conversationHistory,
        });

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: aiResponse.response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error("Error getting AI response:", error);
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  const handleGetFeedback = useCallback(async (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message || message.role !== "user") return;

    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, isFeedbackLoading: true } : m
      )
    );

    try {
      const feedbackResponse = await getFeedback({ text: message.content });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, feedback: feedbackResponse.feedback }
            : m
        )
      );
    } catch (error) {
      console.error("Error getting feedback:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, feedback: "Sorry, could not get feedback." }
            : m
        )
      );
    } finally {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, isFeedbackLoading: false } : m
        )
      );
    }
  }, [messages]);

  const handleGetSummary = useCallback(async () => {
    const conversationHistory = messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");
    
    try {
      const summaryResponse = await getSummary({ conversationHistory });
      setSummary(summaryResponse.summary);
      setIsSummaryOpen(true);
    } catch (error) {
      console.error("Error getting summary:", error);
      setSummary("Sorry, could not generate a summary.");
      setIsSummaryOpen(true);
    }
  }, [messages]);

  return (
    <div className="flex h-screen w-full flex-col items-center bg-background p-4">
      <div className="flex h-full w-full max-w-4xl flex-col">
        <Header onSummarize={handleGetSummary} />
        <Card className="flex flex-1 flex-col overflow-hidden">
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            onGetFeedback={handleGetFeedback}
          />
          <ChatInputForm onSendMessage={handleSendMessage} isLoading={isLoading} />
        </Card>
      </div>
      <AlertDialog open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conversation Summary</AlertDialogTitle>
            <AlertDialogDescription>
              {summary || "Loading summary..."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsSummaryOpen(false)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

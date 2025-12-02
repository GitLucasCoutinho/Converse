"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Header } from "@/components/converse/header";
import { ChatMessages } from "@/components/converse/chat-messages";
import { ChatInputForm } from "@/components/converse/chat-input-form";
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
import type { Message, Conversation } from "@/lib/types";
import { ChatHistory } from "./chat-history";


const initialMessage: Message = {
  id: "1",
  role: "assistant",
  content: "Hello! How can I help you today?",
  translation: "Olá! Como posso te ajudar hoje?",
};


export function ChatLayout() {
  const [conversations, setConversations] = useState<Record<string, Conversation>>({});
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  useEffect(() => {
    const savedConversations = localStorage.getItem("conversations");
    if (savedConversations) {
      const parsedConversations = JSON.parse(savedConversations);
      setConversations(parsedConversations);
      const conversationIds = Object.keys(parsedConversations);
      if (conversationIds.length > 0) {
        setCurrentConversationId(conversationIds[0]);
      } else {
        handleNewChat();
      }
    } else {
      handleNewChat();
    }
  }, []);

  useEffect(() => {
    if (Object.keys(conversations).length > 0) {
      localStorage.setItem("conversations", JSON.stringify(conversations));
    }
  }, [conversations]);

  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newConversation: Conversation = {
      id: newId,
      title: "New Chat",
      messages: [initialMessage],
    };
    setConversations((prev) => ({ ...prev, [newId]: newConversation }));
    setCurrentConversationId(newId);
  };

  const handleDeleteChat = (conversationId: string) => {
    setConversations((prev) => {
      const newConversations = { ...prev };
      delete newConversations[conversationId];
      return newConversations;
    });
    if (currentConversationId === conversationId) {
      const conversationIds = Object.keys(conversations).filter(id => id !== conversationId);
      if (conversationIds.length > 0) {
        setCurrentConversationId(conversationIds[0]);
      } else {
        handleNewChat();
      }
    }
  };

  const handleSelectChat = (conversationId: string) => {
    setCurrentConversationId(conversationId);
  };

  const currentMessages = currentConversationId ? conversations[currentConversationId]?.messages : [];

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !currentConversationId) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
      };
      
      const isFirstUserMessage = currentMessages.filter(m => m.role === 'user').length === 0;

      const updatedConversations = { ...conversations };
      const updatedMessages = [...(updatedConversations[currentConversationId]?.messages || []), userMessage];
      updatedConversations[currentConversationId] = {
        ...updatedConversations[currentConversationId],
        id: currentConversationId,
        title: isFirstUserMessage ? content.substring(0, 30) : updatedConversations[currentConversationId].title,
        messages: updatedMessages,
      };

      setConversations(updatedConversations);
      setIsLoading(true);

      try {
        const conversationHistory = updatedMessages
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
          translation: aiResponse.translation,
        };
        
        setConversations(prev => {
          const finalConversations = {...prev};
          const finalMessages = [...updatedMessages, assistantMessage];
          finalConversations[currentConversationId] = {
            ...finalConversations[currentConversationId],
            messages: finalMessages
          }
          return finalConversations;
        });

      } catch (error) {
        console.error("Error getting AI response:", error);
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          translation: "Desculpe, encontrei um erro. Por favor, tente novamente.",
        };
        setConversations(prev => {
          const errorConversations = {...prev};
          const errorMessages = [...updatedMessages, errorMessage];
          errorConversations[currentConversationId] = {
            ...errorConversations[currentConversationId],
            messages: errorMessages
          }
          return errorConversations;
        });
      } finally {
        setIsLoading(false);
      }
    },
    [currentConversationId, conversations, currentMessages]
  );

  const handleGetFeedback = useCallback(async (messageId: string) => {
    if (!currentConversationId) return;
    const message = conversations[currentConversationId]?.messages.find((m) => m.id === messageId);
    if (!message || message.role !== "user") return;

    const updatedConversations = { ...conversations };
    updatedConversations[currentConversationId].messages = updatedConversations[currentConversationId].messages.map((m) =>
      m.id === messageId ? { ...m, isFeedbackLoading: true } : m
    );
    setConversations(updatedConversations);

    try {
      const feedbackResponse = await getFeedback({ text: message.content });
       setConversations(prev => {
          const feedbackConversations = {...prev};
          feedbackConversations[currentConversationId].messages = feedbackConversations[currentConversationId].messages.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  feedback: feedbackResponse.feedback,
                  feedbackTranslation: feedbackResponse.translation,
                  isFeedbackLoading: false,
                }
              : m
          );
          return feedbackConversations;
       });
    } catch (error) {
      console.error("Error getting feedback:", error);
      setConversations(prev => {
        const errorConversations = {...prev};
        errorConversations[currentConversationId].messages = errorConversations[currentConversationId].messages.map((m) =>
          m.id === messageId
            ? { ...m, feedback: "Sorry, could not get feedback.", isFeedbackLoading: false }
            : m
        );
        return errorConversations;
      });
    }
  }, [currentConversationId, conversations]);

  const handleGetSummary = useCallback(async () => {
    if (!currentConversationId) return;

    const conversationHistory = conversations[currentConversationId]?.messages
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
  }, [currentConversationId, conversations]);

  return (
    <div className="flex h-full w-full gap-4">
      <ChatHistory 
        conversations={Object.values(conversations)}
        currentConversationId={currentConversationId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />
      <div className="flex h-full w-full flex-col flex-1">
        <Header onSummarize={handleGetSummary} />
        <Card className="flex flex-1 flex-col overflow-hidden">
          <ChatMessages
            messages={currentMessages || []}
            isLoading={isLoading}
            onGetFeedback={handleGetFeedback}
          />
          <ChatInputForm onSendMessage={handleSendMessage} isLoading={isLoading} />
        </Card>
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
    </div>
  );
}

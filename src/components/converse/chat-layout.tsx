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
import { useUser } from "@/hooks/use-user";


const initialMessage: Message = {
  id: "1",
  role: "assistant",
  content: "Hello! How can I help you today?",
  translation: "Olá! Como posso te ajudar hoje?",
};


export function ChatLayout() {
  const { user } = useUser();
  const [conversations, setConversations] = useState<Record<string, Conversation>>({});
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  
  const isLoggedIn = !!user;

  useEffect(() => {
    if (isLoggedIn) {
        // TODO: Load from cloud
        console.log("User is logged in, should load from cloud.");
        setConversations({});
        setCurrentConversationId(null);
        handleNewChat(); // Start a new chat for logged-in user
        return;
    }

    const savedConversations = localStorage.getItem("conversations");
    if (savedConversations) {
      try {
        const parsedConversations = JSON.parse(savedConversations);
        setConversations(parsedConversations);
        const conversationIds = Object.keys(parsedConversations);
        if (conversationIds.length > 0) {
          // Sort by ID (timestamp) to get the most recent one
          const sortedIds = conversationIds.sort((a, b) => Number(b) - Number(a));
          setCurrentConversationId(sortedIds[0]);
        } else {
          handleNewChat();
        }
      } catch (error) {
        console.error("Failed to parse conversations from localStorage", error);
        handleNewChat();
      }
    } else {
      handleNewChat();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
        // Don't save to local storage if logged in, clear it
        localStorage.removeItem("conversations");
        return;
    };
    if (Object.keys(conversations).length > 0) {
      localStorage.setItem("conversations", JSON.stringify(conversations));
    } else {
      // If there are no conversations, clear localStorage
      localStorage.removeItem("conversations");
    }
  }, [conversations, isLoggedIn]);

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
      const remainingIds = Object.keys(conversations).filter(id => id !== conversationId);
      if (remainingIds.length > 0) {
        const sortedIds = remainingIds.sort((a, b) => Number(b) - Number(a));
        setCurrentConversationId(sortedIds[0]);
      } else {
        handleNewChat();
      }
    }
  };

  const handleSelectChat = (conversationId: string) => {
    setCurrentConversationId(conversationId);
  };

  const handleImportConversations = (importedConversations: Record<string, Conversation>) => {
    setConversations(importedConversations);
    const conversationIds = Object.keys(importedConversations);
    if (conversationIds.length > 0) {
      const sortedIds = conversationIds.sort((a, b) => Number(b) - Number(a));
      setCurrentConversationId(sortedIds[0]);
    }
  };

  const currentMessages = (currentConversationId && conversations[currentConversationId]?.messages) || [];

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !currentConversationId) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
      };
      
      const currentConvo = conversations[currentConversationId];
      if (!currentConvo) return;

      const isFirstUserMessage = currentConvo.messages.filter(m => m.role === 'user').length === 0;

      const updatedMessages = [...currentConvo.messages, userMessage];

      setConversations(prev => ({
        ...prev,
        [currentConversationId]: {
          ...currentConvo,
          title: isFirstUserMessage ? content.substring(0, 30) : currentConvo.title,
          messages: updatedMessages,
        }
      }));
      
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
          const finalConvo = prev[currentConversationId];
          const finalMessages = [...updatedMessages, assistantMessage];
          return {
            ...prev,
            [currentConversationId]: {
              ...finalConvo,
              messages: finalMessages,
            },
          };
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
          const errorConvo = prev[currentConversationId];
          const errorMessages = [...updatedMessages, errorMessage];
          return {
            ...prev,
            [currentConversationId]: {
              ...errorConvo,
              messages: errorMessages
            },
          };
        });
      } finally {
        setIsLoading(false);
      }
    },
    [currentConversationId, conversations]
  );

  const handleGetFeedback = useCallback(async (messageId: string) => {
    if (!currentConversationId || !conversations[currentConversationId]) return;
    
    const message = conversations[currentConversationId].messages.find((m) => m.id === messageId);
    if (!message || message.role !== "user") return;

    setConversations(prev => ({
      ...prev,
      [currentConversationId]: {
        ...prev[currentConversationId],
        messages: prev[currentConversationId].messages.map((m) =>
          m.id === messageId ? { ...m, isFeedbackLoading: true } : m
        ),
      },
    }));

    try {
      const feedbackResponse = await getFeedback({ text: message.content });
       setConversations(prev => ({
          ...prev,
          [currentConversationId]: {
            ...prev[currentConversationId],
            messages: prev[currentConversationId].messages.map((m) =>
              m.id === messageId
                ? {
                    ...m,
                    feedback: feedbackResponse.feedback,
                    feedbackTranslation: feedbackResponse.translation,
                    isFeedbackLoading: false,
                  }
                : m
            ),
          },
       }));
    } catch (error) {
      console.error("Error getting feedback:", error);
      setConversations(prev => ({
        ...prev,
        [currentConversationId]: {
          ...prev[currentConversationId],
          messages: prev[currentConversationId].messages.map((m) =>
            m.id === messageId
              ? { ...m, feedback: "Sorry, could not get feedback.", isFeedbackLoading: false }
              : m
          ),
        },
      }));
    }
  }, [currentConversationId, conversations]);

  const handleGetSummary = useCallback(async () => {
    if (!currentConversationId || !conversations[currentConversationId]) return;

    const conversationHistory = conversations[currentConversationId].messages
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

  const handleLogin = () => {
    // This is now handled by the auth state change
    console.log("Logged in!");
  };
  const handleLogout = () => {
    // This is now handled by the auth state change
    console.log("Logged out!");
  };


  return (
    <div className="flex h-full w-full gap-4">
      <ChatHistory 
        conversations={Object.values(conversations)}
        currentConversationId={currentConversationId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onImport={handleImportConversations}
        isLoggedIn={isLoggedIn}
      />
      <div className="flex h-full w-full flex-col flex-1">
        <Header 
            onSummarize={handleGetSummary}
            onLogin={handleLogin}
            onLogout={handleLogout}
        />
        <Card className="flex flex-1 flex-col overflow-hidden">
          <ChatMessages
            messages={currentMessages}
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

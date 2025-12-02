"use client";

import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/converse/chat-message";
import type { Message } from "@/lib/types";

type ChatMessagesProps = {
  messages: Message[];
  isLoading: boolean;
  onGetFeedback: (messageId: string) => void;
};

export function ChatMessages({
  messages,
  isLoading,
  onGetFeedback,
}: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onGetFeedback={onGetFeedback}
            />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 self-start animate-in fade-in duration-300">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary/50 [animation-delay:-0.3s]"></div>
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary/50 [animation-delay:-0.15s]"></div>
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary/50"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}

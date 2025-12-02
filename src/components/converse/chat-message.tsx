"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Bot, Loader, Mic, Sparkles, User, Volume2 } from "lucide-react";
import type { Message } from "@/lib/types";
import { ConverseIcon } from "./icons";

type ChatMessageProps = {
  message: Message;
  onGetFeedback: (messageId: string) => void;
};

export function ChatMessage({ message, onGetFeedback }: ChatMessageProps) {
  const handleTextToSpeech = () => {
    if ("speechSynthesis" in window && message.role === "assistant") {
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        isUser ? "justify-end" : "justify-start",
        "animate-chat-message"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 border">
          <div className="flex h-full w-full items-center justify-center bg-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-sm rounded-lg p-3 lg:max-w-md",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        
        {message.feedback && (
          <div className="mt-2 border-t border-muted-foreground/20 pt-2 text-sm">
             <p className="font-semibold mb-1">Feedback:</p>
             <p className="italic">{message.feedback}</p>
          </div>
        )}

        <div className="mt-2 flex items-center gap-2">
          {!isUser && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-muted-foreground hover:bg-background/50"
              onClick={handleTextToSpeech}
              aria-label="Read message aloud"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          )}
          {isUser && !message.feedback && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-primary-foreground/80 hover:bg-primary/80"
              onClick={() => onGetFeedback(message.id)}
              disabled={message.isFeedbackLoading}
              aria-label="Get feedback"
            >
              {message.isFeedbackLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 border">
          <div className="flex h-full w-full items-center justify-center bg-accent">
            <User className="h-5 w-5 text-accent-foreground" />
          </div>
        </Avatar>
      )}
    </div>
  );
}

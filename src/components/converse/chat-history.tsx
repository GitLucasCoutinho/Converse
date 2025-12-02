"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Conversation } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MessageSquarePlus, Trash2 } from "lucide-react";

type ChatHistoryProps = {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
};

export function ChatHistory({
  conversations,
  currentConversationId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: ChatHistoryProps) {

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteChat(id);
  }

  return (
    <Card className="h-full w-full max-w-xs flex-col p-2 hidden lg:flex">
      <Button variant="outline" className="mb-2" onClick={onNewChat}>
        <MessageSquarePlus className="mr-2" />
        New Chat
      </Button>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 pr-2">
          {conversations.map((convo) => (
            <div
              key={convo.id}
              className={cn(
                "group flex cursor-pointer items-center justify-between rounded-md p-2 text-sm font-medium hover:bg-accent",
                currentConversationId === convo.id && "bg-accent"
              )}
              onClick={() => onSelectChat(convo.id)}
            >
              <span className="truncate">{convo.title}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={(e) => handleDelete(e, convo.id)}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

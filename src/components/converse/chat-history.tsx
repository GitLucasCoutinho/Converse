"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Conversation } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MessageSquarePlus, Trash2, Download, Upload, Save, FolderDown, Loader } from "lucide-react";
import React, { useRef } from "react";
import { useUser } from "@/hooks/use-user";

type ChatHistoryProps = {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onImport: (conversations: Record<string, Conversation>) => void;
};

export function ChatHistory({
  conversations,
  currentConversationId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onImport,
}: ChatHistoryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, isLoading } = useUser();
  const isLoggedIn = !!user;

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteChat(id);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(conversations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = 'conversations.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === 'string') {
            const importedData = JSON.parse(content);
            // Support both array and object formats for import
            let importedConversations: Record<string, Conversation>;
            if (Array.isArray(importedData)) {
              importedConversations = importedData.reduce((acc, convo) => {
                if (convo.id) {
                  acc[convo.id] = convo;
                }
                return acc;
              }, {} as Record<string, Conversation>);
            } else if (typeof importedData === 'object' && importedData !== null) {
              importedConversations = importedData;
            } else {
               alert('Invalid file format.');
               return;
            }
            onImport(importedConversations);
          }
        } catch (error) {
          console.error("Error parsing imported file:", error);
          alert('Failed to import conversations. The file might be corrupted or in the wrong format.');
        }
      };
      reader.readAsText(file);
    }
    // Reset file input
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };


  return (
    <Card className="h-full w-full max-w-xs flex-col p-2 hidden lg:flex">
      <div className="grid grid-cols-3 gap-2 mb-2">
        <Button variant="outline" onClick={onNewChat} className="col-span-1">
          <MessageSquarePlus />
        </Button>
        {isLoading ? (
            <div className="col-span-2 flex items-center justify-center">
                <Loader className="animate-spin" />
            </div>
        ) : isLoggedIn ? (
          <>
            <Button variant="outline" className="col-span-1" disabled>
                <FolderDown />
            </Button>
            <Button variant="outline" className="col-span-1" disabled>
                <Save />
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={handleImportClick} className="col-span-1">
              <Upload />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="application/json"
              onChange={handleFileChange}
            />
            <Button variant="outline" onClick={handleExport} className="col-span-1">
              <Download />
            </Button>
          </>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 pr-2">
          {Object.values(conversations).map((convo) => (
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

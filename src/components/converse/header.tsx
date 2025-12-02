"use client";

import { Button } from "@/components/ui/button";
import { ConverseIcon } from "@/components/converse/icons";
import { BotMessageSquare } from "lucide-react";

type HeaderProps = {
  onSummarize: () => void;
};

export function Header({ onSummarize }: HeaderProps) {
  return (
    <header className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <ConverseIcon className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Converse</h1>
      </div>
      <Button variant="outline" onClick={onSummarize}>
        <BotMessageSquare className="mr-2 h-4 w-4" />
        Summarize
      </Button>
    </header>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { ConverseIcon } from "@/components/converse/icons";
import { BotMessageSquare } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";

type HeaderProps = {
  onSummarize: () => void;
};

export function Header({ onSummarize }: HeaderProps) {
  return (
    <header className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <ConverseIcon className="h-8 w-8 text-accent" />
        <h1 className="text-2xl font-bold text-foreground">Converse</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onSummarize}>
          <BotMessageSquare className="mr-2 h-4 w-4" />
          Summarize
        </Button>
        <ThemeSwitcher />
      </div>
    </header>
  );
}

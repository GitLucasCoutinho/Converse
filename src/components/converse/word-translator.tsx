'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getTranslation } from '@/app/actions';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

type WordTranslatorProps = {
  word: string;
};

// Words that are short or common and don't need translation.
const IGNORED_WORDS = new Set(['a', 'an', 'the', 'is', 'it', 'in', 'on', 'at', 'to', 'for', 'of', 'i']);

export function WordTranslator({ word }: WordTranslatorProps) {
  const [translation, setTranslation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Check if the word is just punctuation or whitespace.
  const isPunctuationOrSpace = /^\s*[\W_]+\s*$/.test(word) || /^\s+$/.test(word);
  const isIgnored = IGNORED_WORDS.has(word.trim().toLowerCase());

  if (isPunctuationOrSpace || isIgnored) {
    return <span>{word}</span>;
  }

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (open && !translation) {
      setIsLoading(true);
      try {
        const response = await getTranslation({ word: word.trim().replace(/[.,!?;:"]$/, '') });
        setTranslation(response.translation);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslation('Error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <span className="cursor-pointer hover:bg-primary/20 rounded-sm transition-colors">{word}</span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader className="h-4 w-4 animate-spin" />
            <span>Translating...</span>
          </div>
        ) : (
          <span className="capitalize">{translation}</span>
        )}
      </PopoverContent>
    </Popover>
  );
}

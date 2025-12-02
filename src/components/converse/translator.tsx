'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Loader, Copy, Check } from 'lucide-react';
import { getFullTranslation } from '@/app/actions';

const languages = [
  { value: 'English', label: 'Inglês' },
  { value: 'Portuguese', label: 'Português' },
];

export function Translator() {
  const [sourceLang, setSourceLang] = useState('Portuguese');
  const [targetLang, setTargetLang] = useState('English');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const debouncedSourceText = useDebounce(sourceText, 500);

  useEffect(() => {
    const translate = async () => {
      if (!debouncedSourceText) {
        setTranslatedText('');
        return;
      }
      setIsLoading(true);
      try {
        const result = await getFullTranslation({
          text: debouncedSourceText,
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
        });
        setTranslatedText(result.translation);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText('Error translating text.');
      } finally {
        setIsLoading(false);
      }
    };

    translate();
  }, [debouncedSourceText, sourceLang, targetLang]);

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(translatedText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <Card className="flex h-full w-full flex-col p-4">
      <div className="flex items-center justify-between gap-2 mb-4">
        <Select value={sourceLang} onValueChange={setSourceLang}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon" onClick={handleSwapLanguages}>
          <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
        </Button>

        <Select value={targetLang} onValueChange={setTargetLang}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <Textarea
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder="Digite o texto para traduzir..."
          className="h-full resize-none text-lg"
        />
        <div className="relative h-full">
          <Textarea
            value={translatedText}
            readOnly
            placeholder="..."
            className="h-full resize-none bg-muted/50 text-lg"
          />
          {isLoading && (
            <div className="absolute top-3 right-3">
              <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
          {!isLoading && translatedText && (
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleCopyToClipboard}
            >
                {isCopied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-muted-foreground" />}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

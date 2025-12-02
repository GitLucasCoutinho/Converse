"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mic, SendHorizonal, StopCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
});

type ChatInputFormProps = {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
};

export function ChatInputForm({ onSendMessage, isLoading }: ChatInputFormProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messageValue = useWatch({ control: form.control, name: 'message' });

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          form.setValue("message", form.getValues("message") + finalTranscript);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, [form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSendMessage(values.message);
    form.reset();
  };

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      form.reset();
      recognitionRef.current?.start();
    }
    setIsListening((prev) => !prev);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if(messageValue) form.handleSubmit(onSubmit)();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [form.watch('message')]);

  return (
    <div className="border-t bg-card p-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative flex w-full items-start gap-2"
        >
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleMicClick}
            className={cn("shrink-0", isListening && "text-primary")}
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            {isListening ? <StopCircle className="animate-pulse" /> : <Mic />}
          </Button>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Textarea
                    {...field}
                    ref={textareaRef}
                    rows={1}
                    placeholder="Type a message or use the mic..."
                    className="max-h-36 resize-none"
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="icon"
            className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90"
            disabled={isLoading || !messageValue}
            aria-label="Send message"
          >
            <SendHorizonal />
          </Button>
        </form>
      </Form>
    </div>
  );
}

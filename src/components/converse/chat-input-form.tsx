"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mic, SendHorizonal } from "lucide-react";
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { isDirty } = useFormState({ control: form.control });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSendMessage(values.message);
    form.reset();
  };

  const handleMicClick = () => {
    setIsListening((prev) => !prev);
    // In a real app, you would start/stop voice recognition here.
    // For this mock, we just toggle the state and focus the textarea.
    textareaRef.current?.focus();
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if(isDirty) form.handleSubmit(onSubmit)();
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
            className={cn("shrink-0", isListening && "text-primary animate-pulse")}
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            <Mic />
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
            className="shrink-0"
            disabled={isLoading || !isDirty}
            aria-label="Send message"
          >
            <SendHorizonal />
          </Button>
        </form>
      </Form>
    </div>
  );
}

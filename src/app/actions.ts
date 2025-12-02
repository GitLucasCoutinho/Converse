"use server";

import { generateContextualResponse } from "@/ai/flows/generate-contextual-response";
import { provideFeedback } from "@/ai/flows/provide-feedback-on-user-input";
import { summarizeConversationHistory } from "@/ai/flows/summarize-conversation-history";
import { z } from "zod";

const getAiResponseSchema = z.object({
  text: z.string(),
  conversationHistory: z.string().optional(),
});

export const getAiResponse = async (
  input: z.infer<typeof getAiResponseSchema>
) => {
  const validatedInput = getAiResponseSchema.parse(input);
  return await generateContextualResponse(validatedInput);
};

const getFeedbackSchema = z.object({
  text: z.string(),
});

export const getFeedback = async (
  input: z.infer<typeof getFeedbackSchema>
) => {
  const validatedInput = getFeedbackSchema.parse(input);
  return await provideFeedback(validatedInput);
};

const getSummarySchema = z.object({
  conversationHistory: z.string(),
});

export const getSummary = async (input: z.infer<typeof getSummarySchema>) => {
  const validatedInput = getSummarySchema.parse(input);
  return await summarizeConversationHistory(validatedInput);
};

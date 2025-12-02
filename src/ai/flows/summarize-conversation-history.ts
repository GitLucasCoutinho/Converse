'use server';

/**
 * @fileOverview Summarizes the conversation history.
 *
 * - summarizeConversationHistory - A function that summarizes the conversation history.
 * - SummarizeConversationHistoryInput - The input type for the summarizeConversationHistory function.
 * - SummarizeConversationHistoryOutput - The return type for the summarizeConversationHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeConversationHistoryInputSchema = z.object({
  conversationHistory: z
    .string()
    .describe('The complete history of the conversation to summarize.'),
});
export type SummarizeConversationHistoryInput = z.infer<
  typeof SummarizeConversationHistoryInputSchema
>;

const SummarizeConversationHistoryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the conversation history.'),
});
export type SummarizeConversationHistoryOutput = z.infer<
  typeof SummarizeConversationHistoryOutputSchema
>;

export async function summarizeConversationHistory(
  input: SummarizeConversationHistoryInput
): Promise<SummarizeConversationHistoryOutput> {
  return summarizeConversationHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeConversationHistoryPrompt',
  input: {schema: SummarizeConversationHistoryInputSchema},
  output: {schema: SummarizeConversationHistoryOutputSchema},
  prompt: `You are an expert summarizer. Please provide a concise summary of the following conversation history:\n\n{{{conversationHistory}}}`,
});

const summarizeConversationHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeConversationHistoryFlow',
    inputSchema: SummarizeConversationHistoryInputSchema,
    outputSchema: SummarizeConversationHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

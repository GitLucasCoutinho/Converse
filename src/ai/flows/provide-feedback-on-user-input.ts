'use server';
/**
 * @fileOverview Provides feedback on user input, suggesting corrections or improvements.
 *
 * - provideFeedback - A function that provides feedback on user input.
 * - ProvideFeedbackInput - The input type for the provideFeedback function.
 * - ProvideFeedbackOutput - The return type for the provideFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideFeedbackInputSchema = z.object({
  text: z
    .string()
    .describe('The text or transcribed speech to provide feedback on.'),
});
export type ProvideFeedbackInput = z.infer<typeof ProvideFeedbackInputSchema>;

const ProvideFeedbackOutputSchema = z.object({
  feedback: z
    .string()
    .describe('The feedback on the input text, including suggestions for corrections or improvements.'),
  translation: z.string().describe('The Portuguese translation of the feedback.'),
});
export type ProvideFeedbackOutput = z.infer<typeof ProvideFeedbackOutputSchema>;

export async function provideFeedback(input: ProvideFeedbackInput): Promise<ProvideFeedbackOutput> {
  return provideFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideFeedbackPrompt',
  input: {schema: ProvideFeedbackInputSchema},
  output: {schema: ProvideFeedbackOutputSchema},
  prompt: `You are a helpful assistant that provides feedback on user-provided text. Analyze the text and provide suggestions for corrections, improvements in grammar, clarity, and overall quality. Also provide a translation of the feedback in Portuguese.

Text: {{{text}}}

Feedback:`,
});

const provideFeedbackFlow = ai.defineFlow(
  {
    name: 'provideFeedbackFlow',
    inputSchema: ProvideFeedbackInputSchema,
    outputSchema: ProvideFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

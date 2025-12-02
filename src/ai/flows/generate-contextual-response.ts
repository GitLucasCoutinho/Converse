'use server';

/**
 * @fileOverview Generates contextual responses based on the transcribed text or user input.
 *
 * - generateContextualResponse - A function that generates a contextual response.
 * - GenerateContextualResponseInput - The input type for the generateContextualResponse function.
 * - GenerateContextualResponseOutput - The return type for the generateContextualResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContextualResponseInputSchema = z.object({
  text: z.string().describe('The transcribed text or user input.'),
  conversationHistory: z.string().optional().describe('The history of the conversation.'),
});
export type GenerateContextualResponseInput = z.infer<
  typeof GenerateContextualResponseInputSchema
>;

const GenerateContextualResponseOutputSchema = z.object({
  response: z.string().describe('The contextual response from the AI.'),
  translation: z.string().describe('The Portuguese translation of the response.'),
});
export type GenerateContextualResponseOutput = z.infer<
  typeof GenerateContextualResponseOutputSchema
>;

export async function generateContextualResponse(
  input: GenerateContextualResponseInput
): Promise<GenerateContextualResponseOutput> {
  return generateContextualResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContextualResponsePrompt',
  input: {schema: GenerateContextualResponseInputSchema},
  output: {schema: GenerateContextualResponseOutputSchema},
  prompt: `You are a helpful AI assistant. Respond to the user based on the current input and the conversation history.
Your response must be in English. You must also provide a translation of your response in Portuguese.
If the user asks for a list, format each item on a new line.

Conversation History:
{{conversationHistory}}

User Input:
{{text}}

Response:`,
});

const generateContextualResponseFlow = ai.defineFlow(
  {
    name: 'generateContextualResponseFlow',
    inputSchema: GenerateContextualResponseInputSchema,
    outputSchema: GenerateContextualResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';

/**
 * @fileOverview Translates a word to a specified language.
 *
 * - translateWord - A function that translates a word.
 * - TranslateWordInput - The input type for the translateWord function.
 * - TranslateWordOutput - The return type for the translateWord function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateWordInputSchema = z.object({
  word: z.string().describe('The word to translate.'),
  targetLanguage: z.string().describe('The target language for translation (e.g., "Portuguese").'),
});
export type TranslateWordInput = z.infer<typeof TranslateWordInputSchema>;

const TranslateWordOutputSchema = z.object({
  translation: z.string().describe('The translated word.'),
});
export type TranslateWordOutput = z.infer<typeof TranslateWordOutputSchema>;

export async function translateWord(
  input: TranslateWordInput
): Promise<TranslateWordOutput> {
  return translateWordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateWordPrompt',
  input: {schema: TranslateWordInputSchema},
  output: {schema: TranslateWordOutputSchema},
  prompt: `Translate the following word to {{targetLanguage}}. Only return the translated word. If you cannot translate it, return the original word.
Word: {{{word}}}`,
});

const translateWordFlow = ai.defineFlow(
  {
    name: 'translateWordFlow',
    inputSchema: TranslateWordInputSchema,
    outputSchema: TranslateWordOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

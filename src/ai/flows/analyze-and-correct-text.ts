'use server';
/**
 * @fileOverview Analyzes and corrects text for grammatical, spelling, and punctuation errors.
 *
 * - analyzeAndCorrectText - A function that analyzes and corrects text.
 * - AnalyzeAndCorrectTextInput - The input type for the analyzeAndCorrectText function.
 * - AnalyzeAndCorrectTextOutput - The return type for the analyzeAndCorrectText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAndCorrectTextInputSchema = z.object({
  text: z.string().describe('The text to analyze and correct.'),
});
export type AnalyzeAndCorrectTextInput = z.infer<typeof AnalyzeAndCorrectTextInputSchema>;

const AnalyzeAndCorrectTextOutputSchema = z.object({
  correctedText: z.string().describe('The corrected version of the text.'),
  errorReport: z.string().describe('A comprehensive report detailing the percentage of errors and areas for improvement.'),
});
export type AnalyzeAndCorrectTextOutput = z.infer<typeof AnalyzeAndCorrectTextOutputSchema>;

export async function analyzeAndCorrectText(input: AnalyzeAndCorrectTextInput): Promise<AnalyzeAndCorrectTextOutput> {
  return analyzeAndCorrectTextFlow(input);
}

const analyzeAndCorrectTextPrompt = ai.definePrompt({
  name: 'analyzeAndCorrectTextPrompt',
  input: {schema: AnalyzeAndCorrectTextInputSchema},
  output: {
    schema: AnalyzeAndCorrectTextOutputSchema,
    format: 'json',
  },
  prompt: `You are a highly skilled AI text analyzer and corrector. Your task is to analyze the given text for grammatical errors, spelling mistakes, and punctuation issues.

After analyzing the text, you must provide a corrected version of the text and a detailed report.

Your output MUST be a valid JSON object that adheres to the following schema:
{
  "correctedText": "The corrected version of the text.",
  "errorReport": "A comprehensive report detailing the percentage of errors and areas for improvement."
}

Text to analyze: {{{text}}}
  `,
});

const analyzeAndCorrectTextFlow = ai.defineFlow(
  {
    name: 'analyzeAndCorrectTextFlow',
    inputSchema: AnalyzeAndCorrectTextInputSchema,
    outputSchema: AnalyzeAndCorrectTextOutputSchema,
  },
  async input => {
    const {output} = await analyzeAndCorrectTextPrompt(input);
    return output!;
  }
);

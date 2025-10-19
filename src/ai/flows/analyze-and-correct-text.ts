'use server';
/**
 * @fileOverview Analyzes and corrects text for grammatical, spelling, and punctuation errors, and generates a feedback report.
 *
 * - analyzeAndCorrectText - A function that analyzes, corrects, and generates a report for the given text.
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
  correctedText: z
    .string()
    .describe('The corrected version of the provided text.'),
  errorReport: z
    .string()
    .describe(
      'A comprehensive report detailing the percentage of errors and areas for improvement, with specific examples and suggestions.'
    ),
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
  prompt: `You are a highly skilled AI writing assistant. Your task is to analyze the given text for grammatical errors, spelling mistakes, and punctuation issues.

Your response must be a valid JSON object.

First, provide a corrected version of the text.

Second, provide a comprehensive feedback report. This report should include:
- The percentage of errors detected.
- Specific examples of the errors found.
- Tailored suggestions for how the user can improve their writing based on these errors.

Here is the text to analyze:
{{{text}}}
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

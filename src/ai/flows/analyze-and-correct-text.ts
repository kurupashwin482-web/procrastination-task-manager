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
  },
  config: {
    format: 'json',
  },
  prompt: `You are a highly skilled AI writing assistant. Your task is to analyze the given text for grammatical errors, spelling mistakes, and punctuation issues.

You MUST respond with a valid JSON object that conforms to the output schema.

The JSON object must have two keys: "correctedText" and "errorReport".

1.  **correctedText**: Provide a corrected version of the text.
2.  **errorReport**: Provide a comprehensive feedback report. This report should include:
    - An estimated percentage of errors detected.
    - Specific examples of the errors found.
    - Tailored suggestions for how the user can improve their writing based on these errors.

Analyze the following text:
\`\`\`
{{{text}}}
\`\`\`
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

    if (output) {
      return output;
    }
    
    // Fallback for when the model doesn't return a valid JSON object
    const {text: rawText} = await analyzeAndCorrectTextPrompt.generate({input: input});

    try {
      // Sometimes the model returns a markdown code block
      const jsonText = rawText.replace(/```json\n/g, '').replace(/\n```/g, '');
      const parsed = JSON.parse(jsonText);
      return AnalyzeAndCorrectTextOutputSchema.parse(parsed);
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", rawText);
      // If parsing fails, try to extract fields manually as a last resort
      const correctedTextMatch = rawText.match(/"correctedText"\s*:\s*"([^"]*)"/);
      const errorReportMatch = rawText.match(/"errorReport"\s*:\s*"([^"]*)"/);
      
      return {
        correctedText: correctedTextMatch ? correctedTextMatch[1] : "Could not determine correction.",
        errorReport: errorReportMatch ? errorReportMatch[1] : "Could not generate report."
      }
    }
  }
);

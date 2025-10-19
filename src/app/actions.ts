
'use server';

import { analyzeAndCorrectText, type AnalyzeAndCorrectTextOutput } from '@/ai/flows/analyze-and-correct-text';

export type AnalysisResult = (AnalyzeAndCorrectTextOutput & { originalText: string }) | { error: string };

export async function analyzeText(text: string): Promise<AnalysisResult> {
  if (!text || text.trim().length === 0) {
    return { error: 'Please enter some text to analyze.' };
  }

  try {
    const result = await analyzeAndCorrectText({ text });
    if (!result.correctedText) {
      return { error: 'Failed to get a correction. The AI may not have found any errors or could not process the request.' };
    }
    return {
      originalText: text,
      ...result,
    };
  } catch (error) {
    console.error('AI analysis failed:', error);
    return { error: 'An unexpected error occurred while analyzing the text. Please try again later.' };
  }
}

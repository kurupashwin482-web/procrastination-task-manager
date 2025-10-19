
'use server';
/**
 * @fileOverview A flow to generate a creative greeting for a given name.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GreetingInputSchema = z.object({
  name: z.string().describe('The name of the person to greet.'),
});

export async function generateCreativeGreeting(input: z.infer<typeof GreetingInputSchema>): Promise<string> {
    return generateGreetingFlow(input);
}

const generateGreetingFlow = ai.defineFlow(
  {
    name: 'generateGreetingFlow',
    inputSchema: GreetingInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `Generate a short, creative, and friendly greeting for a person named ${input.name}. Be imaginative and welcoming.`,
      model: 'googleai/gemini-1.5-flash',
    });

    return output || `Hello, ${input.name}! Have a fantastic day.`;
  }
);

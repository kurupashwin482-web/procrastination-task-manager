
'use server';

import { generateCreativeGreeting } from '@/ai/flows/generate-greeting';

export async function generateGreeting(name: string): Promise<string> {
    if (!name) {
        return "Please provide a name.";
    }
    try {
        const greeting = await generateCreativeGreeting({ name });
        return greeting;
    } catch (error) {
        console.error("Error generating greeting:", error);
        return "Sorry, I couldn't come up with a greeting right now. Please try again.";
    }
}

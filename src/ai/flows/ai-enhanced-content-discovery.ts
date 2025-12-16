'use server';

/**
 * @fileOverview AI-powered content discovery flow for personalized recommendations.
 *
 * - aiEnhancedContentDiscovery - A function that returns a list of recommended movies/series based on user preferences.
 * - AIEnhancedContentDiscoveryInput - The input type for the aiEnhancedContentDiscovery function.
 * - AIEnhancedContentDiscoveryOutput - The return type for the aiEnhancedContentDiscovery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIEnhancedContentDiscoveryInputSchema = z.object({
  viewingHistory: z
    .array(z.string())
    .describe('A list of movie/series titles the user has watched.'),
});
export type AIEnhancedContentDiscoveryInput = z.infer<
  typeof AIEnhancedContentDiscoveryInputSchema
>;

const AIEnhancedContentDiscoveryOutputSchema = z.object({
  recommendedTitles: z
    .array(z.string())
    .describe('A list of movie/series titles recommended for the user.'),
});
export type AIEnhancedContentDiscoveryOutput = z.infer<
  typeof AIEnhancedContentDiscoveryOutputSchema
>;

export async function aiEnhancedContentDiscovery(
  input: AIEnhancedContentDiscoveryInput
): Promise<AIEnhancedContentDiscoveryOutput> {
  return aiEnhancedContentDiscoveryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiEnhancedContentDiscoveryPrompt',
  input: {schema: AIEnhancedContentDiscoveryInputSchema},
  output: {schema: AIEnhancedContentDiscoveryOutputSchema},
  config: {
    model: 'gemini-pro',
  },
  prompt: `You are an AI movie and series recommendation expert. Based on a user's viewing history, you will provide a list of recommended titles.

  Viewing History: {{viewingHistory}}

  Only include actual movie/series titles in the recommendedTitles array.  Do not include explanations.
  Return the results as a JSON object.`,
});

const aiEnhancedContentDiscoveryFlow = ai.defineFlow(
  {
    name: 'aiEnhancedContentDiscoveryFlow',
    inputSchema: AIEnhancedContentDiscoveryInputSchema,
    outputSchema: AIEnhancedContentDiscoveryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

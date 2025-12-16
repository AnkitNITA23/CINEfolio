'use server';

/**
 * @fileOverview This file implements the personalized movie and series recommendations flow.
 *
 * It takes user's viewing history and liked titles as input, and returns personalized recommendations.
 *
 * @exports {
 *   getPersonalizedRecommendations,
 *   PersonalizedRecommendationsInput,
 *   PersonalizedRecommendationsOutput,
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  viewingHistory: z
    .array(z.string())
    .describe('Array of movie/series titles the user has watched.'),
  likedTitles: z
    .array(z.string())
    .describe('Array of movie/series titles the user has liked.'),
});
export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('Array of recommended movie/series titles.'),
});
export type PersonalizedRecommendationsOutput = z.infer<
  typeof PersonalizedRecommendationsOutputSchema
>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const personalizedRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  config: {
    model: 'gemini-pro',
  },
  prompt: `You are an AI movie and series recommendation expert.

Based on the user's viewing history and liked titles, provide personalized recommendations.

Viewing History: {{#each viewingHistory}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Liked Titles: {{#each likedTitles}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Recommendations:`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await personalizedRecommendationsPrompt(input);
    return output!;
  }
);

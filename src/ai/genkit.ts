
import {genkit, GenkitPlugin} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const plugins: GenkitPlugin[] = [];

// Only add the Google AI plugin if the API key is available.
// This prevents crashes when the key is not configured.
if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  plugins.push(googleAI());
}

export const ai = genkit({
  plugins,
});

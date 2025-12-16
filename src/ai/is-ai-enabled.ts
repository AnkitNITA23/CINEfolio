'use client';

/**
 * A client-safe helper to check if the AI system is configured.
 * It checks for the presence of the NEXT_PUBLIC_GEMINI_API_KEY environment variable.
 *
 * This function can be safely imported into any Client Component.
 */
export const isAiEnabled = () => {
  // We check for the NEXT_PUBLIC_ variable, which is replaced at build time
  // and is available on the client.
  return (
    process.env.NEXT_PUBLIC_GEMINI_API_KEY !== undefined &&
    process.env.NEXT_PUBLIC_GEMINI_API_KEY !== ''
  );
};

# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Deploying to Production

When you deploy your application to a live URL (like on Vercel or another hosting provider), you must perform two important configuration steps for the app to function correctly.

### 1. Authorize Your Production Domain in Firebase

You must authorize your production domain in Firebase to allow users to sign in. Without this step, Firebase will block all login and sign-up requests from your live site for security reasons.

**To fix login errors on your deployed site:**

1.  Go to your **Firebase Console**.
2.  Navigate to **Authentication** -> **Settings** -> **Authorized domains**.
3.  Click **Add domain** and enter the domain of your live application (e.g., `your-app-name.vercel.app`).

### 2. Configure Environment Variables

Your application uses API keys stored in a `.env` file for services like TMDB, GNews, and Google AI. Hosting providers like Vercel do not have access to this file. You must add these keys to your project's environment variables settings on your hosting platform.

**To fix missing content (like movies, news, or AI features) on your deployed site:**

1.  Go to your project dashboard on your hosting provider (e.g., Vercel).
2.  Navigate to **Settings** -> **Environment Variables**.
3.  Add the following variables with the values from your local `.env` file:
    - `GNEWS_API_KEY`
    - `NEXT_PUBLIC_TMDB_API_KEY`
    - `NEXT_PUBLIC_GEMINI_API_KEY`
4.  Redeploy your application for the changes to take effect.

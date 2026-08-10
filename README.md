# Quick Chat

Quick Chat is a modern AI chat application built with Next.js 15, React 19, Clerk authentication, MongoDB, and the Groq OpenAI-compatible API. It supports saved chat history, message search, chat sharing, export options, and usage quotas for chat creation and token generation.

## Features

- AI chat powered by Groq `llama-3.3-70b-versatile` via the OpenAI-compatible endpoint
- User authentication using Clerk
- MongoDB persistence for saved chats and quota tracking
- New chat creation with daily chat limits
- Token usage limit: 20,000 tokens per 4 hours with automatic cooldown enforcement
- DeepThink mode for structured, reasoning-focused responses
- Shareable chat links and export to Markdown/JSON
- Responsive UI with sidebar chat management and search modal

## Tech stack

- Next.js 15+ (App Router)
- React 19
- Clerk for authentication
- MongoDB / Mongoose
- Groq OpenAI-compatible API
- Tailwind CSS 4
- Axios for client API calls
- React Hot Toast for notifications

## Project structure

- `app/` — Next.js front-end pages, layouts, and API routes
- `components/` — UI components for chat, sidebar, header, prompt box, search modal, and quota display
- `context/` — application context and chat state management
- `config/` — MongoDB connection and quota logic
- `models/` — Mongoose models for `Chat` and `User`
- `public/` — static assets

## Setup

1. Clone the repository:

```bash
git clone <repo-url>
cd quick-chat
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the project root with the required environment variables:

```bash
MONGODB_URI=<your-mongodb-connection-string>
GROQ_API_KEY=<your-groq-openai-api-key>
CLERK_FRONTEND_API=<your-clerk-frontend-api>
CLERK_API_KEY=<your-clerk-api-key>
CLERK_SIGN_IN_URL=<your-clerk-sign-in-url>
CLERK_SIGN_UP_URL=<your-clerk-sign-up-url>
```

> Note: This project uses Clerk auth, so you should configure your Clerk application and obtain the appropriate keys/URLs from your Clerk dashboard.

4. Run the development server:

```bash
npm run dev
```

5. Open the app in your browser:

```text
http://localhost:3000
```

## Environment variables

- `MONGODB_URI` — MongoDB connection string for chat and quota data
- `GROQ_API_KEY` — API key for the Groq OpenAI-compatible service
- `CLERK_FRONTEND_API` — Clerk frontend API key
- `CLERK_API_KEY` — Clerk backend API key (if required for server-side Clerk routes)
- `CLERK_SIGN_IN_URL` — Clerk sign-in URL
- `CLERK_SIGN_UP_URL` — Clerk sign-up URL

## Running the app

- `npm run dev` — start the development server
- `npm run build` — build production assets
- `npm start` — launch the production server
- `npm run lint` — run ESLint

## API routes

- `POST /api/chat/ai` — send a prompt to the AI and save the chat response
- `POST /api/chat/create` — create a new chat with daily quota enforcement
- `GET /api/chat/get` — fetch saved chats for the authenticated user
- `POST /api/chat/delete` — delete a chat
- `POST /api/chat/rename` — rename a chat
- `GET /api/chat/share?id=<chatId>` — fetch public chat share data
- `GET /api/quota` — get current user quota state

## Quota behavior

- Each user can create up to 4 chats per 24-hour period.
- AI response generation is limited to 20,000 tokens per 4-hour window.
- When the token limit is reached, users are blocked for 4 hours.

## Notes

- The app uses a `DeepThink` toggle for more structured reasoning responses.
- Chat share links are copied to the clipboard from the chat header.
- The current implementation saves message history per authenticated user only.

## Deployment

This app is ready for deployment on Vercel or any platform that supports Next.js 15 and environment variables. Ensure the environment variables are set for MONGODB, GROQ, and Clerk before deploying.

---

## Project Images

<img width="1365" height="685" alt="image" src="https://github.com/user-attachments/assets/5ae5d60f-2798-444c-a823-2b18c461df38" />

<img width="1365" height="684" alt="image" src="https://github.com/user-attachments/assets/12ec01de-34dc-4ad9-b23f-9632ab021508" />

<img width="801" height="333" alt="image" src="https://github.com/user-attachments/assets/a6f3237c-52dc-4105-8058-9949db3a8ba4" />


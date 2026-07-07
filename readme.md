# prepAI

An AI-powered mock interview platform. It simulates technical interviews, reviews your resume, and gives personalized feedback using LLMs — basically a practice partner that's available whenever you need it.

Live: https://prepai-production-36c8.up.railway.app/

Docs for the individual pieces live here:
<details>
<summary><strong>Backend Resources</strong></summary>

- **Google OAuth** — https://console.cloud.google.com/apis/credentials
- **JWT** — https://jwt.io/
- **Prisma** — https://www.prisma.io/docs
- **Neon PostgreSQL** — https://neon.tech/
- **Google Gemini API** — https://ai.google.dev/gemini-api/docs
- **Google AI Studio** — https://aistudio.google.com/
- **Railway** — https://railway.com/

</details>

<details>
<summary><strong>Frontend Technologies</strong></summary>

- **React** — https://react.dev/
- **Vite** — https://vite.dev/
- **Tailwind CSS v4** (CSS-first, no `tailwind.config.js`) — https://tailwindcss.com/docs
- **React Router** — https://reactrouter.com/
- **Zustand** — https://zustand.docs.pmnd.rs/
- **Axios** — https://axios-http.com/docs/intro
- **Cloudinary** (Resume Uploads) — https://cloudinary.com/documentation

</details>

## What it does

- Runs AI-driven technical interviews and asks intelligent follow-up questions based on your answers
- Reviews your resume and gives feedback
- Adapts the interview flow to the candidate
- Google OAuth login, with JWT-based sessions handled on top of it
- Keeps a history of your past interviews so you can track progress
- Light/dark theme, responsive UI

## Stack

**Frontend** — React, Tailwind CSS, Zustand for state, React Router, Axios

**Backend** — Node.js + Express, Prisma as the ORM, PostgreSQL, Passport.js for auth, JWT for sessions

**AI** — Google Gemini Flash 2.5

## Before you start

You'll need:

- Node.js 18+ and npm 9+
- A PostgreSQL database (I'm using Neon, but any Postgres instance works)
- Google OAuth credentials (client ID/secret) from the Google Cloud console
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/)

## Setup

Clone it:

```bash
git clone https://github.com/manjit12344/prep_Ai.git
cd prep_AI
```

Install dependencies:

```bash
npm install
```

You'll need a `.env` file for the backend. Here's what goes in it — swap in your own values, obviously:

**backend/.env**
```env
DATABASE_URL=       # your database connection string (from neon.com)
GEMINI_API_KEY=     # your main gemini api key for chat session
RESUME_ATS=         # your gemini key for resume review feature
ANALYSIS=           # your gemini api key for interview analysis at the end of a session
CLIENT_ID=          # your cloud.google oauth2.0 client_id
CLIENT_SECRET=      # your cloud.google oauth2.0 client_secret
REDIRECT_URL=       # "http://localhost:port/auth/google/callback" on development, your own url on production
ACCESS_SECRET=      # JWT access secret for access token
REFRESH_SECRET=     # JWT refresh secret for refresh token
PORT=               # your required port
NODE_ENV=           # your environment of project
```

Generate the Prisma client:

```bash
npx prisma generate --schema=backend/prisma/schema.prisma
```

Then push the schema / run migrations:

```bash
npx prisma migrate deploy --schema=backend/prisma/schema.prisma
```

## Running it

For development (hot reload, what you'll use most of the time):

```bash
npm run dev
```

For a production-style run:

```bash
npm run build
npm start
```

Frontend defaults to `localhost:5173`, backend API to `localhost:5000` — adjust if you've changed the ports.

## Services this depends on

- Google OAuth for login
- Google Gemini API for the actual interview/resume logic
- Neon (Postgres) for the database
- Prisma as the data layer
- Railway for hosting

## Structure

```
prep_AI/
├── backend/     → Express API, Prisma schema, auth
│   └── README.md
├── frontend/    → React app, components, state
│   └── README.md
└── README.md
```

#### ---------------------happy coding ❤️--------------------

## --------------Thankyou---------------

# AI Study Assistant

A smart, AI-powered study hub for students — built with React, Node.js, Express, PostgreSQL, and OpenAI.

## Features

- **Home Page** — Landing page with app overview and call-to-action
- **Demo Login** — Simple client-side auth (username: `demo`, password: `demo`)
- **Dashboard** — Overview of to-do stats and quick links to all tools
- **AI Notes Summarizer** — Paste your notes and get AI-generated summaries (concise, detailed, or bullet-point format)
- **AI Quiz Generator** — Generate custom quizzes from your notes with difficulty control
- **AI Study Planner** — Get a day-by-day study plan tailored to your exam date and schedule
- **To-Do List** — Full task management with priority levels, subjects, and due dates

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, TypeScript, TailwindCSS |
| Backend    | Node.js, Express 5, TypeScript    |
| Database   | PostgreSQL (Drizzle ORM)          |
| AI         | OpenAI GPT-4o-mini (streaming SSE)|
| API        | OpenAPI 3.1, React Query (Orval codegen) |

## Project Structure

```
├── artifacts/
│   ├── api-server/          # Express API server
│   │   └── src/routes/
│   │       ├── todos.ts     # To-do CRUD endpoints
│   │       └── ai.ts        # AI streaming endpoints
│   └── study-assistant/     # React + Vite frontend
│       └── src/
│           ├── pages/       # Route-based pages
│           └── components/  # Shared UI components
├── lib/
│   ├── api-spec/            # OpenAPI spec (source of truth)
│   ├── api-client-react/    # Generated React Query hooks
│   ├── api-zod/             # Generated Zod validation schemas
│   └── db/                  # Drizzle ORM schema + migrations
```

## Local Development (Replit)

The app runs automatically via Replit workflows. Both services start together:

- **Frontend** — Vite dev server (React)
- **API Server** — Express backend on `/api`

## Deploying to Vercel

### Frontend (Vite React)

1. Fork or clone this repository to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Set the **Root Directory** to `artifacts/study-assistant`
4. Set the **Build Command** to `pnpm run build`
5. Set the **Output Directory** to `dist/public`
6. Add environment variable: `VITE_API_URL=<your-api-server-url>`

### Backend (Express API)

Deploy the API server separately (e.g. Railway, Render, or Vercel Serverless):

1. Set root to `artifacts/api-server`
2. Set build command: `pnpm run build`
3. Set start command: `node dist/index.mjs`
4. Add environment variables:
   - `DATABASE_URL` — PostgreSQL connection string
   - `OPENAI_API_KEY` — Your OpenAI API key
   - `NODE_ENV=production`

## Environment Variables

| Variable         | Required | Description                     |
|------------------|----------|---------------------------------|
| `OPENAI_API_KEY` | Yes      | OpenAI API key for AI features  |
| `DATABASE_URL`   | Yes      | PostgreSQL connection string     |
| `PORT`           | No       | API server port (default: 5000) |

## API Endpoints

| Method | Path               | Description                        |
|--------|--------------------|------------------------------------|
| GET    | `/api/healthz`     | Health check                       |
| GET    | `/api/todos`       | List all todos                     |
| POST   | `/api/todos`       | Create a new todo                  |
| PATCH  | `/api/todos/:id`   | Update a todo                      |
| DELETE | `/api/todos/:id`   | Delete a todo                      |
| GET    | `/api/todos/stats` | Get todo statistics                |
| POST   | `/api/ai/summarize`| Summarize notes (SSE stream)       |
| POST   | `/api/ai/quiz`     | Generate quiz (SSE stream)         |
| POST   | `/api/ai/study-plan`| Generate study plan (SSE stream)  |

## Demo Login

Use these credentials to log in (client-side only, no real authentication):

- **Username:** `demo`
- **Password:** `demo`

## GitHub Setup

```bash
git init
git add .
git commit -m "Initial commit: AI Study Assistant"
git remote add origin https://github.com/YOUR_USERNAME/ai-study-assistant.git
git push -u origin main
```

## License

MIT

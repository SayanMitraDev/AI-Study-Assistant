# AI Study Assistant

A full-stack AI-powered study app where students manage flashcard decks, quiz themselves, and chat with an AI tutor.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/study-assistant run dev` — run the frontend (port from env)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `OPENAI_API_KEY` — for AI tutor chat (user's own key)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, TanStack Query, Wouter, Recharts, Tailwind CSS
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- AI: OpenAI (gpt-4o-mini) via user's OPENAI_API_KEY, streaming SSE
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for all API contracts
- `lib/db/src/schema/` — Drizzle table definitions (subjects, decks, cards, studySessions, conversations, messages)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/study-assistant/src/pages/` — React page components
- `lib/api-client-react/src/generated/` — generated React Query hooks (do not edit)
- `lib/api-zod/src/generated/` — generated Zod schemas for server validation (do not edit)

## Architecture decisions

- OpenAPI-first: spec in `lib/api-spec/openapi.yaml` drives both server validation (Zod) and client hooks (React Query)
- AI chat uses SSE streaming: server streams chunks via `text/event-stream`, frontend uses buffered SSE parser (double-newline delimited) to handle chunks split across network boundaries
- Deck card counts (`cardCount`, `masteredCount`) are computed via SQL aggregation on read, not stored columns
- AI conversations use the `conversations`/`messages` tables from the OpenAI integration template

## Product

- **Dashboard** — stats overview: decks, cards mastered, study sessions, subject breakdown chart
- **Subjects** — manage study subject categories with color/icon
- **Flashcard Decks** — create and organize decks by subject
- **Deck Detail** — view/add/edit cards, track mastery, launch quiz
- **Quiz Mode** — flip-card quiz with correct/wrong tracking; records study sessions on completion
- **AI Tutor Chat** — streaming conversation with GPT; study-focused system prompt

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After OpenAPI spec changes, always run `pnpm --filter @workspace/api-spec run codegen` before building
- SSE parsing in chat-detail.tsx uses double-newline event delimiters; do not revert to chunk-local line splitting
- `OPENAI_API_KEY` must be set in secrets — the app does NOT use Replit AI integrations for OpenAI

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

---
trigger: always_on
---

# Project Rules: worker-wxsend

## Project Overview
这是一个 Cloudflare Pages + Workers 的全栈项目，采用 Monorepo 风格结构。
- **Frontend**: React + Vite (located in `src/`)
- **Backend**: Cloudflare Pages Functions + Hono (located in `functions/`)
- **Deployment**: Cloudflare Pages (frontend handles UI, functions handle API)

## Tech Stack
- **Runtime**: Cloudflare Workers
- **Frameworks**: 
  - Backend: [Hono](https://hono.dev) (v4+)
  - Frontend: React (v18+)
  - UI: Tailwind CSS, shadcn/ui
- **Build Tools**: Vite, Wrangler
- **Language**: TypeScript

## Project Structure
- `/src`: Frontend React application source code.
  - `/src/components/ui`: shadcn/ui components.
- `/functions`: Backend API logic.
  - `/functions/api/[[route]].ts`: Main entry point for the Hono app (handles `/api/*`).
- `wrangler.jsonc`: Cloudflare configuration.
- `package.json`: Dependencies and scripts.

## Development Workflow
- **Start Local Dev**: `npm run pages:dev` (Starts local Wrangler Pages dev server with frontend and backend).
- **Build**: `npm run build` (Compiles React app to `dist/`).
- **Deploy**: `npm run pages:deploy` (Deploys `dist/` to Cloudflare Pages).

## Coding Guidelines
- **UI Components**: Use shadcn/ui components from `src/components/ui` and styling with Tailwind CSS utility classes.
- **API Routing**: Verify all API routes are defined in `functions/api` and use Hono's `basePath('/api')`.
- **Types**: Share types between frontend and backend where possible (e.g., in `functions/api/types.ts` or a shared folder).
- **Environment Variables**: Access via `c.env` in Hono. Local vars in `.dev.vars`.

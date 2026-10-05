# FixTheFlow

FixTheFlow is a customer service portal for Northwind Utilities, a fictional utility, built for the CGI CRM challenge at Hack the Hill III ([Devpost](https://devpost.com/software/fixtheflow)). Customers submit complaints and maintenance requests, and staff work through them. It's built with TypeScript, React, Vite, and Supabase.

## Features
- Email and password log in (Supabase Auth), with three roles:
  - **Customer**: submit a complaint or maintenance request, view a bill breakdown, see appointments, and track requests in **Open** and **Closed** tabs
  - **Employee**: review and close customer requests, see the appointments calendar, and open a customer's profile and past requests
  - **Manager**: see and close all requests, plus request stats, a contact centre staffing dashboard, and account role management
- A pitch deck at `/presentation` (see below)
- A demo mode with sample accounts that runs without any backend (see below)

## Pages
| Path | What it is |
|---|---|
| `/` | Project landing page, with links to the app and the deck |
| `/app` | The Northwind Utilities portal |
| `/presentation` | The pitch deck |

## Demo mode
If the Supabase env vars aren't set, the app runs as a self-contained demo. There's no sign-up. Visitors log in as one of three sample accounts, and the login form fills itself in:

| Role | Email | Password |
|---|---|---|
| Customer | `johndoe@example.ca` | `northwind-demo` |
| Employee | `support@northwind.ca` | `northwind-demo` |
| Manager | `manager@northwind.ca` | `northwind-demo` |

Requests and roles start from the sample data in [`src/demoData.ts`](src/demoData.ts) and are saved in the visitor's `localStorage`, so one visitor's changes never reach another. **Reset demo** in the dashboard puts everything back. The in-browser store in [`src/backend/demoBackend.ts`](src/backend/demoBackend.ts) follows the same rules as the Row Level Security policies, so customers only see their own requests.

To run the demo even with a real `.env` present:
```bash
npm run dev:demo
```

## Setup
1. Install dependencies (requires Node.js 20+):
   ```bash
   npm install
   ```
2. Create your env file and fill in your Supabase values (Dashboard → Project Settings → API):
   ```bash
   cp .env.example .env
   ```
   Use only the public **anon** key. Never put the `service_role` key in this frontend.
3. In the Supabase SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql). It creates the `requests` and `profiles` tables and their Row Level Security policies.
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Roles and closing requests
With Supabase, new accounts are customers. To make someone an employee or manager, use the SQL snippets at the bottom of [`supabase/schema.sql`](supabase/schema.sql). After that, a manager can change roles from the app. Customers can create and read only their own requests. Employees and managers can see all requests and close them.

## Presentation
The pitch deck lives at `/presentation`. Each slide has its own URL hash (for example `/presentation#problem`), and the presenter controls are in [`src/presentation`](src/presentation). Slides embed live app components with sample data from `/presentation/screen/<name>` (`my-requests`, `queue`, `bill`, `calendar`, `staffing`). Both routes are lazy-loaded in [`src/main.tsx`](src/main.tsx), so the app doesn't load the deck.

The CSVs in [`csv/`](csv) are the Northwind challenge data. They're bundled into the build, and the notebook in [`analysis/`](analysis) analyses them.

## Deployment
The app is a static site:
```bash
npm run build
```
This outputs `dist/`, which you can host anywhere that serves static files. There are two things to know:
- Routing uses the URL path. The host has to serve `index.html` for unknown paths (an SPA fallback), or `/app` and `/presentation` break on a direct load or refresh.
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are baked in at build time. Leave them unset for a demo deployment, or build with `npm run build:demo`, which blanks them even if your `.env` has real values. For a Supabase deployment, set them in the host's build environment and add the deployed URL under Authentication → URL Configuration in Supabase.

On Vercel, [`vercel.json`](vercel.json) already sets this up: it runs `npm run build:demo` and adds the `index.html` fallback, so importing the repo needs no other settings. To deploy against Supabase instead, override the build command with `npm run build` and set the two env vars.

Every link goes through [`src/routes.ts`](src/routes.ts), which respects Vite's `base`, so the site can also be served from a sub-path such as `/cgi/`.

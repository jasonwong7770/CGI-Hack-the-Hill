# CGI-CRM-Hack-the-Hill

A customer service portal for Northwind Utilities, built for CGI Hack the Hill. Customers submit complaints and maintenance requests, and staff work through them. It's built with TypeScript, React, Vite, and Supabase.

## Features
- Email and password log in (Supabase Auth), with three roles:
  - **Customer**: submit a complaint or maintenance request, view a bill breakdown, see appointments, and track requests in **Open** and **Closed** tabs
  - **Employee**: review and close customer requests, see the appointments calendar, and open a customer's profile and past requests
  - **Manager**: see and close all requests, plus request stats, a contact centre staffing dashboard, and account role management
- A pitch deck at `/presentation` (see below)

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
New accounts are customers. To make someone an employee or manager, use the SQL snippets at the bottom of [`supabase/schema.sql`](supabase/schema.sql). After that, a manager can change roles from the app. Customers can create and read only their own requests. Employees and managers can see all requests and close them.

## Presentation
The pitch deck lives at `/presentation`. Each slide has its own URL hash (for example `/presentation#problem`), and the presenter controls are in [`src/presentation`](src/presentation). Slides embed live app components with sample data from `/presentation/screen/<name>` (`my-requests`, `queue`, `bill`, `calendar`, `staffing`). Both routes are lazy-loaded in [`src/main.tsx`](src/main.tsx), so the app doesn't load the deck.

The CSVs in [`csv/`](csv) are the Northwind challenge data. They're bundled into the build, and the notebook in [`analysis/`](analysis) analyses them.

## Deployment
The app is a static site:
```bash
npm run build
```
This outputs `dist/`, which you can host anywhere that serves static files. There are two things to know:
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are baked in at build time, so set them in the host's build environment.
- Routing uses the URL path. The host has to serve `index.html` for unknown paths (an SPA fallback), or `/presentation` breaks on a direct load or refresh.

Add the deployed URL to Supabase under Authentication → URL Configuration, so auth links don't point at localhost.

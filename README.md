# CGI-CRM-Hack-the-Hill

A simple portal for submitting complaints and maintenance requests. It's built with TypeScript, React, Vite, and Supabase.

## Features
- Sign up and log in with email and password (Supabase Auth)
- Submit a complaint or a maintenance request
- See your requests in **Open** and **Closed** tabs
- Log out

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
3. In the Supabase SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql). It creates the `requests` table and its Row Level Security policies.
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Closing requests
Users can create and read only their own requests. To move a request to the **Closed** tab, set its `status` to `closed` in the Supabase Table Editor.

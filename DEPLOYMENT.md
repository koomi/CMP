# Deployment Guide for Credit Management Platform

## Overview

This guide covers deploying the Credit Management Platform to Cloudflare Pages with a Cloudflare Workers API backed by D1 database.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Browser (SPA) │────▶│ Cloudflare Pages│     │  Cloudflare D1  │
│                 │     │  (Static Host)  │────▶│   (Database)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │Cloudflare Workers│
                        │   (API Layer)   │
                        └─────────────────┘
```

## Files Created

| File | Purpose |
|------|---------|
| `schema.sql` | D1 database schema with tables for projects, customers, deposits, tasks, options |
| `workers/api/index.js` | Cloudflare Worker handling all API routes with CORS support |
| `wrangler.toml` | Cloudflare Workers/Pages configuration |
| `js/api.js` | Client-side API wrapper for making requests |
| `index.html` | Modified frontend that calls API instead of localStorage |
| `DEPLOYMENT.md` | This file |

## Prerequisites

- Node.js 18+ installed
- Cloudflare account (free tier works)
- Wrangler CLI installed: `npm install -g wrangler`

## Deployment Steps

### Step 1: Login to Cloudflare

```bash
wrangler login
```

This will open a browser for authentication.

### Step 2: Create D1 Database

```bash
wrangler d1 create credit-management-db
```

Copy the `database_id` from the output.

### Step 3: Update wrangler.toml

Edit `wrangler.toml` and replace `YOUR_DATABASE_ID_HERE` with the actual database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "credit-management-db"
database_id = "REPLACE_WITH_ACTUAL_ID"
```

### Step 4: Apply Database Schema

```bash
wrangler d1 execute credit-management-db --file=schema.sql
```

### Step 5: Deploy the Worker

```bash
wrangler deploy
```

This will deploy the API worker. Note the URL from the output (e.g., `https://api.xxxx.workers.dev`).

### Step 6: Update API Base URL

Edit `js/api.js` and set the correct API base URL:

```javascript
const cf = {
    API_BASE: 'https://your-worker-url.workers.dev'
};
```

### Step 7: Initialize Sample Data (Optional)

Visit your API URL with `/init` endpoint to load sample data:

```
https://your-worker-url.workers.dev/init
```

### Step 8: Deploy to Cloudflare Pages

Option A: Using Wrangler
```bash
wrangler pages deploy public --project-name=credit-management
```

Option B: Using GitHub Actions (recommended)
1. Push code to GitHub
2. Go to Cloudflare Dashboard > Pages
3. Create project from GitHub repo
4. Set build command: (none for static SPA)
5. Set output directory: `/public` (or `.` if index.html is at root)

### Step 9: Configure Custom Domain (Optional)

In Cloudflare Dashboard > Pages > Your Project > Custom Domains:
- Add your custom domain
- Update DNS as prompted

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/init` | Initialize database with sample data |
| POST | `/auth/login` | Authenticate with password |
| GET | `/options` | Get all options |
| PUT | `/options` | Update an option |
| GET | `/projects` | Get all projects (supports ?status=&stage= filters) |
| POST | `/projects` | Create project |
| PUT | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |
| GET | `/customers` | Get all customers |
| POST | `/customers` | Create customer |
| PUT | `/customers/:customerNo` | Update customer |
| DELETE | `/customers/:customerNo` | Delete customer |
| GET | `/deposits` | Get all deposits |
| POST | `/deposits` | Create deposit |
| PUT | `/deposits/:id` | Update deposit |
| DELETE | `/deposits/:id` | Delete deposit |
| GET | `/tasks` | Get all tasks (supports ?customerNo=&completed= filters) |
| POST | `/tasks` | Create task |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| PUT | `/tasks/:id/toggle` | Toggle task completion |

## Default Password

The default password is `admin123`. Change it by:
1. Update `API_PASSWORD` in `wrangler.toml` before deploy
2. Or call `/auth/login` with new password after deploy

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_PASSWORD` | Login password | `admin123` |

## Troubleshooting

### CORS Errors
The Worker includes CORS headers for all responses. If issues persist:
1. Verify Worker is deployed
2. Check `API_BASE` in `js/api.js` matches your Worker URL
3. Ensure no browser extensions blocking requests

### D1 Binding Errors
If you see "D1 not bound" errors:
1. Verify `wrangler.toml` has correct `database_id`
2. Re-run `wrangler d1 execute` with schema
3. Ensure binding name is `DB` in both config and Worker code

### Data Not Loading
1. Call `/init` endpoint first to populate sample data
2. Check browser console for errors
3. Verify API Worker is responding at its URL

## Local Development

To test locally:

```bash
# Start D1 local instance
wrangler d1 local create credit-management-db
wrangler d1 execute credit-management-db --file=schema.sql --local

# Run Worker locally
wrangler dev
```

Update `js/api.js` to use local Worker URL during development.

## Useful Commands

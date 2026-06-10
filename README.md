# Inventory Pro

A modern inventory management application built with Next.js, Prisma, PostgreSQL, and Stackframe auth.

## Overview

This project provides a full inventory workflow with:

- Landing page and auth flow
- Dashboard with inventory analytics
- Product listing with search, pagination, and delete support
- Add product form with stock threshold settings
- User account settings via Stackframe
- PostgreSQL integration via raw SQL
- Prisma schema & migration support
- Recharts analytics charts for activity visualization

## Project structure

```text
app/
  layout.tsx
  page.tsx
  add-product/page.tsx
  dashboard/page.tsx
  inventory/page.tsx
  settings/page.tsx
  sign-in/page.tsx
  handler/[...stack]/page.tsx
components/
  sidebar.tsx
  inventory-chart.tsx
  products-chart.ts
lib/
  auth.ts
  db.ts
  prisma.ts
  actions/product.ts
prisma/
  schema.prisma
  seed.ts
  migrations/
stack/
  client.tsx
  server.tsx
next.config.ts
package.json
tsconfig.json
README.md
```

## Pages and routes

- `/` — Marketing landing page
- `/sign-in` — Login page using Stackframe auth
- `/dashboard` — Inventory analytics and activity overview
- `/inventory` — Product list with search, pagination, delete
- `/add-product` — Add new product form
- `/settings` — User account settings page
- `/handler/sign-in` — Stackframe auth handler route

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root with:

```env
DATABASE_URL=postgresql://username:password@host:port/database
```

### 3. Prisma setup

Generate the Prisma client and apply migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Start development server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Available scripts

- `npm run dev` — Start the Next.js development server
- `npm run build` — Generate Prisma client and build the app
- `npm start` — Start the production server after build
- `npm run lint` — Run ESLint

## Database and Prisma

### `prisma/schema.prisma`

Defines a `Product` model with:

- `id`: primary key
- `userId`: owner user ID
- `name`: product name
- `sku`: optional unique code
- `price`: decimal value
- `quantity`: stock count
- `lowStockAt`: low-stock threshold
- `createAt`: created timestamp
- `updatedAt`: updated timestamp

Indexes:

- `@@index([userId, name])`
- `@@index([createAt])`

## Authentication

Authentication uses `@stackframe/stack`:

- `stack/client.tsx` sets up client auth
- `stack/server.tsx` sets up server auth
- `app/handler/[...stack]/page.tsx` renders auth handler
- `lib/auth.ts` protects pages by redirecting unauthenticated users to `/handler/sign-in`

## Data access

### `lib/db.ts`

- Uses `@neondatabase/serverless` to expose `sql`
- Requires `DATABASE_URL`

### `lib/actions/product.ts`

- `createProduct(formData)` adds a new product
- `deleteProduct(formData)` removes a product
- Both actions revalidate `/inventory` and `/dashboard`

## UI components

### `components/sidebar.tsx`

- Sidebar navigation for authenticated pages
- Includes links to Dashboard, Inventory, Add Product, Settings
- Renders user button from Stackframe

### `components/inventory-chart.tsx`

- Client-side Recharts area chart
- Displays product activity by date

### `components/products-chart.ts`

- Present in project but currently empty

## Notes

- Dashboard and inventory pages use raw SQL queries instead of Prisma queries.
- `app/add-product/page.tsx` submits directly to the server action `createProduct`.
- `app/inventory/page.tsx` supports query-based search and pagination.
- `app/settings/page.tsx` uses Stackframe `AccountSettings`.

## Deployment

Build and run in production mode:

```bash
npm run build
npm start
```

Ensure `DATABASE_URL` is configured in the production environment.

## Troubleshooting

- If database connection fails, verify `DATABASE_URL` values.
- If auth fails, confirm `/handler/sign-in` is reachable and Stackframe is correctly configured.
- If Prisma client is missing, run `npx prisma generate`.

## Recommended improvements

- Replace raw SQL with Prisma queries for consistency
- Implement user-specific product filtering by `userId`
- Add validation and error UI on forms
- Complete or remove `components/products-chart.ts`
- Add tests for routes and actions

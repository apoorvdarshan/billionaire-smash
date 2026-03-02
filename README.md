# Billionaire Smash

Who's more smash-worthy? Vote on billionaires in head-to-head matchups, ranked by Elo.

## Tech Stack

- **Framework**: Next.js 15 + TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: SQLite via Prisma (local), Turso (production)
- **Payments**: PayPal (Elo boosts)
- **Data**: Forbes 400 API

## Getting Started

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

**`.env`** — production config (Turso, live PayPal)

```
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-live-client-id
PAYPAL_CLIENT_SECRET=your-live-secret
PAYPAL_API_BASE=https://api-m.paypal.com
```

**`.env.local`** — local dev overrides (local SQLite, sandbox PayPal)

```
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-sandbox-client-id
PAYPAL_CLIENT_SECRET=your-sandbox-secret
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
```

## Project Structure

```
src/
  app/
    page.tsx              # Arena (voting page)
    leaderboard/page.tsx  # Elo leaderboard
    api/
      pair/route.ts       # Random billionaire pair
      vote/route.ts       # Submit vote
      leaderboard/route.ts
      feed/route.ts       # Live feed
      boost/              # PayPal boost flow
      visitors/route.ts   # Visitor counter
      sync/route.ts       # Forbes data sync
  components/
    LiveFeed.tsx          # Scrolling live ticker
    BoostModal.tsx        # PayPal boost modal
    Nav.tsx
    Footer.tsx
  lib/
    prisma.ts             # Prisma client (Turso adapter in prod)
    paypal.ts             # PayPal API helpers
prisma/
  schema.prisma
  seed.ts
```

## Deployment

Deploy to Vercel and set the environment variables in the dashboard. The app uses Turso as the production database — no filesystem required.

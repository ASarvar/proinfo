This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### 1. Configure environment variables

Copy `.env` and set the required values:

```
ADMIN_SESSION_SECRET=<long-random-string>
ADMIN_SUPERADMIN=superadmin:<your-password>:SuperAdmin
ADMIN_EDITOR=editor:<your-password>:Editor
DATABASE_URL=postgresql://user:password@host:port/proinfo?schema=public
```

### 2. Set up the database

```bash
npm run build       # prisma generate + next build
npm run db:push     # push schema to DB (skip for existing migrations)
npm run db:seed     # seed initial data
```

If you are migrating from an earlier version that had a known FAQ entityType inconsistency, run:

```bash
npm run db:fix-faq-entity-type
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root redirects to `/ru` by default.

## Routes

This project uses the **Next.js App Router** under `src/app/`:

- `[locale]/` — front-end pages (locale prefix: `ru`, `uz`, `en`)
- `admin/` — admin panel (no locale prefix)
- `api/` — REST API routes (see [API.md](API.md))

## Admin Panel

Visit `/admin/login`. Credentials are set via `ADMIN_SUPERADMIN` / `ADMIN_EDITOR` env vars (or `ADMIN_USERS_JSON` for multiple users). There are no hardcoded default credentials.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## Deploy

Set all env vars listed above, run `npm run build`, then `npm start`.

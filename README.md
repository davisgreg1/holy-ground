# Holy Ground Theology

Next.js App Router project for a Catholic theology website with three delivered foundations:

1. Lead magnet funnel (popup + second-click trigger + conversion analytics + tokenized PDF delivery)
2. Online Bible reader (book/chapter/verse navigation with static generation)
3. Static-site search (build-time index + client ranking)

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## Scripts

```bash
pnpm dev         # build search index, then start dev server
pnpm build:index # regenerate public/search-index.json
pnpm build       # rebuild index and compile production bundle
pnpm lint        # run eslint
```

## Environment Variables

Optional variables for production integration:

- `NEXT_PUBLIC_SITE_URL` - canonical origin used in lead magnet download links
- `LEAD_MAGNET_SECRET` - HMAC secret for signed download tokens
- `LEAD_MAGNET_WEBHOOK_URL` - webhook endpoint for email delivery automation

## Architecture Overview

- `app/api/lead-magnet/signup/route.ts`
  - Validates email signup
  - Issues signed download URL
  - Sends optional webhook payload for automated email delivery
- `app/api/lead-magnet/download/route.ts`
  - Verifies token and redirects to PDF asset
- `app/bible/*`
  - Static pages for Bible books and chapter routes from `kjv_strongs.json`
- `scripts/build-search-index.mjs`
  - Generates `public/search-index.json` from articles, Bible data, and resources
- `components/search/search-experience.tsx`
  - Client-side weighted ranking and filtering

## Content Sources

- Articles: `content/articles.json`
- Bible corpus: `kjv_strongs.json`

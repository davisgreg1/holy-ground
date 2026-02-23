# Handoff Notes

## Delivered Scope

### Phase 1: Lead Magnet Funnel

Implemented:

- Reusable CTA system with lead magnet trigger support
- Second-click trigger mode for popup activation
- Sitewide CTA placement (header, homepage, articles, lead magnet page)
- Signup endpoint with validation and signed download URL generation
- Automated PDF delivery integration hook via `LEAD_MAGNET_WEBHOOK_URL`
- Tokenized download endpoint for controlled PDF access
- Conversion analytics events:
  - `lead_magnet_impression`
  - `lead_magnet_open`
  - `lead_magnet_second_click`
  - `lead_magnet_submit`
  - `lead_magnet_conversion`
  - `lead_magnet_download`

Key files:

- `components/lead-magnet/lead-magnet-provider.tsx`
- `components/lead-magnet/lead-magnet-trigger-link.tsx`
- `components/cta/cta-button.tsx`
- `app/api/lead-magnet/signup/route.ts`
- `app/api/lead-magnet/download/route.ts`

### Phase 2: Online Bible Reader

Implemented:

- Reader landing page with Old/New Testament grouping
- Static book pages with chapter navigation
- Static chapter pages with verse anchors
- Prev/next chapter navigation component
- Metadata generation for SEO-oriented chapter/book pages
- Local data source from `kjv_strongs.json` with full 66-book coverage
 - Local data source from `kjv_strongs.json` (full canon)

Key files:

- `app/bible/page.tsx`
- `app/bible/[book]/page.tsx`
- `app/bible/[book]/[chapter]/page.tsx`
- `lib/bible/data.ts`
- `kjv_strongs.json`

### Phase 3: Static Next.js Search

Implemented:

- Build-time search index generator from content datasets
- Weighted client-side ranking engine
- Type filters (all/article/bible/resource)
- Fast in-memory search experience
- Search analytics events:
  - `search_performed`
  - `search_result_click`

Key files:

- `scripts/build-search-index.mjs`
- `lib/search/ranking.ts`
- `lib/search/types.ts`
- `components/search/search-experience.tsx`
- `app/search/page.tsx`

## Operational Guidance

### Re-indexing for Content Updates

Run:

```bash
pnpm build:index
```

Or use existing scripts:

- `pnpm dev` (auto-runs indexing first)
- `pnpm build` (auto-runs indexing first)

### Lead Magnet Email Automation

`POST /api/lead-magnet/signup` emits payload to `LEAD_MAGNET_WEBHOOK_URL` if configured.

Expected payload fields:

- `email`
- `firstName`
- `source`
- `downloadUrl`

Use this webhook in your ESP/workflow tool to send the final branded email sequence.

### Bible Data Scaling

Current setup already uses full `kjv_strongs.json` chapter coverage.
The reader strips Strong's markers from verse text at render/search time for readability.
If you replace Bible source files later, keep the input contract compatible with:

- top-level object containing `metadata` and `verses`
- verse shape: `book_name`, `book`, `chapter`, `verse`, `text`

## Remaining High-Value Next Steps

1. Replace sample content with finalized production datasets and design assets.
2. Connect analytics events to your canonical stack (GA4, Segment, PostHog, etc.) and create funnel dashboards.
3. Add automated tests:
   - API route tests for signup/download
   - Search ranking unit tests
   - Playwright flow for lead magnet conversion and Bible navigation
4. Add robust email provider integration (Resend/SES/Postmark) for direct send fallback if webhook is unavailable.
5. Add incremental indexing automation in CI on content change.

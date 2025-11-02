# Aerolinks

Aerolinks is a “sexy”, 3D Linktree-style experience built with Next.js 14, React Three Fiber, and local JSONL analytics for creators.

## Quickstart

```bash
npm install
npm run dev
```

Open [`http://localhost:3000/?creator=1`](http://localhost:3000/?creator=1) to access the creator tools and statistics panel.

## Features

- Fullscreen 3D scene built with `three`, `@react-three/fiber`, and `@react-three/drei`
- Floating banners with glass, metal, and plate material presets
- Flip interaction revealing contextual information and “Open” button
- Node-powered JSONL analytics (`data/events.jsonl`) with Zod validation
- Creator-only statistics panel (toggle with the **Show statistics** button or press **S** when `?creator=1` is present)
- Graceful HTML fallback when WebGL is unavailable

## Analytics

- `POST /api/event` appends JSON lines (`page_view` / `banner_click`) into `data/events.jsonl`
- `GET /api/stats` aggregates totals, CTR, device mix, and top referrers
- Client generates a persistent `visitorId`, detects device type via `ua-parser-js`, and logs page views and banner clicks

### Resetting Stats

Delete the JSONL file:

```bash
rm -f data/events.jsonl
```

A new file will be created automatically on the next event.

## Scripts

- `npm run dev` — start Next.js in development mode on port 3000
- `npm run build` — build the production bundle
- `npm run start` — run the production server on port 3000
- `npm run lint` — placeholder lint script

## Project Structure

```
app/
  api/
    event/route.ts       # JSONL event ingestion
    stats/route.ts       # Aggregated analytics
  layout.tsx             # App Router root layout
  page.tsx               # 3D homepage + fallback
  shared/client.ts       # Analytics helpers (visitor ID, device, fetch)
components/
  Banner3D.tsx           # Floating banner mesh with flip interaction
  StatsPanel.tsx         # Creator-only statistics overlay
server/
  store.ts               # JSONL persistence & aggregation helpers
data/
  events.jsonl           # (ignored) analytics log
```

## Production Build

Ensure the app builds cleanly:

```bash
npm run build
```

All API routes run in the Node runtime so file system access is available in production.

# NetBox Mobile Scaffold Design

## Scope

Build a runnable PWA scaffold for a NetBox mobile companion. This iteration does not implement real NetBox business flows, authentication, querying, confirmation, or mutation.

## Architecture

The project uses a single Node/Express service. In development, Express loads Vite middleware; in production, it serves the Vite `dist/` output. The browser only talks to local `/api/...` routes so future NetBox tokens and permission rules stay in the BFF.

## Frontend

React renders a mobile-first application under `/m/...`. The first scaffold includes page shells for rooms, contracts, incidents, changes, and profile/status. Shared mobile components provide the header, bottom navigation, search field, and status badge.

## Backend

The backend exposes `/api/health` and `/api/netbox/status` as scaffold endpoints. `server/netboxClient.js` is the future integration boundary for NetBox REST or GraphQL calls.

## PWA

The scaffold includes a manifest, service worker, and mobile meta tags. The service worker caches only the shell assets and avoids caching API responses.

## Verification

The scaffold is verified with Node native tests for API helper behavior and server status shape, then `npm run build` for the Vite production bundle.

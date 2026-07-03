# NetBox Mobile Scan Auth Design

## Scope

This phase implements only the PWA scan authentication flow. It does not include device search, site search, inspection, incident registration, IP lookup, push notifications, or NetBox plugin work.

## Architecture

The React PWA renders `/mobile/...` authentication routes and talks only to `/mobile-api/...` through `authService`. The browser never stores NetBox passwords, usernames, API tokens, or fixed administrator credentials. Real security validation remains a backend responsibility; the first round includes a development Mock mode for UI and flow verification.

## Frontend Flow

`/mobile/` checks the session. Logged-out users go to `/mobile/login`; logged-in users go to `/mobile/home`; 403 responses go to `/mobile/forbidden`. The login page scans a short-lived pairing QR code, validates the basic JSON shape, submits it through `authService.pair`, then refreshes session state.

## QR Payload

The QR code contains only one-time pairing metadata: `type`, `pairing_id`, `nonce`, and `expires_at`. The frontend rejects invalid shape and expired timestamps, but final replay, permission, device, and expiry checks belong on the backend.

## Mock Mode

Development defaults to Mock mode unless `VITE_USE_MOCK=false`. Production uses Mock only when explicitly built with `VITE_USE_MOCK=true`; Mock must not be enabled in a real deployment.

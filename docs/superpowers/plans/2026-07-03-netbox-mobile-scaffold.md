# NetBox Mobile Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable React/Vite + Express + PWA scaffold for the NetBox mobile companion.

**Architecture:** A single Express service owns API routes and serves the frontend. React renders a mobile shell under `/m/...`, with NetBox integration isolated behind frontend and backend service modules.

**Tech Stack:** React 19, Vite 6, Express 4, native CSS, Node native test runner, PWA manifest and service worker.

---

### File Structure

- `package.json`: scripts and dependencies.
- `index.html`: Vite entry HTML with mobile and PWA metadata.
- `server.js`: Express development/production host.
- `server/status.js`: pure health/status summary logic.
- `server/netboxClient.js`: future NetBox BFF boundary.
- `src/main.jsx`: React entry and service worker registration.
- `src/App.jsx`: root route dispatch to the mobile app.
- `src/index.css`: global base styles.
- `src/services/netboxApi.js`: frontend API URL and request helper.
- `src/mobile/MobileApp.jsx`: mobile shell route selection.
- `src/mobile/mobile.css`: mobile-first layout and component styling.
- `src/mobile/components/*.jsx`: header, bottom nav, search, status badge.
- `src/mobile/pages/*.jsx`: empty module pages.
- `public/manifest.webmanifest`, `public/sw.js`, `public/pwa-icon.svg`: PWA shell.
- `test/*.test.mjs`: Node native tests for pure scaffold behavior.

### Task 1: Add Red Tests

- [x] Create tests for `createHealthPayload()` and `buildApiUrl()`.
- [x] Run `npm test` and confirm the tests fail because implementation modules are missing.

### Task 2: Add Backend Scaffold

- [x] Create `server/status.js`, `server/netboxClient.js`, and `server.js`.
- [x] Run `npm test` and confirm backend status tests pass once frontend helper exists.

### Task 3: Add Frontend Scaffold

- [x] Create React entry, mobile shell, components, and page shells.
- [x] Create CSS that supports phone-width layout with a constrained large-screen shell.

### Task 4: Add PWA Assets

- [x] Create manifest, service worker, and SVG icon.
- [x] Register the service worker from `src/main.jsx`.

### Task 5: Verify

- [x] Run `npm test`.
- [x] Run `npm run build`.

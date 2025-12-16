This repository is a small monorepo for a prototype Decentralized E-Government app.

- Architecture: client/ (React + Vite + Tailwind) and server/ (Express + MongoDB + Mongoose). The UI is a single-page React app; backend is an API server that exposes authentication and document endpoints used by the UI.
- Local dev workflow: run MongoDB locally, then start server and client in two terminals.
  - Start backend: cd server && npm install && npm run dev (uses nodemon)
  - Start frontend: cd client && npm install && npm run dev (Vite)
  - The client expects API at: http://localhost:5000/api (see client/src/App.jsx)

- Key files to inspect:
  - [server/server.js](../server/server.js): All backend models, routes, and middleware (authenticate) live here — quick place to add routes or adjust schemas.
  - [client/src/App.jsx](../client/src/App.jsx): Single-file app containing most React views/components and data flows. Read to follow state patterns.
  - [client/src/utils/shortenAddress.js](../client/src/utils/shortenAddress.js): Small utility pattern used across UI for wallet addresses.
  - [client/package.json](../client/package.json): dev scripts and dependencies (Vite/Tailwind/ethers). Use `npm run lint` to lint the client code.
  - [client/vite.config.js](../client/vite.config.js) and [client/tailwind.config.js](../client/tailwind.config.js): build and styling config.

- High-level data flows & patterns:
  - Authentication: POST /api/auth/register and POST /api/auth/login. Successful login returns { token, user } and the client stores `token` and `user` in localStorage and uses token in the `Authorization: Bearer <token>` header for protected endpoints.
  - Documents: GET /api/documents (protected), POST /api/documents/request (citizen), POST /api/documents/issue (institution), PATCH /api/documents/:id/verify (institution). Document statuses are 'pending', 'verified', and 'rejected'.
  - Document hashing: Server generates a unique hash `0x...` via `crypto.createHash('sha256')` in [server/server.js](../server/server.js) — this is the “document id” shown on the UI.

- Patterns & conventions to follow:
  - Roles: `citizen` vs `institution` — they determine which views/menus are shown in `App.jsx`.
  - Single-file UI: new small components are implemented as functions defined in `App.jsx`. For larger features, prefer extracting components into `client/src/components/` to keep `App.jsx` manageable.
  - Authentication: tokens are expected in `Authorization` header with `Bearer ` prefix. The `authenticate` middleware in `server/server.js` expects the token and sets `req.user` with `id`, `role`, `name`.
  - DB models are defined inline in `server/server.js` (User, Document). If you expand the backend, move models into `server/models` and import them in routes.

- Integration & external deps:
  - `ethers` is present in `client/package.json` but not used in the current UI. Blockchain interactions would be implemented in the client using `ethers` (connect to wallet, create/sign transactions) and optionally in the backend for server-side on-chain actions.
  - MongoDB: server expects a running MongoDB instance at mongodb://127.0.0.1:27017/egov_db (stored inline). When making production-ready changes, replace with environment variables.

- Developer notes & gotchas:
  - Secrets are hardcoded in `server/server.js` (JWT secret, MONGO_URI). For any pull request that includes secret management, replace them with environment variables and `.env` usage before merging.
  - The app uses direct fetch calls and localStorage for tokens; tests and mocks will need to set localStorage tokens or mock the fetch layer.
  - There are no tests currently — add tests in `client` or `server` as appropriate (hint: React Testing Library / Vitest for frontend, Jest or supertest for backend).

- How to add new backend endpoints:
  1. Add/extend a Mongoose schema in [server/server.js](../server/server.js) or create a new model in `server/models/.`.
  2. Add a route under an appropriate URL and apply `authenticate` middleware for protected routes.
  3. Use consistent response shape (json objects) — current code returns errors/messages in a tiny inline pattern (e.g., { message, error }).
  4. Update frontend `client/src/App.jsx` to consume the new endpoint via `fetch`, using `localStorage.getItem('token')` for protected calls.

- Small examples in this repo you can copy:
  - Fetch protected list of documents (used by Dashboard):
    - `await fetch(`${API_URL}/documents`, { headers: { 'Authorization': `Bearer ${token}` } })`
  - Verify a document: PATCH with Authorization and JSON body `{ status }`.

- When submitting PRs / debugging, review console outputs:
  - Server logs DB connection messages and errors to console in English & Indonesian in [server/server.js](../server/server.js).
  - Client relies heavily on alerts / console logs for error cases; check browser console for details.

If anything in this summary is unclear or you want more examples (e.g., extracting components, adding tests, or connecting `ethers` to a specific wallet provider), tell me what part you'd like expanded.

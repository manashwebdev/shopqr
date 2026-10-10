# ShopQR
QR menu & catalog SaaS. Next.js 15 · Express · MongoDB · Gemini · Cloudinary.

## Run locally (Node 22+)
1. `npm run install:all`
2. Put the server values from `.env.example` in `server/.env`, and the client value in `client/.env.local`
3. `npm run dev:server` and `npm run dev:client` → http://localhost:3000
4. A demo shop is seeded at `/shop/demo`. Enter `ADMIN_CODE` under Account → Admin access to become admin.

## Publish
- **Database:** MongoDB Atlas free cluster → `MONGO_URI`
- **API:** Render (`render.yaml` included) → set env vars, copy the URL
- **Web:** Vercel, root directory `client`, env `NEXT_PUBLIC_API=<render url>`; then set `CLIENT_ORIGIN` on Render to the Vercel URL
- **AI:** `GEMINI_API_KEY` from Google AI Studio (falls back to a template if missing)

## Plans
Free = 12 products, Pro = unlimited. Admins switch plans via `PATCH /api/admin/shop/:slug {"plan":"pro"}`.
Payments (Razorpay/Stripe) are the one piece still to wire before charging.

## Structure
- `server/src/index.js` — Express API (auth, shop CRUD, uploads, Gemini, public + analytics routes)
- `client/app` — routes: landing, `/dashboard`, `/shop/[slug]` (with SEO metadata)
- `client/components/dashboard` — one component per dashboard section, shared UI in `shared.tsx`
- `client/lib` — API client, QR generator
- `docker-compose.yml` — local API + MongoDB (`docker compose up`); `.github/workflows/ci.yml` — build check

## Deploy checklist (do in this order)
1. **MongoDB Atlas:** create a free cluster, add a database user, and under Network Access allow `0.0.0.0/0` (Render has no fixed IP). Copy the `mongodb+srv://` string.
2. **Render (API):** new Blueprint from this repo. Set `MONGO_URI`, `GEMINI_API_KEY`, `CLOUDINARY_URL`, `ADMIN_CODE`. Leave `CLIENT_ORIGIN` empty for now. Open `<api-url>/api/health` — it must say `{"ok":true}`.
3. **Vercel (web):** import the repo, Root Directory `client`, env `NEXT_PUBLIC_API=<api-url>` (no trailing slash), deploy.
4. **Back on Render:** set `CLIENT_ORIGIN=<vercel-url>` and redeploy.
5. **Verify:** `node server/smoke.mjs <api-url>` — all lines should show ✓. Then register in the browser and create a shop.
Use Cloudinary in production: without it, images are stored inside MongoDB.

## Security model
- Passwords: bcrypt (cost 12), 8–72 chars with a letter and a number; accounts lock for 15 min after 5 wrong attempts; login/register are rate-limited.
- Sessions: 7-day signed JWTs checked against the database on every request. Changing your password or "Sign out of all devices" instantly invalidates every existing token.
- Authorization: every shop read/write is scoped to the signed-in owner's id; admin rights are checked in the database, not the token; the admin code is compared in constant time.
- Input: string-only fields (blocks NoSQL operator injection), validated product ids, strict CORS, security headers (helmet + Next headers), 6 MB body cap.
- Not included yet: email verification and "forgot password" (both need an email provider such as Resend or Brevo).

# CLAUDE.md — Luke 14 Ministries website & registration platform

Read this before touching anything. It is the standing brief for any Claude session working in
this repository, and it outranks assumptions carried in from other Next.js projects.

---

## What this project is

Luke 14 Ministries is a disability ministry in Morristown, Tennessee — a registered 501(c)(3).
This repository is the ministry's public website **and**, from Phase 1 onward, its own camp
registration platform.

The reason the platform is being built rather than bought: the ministry currently pays
**Campsite 6% on every transaction**. Replacing that is the entire financial case. Vendors are
used only where they carry real risk we should not: payments (Stripe), database and auth
(Supabase), hosting (Vercel), DNS and edge protection (Cloudflare), identity and documents
(Microsoft 365).

Two constraints shape every decision:

1. **A volunteer built this, and a volunteer has to be able to maintain it.** Prefer the boring,
   well-documented option over the clever one. Explain *why* in comments and in `DECISIONS.md`.
2. **It must be live before next camp season's registration opens**, and the maintainer's
   availability drops sharply once the academic semester starts. Front-load. Do not start
   architectural rewrites in October.

The full reasoning lives in `IMPLEMENTATION-PLAN.md` (SharePoint, `01 Plans and Decisions`).
The working checklist is `DO-THIS-NEXT.md` (SharePoint, `02 Accounts and Setup`).

---

## Stack

Next.js (App Router, JavaScript — not TypeScript), Tailwind CSS, deployed on Vercel.
Supabase (Postgres + Auth) from Phase 1. Stripe from Phase 2.

`app/` holds routes, `components/` shared UI, `lib/` helpers, `public/` static assets.

---

## Blocking facts — read these before writing code

### `output: 'export'` must come out of `next.config.mjs` first

The current config is a **static export** aimed at GitHub Pages:

```js
output: 'export',
trailingSlash: true,
basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
images: { unoptimized: true },
```

`output: 'export'` compiles the site to flat HTML. It disables **all** server code — no API
routes, no server actions, no database calls, no Stripe. Every single item in Phase 1 is blocked
until it is removed. `basePath` and `images: { unoptimized: true }` are Pages accommodations too
and can go at the same time.

Removing it is the first commit of the Phase 1 sprint, not a later cleanup.

### `NEXT_PUBLIC_BASE_PATH` must stay **unset** on Vercel

It exists so GitHub Pages can serve the site from a subfolder. Setting it on Vercel breaks every
link and every image, and it fails in a way that looks like a CSS problem rather than a config
problem — which is how it eats an afternoon. Leave it out of the Vercel environment variables
entirely.

### The site is deliberately hidden from search engines — do not "fix" this

Three switches, all intentional while this is a preview:

- `public/robots.txt` — `Disallow: /`
- `app/layout.jsx` — `robots: { index: false, follow: false }`
- `app/layout.jsx` — the title suffix `"(Preview Build)"`
- `components/PreviewBanner.jsx` — the red PREVIEW banner

**All four are reversed together in Phase 4, at launch, and only with board approval.** Reversing
any of them early publishes a mock-up as if it were the real site. Forgetting one at launch fails
*silently* — the site simply never appears in search results and nobody notices for months. Treat
it as a single four-part checklist item.

---

## Security rules — non-negotiable

These are the ministry's rules, agreed at board level. Do not relax them for convenience.

- **No secret ever enters this repository, OneDrive, or SharePoint.** Not in a commit, not in a
  comment, not "temporarily." Keys live in Vercel's environment variables plus the shared
  password vault. `.env.local` is gitignored; `.env.example` is the committed template and
  contains names only, never values.
- **Test keys only until launch.** Fake money, throwaway data. Live Stripe keys appear once, at
  go-live, and only in Vercel's environment settings.
- **The Supabase `service_role` / secret key bypasses row-level security entirely.** It never
  goes in the browser, in this repository, in SharePoint, or in a chat transcript. Server-side
  only, from an environment variable, and only where genuinely required.
- **Row-level security is enforced at the database level**, not in application code. Every table
  holding family data gets RLS policies. A query that works because the app "wouldn't ask for
  that row" is not secured.
- **No real family data in the preview.** It is a mock-up, and mock-ups leak.
- **Background-check paperwork never touches this system.** The database stores a boolean and a
  date — `background_check_on_file`, `background_check_date`. The documents themselves live in a
  permission-restricted SharePoint folder. Never in email, never in the app.
- **Never paste a key, token, or camper's personal information into a Claude conversation.** A
  secret that appears in a transcript is compromised and must be rotated.
- **Two-factor authentication on every account** — GitHub, Vercel, Supabase, Stripe, Microsoft.
  Prefer authenticator-app (TOTP) over passkeys on shared ministry accounts: a passkey is bound
  to one device and cannot be shared between two admins; a TOTP seed can live in the vault.

---

## Working rules

- **Never let OneDrive or SharePoint sync this repository.** It corrupts `.git`. The working copy
  lives at `C:\dev\luke14` for exactly this reason. Documents go to SharePoint; code does not.
- **Ownership is the ministry's, not a person's.** Production accounts are created under
  `admin@luke14ministries.net`. Never bind a ministry account to a personal GitHub login, and
  never add `admin@` as a verified email on a personal GitHub account.
- **Do not point the domain.** `luke14ministries.net` still serves the existing WordPress site.
  Pointing it retires that site, which is a board decision, not a technical step. Phase 4.
- **Record decisions in `DECISIONS.md`** — one short entry per real choice, written when the
  choice is made. In six months it is the only record of why anything is the way it is.
- **Commit in small, described steps.** The commit log is documentation for a future volunteer.
- **Ask before adding a dependency.** Every package is something someone has to keep updated.
- Commit identity is the ministry account, not a personal address. Check `git config user.email`
  if commits start showing up attributed oddly.

---

## Phase roadmap (short form)

- **Phase 0 — now.** Accounts, ownership, vault, register, governance. Mostly not code.
- **Phase 1 — August sprint.** Remove `output: 'export'`. Stand up the Supabase schema with RLS.
  Family sign-up and login. Wire the existing registration form to real storage. Stripe in
  **test mode**, end to end, with fake money.
- **Phase 2.** Admin views for staff: rosters, payment status, the background-check flag.
- **Phase 3.** Review by real people on the preview URL. Still test keys, still no real families.
- **Phase 4 — launch.** Vercel Pro, live Stripe keys, domain pointed, PREVIEW banner removed,
  all three noindex switches reversed. Board approval gates this phase.

Sections 5 and 9 of `IMPLEMENTATION-PLAN.md` describe Phase 1 in full.

---

## Hosting note

Vercel's free **Hobby** plan is the right plan for building, and it is legitimate for Phases 1–3.
It is **not** legitimate at launch: Hobby is non-commercial only, and Vercel's fair-use terms
count "any method of requesting or processing payment from visitors of the site," adding
explicitly that asking for donations counts too. Being a 501(c)(3) does not change it — the test
is what the site *does*. Hobby is also a single seat, which conflicts with the two-admins-on-
everything rule. **Pro ($20/developer seat/month, viewer seats free) becomes necessary the moment
Stripe switches to live keys.** Plan §8 has the full reasoning.

---

## Where the documentation lives

- `IMPLEMENTATION-PLAN.md` — why, and the full phase plan. SharePoint, `01 Plans and Decisions`.
- `DO-THIS-NEXT.md` — the ordered working checklist. SharePoint, `02 Accounts and Setup`.
- `Luke14-Account-Register.xlsx` — every account, who owns it, who the second admin is. No
  passwords, ever. SharePoint, `02 Accounts and Setup`.
- Web-admin handbook — SharePoint, for the second admin.
- `CONTRIBUTING.md` — repository conventions.
- `DECISIONS.md` — the running decision log.

---

*Last updated 4 August 2026.*

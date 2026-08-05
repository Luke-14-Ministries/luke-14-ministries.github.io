# Decisions

One short entry per real choice, written when the choice is made. In six months this is the only
record of why anything is the way it is — including the things that look odd and are deliberate.

**How to use it.** Add new entries at the bottom, newest last. Each entry gets a date, a one-line
title, what was decided, and — the part that actually matters — *why*, and what the alternative was.
An entry that only records what was decided is half an entry: the next person needs to know whether
the reasoning still holds before they undo it.

Decisions that carry a real risk of being "fixed" by someone who does not know the reason are
marked **Do not reverse without reading this.**

The first several entries below were made between late July and 4 August 2026 and were written up
together on 4 August, which is why they share a date.

---

## 2026-08-04 — Build the registration platform rather than continue renting one

The ministry pays Campsite 6% on every transaction. On camp registration volume that is the single
largest avoidable cost in the operation, and it recurs every season forever. Building the platform
replaces that with Stripe's per-transaction rate — 2.9% + 30¢ on cards, or 0.8% capped at $5 by
bank transfer — plus roughly $45/month of hosting and database at launch. *(This entry originally
said 2.2% on Stripe's nonprofit rate. That was wrong; see the entry below dated the same day.)*

Vendors are still used, but only where they carry risk the ministry should not: payments (Stripe),
database and authentication (Supabase), hosting (Vercel), DNS and edge protection (Cloudflare),
identity and documents (Microsoft 365). The rule is that we do not hand-roll anything that would
make us liable for other people's money or other people's children's data.

*Alternative considered:* staying on Campsite. Cheaper in effort, and it stays cheaper right up
until you multiply 6% by the number of seasons remaining.

---

## 2026-08-04 — Production accounts are created under `admin@luke14ministries.net`

`admin@` is a Microsoft 365 distribution group forwarding to `lawrence@` and `larry@`. It has no
mailbox, no password, and no shared login. Every vendor account — Vercel, Supabase, Cloudflare,
Stripe — is registered to it.

The reason is ownership. An account created under a personal address belongs to that person, and
recovering it later means asking that person, who may by then have left, changed email, or lost the
phone. With `admin@`, a password-reset email arrives in both admins' inboxes and either one can
complete a recovery without the other.

The corollary is that a reset email nobody requested is an alarm rather than spam, and that
two-factor on `lawrence@` and `larry@` themselves matters as much as two-factor on the vendors —
either mailbox is enough to take over any vendor account.

**Never sign up with "Sign in with GitHub."** Vercel and Supabase both offer it and it is the faster
path, but it quietly binds the account to a personal GitHub login, which is the exact problem this
address exists to solve.

---

## 2026-08-04 — Two-factor uses authenticator apps (TOTP), not passkeys, on shared accounts

A passkey is bound to one device and cannot be shared between two admins. A TOTP seed can live in
the shared vault, where both admins can generate codes from it. On accounts the ministry owns
jointly, that difference decides it.

This is also why setting up the password vault is a genuinely blocking task rather than a tidy-up
one: until it exists, each vendor's authenticator seed sits on exactly one phone, and the printed
recovery codes are the only way back in if that phone is lost. Save those codes at the moment each
account is created.

SMS two-factor is not an option here either — there is no phone number attached to `admin@` to
share. And email-code two-factor is actively wrong on these accounts, because the code would arrive
in the same inbox as the login link.

---

## 2026-08-04 — The site is hosted on Vercel; GitHub Pages is being retired

GitHub Pages serves static files only. Every item in Phase 1 — family sign-up, login, storing a
registration, taking a payment — needs server-side code, which Pages cannot run at all. Vercel runs
the same Next.js application with the server side intact, rebuilds on every push, and costs nothing
during development.

This leaves the repository with a Pages-shaped name, `luke-14-ministries.github.io`. That name is a
Pages *instruction* rather than a description: a repository named `<org>.github.io` is served at the
organization root, which is also the reason `basePath` exists in the Next config. The repository
will be renamed to something ordinary once Pages is switched off, in that order — renaming it first
turns Pages off abruptly.

---

## 2026-08-04 — The preview URL is `luke14-ministries.vercel.app`, and it is public

**Do not reverse without reading this.**

There have been two preview addresses in circulation, which is confusing enough to be worth
recording. The Vercel production address is the one to share.

Vercel's deployment protection is switched on and its label — "all except custom domains" — reads as
though the production address is behind a login. It is not. Tested in a private browser window on
4 August 2026: `luke14-ministries.vercel.app` loads for anyone with the link. What deployment
protection actually gates is the *per-deployment* URLs, the long ones generated for each individual
build and each branch.

Two consequences follow. The board can be sent the production address directly. And during Phase 1,
a reviewer who is not a paid Vercel seat cannot open a branch preview at all — they can only see
what has been merged to `main`. On the free Hobby plan there is one seat, so that reviewer is
everyone except Lawrence. It resolves at launch, when Pro's viewer seats (free) become available.

The site stays out of search results because of the noindex switches, not because of any password.

---

## 2026-08-04 — The site is deliberately hidden from search engines until launch

**Do not reverse without reading this.**

Four switches, all intentional while this is a preview: `Disallow: /` in `public/robots.txt`;
`robots: { index: false, follow: false }` in `app/layout.jsx`; the `"(Preview Build)"` title suffix
in the same file; and the red banner in `components/PreviewBanner.jsx`.

They are one four-part checklist item, reversed together at launch in Phase 4, and only with board
approval. Reversing any of them early publishes a mock-up as if it were the finished site.
Forgetting one at launch fails *silently* — the site simply never appears in search results, and
nobody notices for months.

---

## 2026-08-04 — Vercel stays on the free Hobby plan until go-live, then moves to Pro

Hobby is the right plan for building and is legitimate for Phases 1 through 3. It is not legitimate
at launch: Vercel's fair-use terms restrict Hobby to non-commercial use and count "any method of
requesting or processing payment from visitors of the site," adding explicitly that asking for
donations counts too. Being a 501(c)(3) does not change it — the test is what the site *does*, not
what the organization is.

Hobby is also a single seat, which conflicts with the two-admins-on-everything rule.

The trigger for upgrading is therefore the moment live Stripe keys go in, not a date. Pro is $20 per
developer seat per month; viewer seats are free.

---

## 2026-08-04 — `NEXT_PUBLIC_BASE_PATH` stays unset on Vercel

**Do not reverse without reading this.**

The variable exists so GitHub Pages can serve the site from a subfolder. Setting it on Vercel breaks
every internal link and every image — and it fails in a way that looks like a broken stylesheet
rather than a configuration mistake, which is how it costs an afternoon. It is deliberately absent
from Vercel's environment variables rather than set to an empty string, so there is nothing there to
be "corrected" later.

---

## 2026-08-04 — The ministry's Cloudflare account is `Admin@luke14ministries.net's Account`

**Do not reverse without reading this.**

Cloudflare creates a personal default account for every user automatically at signup. So
`Lawrence@luke14ministries.net's Account` exists alongside the ministry's, was not created on
purpose, and cannot be tidily deleted. It is empty and should stay empty.

The risk is specific: "Add a site" drops the domain into whichever account happens to be selected.
If that is the personal one, the ministry's DNS ends up under a personal identity — exactly the
failure mode `admin@` exists to prevent, and unpleasant to unwind once nameservers point at it.

The rule: the ministry's zone, when it eventually exists, belongs to
`Admin@luke14ministries.net's Account`. The personal accounts are ignored.

Cloudflare's "Organizations" layer is a beta feature for companies managing many accounts. It adds
nothing here and is not used.

---

## 2026-08-04 — Both Cloudflare admins get Super Administrator, not a narrower role

Cloudflare's free plan offers a full catalogue of scoped roles, so least privilege was available and
was considered. It was rejected on purpose.

Least privilege protects against a compromised or careless *account*. The failure mode this project
actually faces is different: one of two admins being unreachable when something needs doing. A
narrower role does not reduce that risk, it increases it, because the remaining admin discovers the
gap at the worst possible moment. The audit-log benefit people usually want from scoped roles —
knowing *who* did something — is fully preserved here by each admin having their own login rather
than sharing `admin@`.

Note that Cloudflare's list contains read-only roles with names nearly identical to the full ones.
The role to select reads **Super Administrator — All Privileges**.

A third volunteer, if one appears, is a different case: a scoped read-only role would suit them, and
those are free.

---

## 2026-08-04 — The domain is not pointed, and Cloudflare's "Add a site" is not run

**Do not reverse without reading this.**

`luke14ministries.net` still serves the existing WordPress site. Pointing it retires that site,
which is a board decision rather than a technical step, and it happens in Phase 4.

Worth stating separately because it does not look like the same decision: Cloudflare's "Add a site"
flow *is* pointing the domain. It ends at "change your nameservers at your registrar." The
Cloudflare account therefore stays empty — no zone — until Phase 4.

It is also possible the domain is already on Cloudflare via the current WordPress host, in which
case the eventual move is a zone transfer between accounts rather than a fresh add. That depends on
the still-outstanding question of which registrar holds the domain.

---

## 2026-08-04 — Password vault: Bitwarden Families is the working choice, not yet committed

Bitwarden Families, $47.88/year, up to six users with premium features for every member. The
requirement that decides it is that *both* admins must be able to generate a two-factor code
without phoning the other one. Bitwarden Free has no built-in authenticator at all; Bitwarden
Premium at $19.80/year covers exactly one user, which is the same single point of failure in a
nicer wrapper. 1Password Families is comparable at $53.88/year with no free tier; its nonprofit
program is real but commits to nothing specific in writing.

**Emergency Access is not the reason to buy either one.** It sounds like the answer to "what if one
admin is unreachable," and it is not: Bitwarden's Emergency Access reaches only the grantor's
*personal* vault, not the shared organization collection where the ministry's credentials live.
Bitwarden's own answer for shared credentials is organization account recovery, a Teams/Enterprise
feature and out of scope.

Resilience comes from three ordinary things instead: both admins holding the shared collection live
as owners; each account's recovery codes printed and stored offline in two separate places; and a
periodic encrypted vault export on offline media — **never** in OneDrive or SharePoint, because an
encrypted export is still a secret.

Whichever is chosen is billed to the ministry, on `admin@`, and recorded in the account register.

---

## 2026-08-04 — Secrets never enter this repository, OneDrive, or SharePoint

**Do not reverse without reading this.**

Keys live in Vercel's environment variables plus the shared password vault. `.env.local` is
gitignored; `.env.example` is the committed template and contains names only, never values.

Everything is built with Stripe **test** keys and fake data until launch. Live keys appear once, at
go-live, and only in Vercel's environment settings.

The Supabase `service_role` / secret key bypasses row-level security entirely. Server-side only,
from an environment variable, and only where genuinely required — never in the browser, the
repository, SharePoint, or a chat transcript. A secret that appears in a transcript is compromised
and must be rotated.

Row-level security is enforced at the database level rather than in application code. A query that
returns the right rows because the application "would not ask for that row" is not secured.

Background-check paperwork never touches this system: the database stores a boolean and a date, and
the documents live in a permission-restricted SharePoint folder.

---

## 2026-08-04 — Neither Stripe's nor PayPal's nonprofit rate applies to camp registration

**Do not reverse without reading this.**

Recorded because it corrects an assumption that had been repeated through the plan and the
checklist for weeks, and because someone will otherwise "discover" the nonprofit rate again and
re-run the same dead end.

Stripe's discounted rate of 2.2% + 30¢ is for **donations**. Eligibility requires that more than
**80% of the account's payment volume be tax-deductible gifts**, and Stripe names ticket sales and
similar non-gift revenue as not qualifying. A camp registration is a fee for a service the family
receives, so a registration account fails the test. Applying would waste the review and return a
refusal.

PayPal's confirmed-charity rate of 1.99% + 49¢ is subject to the same kind of limit in vaguer
language: its Confirmed Charity terms say "Not all Payment Types are eligible for charity
transaction pricing," and its help material describes the rate around donation products. Square
publishes no nonprofit rate at all.

**The planning number for registration is therefore 2.9% + 30¢.** The project's case is unharmed —
that is still under half of Campsite's 6% — but the plan should not quote a rate the ministry will
never be charged. Checked against each vendor's published terms on 4 August 2026.

One open item follows from this: ask PayPal in writing whether the charity rate would cover
registration fees. If it does, PayPal is $6.46 on a $300 registration against Stripe's $9.00, which
is worth re-examining on real volume.

---

## 2026-08-04 — Stripe for registration; PayPal keeps donations; Square keeps in-person

The ministry already used PayPal and Square, so adding Stripe needed a reason better than developer
preference. On price there is barely a reason at all: on a $300 registration Stripe's card fee is
$9.00 and PayPal's Advanced Checkout is $8.96. Anyone claiming a decisive price win either way is
rounding in their own favour.

Stripe was chosen for **registration** on everything other than rate: it is built to be embedded in
someone else's application, which is precisely what this project is; its webhooks are what let the
roster mark itself paid without staff reconciling anything; it has a complete test mode with fake
money, which is the single feature that makes it safe for one volunteer to build a payment flow;
and its documentation is good enough that the next maintainer has a chance. It also offers **bank
transfer at 0.8% capped at $5** in the same checkout — $2.40 on a $300 registration against $18.00
on Campsite — which is the largest saving available anywhere in this project and larger than any
difference between card processors.

**PayPal keeps donations.** Its charity rate of 1.99% + 49¢ genuinely beats Stripe on gifts, and
donors already have accounts and trust the button. Moving gifts to a processor that charges more
for them would be a mistake.

**Square keeps in-person.** At 2.6% + 15¢ it beats every online rate here, and the hardware is
already bought. Square's online rate of 3.3% + 30¢ on the free plan is the worst in the comparison,
which is why it is not the answer for registration.

*Cost of this decision, stated plainly:* three sets of deposits to reconcile rather than one. It is
kept manageable only by the discipline of one purpose per processor. Taking registrations on PayPal
some season because it was quicker is what turns three tidy streams into a reconciliation problem.

*Alternative considered:* consolidating everything onto one processor for the treasurer's sake and
accepting a worse rate somewhere. That is a legitimate board choice and it remains available — but
it should be made deliberately, not by drift.

Reasoning in full: Implementation Plan §3b.

---

## 2026-08-04 — The working copy lives at `C:\dev\luke14`, outside OneDrive

**Do not reverse without reading this.**

OneDrive and SharePoint sync corrupts `.git`. The repository was moved out of OneDrive for exactly
this reason and must not be moved back, and no clone should be made inside a synced folder.

Documents go to SharePoint. Code does not.

---

## 2026-08-05 — The registrar never goes inside the hosting account; Cloudflare is deferred, not rejected

**Do not reverse without reading this.**

The question was whether the registrar line can be absorbed by a vendor already on the list.
Checked 5 August 2026: **GitHub does not sell domains at all.** **Vercel does**, passing registry
pricing through, but provides no email service for domains registered with it. **Cloudflare
Registrar does**, genuinely at cost — Cloudflare states it "does not mark up domain prices at all"
— which for `.net` is about $11/year against WordPress.com's $14 and a typical registrar's $15–20.

Consolidating would therefore save roughly **$3 to $9 a year**, against a project whose financial
case is measured in thousands of dollars of transaction fees. That is not a number worth optimising,
and two arguments run the other way.

**The registrar is the vendor you need reachable when another vendor fails.** The domain is the
lever that lets the ministry move: if Vercel has an outage, a billing dispute, or an account
lockout, the recovery is to re-point the domain elsewhere. If the domain lives inside the locked
account, that recovery is gone. **And the domain outlives every technical decision here** — hosting,
database and framework may all change over a decade; `luke14ministries.net` should not have to move
each time.

There is also a timing trap worth recording. **Transferring to Cloudflare Registrar requires the
domain to use Cloudflare for authoritative DNS first** — Cloudflare's documentation is explicit that
you must add the domain to Cloudflare before you can transfer it. Adding the domain means changing
nameservers, which *is* pointing the domain away from the current WordPress site. **A registrar
transfer to Cloudflare is the domain switch wearing a different hat**, and the domain switch is a
board decision in Phase 4. Anyone who treats it as tidy-up housekeeping will retire the ministry's
live website by accident.

*Alternative considered:* moving to Cloudflare Registrar at Phase 4, when the domain is being
pointed anyway and the nameserver requirement costs nothing extra. That remains genuinely open and
is a reasonable thing to do — it is only the *sequencing* that is decided here.

*What is not decided:* where the domain currently is. Tracing that, and getting the ministry onto
that account on `admin@` with 2FA, is Phase 0 work and blocks GitHub domain verification and the
launch DNS change. Reasoning in full: Implementation Plan §8.

---

## 2026-08-05 — Background checks are an open question, not a requirement

Earlier drafts of the plan treated volunteer background checks as settled, with a design rule
attached: the database stores only `background_check_on_file` and `background_check_date`, while the
paperwork lives in a permission-restricted SharePoint folder. That rule appeared in the
Implementation Plan, `CLAUDE.md`, `CONTRIBUTING.md`, the board packet and the phase roadmap.

Traced on 5 August 2026, the requirement came from **one line in the July 2026 decision brief** —
"volunteer applications: application form, the $495/week volunteer fee, and coordination with
background-check paperwork" — plus a second line about sensitive paperwork belonging in
access-controlled storage. Nobody at the ministry has confirmed that Luke 14 runs background checks
today or intends to. An assumption load-bearing in five documents should not rest on one line of a
superseded draft.

**Decided:** the design rule is kept — it is the right answer *if* checks exist, and it costs
nothing to hold in reserve — but it is now labelled unconfirmed everywhere it appears, and **Phase 2
builds the volunteer application without a background-check field unless the ministry confirms
otherwise.** The question is on the open list (Implementation Plan §11, question 7).

*Why this matters beyond the field itself:* building storage for a compliance process the ministry
does not actually run creates an appearance of compliance that nobody is maintaining, which is worse
than not having the field.

---

## 2026-08-05 — Clarification: the registrar rule is about Vercel, not Cloudflare

The entry above was read as advising against Cloudflare Registrar. It was not meant to, and the
distinction is worth pinning down because the two vendors sit in completely different positions.

**The rule is: the domain must not live inside the account that hosts the site.** That account is
**Vercel**. The domain is the lever used to recover from a lockout, an outage or a billing dispute
at the host; if it lives inside the locked account, there is no lever. This part is a permanent
rule and should not be revisited.

**Cloudflare is not the host.** It is DNS and edge protection — the place you would re-point
*toward*, not away from. Its registrar sells at cost with no renewal markup, which makes it the
best-priced option in the comparison and perfectly defensible on the principle above. The only
reason it is not the answer today is **timing**: Cloudflare requires the domain to use its
nameservers before it will accept a transfer, so moving the registration there is the domain switch
performed under another name. That is a Phase 4 board decision.

**Named independent alternative, if one is ever wanted: Porkbun** — `.net` at $12.52 for both
registration and renewal, free WHOIS privacy, SSL and email forwarding, and no relationship to any
other vendor in this stack. Namecheap ($18.58) is the more conservative, better-known option. This
only becomes relevant if the domain turns out to sit somewhere the ministry cannot reach, in which
case moving it to a neutral registrar is a clean step that touches neither DNS nor the live
WordPress site.

*Alternative considered:* leaving the earlier entry as written. Rejected because it stated the
conclusion for two vendors that deserve different answers, and a decision log that blurs a
distinction is how the wrong lesson gets carried forward.

---

## 2026-08-05 — Campsite's cost is two-part, and the fixed half is the larger half

Every earlier version of the plan justified this project on Campsite's **6% transaction rate**
alone. Checked 5 August 2026 across **GetApp, Software Advice, Capterra and Software Finder**, all
four independently list Campsite at **$249 per month**, flat, with no free tier and no free trial.
Software Finder adds implementation at $500–$3,000, migration at $200–$1,000 and custom development
at $100–$200/hr.

**The consequence:** Campsite's fixed cost is roughly **$2,988 a year**, against about **$540 a
year** for everything we are building. The ministry is about **$2,448 a year** better off before a
single registration is processed. Total annual cost at $300 average registrations: at $25,000 of
volume, $4,488 versus $1,290 by card or $740 by bank transfer; at $50,000, $5,988 versus $2,040 or
$941; at $100,000, $8,988 versus $3,540 or $1,340.

**Why this is recorded as a decision and not just a fact:** it changes how the project is
justified. The 6%-only framing made the saving proportional to volume, which implied a quiet
threshold below which the build was not worth doing. A fixed annual platform fee removes that
threshold — the project pays for itself at essentially any volume, including a season with none.
Anyone presenting this to the board should lead with the fixed cost, not the percentage.

**The honest limit on all of it:** none of the four sources is Campsite's own price list, and
Campsite does not publish one. Directory listings go stale and cannot show a legacy or negotiated
rate. **$249/month is a working figure until the ministry's invoice confirms it**, and getting that
invoice is now an item in Do This Next. If the 6% turns out to be all-inclusive, the earlier
framing was right and this entry should be amended rather than deleted.

*Alternative considered:* waiting for the invoice before writing any of it down. Rejected — four
sources agreeing is enough to plan against, and an unrecorded finding is one that gets rediscovered
from scratch in three months.

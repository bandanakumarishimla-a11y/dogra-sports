# Verification — Dogra Sports

Checked on 3 October 2026.

## Passed

- Next.js production compilation and TypeScript checks.
- Production route checks: homepage, catalogue, product detail, custom team kits, bulk orders, about, gallery, contact, privacy, terms, shipping, returns and admin all respond 200; nonexistent route responds 404.
- Sitemap and robots return 200. The sitemap revalidates every five minutes.
- The public Supabase catalogue returns the eight labelled sample ranges.
- Cloud browser verifies the live Vercel homepage, loaded hero image, desktop navigation and no application error overlay. One console error originated from the browser's own extension, not website code.
- Browser search for “batting” shows one batting-glove range; Sportswear category shows custom team jerseys.
- Product-detail enquiry link opens contact with the selected product prefilled.
- A synthetic browser contact enquiry shows a saved confirmation; its test record was confirmed in Supabase.
- Production API test saves a valid team-kit enquiry with a PNG attachment (201). Invalid phone and a falsely labelled PNG are rejected (400).
- After five synthetic requests using the same phone within one hour, additional requests return 429.
- Read-only grants and policy checks confirm anonymous users cannot SELECT customer enquiries or UPDATE store settings; published catalogue SELECT is permitted. Authenticated write policies require admin membership.
- Supabase security advisors return no findings after permission hardening.
- `npm audit --omit=dev` reports zero production dependency vulnerabilities.

## Limits and setup pending

- The desktop screenshot is `homepage-preview.jpg`.
- Mobile layouts and menu are implemented with responsive breakpoints, but narrow-viewport visual verification could not be completed: the local browser runtime was unavailable and the cloud browser blocked the responsive test document. Do not treat mobile visual QA as passed.
- Approved-admin sign-in and authenticated dashboard operations require the owner to activate a staff account. They are implemented and typechecked, but not verified with an approved staff identity. Authentication-user lookup was blocked by automatic approval review; no private authentication records were accessed.
- Public mutation probes were rejected by automatic review. Access-control verification used the safer read-only grants/policy inspection instead.
- Synthetic test enquiries are clearly named “Website QA Test” with phone +910000000001. Deletion was declined; the test rows are retained and can be reviewed by the owner. No real customer requests were touched.
- Product imagery, verified prices/stock, gallery photos, the confirmed WhatsApp number and final order policies still need owner content.
- Vercel's connected deployment tool was unavailable. The authenticated CLI has no login. A temporary Vercel deployment was verified, but permanent deployment into the user's Dogra Sports team still needs browser fallback approval or the user's own import/claim action.

The temporary responsive test fixture is excluded from the GitHub source. The store source remains ready for a Next.js Vercel import.

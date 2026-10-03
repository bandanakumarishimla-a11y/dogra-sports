# Dogra Sports

Premium responsive sports storefront for Dogra Sports, near ITI Bilaspur, 6-B Industrial Area, Sadar, Bilaspur (209), Bilaspur, Himachal Pradesh 174001.

## Stack and functionality

Next.js 16 App Router, TypeScript, Tailwind CSS, Supabase Postgres/Auth/Storage, and Vercel.

- Homepage, catalogue with search/category/brand/size/price filters, product details and related products.
- Custom team kit, bulk/institutional, product and general enquiries with validated optional PNG/JPG/PDF attachments (2 MB).
- Customer requests persist in Supabase; private attachments are stored with enquiries and downloadable only by approved admins.
- Secure admin sign-in, product creation/editing/deletion, photo uploads, publication and featured status, enquiry status management, banner text, gallery and policy editing.
- About, contact, gallery, privacy, terms, shipping and returns pages; accessible mobile navigation, click-to-call, sitemap, robots and local business structured data.
- A WhatsApp button is enabled only after a confirmed number is configured in the admin dashboard. Until then, a call button is shown.
- Enquiry-based ordering; there is no checkout or payment collection.

## Run locally

```sh
npm ci
cp .env.example .env.local
# Add the Supabase publishable key and intended production URL.
npm run dev
```

Open http://localhost:3000. `npm run build` runs the production build and TypeScript checks. `npm run typecheck` runs TypeScript alone.

The existing Dogra Sports Supabase project is connected. The public fallback URL/key in `src/lib/config.ts` are publishable client configuration, not privileged credentials. Replace them with environment variables for a different project. All customer/admin tables use RLS. No secret/service-role credentials are in browser code or source control.

## Vercel deployment

Import `bandanakumarishimla-a11y/dogra-sports` into the **Dogra Sports** Vercel team. Framework: **Next.js**. Root: repository root. Build: `npm run build`. Install: `npm ci`. Output: Next.js default (do not use the old static output settings).

Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_SITE_URL` as shown in `.env.example`. The connected publishable defaults allow the store to work immediately, and the Vercel production hostname is used if `NEXT_PUBLIC_SITE_URL` is unset. Redeploy after changing build-time public variables. Main is the production branch.

## Staff account setup

Admin access is protected by an owner-controlled `dogra_admins` membership table, not editable user metadata. No customer or staff account becomes an admin automatically.

1. In the Supabase Dashboard for `dogra-sports`, go to Authentication → Users and create an account for your chosen staff email. Set the password privately; never commit or send it in a public file.
2. Copy that account's user UUID, then run in the SQL Editor:

```sql
insert into public.dogra_admins(user_id)
values ('REPLACE-WITH-THE-APPROVED-STAFF-USER-UUID');
```

3. Sign in at `/admin` using that staff account.
4. Add verified product photographs, prices and specifications; replace/delete the labelled sample ranges.
5. Set the confirmed WhatsApp number, upload actual gallery photos, and review shipping/returns policies.

Grant only intended staff accounts membership. To revoke access, remove the membership row and revoke that user's sessions from the Supabase Dashboard. Database policies check membership on each operation. Customer requests are never publicly readable.

## Database and security

`supabase/schema.sql` documents the applied initial schema. Do not re-run it against the existing database; the migration is already recorded. `supabase/restrict-default-trigger.sql` and `supabase/explicit-table-privileges.sql` document the follow-up permission hardening migrations. Subsequent schema updates should use new migrations. `src/lib/database.types.ts` is generated from the connected schema.

Public enquiry submissions are validated in the Next.js API and by database constraints. A restricted private trigger limits each phone number to five submissions per hour; customer attachments are capped and private. A honeypot and same-origin check provide basic automated-submission protection. For high traffic, add an external bot challenge and network-level rate limits.

## Content and launch review

- Sample product ranges have no invented models, specifications, inventory or prices. Their photos are intentionally awaiting real assets.
- The cricket hero is AI-generated illustrative photography, clearly labelled; it does not depict the store or a customer.
- Gallery starts empty until real photos are uploaded.
- The Maps link is an address search, not an invented store pin.
- Shipping/returns pages explicitly mark order-specific details for review. Policy text can be edited in admin.
- No business email, social profile link, founding date, award, authorised dealership or approval claim is invented.
- Main phone: +91 97363 25100. Alternate: +91 98163 75037. Hours: 9:00 AM–8:00 PM.

## Verification

See `docs/verification.md` for the final build, route, responsive-layout, enquiry-persistence and access-control checks.

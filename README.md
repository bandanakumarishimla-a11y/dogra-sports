# Dogra Sports
Responsive sports retail catalogue for Bilaspur, Himachal Pradesh.

## Run locally
Run `python3 -m http.server 8080` from this folder, then open http://localhost:8080.

## Deploy on Vercel
Import this repository, use **Other** as the framework preset, leave the build command empty and use the repository root as the output directory. No runtime dependencies or environment variables are required for this version.

## Current functionality
Search and category filters, product-specific WhatsApp enquiries, personalised team-kit links, bulk quotation enquiries, mobile navigation, call links, store Maps search and a validated enquiry form that opens WhatsApp. Product entries describe ranges, not verified stock or prices. The map link is a search; confirm the exact store pin before replacing it.

## Supabase
Not connected yet: no Supabase project exists in the connected account. `supabase/schema.sql` contains a proposed private enquiry table. Run it only after selecting and creating the intended project. Public access is revoked; connect through a server-side endpoint with validation, bot protection and rate limiting before storing customer details. Never place secret/service-role keys in browser files. This version sends enquiries via WhatsApp and does not claim to save them.

## Content
Replace catalogue ranges with verified products and licensed store/product photos when available. Store phone numbers and hours are provided in the source.

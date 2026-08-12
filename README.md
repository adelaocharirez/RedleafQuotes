# RedleafQuotes

A mobile first quote calculator for landscaping/retaining wall jobs. Goal is to replace a 36-row Excel spreadsheet with something you can fill out from a truck in under a minute — big tap targets, steppers instead of a keyboard, live pricing as you go.

## Setup

You'll need [Node.js]

```
git clone <repo-url>
cd <repo-folder>
npm install
npm run dev
```
## Stack

- React + Vite + TypeScript
- Tailwind CSS (v4 — theme colors/fonts live in `src/index.css`, not a config file)
- Lucide icons

## How it's structured

- `src/lib/quoteEngine.ts` — all the pricing math, no UI. Types + a `calculateQuote()` function.
- `src/components/` — UI pieces, one file per section of the quote form.

The pricing logic is built to match an existing set of Excel quotes we're replacing (same field names, same markup formula)

## Status

- [x] Pricing engine (types + calculations)
- [x] Length/height inputs with live sq ft
- [ ] Material selection cards
- [ ] Consumables checklist
- [ ] Labor/overhead inputs + profit margin comparison
- [ ] Final price summary screen
- [ ] PDF export
- [ ] PWA (installable, works offline, saves data locally)


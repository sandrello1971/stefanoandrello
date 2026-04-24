# stefanoandrello.me

Sito personale di Stefano Andrello — AI Strategist per PMI italiane.

## Stack

- **Astro 6** (`output: 'server'`) con adapter **Vercel** (serverless per `/api/*`, prerender per tutte le pagine statiche)
- **Tailwind 4** (token custom via `@theme` in `src/styles/global.css`)
- **MDX** + **Content Collections** (blog + corsi)
- **Resend** per l'invio email del form contatti
- **astro-og-canvas** per la generazione delle OG image al build
- **@astrojs/sitemap** per `sitemap-index.xml`

## Comandi

| Comando          | Azione                                                     |
| :--------------- | :--------------------------------------------------------- |
| `pnpm install`   | Installa le dipendenze                                     |
| `pnpm dev`       | Dev server su `localhost:4321` (con HMR)                   |
| `pnpm build`     | Build di produzione in `./dist/` + output in `.vercel/output/` |
| `pnpm preview`   | Serve localmente la build (richiede adapter che lo supporti) |

Per preview della modalità serverless completa (inclusi endpoint API) usa `vercel dev` dalla CLI Vercel dopo aver fatto `vercel link`.

## Variabili d'ambiente

Il form contatti (`/api/contact`) usa Resend. Copia `.env.example` in `.env` e compila:

| Variabile            | Descrizione                                                                 |
| :------------------- | :-------------------------------------------------------------------------- |
| `RESEND_API_KEY`     | API key generata su <https://resend.com/api-keys>                           |
| `CONTACT_TO_EMAIL`   | Destinatario della notifica (default `info@stefanoandrello.me`)             |
| `CONTACT_FROM_EMAIL` | Mittente delle email (deve essere un indirizzo del dominio verificato su Resend) |

Senza queste variabili l'endpoint `/api/contact` risponde 500. Il resto del sito funziona regolarmente.

## Deploy su Vercel

1. **Environment Variables** (Project Settings → Environment Variables): aggiungi le 3 variabili su Production/Preview/Development. `RESEND_API_KEY` è un segreto.
2. **Framework Preset**: Astro (auto-rilevato).
3. **Build Command**: `pnpm build` — **Output Directory**: gestito dall'adapter.
4. **Domini**: il dominio `stefanoandrello.me` è già verificato su Resend. Non sovrascrivere i record DNS di SPF/DKIM quando colleghi il dominio a Vercel.

## Struttura

```
src/
├── content/
│   ├── blog/                  # Post MDX
│   └── corsi/                 # Schede corso MDX (primus, consilium, initium)
├── content.config.ts          # Schema Zod delle collection
├── components/
│   ├── sections/              # Sezioni della home
│   ├── Container.astro
│   ├── Header.astro
│   ├── Footer.astro
│   └── SEO.astro              # Meta + JSON-LD (WebSite/Person/Article/Course/Organization/FAQPage)
├── data/
│   └── faq.ts                 # FAQ condivise (usate in home + FAQPage schema)
├── layouts/
│   └── BaseLayout.astro       # <html>, <head>, Header + slot + Footer
├── pages/
│   ├── api/contact.ts         # POST /api/contact (SSR, unico endpoint serverless)
│   ├── blog/
│   │   ├── index.astro        # Lista post + filtro categoria
│   │   └── [slug].astro
│   ├── corsi/
│   │   └── [slug].astro
│   ├── open-graph/
│   │   ├── blog/[...slug].ts
│   │   └── corsi/[...slug].ts
│   ├── 404.astro
│   ├── cookie.astro
│   ├── privacy.astro
│   └── index.astro
└── styles/global.css          # Token Tailwind (@theme) + @layer base
public/
├── favicon.svg
├── llms.txt                   # Convenzione llmstxt.org
└── robots.txt                 # Allow GPTBot/ClaudeBot/PerplexityBot/Google-Extended
```

## Contenuti

- **Post blog**: aggiungi un file `.mdx` in `src/content/blog/` con frontmatter conforme allo schema (`title`, `description`, `pubDate`, `category` tra i valori ammessi, tag, ecc.).
- **Corsi**: modifica i tre file in `src/content/corsi/`. Lo slug nel frontmatter determina l'URL (`/corsi/[slug]`).
- **FAQ della home**: `src/data/faq.ts` (viene renderizzata e contribuisce allo schema.org FAQPage).

## Accessibilità

Il sito mira a WCAG 2.1 AA:
- Font di sistema + Google Fonts con `display=swap` (no FOIT)
- Colori di brand scelti per contrasto AA (oro solo come accent decorativo o su midnight, mai testo leggibile su cream)
- Tutti i CTA hanno `aria-live` sullo stato, focus visibile, honeypot anti-bot nel form contatti

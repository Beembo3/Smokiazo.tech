# ITPT02 — case study site

A responsive, single-page case study built with **Next.js (App Router) + Ionic React + TypeScript**.
Ionic provides the design system and native-feeling controls; Next.js provides routing, metadata,
and the dev/build pipeline.

```
app/
  layout.tsx          root layout, metadata, Ionic CSS imports
  page.tsx            the case study page (sections composed here)
  globals.css         design tokens + all layout styles
components/
  ionic-provider.tsx  client-side setupIonicReact()
  site-header.tsx     sticky nav + mobile menu
  hero-actions.tsx    Ionic buttons
  media-frame.tsx     Figma frame / placeholder renderer
  reveal.tsx          scroll-reveal wrapper (progressive enhancement)
  site-footer.tsx
content/
  case-study.ts       all copy and metrics — edit here first
scripts/
  figma.mjs           pulls the Figma file: tree, tokens, PNG exports
```

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build && npm start   # production
npm run typecheck            # strict TS check
```

## Wiring up the Figma file

The design in
[`08Mu3KwXJjvI6CkkgjDXyL`](https://www.figma.com/design/08Mu3KwXJjvI6CkkgjDXyL/ITPT02)
is not readable without a token (Figma blocks anonymous API access).

1. Figma → **Settings → Security → Personal access tokens** → new token with
   **File content: Read only**.
2. Create `.env.local`:

   ```bash
   FIGMA_TOKEN=figd_...
   FIGMA_FILE_KEY=08Mu3KwXJjvI6CkkgjDXyL
   ```

3. Pull everything:

   ```bash
   npm run figma:pull
   ```

   That writes:

   | Path | Contents |
   | --- | --- |
   | `.figma/tree.txt` | page / frame / section outline with pixel sizes and text |
   | `.figma/tokens.json` | most-used colours, fonts, font sizes, radii, effects |
   | `.figma/exports/*.png` | every top-level frame rendered to PNG |
   | `.figma/file.json` | raw document, for anything the summary misses |

4. Copy the PNGs you want into `public/figma/` and reference them from
   `content/case-study.ts` (`src: "/figma/hero.png"`), then replace the token
   values in `app/globals.css` with the real palette and type scale.

Nothing else needs to change — the layout only reads tokens and content.

## Where to change things

- **Copy, metrics, sections** → `content/case-study.ts`
- **Colours, fonts, spacing, radii** → the `:root` block in `app/globals.css`
- **Section order / new sections** → `app/page.tsx`
- **Navigation links** → the `links` array in `components/site-header.tsx`
- **Meta / SEO title + description** → `app/layout.tsx`

## Notes

- Ionic is used as a component library (`IonButton`, `IonIcon`, plus anything in
  `components/`) while the page itself scrolls natively. That keeps sticky
  headers, scroll-reveals, and SEO working the way a case study needs, without
  fighting `IonContent`'s internal scroll container on the server.
- Reveal animations only engage after JS boots (`html.js`), so the content is
  fully visible to crawlers, no-JS visitors, and `prefers-reduced-motion` users.
- Dark mode follows the OS via `prefers-color-scheme`; both palettes live in
  `app/globals.css`.

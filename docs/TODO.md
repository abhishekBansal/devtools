## 0) Prep

- [ ]  Create GitHub repo: `devtools` (public).
- [ ]  Add base files: `README.md`, `LICENSE`, `.gitignore` (Node), `CODEOWNERS`.

---

## 1) Monorepo Bootstrap (pnpm workspaces)

- [ ]  Install pnpm (if needed): `npm i -g pnpm`.
- [ ]  Init root: `pnpm init -y`.
- [ ]  Create `pnpm-workspace.yaml`:
    
    ```yaml
    packages:
      - packages/*
      - apps/*
    
    ```
    
- [ ]  Root `package.json`: set `"private": true`, add scripts:
    
    ```json
    "scripts": {
      "build": "pnpm -r build",
      "dev": "pnpm --filter @devtools/web dev",
      "lint": "pnpm -r lint",
      "test": "pnpm -r test",
      "typecheck": "pnpm -r typecheck"
    }
    
    ```
    
- [ ]  Create folders: `packages/core`, `apps/web`, `packages/cli`.

---

## 2) Tooling & Quality (shared)

- [ ]  Add ESLint + Prettier at root:
    - `pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier prettier`
    - Add `.eslintrc.cjs` (TS + import rules), `.prettierrc`.
- [ ]  Add TypeScript base config at root: `tsconfig.base.json` with strict settings.
- [ ]  Add Husky + lint-staged:
    - `pnpm add -D husky lint-staged`
    - `npx husky init`
    - `.husky/pre-commit`: `pnpm lint-staged`
    - `package.json`:
        
        ```json
        "lint-staged": {
          "*.{ts,tsx,js,jsx,json,css,md}": ["prettier --write", "eslint --fix"]
        }
        
        ```
        
- [ ]  Add GitHub PR template (checklist for tests, types, docs, GA events).

---

## 3) `@devtools/core` — Shared Utilities Library

**Goal:** Pure TS functions used by both Web & CLI.

- [ ]  `pnpm init -y` in `packages/core`, set `name: "@devtools/core"`, `type: "module"`.
- [ ]  Add TS: `pnpm add -D typescript tsup`.
- [ ]  `tsconfig.json` (extends root, `module: ESNext`, `target: ES2020`, `declaration: true`, `outDir: dist`).
- [ ]  Add build with tsup:
    - `pnpm add -D tsup`
    - `package.json`:
        
        ```json
        "exports": "./dist/index.js",
        "types": "./dist/index.d.ts",
        "scripts": {
          "build": "tsup src/index.ts --dts --format esm,cjs --clean",
          "lint": "eslint .",
          "test": "vitest run",
          "typecheck": "tsc -p tsconfig.json --noEmit"
        }
        
        ```
        
- [ ]  Add Vitest for unit tests:
    - `pnpm add -D vitest @types/node`
    - `vitest.config.ts` with `test.environment: "node"`.
- [ ]  Create `src/` with atomic modules (each with tests):
    - `src/base64.ts` → `encodeBase64`, `decodeBase64` (UTF-8 safe).
    - `src/json.ts` → `validateJson`, `formatJson`, `minifyJson`.
    - `src/hex.ts` → `hexToAscii`, `asciiToHex`, `hexToBinary`, `binaryToHex`, `hexToDecimal`, `decimalToHex`.
    - `src/timestamp.ts` → `unixToIso`, `isoToUnix`, support tz offset input.
    - `src/uuid.ts` → `generateUuidV4` (use WebCrypto if available, else Node crypto).
- [ ]  `src/index.ts` re-exports all modules.
- [ ]  Tests (`src/__tests__/*.test.ts`) covering happy/edge cases (empty, invalid, unicode).
- [ ]  Build: `pnpm --filter @devtools/core build`.

---

## 4) `@devtools/web` — React + AntD Web App (Vite)

**Goal:** Static site on GitHub Pages, SEO, lightning-fast.

- [ ]  Scaffold Vite React TS app in `apps/web`:
    - `pnpm create vite apps/web --template react-ts`
    - In `apps/web/package.json`: `name: "@devtools/web"`.
- [ ]  Install deps:
    - `pnpm add antd react-router-dom react-helmet-async react-ga4`
    - `pnpm add -D vite-plugin-ssg @vitejs/plugin-react vite-plugin-pwa`
- [ ]  Link core: `pnpm add @devtools/core -F @devtools/web`.
- [ ]  Import AntD reset once in `main.tsx`: `import 'antd/dist/reset.css'`.
- [ ]  AntD theme config (Dark/Light):
    - Create `src/theme.ts` using AntD `ConfigProvider` tokens.
    - Persist theme in `localStorage` via context `ThemeContext`.
- [ ]  Routing:
    - Add `react-router-dom` with routes:
        - `/` (Home)
        - `/tools/:slug` (ToolPage)
        - `/about`, `/privacy`,  (NotFound)
- [ ]  Layout components:
    - `components/Header.tsx` (logo, search shortcut `/` focus, theme toggle).
    - `components/Footer.tsx` (About, Privacy, GitHub).
    - `components/AdSlot.tsx` (feature-flag env `VITE_ADS_ENABLED`, renders placeholder now).
- [ ]  Data-driven tools index:
    - `src/data/tools.ts` array of:
        
        ```tsx
        type ToolDef = {
          slug: string; // "base64-encoder-decoder"
          title: string;
          category: "Encoding"|"JSON & Data"|"Text"|"Time"|"Code"|"Misc";
          description: string;
          keywords: string[];
          related: string[]; // slugs
        }
        
        ```
        
    - Seed with MVP 5 tools.
- [ ]  Home page:
    - `pages/Home.tsx`: category sections; `SearchBar` filters by `title|keywords|category`.
    - `ToolCard` (AntD Card) showing title, desc, quick action.
- [ ]  Generic `ToolPage` wrapper:
    - Props: `title`, `description`, `children`, `schemaOrg` data.
    - Renders `<Helmet>` with per-tool SEO tags (title, meta, canonical).
    - Renders `AdSlot` below output for mobile, right sidebar for desktop (responsive).
    - Renders “Quick Switch” (related tools).
- [ ]  Implement MVP tool UIs wired to `@devtools/core`:
    - Base64: two textareas (input/output), radio Encode/Decode, `Copy`, `Clear`, auto-sync.
    - JSON Validator: textarea, `Validate`, `Format`, `Minify`, live result status, error panel.
    - Hex Converter: input + tabs for conversions; `Copy` buttons per result.
    - Timestamp Converter: input (Unix & ISO), now-button, tz hint; bi-directional.
    - UUID Generator: button to generate, history list (session-only), `Copy`.
- [ ]  Usability polish:
    - `copyToClipboard` util with AntD `message.success("Copied")`.
    - Keyboard shortcuts: `Ctrl/⌘+Enter` to run/validate; `Esc` to clear (where sensible).
    - Paste-to-validate (on input change debounce 300ms).
    - “Reset” link clears state and focuses input.
- [ ]  SEO / SSG:
    - Use `vite-plugin-ssg` to pre-render `/` and each `/tools/:slug`.
    - Add `public/robots.txt` (allow all) and `sitemap.xml` generation:
        - `pnpm add -D sitemap`
        - Build step script to output `dist/sitemap.xml` from `tools.ts`.
    - `canonical` tags: `https://tools.yourdomain.com/tools/<slug>`.
- [ ]  PWA:
    - Configure `vite-plugin-pwa` with `registerType: 'autoUpdate'`, app name, icons.
    - Cache shell + tool pages; exclude Ad scripts.
- [ ]  GA4:
    - Add `src/analytics.ts` wrapper using `react-ga4`.
    - Initialize with `VITE_GA_MEASUREMENT_ID`.
    - Track:
        - page_view (on route change),
        - `tool_input_change` (size, throttled),
        - `tool_output_copied`,
        - `tool_clear`,
        - `theme_toggle`,
        - `tool_action` (validate/format/minify/convert).
- [ ]  Performance:
    - Code-split each tool via lazy routes (`React.lazy` + `Suspense`).
    - Defer GA + (future) Ads; ensure core logic runs first.
    - Ensure no large polyfills; use modern build.
- [ ]  Accessibility:
    - Labels for inputs, `aria-live` for validation status, focus outlines, high-contrast check.

**Build & run**

- [ ]  `package.json` scripts:
    
    ```json
    "scripts": {
      "dev": "vite",
      "build": "vite build && ts-node scripts/generate-sitemap.ts",
      "ssg": "vite-ssg build",
      "preview": "vite preview --port 5173",
      "lint": "eslint src --ext .ts,.tsx",
      "test": "vitest run",
      "typecheck": "tsc --noEmit"
    }
    
    ```
    
- [ ]  Verify SSG output has correct pre-rendered HTML for each tool page.

---

## 5) `devtools-cli` — Node CLI (Commander)

**Goal:** Node-only CLI consuming `@devtools/core`.

- [ ]  `pnpm init -y` in `packages/cli`, set `name: "devtools-cli"`, `type: "module"`, `bin: "bin/devtools"`.
- [ ]  Add deps: `pnpm add commander @devtools/core`.
- [ ]  Add dev deps: `typescript tsup vitest @types/node`.
- [ ]  `tsconfig.json` (node16+, strict).
- [ ]  File layout:
    
    ```
    packages/cli/
      src/index.ts           // register commands
      src/commands/base64.ts
      src/commands/json.ts
      src/commands/hex.ts
      src/commands/timestamp.ts
      src/commands/uuid.ts
      bin/devtools           // shebang + import dist
    
    ```
    
- [ ]  `bin/devtools`:
    
    ```bash
    #!/usr/bin/env node
    import '../dist/index.js';
    
    ```
    
    (mark executable: `chmod +x bin/devtools`)
    
- [ ]  Implement commands (each maps 1:1 to core functions):
    - `devtools base64 encode <text>`
    - `devtools base64 decode <text>`
    - `devtools json validate <json>` (exit code 0/1, print error on stderr)
    - `devtools json format <jsonOrFile>` (support `-file`)
    - `devtools hex to-ascii <hex>`; `to-binary`, `to-decimal`, and inverses
    - `devtools timestamp to-date <unix>`; `to-unix <iso>`
    - `devtools uuid generate`
- [ ]  Options:
    - `-input, -i <path>` read from file/stdin if  (pipe support).
    - `-output, -o <path>` write to file; default stdout.
    - `-pretty` for JSON format.
- [ ]  Error handling:
    - Print human-readable message to stderr, set non-zero exit code.
- [ ]  Tests (Vitest):
    - Unit test each command by invoking the function.
    - Integration: spawn `node bin/devtools ...` and assert stdout/stderr/exit code.
- [ ]  Build script (tsup):
    
    ```json
    "scripts": {
      "build": "tsup src/index.ts --out-dir dist --format esm,cjs --clean",
      "lint": "eslint .",
      "test": "vitest run",
      "typecheck": "tsc --noEmit"
    }
    
    ```
    
- [ ]  Local test: `pnpm --filter devtools-cli build && pnpm --filter devtools-cli link -g && devtools --help`.

---

## 6) Cross-Package Wiring

- [ ]  Ensure `@devtools/core` is a workspace dependency in web & cli.
- [ ]  Set `packageManager` in root `package.json` to pnpm.
- [ ]  Add path aliases (optional): in tsconfig base, e.g. `"@core/*": ["packages/core/src/*"]`.
- [ ]  Verify tree-shaking: import only used functions in web tool pages.

---

## 7) Static Content & Policies (Web)

- [ ]  `public/CNAME` with `tools.yourdomain.com`.
- [ ]  `public/robots.txt`.
- [ ]  `public/manifest.webmanifest` (from PWA plugin).
- [ ]  Pages: `About`, `Privacy` (state: all processing in browser, no data sent).
- [ ]  `404` page with search box and top tools links.

---

## 8) Analytics (GA4)

- [ ]  Add `.env` handling with Vite: `VITE_GA_MEASUREMENT_ID=G-XXXX`.
- [ ]  Initialize GA on app mount; log pageviews on route changes.
- [ ]  Add event helpers:
    - `trackToolView(tool)`, `trackCopy(tool)`, `trackInputChange(tool, size)`,
        
        `trackClear(tool)`, `trackThemeToggle(theme)`, `trackAction(tool, action)`.
        
- [ ]  Validate events in GA DebugView.

---

## 9) Ads (Future-Ready, Non-Invasive)

- [ ]  `AdSlot` component API: `<AdSlot position="sidebar|below" />`.
- [ ]  Feature flag: `VITE_ADS_ENABLED=false` (skip render if false).
- [ ]  Placeholder container with fixed min-height to avoid layout shift.
- [ ]  Lazy-load script (when enabled) after idle (`requestIdleCallback`).
- [ ]  Ensure `AdSlot` is excluded from PWA caching.

---

## 10) Performance & Accessibility Validation

- [ ]  Lighthouse check (CI and local) target ≥95 (Perf/SEO/A11y/Best Practices).
- [ ]  Ensure **first interaction** works before GA/Ads (deferred).
- [ ]  A11y sweep:
    - Inputs have `<label>` or `aria-label`.
    - Status messages use `role="status"` / `aria-live="polite"`.
    - Keyboard shortcuts documented in UI tooltips.

---

## 11) CI/CD (GitHub Actions)

- [ ]  Create workflow `.github/workflows/ci.yml`:
    - Trigger: PRs & pushes.
    - Jobs: install (pnpm), build core, test all, build web, build cli, run lints, typecheck.
- [ ]  Create workflow `.github/workflows/deploy-web.yml`:
    - Trigger: push to `main`.
    - Build `apps/web` (SSG + PWA).
    - Deploy to GitHub Pages (`actions/deploy-pages`).
- [ ]  Create workflow `.github/workflows/release-cli.yml`:
    - Trigger: tag `cli-v*`.
    - Build `packages/cli`.
    - `npm publish` (needs `NPM_TOKEN` secret).
- [ ]  Optional: set up **Changesets** for versioning:
    - `pnpm add -D @changesets/cli`
    - `npx changeset init`
    - Workflow to create version PRs.

---

## 12) GitHub Pages + Domain

- [ ]  Enable Pages for Web app (build from GitHub Actions).
- [ ]  Verify site at `https://<user>.github.io/devtools/` (first).
- [ ]  Add CNAME, set custom domain `tools.yourdomain.com`.
- [ ]  In DNS, CNAME `tools` → `<user>.github.io`.
- [ ]  Confirm HTTPS is enforced.

---

## 13) Documentation

- [ ]  Update `README.md` with:
    - Monorepo structure, dev commands.
    - How to add a new tool (core + web + cli).
    - GA & Ads env setup.
- [ ]  CLI README section:
    - Install, usage examples, piping, files.
- [ ]  Contributing guide: coding standards, tests, release flow.

---

## 14) Add a New Tool (Template Task) — Example Workflow

- [ ]  **Core**: implement `src/<tool>.ts` + tests + export.
- [ ]  **Web**: add `tools.ts` entry, create `pages/tools/<Tool>Page.tsx`, lazy route, SEO tags, wire to core.
- [ ]  **CLI**: add `src/commands/<tool>.ts`, register in `index.ts`, tests.
- [ ]  **Docs**: add to README + sitemap build.
- [ ]  **Analytics**: add event labels/actions for the tool.
- [ ]  **Ship**: build all, deploy web, (optional) tag + publish CLI.

---

## 15) MVP Completion Checklist

- [ ]  `@devtools/core` implemented + 100% tests for MVP 5 tools.
- [ ]  Web Home + 5 Tool pages (SSG, GA4 wired, PWA enabled).
- [ ]  CLI commands for 5 tools with file/stdin support.
- [ ]  CI green (lint, test, typecheck).
- [ ]  Web deployed to `tools.yourdomain.com`.
- [ ]  Optional: Publish CLI `1.0.0` to npm.

---

## 16) Nice-to-Haves (Post-MVP)

- [ ]  Favorites (persist in `localStorage`).
- [ ]  “Copy on select” preference.
- [ ]  Import/export settings (JSON).
- [ ]  Keyboard shortcut cheatsheet modal (`?` key).
- [ ]  VS Code extension reusing `@devtools/core`.

---

### Commands Quick Reference (you’ll run these along the way)

```bash
# root
pnpm i
pnpm -r build
pnpm --filter @devtools/web dev
pnpm --filter @devtools/web build
pnpm --filter @devtools/core test
pnpm --filter devtools-cli build
pnpm --filter devtools-cli link -g && devtools --help

```

If you want, I can generate the **initial files & scaffolding** (monorepo skeleton with configs and stubs for one tool) so you can pull and start coding immediately.
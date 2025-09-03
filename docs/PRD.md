## 1. 🎯 Goal & Vision

Build a **unified devtools platform** that runs both:

- **Browser-based web app** (React + TypeScript + AntD, hosted on GitHub Pages).
- **Node.js CLI utility** (powered by the same logic as web app).

The **core utilities** (Base64, JSON Validator, Text Diff, etc.) will live in a **shared library** that is consumed by both the web frontend and CLI, ensuring **single source of truth**.

---

## 2. 📌 Scope

- Web platform (frontend only, SEO optimized, GitHub Pages).
- CLI utility (`devtools-cli`) published via **npm**.
- Shared **core utilities library** (TypeScript functions).

---

## 3. 👤 Target Users

- **Web App Users** → developers who want quick tools in browser.
- **CLI Users** → developers who prefer terminal workflow (no browser switch).

---

## 4. 🌐 Core Features

### 4.1 Shared Utilities Library

- Each tool is a **pure function in TypeScript**.
- Organized by category (Encoding, JSON, Time, etc.).
- Example:
    
    ```tsx
    // core/base64.ts
    export function encodeBase64(input: string): string { ... }
    export function decodeBase64(input: string): string { ... }
    
    ```
    
- No dependency on React/DOM — **platform agnostic**.
- Exposed via `index.ts` for easy import in Web + CLI.

---

### 4.2 Web App (Unchanged from previous PRD)

- **Homepage**: Search + category-based listing.
- **Tool Pages**: Input/output UI, copy button, SEO meta tags.
- **Analytics**: GA4 events.
- **Ads**: non-invasive, lazy-loaded (future).
- **Performance**: fast, PWA support.

---

### 4.3 CLI Utility

- Package name: `devtools-cli` (npm).
- Install:
    
    ```bash
    npm install -g devtools-cli
    
    ```
    
- Entry command:
    
    ```bash
    devtools <tool> [options]
    
    ```
    

### Supported MVP Commands

- `devtools base64 encode "hello"` → `aGVsbG8=`
- `devtools base64 decode "aGVsbG8="` → `hello`
- `devtools json validate '{"name":"Abhishek"}'` → `Valid JSON`
- `devtools hex to-ascii "4869"` → `Hi`
- `devtools timestamp to-date 1692272347` → `2025-08-17T18:39:07Z`
- `devtools uuid generate` → `550e8400-e29b-41d4-a716-446655440000`
- `devtools diff text "old text" "new text"` → `Colored diff output with statistics`

### CLI Features

- Built with **Node.js + TypeScript** (`commander` or `yargs`).
- Provides **help/usage docs**:
    
    ```bash
    devtools --help
    devtools base64 --help
    
    ```
    
- Output always **stdout** (easy to pipe into scripts).
- Error messages → **stderr**.

---

## 5. 🛠️ Technical Specifications

### 5.1 Monorepo Setup

- Use **pnpm workspaces** or **Nx/Turborepo**.
- Repo structure:
    
    ```
    /packages
      /core         # Shared TypeScript library
      /web          # React frontend
      /cli          # Node CLI
    
    ```
    
- **Core** = exported as `@devtools/core`.
- Both **Web** + **CLI** import from `@devtools/core`.

### 5.2 CLI Tech Stack

- Node.js (>=18).
- TypeScript (compiled with `tsc`).
- CLI framework: `commander` (lightweight, popular).
- Distribution: npm package.

### 5.3 Example CLI Implementation

```tsx
// cli/base64.ts
import { encodeBase64, decodeBase64 } from "@devtools/core/base64";
import { Command } from "commander";

export const base64Command = new Command("base64")
  .description("Base64 encode/decode")
  .command("encode <text>")
  .action((text) => console.log(encodeBase64(text)))
  .command("decode <text>")
  .action((text) => console.log(decodeBase64(text)));

```

---

## 6. 🚦 Non-Functional Requirements

- **Consistency**: Same logic used in web + CLI.
- **Performance**: CLI should respond in < 100ms for small inputs.
- **Portability**: CLI works cross-platform (Linux, macOS, Windows).
- **Testing**: Unit tests for `core` functions (Jest).

---

## 7. 📈 Future Enhancements

- CLI:
    - Accept **file input/output** (`-input file.json --output file.pretty.json`).
    - **Interactive mode** (REPL style).
- Web:
    - Favorites/bookmarks, extensions.
- Unified **documentation site** (auto-generated from core functions).

---

## 8. 🗺️ Rollout Plan

1. Setup **monorepo** (`core`, `web`, `cli`).
2. Implement **core utilities** (Base64, JSON, Hex, Timestamp, UUID, Text Diff).
3. Build **web app** consuming core.
4. Build **CLI** consuming core.
5. Publish CLI to **npm** (`devtools-cli`).
6. Deploy web app to **GitHub Pages**.

---

✅ Now both **web app** + **CLI** evolve together, sharing the same logic.

Would you like me to now **revise the Roo Code ToDo list** to account for this monorepo setup (core + web + cli)?
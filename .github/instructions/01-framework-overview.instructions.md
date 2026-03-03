---
applyTo: "**"
description: "Overview of the Glyphix framework, runtime constraints, and project structure."
---

# Glyphix Framework Overview & Constraints

## What is Glyphix?

Glyphix is a native UI application framework targeting **MCU-based smartwatch devices** (ARM Cortex-M
class). Applications are authored in HTML/CSS/JavaScript (or TypeScript), but the runtime is a
custom C++ native engine — **not a browser**.

## Runtime Constraints

### No Web APIs

Never use any of the following — they do not exist:

| Forbidden | Reason |
|---|---|
| `window`, `document`, `navigator` | No browser environment |
| `localStorage`, `sessionStorage`, `IndexedDB` | Use `@system.storage` instead |
| `fetch()` global | Use `@system.fetch` module instead |
| `XMLHttpRequest` | Use `@system.fetch` instead |
| DOM APIs (`getElementById`, `querySelector`, etc.) | No DOM tree |
| `history`, `location` | Use `@system.router` instead |
| CSS animations via `transition` / `@keyframes` | Not supported |
| Web Workers, Service Workers | Not available |
| `<canvas>` 2D/WebGL context | Use Glyphix `canvas` component |

### JavaScript Engine

The JS engine supports **ES6** (ES2015). Supported:
- Arrow functions, `const`/`let`, template literals, destructuring, `async/await`, Promises
- Standard built-ins: `Array`, `Object`, `Math`, `JSON`, `console`

Not supported:
- `WeakRef`, `FinalizationRegistry`
- Complex iterators beyond basic `for...of`

### Memory

RAM on target devices is typically **2–8 MB** total. Guidelines:
- Never load large JSON payloads or full images from the network into memory
- Download large resources to the file system using `@system.request` and read them in parts
- `fetch()` loads the entire response into memory — avoid for large responses

## Device Form Factor

- **Screen**: circular or rectangular, typically 466×466 px, 1.5–2" diagonal
- **Input**: touch screen, optional physical button / crown
- **Orientation**: portrait only (no landscape)

All pages should be designed for a roughly square small screen. Use `manifest.json`'s
`config.designWidth` to set the logical design resolution (default: 410).

## Project Structure

```
src/
├─ manifest.json       # App manifest (routes, permissions, metadata)
├─ app.ts / app.js     # App-level lifecycle entry point
├─ pages/              # Page components (each page = one directory)
│  └─ PageName/
│     └─ index.ux      # Page root component
├─ common/             # Shared components and scripts
│  ├─ components/      # Shared UX components
│  └─ utils.ts         # Shared utility functions
└─ assets/             # Static resources
   ├─ fonts/
   └─ images/
```

`src/manifest.json` and `src/app.ts` (or `app.js`) **must** stay at their fixed locations.
Pages must be registered in `manifest.json` before they can be navigated to.

## Build & Run

```bash
npm run build   # Build the application package
npm run emu     # Launch the emulator (builds first)
npm run clean   # Clean build artifacts
```

Underlying commands use the `gx` CLI tool from the `glyphix` npm package.

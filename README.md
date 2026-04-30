# Glyphix Vibe Coding Template

A **GitHub Copilot-ready** application template for the [Glyphix](https://glyphix.dev) smartwatch
UI framework.

The template ships with rich Copilot instruction files that teach the AI assistant how to write
correct Glyphix code - so you can describe what you want in plain language and get working
`.ux` components straight away.

## Prerequisites

Install the Glyphix CLI globally:

```bash
npm install -g glyphix-cli
```

Then install project dependencies:

```bash
npm install
```

## Running

```bash
npm run emu      # Build and launch the emulator
npm run build    # Build the application package only
npm run clean    # Remove build artifacts
```

## Environment Variables (.env)

This template supports reading environment variables from a `.env` file through
`glyphix.config.ts`.

### Rules

- Environment variable names must start with `GLYPHIX_`
- Read variables in code with `process.env.xxx`
- Values received in code are always strings
- Environment variables can only be used in `.js` / `.ts` logic, not in `.ux` templates
- Build mode defaults:
  - `npm run emu` -> `development`
  - `npm run build` -> `production`

### Example

Create a `.env` file in the project root:

```bash
GLYPHIX_API_BASE_URL=https://api.example.com
GLYPHIX_ENABLE_LOG=true
GLYPHIX_TIMEOUT_MS=5000
```

Use them in JavaScript/TypeScript:

```ts
const baseUrl = process.env.GLYPHIX_API_BASE_URL || ''
const enableLog = process.env.GLYPHIX_ENABLE_LOG === 'true'
const timeoutMs = Number(process.env.GLYPHIX_TIMEOUT_MS || '0')
```

Do not use environment variables directly in templates:

```html
<!-- Incorrect: environment variables are not available in templates -->
<text>{{ process.env.GLYPHIX_API_BASE_URL }}</text>
```

### Refresh behavior after `.env` changes

If you only changed environment variable files (for example `.env.development` or
`.env.production`) and did not change source code, old cache artifacts may keep previous values.

- Traditional workaround: delete the `.glyphix-work` directory, then run `npm run emu`
- In this template, `npm run emu` already runs `gx build -ef && gx emu`
- `gx build -ef` has the same effect as cleaning `.glyphix-work` for env refresh

So after changing env files, you can directly run `npm run emu` in this project.

## Build Configuration (`glyphix.config.ts`)

`glyphix.config.ts` is the project build-time configuration entry.

- It runs in Node.js before bundling
- It is used to load `.env` files and provide build options
- Its options are the same as esbuild config options

Current template setup:

```ts
import dotenv from "dotenv";

dotenv.config();

module.exports = {};
```

This means the project loads environment variables from `.env` during build, and you can
extend this file with more bundler options when needed.

### How to use `glyphix.config.ts`

- Keep this file at the project root
- Export a config object
- Use the same option names and structure as esbuild

Example:

```ts
import dotenv from 'dotenv'

dotenv.config()

module.exports = {
  define: {
    'process.env.GLYPHIX_API_BASE_URL': JSON.stringify(
      process.env.GLYPHIX_API_BASE_URL || ''
    ),
    'process.env.GLYPHIX_ENABLE_LOG': JSON.stringify(
      process.env.GLYPHIX_ENABLE_LOG || 'false'
    ),
  },
  minify: process.env.NODE_ENV === 'production',
  sourcemap: process.env.NODE_ENV !== 'production',
}
```

In short: if an option exists in esbuild, you can configure it in `glyphix.config.ts`
using the same field name and value format.

## Project Structure

```
glyphix.config.ts           # Build config entry (esbuild-compatible options)
package.json                # Scripts and dependencies
tsconfig.json               # TypeScript compiler options
README.md                   # Project documentation

src/
├─ manifest.json          # App manifest (routes, permissions, metadata)
├─ app.ts                 # App-level lifecycle (onCreate, onShow, …)
├─ pages/
│  ├─ Home/
│  │  └─ index.ux         # Home page - task list with navigation
│  ├─ Detail/
│  │  └─ index.ux         # Detail page — receives route params, returns result
│  └─ Add/
│     └─ index.ux         # Add Task page — forms, validation, result back
├─ common/
│  ├─ components/
│  │  ├─ TaskItem.ux      # Reusable list item component
│  │  └─ FormField.ux     # Reusable input field wrapper
│  └─ utils.ts            # Shared utility functions
└─ assets/
   ├─ fonts/              # Font files
   └─ images/             # Image resources
```

## Copilot Setup

The template includes instruction files that GitHub Copilot automatically reads when you
open this repository in VS Code. No additional configuration is required.

### Tips for Effective Vibe Coding

- **Open a `.ux` file** before asking Copilot to generate component code - this triggers
  the `.ux`-scoped instruction files automatically.
- Ask Copilot Chat to create entire pages:
  > "Create a settings page with a toggle for notifications and a display brightness slider."
- Reference system APIs by name:
  > "Add a button that calls `@system.prompt` to show a confirmation dialog before deleting."
- For navigation flows, describe both sides:
  > "Push the Detail page passing `{ id, name }`, and when it closes return whether the
  > item was marked as favourite."

## VS Code Extensions

Open the Extensions panel and click **Install Recommended** to get:

- **GitHub Copilot** + **GitHub Copilot Chat** - AI pair programmer
- **ESLint** - TypeScript linting
- **Prettier** - code formatting

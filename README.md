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

## Project Structure

```
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

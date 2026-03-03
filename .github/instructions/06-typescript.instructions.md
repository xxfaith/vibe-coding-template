---
applyTo: "**/*.ts,**/*.ux"
description: "Patterns and practices for using TypeScript with Glyphix components."
---

# TypeScript Usage

## Setup

TypeScript is enabled in this project. The `tsconfig.json` is pre-configured. Ensure your
`<script>` tags in `.ux` files use `lang="ts"`:

```html
<script lang="ts">
import { defineComponent } from 'glyphix'

export default defineComponent({
  // ...
})
</script>
```

## `defineComponent` Helper

Always wrap your component options with `defineComponent()` for type inference:

```ts
import { defineComponent } from 'glyphix'

export default defineComponent({
  data: {
    count: 0 as number,
    items: [] as Item[],
    loading: false,
    selectedId: null as number | null,
  },

  onInit() {
    this.loadItems()
  },

  onDestroy() {
    // Clean up resources
  },

  async loadItems() {
    // this.items, this.loading are typed
  },

  handleSelect(id: number) {
    this.selectedId = id
  },
})
```

> **Note:** Use the `data` object literal syntax. You can cast values (e.g. `0 as number`)
> to ensure correct type inference for fields that start as null or generic values.

## Type Definitions for `data`

Define interfaces for complex data models:

```ts
interface Item {
  id: number
  title: string
  description: string
  completed: boolean
}

export default defineComponent({
  data: {
    items: [] as Item[],
    selectedItem: null as Item | null,
  },
})
```

## Typing Non-Reactive Fields

Non-reactive fields (timers, subscriptions, refs) are typed directly on the component:

```ts
export default defineComponent({
  // Non-reactive: not in data
  timer: null as ReturnType<typeof setInterval> | null,
  cachedData: null as Record<string, unknown> | null,

  data: {
    visible: false 
  },

  onInit() {
    this.timer = setInterval(() => { /* ... */ }, 1000)
  },


  onDestroy() {
    if (this.timer) clearInterval(this.timer)
  },
})
```

## Importing System Modules

System modules are typed via the `glyphix` package. Import them with string module paths:

```ts
import router from '@system.router'
import storage from '@system.storage'
import fetch from '@system.fetch'
import prompt from '@system.prompt'
```

TypeScript will resolve types from the `glyphix` type declarations automatically
(configured in `tsconfig.json`).

## Path Aliases

The `tsconfig.json` maps `/*` to `src/*`, so you can use absolute imports:

```ts
// Instead of: import { formatDate } from '../../common/utils'
import { formatDate } from '/common/utils'
```

## Shared Logic in `.ts` Files

Utility functions and shared logic should live in `src/common/*.ts` files:

```ts
// src/common/utils.ts

/**
 * Format a UNIX timestamp to HH:MM string.
 */
export function formatTime(timestamp: number): string {
  const d = new Date(timestamp)
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}
```

Import in `.ux` files:

```html
<script lang="ts">
import { defineComponent } from 'glyphix'
import { formatTime } from '/common/utils'

export default defineComponent({
  data() {
    return { timeStr: formatTime(Date.now()) }
  },
})
</script>
```

## Strictness Notes

`strict`, `noImplicitAny`, `noUnusedLocals`, and `noUnusedParameters` are all enabled.
Common patterns to follow:

```ts
// Always type function parameters
handleTap(index: number, item: Item) { ... }

// Use 'as const' for literal types where needed
const DIRECTIONS = ['north', 'south', 'east', 'west'] as const
type Direction = typeof DIRECTIONS[number]

// Avoid 'any'; use 'unknown' and narrow it
function process(value: unknown) {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
}
```

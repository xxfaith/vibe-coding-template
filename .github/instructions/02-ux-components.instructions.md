---
applyTo: "**/*.ux"
description: "Instructions for writing Glyphix UX components (*.ux files), directives, and lifecycle."
---

# UX Single-File Components

## File Structure

Every Glyphix component is a `.ux` file containing up to four root-level elements in any order:

```html
<import src="./OtherComponent" name="OtherComponent"/>
<import src="/common/components/Card" />

<template>
  <!-- Component markup -->
</template>

<style>
  /* Component styles */
</style>

<script lang="ts">
  // Component logic
</script>
```

- **`<import>`**: Imports another component. `name` is optional (defaults to filename).
  Do NOT add `.ux` extension in `src`.
- **`<template>`**: The component's visual structure. Must have exactly one `<template>`.
- **`<style>`**: CSS scoped to this component. Must have exactly one `<style>`.
- **`<script>`**: Component logic. Must have exactly one `<script>`.
- All XML tags **must be closed**: use `<div/>` or `<div></div>`, never unclosed `<div>`.

## Template Directives

These are Glyphix-specific directives. They differ significantly from Vue.

### Attribute Binding

Use `:attr="expr"` to bind a dynamic expression to an attribute.

```html
<!-- Static attribute -->
<div class="card">...</div>
<!-- Dynamic binding -->
<image :src="iconPath" />
```

### Event Binding

```html
<!-- Named handler method -->
<div on:click="handleClick">...</div>
<div @click="handleClick">...</div>

<!-- Inline expression (this is automatically bound) -->
<div on:click="count++">...</div>
<div on:click="doSomething(index, $event)">...</div>
```

### Conditional Rendering (`if`)

```html
<p if="isVisible">Visible text</p>
<p if="!isVisible">Hidden text</p>
```

`if` evaluates a JavaScript expression. There is no `else-if` or `else` directive —
use separate elements with complementary conditions.

### List Rendering (`for`)

```html
<!-- Full syntax -->
<div for="(index, item) in items">{{ index }}: {{ item.name }}</div>

<!-- Short forms — use $idx and $item as defaults -->
<div for="items">{{ $idx }}: {{ $item.name }}</div>
<div for="item in items">{{ $idx }}: {{ item.name }}</div>
```

`for` MUST be placed **after** any attributes it references, never before.

### Two-Way Binding

```html
<!-- model:propName binds to a component prop bidirectionally -->
<input model:value="inputText"/>

<!-- Short form (same thing) -->
<input ::value="inputText"/>
```

### Combining `if` and `for`

When both are on the same element, `if` takes priority over `for` (the entire list is
conditionally rendered). To filter individual items, nest `if` inside the `for` element.

```html
<!-- if=true → render the whole list; if=false → render nothing -->
<div for="item in items" if="showList">{{ item }}</div>

<!-- Filter individual items; showList controls visibility per-item -->
<div for="item in items">
  <p if="item.visible">{{ item.name }}</p>
</div>
```

## Component Script

### Options API (JavaScript)

```js
export default {
  // Reactive data — JSON-compatible types only (no Date, Map, Set)
  data: {
    count: 0,
    items: [],
    loading: false,
  },

  // Non-reactive instance fields (declared directly, not in data)
  timer: null,

  // Lifecycle hooks
  onInit() {
    // Data is initialised, good place to start network requests
  },
  onReady() {
    // UI is rendered, good place to access element refs
  },
  onShow() {
    // Page becomes visible (page lifecycle only)
  },
  onHide() {
    // Page goes to background (page lifecycle only)
  },
  onDestroy() {
    // ALWAYS clean up: timers, subscriptions
    clearInterval(this.timer)
  },

  // Methods — defined directly on the component object, NOT inside `methods: {}`
  handleClick() {
    this.count++
  },

  increment(amount = 1) {
    this.count += amount
    // Emit a custom event to the parent
    this.$emit('change', { value: this.count })
  },
}
```

Key differences from Vue:
- No `methods: {}` wrapper — methods are defined as direct properties of the export object
- No `props: {}` — fields in `data` are automatically exported as component props
- No `computed` — use methods instead
- No `watch` — react to changes inside lifecycle hooks or methods
- Data fields must be JSON-compatible (`string`, `number`, `boolean`, `null`, `Array`, plain `Object`)

### Accessing Element References

```js
// DO NOT use document.getElementById or querySelector
// Use this.$element(id) to get a native element instance
const el = this.$element('myId')
```

```html
<canvas id="myCanvas" ...></canvas>
```

## Text Must Use Text Elements

In Glyphix, **only dedicated text elements render text**. Placing text directly inside `<div>`
or other container elements produces no output.

| Correct | Incorrect |
|---|---|
| `<text>Hello</text>` | `<div>Hello</div>` (no output) |
| `<p>Hello {{ name }}</p>` | `<span>Hello</span>` ← `span` is inline only |

Available text elements: `<p>`, `<text>`, `<span>` (inline only, inside `<p>`).

## Multiple Root Nodes

Unlike Vue 2, `<template>` may contain **multiple root nodes**. They stack on top of each other
(z-order, last = topmost), which is ideal for backgrounds + content layers:

```html
<template>
  <image class="bg" src="/assets/bg.png"/>
  <div class="content"> ... </div>
  <text if="loading" class="overlay">Loading...</text>
</template>
```

## Importing Components

```html
<!-- Relative path from the current .ux file -->
<import src="../common/components/Card" name="Card"/>

<!-- Absolute path from src/ root -->
<import src="/common/components/TopBar"/>

<!-- Global system component (no src needed) -->
<import name="TopBar"/>
```

Component names in templates are **case-insensitive** (kebab-case and PascalCase both work).

## Slots (Content Projection)

```html
<!-- In the child component (e.g., Card.ux) -->
<template>
  <div class="card">
    <slot/>
  </div>
</template>
```

```html
<!-- In the parent -->
<import src="/common/components/Card"/>
<template>
  <card>
    <text>Content passed to the slot</text>
  </card>
</template>
```

## Text Input (`text-field`)

> **Important:** Glyphix does not yet support a system IME or soft keyboard. `<input>` elements
> do **not** accept keyboard events. Use `<text-field>` with a custom in-app keyboard instead.

`text-field` is a native single-line text display component with caret support. It does **not**
pop up any keyboard on tap — text must be inserted programmatically.

### Key APIs

| API | Description |
|---|---|
| `::value="varName"` | Two-way bind the text content |
| `placeholder="hint"` | Placeholder shown when empty |
| `password` | Boolean attribute — masks text with `•` |
| `insert(text)` | Insert a string at the cursor (element method) |
| `backspace()` | Delete the character before the cursor (element method) |

### Pattern: Custom In-App Keyboard

1. Place `<text-field id="myField" ::value="inputVal" />` in the template.
2. Obtain the element reference in `onReady()` via `this.$element('myField')`.
3. Render a keyboard UI; in each key's `on:click`, call `ref.insert(key)`.
4. Provide a backspace key that calls `ref.backspace()`.

```html
<text-field id="tf" ::value="inputText" placeholder="type here"/>

<!-- Simple 2-row numeric keyboard -->
<div class="key-row" for="row in keyboard">
  <text class="key" for="key in row" on:click="tf.insert(key)">{{ key }}</text>
</div>
<text class="key" on:click="tf.backspace()">⌫</text>
```

```ts
export default defineComponent({
  data: { inputText: '' as string },

  // Non-reactive element reference
  tf: null as any,

  // Non-reactive keyboard data  
  keyboard: [
    ['1','2','3','4','5','6','7','8','9','0'],
  ] as string[][],

  onReady() {
    this.tf = this.$element('tf')
  },
})
```

For a multi-field form, track an `activeField` string in `data` and switch which element
reference receives `insert()`/`backspace()` calls. See `src/pages/Add/index.ux` for a
complete alphabetic keyboard example.

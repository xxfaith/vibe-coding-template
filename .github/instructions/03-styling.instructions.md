---
applyTo: "**/*.ux"
description: "Guidelines for the supported CSS subset, Flexbox layout, and styling constraints."
---

# Styling & Layout

## CSS Subset — What is Supported

Glyphix implements a **subset** of CSS. Do not assume a browser feature is available unless
it is listed here.

### Selectors (supported)

```css
/* Type selector */
div { }

/* Class selector */
.card { }

/* ID selector */
#header { }

/* Descendant selector */
.card .title { }

/* Universal selector */
* { }

/* Pseudo-class for state */
.btn:active { }
*:disabled { opacity: 0.5; }
```

### Selectors (NOT supported)

```css
/* Child combinator */
.parent > .child { }   /* ❌ not supported */

/* Adjacent sibling */
.a + .b { }            /* ❌ not supported */

/* General sibling */
.a ~ .b { }            /* ❌ not supported */

/* Attribute selectors */
input[type="text"] { } /* ❌ not supported */

/* CSS variables */
:root { --primary: #007aff; }  /* ❌ not supported */

/* Dynamic class binding (:class) is NOT supported. Use conditional rendering (if) instead. */
```

## Dynamic Styling Workaround

Since **dynamic class binding (`:class`) is not supported**, you must use `if`/`elif`/`else` directives to
toggle between elements with different static classes.

```html
<!-- ❌ WILL NOT WORK -->
<div class="btn" :class="active ? 'active' : ''"></div>

<!-- ✅ DO THIS INSTEAD -->
<div if="!active" class="btn"></div>
<div else class="btn active"></div>
```

## Layout

### Page Root

Page components automatically fill the full screen. Do **not** set `width`/`height` on the
root element — it always matches the screen dimensions.

### Sort order

Multiple root nodes in `<template>` **stack** on top of each other (like `position: absolute`).

```html
<template>
  <!-- Order matters: last element is on top -->
  <div class="background-globally">...</div>
  <div class="content">...</div>
</template>
```

### Background Color

**Avoid setting a background color on the page root.** Devices have standard themes (usually black).
Using the default transparent background ensures the app allows the system or user preference to shine through.
Only set background colors on specific cards, buttons, or logical sections.

### Recommended: Flexbox

Almost all containers should explicitly use Flexbox:

```css
.container {
  display: flex;
  flex-direction: column;    /* or row */
  justify-content: center;   /* main axis */
  align-items: center;       /* cross axis */
  flex-wrap: nowrap;
}
```

### Units

| Unit | When to use |
|---|---|
| `px` | Logical pixels — auto-scale with screen density. Use for paddings, margins, sizes. |
| `rem` | Font sizes — based on the device manufacturer's baseline. Always use for font sizes. |
| `%` | Responsive widths/heights — supported but with limitations; test carefully. |

**Do not** use `em`, `vw`, `vh`, `pt`, or `dp`.

```css
/* Correct */
.title { font-size: 1.25rem; }
.card  { padding: 16px; border-radius: 12px; }

/* Wrong */
.title { font-size: 20px; }   /* px is fine for sizes, but rem for font */
.card  { padding: 1em; }      /* em not supported */
```

### `scroll` Component for Scrollable Areas

`<div>` does **not** scroll. Use the `<scroll>` component:

```html
<scroll>
  <div for="item in items" class="item">
    <text>{{ item.name }}</text>
  </div>
</scroll>
```

## Visual Effects — Limitations

| Feature | Status |
|---|---|
| `border-radius` | ✅ Supported |
| `background-color` | ✅ Supported |
| `opacity` | ✅ Supported |
| `box-shadow` | ❌ Not supported |
| `text-shadow` | ❌ Not supported |
| `gradient` (linear/radial) | ❌ Not supported |
| `filter` / `backdrop-filter` | ❌ Not supported |
| `transition` | ❌ Not supported |
| `animation` / `@keyframes` | ❌ Not supported |
| `transform` (translate/scale) | ⚠️ Avoid for layout; GPU transforms may be used by the engine internally |
| `object-fit` | ⚠️ Default is `none`; keep default unless necessary |

## Typography

```css
.label {
  font-size: 1rem;        /* always rem */
  color: #333333;
  text-align: center;     /* left | center | right */
  font-weight: bold;      /* or numeric 400/700 */
  /* line-height, letter-spacing supported */
}
```

## Practical Patterns

### Full-screen container

```css
.page {
  display: flex;
  flex-direction: column;
  /* no width/height needed on page root */
}
```

### Centered card

```css
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 20px;
}
```

### Row with space between

```css
.row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
```

### Circular element

```css
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 30px;   /* half of width/height */
  background-color: #007aff;
}
```

---
applyTo: "**"
description: "Instructions for application routing, page navigation, and manifest.json configuration."
---

# Routing & Manifest

## `manifest.json`

`src/manifest.json` is the required app configuration file. Every page **must** be registered
here before it can be navigated to.

### Full Structure

```json
{
  "package": "com.example.app",
  "name": "My App",
  "icon": "/assets/icon.png",
  "versionName": "1.0.0",
  "versionCode": 1,
  "features": [],
  "permissions": [],
  "config": {
    "designWidth": 410
  },
  "router": {
    "entry": "pages/Home",
    "pages": {
      "pages/Home": {
        "component": "index"
      },
      "pages/Detail": {
        "component": "index"
      },
      "pages/Settings": {
        "component": "index"
      }
    }
  }
}
```

### Key Fields

| Field | Description |
|---|---|
| `package` | Unique app package name, e.g. `com.company.appname` |
| `name` | Display name (max ~6 CJK chars) |
| `icon` | Path to app icon image |
| `versionCode` | Integer, increment on every release |
| `config.designWidth` | Logical design canvas width in px (default: 410) |
| `router.entry` | The page shown on app launch |
| `router.pages` | Map of `pageName → { component }` — component is the `.ux` filename without extension |
| `permissions` | Array of `{ "name": "watch.permission.XXX" }` objects |

### Adding a New Page

1. Create `src/pages/PageName/index.ux`
2. Add an entry to `router.pages` in `manifest.json`:
   ```json
   "pages/PageName": { "component": "index" }
   ```

## `@system.router`

```ts
import router from '@system.router'
```

### Navigation Methods

#### `router.push(options)` — Navigate to a page

```ts
// Simple navigation
router.push({ uri: 'pages/Detail' })

// Pass parameters (they override the target page's data fields)
router.push({ uri: 'pages/Detail', params: { id: 42, title: 'Item' } })

// Wait for the page to close and get its return value
const result = await router.push({ uri: 'pages/Picker' })
console.log('Picker returned:', result)
```

> **Warning:** `await router.push()` waits until the user closes the target page, which
> can take a long time. Only `await` when you need the return value.

#### `router.replace(options)` — Replace current page

```ts
// Go to a new page and close the current one (no back-navigation to here)
router.replace({ uri: 'pages/Home' })
```

Use `replace()` for onboarding flows, splash screens, and redirects. **Never** use
`push()` followed immediately by `back()` — it breaks transitions.

#### `router.back(name?)` — Go back

```ts
router.back()            // Go to previous page
router.back('pages/Home') // Go back to a specific page in the stack
```

#### `router.close(page, result?)` — Close a page programmatically

```ts
import router from '@system.router'

export default {
  data: { selectedItem: null },

  onDestroy() {
    // Always return a result from onDestroy to handle all exit paths
    router.close(this.$page, this.selectedItem)
  },

  confirmSelection(item) {
    this.selectedItem = item
    router.back()
  },
}
```

### Receiving Route Parameters

Parameters passed via `router.push({ params })` override `data` properties on the
target page. Declare matching field names in `data`:

```js
// pages/Detail/index.ux
export default {
  data: {
    id: 0,       // will be set from router.push params
    title: '',   // will be set from router.push params
  },
  onInit() {
    console.log('opened with id:', this.id, 'title:', this.title)
  },
}
```

## Page Lifecycle (vs Component Lifecycle)

| Hook | Component | Page |
|---|---|---|
| `onInit()` | ✅ | ✅ |
| `onReady()` | ✅ | ✅ |
| `onShow()` | ❌ | ✅ |
| `onHide()` | ❌ | ✅ |
| `onDestroy()` | ✅ | ✅ |

`onShow` / `onHide` fire every time the page becomes visible or goes to the background.
`onInit` / `onDestroy` fire only once (create/destroy).

Always clean up timers and event subscriptions in `onDestroy()`.

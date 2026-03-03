---
applyTo: "**"
description: "Reference documentation for using Glyphix system APIS (@system.*) and capabilities."
---

# System APIs

All platform capabilities are provided through `@system.*` modules. **Never** use browser
globals (`fetch`, `localStorage`, etc.) — they do not exist in Glyphix.

## Quick Reference

| Capability | Module | Import |
|---|---|---|
| HTTP requests | `@system.fetch` | `import fetch from '@system.fetch'` |
| Local storage | `@system.storage` | `import storage from '@system.storage'` |
| Page routing | `@system.router` | `import router from '@system.router'` |
| Toast / Dialog | `@system.prompt` | `import prompt from '@system.prompt'` |
| Device info | `@system.device` | `import device from '@system.device'` |
| Timer / vibration | built-in `setTimeout` / `setInterval` | (global) |

---

## `@system.fetch` — HTTP Requests

```ts
import fetch from '@system.fetch'
```

### `fetch.fetch(options)` — Make an HTTP request

```ts
const response = await fetch.fetch({
  url: 'https://api.example.com/items',
  method: 'GET',           // 'GET' | 'POST' | 'PUT', default: 'GET'
  responseType: 'json',    // 'text' | 'json' | 'arraybuffer', default: 'text'
  // header: { 'Authorization': 'Bearer token' },
  // params: { page: 1, limit: 20 },   // appended to URL as query string
  // timeout: 6000,                     // ms, default: 6000
})

// response.code — HTTP status code (200 = success)
// response.data — parsed body (type depends on responseType)
// response.headers — response headers
```

For POST with JSON body:

```ts
const response = await fetch.fetch({
  url: 'https://api.example.com/items',
  method: 'POST',
  header: { 'Content-Type': 'application/json' },
  data: { name: 'New Item', value: 42 },
  responseType: 'json',
})
```

### Error Handling Pattern

```ts
export default {
  data: { items: [], loading: false, error: '' },

  onInit() { this.loadData() },

  async loadData() {
    this.loading = true
    this.error = ''
    try {
      const res = await fetch.fetch({
        url: 'https://api.example.com/items',
        responseType: 'json',
      })
      if (res.code === 200) {
        this.items = res.data
      } else {
        this.error = `Server error: ${res.code}`
      }
    } catch (err) {
      this.error = 'Network error'
      prompt.showToast({ message: 'Network Error' })
    } finally {
      this.loading = false
    }
  },
}
```

---

## `@system.storage` — Local Persistent Storage

```ts
import storage from '@system.storage'
```

Storage is **synchronous** and stores JSON-compatible values directly (no `JSON.stringify`
needed).

```ts
// Write
storage.set('user', { name: 'Alice', age: 30 })
storage.set('theme', 'dark')

// Read (returns undefined if key does not exist)
const user = storage.get('user')    // { name: 'Alice', age: 30 }
const theme = storage.get('theme')  // 'dark'

// Delete one key
storage.delete('theme')

// Clear all storage for this app
storage.clear()
```

---

## `@system.prompt` — Toast & Dialogs

```ts
import prompt from '@system.prompt'
```

### Toast

```ts
prompt.showToast({ message: 'Saved successfully' })
prompt.showToast({ message: 'Error occurred', duration: 3000 }) // ms
```

### Dialog

```ts
const result = await prompt.showDialog({
  title: 'Confirm',
  message: 'Delete this item?',
  buttons: [
    { text: 'Cancel', color: '#888888' },
    { text: 'Delete', color: '#ff3b30' },
  ],
})
// result.index — index of the pressed button (0-based)
if (result.index === 1) {
  this.deleteItem()
}
```

---

## Timers (Global)

Standard JS timers are available globally. Always clear them in `onDestroy()`.

```ts
export default {
  timer: null as ReturnType<typeof setInterval> | null,

  onInit() {
    this.timer = setInterval(() => {
      this.tick++
    }, 1000)
  },

  onDestroy() {
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }
  },
}
```

---

## Permissions

Some system modules require permissions declared in `manifest.json`:

```json
{
  "permissions": [
    { "name": "watch.permission.LOCATION" },
    { "name": "watch.permission.RECORD" }
  ]
}
```

Common permission names:
- `watch.permission.LOCATION` — GPS / geolocation
- `watch.permission.RECORD` — Microphone
- `watch.permission.DEVICE_INFO` — Device identifiers

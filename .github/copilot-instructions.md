# GitHub Copilot Instructions for Glyphix App Development

This project is a **Glyphix** application - a UI framework for MCU-based smartwatch devices.
Glyphix is **not a browser** and is **not React, Vue, or any Web framework**, though its component
syntax is inspired by Vue Options API.

## Quick Reference

- Component files use the `.ux` extension (UX = UI XML)
- No DOM, no `window`, no `document`, no browser APIs
- System capabilities come from `@system.*` modules
- Use `gx build` / `gx emu` to build and run in the emulator

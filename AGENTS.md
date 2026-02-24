# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Build Commands
- Standard mdBook commands: `mdbook build` (build), `mdbook serve` (local server), `mdbook watch` (watch mode)
- Deployment via GitHub Actions (see .github/workflows/deploy.yml)

## Project-Specific Patterns
- All documentation is in Simplified Chinese (filenames, content, comments)
- Event files use custom syntax: `@[event_name] { ... }` with JSON parameters or `@[event_name] "parameter"`
- Custom CSS includes external pixel font (zpix) from CDN
- Tools directory contains standalone HTML tools referenced in SUMMARY.md

## Key Directories
- `src/events/` – game event documentation with custom syntax
- `src/special/` – advanced tutorials
- `src/tools/` – HTML utilities for command extraction and editing
- `src/css/` – custom styling

## Important Notes
- This is a documentation project for "Word Game World" game commands ("black magic")
- No tests, linting, or type checking configured
- Always use Chinese for any new documentation or comments
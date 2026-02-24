# Project Debug Rules (Non-Obvious Only)

- Custom CSS uses external font (zpix) from CDN; offline builds may show fallback fonts
- HTML tools in src/tools/ are standalone and can be tested directly in browser
- No build-time validation of event syntax; errors only appear in rendered output
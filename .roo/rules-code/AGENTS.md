# Project Coding Rules (Non-Obvious Only)

- Event documentation uses custom syntax: `@[event_name] { ... }` with JSON parameters or `@[event_name] "parameter"`
- All documentation must be written in Simplified Chinese (filenames, content, comments)
- No linting or type checking configured - rely on manual review
- Tools directory contains HTML utilities that should not be modified unless necessary
- Custom CSS includes external pixel font (zpix) from CDN
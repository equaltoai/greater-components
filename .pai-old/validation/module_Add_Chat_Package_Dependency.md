# Module: Add Chat Package Dependency

## Type: update

## Files:
[apps/playground/package.json]

## File Changes:
- apps/playground/package.json: BEFORE: <<<
```json
  "dependencies": {
    "@equaltoai/greater-components-content": "workspace:*",
    "@equaltoai/greater-components-headless": "workspace:*",
    "@equaltoai/greater-components-icons": "workspace:*",
    "@equaltoai/greater-components-primitives": "workspace:*",
    "@equaltoai/greater-components-social": "workspace:*",
    "@equaltoai/greater-components-tokens": "workspace:*",
    "@equaltoai/greater-components-utils": "workspace:*"
  },
```
>>> | AFTER: <<<
```json
  "dependencies": {
    "@equaltoai/greater-components-chat": "workspace:*",
    "@equaltoai/greater-components-content": "workspace:*",
    "@equaltoai/greater-components-headless": "workspace:*",
    "@equaltoai/greater-components-icons": "workspace:*",
    "@equaltoai/greater-components-primitives": "workspace:*",
    "@equaltoai/greater-components-social": "workspace:*",
    "@equaltoai/greater-components-tokens": "workspace:*",
    "@equaltoai/greater-components-utils": "workspace:*"
  },
```
>>> | TYPE: line edit | DESC: Add @equaltoai/greater-components-chat workspace dependency to enable chat component imports

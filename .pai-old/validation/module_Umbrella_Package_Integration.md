# Module: Umbrella Package Integration

## Type: update

## Files:
[packages/greater-components/package.json]

## File Changes:
- packages/greater-components/package.json: BEFORE: <<<
    "./shared/notifications": {
      "types": "./dist/shared/notifications/index.d.ts",
      "svelte": "./dist/shared/notifications/src/index.ts",
      "import": "./dist/shared/notifications/index.js"
    },
    "./faces/social": {
>>> | AFTER: <<<
    "./shared/notifications": {
      "types": "./dist/shared/notifications/index.d.ts",
      "svelte": "./dist/shared/notifications/src/index.ts",
      "import": "./dist/shared/notifications/index.js"
    },
    "./shared/chat": {
      "types": "./dist/shared/chat/index.d.ts",
      "svelte": "./dist/shared/chat/src/index.ts",
      "import": "./dist/shared/chat/index.js"
    },
    "./chat": {
      "types": "./dist/shared/chat/index.d.ts",
      "svelte": "./dist/shared/chat/src/index.ts",
      "import": "./dist/shared/chat/index.js"
    },
    "./faces/social": {
>>> | TYPE: content replacement | DESC: Add chat package exports to umbrella package.json with both ./shared/chat and ./chat paths for flexibility

- packages/greater-components/package.json: BEFORE: <<<
    "@equaltoai/greater-components-notifications": "workspace:*",
    "@vitest/coverage-v8": "^4.0.12",
>>> | AFTER: <<<
    "@equaltoai/greater-components-notifications": "workspace:*",
    "@equaltoai/greater-components-chat": "workspace:*",
    "@vitest/coverage-v8": "^4.0.12",
>>> | TYPE: line edit | DESC: Add chat package as workspace devDependency

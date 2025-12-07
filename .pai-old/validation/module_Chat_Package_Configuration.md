# Module: Chat Package Configuration

## Type: creation

## Files:
[packages/shared/chat/package.json]

## File Changes:
- packages/shared/chat/package.json: BEFORE: DOES NOT EXIST | AFTER: <<<{
  "name": "@equaltoai/greater-components-chat",
  "version": "4.0.0",
  "type": "module",
  "description": "AI chat interface components for Greater Components",
  "license": "AGPL-3.0-only",
  "author": "Greater Contributors",
  "repository": {
    "type": "git",
    "url": "https://github.com/equaltoai/greater-components.git",
    "directory": "packages/shared/chat"
  },
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "svelte": "./src/index.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./src/index.ts",
      "import": "./dist/index.js"
    }
  },
  "files": [
    "dist",
    "src"
  ],
  "publishConfig": {
    "access": "public"
  },
  "scripts": {
    "build": "vite build && tsc --emitDeclarationOnly",
    "dev": "vite build --watch",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@equaltoai/greater-components-content": "workspace:*",
    "@equaltoai/greater-components-headless": "workspace:*",
    "@equaltoai/greater-components-icons": "workspace:*",
    "@equaltoai/greater-components-primitives": "workspace:*"
  },
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^6.2.1",
    "@types/node": "^24.10.1",
    "svelte": "^5.43.14",
    "typescript": "^5.9.3",
    "vite": "^7.2.4",
    "vitest": "^4.0.12"
  },
  "peerDependencies": {
    "svelte": "^5.43.6"
  },
  "private": true
}>>> | TYPE: content creation | DESC: Creates package.json with workspace dependencies on primitives, content, icons, and headless packages, matching the established pattern from messaging package

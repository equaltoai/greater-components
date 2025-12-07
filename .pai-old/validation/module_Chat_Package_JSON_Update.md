# Module: Chat Package JSON Update

## Type: update

## Files:
[packages/shared/chat/package.json]

## File Changes:
- packages/shared/chat/package.json: BEFORE: <<<
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^6.2.1",
    "@types/node": "^24.10.1",
    "svelte": "^5.43.14",
    "typescript": "^5.9.3",
    "vite": "^7.2.4",
    "vitest": "^4.0.12"
  },
>>> | AFTER: <<<
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^6.2.1",
    "@testing-library/svelte": "^5.2.6",
    "@types/node": "^24.10.1",
    "svelte": "^5.43.14",
    "typescript": "^5.9.3",
    "vite": "^7.2.4",
    "vitest": "^4.0.12"
  },
>>> | TYPE: line edit | DESC: Adds @testing-library/svelte as dev dependency for component testing

- packages/shared/chat/package.json: BEFORE: <<<
  "scripts": {
    "build": "vite build && tsc --emitDeclarationOnly",
    "dev": "vite build --watch",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
>>> | AFTER: <<<
  "scripts": {
    "build": "vite build && tsc --emitDeclarationOnly",
    "dev": "vite build --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "typecheck": "tsc --noEmit"
  },
>>> | TYPE: line edit | DESC: Adds test:watch and test:coverage scripts

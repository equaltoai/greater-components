# Module: Chat TypeScript Configuration

## Type: creation

## Files:
[packages/shared/chat/tsconfig.json]

## File Changes:
- packages/shared/chat/tsconfig.json: BEFORE: DOES NOT EXIST | AFTER: <<<{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "baseUrl": ".",
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "strict": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "paths": {
      "@equaltoai/greater-components-content": ["../../content/dist/index.d.ts"],
      "@equaltoai/greater-components-headless": ["../../headless/dist/index.d.ts"],
      "@equaltoai/greater-components-headless/*": ["../../headless/dist/*"],
      "@equaltoai/greater-components-icons": ["../../icons/dist/index.d.ts"],
      "@equaltoai/greater-components-primitives": ["../../primitives/dist/index.d.ts"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}>>> | TYPE: content creation | DESC: Creates tsconfig.json with path mappings for content, headless, icons, and primitives workspace dependencies

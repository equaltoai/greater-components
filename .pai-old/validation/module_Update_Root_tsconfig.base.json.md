# Module: Update Root tsconfig.base.json

## Type: update

## Files:
[tsconfig.base.json]

## File Changes:
- tsconfig.base.json: BEFORE: <<<      "@equaltoai/greater-components-notifications": ["./packages/shared/notifications/src/index.ts"],
      "@equaltoai/greater-components-notifications/*": ["./packages/shared/notifications/src/*"]
    },>>> | AFTER: <<<      "@equaltoai/greater-components-notifications": ["./packages/shared/notifications/src/index.ts"],
      "@equaltoai/greater-components-notifications/*": ["./packages/shared/notifications/src/*"],
      "@equaltoai/greater-components-chat": ["./packages/shared/chat/src/index.ts"],
      "@equaltoai/greater-components-chat/*": ["./packages/shared/chat/src/*"]
    },>>> | TYPE: line edit | DESC: Adds path mappings for the chat package to enable TypeScript resolution across the monorepo

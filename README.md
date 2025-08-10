# Greater Components

> AGPL-licensed Fediverse UI components built with Svelte 5, TypeScript, and pnpm workspaces

## Overview

Greater Components is a comprehensive component library designed for building modern, accessible, and performant Fediverse applications. Built with Svelte 5's revolutionary runes system and TypeScript's strict mode, this library provides everything needed to create engaging social experiences.

## Features

- **Svelte 5 Runes**: Leveraging the latest reactive primitives for optimal performance
- **TypeScript Strict**: Full type safety and excellent developer experience
- **Accessibility First**: WCAG 2.1 AA compliant components with full keyboard and screen reader support
- **Design Tokens**: Flexible theming system with light, dark, and high-contrast modes
- **Real-time Ready**: WebSocket-first architecture with automatic fallbacks
- **Monorepo Structure**: Organized packages for tokens, icons, primitives, and Fediverse-specific components
- **Comprehensive Testing**: Vitest, Storybook, and Playwright for reliable components

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| `@greater/tokens` | Design tokens and theming | 🚧 In Development |
| `@greater/icons` | Icon library with Feather + Fediverse glyphs | 🚧 In Development |
| `@greater/primitives` | Core UI building blocks | 🚧 In Development |
| `@greater/fediverse` | Fediverse-specific components | 🚧 In Development |
| `@greater/adapters` | Transport and state management | 🚧 In Development |
| `@greater/utils` | Shared utilities and helpers | 🚧 In Development |

## Quick Start

### Prerequisites

- Node.js v20 or higher
- pnpm v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/equaltoai/greater-components.git
cd greater-components

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development mode
pnpm dev
```

## Development

### Scripts

- `pnpm dev` - Start development mode with hot reload
- `pnpm build` - Build all packages
- `pnpm test` - Run all tests
- `pnpm lint` - Lint code with ESLint
- `pnpm format` - Format code with Prettier
- `pnpm changeset` - Create a changeset for version management

### Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct, development process, and how to submit pull requests.

All contributions must be signed off according to the DCO (Developer Certificate of Origin).

## Architecture

This monorepo uses:

- **pnpm workspaces** for package management
- **Changesets** for versioning and releases
- **Vite** for building and development
- **Vitest** for unit testing
- **Storybook** for component development
- **Playwright** for E2E testing
- **GitHub Actions** for CI/CD

## License

This project is licensed under the AGPL-3.0-only License - see the [LICENSE](LICENSE) file for details.

## Security

For security vulnerabilities, please email security@equalto.ai instead of using the issue tracker.

## Roadmap

See our [Implementation Checklist](IMPLEMENTATION_CHECKLIST.md) for the detailed development roadmap.

### Phase Overview

- **Phase 0**: Repository scaffolding ✅
- **Phase 1**: Foundation packages (tokens, icons, primitives)
- **Phase 2**: Read-only components
- **Phase 3**: Interactive components
- **Phase 4**: Composer and profiles
- **Phase 5**: Settings and documentation
- **Phase 6**: v1.0 GA release

## Support

- [Documentation](https://greater-components.equalto.ai)
- [Issue Tracker](https://github.com/equaltoai/greater-components/issues)
- [Discussions](https://github.com/equaltoai/greater-components/discussions)

## Acknowledgments

Built with ❤️ by the Equal To AI team for the Fediverse community.
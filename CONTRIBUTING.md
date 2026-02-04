# Contributing to Greater Components

Thank you for your interest in contributing to Greater Components! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct, which promotes a welcoming and inclusive environment for all contributors.

## Developer Certificate of Origin (DCO)

This project uses the Developer Certificate of Origin (DCO) to ensure that all contributions are properly licensed. The DCO is a lightweight mechanism for contributors to certify that they have the right to submit their contributions under the project's license.

### What is the DCO?

The DCO is a statement that you, as a contributor, have the legal right to make the contribution and agree to license it under the project's open source license (AGPL-3.0-only).

### How to Sign Your Commits

All commits must be signed off using the `-s` or `--signoff` flag:

```bash
git commit -s -m "feat: add new component"
```

This adds a `Signed-off-by` line to your commit message:

```
feat: add new component

Signed-off-by: Your Name <your.email@example.com>
```

### DCO Text

By making a contribution to this project, I certify that:

```
Developer Certificate of Origin
Version 1.1

Copyright (C) 2004, 2006 The Linux Foundation and its contributors.

Everyone is permitted to copy and distribute verbatim copies of this
license document, but changing it is not allowed.

Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the open source license
    indicated in the file; or

(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part
    by me, under the same open source license (unless I am
    permitted to submit under a different license), as indicated
    in the file; or

(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.

(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with
    this project or the open source license(s) involved.
```

## Getting Started

### Prerequisites

- Node.js v24 or higher (check `.nvmrc`)
- pnpm v9 or higher
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/greater-components.git
   cd greater-components
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Install Playwright browsers (only needed for Playwright-based tests like `pnpm test:e2e` / `pnpm test:a11y`):
   ```bash
   pnpm playwright:install
   ```
5. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Code Style

- We use ESLint and Prettier for code formatting
- Run `pnpm lint` to check for linting issues
- Run `pnpm format` to format code
- TypeScript strict mode is enabled - ensure no type errors

### Testing

- Write tests for all new features
- Run `pnpm test` to run all tests
- Run `pnpm test:unit` for unit tests
- Run `pnpm test:e2e` for end-to-end tests
- If Playwright tests fail due to missing browsers, run `pnpm playwright:install`
- Maintain the repo coverage thresholds (see `pnpm test:coverage:report`)

### Commit Messages

We follow the Conventional Commits specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Build process or auxiliary tool changes

Examples:

```bash
git commit -s -m "feat: add Button component with variants"
git commit -s -m "fix: correct focus trap in Modal component"
git commit -s -m "docs: update README with installation instructions"
```

### Pull Request Process

1. Ensure all tests pass and coverage requirements are met
2. Update documentation as needed
3. Add a changeset for your changes:
   ```bash
   pnpm changeset
   ```
4. Create a pull request with a clear description
5. Link any related issues
6. Wait for code review and address feedback

### Changesets

This project uses [Changesets](https://github.com/changesets/changesets) for version management:

1. Run `pnpm changeset` when you make changes
2. Select the packages affected
3. Choose the version bump type (major, minor, patch)
4. Write a summary of your changes
5. Commit the generated changeset file

## Package Development

### Creating a New Package

1. Create a new directory under `packages/`
2. Add a `package.json` with proper configuration
3. Extend `tsconfig.base.json` for TypeScript config
4. Add exports to the package.json
5. Update the root `README.md` if needed

### Component Guidelines

For UI components:

1. Use Svelte 5 runes (`$state`, `$derived`, etc.)
2. Ensure full TypeScript typing
3. Include proper ARIA attributes
4. Write Storybook stories
5. Add comprehensive tests
6. Document props, slots, and events
7. Follow the design token system

## Accessibility

All components must meet WCAG 2.1 AA standards:

- Proper semantic HTML
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast requirements
- Reduced motion support

## Security

- Never commit sensitive data
- Run `pnpm audit` regularly
- Report security vulnerabilities privately to security@equalto.ai
- Follow OWASP guidelines for web security

## Release Process

Releases are automated through GitHub Actions:

1. Changesets create a release PR
2. Maintainers review and merge the PR
3. GitHub Actions automatically publishes to npm
4. Tags and releases are created on GitHub

## Questions?

- Open a [Discussion](https://github.com/equaltoai/greater-components/discussions) for general questions
- File an [Issue](https://github.com/equaltoai/greater-components/issues) for bugs or feature requests
- Join our community chat for real-time help

## License

By contributing to Greater Components, you agree that your contributions will be licensed under the AGPL-3.0-only license.

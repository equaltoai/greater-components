# JSR Publishing Guide

This guide covers the complete process of publishing Greater Components packages to JSR (JavaScript Registry).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Understanding JSR](#understanding-jsr)
- [Package Configuration](#package-configuration)
- [Publishing Workflow](#publishing-workflow)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Prerequisites

### Required Tools

1. **Node.js** (>= 20.0.0)
2. **pnpm** (>= 9.0.0)
3. **JSR CLI** - Will be installed automatically by the publish script
4. **JSR Account** - Create one at [jsr.io](https://jsr.io)

### Authentication

Before publishing, authenticate with JSR:

```bash
npx jsr login
```

This will open a browser window for authentication. Once complete, you'll be able to publish packages.

## Understanding JSR

### What is JSR?

JSR (JavaScript Registry) is a modern package registry designed for JavaScript and TypeScript projects. Key features:

- **Native TypeScript support** - No build step required for types
- **Import from anywhere** - Works with Node.js, Deno, browsers, and bundlers
- **Fast and secure** - Built-in security scanning and fast CDN delivery
- **Great DX** - Excellent documentation and tooling

### Why JSR for Greater Components?

1. **TypeScript-first** - Our entire library is TypeScript-based
2. **Svelte support** - JSR handles `.svelte` files natively
3. **Modern tooling** - Better dev experience than npm
4. **Dual publishing** - We can publish to both JSR and npm

## Package Configuration

Each package has two configuration files:

### 1. `jsr.json`

The primary JSR configuration file:

```json
{
  "name": "@greater/primitives",
  "version": "1.0.0",
  "exports": {
    ".": "./src/index.ts",
    "./components/*": "./src/components/*.svelte"
  },
  "publish": {
    "include": [
      "src/**/*.ts",
      "src/**/*.svelte",
      "README.md"
    ],
    "exclude": [
      "**/*.test.ts",
      "**/tests/**"
    ]
  }
}
```

**Key fields:**

- `name` - Package name on JSR (must match npm name)
- `version` - Package version (should match package.json)
- `exports` - Entry points for the package
- `publish.include` - Files to include in the package
- `publish.exclude` - Files to exclude from the package

### 2. `package.json`

Standard npm package configuration, also used by JSR:

```json
{
  "name": "@greater/primitives",
  "version": "1.0.0",
  "type": "module",
  "description": "Primitive UI components for Greater Components",
  "license": "AGPL-3.0-only",
  "author": "Greater Contributors",
  "repository": {
    "type": "git",
    "url": "https://github.com/equaltoai/greater-components.git",
    "directory": "packages/primitives"
  }
}
```

## Publishing Workflow

### Step 1: Ensure All Tests Pass

Before publishing, run the full test suite:

```bash
# Run all tests
pnpm test

# Run type checking
pnpm typecheck

# Run linting
pnpm lint
```

### Step 2: Update Version Numbers

If this is a new version, update version numbers:

```bash
# Using changesets (recommended)
pnpm changeset
pnpm changeset version

# Or manually update package.json and jsr.json in each package
```

### Step 3: Build All Packages

Build all packages to ensure they compile:

```bash
pnpm build
```

### Step 4: Dry Run (Recommended)

Test the publishing process without actually publishing:

```bash
# Test all packages
pnpm publish:jsr:dry

# Test a single package
pnpm publish:jsr:single --package=primitives --dry-run
```

This will validate:
- Package configuration
- Build outputs
- File inclusions/exclusions
- JSR compatibility

### Step 5: Publish to JSR

Once the dry run succeeds, publish for real:

```bash
# Publish all packages
pnpm publish:jsr

# Publish a single package
pnpm publish:jsr:single --package=primitives
```

### Step 6: Verify Publication

After publishing, verify on JSR:

1. Visit `https://jsr.io/@greater/<package-name>`
2. Check the documentation is rendered correctly
3. Verify all exports are available
4. Test importing in a sample project

## Package Publishing Order

Due to dependencies, publish packages in this order:

1. **tokens** - No dependencies
2. **utils** - No dependencies
3. **primitives** - Depends on tokens
4. **icons** - No dependencies
5. **adapters** - No dependencies
6. **fediverse** - Depends on tokens, utils, primitives, icons
7. **testing** - Testing utilities

The publish script handles this automatically.

## Troubleshooting

### Common Issues

#### 1. Authentication Errors

**Problem:** `Error: Not authenticated with JSR`

**Solution:**
```bash
npx jsr login
```

#### 2. Version Already Exists

**Problem:** `Error: Version 1.0.0 already exists`

**Solution:** Update the version number in both `package.json` and `jsr.json`, then try again.

#### 3. Build Failures

**Problem:** Package fails to build

**Solution:**
```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build
```

#### 4. Missing Files

**Problem:** `Error: Export './components/Button.svelte' not found`

**Solution:** Check the `publish.include` array in `jsr.json` includes all necessary files.

#### 5. Type Errors

**Problem:** TypeScript errors during publish

**Solution:**
```bash
# Run type checking
pnpm typecheck

# Fix any errors in the source code
```

### Getting Help

If you encounter issues:

1. Check the [JSR documentation](https://jsr.io/docs)
2. Review package configurations in `jsr.json`
3. Check build outputs in `dist/` directories
4. Open an issue on GitHub

## Best Practices

### 1. Version Management

- Use semantic versioning (semver)
- Update CHANGELOG.md for each release
- Use `changesets` for version management
- Keep version numbers in sync between package.json and jsr.json

### 2. Documentation

- Include comprehensive README.md in each package
- Add JSDoc comments to all public APIs
- Provide usage examples
- Document breaking changes

### 3. Testing Before Publishing

Always run the full test suite:

```bash
pnpm test
pnpm test:e2e
pnpm typecheck
pnpm lint
```

### 4. Gradual Rollout

For major updates:

1. Publish to JSR first with a beta version
2. Test in a sample project
3. Publish stable version
4. Update documentation

### 5. Monitoring

After publishing:

- Monitor JSR download statistics
- Watch for reported issues
- Check compatibility reports
- Review user feedback

## CI/CD Integration

### GitHub Actions

You can automate JSR publishing with GitHub Actions:

```yaml
name: Publish to JSR

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write

    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Build packages
        run: pnpm build
      
      - name: Publish to JSR
        run: pnpm publish:jsr
        env:
          JSR_TOKEN: ${{ secrets.JSR_TOKEN }}
```

### Setting up JSR Token

1. Generate a token on JSR: https://jsr.io/account/tokens
2. Add it to GitHub Secrets as `JSR_TOKEN`
3. The workflow will use it automatically

## Dual Publishing (JSR + npm)

Greater Components can be published to both JSR and npm:

### JSR (Primary)

```bash
pnpm publish:jsr
```

### npm (Secondary)

```bash
# After JSR publishing
pnpm release  # Uses changesets
```

Users can install from either registry:

```bash
# From JSR
npx jsr add @greater/primitives

# From npm
npm install @greater/primitives
```

## Package URLs

After publishing, packages are available at:

- **JSR:** `https://jsr.io/@greater/<package-name>`
- **npm:** `https://www.npmjs.com/package/@greater/<package-name>`

## Useful Commands

```bash
# Validate JSR configuration
npx jsr check

# Show package info
npx jsr info @greater/primitives

# List all versions
npx jsr versions @greater/primitives

# Dry run publish
pnpm publish:jsr:dry

# Publish single package
pnpm publish:jsr:single --package=primitives

# Publish all packages
pnpm publish:jsr
```

## Additional Resources

- [JSR Documentation](https://jsr.io/docs)
- [JSR CLI Reference](https://jsr.io/docs/cli)
- [Publishing Guide](https://jsr.io/docs/publishing-packages)
- [Troubleshooting](https://jsr.io/docs/troubleshooting)

## Support

For issues specific to Greater Components:

- GitHub Issues: https://github.com/equaltoai/greater-components/issues
- Discussions: https://github.com/equaltoai/greater-components/discussions

For JSR-specific issues:

- JSR Support: https://jsr.io/support
- JSR Discord: https://discord.gg/jsr



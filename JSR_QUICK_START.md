# JSR Quick Start Guide

Quick reference for publishing Greater Components to JSR.

## 🚀 First Time Setup

```bash
# 1. Login to JSR
npx jsr login

# 2. Verify packages are configured
ls packages/*/jsr.json  # Should list all package configs
```

## 📦 Publishing Workflow

### Test Before Publishing (Recommended)

```bash
# 1. Run all tests
pnpm test && pnpm typecheck && pnpm lint

# 2. Build packages
pnpm build

# 3. Dry run (test without publishing)
pnpm publish:jsr:dry
```

### Publish All Packages

```bash
pnpm publish:jsr
```

### Publish Single Package

```bash
pnpm publish:jsr:single --package=primitives
```

## 📋 Pre-Publish Checklist

- [ ] All tests passing (`pnpm test`)
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Packages build successfully (`pnpm build`)
- [ ] Version numbers updated (package.json + jsr.json)
- [ ] CHANGELOG.md updated
- [ ] Dry run successful (`pnpm publish:jsr:dry`)
- [ ] Logged into JSR (`npx jsr whoami`)

## 📚 Package Order

Packages are published in dependency order:

1. `tokens` - Design tokens
2. `utils` - Utilities
3. `primitives` - Core components
4. `icons` - Icon components
5. `adapters` - Transport adapters
6. `fediverse` - Fediverse components
7. `testing` - Testing utilities

## 🔍 Verification

After publishing, check:

```bash
# View package on JSR
open https://jsr.io/@greater/primitives

# Test installation
mkdir test-install && cd test-install
npx jsr add @greater/primitives
```

## 🆘 Troubleshooting

### Not Authenticated
```bash
npx jsr login
```

### Version Already Exists
Update version in `package.json` and `jsr.json`

### Build Fails
```bash
pnpm clean
pnpm install
pnpm build
```

### Missing Files
Check `publish.include` in `jsr.json`

## 📖 Full Documentation

See [docs/JSR_PUBLISHING_GUIDE.md](./docs/JSR_PUBLISHING_GUIDE.md) for complete details.

## 🔗 Useful Links

- **JSR Homepage**: https://jsr.io
- **JSR Docs**: https://jsr.io/docs
- **Package Search**: https://jsr.io/@greater
- **CLI Reference**: https://jsr.io/docs/cli

## 💡 Tips

- Always do a dry run first
- Test in a fresh project after publishing
- Monitor the JSR dashboard for stats
- Keep versions in sync across package.json and jsr.json
- Document breaking changes in CHANGELOG.md



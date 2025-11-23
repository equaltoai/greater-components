# v2.2.0 Release Checklist

## Pre-Release
- [ ] All tests passing
- [ ] Bundle size verified (<10KB increase)
- [ ] Documentation complete
- [ ] Playground examples working
- [ ] Exports verified
- [ ] TypeScript types verified
- [ ] Changelog updated
- [ ] Version bumped

## Build
- [ ] Clean install: `rm -rf node_modules && pnpm install`
- [ ] Clean build: `pnpm build`
- [ ] Verify build outputs in `packages/*/dist/`

## Testing
- [ ] Unit tests: `pnpm test`
- [ ] Type check: `pnpm typecheck`
- [ ] Lint: `pnpm lint`
- [ ] Playground: `pnpm --filter @equaltoai/greater-components-playground dev`

## Documentation
- [ ] README.md updated with v2.2.0 info
- [ ] docs/IMPLEMENTATION_GUIDE_V2.2.0.md complete
- [ ] docs/troubleshooting-v2.2.0.md complete
- [ ] docs/migration/v2.2.0.md complete
- [ ] docs/V2.2.0_DOCUMENTATION_INDEX.md complete

## Release
- [ ] Git tag: `git tag v2.2.0`
- [ ] Push tag: `git push origin v2.2.0`
- [ ] GitHub release with changelog
- [ ] Publish to npm (if applicable): `pnpm publish -r`
- [ ] Publish to JSR: `pnpm run publish:jsr`

## Post-Release
- [ ] Verify published packages
- [ ] Test installation in clean project
- [ ] Share documentation with implementing team
- [ ] Monitor for issues

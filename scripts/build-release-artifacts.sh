#!/usr/bin/env bash
set -euo pipefail

pnpm build
pnpm --filter @equaltoai/greater-components-cli test:e2e
node scripts/validate-registry-index.js --strict
node scripts/validate-release-versions.js
node scripts/pack-for-release.js --skip-build


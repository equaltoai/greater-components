#!/bin/bash

# Script to fix common TypeScript errors across the codebase

echo "Fixing TypeScript errors..."

# Fix playwright.config.ts - process.env.CI needs bracket notation
find packages -name "playwright*.config.ts" -exec sed -i "s/process\.env\.CI/process.env['CI']/g" {} \;
find apps -name "playwright*.config.ts" -exec sed -i "s/process\.env\.CI/process.env['CI']/g" {} \;

# Fix vitest.config.ts - process.env.VITEST needs bracket notation  
find packages -name "vitest.config.ts" -exec sed -i "s/process\.env\.VITEST/process.env['VITEST']/g" {} \;

echo "Fixed config files"
echo "Remaining errors require manual fixes in test files"

#!/usr/bin/env bash

# Greater Components initialization script
set -e

echo "🚀 Initializing Greater Components repository..."

# Check Node version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v20 or higher."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version is too old. Please install Node.js v20 or higher."
    exit 1
fi

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm@9
fi

echo "📦 Installing dependencies..."
pnpm install

echo "🔧 Setting up Git hooks..."
pnpm prepare || true

echo "✅ Greater Components repository initialized successfully!"
echo ""
echo "Available commands:"
echo "  pnpm dev        - Start development mode"
echo "  pnpm build      - Build all packages"
echo "  pnpm test       - Run tests"
echo "  pnpm lint       - Lint code"
echo "  pnpm format     - Format code"
echo "  pnpm changeset  - Create a changeset"
echo ""
echo "Next steps:"
echo "1. Create your first package in packages/"
echo "2. Start the development environment with 'pnpm dev'"
echo "3. Check the implementation checklist in IMPLEMENTATION_CHECKLIST.md"
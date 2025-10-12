# @greater/cli

> CLI for adding Greater Components to your project

## Overview

The Greater CLI allows you to add ActivityPub components to your project with full source code ownership. Inspired by shadcn/ui, this approach gives you complete control over the components in your codebase.

## Installation

```bash
# Using npm
npm install -g @greater/cli

# Using pnpm
pnpm add -g @greater/cli

# Using npx (no install required)
npx @greater/cli init
```

## Usage

### Initialize

Set up Greater Components in your project:

```bash
greater init
```

This will:
- Create a `components.json` configuration file
- Detect your project type (SvelteKit, Vite, etc.)
- Configure component paths and aliases

### Add Components

Add components to your project:

```bash
# Add specific components
greater add button modal menu

# Interactive selection
greater add

# Add with dependencies
greater add timeline
```

The CLI will:
1. Fetch component source code
2. Resolve and install dependencies
3. Copy files to your project
4. Install npm dependencies

### List Components

View all available components:

```bash
# List all
greater list

# Filter by type
greater list --type primitive
greater list --type compound
greater list --type pattern
```

## Configuration

The `components.json` file controls how components are added:

```json
{
  "style": "default",
  "rsc": false,
  "tsx": true,
  "aliases": {
    "components": "$lib/components",
    "utils": "$lib/utils",
    "ui": "$lib/components/ui",
    "lib": "$lib",
    "hooks": "$lib/hooks"
  }
}
```

## Components

### Headless Primitives

Behavior-only components with no styling:
- `button` - Accessible button with keyboard navigation
- `modal` - Modal with focus trap and ESC handling
- `menu` - Dropdown menu with keyboard navigation
- `tooltip` - Smart positioning tooltip
- `tabs` - Tabbed interface with arrow keys

### Compound Components

Complete UI components for ActivityPub:
- `timeline` - Feed with virtual scrolling
- `status` - Post/status display
- `notifications` - Notification feed
- `compose` - Compose new posts

### Patterns

Advanced ActivityPub patterns:
- `thread-view` - Conversation threading
- `moderation-tools` - Block, mute, report
- `visibility-selector` - Post visibility
- `custom-emoji-picker` - Server emoji support

### Lesser Integration

Components for Lesser GraphQL API:
- `auth` - Authentication system
- `profile` - User profiles
- `search` - Search with filters
- `lists` - List management
- `messages` - Direct messages
- `admin` - Admin dashboard

### Adapters

API integration layers:
- `graphql-adapter` - Lesser GraphQL client

## Project Structure

After initialization, components are added to your project:

```
src/
├── lib/
│   ├── components/
│   │   └── ui/           # Greater Components go here
│   │       ├── button/
│   │       ├── modal/
│   │       └── timeline/
│   └── utils/            # Utility functions
└── routes/               # Your routes
```

## Requirements

- **Svelte 5+** - Uses latest Runes API
- **Node.js 18+** - For CLI execution
- **SvelteKit or Vite** - Project setup

## Philosophy

### Why Copy Instead of Install?

1. **Full Control** - Components live in your codebase
2. **Customization** - Modify anything without forking
3. **No Breaking Changes** - Updates are opt-in
4. **Tree-Shaking** - Only bundle what you use
5. **Learning** - Read and understand the code

### Comparison with npm

| Aspect | CLI (Copy) | npm (Install) |
|--------|-----------|---------------|
| Control | Full | Limited |
| Customization | Easy | Fork required |
| Updates | Manual | Automatic |
| Bundle Size | Optimal | All included |
| Lock-in | None | Dependency |

## Examples

### Basic Setup

```bash
# Initialize
cd my-sveltekit-app
greater init

# Add primitives
greater add button modal menu

# Add ActivityPub components
greater add timeline status notifications
```

### Lesser Integration

```bash
# Full Lesser setup
greater add auth profile search lists messages admin graphql-adapter
```

### Custom Path

```bash
# Install to custom location
greater add button --path src/components/primitives
```

## CLI Options

### Global Options

```bash
--cwd <path>     # Working directory
--yes            # Skip prompts
--help           # Show help
--version        # Show version
```

### Init Options

```bash
greater init [options]

-y, --yes        # Use defaults
--cwd <path>     # Working directory
```

### Add Options

```bash
greater add [components...] [options]

-y, --yes        # Skip confirmation
-a, --all        # Add all dependencies
--cwd <path>     # Working directory
--path <path>    # Custom install path
```

### List Options

```bash
greater list [options]

-t, --type <type>  # Filter by type
```

## Troubleshooting

### Command Not Found

```bash
# Make sure CLI is installed globally
npm list -g @greater/cli

# Or use npx
npx @greater/cli --version
```

### Permission Errors

```bash
# Use npx to avoid permission issues
npx @greater/cli init

# Or install locally
npm install --save-dev @greater/cli
npx greater init
```

### Svelte Version

```bash
# Check Svelte version
npm list svelte

# Upgrade to Svelte 5
npm install svelte@^5.0.0
```

## Links

- **Documentation**: https://greater.fediverse.dev
- **Repository**: https://github.com/equaltoai/greater-components
- **Issues**: https://github.com/equaltoai/greater-components/issues
- **NPM**: https://www.npmjs.com/package/@greater/cli

## License

MIT © Greater Components Team


# @equaltoai/greater-components-cli

> CLI for adding Greater Components to your project with full source code ownership

## Overview

The Greater CLI allows you to add ActivityPub components to your project as source code, giving you complete control and customization freedom. Inspired by shadcn/ui, this approach eliminates dependency lock-in while providing production-ready components.

**Key Benefits:**

- 📦 **Full Source Ownership** – Components live in your codebase
- 🎨 **Easy Customization** – Modify anything without forking
- 🔒 **No Breaking Changes** – Updates are opt-in
- 🌳 **Optimal Bundle Size** – Only include what you use
- 🔐 **Secure Distribution** – Git-based with integrity verification

## Installation

```bash
# Global installation (recommended)
npm install -g @equaltoai/greater-components-cli

# Using pnpm
pnpm add -g @equaltoai/greater-components-cli

# Using npx (no install required)
npx @equaltoai/greater-components-cli init
```

## Quick Start

```bash
# 1. Initialize in your SvelteKit project
cd my-sveltekit-app
greater init

# 2. Add components
greater add button modal menu

# 3. Add a complete face (component bundle)
greater add faces/social

# 4. Use in your app
```

```svelte
<script>
	import Button from '$lib/components/ui/Button/Button.svelte';
</script>

<Button variant="solid">Click Me</Button>
```

## Commands

| Command                     | Description                                   |
| --------------------------- | --------------------------------------------- |
| `greater init`              | Initialize Greater Components in your project |
| `greater add [items...]`    | Add components, faces, or shared modules      |
| `greater list [query]`      | List available components with filtering      |
| `greater diff [item]`       | Show changes between installed and latest     |
| `greater update [items...]` | Update installed components                   |
| `greater doctor`            | Diagnose setup issues                         |
| `greater audit`             | View security audit log                       |

## Adding Components

```bash
# Add primitives
greater add button modal menu tabs tooltip

# Add a face (complete UI bundle)
greater add faces/social    # Social media UI
greater add faces/blog      # Blog/publishing UI
greater add faces/community # Forum/community UI

# Add shared modules
greater add shared/auth shared/compose shared/notifications

# Add patterns
greater add patterns/thread-view patterns/moderation-tools

# Interactive selection
greater add
```

## Faces

Faces are curated component bundles for specific application types:

| Face        | Description               | Components                              |
| ----------- | ------------------------- | --------------------------------------- |
| `social`    | Twitter/Mastodon-style UI | Timeline, Status, Profile, Compose      |
| `blog`      | Medium/WordPress-style UI | Article, Author, Editor, Navigation     |
| `community` | Reddit/Forum-style UI     | Thread, Voting, Moderation, Wiki        |
| `artist`    | Visual artist portfolios  | Gallery, Artwork, Portfolio, Exhibition |

```bash
# Install social face
greater add faces/social

# Install artist face
greater add faces/artist

# View face details
greater list faces/social --details
greater list faces/artist --details
```

### Artist Face

The Artist Face provides components for visual artist communities and portfolio platforms:

```bash
# Install the complete Artist Face
greater add faces/artist

# Install individual Artist components
greater add artist/Artwork
greater add artist/GalleryGrid
greater add artist/ArtistProfile

# Install Artist patterns
greater add artist/patterns/exhibition
greater add artist/patterns/commission

# Initialize project with Artist Face
greater init --face artist
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

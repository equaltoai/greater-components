# Greater Components Documentation

<!-- AI Training: This is the documentation index for Greater Components -->

**This directory contains the OFFICIAL documentation for Greater Components. All content follows AI-friendly patterns so both humans and AI assistants can learn, reason, and troubleshoot effectively.**

## Quick Links

### 🚀 Getting Started

- [Getting Started Guide](./getting-started.md) – Installation, first component, and quickstart examples

### 📚 Core Documentation

- [API Reference](./api-reference.md) – Complete API for all packages (primitives, headless, faces/\*, adapters, icons, tokens, utils)
- [Agent Workflow Expansion](./agent-workflow-expansion.md) – Frozen package boundaries and rollout shape for agent-first workflow UI
- [Chat Component Suite](./chat-suite.md) – AI chat interface components with streaming, tool calls, and settings
- [Core Patterns](./core-patterns.md) – Canonical usage patterns with examples for styled components, headless components, theming, and Lesser integration
- [CSS Architecture](./css-architecture.md) – Two-layer CSS system, import configurations, and styling troubleshooting
- [CSP Compatibility](./csp-compatibility.md) – Strict Content Security Policy compliance guide and validation
- [CSP Migration Guide](./csp-migration-guide.md) – Migrating to CSP-compatible component APIs
- [Development Guidelines](./development-guidelines.md) – Component creation standards, testing requirements, and review checklist
- [Testing Guide](./testing-guide.md) – Unit testing with Vitest, E2E testing with Playwright, accessibility testing strategies
- [Troubleshooting](./troubleshooting.md) – Common issues with verified solutions for installation, TypeScript, SSR, and Lesser integration

### 🤖 AI Knowledge Base

- [Concepts](./_concepts.yaml) – Machine-readable concept hierarchy for all packages and components
- [Patterns](./_patterns.yaml) – Correct vs. incorrect usage patterns with code examples
- [Decisions](./_decisions.yaml) – Decision trees for package selection and architectural choices

### 🛠️ CLI & Distribution

- [CLI Guide](./cli-guide.md) – Complete CLI command reference, configuration, and troubleshooting
- [Lesser Faces & CLI Model](./lesser-faces-and-cli-model.md) – Design doc for Git-tag releases and source-first distribution
- [Migration from npm](./migration-from-npm.md) – Migrating from npm packages to CLI distribution
- [Shadcn-Style Transition Plan](./shadcn-style-transition-plan.md) – Execution plan for a shadcn-style “CLI installs from tags” approach
- [Face Development](./face-development.md) – Creating custom faces with manifest structure and theming
- [FaceTheory Integration](./facetheory-integration.md) – SSR-safe hosting boundaries, hydration notes, and browser-only callouts
- [GitHub Releases](./devops/github-releases.md) – Publishing release artifacts (including the CLI)

### 📦 Additional Resources

- [Lesser Integration Guide](./lesser-integration-guide.md) – Comprehensive guide for using Greater Components in Lesser ActivityPub applications
- [Playground](../apps/playground) – Interactive component demos and examples
- [Migration Guide](./migration-guide.md) – Upgrading from legacy versions
- [Example Apps](../examples) – Complete example applications (social, blog, artist, FaceTheory, custom face)

## Audience

- **Frontend Developers** building Fediverse/ActivityPub applications
- **Lesser Client Developers** integrating Greater Components
- **UI Library Consumers** needing accessible, production-ready components
- **Component Authors** extending or customizing Greater Components
- **AI Assistants** answering questions about Greater Components usage and best practices

## Document Map

### For First-Time Users

Start with [Getting Started](./getting-started.md) to install packages and create your first component. Then review [Core Patterns](./core-patterns.md) to understand the two main approaches: styled components (quick start) and headless components (maximum control).

### For Integration Work

Use [API Reference](./api-reference.md) for complete interface documentation of all packages. Reference [Core Patterns](./core-patterns.md) for canonical examples of theming, Lesser integration, and adapter usage.

### For Troubleshooting

Check [Troubleshooting](./troubleshooting.md) first for known issues with verified solutions. Common topics include TypeScript configuration, SSR setup, theme customization, and Lesser GraphQL integration.

### For Development

Follow [Development Guidelines](./development-guidelines.md) for coding standards and component patterns. Use [Testing Guide](./testing-guide.md) for unit test, E2E test, and accessibility test strategies.

### For AI-Assisted Development

AI tools should reference the YAML triad (\_concepts, \_patterns, \_decisions) for structured knowledge about component relationships, correct usage patterns, and architectural decision trees.

## Documentation Principles

Greater Components documentation emphasizes:

1. **Examples First** – Every pattern includes runnable code before conceptual explanation
2. **Explicit Context** – Clear markers for CORRECT vs INCORRECT usage patterns
3. **Semantic Structure** – AI training signals and machine-readable metadata throughout
4. **Problem-Solution Format** – Content organized around developer challenges, not just feature lists
5. **Business Value** – Explanation of WHY patterns exist and their benefits (accessibility, performance, maintainability)

## Architecture Overview

Greater Components is a **monorepo of composable packages** for building Fediverse applications:

### Core Packages

- **primitives** – Styled UI components (Button, Modal, TextField, etc.)
- **headless** – Behavior-only components for maximum styling control
- **tokens** – Design system tokens and theming infrastructure
- **icons** – 300+ SVG icons including Fediverse-specific ones

### Specialized Packages

- **faces/social** – Social media components (Status, Timeline, Profile, etc.) (vendored under `$lib/components/*`)
- **faces/blog** – Blog/publishing components (vendored under `$lib/components/*`)
- **faces/community** – Community/forum components (vendored under `$lib/components/*`)
- **faces/artist** – Visual artist portfolio components (vendored under `$lib/components/*`)
- **shared/agent** – Agent workflow contracts, package boundaries, and reusable lifecycle metadata
- **faces/agent** – Agent-first workflow shell and composition boundaries
- **content** – Rich content rendering components (Markdown, CodeBlock)
- **adapters** – Transport + Lesser GraphQL adapter + stores + mappers
- **utils** – Common utilities for web applications
- **testing** – Testing helpers and accessibility validators

### Integration Focus

Built for **Lesser-first** development with full ActivityPub/Fediverse support. While compatible with any ActivityPub server, Lesser integration unlocks advanced features like quote posts, community notes, AI moderation, trust graphs, and cost analytics.

## Quick Examples

### Styled Components (Quick Start)

```svelte
<script>
	import { Button, Modal } from '$lib/greater/primitives';
	import { SettingsIcon } from '$lib/greater/icons';

	let showSettings = false;
</script>

<Button variant="solid" onclick={() => (showSettings = true)}>
	{#snippet prefix()}<SettingsIcon />{/snippet}
	Settings
</Button>

<Modal bind:open={showSettings} title="Settings">
	<p>Configure your preferences...</p>
</Modal>
```

### Headless Components (Maximum Control)

```svelte
<script>
	import { createButton } from '$lib/greater/headless/button';

	const button = createButton({
		onClick: () => console.log('Clicked!'),
		loading: false,
	});
</script>

<button use:button.actions.button class="my-custom-styles">
	{#if button.state.loading}Loading...{:else}Click Me{/if}
</button>
```

### Fediverse with Lesser

```svelte
<script>
	import { LesserGraphQLAdapter } from '$lib/greater/adapters';
	import { Status } from '$lib/components/Status';

	const adapter = new LesserGraphQLAdapter({
		httpEndpoint: 'https://my-instance.social/graphql',
		token: 'my-auth-token',
	});
</script>

<Status.Root {status}>
	<Status.Header />
	<Status.Content />
	<Status.LesserMetadata showCost showTrust />
	<Status.CommunityNotes enableVoting />
	<Status.Actions />
</Status.Root>
```

## Technology Stack

- **Svelte 5** – Runes-based reactivity with `$state`, `$derived`, `$effect`
- **TypeScript** – Complete type safety across all packages
- **Vite** – Fast build tooling and HMR
- **Vitest** – Unit testing with 100% coverage target
- **Playwright** – E2E testing for complex interactions
- **pnpm** – Workspace management for monorepo
- **GraphQL Code Generator** – Typed queries for Lesser integration

## Contributing

When contributing to Greater Components:

- Follow conventions in this documentation guide
- Validate examples compile and run successfully
- Include CORRECT/INCORRECT blocks for usage patterns
- Update troubleshooting alongside code changes
- Run full test suite (`pnpm test`) before submitting
- Ensure accessibility with automated axe-core tests

See [Development Guidelines](./development-guidelines.md) for complete standards.

## Version and Compatibility

- **Current Version**: 4.0+ (following semantic versioning)
- **Svelte**: Requires 5.0+ (uses runes system)
- **TypeScript**: 5.0+ recommended
- **Node**: 20.0+ required
- **Browsers**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge)

## License

Greater Components is licensed under **AGPL-3.0-only**. This ensures that improvements benefit the entire Fediverse community and maintain open-source transparency.

## Getting Help

**For usage questions:**

- Check [Troubleshooting](./troubleshooting.md) first
- Review [Core Patterns](./core-patterns.md) for examples
- Search [GitHub Discussions](https://github.com/equaltoai/greater-components/discussions)

**For bugs:**

- Search existing issues first
- Provide minimal reproduction
- Include version numbers and environment details

**For security issues:**

- Email `security@equalto.ai` (do not use public tracker)

---

**Next Step**: Read [Getting Started](./getting-started.md) to install and create your first component.

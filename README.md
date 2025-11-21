# Greater Components

<div align="center">

**Modern UI components for building accessible Fediverse applications**

[![JSR](https://jsr.io/badges/@equaltoai/greater-components/primitives)](https://jsr.io/@equaltoai/greater-components/primitives)
[![npm version](https://img.shields.io/npm/v/@equaltoai/greater-components/primitives.svg)](https://www.npmjs.com/package/@equaltoai/greater-components/primitives)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-orange.svg)](https://svelte.dev/)
[![Coverage](https://img.shields.io/codecov/c/github/equaltoai/greater-components)](https://codecov.io/gh/equaltoai/greater-components)

[**Documentation**](./API_DOCUMENTATION.md) • [**Playground**](apps/playground/src/routes) • [**Getting Started**](#quick-start) • [**Examples**](./examples) • [**Contributing**](./CONTRIBUTING.md)

</div>

---

## ✨ What is Greater Components?

Greater Components is a comprehensive, production-ready UI component library designed specifically for building modern Fediverse applications. Built with **Svelte 5**, **TypeScript**, and **accessibility-first principles**, it provides everything you need to create engaging social media experiences that work for everyone.

**Architected for Lesser**: Greater Components is purpose-built for the [Lesser](https://github.com/lesserhq/lesser) ActivityPub server, with full support for advanced features like quote posts, community notes, AI-powered moderation, trust graphs, cost analytics, and real-time federation health monitoring. While compatible with other ActivityPub servers (Mastodon, Pleroma, etc.), Lesser integration unlocks the complete feature set.

### 🎯 Perfect for

- **Lesser-powered applications** with advanced moderation and analytics
- **Mastodon clients** and alternative interfaces
- **ActivityPub applications** and services
- **Fediverse tools** and analytics platforms
- **Social media dashboards** and moderation tools
- **Any modern web application** needing high-quality UI components

## 🚀 Quick Start

### Installation

#### Via npm (Recommended)

Greater Components is distributed as a single package containing all modules.

```bash
npm install @equaltoai/greater-components
```

#### Via pnpm

```bash
pnpm add @equaltoai/greater-components
```

#### Via JSR

```bash
npx jsr add @equaltoai/greater-components
```

### Basic Usage

#### Styled Components (Quick Start)

```svelte
<script>
	import { Button, Modal, ThemeProvider } from '@equaltoai/greater-components/primitives';
	import { HomeIcon, SettingsIcon } from '@equaltoai/greater-components/icons';

	let showModal = false;
</script>

<ThemeProvider>
	<main>
		<Button variant="solid" onclick={() => (showModal = true)}>
			{#snippet prefix()}<SettingsIcon />{/snippet}
			Open Settings
		</Button>

		<Modal bind:open={showModal} title="Settings" size="md">
			<p>Your settings panel content goes here.</p>

			{#snippet footer()}
				<Button variant="ghost" onclick={() => (showModal = false)}>Cancel</Button>
				<Button variant="solid">Save Changes</Button>
			{/snippet}
		</Modal>
	</main>
</ThemeProvider>
```

#### Headless Components (Maximum Control) 🆕

```svelte
<script>
	import { createButton } from '@equaltoai/greater-components/headless/button';
	import { SettingsIcon } from '@equaltoai/greater-components/icons';

	const button = createButton({
		onClick: () => console.log('Clicked!'),
		loading: false,
	});
</script>

<!-- Style however you want -->
<button use:button.actions.button class="your-custom-styles">
	<SettingsIcon />
	{#if button.state.loading}
		Loading...
	{:else}
		Open Settings
	{/if}
</button>

<style>
	.your-custom-styles {
		/* Complete styling freedom */
		padding: 1rem 2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-weight: 600;
		cursor: pointer;
	}
</style>
```

### Fediverse Example (Lesser-native)

```svelte
<script>
	import { LesserGraphQLAdapter } from '@equaltoai/greater-components/adapters';
	import { Status, Admin, Hashtags } from '@equaltoai/greater-components/fediverse';
	import { createLesserTimelineStore } from '@equaltoai/greater-components/fediverse';

	// Initialize Lesser adapter with GraphQL endpoint
	const adapter = new LesserGraphQLAdapter({
		endpoint: 'https://your-instance.social/graphql',
		token: 'your-auth-token',
	});

	// Create timeline with Lesser-specific features
	const timeline = createLesserTimelineStore({
		adapter,
		type: 'HASHTAG',
		hashtags: ['svelte', 'fediverse'],
		hashtagMode: 'ANY',
	});

	// Access Lesser-specific metadata
	const postsWithCost = timeline.getItemsWithCost();
	const postsWithTrust = timeline.getItemsWithTrustScore();
</script>

<!-- Display status with Lesser features -->
<Status.Root {status}>
	<Status.Header />
	<Status.Content />
	<Status.LesserMetadata showCost showTrust showModeration />
	<Status.CommunityNotes enableVoting />
	<Status.Actions onQuote={handleQuote} />
</Status.Root>

<!-- Admin dashboard with cost analytics -->
<Admin.Cost.Root {adapter}>
	<Admin.Cost.Dashboard period="WEEK" />
	<Admin.Cost.BudgetControls />
</Admin.Cost.Root>
```

## ✅ Phase 5 – Documentation & Testing

- **Demo suite docs**: `/demo-suite` plus `/demo-suite/{timeline,profile,settings,search}` now outline props, handlers, accessibility, and performance notes for every Phase 4 surface.
- **New primitives coverage**: `/components/tabs` and `/components/switch` pages document the runes-based API with live demos.
- **Testing upgrades**: Vitest specs for `apps/playground/src/lib/stores/storage.ts` and `packages/fediverse/src/lib/timelineStore.ts` + Playwright flows in `packages/testing/tests/demo/{timeline,profile,settings,search}.spec.ts`.
- **Performance tracking**: Lighthouse (Playground build) scored 98/100/100/100 with notes logged in `docs/planning/greater-alignment-log.md`.
- **Deployment runbook**: Follow `docs/deployment/demo-suite.md` for build/preview/publish commands, including the new Lighthouse + Playwright validation steps.

## 📦 Package Overview

### Core Packages

| Package                                                               | Description                                              | Version                                                                                                                                                     |
| --------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[@equaltoai/greater-components/headless](./packages/headless)**     | 🆕 Headless UI primitives - behavior without styling     | [![npm](https://img.shields.io/npm/v/@equaltoai/greater-components/headless.svg)](https://www.npmjs.com/package/@equaltoai/greater-components/headless)     |
| **[@equaltoai/greater-components/primitives](./packages/primitives)** | Essential UI components (Button, Modal, TextField, etc.) | [![npm](https://img.shields.io/npm/v/@equaltoai/greater-components/primitives.svg)](https://www.npmjs.com/package/@equaltoai/greater-components/primitives) |
| **[@equaltoai/greater-components/tokens](./packages/tokens)**         | Design system tokens and theming                         | [![npm](https://img.shields.io/npm/v/@equaltoai/greater-components/tokens.svg)](https://www.npmjs.com/package/@equaltoai/greater-components/tokens)         |
| **[@equaltoai/greater-components/icons](./packages/icons)**           | 300+ SVG icons including Fediverse-specific ones         | [![npm](https://img.shields.io/npm/v/@equaltoai/greater-components/icons.svg)](https://www.npmjs.com/package/@equaltoai/greater-components/icons)           |

### Specialized Packages

| Package                                                             | Description                                          | Version                                                                                                                                                   |
| ------------------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[@equaltoai/greater-components/fediverse](./packages/fediverse)** | Social media components (Timeline, StatusCard, etc.) | [![npm](https://img.shields.io/npm/v/@equaltoai/greater-components/fediverse.svg)](https://www.npmjs.com/package/@equaltoai/greater-components/fediverse) |
| **[@equaltoai/greater-components/utils](./packages/utils)**         | Utility functions for web applications               | [![npm](https://img.shields.io/npm/v/@equaltoai/greater-components/utils.svg)](https://www.npmjs.com/package/@equaltoai/greater-components/utils)         |
| **[@equaltoai/greater-components/adapters](./packages/adapters)**   | Protocol adapters for Fediverse servers              | [![npm](https://img.shields.io/npm/v/@equaltoai/greater-components/adapters.svg)](https://www.npmjs.com/package/@equaltoai/greater-components/adapters)   |
| **[@equaltoai/greater-components/testing](./packages/testing)**     | Testing utilities and accessibility helpers          | [![npm](https://img.shields.io/npm/v/@equaltoai/greater-components/testing.svg)](https://www.npmjs.com/package/@equaltoai/greater-components/testing)     |

## 🌟 Key Features

### 🎨 **Modern Design System**

- **Design Tokens**: Systematic approach to colors, typography, spacing
- **Multiple Themes**: Light, dark, and high-contrast modes included
- **CSS Custom Properties**: Easy theming without rebuilds
- **Responsive**: Mobile-first design with tablet and desktop breakpoints

### ♿ **Accessibility First**

- **WCAG 2.1 AA Compliant**: Meets international accessibility standards
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Optimized**: Proper ARIA labels and semantic markup
- **Focus Management**: Smart focus handling for modals and menus
- **Reduced Motion**: Respects user motion preferences

### ⚡ **Performance Optimized**

- **Zero Runtime**: Svelte 5 compiles to minimal JavaScript
- **Tree Shakeable**: Import only the components you use
- **Virtual Scrolling**: Handle thousands of items efficiently
- **Bundle Analysis**: Optimized for minimal application impact

### 🔧 **Developer Experience**

- **TypeScript First**: Complete type safety throughout
- **Comprehensive Docs**: JSDoc comments on all public APIs
- **Component Playground**: Interactive SvelteKit sandbox for rapid prototyping
- **Hot Reload**: Fast development with Vite
- **Automated Testing**: 100% test coverage

### 🌐 **Lesser-First Architecture**

- **ActivityPub Types**: Complete TypeScript definitions aligned with Lesser schema
- **GraphQL Integration**: Fully typed queries, mutations, and subscriptions via codegen
- **Real-time Streaming**: 21 subscription types (quotes, trust updates, cost alerts, moderation events, etc.)
- **Advanced Features**: Quote posts, community notes, AI analysis, trust graphs, cost dashboards
- **Multi-server Support**: Works with Lesser (primary), Mastodon, Pleroma, and other ActivityPub servers
- **Protocol Adapters**: Abstract away server differences with unified models

### 🚀 **Lesser-Exclusive Features**

- **Quote Posts**: Full quote creation, display, and permission controls
- **Community Notes**: Collaborative fact-checking with voting and moderation
- **AI Insights**: Automated content analysis (toxicity, sentiment, spam, NSFW detection)
- **Trust Graph**: Reputation scores, vouches, and relationship visualization
- **Cost Analytics**: Real-time cost tracking, budgets, and federation optimization
- **Thread Synchronization**: Fetch missing replies and resolve incomplete threads
- **Severed Relationships**: Monitor and recover from federation breaks
- **Hashtag Controls**: Follow hashtags with notification preferences and muting
- **Advanced Moderation**: AI-powered moderation queue with pattern matching

## 🎨 Theming & Customization

Greater Components includes a powerful theming system based on design tokens:

```css
/* Override design tokens */
:root {
	--gr-color-primary-600: #your-brand-color;
	--gr-typography-fontFamily-sans: 'Your Font', system-ui;
	--gr-radii-lg: 12px;
}

/* Component customization */
.gr-button--solid {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

**Built-in Themes:**

- 🌞 **Light Theme** - Clean, modern light interface
- 🌙 **Dark Theme** - Easy-on-the-eyes dark mode
- ⚡ **High Contrast** - WCAG AAA compliant high contrast

## 🛠️ Requirements

- **Node.js**: >= 20.0.0
- **TypeScript**: >= 5.0.0 (optional but recommended)
- **Svelte**: >= 5.0.0
- **Browser Support**: Modern evergreen browsers

## 🧪 Testing

Greater Components includes comprehensive testing utilities:

```javascript
import { render, fireEvent } from '@equaltoai/greater-components/testing';
import { Button } from '@equaltoai/greater-components/primitives';

test('button handles clicks', () => {
	const handleClick = vi.fn();
	const { getByRole } = render(Button, {
		props: { onclick: handleClick },
	});

	fireEvent.click(getByRole('button'));
	expect(handleClick).toHaveBeenCalled();
});
```

## 📚 Documentation & Resources

### 📖 **Documentation**

- [**Lesser Integration Guide**](./docs/lesser-integration-guide.md) - Complete Lesser setup and feature guide
- [**API Reference**](./API_DOCUMENTATION.md) - Complete API documentation
- [**API Stability Guide**](./API_STABILITY.md) - Backwards compatibility guarantees
- [**Component Documentation**](./docs/components/) - Individual component guides
- [**Migration Guide**](./docs/migration/) - Upgrade instructions
- [**Troubleshooting**](./docs/troubleshooting/) - Common issues and solutions

### 🎮 **Interactive Examples**

- [**Playground**](apps/playground/src/routes) - Live component playground
- [**Examples Repository**](./examples) - Real-world usage examples
- [**CodeSandbox Templates**](https://codesandbox.io) - Ready-to-fork templates

### 🤝 **Community**

- [**GitHub Discussions**](https://github.com/equaltoai/greater-components/discussions) - Questions and community support
- [**Issue Tracker**](https://github.com/equaltoai/greater-components/issues) - Bug reports and feature requests
- [**Contributing Guide**](./CONTRIBUTING.md) - How to contribute to the project

## 🔐 Security

Security is a top priority. All packages are:

- **Signed with npm provenance** for supply chain security
- **Regularly audited** for vulnerabilities
- **AGPL-3.0 licensed** for transparency

For security issues, email `security@equalto.ai` instead of using the public issue tracker.

## 🤝 Contributing

We welcome contributions! Whether you're:

- 🐛 **Reporting bugs** or suggesting features
- 📝 **Improving documentation** or examples
- 🔧 **Contributing code** or tests
- 🌍 **Translating** or internationalizing
- 🎨 **Designing** components or interfaces

Check out our [**Contributing Guide**](./CONTRIBUTING.md) to get started.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/equaltoai/greater-components.git
cd greater-components

# Install dependencies
pnpm install

# Start development mode
pnpm dev

# Run tests
pnpm test

# Build all packages
pnpm build
```

## 📄 License

Greater Components is licensed under the **AGPL-3.0-only** License - see the [LICENSE](LICENSE) file for details.

This ensures that improvements to the library benefit the entire community and Fediverse ecosystem.

## 🙏 Acknowledgments

### Built With

- 🔥 **[Svelte 5](https://svelte.dev)** - The magical disappearing framework
- 📘 **[TypeScript](https://www.typescriptlang.org/)** - JavaScript with types
- ⚡ **[Vite](https://vitejs.dev/)** - Next generation frontend tooling
- 🧪 **[Vitest](https://vitest.dev/)** - Blazing fast unit testing
- 📚 **Component playgrounds** - Use the built-in SvelteKit demos under `apps/playground`
- 🎭 **[Playwright](https://playwright.dev/)** - Reliable end-to-end testing

### Community

Special thanks to:

- The **Svelte team** for creating an amazing framework and the revolutionary runes system
- The **Fediverse community** for inspiration, feedback, and testing
- All **contributors** who have helped shape this library
- The **accessibility community** for guidance on inclusive design

---

<div align="center">

**Ready to build something great?**

[**Get Started**](#quick-start) • [**View Components**](https://greater-components.pages.dev) • [**Join Discussion**](https://github.com/equaltoai/greater-components/discussions)

**Made with ❤️ for the Fediverse community**

</div>

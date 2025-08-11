# Greater Components

<div align="center">

**Modern UI components for building accessible Fediverse applications**

[![npm version](https://img.shields.io/npm/v/@greater/primitives.svg)](https://www.npmjs.com/package/@greater/primitives)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-orange.svg)](https://svelte.dev/)
[![Coverage](https://img.shields.io/codecov/c/github/equaltoai/greater-components)](https://codecov.io/gh/equaltoai/greater-components)

[**Documentation**](./API_DOCUMENTATION.md) • [**Storybook**](https://greater-components.pages.dev) • [**Getting Started**](#quick-start) • [**Examples**](./examples) • [**Contributing**](./CONTRIBUTING.md)

</div>

---

## ✨ What is Greater Components?

Greater Components is a comprehensive, production-ready UI component library designed specifically for building modern Fediverse applications. Built with **Svelte 5**, **TypeScript**, and **accessibility-first principles**, it provides everything you need to create engaging social media experiences that work for everyone.

### 🎯 Perfect for

- **Mastodon clients** and alternative interfaces
- **ActivityPub applications** and services  
- **Fediverse tools** and analytics platforms
- **Social media dashboards** and moderation tools
- **Any modern web application** needing high-quality UI components

## 🚀 Quick Start

### Installation

```bash
# Core components (required)
npm install @greater/primitives @greater/tokens

# Icons (recommended)
npm install @greater/icons

# Fediverse-specific components (for social apps)
npm install @greater/fediverse

# Utilities (optional)
npm install @greater/utils
```

### Basic Usage

```svelte
<script>
  import { Button, Modal, ThemeProvider } from '@greater/primitives';
  import { HomeIcon, SettingsIcon } from '@greater/icons';
  
  let showModal = false;
</script>

<ThemeProvider>
  <main>
    <Button variant="solid" onclick={() => showModal = true}>
      {#snippet prefix()}<SettingsIcon />{/snippet}
      Open Settings
    </Button>
    
    <Modal bind:open={showModal} title="Settings" size="md">
      <p>Your settings panel content goes here.</p>
      
      {#snippet footer()}
        <Button variant="ghost" onclick={() => showModal = false}>
          Cancel
        </Button>
        <Button variant="solid">Save Changes</Button>
      {/snippet}
    </Modal>
  </main>
</ThemeProvider>
```

### Fediverse Example

```svelte
<script>
  import { StatusCard, TimelineVirtualized } from '@greater/fediverse';
  import { createTimelineStore } from '@greater/fediverse';
  
  const timeline = createTimelineStore({
    server: 'mastodon.social',
    timeline: 'public:local'
  });
</script>

<TimelineVirtualized 
  items={$timeline.items}
  onLoadMore={timeline.loadMore}
  onLike={timeline.like}
  onBoost={timeline.boost}
/>
```

## 📦 Package Overview

### Core Packages

| Package | Description | Version |
|---------|-------------|---------|
| **[@greater/primitives](./packages/primitives)** | Essential UI components (Button, Modal, TextField, etc.) | [![npm](https://img.shields.io/npm/v/@greater/primitives.svg)](https://www.npmjs.com/package/@greater/primitives) |
| **[@greater/tokens](./packages/tokens)** | Design system tokens and theming | [![npm](https://img.shields.io/npm/v/@greater/tokens.svg)](https://www.npmjs.com/package/@greater/tokens) |
| **[@greater/icons](./packages/icons)** | 300+ SVG icons including Fediverse-specific ones | [![npm](https://img.shields.io/npm/v/@greater/icons.svg)](https://www.npmjs.com/package/@greater/icons) |

### Specialized Packages

| Package | Description | Version |
|---------|-------------|---------|
| **[@greater/fediverse](./packages/fediverse)** | Social media components (Timeline, StatusCard, etc.) | [![npm](https://img.shields.io/npm/v/@greater/fediverse.svg)](https://www.npmjs.com/package/@greater/fediverse) |
| **[@greater/utils](./packages/utils)** | Utility functions for web applications | [![npm](https://img.shields.io/npm/v/@greater/utils.svg)](https://www.npmjs.com/package/@greater/utils) |
| **[@greater/adapters](./packages/adapters)** | Protocol adapters for Fediverse servers | [![npm](https://img.shields.io/npm/v/@greater/adapters.svg)](https://www.npmjs.com/package/@greater/adapters) |
| **[@greater/testing](./packages/testing)** | Testing utilities and accessibility helpers | [![npm](https://img.shields.io/npm/v/@greater/testing.svg)](https://www.npmjs.com/package/@greater/testing) |

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
- **Storybook Integration**: Interactive component playground
- **Hot Reload**: Fast development with Vite
- **Automated Testing**: 100% test coverage

### 🌐 **Fediverse Ready**
- **ActivityPub Types**: Complete TypeScript definitions
- **Real-time Streaming**: WebSocket and SSE support
- **Multi-server Support**: Works with Mastodon, Pleroma, and more
- **Protocol Adapters**: Abstract away server differences

## 🎨 Theming & Customization

Greater Components includes a powerful theming system based on design tokens:

```css
/* Override design tokens */
:root {
  --gr-color-primary-600: #your-brand-color;
  --gr-typography-fontFamily-sans: "Your Font", system-ui;
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
import { render, fireEvent } from '@greater/testing';
import { Button } from '@greater/primitives';

test('button handles clicks', () => {
  const handleClick = vi.fn();
  const { getByRole } = render(Button, {
    props: { onclick: handleClick }
  });
  
  fireEvent.click(getByRole('button'));
  expect(handleClick).toHaveBeenCalled();
});
```

## 📚 Documentation & Resources

### 📖 **Documentation**
- [**API Reference**](./API_DOCUMENTATION.md) - Complete API documentation
- [**API Stability Guide**](./API_STABILITY.md) - Backwards compatibility guarantees
- [**Migration Guide**](./docs/migration/) - Upgrade instructions
- [**Troubleshooting**](./docs/troubleshooting/) - Common issues and solutions

### 🎮 **Interactive Examples**
- [**Storybook**](https://greater-components.pages.dev) - Live component playground
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
- 📚 **[Storybook](https://storybook.js.org/)** - Tool for UI development
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
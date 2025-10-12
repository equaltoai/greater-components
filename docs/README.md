# Greater Components Documentation

**Version**: 1.0.0  
**Status**: Production Ready ✅

---

## 🎯 Overview

Greater Components is a comprehensive library of accessible, composable UI components for building Fediverse applications. Built with Svelte 5, TypeScript, and modern web standards.

### **Key Features**:
- ✅ **45+ Production-Ready Components**
- ✅ **Compound Component Architecture**
- ✅ **Full TypeScript Support**
- ✅ **Accessibility First (WCAG 2.1 AA)**
- ✅ **Real-time Updates (WebSocket, SSE)**
- ✅ **GraphQL & REST Support**
- ✅ **Comprehensive Testing (3,800+ tests)**
- ✅ **Tree-shakeable & Optimized**

---

## 📚 Documentation

### **Getting Started**
- [Quick Start Guide](./GETTING_STARTED.md) - Get up and running in 5 minutes
- [Installation](./GETTING_STARTED.md#installation) - Package installation
- [Basic Usage](./GETTING_STARTED.md#basic-usage) - Your first component
- [Migration Guide](./MIGRATION_GUIDE.md) - Upgrading from previous versions

### **Components** (45 components)
- [Auth Components](./components/Auth/) - Authentication & authorization (8 components)
- [Profile Components](./components/Profile/) - User profiles & settings (10 components)
- [Search Components](./components/Search/) - Search & discovery (6 components)
- [Lists Components](./components/Lists/) - List management (6 components)
- [Messages Components](./components/Messages/) - Direct messaging (8 components)
- [Admin Components](./components/Admin/) - Administration & moderation (9 components)
- [Filters Components](./components/Filters/) - Content filtering (4 components)
- [Compose Components](./components/Compose/) - Post composition (12+ components)

### **Integration Guides**
- [Lesser Integration](./integration/LESSER_INTEGRATION_GUIDE.md) - Connect to Lesser instances
- [Mastodon Integration](./integration/MASTODON_INTEGRATION_GUIDE.md) - Connect to Mastodon
- [Custom Adapter](./integration/CUSTOM_ADAPTER_GUIDE.md) - Build custom adapters

### **API Reference**
- [GraphQL API](./api/GRAPHQL_API.md) - GraphQL queries, mutations, subscriptions
- [Adapters API](./api/ADAPTERS_API.md) - Transport adapters & clients
- [Components API](./api/COMPONENTS_API.md) - Component props, events, slots
- [Utilities API](./api/UTILITIES_API.md) - Helper functions & utilities

### **Patterns & Examples**
- [Component Composition](./patterns/COMPOSITION_PATTERNS.md) - Best practices
- [Advanced Use Cases](./patterns/ADVANCED_USE_CASES.md) - Complex scenarios
- [Full App Example](./examples/full-app/) - Complete application
- [Quick Start Examples](./examples/quick-start/) - Simple examples

### **Testing**
- [Testing Guide](./testing/TESTING_GUIDE.md) - Test your components
- [Accessibility Testing](./testing/ACCESSIBILITY_TESTING.md) - A11y testing
- [E2E Testing](./testing/E2E_TESTING.md) - End-to-end tests

---

## 🚀 Quick Start

### **Installation**:
```bash
npm install @greater/fediverse @greater/adapters @greater/utils
```

### **Basic Usage**:
```svelte
<script lang="ts">
  import { Timeline } from '@greater/fediverse';
  import { createTimelineStore } from '@greater/adapters';

  const timeline = createTimelineStore({
    endpoint: 'https://api.lesser.social/graphql',
    timeline: 'home'
  });
</script>

<Timeline.Root store={timeline}>
  <Timeline.Feed />
</Timeline.Root>
```

### **Next Steps**:
1. Read the [Getting Started Guide](./GETTING_STARTED.md)
2. Explore [Component Documentation](./components/)
3. Try the [Examples](./examples/)
4. Check out [Integration Guides](./integration/)

---

## 📦 Packages

### **Core Packages**:
| Package | Description | Size |
|---------|-------------|------|
| `@greater/fediverse` | Main component library | ~800 KB |
| `@greater/adapters` | API adapters & transports | ~140 KB |
| `@greater/primitives` | Low-level UI primitives | ~80 KB |
| `@greater/headless` | Headless component logic | ~36 KB |
| `@greater/icons` | Icon components | ~2 KB per icon* |
| `@greater/utils` | Utility functions | ~12 KB |
| `@greater/testing` | Testing utilities | ~135 KB |

*With tree-shaking, only used icons are included

### **Development Packages**:
| Package | Description |
|---------|-------------|
| `@greater/tokens` | Design tokens |
| `@greater/cli` | CLI tools |

---

## 🏗️ Architecture

Greater Components follows a **compound component architecture**, providing flexibility while maintaining consistency:

```
Component.Root        → Context provider & container
  ├─ Component.Part1  → Composable sub-component
  ├─ Component.Part2  → Composable sub-component
  └─ Component.Part3  → Composable sub-component
```

### **Example**:
```svelte
<Auth.Root>
  <Auth.LoginForm onSuccess={handleLogin} />
  <Auth.RegisterForm onSuccess={handleRegister} />
</Auth.Root>
```

**Benefits**:
- ✅ Flexible composition
- ✅ Shared context
- ✅ Type-safe props
- ✅ Easy customization

---

## 🎨 Theming

Greater Components supports comprehensive theming through CSS custom properties:

```css
:root {
  --color-primary: #6366f1;
  --color-background: #ffffff;
  --color-text: #1f2937;
  --font-family: system-ui, sans-serif;
}
```

See [Theming Guide](./patterns/THEMING.md) for details.

---

## ♿ Accessibility

All components follow WCAG 2.1 Level AA standards:

- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ ARIA attributes
- ✅ Focus management
- ✅ Color contrast
- ✅ Responsive design

See [Accessibility Guide](./patterns/ACCESSIBILITY.md) for details.

---

## 🧪 Testing

Greater Components has comprehensive test coverage:

- **3,829 passing tests**
- **Unit tests**: All components & utilities
- **Integration tests**: Real-time features & performance
- **E2E tests**: Complete user flows
- **A11y tests**: Accessibility compliance

See [Testing Guide](./testing/TESTING_GUIDE.md) for details.

---

## 📊 Performance

Optimized for production:

- ✅ Tree-shakeable (ESM)
- ✅ Code splitting support
- ✅ Lazy loading
- ✅ Virtual scrolling
- ✅ Debounced/throttled interactions
- ✅ WebSocket connection pooling
- ✅ LRU caching

See [Performance Guide](./patterns/PERFORMANCE.md) for details.

---

## 🔄 Real-time Updates

Built-in support for real-time updates:

- ✅ WebSocket subscriptions
- ✅ Server-Sent Events (SSE)
- ✅ HTTP polling fallback
- ✅ Automatic reconnection
- ✅ Optimistic updates

See [Real-time Guide](./patterns/REALTIME.md) for details.

---

## 🤝 Contributing

We welcome contributions! See:
- [Contributing Guide](../CONTRIBUTING.md)
- [Architecture Overview](../ARCHITECTURE.md)
- [Development Setup](../DEVELOPMENT.md)

---

## 📄 License

AGPL-3.0-only - See [LICENSE](../LICENSE)

---

## 🔗 Links

- **GitHub**: https://github.com/equaltoai/greater-components
- **NPM**: https://www.npmjs.com/org/greater
- **JSR**: https://jsr.io/@greater
- **Issues**: https://github.com/equaltoai/greater-components/issues
- **Discussions**: https://github.com/equaltoai/greater-components/discussions

---

## 📧 Support

- **Documentation**: https://greater.equalto.ai/docs
- **Discord**: https://discord.gg/greater
- **Email**: support@equalto.ai

---

**Made with ❤️ by the Greater Components team**


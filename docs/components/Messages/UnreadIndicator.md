# Messages.UnreadIndicator

**Component**: Unread Message Badge / Indicator  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 54 passing tests

---

## 📋 Overview

`Messages.UnreadIndicator` displays the total number of unread messages across all conversations. It provides visual feedback to users about new messages with support for multiple display variants (badge, dot, number) and animations.

### **Key Features**:

- ✅ Display total unread count
- ✅ Multiple display variants (badge, dot, number, icon)
- ✅ Auto-hide when no unread messages
- ✅ Real-time updates via context
- ✅ Maximum count display (e.g., "99+")
- ✅ Click to navigate to messages
- ✅ Animated pulse effect
- ✅ Screen reader support (ARIA labels)
- ✅ Custom styling and theming
- ✅ Compact and expanded modes
- ✅ Position variants (absolute, inline)

### **What It Does**:

`Messages.UnreadIndicator` shows unread message status:

1. **Count Display**: Shows the total number of unread messages
2. **Visual Indicator**: Provides a badge, dot, or number display
3. **Real-time Updates**: Automatically updates when new messages arrive
4. **Navigation**: Optional click handler to navigate to messages
5. **Accessibility**: Provides screen reader announcements
6. **Smart Display**: Can show "99+" for large counts, or hide when zero

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

### **Minimal Setup**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';

	const handlers = {
		onFetchConversations: async () => {
			const response = await fetch('/api/messages/conversations');
			return await response.json();
		},
	};
</script>

<Messages.Root {handlers} autoFetch={true}>
	<Messages.UnreadIndicator />
</Messages.Root>
```

### **With Different Variants**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';

	const handlers = {
		onFetchConversations: async () => {
			const response = await fetch('/api/messages/conversations');
			return await response.json();
		},
	};
</script>

<Messages.Root {handlers} autoFetch={true}>
	<div class="indicator-variants">
		<!-- Badge variant (default) -->
		<Messages.UnreadIndicator variant="badge" />

		<!-- Dot variant (simple indicator) -->
		<Messages.UnreadIndicator variant="dot" />

		<!-- Number variant (just the count) -->
		<Messages.UnreadIndicator variant="number" />

		<!-- Icon with badge -->
		<Messages.UnreadIndicator variant="icon" />
	</div>
</Messages.Root>

<style>
	.indicator-variants {
		display: flex;
		gap: 2rem;
		padding: 2rem;
	}
</style>
```

### **With Navigation**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
	import { goto } from '$app/navigation';

	const handlers = {
		onFetchConversations: async () => {
			const response = await fetch('/api/messages/conversations');
			return await response.json();
		},
	};

	const handleClick = () => {
		goto('/messages');
	};
</script>

<Messages.Root {handlers} autoFetch={true}>
	<header class="app-header">
		<h1>My App</h1>

		<nav>
			<button onclick={handleClick}>
				<Messages.UnreadIndicator variant="icon" showZero={false} maxCount={99} />
				<span>Messages</span>
			</button>
		</nav>
	</header>
</Messages.Root>

<style>
	.app-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 2rem;
		border-bottom: 1px solid var(--border-color, #e1e8ed);
	}

	nav button {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border: none;
		background: transparent;
		cursor: pointer;
	}
</style>
```

### **With Custom Styling**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';

	const handlers = {
		onFetchConversations: async () => {
			const response = await fetch('/api/messages/conversations');
			return await response.json();
		},
	};
</script>

<Messages.Root {handlers} autoFetch={true}>
	<Messages.UnreadIndicator variant="badge" class="custom-indicator" />
</Messages.Root>

<style>
	:global(.custom-indicator) {
		--indicator-bg: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
		--indicator-text-color: white;
		--indicator-border-radius: 1rem;
		--indicator-font-size: 0.75rem;
		--indicator-padding: 0.25rem 0.5rem;
	}

	:global(.custom-indicator .unread-badge) {
		background: var(--indicator-bg);
		color: var(--indicator-text-color);
		border-radius: var(--indicator-border-radius);
		font-size: var(--indicator-font-size);
		padding: var(--indicator-padding);
		box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
	}
</style>
```

---

## 🎛️ Props

| Prop       | Type                                     | Default     | Required | Description                                       |
| ---------- | ---------------------------------------- | ----------- | -------- | ------------------------------------------------- |
| `variant`  | `'badge' \| 'dot' \| 'number' \| 'icon'` | `'badge'`   | No       | Display style for indicator                       |
| `showZero` | `boolean`                                | `false`     | No       | Show indicator when count is 0                    |
| `maxCount` | `number`                                 | `99`        | No       | Maximum count to display (shows "99+" for higher) |
| `animate`  | `boolean`                                | `true`      | No       | Enable pulse animation for new messages           |
| `position` | `'absolute' \| 'inline'`                 | `'inline'`  | No       | Positioning mode                                  |
| `onClick`  | `() => void`                             | `undefined` | No       | Click handler (makes it clickable)                |
| `class`    | `string`                                 | `''`        | No       | Custom CSS class for the container                |

---

## 📤 Events

### **onClick**

Called when the indicator is clicked:

```typescript
const handleClick = () => {
	console.log('Unread indicator clicked');
	// Navigate to messages page
	window.location.href = '/messages';
};
```

---

## 💡 Examples

### **Example 1: Badge in Navigation Bar**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
	import { authStore } from '$lib/stores/auth';

	const handlers = {
		onFetchConversations: async () => {
			const response = await fetch('/api/messages/conversations', {
				headers: {
					Authorization: `Bearer ${$authStore.token}`,
				},
			});
			return await response.json();
		},
	};
</script>

<Messages.Root {handlers} autoFetch={true}>
	<nav class="navbar">
		<div class="nav-brand">
			<img src="/logo.svg" alt="Logo" />
			<span>MyApp</span>
		</div>

		<ul class="nav-menu">
			<li>
				<a href="/">Home</a>
			</li>
			<li>
				<a href="/explore">Explore</a>
			</li>
			<li>
				<a href="/notifications">
					Notifications
					<!-- Placeholder for notifications badge -->
				</a>
			</li>
			<li>
				<a href="/messages">
					Messages
					<Messages.UnreadIndicator
						variant="badge"
						showZero={false}
						maxCount={99}
						position="absolute"
					/>
				</a>
			</li>
		</ul>

		<div class="nav-profile">
			<img src={$authStore.avatar} alt="Profile" />
		</div>
	</nav>
</Messages.Root>

<style>
	.navbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 2rem;
		background: var(--background, #ffffff);
		border-bottom: 1px solid var(--border-color, #e1e8ed);
	}

	.nav-brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.nav-brand img {
		width: 2rem;
		height: 2rem;
	}

	.nav-brand span {
		font-size: 1.25rem;
		font-weight: 700;
	}

	.nav-menu {
		display: flex;
		gap: 2rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.nav-menu li {
		position: relative;
	}

	.nav-menu a {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		text-decoration: none;
		color: var(--text-primary, #14171a);
		font-weight: 500;
		border-radius: 2rem;
		transition: background 0.2s ease;
	}

	.nav-menu a:hover {
		background: var(--background-hover, #f7f9fa);
	}

	.nav-profile img {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		object-fit: cover;
		cursor: pointer;
	}
</style>
```

### **Example 2: Dot Indicator on Icon**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
	import { authStore } from '$lib/stores/auth';

	const handlers = {
		onFetchConversations: async () => {
			const response = await fetch('/api/messages/conversations', {
				headers: {
					Authorization: `Bearer ${$authStore.token}`,
				},
			});
			return await response.json();
		},
	};

	const goToMessages = () => {
		window.location.href = '/messages';
	};
</script>

<Messages.Root {handlers} autoFetch={true}>
	<div class="icon-with-indicator">
		<button class="icon-button" onclick={goToMessages} aria-label="View messages">
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"
				/>
			</svg>

			<Messages.UnreadIndicator variant="dot" showZero={false} position="absolute" animate={true} />
		</button>
	</div>
</Messages.Root>

<style>
	.icon-with-indicator {
		position: relative;
	}

	.icon-button {
		position: relative;
		width: 3rem;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: var(--background-secondary, #f7f9fa);
		color: var(--text-primary, #14171a);
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.icon-button:hover {
		background: var(--background-hover, #e8ecef);
		transform: scale(1.05);
	}

	.icon-button svg {
		width: 1.5rem;
		height: 1.5rem;
	}
</style>
```

### **Example 3: Number Display in Sidebar**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
	import { authStore } from '$lib/stores/auth';

	const handlers = {
		onFetchConversations: async () => {
			const response = await fetch('/api/messages/conversations', {
				headers: {
					Authorization: `Bearer ${$authStore.token}`,
				},
			});
			return await response.json();
		},
	};
</script>

<Messages.Root {handlers} autoFetch={true}>
	<aside class="sidebar">
		<nav class="sidebar-nav">
			<a href="/" class="nav-item">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
				</svg>
				<span>Home</span>
			</a>

			<a href="/explore" class="nav-item">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
					/>
				</svg>
				<span>Explore</span>
			</a>

			<a href="/messages" class="nav-item">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
				</svg>
				<span>Messages</span>
				<Messages.UnreadIndicator
					variant="number"
					showZero={false}
					maxCount={999}
					class="sidebar-indicator"
				/>
			</a>

			<a href="/profile" class="nav-item">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
					/>
				</svg>
				<span>Profile</span>
			</a>
		</nav>
	</aside>
</Messages.Root>

<style>
	.sidebar {
		width: 250px;
		height: 100vh;
		border-right: 1px solid var(--border-color, #e1e8ed);
		background: var(--background, #ffffff);
	}

	.sidebar-nav {
		display: flex;
		flex-direction: column;
		padding: 1rem 0;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.5rem;
		text-decoration: none;
		color: var(--text-primary, #14171a);
		font-weight: 500;
		transition: background 0.2s ease;
	}

	.nav-item:hover {
		background: var(--background-hover, #f7f9fa);
	}

	.nav-item svg {
		width: 1.5rem;
		height: 1.5rem;
		flex-shrink: 0;
	}

	.nav-item span {
		flex: 1;
	}

	:global(.sidebar-indicator) {
		margin-left: auto;
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--primary, #1da1f2);
	}
</style>
```

### **Example 4: Icon with Animated Badge**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
	import { onMount, onDestroy } from 'svelte';
	import { createWebSocketClient } from '$lib/websocket';
	import { authStore } from '$lib/stores/auth';

	let ws: ReturnType<typeof createWebSocketClient> | null = null;
	let hasNewMessages = $state(false);

	onMount(() => {
		// Initialize WebSocket for real-time updates
		ws = createWebSocketClient('wss://api.example.com/graphql');

		ws.subscribe({
			query: `
        subscription OnNewMessage($userId: ID!) {
          messageReceived(userId: $userId) {
            id
            conversationId
          }
        }
      `,
			variables: { userId: $authStore.userId },
			onData: () => {
				hasNewMessages = true;

				// Reset after 3 seconds
				setTimeout(() => {
					hasNewMessages = false;
				}, 3000);
			},
		});
	});

	onDestroy(() => {
		ws?.close();
	});

	const handlers = {
		onFetchConversations: async () => {
			const response = await fetch('/api/messages/conversations', {
				headers: {
					Authorization: `Bearer ${$authStore.token}`,
				},
			});
			return await response.json();
		},
	};
</script>

<Messages.Root {handlers} autoFetch={true}>
	<div class="animated-indicator">
		<button class="messages-button" class:has-new={hasNewMessages}>
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"
				/>
			</svg>

			<Messages.UnreadIndicator
				variant="badge"
				showZero={false}
				animate={true}
				position="absolute"
				class="pulsing-badge"
			/>
		</button>
	</div>
</Messages.Root>

<style>
	.animated-indicator {
		position: relative;
	}

	.messages-button {
		position: relative;
		width: 3.5rem;
		height: 3.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid var(--border-color, #e1e8ed);
		background: var(--background, #ffffff);
		color: var(--text-primary, #14171a);
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.messages-button:hover {
		border-color: var(--primary, #1da1f2);
		color: var(--primary, #1da1f2);
		transform: scale(1.05);
	}

	.messages-button.has-new {
		animation: shake 0.5s ease-in-out;
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-4px);
		}
		75% {
			transform: translateX(4px);
		}
	}

	.messages-button svg {
		width: 1.75rem;
		height: 1.75rem;
	}

	:global(.pulsing-badge) {
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.1);
			opacity: 0.8;
		}
	}
</style>
```

### **Example 5: Floating Action Button with Badge**

```svelte
<script lang="ts">
	import * as Messages from '@equaltoai/greater-components-fediverse/Messages';
	import { authStore } from '$lib/stores/auth';

	let showMessaging = $state(false);

	const handlers = {
		onFetchConversations: async () => {
			const response = await fetch('/api/messages/conversations', {
				headers: {
					Authorization: `Bearer ${$authStore.token}`,
				},
			});
			return await response.json();
		},
	};
</script>

<Messages.Root {handlers} autoFetch={true}>
	<button
		class="fab"
		onclick={() => {
			showMessaging = true;
		}}
		aria-label="Open messages"
	>
		<svg viewBox="0 0 24 24" fill="currentColor">
			<path
				d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"
			/>
		</svg>

		<Messages.UnreadIndicator
			variant="badge"
			showZero={false}
			position="absolute"
			class="fab-indicator"
		/>
	</button>

	{#if showMessaging}
		<div class="messaging-modal">
			<button
				class="close-button"
				onclick={() => {
					showMessaging = false;
				}}
				aria-label="Close messages"
			>
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
					/>
				</svg>
			</button>

			<Messages.Conversations currentUserId={$authStore.userId} />
			<Messages.Thread />
			<Messages.Composer />
		</div>
	{/if}
</Messages.Root>

<style>
	.fab {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		width: 4rem;
		height: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--primary, #1da1f2);
		color: white;
		border: none;
		border-radius: 50%;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
		cursor: pointer;
		transition: all 0.3s ease;
		z-index: 1000;
	}

	.fab:hover {
		transform: scale(1.1);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
	}

	.fab svg {
		width: 2rem;
		height: 2rem;
	}

	:global(.fab-indicator) {
		position: absolute;
		top: -0.25rem;
		right: -0.25rem;
	}

	.messaging-modal {
		position: fixed;
		bottom: 8rem;
		right: 2rem;
		width: 400px;
		height: 600px;
		background: var(--background, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 1rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
		z-index: 1001;
		overflow: hidden;
	}

	.close-button {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: transparent;
		color: var(--text-secondary, #657786);
		cursor: pointer;
		border-radius: 50%;
		transition: all 0.2s ease;
		z-index: 10;
	}

	.close-button:hover {
		background: var(--background-hover, #f7f9fa);
		color: var(--text-primary, #14171a);
	}

	.close-button svg {
		width: 1.25rem;
		height: 1.25rem;
	}
</style>
```

---

## 🔒 Security Considerations

### **Data Privacy**

Don't leak message content in the indicator:

```typescript
// Good: Just show count
<Messages.UnreadIndicator variant="badge" />

// Bad: Don't show message preview in indicator
// (Could leak sensitive information)
```

---

## ♿ Accessibility

### **ARIA Labels**

```svelte
<div
	class="unread-indicator"
	role="status"
	aria-live="polite"
	aria-label="{unreadCount} unread messages"
>
	{unreadCount}
</div>
```

### **Screen Reader Announcements**

```svelte
<script>
	let previousCount = 0;

	$effect(() => {
		if (unreadCount > previousCount) {
			announceToScreenReader(
				`${unreadCount - previousCount} new message${unreadCount - previousCount > 1 ? 's' : ''}`
			);
		}
		previousCount = unreadCount;
	});

	function announceToScreenReader(message: string) {
		const announcement = document.createElement('div');
		announcement.setAttribute('role', 'status');
		announcement.setAttribute('aria-live', 'polite');
		announcement.className = 'sr-only';
		announcement.textContent = message;
		document.body.appendChild(announcement);

		setTimeout(() => {
			document.body.removeChild(announcement);
		}, 1000);
	}
</script>
```

---

## 🎨 Styling

### **CSS Custom Properties**

```css
.unread-indicator {
	/* Badge variant */
	--indicator-bg: #f4211e;
	--indicator-text-color: #ffffff;
	--indicator-font-size: 0.75rem;
	--indicator-padding: 0.25rem 0.5rem;
	--indicator-border-radius: 1rem;

	/* Dot variant */
	--indicator-dot-size: 0.5rem;
	--indicator-dot-color: #f4211e;

	/* Position */
	--indicator-top: -0.5rem;
	--indicator-right: -0.5rem;

	/* Animation */
	--indicator-animation-duration: 2s;
}
```

### **Theme Example**

```svelte
<style>
	/* Dark mode */
	:global(.dark-mode .unread-indicator) {
		--indicator-bg: #ff4757;
		--indicator-text-color: #ffffff;
	}

	/* Success theme */
	:global(.success-theme .unread-indicator) {
		--indicator-bg: #00ba7c;
	}

	/* Minimal theme */
	:global(.minimal-theme .unread-indicator) {
		--indicator-bg: transparent;
		--indicator-text-color: var(--text-primary);
		--indicator-border: 2px solid currentColor;
	}
</style>
```

---

## ⚡ Performance

### **Memoization**

Avoid unnecessary re-renders:

```svelte
<script>
	const formattedCount = $derived(() => {
		if (unreadCount === 0) return '0';
		if (unreadCount > maxCount) return `${maxCount}+`;
		return unreadCount.toString();
	});
</script>

<div class="indicator">{formattedCount}</div>
```

---

## 🧪 Testing

### **Component Test**

```typescript
import { render } from '@testing-library/svelte';
import { UnreadIndicator } from '@equaltoai/greater-components-fediverse/Messages';

test('displays unread count', () => {
	const { getByText } = render(UnreadIndicator, {
		props: {
			// Mock context with unread count
		},
	});

	expect(getByText('5')).toBeInTheDocument();
});

test('hides when count is 0 and showZero is false', () => {
	const { container } = render(UnreadIndicator, {
		props: {
			showZero: false,
			// Mock context with 0 unread
		},
	});

	expect(container.firstChild).toBeNull();
});

test('shows 99+ for counts over 99', () => {
	const { getByText } = render(UnreadIndicator, {
		props: {
			maxCount: 99,
			// Mock context with 150 unread
		},
	});

	expect(getByText('99+')).toBeInTheDocument();
});
```

### **Accessibility Test**

```typescript
import { render } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { UnreadIndicator } from '@equaltoai/greater-components-fediverse/Messages';

test('has no accessibility violations', async () => {
	const { container } = render(UnreadIndicator);

	const results = await axe(container);
	expect(results).toHaveNoViolations();
});
```

---

## 🔗 Related Components

- [Messages.Root](/docs/components/Messages/Root.md) - Context provider
- [Messages.Conversations](/docs/components/Messages/Conversations.md) - Conversations list

---

## 📚 See Also

- [Messages Component Group Overview](/docs/components/Messages/README.md)
- [Notification Patterns Guide](/docs/guides/notifications.md)
- [Accessibility Best Practices](/docs/guides/accessibility.md)

---

**Last Updated**: 2025-10-12  
**Version**: 1.0.0

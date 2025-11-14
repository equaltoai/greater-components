# Compose.AutocompleteMenu

**Component**: Autocomplete Dropdown Menu  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅

---

## 📋 Overview

`Compose.AutocompleteMenu` is the dropdown component that displays suggestion

s for hashtags, mentions, and emojis. It's automatically used by [`Compose.EditorWithAutocomplete`](./EditorWithAutocomplete.md) but can also be used standalone for custom autocomplete implementations.

### **Key Features**:

- ✅ Keyboard navigation (↑↓ arrows, Enter, Esc)
- ✅ Mouse/touch selection
- ✅ Scrollable suggestion list
- ✅ Rich suggestion display (avatars, metadata)
- ✅ Loading states
- ✅ Empty states
- ✅ Auto-positioning relative to cursor
- ✅ Click-outside to close
- ✅ Accessible with ARIA attributes
- ✅ Smooth animations

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

**Note**: This component is typically used automatically by `EditorWithAutocomplete`. For standalone usage:

```svelte
<script lang="ts">
	import { AutocompleteMenu } from '@equaltoai/greater-components-fediverse/Compose';

	let suggestions = [
		{
			type: 'mention',
			text: '@alice',
			value: 'alice@example.com',
			metadata: {
				username: 'alice',
				displayName: 'Alice Smith',
				avatar: 'https://example.com/avatar.jpg',
				followers: 1234,
			},
		},
	];

	let selectedIndex = 0;
	let position = { x: 100, y: 200 };

	function handleSelect(suggestion) {
		console.log('Selected:', suggestion);
	}

	function handleClose() {
		console.log('Menu closed');
	}
</script>

<AutocompleteMenu
	{suggestions}
	{selectedIndex}
	{position}
	onSelect={handleSelect}
	onClose={handleClose}
/>
```

---

## 🎛️ Props

| Prop            | Type                       | Default | Required | Description                          |
| --------------- | -------------------------- | ------- | -------- | ------------------------------------ |
| `suggestions`   | `AutocompleteSuggestion[]` | -       | **Yes**  | Array of suggestions to display      |
| `selectedIndex` | `number`                   | `0`     | **Yes**  | Currently selected suggestion index  |
| `position`      | `Position`                 | -       | **Yes**  | Menu position (x, y coordinates)     |
| `loading`       | `boolean`                  | `false` | No       | Show loading indicator               |
| `onSelect`      | `Function`                 | -       | **Yes**  | Callback when suggestion is selected |
| `onClose`       | `Function`                 | -       | **Yes**  | Callback when menu should close      |
| `class`         | `string`                   | `''`    | No       | Additional CSS class                 |

### **Types**:

```typescript
interface AutocompleteSuggestion {
	type: 'hashtag' | 'mention' | 'emoji';
	text: string;
	value: string;
	metadata?: {
		username?: string;
		displayName?: string;
		avatar?: string;
		followers?: number;
	};
}

interface Position {
	x: number; // Pixels from left
	y: number; // Pixels from top
}
```

---

## 📤 Events

```typescript
// Selection event
onSelect: (suggestion: AutocompleteSuggestion) => void;

// Close event (Esc key, click outside)
onClose: () => void;
```

---

## 💡 Examples

### **Example 1: Mention Suggestions with Avatars**

Display user mentions with profile pictures:

```svelte
<script lang="ts">
	import { AutocompleteMenu } from '@equaltoai/greater-components-fediverse/Compose';

	let showMenu = $state(false);
	let mentions = $state([
		{
			type: 'mention' as const,
			text: '@alice',
			value: 'alice@example.com',
			metadata: {
				username: 'alice',
				displayName: 'Alice Smith',
				avatar: 'https://example.com/avatars/alice.jpg',
				followers: 1234,
			},
		},
		{
			type: 'mention' as const,
			text: '@bob',
			value: 'bob@example.com',
			metadata: {
				username: 'bob',
				displayName: 'Bob Johnson',
				avatar: 'https://example.com/avatars/bob.jpg',
				followers: 567,
			},
		},
	]);

	let selectedIndex = $state(0);
	let menuPosition = $state({ x: 100, y: 200 });

	function handleSelect(suggestion) {
		console.log('Mentioning:', suggestion.metadata?.displayName);
		showMenu = false;
	}

	function handleClose() {
		showMenu = false;
	}
</script>

<button onclick={() => (showMenu = true)}> Show Mentions </button>

{#if showMenu}
	<AutocompleteMenu
		suggestions={mentions}
		{selectedIndex}
		position={menuPosition}
		onSelect={handleSelect}
		onClose={handleClose}
	/>
{/if}
```

### **Example 2: Hashtag Suggestions**

Show trending hashtags:

```svelte
<script lang="ts">
	import { AutocompleteMenu } from '@equaltoai/greater-components-fediverse/Compose';

	let hashtags = $state([
		{ type: 'hashtag' as const, text: '#svelte', value: 'svelte' },
		{ type: 'hashtag' as const, text: '#javascript', value: 'javascript' },
		{ type: 'hashtag' as const, text: '#webdev', value: 'webdev' },
	]);

	let selectedIndex = $state(0);
	let position = $state({ x: 150, y: 250 });

	function handleSelect(suggestion) {
		console.log('Using hashtag:', suggestion.value);
	}
</script>

<AutocompleteMenu
	suggestions={hashtags}
	{selectedIndex}
	{position}
	onSelect={handleSelect}
	onClose={() => {}}
/>
```

### **Example 3: Loading State**

Show loading indicator while fetching suggestions:

```svelte
<script lang="ts">
	import { AutocompleteMenu } from '@equaltoai/greater-components-fediverse/Compose';

	let suggestions = $state([]);
	let loading = $state(true);
	let selectedIndex = $state(0);

	// Simulate async loading
	onMount(async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		suggestions = [
			{ type: 'mention', text: '@alice', value: 'alice' },
			{ type: 'mention', text: '@bob', value: 'bob' },
		];

		loading = false;
	});
</script>

<AutocompleteMenu
	{suggestions}
	{selectedIndex}
	{loading}
	position={{ x: 100, y: 200 }}
	onSelect={(s) => console.log('Selected:', s)}
	onClose={() => {}}
/>
```

### **Example 4: Empty State**

Handle no results gracefully:

```svelte
<script lang="ts">
	import { AutocompleteMenu } from '@equaltoai/greater-components-fediverse/Compose';

	let query = $state('');
	let suggestions = $state([]);

	async function search(q: string) {
		const response = await fetch(`/api/search?q=${q}`);
		const data = await response.json();
		suggestions = data.results || [];
	}

	$effect(() => {
		if (query) {
			search(query);
		}
	});
</script>

<input type="text" bind:value={query} placeholder="Search users..." />

{#if query}
	<AutocompleteMenu
		{suggestions}
		selectedIndex={0}
		position={{ x: 0, y: 40 }}
		onSelect={(s) => console.log('Selected:', s)}
		onClose={() => (query = '')}
	/>
{/if}
```

### **Example 5: Custom Position Calculation**

Position menu relative to cursor in textarea:

```svelte
<script lang="ts">
	import { AutocompleteMenu } from '@equaltoai/greater-components-fediverse/Compose';

	let textareaEl: HTMLTextAreaElement;
	let showMenu = $state(false);
	let menuPosition = $state({ x: 0, y: 0 });

	function calculateMenuPosition(textarea: HTMLTextAreaElement, cursorPos: number) {
		const rect = textarea.getBoundingClientRect();

		// Get caret coordinates (simplified)
		const coords = getCaretCoordinates(textarea, cursorPos);

		return {
			x: rect.left + coords.left,
			y: rect.top + coords.top + coords.height + window.scrollY,
		};
	}

	function getCaretCoordinates(element: HTMLTextAreaElement, position: number) {
		// Implementation would calculate actual caret position
		// This is simplified
		return { left: 10, top: 20, height: 20 };
	}

	function handleInput(e: Event) {
		const textarea = e.target as HTMLTextAreaElement;
		const value = textarea.value;

		// Check if @ is typed
		if (value.endsWith('@')) {
			const cursorPos = textarea.selectionStart || 0;
			menuPosition = calculateMenuPosition(textarea, cursorPos);
			showMenu = true;
		}
	}
</script>

<textarea bind:this={textareaEl} oninput={handleInput} placeholder="Type @ to mention someone"
></textarea>

{#if showMenu}
	<AutocompleteMenu
		suggestions={[
			/* ... */
		]}
		selectedIndex={0}
		position={menuPosition}
		onSelect={() => (showMenu = false)}
		onClose={() => (showMenu = false)}
	/>
{/if}
```

### **Example 6: Keyboard Navigation Demo**

Interactive demo of keyboard navigation:

```svelte
<script lang="ts">
	import { AutocompleteMenu } from '@equaltoai/greater-components-fediverse/Compose';

	let suggestions = [
		{ type: 'mention', text: '@alice', value: 'alice' },
		{ type: 'mention', text: '@bob', value: 'bob' },
		{ type: 'mention', text: '@charlie', value: 'charlie' },
		{ type: 'mention', text: '@diana', value: 'diana' },
	];

	let selectedIndex = $state(0);
	let lastAction = $state('');

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
			lastAction = '↓ Moved down';
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, 0);
			lastAction = '↑ Moved up';
		} else if (event.key === 'Enter') {
			event.preventDefault();
			lastAction = `✓ Selected ${suggestions[selectedIndex].text}`;
		} else if (event.key === 'Escape') {
			event.preventDefault();
			lastAction = '✕ Closed menu';
		}
	}
</script>

<div class="demo">
	<h3>Keyboard Navigation Demo</h3>
	<p>Use arrow keys to navigate, Enter to select, Esc to close</p>

	<div class="demo-area" onkeydown={handleKeyDown} tabindex="0">
		<AutocompleteMenu
			{suggestions}
			{selectedIndex}
			position={{ x: 20, y: 80 }}
			onSelect={(s) => (lastAction = `Selected: ${s.text}`)}
			onClose={() => (lastAction = 'Closed')}
		/>
	</div>

	<div class="last-action">
		Last action: <strong>{lastAction || 'None'}</strong>
	</div>
</div>

<style>
	.demo {
		position: relative;
		padding: 2rem;
		background: #f7f9fa;
		border-radius: 12px;
	}

	.demo h3 {
		margin: 0 0 0.5rem;
	}

	.demo p {
		margin: 0 0 1.5rem;
		color: #536471;
		font-size: 0.875rem;
	}

	.demo-area {
		position: relative;
		min-height: 300px;
		background: white;
		border: 2px solid #e1e8ed;
		border-radius: 8px;
		outline: none;
	}

	.demo-area:focus {
		border-color: #1d9bf0;
	}

	.last-action {
		margin-top: 1rem;
		padding: 0.75rem;
		background: white;
		border-radius: 8px;
		font-size: 0.875rem;
	}
</style>
```

---

## 🎨 Styling

`Compose.AutocompleteMenu` supports customization via CSS custom properties:

```css
.autocomplete-menu {
	/* Container */
	--autocomplete-bg: white;
	--autocomplete-border: #cfd9de;
	--autocomplete-radius: 8px;
	--autocomplete-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

	/* Items */
	--autocomplete-hover-bg: #f7f9fa;
	--text-primary: #0f1419;
	--text-secondary: #536471;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
	.autocomplete-menu {
		--autocomplete-bg: #15202b;
		--autocomplete-border: #38444d;
		--autocomplete-hover-bg: #1c2938;
		--text-primary: #ffffff;
		--text-secondary: #8899a6;
	}
}
```

### **Custom Styles**

```css
/* Larger menu */
:global(.large-autocomplete) {
	max-width: 500px;
	max-height: 400px;
	font-size: 1.0625rem;
}

/* Compact menu */
:global(.compact-autocomplete .autocomplete-menu__item) {
	padding: 0.5rem 0.75rem;
}

/* Custom hover color */
:global(.custom-autocomplete .autocomplete-menu__item:hover) {
	background: #e8f5fd;
	color: #1d9bf0;
}

/* Hide avatars */
:global(.no-avatars .autocomplete-menu__avatar) {
	display: none;
}
```

---

## ♿ Accessibility

`Compose.AutocompleteMenu` follows WCAG 2.1 AA standards:

### **ARIA Attributes**

```html
<div class="autocomplete-menu" role="listbox" aria-label="Autocomplete suggestions">
	<button class="autocomplete-menu__item" role="option" aria-selected="true|false" data-index="0">
		<!-- Content -->
	</button>
</div>
```

### **Keyboard Support**

- ✅ `↑` moves to previous suggestion
- ✅ `↓` moves to next suggestion
- ✅ `Enter` selects current suggestion
- ✅ `Esc` closes the menu
- ✅ Mouse click selects suggestion

### **Screen Reader Support**

- Menu announced as "Autocomplete suggestions, listbox"
- Selected option announced
- Number of options announced
- Selection changes announced

### **Visual Accessibility**

- High contrast for all states (4.5:1 minimum)
- Clear selection indicator
- Focus visible on interactive elements
- Text readable at all sizes

### **Focus Management**

- Focus remains on textarea
- Selected item scrolls into view
- Selection tracked with `aria-activedescendant`

---

## 🔒 Security Considerations

### **XSS Prevention**

Always escape user-generated content in suggestions:

```typescript
import DOMPurify from 'dompurify';

function sanitizeSuggestion(suggestion: any) {
	return {
		...suggestion,
		text: DOMPurify.sanitize(suggestion.text),
		metadata: suggestion.metadata
			? {
					...suggestion.metadata,
					displayName: DOMPurify.sanitize(suggestion.metadata.displayName),
					username: DOMPurify.sanitize(suggestion.metadata.username),
				}
			: undefined,
	};
}
```

### **Avatar URLs**

Validate and sanitize avatar URLs:

```typescript
function isValidImageUrl(url: string): boolean {
	try {
		const parsed = new URL(url);
		return parsed.protocol === 'https:' || parsed.protocol === 'http:';
	} catch {
		return false;
	}
}

function sanitizeAvatarUrl(url: string): string {
	if (!isValidImageUrl(url)) {
		return '/default-avatar.png';
	}
	return url;
}
```

### **Click Hijacking**

The menu handles click-outside properly to prevent unintended actions:

```typescript
function handleClickOutside(event: MouseEvent) {
	if (menuEl && !menuEl.contains(event.target as Node)) {
		onClose();
	}
}
```

---

## 🧪 Testing

```typescript
import { render, screen, fireEvent, within } from '@testing-library/svelte';
import { AutocompleteMenu } from '@equaltoai/greater-components-fediverse/Compose';

describe('AutocompleteMenu', () => {
	const mockSuggestions = [
		{ type: 'mention', text: '@alice', value: 'alice' },
		{ type: 'mention', text: '@bob', value: 'bob' },
	];

	it('renders suggestions', () => {
		render(AutocompleteMenu, {
			props: {
				suggestions: mockSuggestions,
				selectedIndex: 0,
				position: { x: 0, y: 0 },
				onSelect: () => {},
				onClose: () => {},
			},
		});

		expect(screen.getByRole('listbox')).toBeInTheDocument();
		expect(screen.getByText('@alice')).toBeInTheDocument();
		expect(screen.getByText('@bob')).toBeInTheDocument();
	});

	it('highlights selected suggestion', () => {
		render(AutocompleteMenu, {
			props: {
				suggestions: mockSuggestions,
				selectedIndex: 1,
				position: { x: 0, y: 0 },
				onSelect: () => {},
				onClose: () => {},
			},
		});

		const items = screen.getAllByRole('option');
		expect(items[1]).toHaveClass('autocomplete-menu__item--selected');
	});

	it('calls onSelect when suggestion is clicked', async () => {
		const handleSelect = vi.fn();

		render(AutocompleteMenu, {
			props: {
				suggestions: mockSuggestions,
				selectedIndex: 0,
				position: { x: 0, y: 0 },
				onSelect: handleSelect,
				onClose: () => {},
			},
		});

		const firstItem = screen.getByText('@alice');
		await fireEvent.click(firstItem);

		expect(handleSelect).toHaveBeenCalledWith(mockSuggestions[0]);
	});

	it('shows loading state', () => {
		render(AutocompleteMenu, {
			props: {
				suggestions: [],
				selectedIndex: 0,
				position: { x: 0, y: 0 },
				loading: true,
				onSelect: () => {},
				onClose: () => {},
			},
		});

		expect(screen.getByText(/loading/i)).toBeInTheDocument();
	});

	it('shows empty state', () => {
		render(AutocompleteMenu, {
			props: {
				suggestions: [],
				selectedIndex: 0,
				position: { x: 0, y: 0 },
				loading: false,
				onSelect: () => {},
				onClose: () => {},
			},
		});

		expect(screen.getByText(/no suggestions/i)).toBeInTheDocument();
	});

	it('positions menu correctly', () => {
		const { container } = render(AutocompleteMenu, {
			props: {
				suggestions: mockSuggestions,
				selectedIndex: 0,
				position: { x: 100, y: 200 },
				onSelect: () => {},
				onClose: () => {},
			},
		});

		const menu = container.querySelector('.autocomplete-menu') as HTMLElement;
		expect(menu.style.left).toBe('100px');
		expect(menu.style.top).toBe('200px');
	});

	it('closes on Escape key', async () => {
		const handleClose = vi.fn();

		render(AutocompleteMenu, {
			props: {
				suggestions: mockSuggestions,
				selectedIndex: 0,
				position: { x: 0, y: 0 },
				onSelect: () => {},
				onClose: handleClose,
			},
		});

		await fireEvent.keyDown(document, { key: 'Escape' });

		expect(handleClose).toHaveBeenCalled();
	});

	it('renders mention metadata', () => {
		const mentionWithMetadata = [
			{
				type: 'mention',
				text: '@alice',
				value: 'alice',
				metadata: {
					displayName: 'Alice Smith',
					avatar: 'https://example.com/avatar.jpg',
					followers: 1234,
				},
			},
		];

		render(AutocompleteMenu, {
			props: {
				suggestions: mentionWithMetadata,
				selectedIndex: 0,
				position: { x: 0, y: 0 },
				onSelect: () => {},
				onClose: () => {},
			},
		});

		expect(screen.getByText('Alice Smith')).toBeInTheDocument();
		expect(screen.getByText(/1,234 followers/i)).toBeInTheDocument();
	});
});
```

---

## 🔗 Related Components

- [Compose.EditorWithAutocomplete](./EditorWithAutocomplete.md) - Uses this menu
- [Autocomplete Utility](./Autocomplete.md) - Autocomplete logic
- [Compose.Root](./Root.md) - Context provider

---

## 📚 See Also

- [Compose Component Group README](./README.md)
- [EditorWithAutocomplete Documentation](./EditorWithAutocomplete.md)
- [Autocomplete Utility Documentation](./Autocomplete.md)
- [ARIA Listbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)

---

## ❓ FAQ

### **Q: Can I customize the menu appearance per suggestion type?**

Yes! Use CSS to target different types:

```css
:global(.autocomplete-menu__item[data-type='mention']) {
	/* Mention-specific styles */
}

:global(.autocomplete-menu__item[data-type='hashtag']) {
	/* Hashtag-specific styles */
}
```

### **Q: How do I limit the menu height?**

The menu has `max-height: 300px` by default. Customize with CSS:

```css
:global(.autocomplete-menu) {
	max-height: 400px;
}
```

### **Q: Can I display suggestions in a grid instead of a list?**

Yes, but you'd need to create a custom menu component using the same logic as this one.

### **Q: How do I prevent the menu from going off-screen?**

Implement boundary detection in your position calculation:

```typescript
function adjustPosition(position: Position, menuHeight: number, menuWidth: number) {
	const adjusted = { ...position };

	// Check bottom boundary
	if (position.y + menuHeight > window.innerHeight) {
		adjusted.y = window.innerHeight - menuHeight - 10;
	}

	// Check right boundary
	if (position.x + menuWidth > window.innerWidth) {
		adjusted.x = window.innerWidth - menuWidth - 10;
	}

	return adjusted;
}
```

### **Q: Can I show different metadata for different suggestion types?**

Yes! The component already handles this. For mentions it shows avatar and followers, for hashtags it shows the # symbol, for emojis it shows the emoji character.

---

**Need help?** Check the [Troubleshooting Guide](../../troubleshooting/README.md) or open an issue on [GitHub](https://github.com/lesserphp/greater-components).

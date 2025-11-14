# Compose.EditorWithAutocomplete

**Component**: Enhanced Text Editor with Autocomplete  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅

---

## 📋 Overview

`Compose.EditorWithAutocomplete` is an enhanced text editor that provides intelligent autocomplete suggestions for hashtags (#), mentions (@), and emojis (:). It combines the functionality of the basic [`Compose.Editor`](./Editor.md) with real-time suggestion matching, keyboard navigation, and fuzzy search capabilities.

### **Key Features**:

- ✅ **Hashtag autocomplete** with # trigger (trending tags, recent tags)
- ✅ **Mention autocomplete** with @ trigger (user search with avatars)
- ✅ **Emoji autocomplete** with : trigger (fuzzy matching)
- ✅ **Keyboard navigation** (↑↓ to navigate, Enter to select, Esc to close)
- ✅ **Cursor position detection** for context-aware suggestions
- ✅ **Fuzzy matching** with scoring algorithm
- ✅ **Unicode-aware character counting**
- ✅ **URL weighting** (URLs count as ~23 chars)
- ✅ **Auto-resize textarea**
- ✅ **Accessible autocomplete menu**
- ✅ **Async suggestion loading**

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
	import { Compose } from '@equaltoai/greater-components-fediverse';

	async function searchSuggestions(query, type) {
		if (type === 'mention') {
			const response = await fetch(`/api/search/accounts?q=${query}`);
			const accounts = await response.json();
			return accounts.map((account) => ({
				type: 'mention',
				text: `@${account.username}`,
				value: account.acct,
				metadata: {
					username: account.username,
					displayName: account.display_name,
					avatar: account.avatar,
					followers: account.followers_count,
				},
			}));
		}

		if (type === 'hashtag') {
			const response = await fetch(`/api/search/hashtags?q=${query}`);
			const hashtags = await response.json();
			return hashtags.map((tag) => ({
				type: 'hashtag',
				text: `#${tag.name}`,
				value: tag.name,
			}));
		}

		return [];
	}

	async function handleSubmit(data) {
		await fetch('/api/statuses', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
	}
</script>

<Compose.Root handlers={{ onSubmit: handleSubmit }}>
	<Compose.EditorWithAutocomplete searchHandler={searchSuggestions} autofocus />
	<Compose.CharacterCount />
	<Compose.Submit />
</Compose.Root>
```

---

## 🎛️ Props

| Prop            | Type            | Default | Required | Description                         |
| --------------- | --------------- | ------- | -------- | ----------------------------------- |
| `rows`          | `number`        | `4`     | No       | Minimum number of textarea rows     |
| `autofocus`     | `boolean`       | `false` | No       | Automatically focus on mount        |
| `searchHandler` | `SearchHandler` | -       | **Yes**  | Async function to fetch suggestions |
| `class`         | `string`        | `''`    | No       | Additional CSS class                |

### **SearchHandler Type**:

```typescript
type SearchHandler = (
	query: string,
	type: 'hashtag' | 'mention' | 'emoji'
) => Promise<AutocompleteSuggestion[]>;

interface AutocompleteSuggestion {
	/** Suggestion type */
	type: 'hashtag' | 'mention' | 'emoji';

	/** Display text shown in menu */
	text: string;

	/** Value to insert into editor */
	value: string;

	/** Additional metadata for mentions */
	metadata?: {
		username?: string;
		displayName?: string;
		avatar?: string;
		followers?: number;
	};
}
```

---

## 🎯 Autocomplete Triggers

### **Hashtag Autocomplete (#)**

```typescript
// Triggered when typing # followed by text
"Check out #svel" → Shows hashtag suggestions
// Matches: #svelte, #sveltekit, #sveltejs
```

### **Mention Autocomplete (@)**

```typescript
// Triggered when typing @ followed by text
"Thanks @ric" → Shows user suggestions
// Matches: @rich, @richard, @ricardo
```

### **Emoji Autocomplete (:)**

```typescript
// Triggered when typing : followed by text
"Hello :wave" → Shows emoji suggestions
// Matches: :wave:, :waving:, :wave_hand:
```

---

## ⌨️ Keyboard Navigation

| Key              | Action                        |
| ---------------- | ----------------------------- |
| `#`, `@`, `:`    | Trigger autocomplete          |
| `↓` (Down Arrow) | Move to next suggestion       |
| `↑` (Up Arrow)   | Move to previous suggestion   |
| `Enter`          | Select highlighted suggestion |
| `Tab`            | Select highlighted suggestion |
| `Esc`            | Close autocomplete menu       |
| `Cmd/Ctrl+Enter` | Submit post                   |

---

## 💡 Examples

### **Example 1: Basic Autocomplete with API Integration**

Complete implementation with real API calls:

```svelte
<script lang="ts">
	import { Compose } from '@equaltoai/greater-components-fediverse';

	interface Account {
		username: string;
		acct: string;
		display_name: string;
		avatar: string;
		followers_count: number;
	}

	interface Hashtag {
		name: string;
		url: string;
		history?: { uses: string }[];
	}

	async function searchHandler(query: string, type: 'hashtag' | 'mention' | 'emoji') {
		try {
			if (type === 'mention') {
				const response = await fetch(
					`/api/v2/search?q=${encodeURIComponent(query)}&type=accounts&limit=10`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);
				const data = await response.json();

				return data.accounts.map((account: Account) => ({
					type: 'mention' as const,
					text: `@${account.username}`,
					value: account.acct,
					metadata: {
						username: account.username,
						displayName: account.display_name,
						avatar: account.avatar,
						followers: account.followers_count,
					},
				}));
			}

			if (type === 'hashtag') {
				const response = await fetch(
					`/api/v2/search?q=${encodeURIComponent(query)}&type=hashtags&limit=10`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);
				const data = await response.json();

				return data.hashtags.map((tag: Hashtag) => ({
					type: 'hashtag' as const,
					text: `#${tag.name}`,
					value: tag.name,
				}));
			}

			if (type === 'emoji') {
				// Local emoji data (no API needed)
				const emojis = await getEmojiList();
				return emojis
					.filter((emoji) => emoji.name.includes(query.toLowerCase()))
					.slice(0, 10)
					.map((emoji) => ({
						type: 'emoji' as const,
						text: `:${emoji.name}:`,
						value: emoji.unicode,
					}));
			}

			return [];
		} catch (error) {
			console.error('Autocomplete search failed:', error);
			return [];
		}
	}

	async function handleSubmit(data) {
		await createStatus(data);
	}
</script>

<div class="autocomplete-composer">
	<h2>Create Post</h2>

	<Compose.Root handlers={{ onSubmit: handleSubmit }}>
		<Compose.EditorWithAutocomplete {searchHandler} autofocus rows={4} />

		<div class="composer-footer">
			<Compose.CharacterCount />
			<Compose.VisibilitySelect />
			<Compose.Submit />
		</div>
	</Compose.Root>

	<div class="help-text">
		<p>💡 <strong>Tip:</strong> Type # for hashtags, @ for mentions, : for emojis</p>
	</div>
</div>

<style>
	.autocomplete-composer {
		max-width: 600px;
		margin: 2rem auto;
		padding: 1.5rem;
		background: white;
		border: 1px solid #e1e8ed;
		border-radius: 12px;
	}

	.autocomplete-composer h2 {
		margin: 0 0 1rem;
	}

	.composer-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		margin-top: 1rem;
	}

	.help-text {
		margin-top: 1rem;
		padding: 0.75rem 1rem;
		background: #f7f9fa;
		border-radius: 8px;
		font-size: 0.875rem;
		color: #536471;
	}

	.help-text p {
		margin: 0;
	}
</style>
```

### **Example 2: Cached Autocomplete Results**

Improve performance by caching recent suggestions:

```svelte
<script lang="ts">
	import { Compose } from '@equaltoai/greater-components-fediverse';

	// Cache for autocomplete results
	const suggestionCache = new Map<
		string,
		{
			data: any[];
			timestamp: number;
		}
	>();

	const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

	async function cachedSearchHandler(query: string, type: string) {
		const cacheKey = `${type}:${query}`;
		const cached = suggestionCache.get(cacheKey);

		// Return cached if still valid
		if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
			return cached.data;
		}

		// Fetch new data
		const results = await fetchSuggestions(query, type);

		// Cache the results
		suggestionCache.set(cacheKey, {
			data: results,
			timestamp: Date.now(),
		});

		return results;
	}

	async function fetchSuggestions(query: string, type: string) {
		const response = await fetch(`/api/search?q=${query}&type=${type}`);
		return response.json();
	}

	async function handleSubmit(data) {
		await api.createPost(data);
	}
</script>

<Compose.Root handlers={{ onSubmit: handleSubmit }}>
	<Compose.EditorWithAutocomplete searchHandler={cachedSearchHandler} autofocus />
	<Compose.Submit />
</Compose.Root>
```

### **Example 3: Custom Emoji Support**

Add custom instance-specific emojis:

```svelte
<script lang="ts">
	import { Compose } from '@equaltoai/greater-components-fediverse';

	interface CustomEmoji {
		shortcode: string;
		url: string;
		static_url: string;
		visible_in_picker: boolean;
	}

	let customEmojis: CustomEmoji[] = $state([]);

	onMount(async () => {
		// Load custom emojis from instance
		const response = await fetch('/api/v1/custom_emojis');
		customEmojis = await response.json();
	});

	async function searchHandler(query: string, type: string) {
		if (type === 'emoji') {
			// Standard emojis
			const standardEmojis = getStandardEmojis(query);

			// Custom emojis
			const customMatches = customEmojis
				.filter(
					(emoji) =>
						emoji.visible_in_picker && emoji.shortcode.toLowerCase().includes(query.toLowerCase())
				)
				.map((emoji) => ({
					type: 'emoji' as const,
					text: `:${emoji.shortcode}:`,
					value: `:${emoji.shortcode}:`,
					metadata: {
						url: emoji.url,
						isCustom: true,
					},
				}));

			// Combine and return
			return [...customMatches, ...standardEmojis].slice(0, 10);
		}

		// Handle mentions and hashtags
		return fetchOtherSuggestions(query, type);
	}

	function getStandardEmojis(query: string) {
		const common = [
			{ name: 'smile', unicode: '😊' },
			{ name: 'heart', unicode: '❤️' },
			{ name: 'fire', unicode: '🔥' },
			{ name: 'wave', unicode: '👋' },
			{ name: 'tada', unicode: '🎉' },
		];

		return common
			.filter((emoji) => emoji.name.includes(query.toLowerCase()))
			.map((emoji) => ({
				type: 'emoji' as const,
				text: `:${emoji.name}:`,
				value: emoji.unicode,
			}));
	}
</script>

<Compose.Root handlers={{ onSubmit: handleSubmit }}>
	<Compose.EditorWithAutocomplete {searchHandler} autofocus />
	<Compose.Submit />
</Compose.Root>
```

### **Example 4: Mention Prioritization**

Prioritize frequently mentioned users:

```svelte
<script lang="ts">
	import { Compose } from '@equaltoai/greater-components-fediverse';

	// Track mention frequency
	const mentionFrequency = new Map<string, number>();

	async function searchHandler(query: string, type: string) {
		if (type === 'mention') {
			const response = await fetch(`/api/search/accounts?q=${query}`);
			const accounts = await response.json();

			// Convert to suggestions
			const suggestions = accounts.map((account) => ({
				type: 'mention' as const,
				text: `@${account.username}`,
				value: account.acct,
				metadata: {
					username: account.username,
					displayName: account.display_name,
					avatar: account.avatar,
					followers: account.followers_count,
				},
			}));

			// Sort by frequency, then by followers
			return suggestions.sort((a, b) => {
				const freqA = mentionFrequency.get(a.value) || 0;
				const freqB = mentionFrequency.get(b.value) || 0;

				if (freqA !== freqB) {
					return freqB - freqA; // Higher frequency first
				}

				// Fallback to follower count
				return (b.metadata?.followers || 0) - (a.metadata?.followers || 0);
			});
		}

		return fetchOtherSuggestions(query, type);
	}

	async function handleSubmit(data) {
		// Track mentioned users
		const mentions = extractMentions(data.content);
		mentions.forEach((mention) => {
			const current = mentionFrequency.get(mention) || 0;
			mentionFrequency.set(mention, current + 1);
		});

		// Save to localStorage
		localStorage.setItem(
			'mention-frequency',
			JSON.stringify(Array.from(mentionFrequency.entries()))
		);

		await api.createPost(data);
	}

	function extractMentions(content: string): string[] {
		const matches = content.match(/@[\w]+(@[\w.-]+)?/g) || [];
		return matches.map((m) => m.slice(1)); // Remove @
	}

	onMount(() => {
		// Load mention frequency from localStorage
		const saved = localStorage.getItem('mention-frequency');
		if (saved) {
			const entries = JSON.parse(saved);
			entries.forEach(([key, value]) => {
				mentionFrequency.set(key, value);
			});
		}
	});
</script>

<Compose.Root handlers={{ onSubmit: handleSubmit }}>
	<Compose.EditorWithAutocomplete {searchHandler} autofocus />
	<Compose.Submit />
</Compose.Root>
```

### **Example 5: Trending Hashtags**

Show trending hashtags with usage statistics:

```svelte
<script lang="ts">
	import { Compose } from '@equaltoai/greater-components-fediverse';

	interface TrendingTag {
		name: string;
		url: string;
		history: { day: string; uses: string; accounts: string }[];
	}

	let trendingTags: TrendingTag[] = $state([]);

	onMount(async () => {
		// Fetch trending hashtags
		const response = await fetch('/api/v1/trends/tags?limit=20');
		trendingTags = await response.json();
	});

	async function searchHandler(query: string, type: string) {
		if (type === 'hashtag') {
			if (!query || query.length < 1) {
				// Show trending tags when no query
				return trendingTags.slice(0, 10).map((tag) => ({
					type: 'hashtag' as const,
					text: `#${tag.name}`,
					value: tag.name,
					metadata: {
						uses: tag.history[0]?.uses || '0',
						trending: true,
					},
				}));
			}

			// Search for hashtags
			const response = await fetch(`/api/search?q=${query}&type=hashtags`);
			const results = await response.json();

			return results.map((tag) => ({
				type: 'hashtag' as const,
				text: `#${tag.name}`,
				value: tag.name,
			}));
		}

		return fetchOtherSuggestions(query, type);
	}

	async function handleSubmit(data) {
		await api.createPost(data);
	}
</script>

<Compose.Root handlers={{ onSubmit: handleSubmit }}>
	<Compose.EditorWithAutocomplete {searchHandler} autofocus />

	{#if trendingTags.length > 0}
		<div class="trending-tags">
			<h4>🔥 Trending Now</h4>
			<div class="tag-cloud">
				{#each trendingTags.slice(0, 8) as tag}
					<button class="tag-chip" onclick={() => insertHashtag(tag.name)}>
						#{tag.name}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<Compose.Submit />
</Compose.Root>

<style>
	.trending-tags {
		margin: 1rem 0;
		padding: 1rem;
		background: #f7f9fa;
		border-radius: 8px;
	}

	.trending-tags h4 {
		margin: 0 0 0.75rem;
		font-size: 0.875rem;
		color: #536471;
	}

	.tag-cloud {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tag-chip {
		padding: 0.375rem 0.75rem;
		background: white;
		border: 1px solid #e1e8ed;
		border-radius: 9999px;
		font-size: 0.875rem;
		color: #1d9bf0;
		cursor: pointer;
		transition: all 0.2s;
	}

	.tag-chip:hover {
		background: #e8f5fd;
		border-color: #1d9bf0;
	}
</style>
```

### **Example 6: Debugging Autocomplete**

Add visual debugging for autocomplete behavior:

```svelte
<script lang="ts">
	import { Compose } from '@equaltoai/greater-components-fediverse';

	let debugInfo = $state({
		lastQuery: '',
		lastType: '',
		suggestionCount: 0,
		searchTime: 0,
		cursorPosition: 0,
	});

	async function debugSearchHandler(query: string, type: string) {
		const startTime = performance.now();

		debugInfo.lastQuery = query;
		debugInfo.lastType = type;

		const results = await searchSuggestions(query, type);

		debugInfo.suggestionCount = results.length;
		debugInfo.searchTime = Math.round(performance.now() - startTime);

		return results;
	}

	async function searchSuggestions(query: string, type: string) {
		// Your search implementation
		const response = await fetch(`/api/search?q=${query}&type=${type}`);
		return response.json();
	}
</script>

<div class="debug-composer">
	<Compose.Root handlers={{ onSubmit: handleSubmit }}>
		<Compose.EditorWithAutocomplete searchHandler={debugSearchHandler} autofocus />

		<div class="debug-panel">
			<h4>🔍 Autocomplete Debug</h4>
			<dl>
				<dt>Last Query:</dt>
				<dd>{debugInfo.lastQuery || '(none)'}</dd>

				<dt>Type:</dt>
				<dd>{debugInfo.lastType || '(none)'}</dd>

				<dt>Results:</dt>
				<dd>{debugInfo.suggestionCount}</dd>

				<dt>Search Time:</dt>
				<dd>{debugInfo.searchTime}ms</dd>

				<dt>Cursor Position:</dt>
				<dd>{debugInfo.cursorPosition}</dd>
			</dl>
		</div>

		<Compose.Submit />
	</Compose.Root>
</div>

<style>
	.debug-composer {
		max-width: 700px;
		margin: 2rem auto;
	}

	.debug-panel {
		margin: 1rem 0;
		padding: 1rem;
		background: #f7f9fa;
		border: 1px solid #e1e8ed;
		border-radius: 8px;
		font-family: monospace;
		font-size: 0.875rem;
	}

	.debug-panel h4 {
		margin: 0 0 0.75rem;
		font-family: sans-serif;
	}

	.debug-panel dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.5rem;
		margin: 0;
	}

	.debug-panel dt {
		font-weight: 600;
		color: #536471;
	}

	.debug-panel dd {
		margin: 0;
		color: #0f1419;
	}
</style>
```

---

## 🎨 Styling

The editor uses the same styling as [`Compose.Editor`](./Editor.md), plus autocomplete menu styles:

```css
/* Editor (same as Compose.Editor) */
.compose-editor {
	--compose-editor-bg: white;
	--compose-font-family: inherit;
	--compose-font-size: 1rem;
	--compose-text-primary: #0f1419;
	--compose-border: #cfd9de;
	--compose-focus-color: #1d9bf0;
}

/* Autocomplete menu (see AutocompleteMenu.md) */
.autocomplete-menu {
	--autocomplete-bg: white;
	--autocomplete-border: #cfd9de;
	--autocomplete-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	--autocomplete-hover-bg: #f7f9fa;
}
```

---

## ♿ Accessibility

`Compose.EditorWithAutocomplete` follows WCAG 2.1 AA standards:

### **ARIA Attributes**

```html
<textarea
	aria-label="Compose post content"
	aria-describedby="compose-character-count"
	aria-controls="autocomplete-menu"
	aria-expanded="true|false"
	aria-activedescendant="suggestion-0"
></textarea>
```

### **Keyboard Support**

- All standard text editing shortcuts
- `↑` `↓` navigate autocomplete
- `Enter` or `Tab` select suggestion
- `Esc` closes autocomplete
- `Cmd/Ctrl+Enter` submits post

### **Screen Reader Support**

- Autocomplete state announced
- Number of suggestions announced
- Selected suggestion announced
- Insertion confirmed

---

## 🔒 Security Considerations

### **XSS Prevention in Suggestions**

Always sanitize suggestion data from untrusted sources:

```typescript
function sanitizeSuggestion(suggestion: any): AutocompleteSuggestion {
	return {
		type: suggestion.type,
		text: escapeHtml(suggestion.text),
		value: escapeHtml(suggestion.value),
		metadata: suggestion.metadata
			? {
					username: escapeHtml(suggestion.metadata.username),
					displayName: escapeHtml(suggestion.metadata.displayName),
					avatar: sanitizeUrl(suggestion.metadata.avatar),
					followers: parseInt(suggestion.metadata.followers) || 0,
				}
			: undefined,
	};
}
```

### **Rate Limiting Search Requests**

Implement debouncing to prevent API abuse:

```typescript
import { debounce } from 'lodash-es';

const debouncedSearch = debounce(async (query, type) => {
	return await fetch(`/api/search?q=${query}&type=${type}`);
}, 300);
```

### **Input Validation**

Validate mention and hashtag formats:

```typescript
function isValidMention(mention: string): boolean {
	return /^@?[a-zA-Z0-9_]+(@[a-zA-Z0-9.-]+)?$/.test(mention);
}

function isValidHashtag(tag: string): boolean {
	return /^#?[a-zA-Z0-9_]+$/.test(tag) && tag.length <= 100;
}
```

---

## 🧪 Testing

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { Compose } from '@equaltoai/greater-components-fediverse';
import { vi } from 'vitest';

describe('Compose.EditorWithAutocomplete', () => {
	const mockSearchHandler = vi.fn();

	beforeEach(() => {
		mockSearchHandler.mockClear();
	});

	it('triggers autocomplete on # symbol', async () => {
		mockSearchHandler.mockResolvedValue([{ type: 'hashtag', text: '#svelte', value: 'svelte' }]);

		render(Compose.Root, {
			props: {
				searchHandler: mockSearchHandler,
			},
		});

		const editor = screen.getByRole('textbox');
		await fireEvent.input(editor, { target: { value: '#sv' } });

		await waitFor(() => {
			expect(mockSearchHandler).toHaveBeenCalledWith('sv', 'hashtag');
		});
	});

	it('shows autocomplete menu with suggestions', async () => {
		mockSearchHandler.mockResolvedValue([
			{ type: 'mention', text: '@alice', value: 'alice@example.com' },
		]);

		render(Compose.Root, {
			props: {
				searchHandler: mockSearchHandler,
			},
		});

		const editor = screen.getByRole('textbox');
		await fireEvent.input(editor, { target: { value: '@ali' } });

		await waitFor(() => {
			expect(screen.getByRole('listbox')).toBeInTheDocument();
			expect(screen.getByText('@alice')).toBeInTheDocument();
		});
	});

	it('inserts suggestion on Enter key', async () => {
		mockSearchHandler.mockResolvedValue([{ type: 'mention', text: '@alice', value: 'alice' }]);

		render(Compose.Root, {
			props: {
				searchHandler: mockSearchHandler,
			},
		});

		const editor = screen.getByRole('textbox') as HTMLTextAreaElement;

		await fireEvent.input(editor, { target: { value: '@ali' } });
		await waitFor(() => screen.getByRole('listbox'));

		await fireEvent.keyDown(editor, { key: 'Enter' });

		await waitFor(() => {
			expect(editor.value).toContain('@alice');
		});
	});

	it('navigates suggestions with arrow keys', async () => {
		mockSearchHandler.mockResolvedValue([
			{ type: 'mention', text: '@alice', value: 'alice' },
			{ type: 'mention', text: '@bob', value: 'bob' },
		]);

		render(Compose.Root, {
			props: {
				searchHandler: mockSearchHandler,
			},
		});

		const editor = screen.getByRole('textbox');
		await fireEvent.input(editor, { target: { value: '@a' } });
		await waitFor(() => screen.getByRole('listbox'));

		// Navigate down
		await fireEvent.keyDown(editor, { key: 'ArrowDown' });

		// Second item should be selected
		const options = screen.getAllByRole('option');
		expect(options[1]).toHaveClass('autocomplete-menu__item--selected');
	});

	it('closes autocomplete on Escape', async () => {
		mockSearchHandler.mockResolvedValue([{ type: 'hashtag', text: '#test', value: 'test' }]);

		render(Compose.Root, {
			props: {
				searchHandler: mockSearchHandler,
			},
		});

		const editor = screen.getByRole('textbox');
		await fireEvent.input(editor, { target: { value: '#test' } });
		await waitFor(() => screen.getByRole('listbox'));

		await fireEvent.keyDown(editor, { key: 'Escape' });

		await waitFor(() => {
			expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
		});
	});
});
```

---

## 🔗 Related Components

- [Compose.Root](./Root.md) - Context provider (required parent)
- [Compose.Editor](./Editor.md) - Basic editor without autocomplete
- [Compose.AutocompleteMenu](./AutocompleteMenu.md) - Autocomplete dropdown
- [Autocomplete Utility](./Autocomplete.md) - Autocomplete logic

---

## 📚 See Also

- [Compose Component Group README](./README.md)
- [Autocomplete Utility Documentation](./Autocomplete.md)
- [AutocompleteMenu Component](./AutocompleteMenu.md)
- [Getting Started Guide](../../GETTING_STARTED.md)

---

## ❓ FAQ

### **Q: How do I add custom trigger characters?**

Currently, only `#`, `@`, and `:` are supported. To add custom triggers, you'd need to modify the autocomplete detection logic.

### **Q: Can I disable specific autocomplete types?**

Yes! Return empty array for types you want to disable:

```typescript
async function searchHandler(query, type) {
	if (type === 'emoji') {
		return []; // Disable emoji autocomplete
	}
	// Handle other types...
}
```

### **Q: How do I customize the autocomplete menu appearance?**

See [AutocompleteMenu documentation](./AutocompleteMenu.md) for styling options.

### **Q: What's the difference between `text` and `value` in suggestions?**

- **`text`**: What's shown in the autocomplete menu (e.g., "@alice")
- **`value`**: What's inserted into the editor (e.g., "alice@example.com")

### **Q: How do I implement fuzzy matching?**

The component includes basic fuzzy matching. For advanced fuzzy search, use a library like `fuse.js`:

```typescript
import Fuse from 'fuse.js';

async function searchHandler(query, type) {
	const data = await fetchData(type);

	const fuse = new Fuse(data, {
		keys: ['name', 'username'],
		threshold: 0.3,
	});

	return fuse.search(query).map((result) => result.item);
}
```

---

**Need help?** Check the [Troubleshooting Guide](../../troubleshooting/README.md) or open an issue on [GitHub](https://github.com/lesserphp/greater-components).

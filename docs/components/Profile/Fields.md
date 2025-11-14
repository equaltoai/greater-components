# Profile.Fields

**Component**: Custom Profile Fields Display  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 16 passing tests

---

## 📋 Overview

`Profile.Fields` displays custom profile fields that users can add to their profiles. These fields are commonly used for links, pronouns, location, and other personal information. The component supports verification indicators for fields verified via rel="me" links.

### **Key Features**:

- ✅ Display custom profile fields
- ✅ Verification badges for verified fields
- ✅ Responsive grid layout
- ✅ HTML content support in field values
- ✅ External link handling
- ✅ Field limit configuration
- ✅ Accessible with proper ARIA labels

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';

	const profile = {
		id: '123',
		username: 'alice',
		displayName: 'Alice Wonder',
		bio: 'Developer',
		followersCount: 1234,
		followingCount: 567,
		statusesCount: 8910,
		fields: [
			{
				name: 'Website',
				value: '<a href="https://alice.dev" rel="me">alice.dev</a>',
				verifiedAt: '2024-01-15T10:00:00Z',
			},
			{
				name: 'GitHub',
				value: '<a href="https://github.com/alice">github.com/alice</a>',
			},
			{
				name: 'Location',
				value: 'San Francisco, CA',
			},
			{
				name: 'Pronouns',
				value: 'she/her',
			},
		],
	};
</script>

<Profile.Root {profile} handlers={{}}>
	<Profile.Fields />
</Profile.Root>
```

---

## 🎛️ Props

| Prop               | Type      | Default | Required | Description                                   |
| ------------------ | --------- | ------- | -------- | --------------------------------------------- |
| `maxFields`        | `number`  | `4`     | No       | Maximum number of fields to display (0 = all) |
| `showVerification` | `boolean` | `true`  | No       | Show verification indicators                  |
| `class`            | `string`  | `''`    | No       | Custom CSS class                              |

---

## 💡 Examples

### **Example 1: Basic Field Display**

Display profile fields with default settings:

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
	import type { ProfileData, ProfileField } from '@equaltoai/greater-components-fediverse/Profile';

	const profile: ProfileData = {
		id: '123',
		username: 'alice',
		displayName: 'Alice Wonder',
		bio: 'Software Developer',
		avatar: 'https://example.com/avatar.jpg',
		followersCount: 1234,
		followingCount: 567,
		statusesCount: 8910,
		fields: [
			{
				name: 'Website',
				value: '<a href="https://alice.dev" rel="me">alice.dev</a>',
				verifiedAt: '2024-01-15T10:00:00Z',
			},
			{
				name: 'GitHub',
				value: '<a href="https://github.com/alice" rel="me">github.com/alice</a>',
				verifiedAt: '2024-01-15T11:00:00Z',
			},
			{
				name: 'Twitter',
				value: '<a href="https://twitter.com/alice">@alice</a>',
			},
			{
				name: 'Location',
				value: 'San Francisco, CA',
			},
			{
				name: 'Pronouns',
				value: 'she/her',
			},
			{
				name: 'Languages',
				value: 'English, Spanish',
			},
		],
	};
</script>

<div class="profile-container">
	<Profile.Root {profile} handlers={{}}>
		<Profile.Header />
		<Profile.Stats />

		{#if profile.fields && profile.fields.length > 0}
			<section class="profile-section">
				<h2>About</h2>
				<Profile.Fields maxFields={4} showVerification={true} />
			</section>
		{/if}
	</Profile.Root>
</div>

<style>
	.profile-container {
		max-width: 600px;
		margin: 0 auto;
		padding: 1rem;
	}

	.profile-section {
		margin-top: 1.5rem;
	}

	.profile-section h2 {
		margin: 0 0 1rem;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}
</style>
```

### **Example 2: With Field Icons**

Add custom icons for common field types:

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
	import type { ProfileField } from '@equaltoai/greater-components-fediverse/Profile';

	const profile = {
		id: '123',
		username: 'alice',
		displayName: 'Alice',
		bio: 'Developer',
		followersCount: 1234,
		followingCount: 567,
		statusesCount: 8910,
		fields: [
			{ name: 'Website', value: 'https://alice.dev', verifiedAt: '2024-01-15' },
			{ name: 'GitHub', value: 'https://github.com/alice' },
			{ name: 'Email', value: 'alice@example.com' },
			{ name: 'Location', value: 'San Francisco, CA' },
		],
	};

	function getFieldIcon(fieldName: string): string | null {
		const iconMap: { [key: string]: string } = {
			website:
				'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
			github:
				'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
			email:
				'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
			location:
				'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
		};

		const key = fieldName.toLowerCase();
		return iconMap[key] || null;
	}
</script>

<div class="fields-with-icons">
	<Profile.Root {profile} handlers={{}}>
		<div class="custom-fields">
			{#each profile.fields || [] as field}
				<div class="field-item">
					{#if getFieldIcon(field.name)}
						<svg class="field-icon" viewBox="0 0 24 24" fill="currentColor">
							<path d={getFieldIcon(field.name)} />
						</svg>
					{/if}
					<div class="field-content">
						<dt class="field-name">{field.name}</dt>
						<dd class="field-value">
							{@html field.value}
							{#if field.verifiedAt}
								<span class="verified-badge" title="Verified">
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
									</svg>
								</span>
							{/if}
						</dd>
					</div>
				</div>
			{/each}
		</div>
	</Profile.Root>
</div>

<style>
	.fields-with-icons {
		max-width: 600px;
		margin: 0 auto;
	}

	.custom-fields {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.field-item {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.75rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 1px solid var(--border-color, #eff3f4);
		border-radius: 0.5rem;
	}

	.field-icon {
		width: 1.25rem;
		height: 1.25rem;
		color: var(--text-secondary, #536471);
		flex-shrink: 0;
		margin-top: 0.125rem;
	}

	.field-content {
		flex: 1;
		min-width: 0;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
		gap: 0.75rem;
	}

	.field-name {
		margin: 0;
		font-weight: 700;
		font-size: 0.9375rem;
		color: var(--text-secondary, #536471);
	}

	.field-value {
		margin: 0;
		font-size: 0.9375rem;
		color: var(--text-primary, #0f1419);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.field-value :global(a) {
		color: var(--primary-color, #1d9bf0);
		text-decoration: none;
	}

	.field-value :global(a:hover) {
		text-decoration: underline;
	}

	.verified-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		background: var(--success-color, #00ba7c);
		border-radius: 50%;
		flex-shrink: 0;
	}

	.verified-badge svg {
		width: 12px;
		height: 12px;
		color: white;
	}

	@media (max-width: 640px) {
		.field-content {
			grid-template-columns: 1fr;
		}

		.field-name {
			padding-bottom: 0.25rem;
			border-bottom: 1px solid var(--border-color, #eff3f4);
		}
	}
</style>
```

### **Example 3: With Field Categories**

Group fields by category:

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
	import type { ProfileField } from '@equaltoai/greater-components-fediverse/Profile';

	interface FieldCategory {
		id: string;
		label: string;
		fields: ProfileField[];
	}

	const profile = {
		id: '123',
		username: 'alice',
		displayName: 'Alice',
		bio: 'Developer',
		followersCount: 1234,
		followingCount: 567,
		statusesCount: 8910,
		fields: [
			{ name: 'Website', value: 'https://alice.dev', verifiedAt: '2024-01-15' },
			{ name: 'GitHub', value: 'https://github.com/alice', verifiedAt: '2024-01-15' },
			{ name: 'Twitter', value: '@alice' },
			{ name: 'Email', value: 'alice@example.com' },
			{ name: 'Location', value: 'San Francisco, CA' },
			{ name: 'Timezone', value: 'PST (UTC-8)' },
			{ name: 'Languages', value: 'English, Spanish' },
			{ name: 'Pronouns', value: 'she/her' },
		],
	};

	function categorizeFields(fields: ProfileField[]): FieldCategory[] {
		const categories: FieldCategory[] = [
			{ id: 'links', label: 'Links', fields: [] },
			{ id: 'contact', label: 'Contact', fields: [] },
			{ id: 'personal', label: 'Personal', fields: [] },
		];

		const linkFields = ['website', 'github', 'twitter', 'linkedin', 'instagram'];
		const contactFields = ['email', 'phone'];

		fields.forEach((field) => {
			const name = field.name.toLowerCase();

			if (linkFields.some((link) => name.includes(link))) {
				categories[0].fields.push(field);
			} else if (contactFields.some((contact) => name.includes(contact))) {
				categories[1].fields.push(field);
			} else {
				categories[2].fields.push(field);
			}
		});

		// Remove empty categories
		return categories.filter((cat) => cat.fields.length > 0);
	}

	const categorized = $derived(categorizeFields(profile.fields || []));
</script>

<div class="categorized-fields">
	<Profile.Root {profile} handlers={{}}>
		{#each categorized as category}
			<section class="field-category">
				<h3 class="category-title">{category.label}</h3>
				<div class="category-fields">
					{#each category.fields as field}
						<div class="field-item">
							<dt class="field-name">{field.name}</dt>
							<dd class="field-value">
								{@html field.value}
								{#if field.verifiedAt}
									<svg
										class="verified-icon"
										viewBox="0 0 24 24"
										fill="currentColor"
										title="Verified"
									>
										<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
									</svg>
								{/if}
							</dd>
						</div>
					{/each}
				</div>
			</section>
		{/each}
	</Profile.Root>
</div>

<style>
	.categorized-fields {
		max-width: 600px;
		margin: 0 auto;
	}

	.field-category {
		margin-bottom: 2rem;
	}

	.category-title {
		margin: 0 0 0.75rem;
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-secondary, #536471);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.category-fields {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.field-item {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
		gap: 0.75rem;
		padding: 0.75rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 1px solid var(--border-color, #eff3f4);
		border-radius: 0.5rem;
	}

	.field-name {
		margin: 0;
		font-weight: 600;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.field-value {
		margin: 0;
		font-size: 0.9375rem;
		color: var(--text-primary, #0f1419);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		word-break: break-word;
	}

	.field-value :global(a) {
		color: var(--primary-color, #1d9bf0);
		text-decoration: none;
	}

	.field-value :global(a:hover) {
		text-decoration: underline;
	}

	.verified-icon {
		width: 1rem;
		height: 1rem;
		color: var(--success-color, #00ba7c);
		flex-shrink: 0;
	}
</style>
```

### **Example 4: With Link Preview**

Show link previews for URLs:

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
	import type { ProfileField } from '@equaltoai/greater-components-fediverse/Profile';

	interface LinkPreview {
		url: string;
		title?: string;
		description?: string;
		image?: string;
	}

	const profile = {
		id: '123',
		username: 'alice',
		displayName: 'Alice',
		bio: 'Developer',
		followersCount: 1234,
		followingCount: 567,
		statusesCount: 8910,
		fields: [
			{ name: 'Website', value: 'https://alice.dev', verifiedAt: '2024-01-15' },
			{ name: 'Blog', value: 'https://blog.alice.dev' },
			{ name: 'GitHub', value: 'https://github.com/alice' },
		],
	};

	let previews = $state<Map<string, LinkPreview>>(new Map());
	let loadingPreviews = $state<Set<string>>(new Set());

	async function fetchLinkPreview(url: string): Promise<LinkPreview | null> {
		try {
			const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);

			if (!response.ok) {
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error('Failed to fetch link preview:', error);
			return null;
		}
	}

	async function loadPreview(field: ProfileField) {
		// Extract URL from field value
		const urlMatch = field.value.match(/href="([^"]+)"/);
		if (!urlMatch) return;

		const url = urlMatch[1];
		if (previews.has(url) || loadingPreviews.has(url)) return;

		loadingPreviews.add(url);

		const preview = await fetchLinkPreview(url);
		if (preview) {
			previews.set(url, preview);
		}

		loadingPreviews.delete(url);
	}

	function extractUrl(fieldValue: string): string | null {
		const match = fieldValue.match(/href="([^"]+)"/);
		return match ? match[1] : null;
	}

	// Load previews for link fields
	$effect(() => {
		profile.fields?.forEach((field) => {
			const url = extractUrl(field.value);
			if (url && url.startsWith('http')) {
				loadPreview(field);
			}
		});
	});
</script>

<div class="fields-with-preview">
	<Profile.Root {profile} handlers={{}}>
		<div class="fields-list">
			{#each profile.fields || [] as field}
				{@const url = extractUrl(field.value)}
				{@const preview = url ? previews.get(url) : null}

				<div class="field-item">
					<div class="field-header">
						<dt class="field-name">{field.name}</dt>
						<dd class="field-value">
							{@html field.value}
							{#if field.verifiedAt}
								<span class="verified-badge">✓</span>
							{/if}
						</dd>
					</div>

					{#if preview}
						<div class="link-preview">
							{#if preview.image}
								<img src={preview.image} alt="" class="preview-image" loading="lazy" />
							{/if}
							<div class="preview-content">
								{#if preview.title}
									<h4 class="preview-title">{preview.title}</h4>
								{/if}
								{#if preview.description}
									<p class="preview-description">{preview.description}</p>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</Profile.Root>
</div>

<style>
	.fields-with-preview {
		max-width: 600px;
		margin: 0 auto;
	}

	.fields-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.field-item {
		padding: 1rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 1px solid var(--border-color, #eff3f4);
		border-radius: 0.5rem;
	}

	.field-header {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.field-name {
		margin: 0;
		font-weight: 600;
		color: var(--text-secondary, #536471);
	}

	.field-value {
		margin: 0;
		color: var(--text-primary, #0f1419);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.field-value :global(a) {
		color: var(--primary-color, #1d9bf0);
		text-decoration: none;
	}

	.verified-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		background: var(--success-color, #00ba7c);
		color: white;
		border-radius: 50%;
		font-size: 0.75rem;
	}

	.link-preview {
		display: flex;
		gap: 1rem;
		padding: 0.75rem;
		background: white;
		border: 1px solid var(--border-color, #eff3f4);
		border-radius: 0.5rem;
	}

	.preview-image {
		width: 80px;
		height: 80px;
		object-fit: cover;
		border-radius: 0.25rem;
		flex-shrink: 0;
	}

	.preview-content {
		flex: 1;
		min-width: 0;
	}

	.preview-title {
		margin: 0 0 0.25rem;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.preview-description {
		margin: 0;
		font-size: 0.8125rem;
		color: var(--text-secondary, #536471);
		line-height: 1.4;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
```

### **Example 5: With Copy-to-Clipboard**

Add copy buttons for field values:

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
	import type { ProfileField } from '@equaltoai/greater-components-fediverse/Profile';

	const profile = {
		id: '123',
		username: 'alice',
		displayName: 'Alice',
		bio: 'Developer',
		followersCount: 1234,
		followingCount: 567,
		statusesCount: 8910,
		fields: [
			{ name: 'Email', value: 'alice@example.com' },
			{ name: 'Discord', value: 'alice#1234' },
			{ name: 'PGP Key', value: '4096R/DEADBEEF' },
		],
	};

	let copiedField = $state<string | null>(null);

	async function copyToClipboard(text: string, fieldName: string) {
		try {
			await navigator.clipboard.writeText(text);
			copiedField = fieldName;

			setTimeout(() => {
				copiedField = null;
			}, 2000);
		} catch (error) {
			console.error('Failed to copy:', error);
		}
	}

	function stripHTML(html: string): string {
		const doc = new DOMParser().parseFromString(html, 'text/html');
		return doc.body.textContent || '';
	}
</script>

<div class="fields-with-copy">
	<Profile.Root {profile} handlers={{}}>
		<div class="fields-list">
			{#each profile.fields || [] as field}
				<div class="field-item">
					<dt class="field-name">{field.name}</dt>
					<dd class="field-value">
						{@html field.value}
						{#if field.verifiedAt}
							<svg class="verified-icon" viewBox="0 0 24 24" fill="currentColor">
								<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
							</svg>
						{/if}
					</dd>
					<button
						class="copy-button"
						onclick={() => copyToClipboard(stripHTML(field.value), field.name)}
						title="Copy to clipboard"
					>
						{#if copiedField === field.name}
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
							</svg>
						{:else}
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
								/>
							</svg>
						{/if}
					</button>
				</div>
			{/each}
		</div>
	</Profile.Root>
</div>

<style>
	.fields-with-copy {
		max-width: 600px;
		margin: 0 auto;
	}

	.fields-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.field-item {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 2fr) auto;
		gap: 0.75rem;
		align-items: center;
		padding: 0.75rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 1px solid var(--border-color, #eff3f4);
		border-radius: 0.5rem;
	}

	.field-name {
		margin: 0;
		font-weight: 600;
		color: var(--text-secondary, #536471);
	}

	.field-value {
		margin: 0;
		color: var(--text-primary, #0f1419);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		word-break: break-all;
	}

	.field-value :global(a) {
		color: var(--primary-color, #1d9bf0);
		text-decoration: none;
	}

	.verified-icon {
		width: 1rem;
		height: 1rem;
		color: var(--success-color, #00ba7c);
		flex-shrink: 0;
	}

	.copy-button {
		width: 32px;
		height: 32px;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: 1px solid var(--border-color, #cfd9de);
		border-radius: 0.25rem;
		color: var(--text-secondary, #536471);
		cursor: pointer;
		transition: all 0.2s;
	}

	.copy-button:hover {
		background: var(--bg-hover, #eff3f4);
		color: var(--text-primary, #0f1419);
	}

	.copy-button svg {
		width: 16px;
		height: 16px;
	}

	@media (max-width: 640px) {
		.field-item {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}

		.field-name {
			padding-bottom: 0.25rem;
			border-bottom: 1px solid var(--border-color, #eff3f4);
		}

		.copy-button {
			justify-self: end;
		}
	}
</style>
```

---

## 🔒 Security Considerations

### **XSS Prevention**

Always sanitize field values on the server:

```typescript
// server/api/profile.ts
import DOMPurify from 'isomorphic-dompurify';

function sanitizeFields(fields: ProfileField[]): ProfileField[] {
	return fields.map((field) => ({
		name: DOMPurify.sanitize(field.name, {
			ALLOWED_TAGS: [],
		}),
		value: DOMPurify.sanitize(field.value, {
			ALLOWED_TAGS: ['a'],
			ALLOWED_ATTR: ['href', 'rel'],
			ALLOWED_URI_REGEXP: /^https?:/,
		}),
		verifiedAt: field.verifiedAt,
	}));
}
```

---

## 🎨 Styling

```css
.profile-fields {
	--field-bg: var(--bg-secondary, #f7f9fa);
	--field-border: var(--border-color, #eff3f4);
	--field-verified-border: var(--success-color, #00ba7c);
}
```

---

## ♿ Accessibility

- ✅ Semantic HTML with `<dl>`, `<dt>`, `<dd>`
- ✅ Proper link handling with `rel` attributes
- ✅ Screen reader friendly
- ✅ Keyboard accessible

---

## 🧪 Testing

```typescript
import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import * as Profile from '@equaltoai/greater-components-fediverse/Profile';

describe('Profile.Fields', () => {
	it('displays all fields', () => {
		const profile = {
			id: '1',
			username: 'alice',
			displayName: 'Alice',
			followersCount: 100,
			followingCount: 50,
			statusesCount: 200,
			fields: [
				{ name: 'Website', value: 'https://alice.dev' },
				{ name: 'Location', value: 'SF' },
			],
		};

		render(Profile.Root, {
			props: { profile, handlers: {} },
		});

		expect(screen.getByText('Website')).toBeInTheDocument();
		expect(screen.getByText('Location')).toBeInTheDocument();
	});

	it('shows verification badges', () => {
		const profile = {
			id: '1',
			username: 'alice',
			displayName: 'Alice',
			followersCount: 100,
			followingCount: 50,
			statusesCount: 200,
			fields: [
				{
					name: 'Website',
					value: 'https://alice.dev',
					verifiedAt: '2024-01-15',
				},
			],
		};

		render(Profile.Root, {
			props: { profile, handlers: {} },
		});

		expect(screen.getByTitle(/verified/i)).toBeInTheDocument();
	});
});
```

---

## 🔗 Related Components

- [Profile.Root](./Root.md)
- [Profile.VerifiedFields](./VerifiedFields.md)
- [Profile.Header](./Header.md)

---

## 📚 See Also

- [Profile Components Overview](./README.md)
- [Field Verification Guide](../../patterns/FIELD_VERIFICATION.md)

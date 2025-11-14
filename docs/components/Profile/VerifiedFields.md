# Profile.VerifiedFields

**Component**: Verified Profile Fields Display  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 24 passing tests

---

## 📋 Overview

`Profile.VerifiedFields` displays profile fields with verification badges for fields that have been verified using the rel="me" mechanism. This component is essential for identity verification in the Fediverse, allowing users to prove ownership of external websites and profiles.

### **Key Features**:

- ✅ Display profile fields with verification status
- ✅ Verification badges for confirmed rel="me" links
- ✅ External link icons
- ✅ Verification date tooltips
- ✅ URL parsing and validation
- ✅ Field limit configuration
- ✅ Responsive design
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

	const fields = [
		{
			name: 'Website',
			value: 'https://alice.dev',
			verifiedAt: '2024-01-15T10:00:00Z',
		},
		{
			name: 'GitHub',
			value: 'https://github.com/alice',
			verifiedAt: '2024-01-15T11:00:00Z',
		},
		{
			name: 'Twitter',
			value: 'https://twitter.com/alice',
		},
	];
</script>

<Profile.VerifiedFields {fields} showVerificationBadge={true} showExternalIcon={true} />
```

---

## 🎛️ Props

| Prop                    | Type             | Default | Required | Description                         |
| ----------------------- | ---------------- | ------- | -------- | ----------------------------------- |
| `fields`                | `ProfileField[]` | `[]`    | No       | Profile fields to display           |
| `showVerificationBadge` | `boolean`        | `true`  | No       | Show verification badges            |
| `maxFields`             | `number`         | `4`     | No       | Maximum fields to display (0 = all) |
| `showExternalIcon`      | `boolean`        | `true`  | No       | Show external link icons            |
| `class`                 | `string`         | `''`    | No       | Custom CSS class                    |

### **ProfileField Interface**

```typescript
interface ProfileField {
	name: string;
	value: string;
	verifiedAt?: string; // ISO 8601 date string
}
```

---

## 💡 Examples

### **Example 1: Basic Verified Fields**

Display fields with verification indicators:

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
	import type { ProfileField } from '@equaltoai/greater-components-fediverse/Profile';

	const profile = {
		id: '123',
		username: 'alice',
		displayName: 'Alice Wonder',
		bio: 'Software developer and open source contributor',
		avatar: 'https://cdn.example.com/avatars/alice.jpg',
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
				name: 'Mastodon',
				value: '<a href="https://mastodon.social/@alice" rel="me">@alice@mastodon.social</a>',
				verifiedAt: '2024-01-16T09:00:00Z',
			},
			{
				name: 'Blog',
				value: '<a href="https://blog.alice.dev">blog.alice.dev</a>',
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

<div class="verified-profile">
	<Profile.Root {profile} handlers={{}}>
		<Profile.Header />

		<section class="verification-section">
			<h2>Verified Links</h2>
			<p class="verification-description">
				These links have been verified by checking for reciprocal links with rel="me"
			</p>

			<Profile.VerifiedFields
				fields={profile.fields || []}
				showVerificationBadge={true}
				showExternalIcon={true}
				maxFields={6}
			/>
		</section>
	</Profile.Root>
</div>

<style>
	.verified-profile {
		max-width: 600px;
		margin: 0 auto;
		padding: 1rem;
	}

	.verification-section {
		margin-top: 1.5rem;
		padding: 1.5rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 1px solid var(--border-color, #eff3f4);
		border-radius: 0.75rem;
	}

	.verification-section h2 {
		margin: 0 0 0.5rem;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.verification-description {
		margin: 0 0 1rem;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}
</style>
```

### **Example 2: With Verification Process**

Show verification status and allow re-verification:

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
	import type { ProfileField } from '@equaltoai/greater-components-fediverse/Profile';

	let fields = $state<ProfileField[]>([
		{ name: 'Website', value: 'https://alice.dev', verifiedAt: '2024-01-15' },
		{ name: 'GitHub', value: 'https://github.com/alice' },
		{ name: 'Blog', value: 'https://blog.alice.dev' },
	]);

	let verifying = $state<Set<string>>(new Set());
	let verificationErrors = $state<Map<string, string>>(new Map());

	async function verifyField(fieldName: string, fieldValue: string) {
		verifying.add(fieldName);
		verificationErrors.delete(fieldName);

		try {
			const response = await fetch('/api/profile/verify-field', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: fieldName, value: fieldValue }),
				credentials: 'include',
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Verification failed');
			}

			const result = await response.json();

			if (result.verified) {
				// Update field with verification
				fields = fields.map((f) =>
					f.name === fieldName ? { ...f, verifiedAt: new Date().toISOString() } : f
				);
			} else {
				verificationErrors.set(fieldName, 'Verification failed: No reciprocal link found');
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Verification failed';
			verificationErrors.set(fieldName, message);
		} finally {
			verifying.delete(fieldName);
		}
	}

	function extractUrl(value: string): string {
		const match = value.match(/href="([^"]+)"/);
		return match ? match[1] : value;
	}
</script>

<div class="verification-process">
	<h2>Profile Verification</h2>

	<div class="fields-list">
		<Profile.VerifiedFields {fields} showVerificationBadge={true} showExternalIcon={true} />
	</div>

	<div class="verification-actions">
		<h3>Verify Your Links</h3>
		<p>To verify a link, add a link back to your profile with rel="me" on your website.</p>

		{#each fields as field}
			{@const url = extractUrl(field.value)}
			{@const isVerifying = verifying.has(field.name)}
			{@const error = verificationErrors.get(field.name)}

			{#if !field.verifiedAt && url.startsWith('http')}
				<div class="verification-item">
					<div class="verification-info">
						<strong>{field.name}</strong>
						<span class="url">{url}</span>
					</div>

					{#if error}
						<div class="verification-error">{error}</div>
					{/if}

					<button
						class="verify-button"
						onclick={() => verifyField(field.name, url)}
						disabled={isVerifying}
					>
						{#if isVerifying}
							<span class="spinner"></span>
							Verifying...
						{:else}
							Verify Now
						{/if}
					</button>
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.verification-process {
		max-width: 600px;
		margin: 0 auto;
		padding: 1.5rem;
	}

	.verification-process h2 {
		margin: 0 0 1.5rem;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.fields-list {
		margin-bottom: 2rem;
	}

	.verification-actions {
		padding: 1.5rem;
		background: #f7f9fa;
		border: 1px solid #eff3f4;
		border-radius: 0.75rem;
	}

	.verification-actions h3 {
		margin: 0 0 0.5rem;
		font-size: 1.125rem;
		font-weight: 600;
	}

	.verification-actions > p {
		margin: 0 0 1rem;
		font-size: 0.875rem;
		color: #536471;
	}

	.verification-item {
		padding: 1rem;
		margin-top: 0.75rem;
		background: white;
		border: 1px solid #eff3f4;
		border-radius: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.verification-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.url {
		font-size: 0.875rem;
		color: #1d9bf0;
		word-break: break-all;
	}

	.verification-error {
		padding: 0.5rem;
		background: #fee;
		border: 1px solid #fcc;
		border-radius: 0.25rem;
		color: #c00;
		font-size: 0.8125rem;
	}

	.verify-button {
		padding: 0.625rem 1.25rem;
		background: #1d9bf0;
		color: white;
		border: none;
		border-radius: 9999px;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		align-self: flex-start;
	}

	.verify-button:hover:not(:disabled) {
		background: #1a8cd8;
	}

	.verify-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.spinner {
		display: inline-block;
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
```

### **Example 3: With Verification Status Icons**

Show different icons for verification states:

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
	import type { ProfileField } from '@equaltoai/greater-components-fediverse/Profile';

	interface FieldWithStatus extends ProfileField {
		status: 'verified' | 'pending' | 'failed' | 'unverified';
	}

	const fieldsWithStatus: FieldWithStatus[] = [
		{
			name: 'Website',
			value: 'https://alice.dev',
			verifiedAt: '2024-01-15T10:00:00Z',
			status: 'verified',
		},
		{
			name: 'GitHub',
			value: 'https://github.com/alice',
			status: 'pending',
		},
		{
			name: 'Blog',
			value: 'https://blog.alice.dev',
			status: 'failed',
		},
		{
			name: 'Twitter',
			value: 'https://twitter.com/alice',
			status: 'unverified',
		},
	];

	function getStatusIcon(status: string): string {
		switch (status) {
			case 'verified':
				return 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z';
			case 'pending':
				return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z';
			case 'failed':
				return 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z';
			case 'unverified':
				return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z';
			default:
				return '';
		}
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'verified':
				return '#4caf50';
			case 'pending':
				return '#ff9800';
			case 'failed':
				return '#f44336';
			case 'unverified':
				return '#9e9e9e';
			default:
				return '#9e9e9e';
		}
	}

	function getStatusText(status: string): string {
		switch (status) {
			case 'verified':
				return 'Verified';
			case 'pending':
				return 'Verification pending';
			case 'failed':
				return 'Verification failed';
			case 'unverified':
				return 'Not verified';
			default:
				return '';
		}
	}
</script>

<div class="fields-with-status">
	<h2>Profile Links</h2>

	<div class="fields-list">
		{#each fieldsWithStatus as field}
			<div class="field-item" data-status={field.status}>
				<div class="field-content">
					<dt class="field-name">{field.name}</dt>
					<dd class="field-value">
						{#if field.value.startsWith('http')}
							<a href={field.value} target="_blank" rel="noopener noreferrer">
								{field.value.replace(/^https?:\/\//, '')}
								<svg class="external-icon" viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"
									/>
								</svg>
							</a>
						{:else}
							{field.value}
						{/if}
					</dd>
				</div>

				<div class="status-badge" style="color: {getStatusColor(field.status)}">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path d={getStatusIcon(field.status)} />
					</svg>
					<span class="status-text">{getStatusText(field.status)}</span>
				</div>
			</div>
		{/each}
	</div>

	<div class="verification-help">
		<h3>How to verify your links</h3>
		<ol>
			<li>Add a link to your profile on your website</li>
			<li>Make sure the link includes <code>rel="me"</code></li>
			<li>Click "Verify Now" next to the field</li>
			<li>Verification usually completes within a few minutes</li>
		</ol>
	</div>
</div>

<style>
	.fields-with-status {
		max-width: 600px;
		margin: 0 auto;
		padding: 1.5rem;
	}

	.fields-with-status h2 {
		margin: 0 0 1.5rem;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.fields-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 2rem;
	}

	.field-item {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem;
		background: #f7f9fa;
		border: 1px solid #eff3f4;
		border-radius: 0.5rem;
		transition: all 0.2s;
	}

	.field-item[data-status='verified'] {
		background: rgba(76, 175, 80, 0.05);
		border-color: #4caf50;
	}

	.field-item[data-status='failed'] {
		background: rgba(244, 67, 54, 0.05);
		border-color: #f44336;
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
		font-weight: 600;
		color: #536471;
	}

	.field-value {
		margin: 0;
		color: #0f1419;
	}

	.field-value a {
		color: #1d9bf0;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		word-break: break-all;
	}

	.field-value a:hover {
		text-decoration: underline;
	}

	.external-icon {
		width: 14px;
		height: 14px;
		opacity: 0.6;
		flex-shrink: 0;
	}

	.status-badge {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: white;
		border-radius: 9999px;
		font-size: 0.8125rem;
		font-weight: 500;
		white-space: nowrap;
	}

	.status-badge svg {
		width: 18px;
		height: 18px;
	}

	.verification-help {
		padding: 1.5rem;
		background: #e8f5fe;
		border: 1px solid #1d9bf0;
		border-radius: 0.75rem;
	}

	.verification-help h3 {
		margin: 0 0 1rem;
		font-size: 1.125rem;
		font-weight: 600;
		color: #0f1419;
	}

	.verification-help ol {
		margin: 0;
		padding-left: 1.5rem;
		color: #536471;
		line-height: 1.6;
	}

	.verification-help li {
		margin: 0.5rem 0;
	}

	.verification-help code {
		padding: 0.125rem 0.375rem;
		background: white;
		border: 1px solid #1d9bf0;
		border-radius: 0.25rem;
		font-family: 'Courier New', monospace;
		font-size: 0.875rem;
		color: #1d9bf0;
	}

	@media (max-width: 640px) {
		.field-content {
			grid-template-columns: 1fr;
		}

		.field-item {
			flex-direction: column;
		}

		.status-badge {
			align-self: flex-start;
		}
	}
</style>
```

### **Example 4: With rel="me" Verification Server**

Implement server-side rel="me" verification:

```typescript
// server/api/verify-field.ts
import { JSDOM } from 'jsdom';

interface VerificationRequest {
	name: string;
	value: string;
}

interface VerificationResult {
	verified: boolean;
	verifiedAt?: string;
	error?: string;
}

export async function POST(request: Request): Promise<Response> {
	const userId = await getAuthenticatedUserId(request);
	if (!userId) {
		return new Response('Unauthorized', { status: 401 });
	}

	const body: VerificationRequest = await request.json();
	const { name, value } = body;

	// Extract URL from value (may contain HTML)
	const urlMatch = value.match(/href="([^"]+)"/);
	const url = urlMatch ? urlMatch[1] : value;

	// Validate URL
	if (!url.startsWith('http://') && !url.startsWith('https://')) {
		return new Response(JSON.stringify({ verified: false, error: 'Invalid URL' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	try {
		// Fetch the target page
		const response = await fetch(url, {
			headers: {
				'User-Agent': 'GreaterComponents/1.0 (+https://example.com/about)',
			},
			signal: AbortSignal.timeout(10000), // 10 second timeout
		});

		if (!response.ok) {
			return new Response(
				JSON.stringify({
					verified: false,
					error: `Failed to fetch URL: ${response.status}`,
				}),
				{ status: 200, headers: { 'Content-Type': 'application/json' } }
			);
		}

		const html = await response.text();
		const dom = new JSDOM(html);
		const document = dom.window.document;

		// Get user's profile URL
		const user = await db.users.findUnique({ where: { id: userId } });
		const profileUrl = `https://example.com/@${user.username}`;

		// Look for links with rel="me" that point back to the profile
		const meLinks = document.querySelectorAll('a[rel~="me"]');
		let verified = false;

		for (const link of meLinks) {
			const href = link.getAttribute('href');
			if (href && normalizeUrl(href) === normalizeUrl(profileUrl)) {
				verified = true;
				break;
			}
		}

		if (verified) {
			// Update field in database
			const verifiedAt = new Date().toISOString();
			await db.profileFields.update({
				where: { userId, name },
				data: { verifiedAt },
			});

			// Create audit log
			await db.auditLogs.create({
				data: {
					userId,
					action: 'profile.field.verified',
					details: JSON.stringify({ name, url }),
					timestamp: new Date(),
				},
			});

			return new Response(JSON.stringify({ verified: true, verifiedAt }), {
				headers: { 'Content-Type': 'application/json' },
			});
		} else {
			return new Response(
				JSON.stringify({
					verified: false,
					error: 'No reciprocal rel="me" link found',
				}),
				{ headers: { 'Content-Type': 'application/json' } }
			);
		}
	} catch (error) {
		console.error('Verification error:', error);
		return new Response(
			JSON.stringify({
				verified: false,
				error: 'Verification failed',
			}),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}

function normalizeUrl(url: string): string {
	try {
		const parsed = new URL(url);
		return `${parsed.protocol}//${parsed.host}${parsed.pathname}`.replace(/\/$/, '');
	} catch {
		return url;
	}
}
```

### **Example 5: With Bulk Verification**

Allow verifying multiple fields at once:

```svelte
<script lang="ts">
	import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
	import type { ProfileField } from '@equaltoai/greater-components-fediverse/Profile';

	let fields = $state<ProfileField[]>([
		{ name: 'Website', value: 'https://alice.dev' },
		{ name: 'GitHub', value: 'https://github.com/alice' },
		{ name: 'Blog', value: 'https://blog.alice.dev' },
		{ name: 'Mastodon', value: 'https://mastodon.social/@alice' },
	]);

	let verifying = $state(false);
	let results = $state<Map<string, { success: boolean; message: string }>>(new Map());

	async function verifyAllFields() {
		verifying = true;
		results.clear();

		const urlFields = fields.filter((f) => f.value.startsWith('http') && !f.verifiedAt);

		// Verify in parallel
		const verifications = urlFields.map(async (field) => {
			try {
				const response = await fetch('/api/profile/verify-field', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: field.name,
						value: field.value,
					}),
					credentials: 'include',
				});

				const result = await response.json();

				if (result.verified) {
					results.set(field.name, {
						success: true,
						message: 'Verified successfully',
					});

					// Update field
					fields = fields.map((f) =>
						f.name === field.name ? { ...f, verifiedAt: result.verifiedAt } : f
					);
				} else {
					results.set(field.name, {
						success: false,
						message: result.error || 'Verification failed',
					});
				}
			} catch (error) {
				results.set(field.name, {
					success: false,
					message: 'Network error',
				});
			}
		});

		await Promise.all(verifications);
		verifying = false;
	}

	const unverifiedCount = $derived(
		fields.filter((f) => f.value.startsWith('http') && !f.verifiedAt).length
	);
</script>

<div class="bulk-verification">
	<h2>Bulk Field Verification</h2>

	<Profile.VerifiedFields {fields} showVerificationBadge={true} showExternalIcon={true} />

	{#if unverifiedCount > 0}
		<div class="bulk-actions">
			<button class="verify-all-button" onclick={verifyAllFields} disabled={verifying}>
				{#if verifying}
					<span class="spinner"></span>
					Verifying {unverifiedCount} field{unverifiedCount !== 1 ? 's' : ''}...
				{:else}
					Verify All ({unverifiedCount})
				{/if}
			</button>
		</div>
	{/if}

	{#if results.size > 0}
		<div class="verification-results">
			<h3>Verification Results</h3>
			{#each Array.from(results.entries()) as [name, result]}
				<div class="result-item" class:success={result.success}>
					<div class="result-icon">
						{#if result.success}
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
							</svg>
						{:else}
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
								/>
							</svg>
						{/if}
					</div>
					<div class="result-content">
						<strong>{name}</strong>
						<span class="result-message">{result.message}</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.bulk-verification {
		max-width: 600px;
		margin: 0 auto;
		padding: 1.5rem;
	}

	.bulk-verification h2 {
		margin: 0 0 1.5rem;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.bulk-actions {
		margin: 1.5rem 0;
		padding: 1.5rem;
		background: #f7f9fa;
		border: 1px solid #eff3f4;
		border-radius: 0.75rem;
		display: flex;
		justify-content: center;
	}

	.verify-all-button {
		padding: 0.875rem 2rem;
		background: #1d9bf0;
		color: white;
		border: none;
		border-radius: 9999px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		transition: background 0.2s;
	}

	.verify-all-button:hover:not(:disabled) {
		background: #1a8cd8;
	}

	.verify-all-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.spinner {
		display: inline-block;
		width: 18px;
		height: 18px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.verification-results {
		margin-top: 1.5rem;
		padding: 1.5rem;
		background: white;
		border: 1px solid #eff3f4;
		border-radius: 0.75rem;
	}

	.verification-results h3 {
		margin: 0 0 1rem;
		font-size: 1.125rem;
		font-weight: 600;
	}

	.result-item {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.75rem;
		margin-bottom: 0.5rem;
		background: #fee;
		border: 1px solid #fcc;
		border-radius: 0.5rem;
	}

	.result-item.success {
		background: #e8f5e9;
		border-color: #a5d6a7;
	}

	.result-icon {
		width: 24px;
		height: 24px;
		flex-shrink: 0;
		color: #f44336;
	}

	.result-item.success .result-icon {
		color: #4caf50;
	}

	.result-icon svg {
		width: 100%;
		height: 100%;
	}

	.result-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.result-content strong {
		color: #0f1419;
	}

	.result-message {
		font-size: 0.875rem;
		color: #536471;
	}
</style>
```

---

## 🔒 Security Considerations

### **URL Validation**

Always validate and sanitize URLs:

```typescript
function isValidUrl(url: string): boolean {
	try {
		const parsed = new URL(url);
		return parsed.protocol === 'http:' || parsed.protocol === 'https:';
	} catch {
		return false;
	}
}

function sanitizeUrl(url: string): string {
	return url.replace(/javascript:/gi, '').trim();
}
```

### **Rate Limiting Verification Requests**

```typescript
const verificationLimit = new RateLimiter({
	redis,
	limiter: Ratelimit.slidingWindow(5, '1 h'),
	analytics: true,
});
```

---

## 🎨 Styling

```css
.verified-fields {
	--verified-bg: rgba(76, 175, 80, 0.05);
	--verified-border: #4caf50;
	--verified-badge: #4caf50;
}
```

---

## ♿ Accessibility

- ✅ **Semantic HTML**: Definition lists for fields
- ✅ **ARIA Labels**: Proper labeling for verification status
- ✅ **Keyboard Navigation**: Accessible links
- ✅ **Screen Readers**: Status announcements

---

## 🧪 Testing

```typescript
import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { VerifiedFields } from '@equaltoai/greater-components-fediverse/Profile';

describe('VerifiedFields', () => {
	it('displays verification badges for verified fields', () => {
		const fields = [{ name: 'Website', value: 'https://alice.dev', verifiedAt: '2024-01-15' }];

		render(VerifiedFields, { props: { fields } });

		expect(screen.getByTitle(/verified/i)).toBeInTheDocument();
	});
});
```

---

## 🔗 Related Components

- [Profile.Root](./Root.md)
- [Profile.Fields](./Fields.md)
- [Profile.Edit](./Edit.md)

---

## 📚 See Also

- [Profile Components Overview](./README.md)
- [rel="me" Verification Guide](../../patterns/REL_ME_VERIFICATION.md)
- [Mastodon rel="me" Documentation](https://docs.joinmastodon.org/user/profile/#verification)

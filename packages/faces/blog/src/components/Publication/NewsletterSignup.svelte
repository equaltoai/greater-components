<!--
Publication.NewsletterSignup - Newsletter signup CTA

@component
@example
```svelte
<Publication.Root publication={publication}>
  <Publication.NewsletterSignup onSubscribe={(email) => api.subscribe(email)} />
</Publication.Root>
```
-->

<script lang="ts">
	import { getPublicationContext } from './context.js';

	interface Props {
		title?: string;
		description?: string;
		placeholder?: string;
		buttonLabel?: string;
		onSubscribe?: (email: string) => Promise<void> | void;
	}

	let {
		title,
		description,
		placeholder = 'you@example.com',
		buttonLabel = 'Subscribe',
		onSubscribe,
	}: Props = $props();

	const { publication } = getPublicationContext();

	let email = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);
	let success = $state(false);

	const effectiveTitle = $derived(title ?? `Subscribe to ${publication.name}`);
	const effectiveDescription = $derived(
		description ?? 'Get new posts delivered to your inbox. No spam, unsubscribe anytime.'
	);

	async function handleSubmit(event: Event) {
		event.preventDefault();
		error = null;
		success = false;

		const trimmed = email.trim();
		if (!trimmed) {
			error = 'Email is required.';
			return;
		}

		if (!onSubscribe) {
			success = true;
			return;
		}

		loading = true;
		try {
			await onSubscribe(trimmed);
			success = true;
			email = '';
		} catch (e) {
			error = e instanceof Error ? e.message : 'Subscription failed.';
		} finally {
			loading = false;
		}
	}
</script>

{#if publication.hasNewsletter !== false}
	<div class="gr-blog-newsletter" aria-live="polite">
		<div class="gr-blog-newsletter__title">{effectiveTitle}</div>
		<div class="gr-blog-newsletter__description">{effectiveDescription}</div>

		<form class="gr-blog-newsletter__form" onsubmit={handleSubmit}>
			<input
				type="email"
				name="email"
				autocomplete="email"
				placeholder={placeholder}
				bind:value={email}
				disabled={loading}
				aria-invalid={error ? 'true' : 'false'}
			/>
			<button type="submit" disabled={loading}>
				{#if loading}
					Subscribing…
				{:else}
					{buttonLabel}
				{/if}
			</button>
		</form>

		{#if error}
			<div class="gr-blog-newsletter__error" role="alert">{error}</div>
		{/if}
		{#if success}
			<div class="gr-blog-newsletter__success">Subscribed!</div>
		{/if}
	</div>
{/if}


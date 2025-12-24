<!--
  SignInCard - OAuth Sign-In Card Component
  
  Displays a card with OAuth provider buttons for authentication.
  Supports multiple providers, loading states, and error handling.
  
  @component
  @example
  ```svelte
  <script>
    import { SignInCard } from '@equaltoai/greater-components-auth';
    import { GithubIcon, TwitterIcon } from '@equaltoai/greater-components-icons';
    
    const providers = [
      { id: 'github', name: 'GitHub', icon: GithubIcon },
      { id: 'twitter', name: 'Twitter', icon: TwitterIcon },
    ];
    
    let loading = $state(false);
    let loadingProvider = $state<string | null>(null);
    let error = $state<string | null>(null);
    
    async function handleSignIn(providerId: string) {
      loadingProvider = providerId;
      loading = true;
      try {
        await signInWithProvider(providerId);
      } catch (e) {
        error = e.message;
      } finally {
        loading = false;
        loadingProvider = null;
      }
    }
  </script>
  
  <SignInCard 
    title="Welcome back"
    description="Sign in to your account"
    {providers}
    onSignIn={handleSignIn}
    {loading}
    {loadingProvider}
    {error}
    onRetry={() => error = null}
  />
  ```
-->
<script lang="ts">
	import type { SignInCardProps, OAuthProvider } from './types.js';
	import { Card, Button, Alert, Heading, Text } from '@equaltoai/greater-components-primitives';

	let {
		title = 'Sign in to continue',
		description,
		providers,
		onSignIn,
		loading = false,
		loadingProvider = null,
		error = null,
		onRetry,
		class: className = '',
		footer: footerSnippet,
	}: SignInCardProps = $props();

	/**
	 * Handle provider button click
	 */
	async function handleProviderClick(provider: OAuthProvider) {
		if (loading) return;
		await onSignIn(provider.id);
	}

	/**
	 * Check if a specific provider is currently loading
	 */
	function isProviderLoading(providerId: string): boolean {
		return loading && loadingProvider === providerId;
	}

	/**
	 * Check if provider button should be disabled
	 */
	function isProviderDisabled(providerId: string): boolean {
		return loading && loadingProvider !== null && loadingProvider !== providerId;
	}

	// Compute card classes
	const cardClass = $derived(['auth-sign-in-card', className].filter(Boolean).join(' '));
</script>

<Card variant="elevated" padding="lg" class={cardClass}>
	{#snippet header()}
		<div class="auth-sign-in-card__header">
			<Heading level={2} size="xl" align="center" class="auth-sign-in-card__title">
				{title}
			</Heading>
			{#if description}
				<Text size="sm" color="secondary" align="center" class="auth-sign-in-card__description">
					{description}
				</Text>
			{/if}
		</div>
	{/snippet}

	<div class="auth-sign-in-card__content">
		{#if error}
			<Alert
				variant="error"
				dismissible={!!onRetry}
				onDismiss={onRetry}
				actionLabel={onRetry ? 'Try again' : undefined}
				onAction={onRetry}
				class="auth-sign-in-card__error"
			>
				{error}
			</Alert>
		{/if}

		<div class="auth-sign-in-card__providers" role="group" aria-label="Sign in options">
			{#each providers as provider (provider.id)}
				{@const providerLoading = isProviderLoading(provider.id)}
				{@const providerDisabled = isProviderDisabled(provider.id)}

				<Button
					variant="outline"
					size="lg"
					class="auth-sign-in-card__provider-button"
					disabled={providerDisabled}
					loading={providerLoading}
					loadingBehavior="replace-prefix"
					onclick={() => handleProviderClick(provider)}
					aria-label={`Sign in with ${provider.name}`}
					aria-busy={providerLoading}
				>
					{#snippet prefix()}
						{#if provider.icon && !providerLoading}
							{@const Icon = provider.icon}
							<Icon size={20} aria-hidden="true" />
						{/if}
					{/snippet}
					Continue with {provider.name}
				</Button>
			{/each}
		</div>
	</div>

	{#if footerSnippet}
		<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
		{#snippet footer()}
			<div class="auth-sign-in-card__footer">
				{@render footerSnippet()}
			</div>
		{/snippet}
	{/if}
</Card>

<style>
	:global(.auth-sign-in-card) {
		max-width: 400px;
		width: 100%;
	}

	.auth-sign-in-card__header {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-sm, 0.5rem);
		margin-bottom: var(--gr-spacing-lg, 1.5rem);
	}

	:global(.auth-sign-in-card__title) {
		margin: 0;
	}

	:global(.auth-sign-in-card__description) {
		margin: 0;
	}

	.auth-sign-in-card__content {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-md, 1rem);
	}

	:global(.auth-sign-in-card__error) {
		margin-bottom: var(--gr-spacing-sm, 0.5rem);
	}

	.auth-sign-in-card__providers {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-sm, 0.75rem);
	}

	:global(.auth-sign-in-card__provider-button) {
		width: 100%;
		justify-content: center;
	}

	.auth-sign-in-card__footer {
		margin-top: var(--gr-spacing-md, 1rem);
		padding-top: var(--gr-spacing-md, 1rem);
		border-top: 1px solid var(--gr-color-border, #e5e7eb);
		text-align: center;
	}
</style>

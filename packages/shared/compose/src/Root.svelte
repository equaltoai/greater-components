<!--
Compose.Root - Container component for Compose compound components

Provides context for child components and handles form submission.

@component
@example
```svelte
<Compose.Root config={{ characterLimit: 500 }} handlers={{ onSubmit }}>
  <Compose.Editor />
  <Compose.CharacterCount />
  <Compose.Submit />
</Compose.Root>
```
-->

<script lang="ts">
	import { type Snippet, untrack } from 'svelte';
	import { createComposeContext } from './context.js';
	import type { ComposeConfig, ComposeHandlers, ComposeState } from './context.js';

	interface Props {
		/**
		 * Configuration options
		 */
		config?: ComposeConfig;

		/**
		 * Action handlers
		 */
		handlers?: ComposeHandlers;

		/**
		 * Initial state
		 */
		initialState?: Partial<ComposeState>;

		/**
		 * Child components
		 */
		children?: Snippet;
	}

	let { config = {}, handlers = {}, initialState = {}, children }: Props = $props();

	// Create reactive state using Svelte 5 runes
	const characterLimit = untrack(() => config.characterLimit) || 500;
	const defaultState: Partial<ComposeState> = {
		content: '',
		contentWarning: '',
		visibility: untrack(() => config.defaultVisibility) || 'public',
		mediaAttachments: [],
		submitting: false,
		error: null,
		characterCount: 0,
		overLimit: false,
		inReplyTo: undefined,
		contentWarningEnabled: false,
	};

	// Create reactive state
	let state: ComposeState = $state(
		untrack(
			() =>
				({
					...defaultState,
					...initialState,
				}) as ComposeState
		)
	);

	// Update initial character count
	state.characterCount = state.content.length + state.contentWarning.length;
	state.overLimit = state.characterCount > characterLimit;

	// Reactive effect to update character count when content changes
	$effect(() => {
		const count = state.content.length + state.contentWarning.length;
		state.characterCount = count;
		state.overLimit = count > characterLimit;
	});

	// Override reset to work with reactive state
	function resetState() {
		Object.assign(state, defaultState);
		state.characterCount = state.content.length + state.contentWarning.length;
		state.overLimit = state.characterCount > characterLimit;
	}

	// Create context with the reactive state
	const context = createComposeContext(
		untrack(() => config),
		untrack(() => handlers),
		untrack(() => initialState),
		state
	);

	$effect(() => {
		// Sync handlers
		Object.assign(context.handlers, handlers);
		// Sync config if mutable in context, assuming context.config is the reference
		Object.assign(context.config, config);
	});

	// Override reset function to use reactive state
	context.reset = resetState;

	/**
	 * Handle form submission
	 */
	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (context.state.overLimit || context.state.submitting) {
			return;
		}

		if (!context.handlers.onSubmit) {
			console.warn('No onSubmit handler provided to Compose.Root');
			return;
		}

		context.updateState({ submitting: true, error: null });

		try {
			await context.handlers.onSubmit({
				content: context.state.content,
				visibility: context.state.visibility,
				contentWarning: context.state.contentWarningEnabled
					? context.state.contentWarning
					: undefined,
				mediaAttachments: context.state.mediaAttachments,
				inReplyTo: context.state.inReplyTo,
			});

			// Reset after successful submission
			context.reset();
		} catch (error) {
			context.updateState({ error: error as Error });
		} finally {
			context.updateState({ submitting: false });
		}
	}
</script>

<form
	class={`compose-root ${context.config.class}`}
	class:compose-root--submitting={context.state.submitting}
	class:compose-root--over-limit={context.state.overLimit}
	onsubmit={handleSubmit}
	aria-busy={context.state.submitting}
>
	{#if context.state.error}
		<div class="compose-root__error" role="alert">
			{context.state.error.message}
		</div>
	{/if}

	{#if context.state.inReplyTo}
		<div class="compose-root__reply-indicator">Replying to post</div>
	{/if}

	{#if children}
		{@render children()}
	{/if}
</form>

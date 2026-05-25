<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount, onDestroy, untrack } from 'svelte';

	import { Button, TextField } from '@equaltoai/greater-components-primitives';
	import { useStableId } from '@equaltoai/greater-components-utils';
	import type {
		ComposeBoxProps,
		ComposeBoxDraft,
		ComposeMediaAttachment,
		ComposePoll,
	} from '../types.js';

	interface Props extends ComposeBoxProps {
		mediaSlot?: Snippet<
			[
				{
					attachments: ComposeMediaAttachment[];
					onRemove: (id: string) => void;
					onDescriptionEdit: (id: string, description: string) => void;
					disabled: boolean;
				},
			]
		>;
		pollSlot?: Snippet<
			[
				{
					poll?: ComposePoll;
					onPollChange: (poll: ComposePoll | undefined) => void;
					disabled: boolean;
				},
			]
		>;
		style?: string;
		/** Additional CSS classes applied to the compose-box root. @public */
		class?: string;
	}

	let {
		initialContent = '',
		replyToStatus,
		maxLength = 500,
		maxCwLength = 100,
		placeholder = "What's on your mind?",
		cwPlaceholder = 'Content warning',
		autoFocus = false,
		disabled = false,
		supportedMediaTypes = ['image/*', 'video/*', 'audio/*'],
		maxMediaAttachments = 4,
		enablePolls = true,
		enableContentWarnings = true,
		enableVisibilitySettings = true,
		defaultVisibility = 'public',
		characterCountMode = 'soft',
		draftKey = 'compose-box-draft',
		onSubmit,
		onCancel,
		onDraftSave,
		onMediaUpload,
		onMediaRemove,
		mediaSlot,
		pollSlot,
		class: className = '',
		id,
		style: _style,
		...restProps
	}: Props = $props();

	// Component state

	let content = $state(untrack(() => initialContent));
	let contentWarning = $state('');
	let hasContentWarning = $state(false);

	let visibility = $state<'public' | 'unlisted' | 'private' | 'direct'>(
		untrack(() => defaultVisibility)
	);
	let mediaAttachments = $state<ComposeMediaAttachment[]>([]);
	let poll = $state<ComposePoll | undefined>();
	let isSubmitting = $state(false);
	let focused = $state(false);
	let showCharacterCount = $state(false);

	// Element references. The CW input is a `<TextField>` whose internal
	// `<input>` is not bind-exposed, so a `.focus()` ref isn't reachable
	// here today. The auto-focus-on-CW-toggle was a stub call against an
	// unfocusable component instance and has been removed; see follow-up
	// issue for `TextField.inputRef`-bindable to restore the UX cleanly.
	let textareaElement = $state<HTMLTextAreaElement>();
	let containerElement = $state<HTMLDivElement>();

	// Auto-save draft timer
	let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;

	// Derived state
	const contentLength = $derived(content.length);
	const cwLength = $derived(contentWarning.length);

	const isAtSoftLimit = $derived(contentLength >= maxLength * 0.8);
	const isAtHardLimit = $derived(characterCountMode === 'hard' && contentLength >= maxLength);
	const isOverLimit = $derived(contentLength > maxLength);

	const canSubmit = $derived(
		!disabled &&
			!isSubmitting &&
			(content.trim().length > 0 || mediaAttachments.length > 0 || poll) &&
			(characterCountMode === 'soft' || !isAtHardLimit) &&
			(!hasContentWarning || contentWarning.trim().length <= maxCwLength)
	);

	type CharacterCountTone = 'default' | 'warning' | 'error';

	// `$derived(expr)` takes an expression; passing an arrow function
	// makes the derived value itself a function reference. Use
	// `.by(fn)` for lazy computation. Same pattern that previously
	// snuck through host-platform's CostGauge (Project 41 PR-A).
	const characterCountTone = $derived.by<CharacterCountTone>(() => {
		if (isOverLimit) return 'error';
		if (isAtSoftLimit) return 'warning';
		return 'default';
	});

	const draftData = $derived<ComposeBoxDraft>({
		content,
		contentWarning,
		hasContentWarning,
		visibility,
		mediaAttachments,
		poll,
		replyToId: replyToStatus?.id,
		timestamp: Date.now(),
	});

	// Generate unique IDs for accessibility
	const stableId = useStableId('compose-box');
	const composeId = $derived(id || stableId.value || undefined);
	const textareaId = $derived(composeId ? `${composeId}-textarea` : undefined);
	const cwId = $derived(composeId ? `${composeId}-cw` : undefined);
	const charCountId = $derived(composeId ? `${composeId}-char-count` : undefined);
	const cwCharCountId = $derived(composeId ? `${composeId}-cw-char-count` : undefined);

	// Handle content input
	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		content = target.value;
		scheduleDraftSave();
	}

	// Handle content warning input
	function handleCwInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		contentWarning = target.value;
		scheduleDraftSave();
	}

	// Handle keyboard shortcuts
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
			event.preventDefault();
			handleSubmit();
		} else if (event.key === 'Escape') {
			event.preventDefault();
			handleCancel();
		}
	}

	// Toggle content warning. The CW input is rendered as a `<TextField>`
	// (a styled wrapper) so we cannot reach its internal `<input>` to call
	// `.focus()` from here without TextField exposing a bindable
	// inputRef. Tracked as a follow-up enhancement; the prior `.focus()`
	// call referenced a component instance that never honored it, so
	// removing it changes no observable behavior.
	function toggleContentWarning() {
		hasContentWarning = !hasContentWarning;
		scheduleDraftSave();
	}

	// Handle media attachment
	async function handleMediaAdd(event: Event) {
		const input = event.target as HTMLInputElement;
		const files = input.files;

		if (!files || !onMediaUpload) return;

		for (const file of Array.from(files)) {
			if (mediaAttachments.length >= maxMediaAttachments) break;

			try {
				const attachment = await onMediaUpload(file);
				mediaAttachments = [...mediaAttachments, attachment];
				scheduleDraftSave();
			} catch (error) {
				console.error('Failed to upload media:', error);
			}
		}

		// Reset input
		input.value = '';
	}

	// Remove media attachment
	function handleMediaRemove(id: string) {
		mediaAttachments = mediaAttachments.filter((attachment) => attachment.id !== id);
		onMediaRemove?.(id);
		scheduleDraftSave();
	}

	// Handle poll changes
	function handlePollChange(newPoll: ComposePoll | undefined) {
		poll = newPoll;
		scheduleDraftSave();
	}

	// Schedule draft save
	function scheduleDraftSave() {
		if (autoSaveTimer) {
			clearTimeout(autoSaveTimer);
		}

		autoSaveTimer = setTimeout(() => {
			saveDraft();
		}, 1000);
	}

	// Save draft to localStorage
	function saveDraft() {
		try {
			localStorage.setItem(draftKey, JSON.stringify(draftData));
			onDraftSave?.(draftData);
		} catch (error) {
			console.warn('Failed to save draft:', error);
		}
	}

	// Load draft from localStorage
	function loadDraft() {
		try {
			const saved = localStorage.getItem(draftKey);
			if (saved) {
				const draft: ComposeBoxDraft = JSON.parse(saved);

				// Only load if it's recent (within 24 hours)
				const age = Date.now() - draft.timestamp;
				if (age < 24 * 60 * 60 * 1000) {
					content = draft.content || '';
					contentWarning = draft.contentWarning || '';
					hasContentWarning = draft.hasContentWarning || false;
					visibility = draft.visibility || defaultVisibility;
					mediaAttachments = draft.mediaAttachments || [];
					poll = draft.poll;
				}
			}
		} catch (error) {
			console.warn('Failed to load draft:', error);
		}
	}

	// Clear draft
	function clearDraft() {
		try {
			localStorage.removeItem(draftKey);
		} catch (error) {
			console.warn('Failed to clear draft:', error);
		}
	}

	// Handle submit
	async function handleSubmit() {
		if (!canSubmit || !onSubmit) return;

		isSubmitting = true;

		try {
			await onSubmit(draftData);

			// Clear form on successful submit
			content = '';
			contentWarning = '';
			hasContentWarning = false;
			mediaAttachments = [];
			poll = undefined;
			clearDraft();
		} catch (error) {
			console.error('Failed to submit:', error);
		} finally {
			isSubmitting = false;
		}
	}

	// Handle cancel
	function handleCancel() {
		if (onCancel) {
			onCancel();
		} else {
			// Default cancel behavior - clear form
			content = '';
			contentWarning = '';
			hasContentWarning = false;
			mediaAttachments = [];
			poll = undefined;
			clearDraft();
		}
	}

	// Handle focus events
	function handleFocus() {
		focused = true;
		showCharacterCount = true;
	}

	function handleBlur() {
		focused = false;
		if (!content && !hasContentWarning) {
			showCharacterCount = false;
		}
	}

	// Mount effects
	onMount(() => {
		// Load saved draft
		if (!initialContent) {
			loadDraft();
		}

		// Auto-focus if requested
		if (autoFocus && textareaElement) {
			textareaElement.focus();
		}
	});

	onDestroy(() => {
		if (autoSaveTimer) {
			clearTimeout(autoSaveTimer);
		}
	});
</script>

<div
	bind:this={containerElement}
	class={`gr-compose-box ${className}`}
	class:gr-compose-box--focused={focused}
	class:gr-compose-box--disabled={disabled}
	{...restProps}
>
	{#if replyToStatus}
		<div class="gr-compose-box__reply-context">
			<span class="gr-compose-box__reply-label">
				Replying to @{replyToStatus.account.acct}
			</span>
		</div>
	{/if}

	{#if hasContentWarning}
		<div class="gr-compose-box__content-warning">
			<TextField
				id={cwId}
				bind:value={contentWarning}
				placeholder={cwPlaceholder}
				class="gr-compose-box__cw-input"
				{disabled}
				aria-describedby={cwCharCountId}
				aria-label="Content warning"
				oninput={handleCwInput}
				onkeydown={handleKeydown}
				onfocus={handleFocus}
				onblur={handleBlur}
			/>
			<div
				id={cwCharCountId}
				class="gr-compose-box__char-count"
				class:gr-compose-box__char-count--error={cwLength > maxCwLength}
				aria-live="polite"
			>
				{cwLength}/{maxCwLength}
			</div>
		</div>
	{/if}

	<div class="gr-compose-box__content">
		<div class="gr-compose-box__textarea gr-autosize-textarea" data-gr-value={`${content}\n`}>
			<textarea
				bind:this={textareaElement}
				id={textareaId}
				bind:value={content}
				{placeholder}
				{disabled}
				aria-describedby={showCharacterCount ? charCountId : undefined}
				aria-label={replyToStatus
					? `Reply to ${replyToStatus.account.displayName}`
					: 'Compose new post'}
				oninput={handleInput}
				onkeydown={handleKeydown}
				onfocus={handleFocus}
				onblur={handleBlur}
			></textarea>
		</div>

		{#if showCharacterCount || isAtSoftLimit}
			<div
				id={charCountId}
				class="gr-compose-box__char-count"
				class:gr-compose-box__char-count--warning={characterCountTone === 'warning'}
				class:gr-compose-box__char-count--error={characterCountTone === 'error'}
				aria-live="polite"
				aria-atomic="true"
			>
				{contentLength}{characterCountMode === 'hard' ? `/${maxLength}` : ''}
			</div>
		{/if}
	</div>

	{#if mediaSlot && mediaAttachments.length > 0}
		<div class="gr-compose-box__media">
			{@render mediaSlot({
				attachments: mediaAttachments,
				onRemove: handleMediaRemove,
				onDescriptionEdit: (id, description) => {
					// `findIndex` narrows index to `>= 0` when matched, but
					// `mediaAttachments[index]` is still typed
					// `T | undefined` under `noUncheckedIndexedAccess`.
					// Use `find` instead and mutate via the object reference.
					const attachment = mediaAttachments.find((a) => a.id === id);
					if (attachment) {
						attachment.description = description;
						scheduleDraftSave();
					}
				},
				disabled,
			})}
		</div>
	{/if}

	{#if pollSlot && poll}
		<div class="gr-compose-box__poll">
			{@render pollSlot({
				poll,
				onPollChange: handlePollChange,
				disabled,
			})}
		</div>
	{/if}

	<div class="gr-compose-box__actions">
		<div class="gr-compose-box__attachments">
			{#if onMediaUpload && mediaAttachments.length < maxMediaAttachments}
				<label class="gr-compose-box__media-button">
					<input
						type="file"
						multiple
						accept={supportedMediaTypes.join(',')}
						class="sr-only"
						{disabled}
						onchange={handleMediaAdd}
					/>
					<Button variant="ghost" size="sm" {disabled} aria-label="Add media">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
							<circle cx="8.5" cy="8.5" r="1.5" />
							<polyline points="21,15 16,10 5,21" />
						</svg>
					</Button>
				</label>
			{/if}

			{#if enablePolls && pollSlot}
				<Button
					variant="ghost"
					size="sm"
					disabled={disabled || mediaAttachments.length > 0}
					onclick={() =>
						handlePollChange(
							poll ? undefined : { options: ['', ''], expiresIn: 86400, multiple: false }
						)}
					aria-label={poll ? 'Remove poll' : 'Add poll'}
					aria-pressed={!!poll}
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<line x1="18" y1="20" x2="18" y2="10" />
						<line x1="12" y1="20" x2="12" y2="4" />
						<line x1="6" y1="20" x2="6" y2="14" />
					</svg>
				</Button>
			{/if}

			{#if enableContentWarnings}
				<Button
					variant="ghost"
					size="sm"
					{disabled}
					onclick={toggleContentWarning}
					aria-label={hasContentWarning ? 'Remove content warning' : 'Add content warning'}
					aria-pressed={hasContentWarning}
				>
					CW
				</Button>
			{/if}

			{#if enableVisibilitySettings}
				<select
					class="gr-compose-box__visibility-select"
					bind:value={visibility}
					{disabled}
					aria-label="Post visibility"
				>
					<option value="public">Public</option>
					<option value="unlisted">Unlisted</option>
					<option value="private">Followers only</option>
					<option value="direct">Direct</option>
				</select>
			{/if}
		</div>

		<div class="gr-compose-box__submit-actions">
			{#if content || hasContentWarning || mediaAttachments.length > 0 || poll}
				<Button variant="ghost" size="sm" {disabled} onclick={handleCancel}>Cancel</Button>
			{/if}

			<Button
				variant="solid"
				size="sm"
				type="submit"
				disabled={!canSubmit}
				loading={isSubmitting}
				onclick={handleSubmit}
			>
				{replyToStatus ? 'Reply' : 'Post'}
			</Button>
		</div>
	</div>
</div>

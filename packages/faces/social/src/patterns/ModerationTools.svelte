<!--
  ModerationTools - Block, Mute, and Report Actions
  
  Provides moderation actions for ActivityPub content and accounts.
  Includes block, mute, report flows with confirmation dialogs.
  
  @component
  @example
  ```svelte
  <ModerationTools
    targetType="account"
    targetId={account.id}
    {config}
    {handlers}
  />
  ```
-->
<script lang="ts">
	import { type Snippet } from 'svelte';
	import { createMenu, createModal } from '@equaltoai/greater-components-headless';
	import type { ActivityPubActor, GenericStatus } from '../generics/index.js';

	export type ModerationType = 'block' | 'mute' | 'report' | 'hide' | 'addNote';
	export type ModerationTarget = 'account' | 'status' | 'domain';

	interface ModerationAction {
		type: ModerationType;
		label: string;
		description: string;
		icon: string;
		requiresConfirmation: boolean;
		severity: 'low' | 'medium' | 'high';
	}

	interface ModerationConfig {
		/**
		 * Available actions
		 */
		actions?: ModerationType[];

		/**
		 * Display mode
		 */
		mode?: 'menu' | 'buttons' | 'inline';

		/**
		 * Show icons
		 */
		showIcons?: boolean;

		/**
		 * Show descriptions in confirmations
		 */
		showDescriptions?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;

		/**
		 * Require confirmation for all actions
		 */
		alwaysConfirm?: boolean;
	}

	interface ModerationHandlers {
		/**
		 * Block an account or domain
		 */
		onBlock?: (targetType: ModerationTarget, targetId: string, reason?: string) => Promise<void>;

		/**
		 * Mute an account
		 */
		onMute?: (targetId: string, duration?: number) => Promise<void>;

		/**
		 * Report content or account
		 */
		onReport?: (
			targetType: ModerationTarget,
			targetId: string,
			reason: string,
			statusIds?: string[]
		) => Promise<void>;

		/**
		 * Hide a status
		 */
		onHide?: (statusId: string) => Promise<void>;

		/**
		 * Add a community note (Lesser-specific)
		 */
		onAddNote?: (objectId: string, content: string) => Promise<void>;
	}

	interface Props {
		/**
		 * Type of target
		 */
		targetType: ModerationTarget;

		/**
		 * Target ID (account ID, status ID, or domain)
		 */
		targetId: string;

		/**
		 * Target account (for display)
		 */
		targetAccount?: ActivityPubActor;

		/**
		 * Target status (for display)
		 */
		targetStatus?: GenericStatus;

		/**
		 * Configuration
		 */
		config?: ModerationConfig;

		/**
		 * Event handlers
		 */
		handlers?: ModerationHandlers;

		/**
		 * Custom action renderer
		 */
		renderAction?: Snippet<[ModerationAction]>;

		/**
		 * Disabled state
		 */
		disabled?: boolean;
	}

	let {
		targetType,
		targetId,
		targetAccount,
		targetStatus,
		config = {},
		handlers: _handlers = {},
		renderAction,
		disabled = false,
	}: Props = $props();

	const handlers = $derived(_handlers);

	const {
		mode = 'menu',
		showIcons = true,
		showDescriptions = true,
		actions = ['report', 'block', 'mute'] as ModerationType[],
		alwaysConfirm = false,
		class: className = '',
	} = $derived(config);

	/**
	 * Moderation action definitions
	 */
	const moderationActions: Record<ModerationType, ModerationAction> = {
		mute: {
			type: 'mute',
			label: 'Mute',
			description: 'Hide posts from this account without blocking',
			icon: 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z',
			requiresConfirmation: false,
			severity: 'low',
		},
		block: {
			type: 'block',
			label: 'Block',
			description: 'Prevent this account from following or interacting with you',
			icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z',
			requiresConfirmation: true,
			severity: 'high',
		},
		report: {
			type: 'report',
			label: 'Report',
			description: 'Report this content to moderators',
			icon: 'M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM12 17.3c-.72 0-1.3-.58-1.3-1.3 0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3 0 .72-.58 1.3-1.3 1.3zm1-4.3h-2V7h2v6z',
			requiresConfirmation: true,
			severity: 'medium',
		},
		hide: {
			type: 'hide',
			label: 'Hide',
			description: 'Hide this post from your timeline',
			icon: 'M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z',
			requiresConfirmation: false,
			severity: 'low',
		},
		addNote: {
			type: 'addNote',
			label: 'Add Community Note',
			description: 'Contribute context or fact-checking to this post',
			icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',
			requiresConfirmation: false,
			severity: 'low',
		},
	};

	const availableActions = $derived(actions.map((action) => moderationActions[action]));

	/**
	 * State for confirmation dialogs
	 */
	let activeAction = $state<ModerationType | null>(null);
	let reportReason = $state('');
	let muteDuration = $state<number | undefined>(undefined);
	let noteContent = $state('');
	let loading = $state(false);

	/**
	 * Modals
	 */
	const confirmModal = createModal({
		closeOnEscape: true,
		closeOnBackdrop: true,
	});

	const reportModal = createModal({
		closeOnEscape: true,
		closeOnBackdrop: false,
	});

	const noteModal = createModal({
		closeOnEscape: true,
		closeOnBackdrop: false,
	});

	/**
	 * Menu for dropdown mode
	 */
	const menu = createMenu({
		closeOnSelect: true,
		onSelect: (value: unknown) => initiateAction(value as ModerationType),
	});

	/**
	 * Initiate a moderation action
	 */
	function initiateAction(action: ModerationType) {
		if (disabled || loading) return;

		activeAction = action;

		const actionDef = moderationActions[action];

		// Show confirmation if required
		if (actionDef.requiresConfirmation || alwaysConfirm) {
			if (action === 'report') {
				reportModal.helpers.open();
			} else if (action === 'addNote') {
				noteModal.helpers.open();
			} else {
				confirmModal.helpers.open();
			}
		} else {
			executeAction(action);
		}
	}

	/**
	 * Execute the moderation action
	 */
	async function executeAction(action: ModerationType) {
		if (!activeAction || loading) return;

		loading = true;

		try {
			switch (action) {
				case 'block':
					await handlers.onBlock?.(targetType, targetId);
					break;

				case 'mute':
					await handlers.onMute?.(targetId, muteDuration);
					break;

				case 'report':
					await handlers.onReport?.(
						targetType,
						targetId,
						reportReason,
						targetStatus ? [targetStatus.id] : undefined
					);
					break;

				case 'hide':
					if (targetType === 'status') {
						await handlers.onHide?.(targetId);
					}
					break;

				case 'addNote':
					if (targetType === 'status' && noteContent.trim()) {
						await handlers.onAddNote?.(targetId, noteContent.trim());
					}
					break;
			}

			// Close modals
			confirmModal.helpers.close();
			reportModal.helpers.close();
			noteModal.helpers.close();

			// Reset state
			activeAction = null;
			reportReason = '';
			muteDuration = undefined;
			noteContent = '';
		} catch (error) {
			console.error('Moderation action failed:', error);
		} finally {
			loading = false;
		}
	}

	/**
	 * Get target display name
	 */
	function getTargetName(): string {
		if (targetAccount?.name) return targetAccount.name;
		if (targetAccount?.preferredUsername) return `@${targetAccount.preferredUsername}`;
		return targetId;
	}
</script>

<div class={`moderation-tools moderation-tools--${mode} ${className}`}>
	{#if mode === 'menu'}
		<!-- Dropdown menu mode -->
		<button
			use:menu.actions.trigger
			class="moderation-tools__trigger"
			type="button"
			{disabled}
			aria-label="Moderation actions"
		>
			<svg class="moderation-tools__trigger-icon" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
				/>
			</svg>
		</button>

		{#if menu.state.open}
			<div use:menu.actions.menu class="moderation-tools__menu">
				{#each availableActions as action (action.type)}
					<button
						use:menu.actions.item={action.type}
						class={`moderation-tools__action moderation-tools__action--${action.severity}`}
						type="button"
					>
						{#if renderAction}
							{@render renderAction(action)}
						{:else}
							{#if showIcons}
								<svg class="moderation-tools__action-icon" viewBox="0 0 24 24" fill="currentColor">
									<path d={action.icon} />
								</svg>
							{/if}

							<span class="moderation-tools__action-label">{action.label}</span>
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	{:else if mode === 'buttons'}
		<!-- Button group mode -->
		<div class="moderation-tools__buttons">
			{#each availableActions as action (action.type)}
				<button
					class={`moderation-tools__button moderation-tools__button--${action.severity}`}
					type="button"
					onclick={() => initiateAction(action.type)}
					{disabled}
				>
					{#if renderAction}
						{@render renderAction(action)}
					{:else}
						{#if showIcons}
							<svg class="moderation-tools__button-icon" viewBox="0 0 24 24" fill="currentColor">
								<path d={action.icon} />
							</svg>
						{/if}

						<span class="moderation-tools__button-label">{action.label}</span>
					{/if}
				</button>
			{/each}
		</div>
	{:else}
		<!-- Inline mode -->
		<div class="moderation-tools__inline">
			{#each availableActions as action (action.type)}
				<button
					class="moderation-tools__inline-button"
					type="button"
					onclick={() => initiateAction(action.type)}
					title={action.description}
					aria-label={action.label}
					{disabled}
				>
					<svg class="moderation-tools__inline-icon" viewBox="0 0 24 24" fill="currentColor">
						<path d={action.icon} />
					</svg>
				</button>
			{/each}
		</div>
	{/if}

	<!-- Confirmation Modal -->
	{#if confirmModal.state.open && activeAction && activeAction !== 'report'}
		{@const action = moderationActions[activeAction]}
		<div use:confirmModal.actions.backdrop class="moderation-tools__backdrop">
			<div use:confirmModal.actions.content class="moderation-tools__modal">
				<div class="moderation-tools__modal-header">
					<h3 class="moderation-tools__modal-title">
						{action.label}
						{getTargetName()}?
					</h3>
					<button
						use:confirmModal.actions.close
						class="moderation-tools__modal-close"
						type="button"
						aria-label="Close"
					>
						×
					</button>
				</div>

				<div class="moderation-tools__modal-body">
					{#if showDescriptions}
						<p>{action.description}</p>
					{/if}

					{#if activeAction === 'mute'}
						<label class="moderation-tools__input-label">
							Mute duration (optional):
							<select bind:value={muteDuration} class="moderation-tools__select">
								<option value={undefined}>Indefinite</option>
								<option value={3600}>1 hour</option>
								<option value={86400}>1 day</option>
								<option value={604800}>1 week</option>
								<option value={2592000}>30 days</option>
							</select>
						</label>
					{/if}
				</div>

				<div class="moderation-tools__modal-footer">
					<button
						class="moderation-tools__modal-button moderation-tools__modal-button--cancel"
						type="button"
						onclick={() => confirmModal.helpers.close()}
						disabled={loading}
					>
						Cancel
					</button>
					<button
						class={`moderation-tools__modal-button moderation-tools__modal-button--confirm moderation-tools__modal-button--${action.severity}`}
						type="button"
						onclick={() => executeAction(activeAction!)}
						disabled={loading}
					>
						{loading ? 'Processing...' : `${action.label}`}
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Report Modal -->
	{#if reportModal.state.open}
		<div use:reportModal.actions.backdrop class="moderation-tools__backdrop">
			<div use:reportModal.actions.content class="moderation-tools__modal">
				<div class="moderation-tools__modal-header">
					<h3 class="moderation-tools__modal-title">
						Report {getTargetName()}
					</h3>
					<button
						use:reportModal.actions.close
						class="moderation-tools__modal-close"
						type="button"
						aria-label="Close"
					>
						×
					</button>
				</div>

				<div class="moderation-tools__modal-body">
					<p>Please provide a reason for this report:</p>

					<textarea
						bind:value={reportReason}
						class="moderation-tools__textarea"
						placeholder="Describe the issue..."
						rows="4"
						required
					></textarea>
				</div>

				<div class="moderation-tools__modal-footer">
					<button
						class="moderation-tools__modal-button moderation-tools__modal-button--cancel"
						type="button"
						onclick={() => reportModal.helpers.close()}
						disabled={loading}
					>
						Cancel
					</button>
					<button
						class="moderation-tools__modal-button moderation-tools__modal-button--confirm moderation-tools__modal-button--medium"
						type="button"
						onclick={() => executeAction('report')}
						disabled={loading || !reportReason.trim()}
					>
						{loading ? 'Submitting...' : 'Submit Report'}
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Community Note Modal (Lesser-specific) -->
	{#if noteModal.state.open}
		<div use:noteModal.actions.backdrop class="moderation-tools__backdrop">
			<div use:noteModal.actions.content class="moderation-tools__modal">
				<div class="moderation-tools__modal-header">
					<h3 class="moderation-tools__modal-title">Add Community Note</h3>
					<button
						use:noteModal.actions.close
						class="moderation-tools__modal-close"
						type="button"
						aria-label="Close"
					>
						×
					</button>
				</div>

				<div class="moderation-tools__modal-body">
					<p>Provide context or fact-checking information for this post:</p>

					<textarea
						bind:value={noteContent}
						class="moderation-tools__textarea"
						placeholder="Add helpful context or corrections..."
						rows="6"
						required
					></textarea>

					<p class="moderation-tools__note-hint">
						Your note will be visible to all users and can be voted on by the community.
					</p>
				</div>

				<div class="moderation-tools__modal-footer">
					<button
						class="moderation-tools__modal-button moderation-tools__modal-button--cancel"
						type="button"
						onclick={() => noteModal.helpers.close()}
						disabled={loading}
					>
						Cancel
					</button>
					<button
						class="moderation-tools__modal-button moderation-tools__modal-button--confirm"
						type="button"
						onclick={() => executeAction('addNote')}
						disabled={loading || !noteContent.trim()}
					>
						{loading ? 'Adding...' : 'Add Note'}
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Trigger (menu mode) */
	.moderation-tools__trigger {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		background: transparent;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
		color: var(--text-secondary, #536471);
		transition: all 0.2s;
	}

	.moderation-tools__trigger:hover:not(:disabled) {
		background: var(--bg-hover, #eff3f4);
		color: var(--text-primary, #0f1419);
	}

	.moderation-tools__trigger:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.moderation-tools__trigger-icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	/* Menu */
	.moderation-tools__menu {
		position: absolute;
		right: 0;
		margin-top: 0.5rem;
		min-width: 200px;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		z-index: 1000;
	}

	.moderation-tools__action {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.75rem 1rem;
		background: transparent;
		border: none;
		cursor: pointer;
		text-align: left;
		transition: background-color 0.2s;
	}

	.moderation-tools__action:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.moderation-tools__action--high:hover {
		background: rgba(244, 33, 46, 0.1);
		color: #f4211e;
	}

	.moderation-tools__action-icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	.moderation-tools__action-label {
		font-size: 0.875rem;
		font-weight: 500;
	}

	/* Buttons mode */
	.moderation-tools__buttons {
		display: flex;
		gap: 0.5rem;
	}

	.moderation-tools__button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.375rem;
		cursor: pointer;
		font-size: 0.875rem;
		transition: all 0.2s;
	}

	.moderation-tools__button:hover:not(:disabled) {
		background: var(--bg-hover, #eff3f4);
	}

	.moderation-tools__button--high:hover:not(:disabled) {
		background: #f4211e;
		color: white;
	}

	/* Inline mode */
	.moderation-tools__inline {
		display: flex;
		gap: 0.25rem;
	}

	.moderation-tools__inline-button {
		display: flex;
		padding: 0.375rem;
		background: transparent;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		color: var(--text-secondary, #536471);
		transition: all 0.2s;
	}

	.moderation-tools__inline-button:hover:not(:disabled) {
		background: var(--bg-hover, #eff3f4);
	}

	.moderation-tools__inline-icon {
		width: 1rem;
		height: 1rem;
	}

	/* Modals */
	.moderation-tools__backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}

	.moderation-tools__modal {
		background: var(--bg-primary, #ffffff);
		border-radius: 0.75rem;
		width: 90%;
		max-width: 500px;
		max-height: 90vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.moderation-tools__modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem;
		border-bottom: 1px solid var(--border-color, #e1e8ed);
	}

	.moderation-tools__modal-title {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0;
	}

	.moderation-tools__modal-close {
		padding: 0.5rem;
		background: transparent;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: var(--text-secondary, #536471);
	}

	.moderation-tools__modal-body {
		padding: 1.5rem;
		overflow-y: auto;
	}

	.moderation-tools__input-label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 1rem;
		font-size: 0.875rem;
	}

	.moderation-tools__select,
	.moderation-tools__textarea {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.375rem;
		font-family: inherit;
		font-size: 0.875rem;
	}

	.moderation-tools__modal-footer {
		display: flex;
		gap: 0.75rem;
		padding: 1.5rem;
		border-top: 1px solid var(--border-color, #e1e8ed);
		justify-content: flex-end;
	}

	.moderation-tools__modal-button {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.5rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.moderation-tools__modal-button--cancel {
		background: var(--bg-secondary, #f7f9fa);
		color: var(--text-primary, #0f1419);
	}

	.moderation-tools__modal-button--confirm {
		background: var(--primary-color, #1d9bf0);
		color: white;
	}

	.moderation-tools__modal-button--high {
		background: #f4211e;
	}

	.moderation-tools__modal-button--medium {
		background: #ff9800;
	}

	.moderation-tools__modal-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.moderation-tools__note-hint {
		margin-top: 0.75rem;
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
		font-style: italic;
	}
</style>

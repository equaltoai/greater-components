<!--
  PollComposer - Create and Vote on Polls
  
  Provides full poll creation and voting functionality for ActivityPub.
  Supports single/multiple choice, vote hiding, expiration, and real-time results.
  
  @component
  @example
  ```svelte
  <PollComposer
    {mode}
    poll={existingPoll}
    {config}
    {handlers}
  />
  ```
-->
<script lang="ts">
	import { type Snippet } from 'svelte';
	import { createButton } from '@equaltoai/greater-components-headless/button';

	export interface PollOption {
		/**
		 * Option text
		 */
		title: string;

		/**
		 * Vote count
		 */
		votesCount?: number;

		/**
		 * Whether the current user voted for this option
		 */
		voted?: boolean;
	}

	export interface Poll {
		/**
		 * Poll ID
		 */
		id?: string;

		/**
		 * Poll options
		 */
		options: PollOption[];

		/**
		 * Expiration date
		 */
		expiresAt?: Date | string;

		/**
		 * Whether poll has expired
		 */
		expired?: boolean;

		/**
		 * Allow multiple choices
		 */
		multiple?: boolean;

		/**
		 * Total vote count
		 */
		votesCount?: number;

		/**
		 * Total voters count (unique)
		 */
		votersCount?: number;

		/**
		 * Whether current user has voted
		 */
		voted?: boolean;

		/**
		 * Own votes (indices of voted options)
		 */
		ownVotes?: number[];

		/**
		 * Hide vote counts until after voting
		 */
		hideResultsUntilVoted?: boolean;
	}

	interface PollComposerConfig {
		/**
		 * Minimum options
		 */
		minOptions?: number;

		/**
		 * Maximum options
		 */
		maxOptions?: number;

		/**
		 * Maximum option length in characters
		 */
		maxOptionLength?: number;

		/**
		 * Default expiration options in seconds
		 */
		expirationOptions?: Array<{ label: string; seconds: number }>;

		/**
		 * Show character counts for options
		 */
		showCharacterCount?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;

		/**
		 * Show vote percentages
		 */
		showPercentages?: boolean;

		/**
		 * Animate vote bars
		 */
		animateResults?: boolean;
	}

	interface PollComposerHandlers {
		/**
		 * Called when poll is submitted (creation mode)
		 */
		onSubmit?: (poll: {
			options: string[];
			expiresIn: number;
			multiple: boolean;
			hideTotals: boolean;
		}) => Promise<void>;

		/**
		 * Called when user votes (voting mode)
		 */
		onVote?: (selectedIndices: number[]) => Promise<void>;

		/**
		 * Called when poll is refreshed
		 */
		onRefresh?: () => Promise<void>;
	}

	interface Props {
		/**
		 * Mode: create or vote
		 */
		mode: 'create' | 'vote';

		/**
		 * Existing poll (for voting mode)
		 */
		poll?: Poll;

		/**
		 * Configuration
		 */
		config?: PollComposerConfig;

		/**
		 * Event handlers
		 */
		handlers?: PollComposerHandlers;

		/**
		 * Custom option renderer (voting mode)
		 */
		renderOption?: Snippet<[PollOption, number, boolean]>;
	}

	let { mode, poll, config = {}, handlers = {}, renderOption }: Props = $props();

	const {
		maxOptions = 4,
		minOptions = 2,
		maxOptionLength = 50,
		expirationOptions = [
			{ label: '5 minutes', seconds: 300 },
			{ label: '30 minutes', seconds: 1800 },
			{ label: '1 hour', seconds: 3600 },
			{ label: '6 hours', seconds: 21600 },
			{ label: '1 day', seconds: 86400 },
			{ label: '3 days', seconds: 259200 },
			{ label: '7 days', seconds: 604800 },
		],
		showCharacterCount = true,
		class: className = '',
		showPercentages = true,
		animateResults = true,
	} = $derived(config);

	// Create mode state
	type DraftPollOption = {
		id: string;
		value: string;
	};

	let optionCounter = 0;

	function createOption(value = ''): DraftPollOption {
		optionCounter += 1;
		return {
			id: `poll-option-${optionCounter}`,
			value,
		};
	}

	let options = $state<DraftPollOption[]>([createOption(), createOption()]);
	let expiresIn = $state(86400); // Default 1 day
	let multiple = $state(false);
	let hideTotals = $state(false);

	// Vote mode state
	let selectedIndices = $state<number[]>([]);
	let submitting = $state(false);
	let error = $state<string | null>(null);

	// Buttons
	const submitButton = createButton({
		onClick: () => handleSubmit(),
	});

	const voteButton = createButton({
		onClick: () => handleVote(),
	});

	/**
	 * Add option
	 */
	function addOption() {
		if (options.length < maxOptions) {
			options = [...options, createOption()];
		}
	}

	/**
	 * Remove option
	 */
	function removeOption(optionId: string) {
		if (options.length > minOptions) {
			options = options.filter((option) => option.id !== optionId);
		}
	}

	/**
	 * Update option text
	 */
	function updateOption(optionId: string, value: string) {
		if (value.length > maxOptionLength) return;
		options = options.map((option) => (option.id === optionId ? { ...option, value } : option));
	}

	/**
	 * Toggle option selection (voting mode)
	 */
	function toggleOption(index: number) {
		if (poll?.expired || poll?.voted) return;

		if (poll?.multiple) {
			// Multiple choice
			if (selectedIndices.includes(index)) {
				selectedIndices = selectedIndices.filter((i) => i !== index);
			} else {
				selectedIndices = [...selectedIndices, index];
			}
		} else {
			// Single choice
			selectedIndices = [index];
		}
	}

	/**
	 * Handle submit (create mode)
	 */
	async function handleSubmit() {
		if (submitting) return;

		// Validate
		const filledOptions = options.map((opt) => opt.value.trim()).filter((opt) => opt.length > 0);
		if (filledOptions.length < minOptions) {
			error = `Please provide at least ${minOptions} options`;
			return;
		}

		submitting = true;
		error = null;

		try {
			await handlers.onSubmit?.({
				options: filledOptions,
				expiresIn,
				multiple,
				hideTotals,
			});

			// Reset form
			options = [createOption(), createOption()];
			multiple = false;
			hideTotals = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to create poll';
		} finally {
			submitting = false;
		}
	}

	/**
	 * Handle vote (voting mode)
	 */
	async function handleVote() {
		if (submitting || selectedIndices.length === 0) return;

		submitting = true;
		error = null;

		try {
			await handlers.onVote?.(selectedIndices);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to submit vote';
		} finally {
			submitting = false;
		}
	}

	/**
	 * Get vote percentage
	 */
	function getPercentage(option: PollOption): number {
		if (!poll || !poll.votersCount || poll.votersCount === 0) return 0;
		return ((option.votesCount || 0) / poll.votersCount) * 100;
	}

	/**
	 * Get time remaining
	 */
	function getTimeRemaining(): string | null {
		if (!poll?.expiresAt) return null;

		const expirationTime =
			typeof poll.expiresAt === 'string' ? new Date(poll.expiresAt) : poll.expiresAt;
		const now = new Date();
		const diff = expirationTime.getTime() - now.getTime();

		if (diff <= 0) return 'Expired';

		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
		if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
		if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} left`;
		return `${seconds} second${seconds !== 1 ? 's' : ''} left`;
	}

	/**
	 * Check if results should be hidden
	 */
	const resultsHidden = $derived(poll?.hideResultsUntilVoted && !poll.voted && !poll.expired);
</script>

<div class={`poll-composer poll-composer--${mode} ${className}`}>
	{#if mode === 'create'}
		<!-- Create mode -->
		<div class="poll-composer__create">
			<div class="poll-composer__options">
				{#each options as option, index (option.id)}
					<div class="poll-composer__option-row">
						<input
							type="text"
							class="poll-composer__option-input"
							placeholder={`Option ${index + 1}`}
							value={option.value}
							oninput={(e) => updateOption(option.id, e.currentTarget.value)}
							maxlength={maxOptionLength}
							aria-label={`Poll option ${index + 1}`}
						/>

						{#if showCharacterCount}
							<span
								class="poll-composer__char-count"
								class:poll-composer__char-count--warn={option.value.length > maxOptionLength * 0.9}
							>
								{option.value.length}/{maxOptionLength}
							</span>
						{/if}

						{#if options.length > minOptions}
							<button
								class="poll-composer__remove-btn"
								onclick={() => removeOption(option.id)}
								aria-label={`Remove option ${index + 1}`}
							>
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
									/>
								</svg>
							</button>
						{/if}
					</div>
				{/each}
			</div>

			{#if options.length < maxOptions}
				<button class="poll-composer__add-option" onclick={addOption}>
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
					</svg>
					Add option ({options.length}/{maxOptions})
				</button>
			{/if}

			<div class="poll-composer__settings">
				<div class="poll-composer__setting">
					<label for="poll-expiration">Poll length</label>
					<select id="poll-expiration" bind:value={expiresIn} class="poll-composer__select">
						{#each expirationOptions as expiration (expiration.seconds)}
							<option value={expiration.seconds}>{expiration.label}</option>
						{/each}
					</select>
				</div>

				<label class="poll-composer__checkbox">
					<input type="checkbox" bind:checked={multiple} />
					<span>Multiple choice</span>
				</label>

				<label class="poll-composer__checkbox">
					<input type="checkbox" bind:checked={hideTotals} />
					<span>Hide vote counts until poll ends</span>
				</label>
			</div>

			{#if error}
				<div class="poll-composer__error">{error}</div>
			{/if}

			<button
				use:submitButton.actions.button
				class="poll-composer__submit"
				disabled={options.map((opt) => opt.value.trim()).filter((value) => value.length > 0)
					.length < minOptions || submitting}
			>
				{#if submitting}
					<svg class="poll-composer__spinner" viewBox="0 0 24 24">
						<circle class="poll-composer__spinner-track" cx="12" cy="12" r="10" />
						<circle class="poll-composer__spinner-path" cx="12" cy="12" r="10" />
					</svg>
					Creating poll...
				{:else}
					Create poll
				{/if}
			</button>
		</div>
	{:else if poll}
		<!-- Vote mode -->
		<div class="poll-composer__vote">
			<div class="poll-composer__vote-options">
				{#each poll.options as option, index (option.title + '-' + index)}
					{#if poll.voted || poll.expired || resultsHidden}
						<!-- Show results -->
						<div class="poll-composer__result" class:poll-composer__result--voted={option.voted}>
							{#if renderOption}
								{@render renderOption(option, index, option.voted || false)}
							{:else}
								<div class="poll-composer__result-content">
									<span class="poll-composer__result-title">
										{option.title}
										{#if option.voted}
											<svg
												class="poll-composer__check-icon"
												viewBox="0 0 24 24"
												fill="currentColor"
											>
												<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
											</svg>
										{/if}
									</span>

									{#if showPercentages && !resultsHidden}
										<span class="poll-composer__result-percentage">
											{getPercentage(option).toFixed(1)}%
										</span>
									{/if}
								</div>

									{#if !resultsHidden}
										{@const percent = Math.max(0, Math.min(100, getPercentage(option)))}
										<div
											class="poll-composer__result-bar"
											class:poll-composer__result-bar--animate={animateResults}
										>
											<svg
												class="poll-composer__result-bar-svg"
												viewBox="0 0 100 1"
												preserveAspectRatio="none"
												aria-hidden="true"
											>
												<rect
													class="poll-composer__result-bar-fill"
													x="0"
													y="0"
													width={percent}
													height="1"
												/>
											</svg>
										</div>
									{/if}
								{/if}
							</div>
					{:else}
						<!-- Show voting options -->
						<button
							class="poll-composer__vote-option"
							class:poll-composer__vote-option--selected={selectedIndices.includes(index)}
							onclick={() => toggleOption(index)}
						>
							<div class="poll-composer__vote-radio">
								{#if poll.multiple}
									<!-- Checkbox for multiple choice -->
									{#if selectedIndices.includes(index)}
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path
												d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
											/>
										</svg>
									{:else}
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path
												d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
											/>
										</svg>
									{/if}
								{:else}
									<!-- Radio for single choice -->
									{#if selectedIndices.includes(index)}
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path
												d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
											/>
											<circle cx="12" cy="12" r="5" />
										</svg>
									{:else}
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path
												d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
											/>
										</svg>
									{/if}
								{/if}
							</div>

							<span class="poll-composer__vote-option-text">{option.title}</span>
						</button>
					{/if}
				{/each}
			</div>

			<div class="poll-composer__meta">
				<div class="poll-composer__vote-stats">
					{#if !resultsHidden}
						<span>{poll.votersCount || 0} {poll.votersCount === 1 ? 'vote' : 'votes'}</span>
					{/if}
					{#if getTimeRemaining()}
						<span>•</span>
						<span class:poll-composer__expired={poll.expired}>{getTimeRemaining()}</span>
					{/if}
				</div>

				{#if !poll.voted && !poll.expired}
					<button
						use:voteButton.actions.button
						class="poll-composer__vote-submit"
						disabled={selectedIndices.length === 0 || submitting}
					>
						{#if submitting}
							<svg class="poll-composer__spinner" viewBox="0 0 24 24">
								<circle class="poll-composer__spinner-track" cx="12" cy="12" r="10" />
								<circle class="poll-composer__spinner-path" cx="12" cy="12" r="10" />
							</svg>
							Voting...
						{:else}
							Vote
						{/if}
					</button>
				{:else if !poll.expired}
					<button
						class="poll-composer__refresh"
						onclick={() => handlers.onRefresh?.()}
						aria-label="Refresh poll results"
					>
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
							/>
						</svg>
					</button>
				{/if}
			</div>

			{#if error}
				<div class="poll-composer__error">{error}</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.poll-composer {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
	}

	/* Create mode */
	.poll-composer__create {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.poll-composer__options {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.poll-composer__option-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.poll-composer__option-input {
		flex: 1;
		padding: 0.75rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.25rem;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
		transition: border-color 0.2s;
	}

	.poll-composer__option-input:focus {
		outline: none;
		border-color: var(--primary-color, #1d9bf0);
	}

	.poll-composer__char-count {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
		white-space: nowrap;
	}

	.poll-composer__char-count--warn {
		color: var(--warning-color, #ff9800);
	}

	.poll-composer__remove-btn {
		padding: 0.5rem;
		background: transparent;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		color: var(--text-secondary, #536471);
		transition: all 0.2s;
	}

	.poll-composer__remove-btn:hover {
		background: rgba(244, 33, 46, 0.1);
		color: #f4211e;
	}

	.poll-composer__remove-btn svg {
		width: 1.25rem;
		height: 1.25rem;
		display: block;
	}

	.poll-composer__add-option {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: transparent;
		border: 1px dashed var(--border-color, #e1e8ed);
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--primary-color, #1d9bf0);
		transition: all 0.2s;
	}

	.poll-composer__add-option:hover {
		background: var(--bg-hover, #eff3f4);
		border-style: solid;
	}

	.poll-composer__add-option svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	.poll-composer__settings {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 0.25rem;
	}

	.poll-composer__setting {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.poll-composer__setting label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.poll-composer__select {
		padding: 0.5rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.25rem;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
		background: var(--bg-primary, #ffffff);
		cursor: pointer;
	}

	.poll-composer__checkbox {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
		cursor: pointer;
	}

	.poll-composer__checkbox input {
		cursor: pointer;
	}

	/* Vote mode */
	.poll-composer__vote {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.poll-composer__vote-options {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.poll-composer__vote-option {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: transparent;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.25rem;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s;
	}

	.poll-composer__vote-option:hover {
		background: var(--bg-hover, #eff3f4);
		border-color: var(--primary-color, #1d9bf0);
	}

	.poll-composer__vote-option--selected {
		background: var(--bg-selected, #e8f5fe);
		border-color: var(--primary-color, #1d9bf0);
	}

	.poll-composer__vote-radio {
		flex-shrink: 0;
		color: var(--primary-color, #1d9bf0);
	}

	.poll-composer__vote-radio svg {
		width: 1.5rem;
		height: 1.5rem;
		display: block;
	}

	.poll-composer__vote-option-text {
		flex: 1;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
	}

	.poll-composer__result {
		position: relative;
		padding: 0.75rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.25rem;
		overflow: hidden;
	}

	.poll-composer__result--voted {
		border-color: var(--primary-color, #1d9bf0);
		background: var(--bg-selected, #e8f5fe);
	}

	.poll-composer__result-content {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		z-index: 1;
	}

	.poll-composer__result-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.poll-composer__check-icon {
		width: 1rem;
		height: 1rem;
		color: var(--primary-color, #1d9bf0);
	}

	.poll-composer__result-percentage {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.poll-composer__result-bar {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		z-index: 0;
	}

	.poll-composer__result-bar-svg {
		width: 100%;
		height: 100%;
		display: block;
	}

	.poll-composer__result-bar-fill {
		fill: var(--primary-color-light, rgba(29, 155, 240, 0.1));
		transform-box: fill-box;
		transform-origin: left center;
	}

	.poll-composer__result-bar--animate {
		animation: none;
	}

	.poll-composer__result-bar--animate .poll-composer__result-bar-fill {
		animation: growBarScale 0.6s ease-out;
	}

	@keyframes growBarScale {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}

	.poll-composer__meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 0.5rem;
		border-top: 1px solid var(--border-color, #e1e8ed);
	}

	.poll-composer__vote-stats {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
	}

	.poll-composer__expired {
		color: var(--danger-color, #f4211e);
		font-weight: 600;
	}

	.poll-composer__vote-submit,
	.poll-composer__submit {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: var(--primary-color, #1d9bf0);
		border: none;
		border-radius: 9999px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 700;
		color: white;
		transition: background-color 0.2s;
	}

	.poll-composer__vote-submit:hover:not(:disabled),
	.poll-composer__submit:hover:not(:disabled) {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.poll-composer__vote-submit:disabled,
	.poll-composer__submit:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.poll-composer__refresh {
		padding: 0.5rem;
		background: transparent;
		border: none;
		border-radius: 50%;
		cursor: pointer;
		color: var(--text-secondary, #536471);
		transition: all 0.2s;
	}

	.poll-composer__refresh:hover {
		background: var(--bg-hover, #eff3f4);
		color: var(--primary-color, #1d9bf0);
	}

	.poll-composer__refresh svg {
		width: 1.25rem;
		height: 1.25rem;
		display: block;
	}

	.poll-composer__spinner {
		width: 1rem;
		height: 1rem;
		animation: spin 1s linear infinite;
	}

	.poll-composer__spinner-track {
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		opacity: 0.3;
	}

	.poll-composer__spinner-path {
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-dasharray: 60;
		stroke-dashoffset: 20;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.poll-composer__error {
		padding: 0.75rem;
		background: rgba(244, 33, 46, 0.1);
		border-radius: 0.25rem;
		font-size: 0.875rem;
		color: #f4211e;
	}
</style>

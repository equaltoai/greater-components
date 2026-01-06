<!--
Collaboration.Split - Revenue/credit split configuration

@component
-->

<script lang="ts">
	import { getCollaborationContext, canManage } from './context.js';

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const ctx = getCollaborationContext();
	const { collaboration, config } = ctx;

	// Permission check
	const userCanManage = $derived(canManage(ctx));

	// Local split state for editing
	let editingSplits = $state<Map<string, number>>(new Map());
	let isEditing = $state(false);

	// Initialize splits from members
	function initializeSplits() {
		const splits = new Map<string, number>();
		const equalSplit = Math.floor(100 / collaboration.members.length);
		let remainder = 100 - equalSplit * collaboration.members.length;

		collaboration.members.forEach((member, index) => {
			const extra = index === 0 ? remainder : 0;
			splits.set(member.artist.id, equalSplit + extra);
		});

		editingSplits = splits;
		isEditing = true;
	}

	// Calculate total
	const totalSplit = $derived(() => {
		let total = 0;
		editingSplits.forEach((value) => (total += value));
		return total;
	});

	// Check if valid
	const isValid = $derived(totalSplit() === 100);

	// Handle split change
	function handleSplitChange(artistId: string, value: number) {
		editingSplits.set(artistId, Math.max(0, Math.min(100, value)));
		editingSplits = new Map(editingSplits);
	}

	// Handle save
	function handleSave() {
		if (!isValid) return;
		// In real implementation, this would call a handler
		isEditing = false;
	}

	// Handle cancel
	function handleCancel() {
		editingSplits = new Map();
		isEditing = false;
	}
</script>

{#if config.showSplit}
	<div class={`collab-split ${className}`}>
		<div class="collab-split__header">
			<h3 class="collab-split__title">Revenue Split</h3>
			{#if userCanManage && !isEditing}
				<button type="button" class="collab-split__edit-btn" onclick={initializeSplits}>
					Configure Split
				</button>
			{/if}
		</div>

		{#if isEditing}
			<!-- Edit mode -->
			<div class="collab-split__editor">
				<p class="collab-split__instructions">
					Allocate percentages for each contributor. Total must equal 100%.
				</p>

				<div class="collab-split__allocations">
					{#each collaboration.members as member (member.artist.id)}
						{@const currentValue = editingSplits.get(member.artist.id) || 0}
						<div class="collab-split__allocation">
							<div class="collab-split__member">
								<img src={member.artist.avatar || ''} alt="" class="collab-split__avatar" />
								<span class="collab-split__name">{member.artist.name}</span>
							</div>
							<div class="collab-split__input-group">
								<input
									type="number"
									min="0"
									max="100"
									value={currentValue}
									oninput={(e) =>
										handleSplitChange(
											member.artist.id,
											parseInt((e.target as HTMLInputElement).value) || 0
										)}
									class="collab-split__input"
								/>
								<span class="collab-split__percent">%</span>
							</div>
							<div class="collab-split__bar">
								<svg
									class="collab-split__bar-svg"
									viewBox="0 0 100 8"
									preserveAspectRatio="none"
									aria-hidden="true"
								>
									<rect class="collab-split__bar-track" x="0" y="0" width="100" height="8" rx="4" />
									<rect
										class="collab-split__bar-fill"
										x="0"
										y="0"
										width={currentValue}
										height="8"
										rx="4"
									/>
								</svg>
							</div>
						</div>
					{/each}
				</div>

				<div class="collab-split__total" class:invalid={!isValid}>
					<span>Total:</span>
					<span class="collab-split__total-value">{totalSplit()}%</span>
					{#if !isValid}
						<span class="collab-split__error">Must equal 100%</span>
					{/if}
				</div>

				<div class="collab-split__actions">
					<button type="button" class="collab-split__cancel" onclick={handleCancel}>
						Cancel
					</button>
					<button type="button" class="collab-split__save" disabled={!isValid} onclick={handleSave}>
						Save Split Agreement
					</button>
				</div>
			</div>
		{:else if ctx.splitAgreement}
			<!-- View mode with existing agreement -->
			<div class="collab-split__agreement">
				<div class="collab-split__splits">
					{#each ctx.splitAgreement.splits as split (split.artistId)}
						<div class="collab-split__split-item">
							<span class="collab-split__split-name">{split.artistName}</span>
							<span class="collab-split__split-value">{split.percentage}%</span>
							{#if split.confirmed}
								<span class="collab-split__confirmed">✓ Confirmed</span>
							{:else}
								<span class="collab-split__pending">Pending</span>
							{/if}
						</div>
					{/each}
				</div>
				{#if ctx.splitAgreement.isConfirmed}
					<div class="collab-split__status collab-split__status--confirmed">
						All parties have confirmed this agreement
					</div>
				{:else}
					<div class="collab-split__status collab-split__status--pending">
						Awaiting confirmation from all parties
					</div>
				{/if}
			</div>
		{:else}
			<!-- No agreement yet -->
			<div class="collab-split__empty">
				<p>No split agreement configured yet.</p>
				{#if userCanManage}
					<p class="collab-split__hint">
						Configure how revenue will be split between contributors.
					</p>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style>
	.collab-split {
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radius-lg);
		padding: var(--gr-spacing-scale-5);
	}

	.collab-split__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.collab-split__title {
		font-size: var(--gr-font-size-lg);
		font-weight: var(--gr-font-weight-semibold);
		margin: 0;
	}

	.collab-split__edit-btn {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		background: var(--gr-color-primary-600);
		border: none;
		border-radius: var(--gr-radius-md);
		color: white;
		font-weight: var(--gr-font-weight-medium);
		cursor: pointer;
	}

	.collab-split__instructions {
		color: var(--gr-color-gray-400);
		margin: 0 0 var(--gr-spacing-scale-4) 0;
	}

	.collab-split__allocations {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-4);
	}

	.collab-split__allocation {
		display: grid;
		grid-template-columns: 1fr auto 100px;
		gap: var(--gr-spacing-scale-3);
		align-items: center;
	}

	.collab-split__member {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
	}

	.collab-split__avatar {
		width: 32px;
		height: 32px;
		border-radius: var(--gr-radius-full);
		object-fit: cover;
	}

	.collab-split__name {
		font-weight: var(--gr-font-weight-medium);
	}

	.collab-split__input-group {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
	}

	.collab-split__input {
		width: 60px;
		padding: var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-700);
		border: 1px solid var(--gr-color-gray-600);
		border-radius: var(--gr-radius-md);
		color: var(--gr-color-gray-100);
		text-align: center;
	}

	.collab-split__percent {
		color: var(--gr-color-gray-400);
	}

	.collab-split__bar {
		width: 100%;
	}

	.collab-split__bar-svg {
		display: block;
		width: 100%;
		height: 8px;
	}

	.collab-split__bar-track {
		fill: var(--gr-color-gray-700);
	}

	.collab-split__bar-fill {
		fill: var(--gr-color-primary-500);
	}

	.collab-split__total {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		margin-top: var(--gr-spacing-scale-4);
		padding-top: var(--gr-spacing-scale-4);
		border-top: 1px solid var(--gr-color-gray-700);
	}

	.collab-split__total-value {
		font-size: var(--gr-font-size-xl);
		font-weight: var(--gr-font-weight-bold);
	}

	.collab-split__total.invalid .collab-split__total-value {
		color: var(--gr-color-error-500);
	}

	.collab-split__error {
		color: var(--gr-color-error-500);
		font-size: var(--gr-font-size-sm);
	}

	.collab-split__actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--gr-spacing-scale-3);
		margin-top: var(--gr-spacing-scale-4);
	}

	.collab-split__cancel {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		background: var(--gr-color-gray-700);
		border: none;
		border-radius: var(--gr-radius-md);
		color: var(--gr-color-gray-100);
		cursor: pointer;
	}

	.collab-split__save {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		background: var(--gr-color-success-600);
		border: none;
		border-radius: var(--gr-radius-md);
		color: white;
		font-weight: var(--gr-font-weight-medium);
		cursor: pointer;
	}

	.collab-split__save:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.collab-split__splits {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-3);
	}

	.collab-split__split-item {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-3);
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radius-md);
	}

	.collab-split__split-name {
		flex: 1;
		font-weight: var(--gr-font-weight-medium);
	}

	.collab-split__split-value {
		font-size: var(--gr-font-size-lg);
		font-weight: var(--gr-font-weight-bold);
	}

	.collab-split__confirmed {
		color: var(--gr-color-success-500);
		font-size: var(--gr-font-size-sm);
	}

	.collab-split__pending {
		color: var(--gr-color-warning-500);
		font-size: var(--gr-font-size-sm);
	}

	.collab-split__status {
		margin-top: var(--gr-spacing-scale-4);
		padding: var(--gr-spacing-scale-3);
		border-radius: var(--gr-radius-md);
		text-align: center;
	}

	.collab-split__status--confirmed {
		background: var(--gr-color-success-900);
		color: var(--gr-color-success-300);
	}

	.collab-split__status--pending {
		background: var(--gr-color-warning-900);
		color: var(--gr-color-warning-300);
	}

	.collab-split__empty {
		text-align: center;
		color: var(--gr-color-gray-400);
		padding: var(--gr-spacing-scale-6);
	}

	.collab-split__empty p {
		margin: 0 0 var(--gr-spacing-scale-2) 0;
	}

	.collab-split__hint {
		font-size: var(--gr-font-size-sm);
	}

	@media (prefers-reduced-motion: reduce) {
		.collab-split__bar-fill {
			transition: none;
		}
	}
</style>

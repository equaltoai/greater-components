<!--
Collaboration.Project - Project overview display

@component
-->

<script lang="ts">
	import { getCollaborationContext, canManage, getStatusBadge } from './context.js';
	import type { CollaborationStatus } from '../../../types/community.js';

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const ctx = getCollaborationContext();
	const { collaboration, config, handlers } = ctx;

	// Permission check
	const userCanManage = $derived(canManage(ctx));

	// Status options for dropdown
	const statusOptions: CollaborationStatus[] = [
		'planning',
		'active',
		'paused',
		'completed',
		'cancelled',
	];

	// Handle status change
	async function handleStatusChange(event: Event) {
		const newStatus = (event.target as HTMLSelectElement).value as CollaborationStatus;
		await handlers.onStatusChange?.(collaboration, newStatus);
	}
</script>

{#if config.showProject}
	<div class={`collab-project ${className}`}>
		<div class="collab-project__header">
			<h3 class="collab-project__title">Project Overview</h3>
			{#if userCanManage}
				<select
					value={collaboration.status}
					onchange={handleStatusChange}
					class="collab-project__status-select"
				>
					{#each statusOptions as status (status)}
						{@const badge = getStatusBadge(status)}
						<option value={status}>{badge.label}</option>
					{/each}
				</select>
			{/if}
		</div>

		<div class="collab-project__content">
			<!-- Description -->
			<div class="collab-project__section">
				<h4>Description</h4>
				<p>{collaboration.description}</p>
			</div>

			<!-- Timeline -->
			{#if collaboration.deadline}
				<div class="collab-project__section">
					<h4>Timeline</h4>
					<div class="collab-project__timeline">
						<div class="collab-project__date">
							<span class="collab-project__date-label">Started</span>
							<span class="collab-project__date-value">
								{new Date(collaboration.createdAt).toLocaleDateString()}
							</span>
						</div>
						<div class="collab-project__timeline-line"></div>
						<div class="collab-project__date">
							<span class="collab-project__date-label">Deadline</span>
							<span class="collab-project__date-value">
								{new Date(collaboration.deadline).toLocaleDateString()}
							</span>
						</div>
					</div>
				</div>
			{/if}

			<!-- Recent Activity -->
			{#if collaboration.updates.length > 0}
				<div class="collab-project__section">
					<h4>Recent Activity</h4>
					<div class="collab-project__activity">
						{#each collaboration.updates.slice(0, 3) as update (update.id)}
							<div class="collab-project__update">
								<span class="collab-project__update-author">{update.authorName}</span>
								<p class="collab-project__update-content">{update.content}</p>
								<time class="collab-project__update-date">
									{new Date(update.createdAt).toLocaleDateString()}
								</time>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.collab-project {
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radius-lg);
		padding: var(--gr-spacing-scale-5);
	}

	.collab-project__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.collab-project__title {
		font-size: var(--gr-font-size-lg);
		font-weight: var(--gr-font-weight-semibold);
		margin: 0;
	}

	.collab-project__status-select {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border: 1px solid var(--gr-color-gray-600);
		border-radius: var(--gr-radius-md);
		color: var(--gr-color-gray-100);
	}

	.collab-project__content {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-5);
	}

	.collab-project__section h4 {
		font-size: var(--gr-font-size-sm);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-400);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 0 0 var(--gr-spacing-scale-3) 0;
	}

	.collab-project__section p {
		margin: 0;
		line-height: 1.6;
	}

	.collab-project__timeline {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-4);
	}

	.collab-project__date {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-1);
	}

	.collab-project__date-label {
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-400);
	}

	.collab-project__date-value {
		font-weight: var(--gr-font-weight-medium);
	}

	.collab-project__timeline-line {
		flex: 1;
		height: 2px;
		background: linear-gradient(to right, var(--gr-color-primary-500), var(--gr-color-gray-600));
	}

	.collab-project__activity {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-3);
	}

	.collab-project__update {
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radius-md);
	}

	.collab-project__update-author {
		font-weight: var(--gr-font-weight-medium);
		font-size: var(--gr-font-size-sm);
	}

	.collab-project__update-content {
		margin: var(--gr-spacing-scale-2) 0;
		color: var(--gr-color-gray-200);
	}

	.collab-project__update-date {
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-400);
	}
</style>

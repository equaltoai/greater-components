<script lang="ts">
	export let events: Array<{
		name: string;
		payload?: string;
		description: string;
	}> = [];
</script>

<div class="events-table-wrapper">
	<table class="events-table">
		<thead>
			<tr>
				<th>Event</th>
				<th>Payload</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			{#each events as event, eventIndex (`${eventIndex}-${event.name}`)}
				<tr>
					<td class="event-name">
						<code>on:{event.name}</code>
					</td>
					<td class="event-payload">
						{#if event.payload}
							<code>{event.payload}</code>
						{:else}
							<span class="undefined">—</span>
						{/if}
					</td>
					<td class="event-description">{event.description}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.events-table-wrapper {
		overflow-x: auto;
		margin: 1rem 0;
	}

	.events-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	.events-table th {
		text-align: left;
		padding: 0.75rem;
		background: var(--doc-surface-secondary);
		border: 1px solid var(--doc-border);
		font-weight: 600;
		white-space: nowrap;
	}

	.events-table td {
		padding: 0.75rem;
		border: 1px solid var(--doc-border);
		vertical-align: top;
	}

	.event-name {
		white-space: nowrap;
		font-weight: 500;
	}

	.event-name code {
		font-weight: 600;
		color: var(--doc-link);
	}

	.event-payload code {
		color: var(--doc-text);
		opacity: 0.8;
	}

	.event-payload .undefined {
		opacity: 0.4;
	}

	.event-description {
		line-height: 1.5;
	}

	@media (max-width: 768px) {
		.events-table {
			font-size: 0.75rem;
		}

		.events-table th,
		.events-table td {
			padding: 0.5rem;
		}
	}
</style>

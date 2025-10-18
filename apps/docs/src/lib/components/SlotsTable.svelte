<script lang="ts">
	export let slots: Array<{
		name: string;
		props?: string;
		description: string;
	}> = [];
</script>

<div class="slots-table-wrapper">
	<table class="slots-table">
		<thead>
			<tr>
				<th>Slot</th>
				<th>Props</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			{#each slots as slot, slotIndex (`${slotIndex}-${slot.name}`)}
				<tr>
					<td class="slot-name">
						<code>{slot.name || 'default'}</code>
					</td>
					<td class="slot-props">
						{#if slot.props}
							<code>{slot.props}</code>
						{:else}
							<span class="undefined">—</span>
						{/if}
					</td>
					<td class="slot-description">{slot.description}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.slots-table-wrapper {
		overflow-x: auto;
		margin: 1rem 0;
	}
	
	.slots-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}
	
	.slots-table th {
		text-align: left;
		padding: 0.75rem;
		background: var(--doc-surface-secondary);
		border: 1px solid var(--doc-border);
		font-weight: 600;
		white-space: nowrap;
	}
	
	.slots-table td {
		padding: 0.75rem;
		border: 1px solid var(--doc-border);
		vertical-align: top;
	}
	
	.slot-name {
		white-space: nowrap;
		font-weight: 500;
	}
	
	.slot-name code {
		font-weight: 600;
		color: var(--doc-link);
	}
	
	.slot-props code {
		color: var(--doc-text);
		opacity: 0.8;
	}
	
	.slot-props .undefined {
		opacity: 0.4;
	}
	
	.slot-description {
		line-height: 1.5;
	}
	
	@media (max-width: 768px) {
		.slots-table {
			font-size: 0.75rem;
		}
		
		.slots-table th,
		.slots-table td {
			padding: 0.5rem;
		}
	}
</style>

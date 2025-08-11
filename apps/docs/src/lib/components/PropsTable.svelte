<script lang="ts">
	export let props: Array<{
		name: string;
		type: string;
		default?: string;
		required?: boolean;
		description: string;
	}> = [];
</script>

<div class="props-table-wrapper">
	<table class="props-table">
		<thead>
			<tr>
				<th>Property</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			{#each props as prop}
				<tr>
					<td class="prop-name">
						<code>{prop.name}</code>
						{#if prop.required}
							<span class="required-badge">required</span>
						{/if}
					</td>
					<td class="prop-type">
						<code>{prop.type}</code>
					</td>
					<td class="prop-default">
						{#if prop.default !== undefined}
							<code>{prop.default}</code>
						{:else}
							<span class="undefined">—</span>
						{/if}
					</td>
					<td class="prop-description">{prop.description}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.props-table-wrapper {
		overflow-x: auto;
		margin: 1rem 0;
	}
	
	.props-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}
	
	.props-table th {
		text-align: left;
		padding: 0.75rem;
		background: var(--doc-surface-secondary);
		border: 1px solid var(--doc-border);
		font-weight: 600;
		white-space: nowrap;
	}
	
	.props-table td {
		padding: 0.75rem;
		border: 1px solid var(--doc-border);
		vertical-align: top;
	}
	
	.prop-name {
		white-space: nowrap;
		font-weight: 500;
	}
	
	.prop-name code {
		font-weight: 600;
	}
	
	.required-badge {
		display: inline-block;
		margin-left: 0.5rem;
		padding: 0.125rem 0.375rem;
		background: #fee2e2;
		color: #991b1b;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
	}
	
	.dark .required-badge {
		background: #7f1d1d;
		color: #fee2e2;
	}
	
	.prop-type code {
		color: var(--doc-link);
	}
	
	.prop-default .undefined {
		opacity: 0.4;
	}
	
	.prop-description {
		line-height: 1.5;
	}
	
	@media (max-width: 768px) {
		.props-table {
			font-size: 0.75rem;
		}
		
		.props-table th,
		.props-table td {
			padding: 0.5rem;
		}
	}
</style>
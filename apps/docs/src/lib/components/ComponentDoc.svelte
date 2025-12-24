<script lang="ts">
	import PropsTable from './PropsTable.svelte';
	import EventsTable from './EventsTable.svelte';
	import SlotsTable from './SlotsTable.svelte';
	import AccessibilityScorecard from './AccessibilityScorecard.svelte';
	import CodeExample from './CodeExample.svelte';
	import type { Snippet } from 'svelte';

	type ComponentStatus = 'alpha' | 'beta' | 'stable' | 'deprecated';
	type WcagLevel = 'A' | 'AA' | 'AAA';

	type ComponentPropDoc = {
		name: string;
		type: string;
		default?: string;
		required?: boolean;
		description: string;
	};

	type ComponentEventDoc = {
		name: string;
		payload?: string;
		description: string;
	};

	type ComponentSlotDoc = {
		name: string;
		props?: string;
		description: string;
	};

	// Example metadata - the actual component rendering is done via snippet
	type ExampleMeta = {
		title: string;
		description?: string;
		code: string;
	};

	type AccessibilityScorecardConfig = {
		wcagLevel?: WcagLevel;
		keyboardNav?: boolean;
		screenReader?: boolean;
		colorContrast?: boolean;
		focusManagement?: boolean;
		ariaSupport?: boolean;
		reducedMotion?: boolean;
		notes?: string[];
		knownIssues?: string[];
		axeScore?: number | null;
	};

	interface Props {
		name: string;
		description: string;
		status?: ComponentStatus;
		version?: string;
		props?: ComponentPropDoc[];
		events?: ComponentEventDoc[];
		slots?: ComponentSlotDoc[];
		examplesMeta?: ExampleMeta[];
		examples?: Snippet<[number]>; // Snippet receives example index
		accessibility?: AccessibilityScorecardConfig;
		importPath: string;
		doGuidelines?: Snippet;
		dontGuidelines?: Snippet;
		additional?: Snippet;
	}

	let {
		name,
		description,
		status = 'stable',
		version = '0.1.0',
		props = [],
		events = [],
		slots = [],
		examplesMeta = [],
		examples,
		accessibility = {},
		importPath,
		doGuidelines,
		dontGuidelines,
		additional,
	}: Props = $props();
</script>

<article class="component-doc">
	<header class="doc-header">
		<div class="header-content">
			<h1>{name}</h1>
			<div class="header-meta">
				<span class="status-badge {status}">{status}</span>
				<span class="version">v{version}</span>
			</div>
		</div>
		<p class="description">{description}</p>
	</header>

	<section class="import-section">
		<h2>Import</h2>
		<CodeExample language="javascript" code={`import { ${name} } from '${importPath}';`} />
	</section>

	{#if examplesMeta.length > 0 && examples}
		<section class="examples-section">
			<h2>Examples</h2>
			{#each examplesMeta as meta, index (`${index}-${meta.title}`)}
				<div class="example">
					<h3>{meta.title}</h3>
					{#if meta.description}
						<p>{meta.description}</p>
					{/if}
					<div class="example-preview">
						{@render examples(index)}
					</div>
					<CodeExample language="svelte" code={meta.code} />
				</div>
			{/each}
		</section>
	{/if}

	<section class="api-section">
		<h2>API Reference</h2>

		{#if props.length > 0}
			<div class="api-subsection">
				<h3>Props</h3>
				<PropsTable {props} />
			</div>
		{/if}

		{#if events.length > 0}
			<div class="api-subsection">
				<h3>Events</h3>
				<EventsTable {events} />
			</div>
		{/if}

		{#if slots.length > 0}
			<div class="api-subsection">
				<h3>Slots</h3>
				<SlotsTable {slots} />
			</div>
		{/if}
	</section>

	<section class="accessibility-section">
		<h2>Accessibility</h2>
		<AccessibilityScorecard {...accessibility} />
	</section>

	<section class="guidelines-section">
		<h2>Usage Guidelines</h2>
		<div class="guidelines-content">
			<div class="do-section">
				<h3>Do</h3>
				<ul>
					{#if doGuidelines}
						{@render doGuidelines()}
					{/if}
				</ul>
			</div>
			<div class="dont-section">
				<h3>Don't</h3>
				<ul>
					{#if dontGuidelines}
						{@render dontGuidelines()}
					{/if}
				</ul>
			</div>
		</div>
	</section>

	{#if additional}
		{@render additional()}
	{/if}
</article>

<style>
	.component-doc {
		max-width: 900px;
	}

	.doc-header {
		margin-bottom: 3rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid var(--doc-border);
	}

	.header-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.header-content h1 {
		margin: 0;
	}

	.header-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.version {
		padding: 0.25rem 0.5rem;
		background: var(--doc-surface-secondary);
		border-radius: 0.25rem;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.description {
		font-size: 1.125rem;
		opacity: 0.8;
		margin: 0;
	}

	section {
		margin-bottom: 3rem;
	}

	section h2 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--doc-border);
	}

	.import-section {
		margin-bottom: 2rem;
	}

	.example {
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: var(--doc-surface-secondary);
		border-radius: 0.5rem;
	}

	.example h3 {
		margin-top: 0;
		margin-bottom: 0.5rem;
	}

	.example p {
		margin-bottom: 1rem;
		opacity: 0.8;
	}

	.example-preview {
		padding: 1.5rem;
		margin-bottom: 1rem;
		background: var(--doc-bg);
		border: 1px solid var(--doc-border);
		border-radius: 0.375rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.api-subsection {
		margin-bottom: 2rem;
	}

	.api-subsection h3 {
		margin-bottom: 1rem;
	}

	.guidelines-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	.do-section,
	.dont-section {
		padding: 1.5rem;
		border-radius: 0.5rem;
	}

	.do-section {
		background: #f0fdf4;
		border: 1px solid #86efac;
	}

	.dont-section {
		background: #fef2f2;
		border: 1px solid #fca5a5;
	}

	:global(.dark) .do-section {
		background: #022c22;
		border-color: #064e3b;
	}

	:global(.dark) .dont-section {
		background: #450a0a;
		border-color: #7f1d1d;
	}

	.do-section h3,
	.dont-section h3 {
		margin-top: 0;
		margin-bottom: 1rem;
	}

	@media (max-width: 768px) {
		.guidelines-content {
			grid-template-columns: 1fr;
		}
	}
</style>

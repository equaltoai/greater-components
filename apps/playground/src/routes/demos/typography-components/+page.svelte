<script lang="ts">
	import { Heading, Text, Card } from '@equaltoai/greater-components-primitives';
	import DemoPage from '$lib/components/DemoPage.svelte';
</script>

<DemoPage title="Typography Components" description="Heading and Text primitives">
	<!-- Heading Demo -->
	<section class="demo-section">
		<div class="section-header">
			<Heading level={2}>Heading</Heading>
			<Text>Semantic headings with decoupled visual sizing.</Text>
		</div>

		<div class="preview-box">
			<div class="stack">
				<div class="row">
					<span class="label">Level 1 / 5xl</span>
					<Heading level={1}>Heading Level 1</Heading>
				</div>
				<div class="row">
					<span class="label">Level 2 / 4xl</span>
					<Heading level={2}>Heading Level 2</Heading>
				</div>
				<div class="row">
					<span class="label">Level 3 / 3xl</span>
					<Heading level={3}>Heading Level 3</Heading>
				</div>
				<div class="row">
					<span class="label">Level 4 / 2xl</span>
					<Heading level={4}>Heading Level 4</Heading>
				</div>

				<div class="row">
					<span class="label">Custom (H2 + XL)</span>
					<Heading level={2} size="xl">Semantic H2 with XL Size</Heading>
				</div>
			</div>
		</div>
	</section>

	<!-- Text Demo -->
	<section class="demo-section">
		<div class="section-header">
			<Heading level={2}>Text</Heading>
			<Text>Body text variants, colors, and truncation.</Text>
		</div>

		<div class="preview-box">
			<div class="stack">
				<!-- Sizes -->
				<div class="group">
					<Heading level={4} size="sm" class="group-title">Sizes</Heading>
					<Text size="xs">Extra Small (xs)</Text>
					<Text size="sm">Small (sm)</Text>
					<Text size="base">Base (base) - Default body text</Text>
					<Text size="lg">Large (lg)</Text>
					<Text size="xl">Extra Large (xl)</Text>
				</div>

				<!-- Weights -->
				<div class="group">
					<Heading level={4} size="sm" class="group-title">Weights</Heading>
					<Text weight="normal">Normal (400)</Text>
					<Text weight="medium">Medium (500)</Text>
					<Text weight="semibold">Semibold (600)</Text>
					<Text weight="bold">Bold (700)</Text>
				</div>

				<!-- Colors -->
				<div class="group">
					<Heading level={4} size="sm" class="group-title">Colors</Heading>
					<Text color="primary">Primary Color</Text>
					<Text color="secondary">Secondary Color</Text>
					<Text color="tertiary">Tertiary Color</Text>
					<Text color="success">Success Color</Text>
					<Text color="warning">Warning Color</Text>
					<Text color="error">Error Color</Text>
				</div>

				<!-- Truncation -->
				<div class="group">
					<Heading level={4} size="sm" class="group-title">Truncation</Heading>
					<Card variant="outlined" padding="sm" class="max-w-xs">
						<Text truncate>
							Single line truncation: This text is way too long to fit on one line and should be
							truncated with an ellipsis.
						</Text>
					</Card>

					<Card variant="outlined" padding="sm" class="max-w-xs mt-2">
						<Text truncate lines={2}>
							Multi-line truncation: This text is intended to span multiple lines but eventually be
							cut off. It is very useful for card descriptions where you want to show a preview of
							the content but enforce a strict height limit.
						</Text>
					</Card>
				</div>
			</div>
		</div>
	</section>
</DemoPage>

<style>
	.demo-section {
		margin-bottom: 4rem;
	}
	.section-header {
		margin-bottom: 1.5rem;
	}

	.preview-box {
		border: 1px solid var(--gr-semantic-border-subtle);
		border-radius: var(--gr-radii-lg);
		padding: 2rem;
		background: var(--gr-semantic-background-primary);
	}

	.stack {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.row {
		border-bottom: 1px solid var(--gr-semantic-border-subtle);
		padding-bottom: 1rem;
	}

	.label {
		display: block;
		font-size: 0.75rem;
		color: var(--gr-semantic-foreground-secondary);
		margin-bottom: 0.5rem;
		font-family: monospace;
	}

	.group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	:global(.group-title) {
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--gr-semantic-foreground-secondary);
		margin-bottom: 0.5rem !important;
	}

	:global(.max-w-xs) {
		max-width: 320px;
	}
	:global(.mt-2) {
		margin-top: 1rem;
	}
</style>

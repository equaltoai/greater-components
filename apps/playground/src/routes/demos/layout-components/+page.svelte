<script lang="ts">
	import {
		Container,
		Section,
		Card,
		Heading,
		Text,
		Button,
	} from '@equaltoai/greater-components-primitives';
	import DemoPage from '$lib/components/DemoPage.svelte';
</script>

<DemoPage title="Layout Components" description="Container, Section, and Card primitives">
	<!-- Container Demo -->
	<section class="demo-section">
		<div class="section-header">
			<Heading level={2}>Container</Heading>
			<Text>Centers content with max-width constraints.</Text>
		</div>

		<div class="preview-box">
			<div class="container-visualizer">
				<Container maxWidth="sm" padding="md" class="visual-container">
					<Text align="center">maxWidth="sm"</Text>
				</Container>

				<Container maxWidth="md" padding="md" class="visual-container">
					<Text align="center">maxWidth="md"</Text>
				</Container>

				<Container maxWidth="lg" padding="md" class="visual-container">
					<Text align="center">maxWidth="lg" (Default)</Text>
				</Container>
			</div>
		</div>
	</section>

	<!-- Section Demo -->
	<section class="demo-section">
		<div class="section-header">
			<Heading level={2}>Section</Heading>
			<Text>Vertical spacing wrapper for page sections.</Text>
		</div>

		<div class="preview-box bg-gray">
			<Section spacing="sm" class="visual-section">
				<Text align="center">Section spacing="sm"</Text>
			</Section>

			<Section spacing="md" class="visual-section">
				<Text align="center">Section spacing="md" (Default)</Text>
			</Section>

			<Section spacing="lg" class="visual-section">
				<Text align="center">Section spacing="lg"</Text>
			</Section>
		</div>
	</section>

	<!-- Card Demo -->
	<section class="demo-section">
		<div class="section-header">
			<Heading level={2}>Card</Heading>
			<Text>Content container with elevation and borders.</Text>
		</div>

		<div class="preview-box">
			<div class="card-grid">
				<!-- Elevated -->
				<Card variant="elevated" padding="lg">
					{#snippet header()}
						<Heading level={3} size="lg">Elevated</Heading>
					{/snippet}
					<Text>Default card style with shadow.</Text>
					{#snippet footer()}
						<Button size="sm">Action</Button>
					{/snippet}
				</Card>

				<!-- Outlined -->
				<Card variant="outlined" padding="lg">
					{#snippet header()}
						<Heading level={3} size="lg">Outlined</Heading>
					{/snippet}
					<Text>Bordered style, no shadow.</Text>
					{#snippet footer()}
						<Button size="sm" variant="outline">Action</Button>
					{/snippet}
				</Card>

				<!-- Filled -->
				<Card variant="filled" padding="lg">
					{#snippet header()}
						<Heading level={3} size="lg">Filled</Heading>
					{/snippet}
					<Text>Subtle background fill.</Text>
					{#snippet footer()}
						<Button size="sm" variant="ghost">Action</Button>
					{/snippet}
				</Card>
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

	.bg-gray {
		background-color: var(--gr-color-gray-50);
	}

	/* Container Visuals */
	.container-visualizer {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	:global(.visual-container) {
		background-color: var(--gr-color-primary-100);
		border: 1px dashed var(--gr-color-primary-300);
		padding-top: 1rem !important;
		padding-bottom: 1rem !important;
	}

	/* Section Visuals */
	:global(.visual-section) {
		background-color: white;
		border: 1px solid var(--gr-semantic-border-subtle);
		padding: 1rem;
	}

	/* Card Grid */
	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
	}
</style>

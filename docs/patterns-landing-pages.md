# Landing Page & Marketing Site Patterns

## Purpose

Comprehensive patterns for using Greater Components primitives in landing pages, marketing sites, and general websites (non-Fediverse).

## Pattern 1: Hero Section

### Structure

Use HTML for layout + Primitives for interaction:

```svelte
<script>
	import {
		Container,
		Section,
		Heading,
		Text,
		Button,
	} from '@equaltoai/greater-components/primitives';
	import { ArrowRightIcon, PlayIcon } from '@equaltoai/greater-components/icons';

	let showDemo = $state(false);
</script>

<Section spacing="xl" class="hero-section">
	<Container maxWidth="xl" padding="lg">
		<div class="hero-content">
			<Heading level={1} size="5xl" align="center" class="hero-title">Your Product Name</Heading>

			<Text size="xl" color="secondary" align="center" class="hero-subtitle">
				Build amazing things with our platform. The best tool for the job.
			</Text>

			<div class="cta-buttons">
				<Button variant="solid" size="lg">
					Get Started
					{#snippet suffix()}<ArrowRightIcon />{/snippet}
				</Button>

				<Button variant="outline" size="lg" onclick={() => (showDemo = true)}>
					{#snippet prefix()}<PlayIcon />{/snippet}
					Watch Demo
				</Button>
			</div>
		</div>
	</Container>
</Section>

<style>
	.hero-section {
		background: linear-gradient(to bottom, var(--gr-color-primary-50), white);
	}

	.hero-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		padding: 4rem 0;
	}

	.hero-subtitle {
		max-width: 600px;
	}

	.cta-buttons {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
	}
</style>
```

## Pattern 2: Feature Grid

```svelte
<script>
	import {
		Section,
		Container,
		Heading,
		Card,
		Text,
	} from '@equaltoai/greater-components/primitives';
	import { CodeIcon, ZapIcon, ShieldIcon } from '@equaltoai/greater-components/icons';
</script>

<Section spacing="lg">
	<Container maxWidth="lg">
		<Heading level={2} align="center" class="mb-12">Features</Heading>

		<div class="feature-grid">
			<Card variant="outlined" padding="lg" hoverable>
				{#snippet header()}
					<div class="icon-wrapper">
						<CodeIcon size={32} />
					</div>
					<Heading level={3} size="xl">Fast Development</Heading>
				{/snippet}

				<Text color="secondary">
					Build quickly with pre-made components that work out of the box.
				</Text>
			</Card>

			<Card variant="outlined" padding="lg" hoverable>
				{#snippet header()}
					<div class="icon-wrapper">
						<ZapIcon size={32} />
					</div>
					<Heading level={3} size="xl">High Performance</Heading>
				{/snippet}

				<Text color="secondary">Optimized for speed with zero runtime overhead for styles.</Text>
			</Card>

			<Card variant="outlined" padding="lg" hoverable>
				{#snippet header()}
					<div class="icon-wrapper">
						<ShieldIcon size={32} />
					</div>
					<Heading level={3} size="xl">Secure</Heading>
				{/snippet}

				<Text color="secondary">Built with security best practices from the ground up.</Text>
			</Card>
		</div>
	</Container>
</Section>

<style>
	.mb-12 {
		margin-bottom: 3rem;
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-top: 3rem;
	}

	.icon-wrapper {
		margin-bottom: 1rem;
		color: var(--gr-color-primary-600);
	}
</style>
```

## Pattern 3: Pricing Section

```svelte
<script>
	import {
		Section,
		Container,
		Heading,
		Card,
		Text,
		Button,
	} from '@equaltoai/greater-components/primitives';
	import { CheckIcon } from '@equaltoai/greater-components/icons';

	const features = ['Feature 1', 'Feature 2', 'Feature 3'];
</script>

<Section spacing="lg" class="bg-gray-50">
	<Container maxWidth="lg">
		<Heading level={2} align="center" class="mb-12">Simple Pricing</Heading>

		<div class="pricing-grid">
			<!-- Basic Plan -->
			<Card variant="outlined" padding="lg">
				{#snippet header()}
					<Heading level={3} size="lg">Basic</Heading>
					<div class="price">
						<Heading level={4} size="3xl">$10</Heading>
						<Text color="secondary">/month</Text>
					</div>
				{/snippet}

				<ul class="features">
					{#each features as feature}
						<li>
							<CheckIcon size={16} color="var(--gr-color-success-600)" />
							<Text size="sm">{feature}</Text>
						</li>
					{/each}
				</ul>

				{#snippet footer()}
					<Button variant="outline" class="w-full">Choose Basic</Button>
				{/snippet}
			</Card>

			<!-- Pro Plan -->
			<Card variant="elevated" padding="lg" class="highlighted">
				{#snippet header()}
					<Heading level={3} size="lg">Pro</Heading>
					<div class="price">
						<Heading level={4} size="3xl">$29</Heading>
						<Text color="secondary">/month</Text>
					</div>
				{/snippet}

				<ul class="features">
					{#each features as feature}
						<li>
							<CheckIcon size={16} color="var(--gr-color-success-600)" />
							<Text size="sm">{feature}</Text>
						</li>
					{/each}
					<li>
						<CheckIcon size={16} color="var(--gr-color-success-600)" />
						<Text size="sm">Pro Feature</Text>
					</li>
				</ul>

				{#snippet footer()}
					<Button variant="solid" class="w-full">Choose Pro</Button>
				{/snippet}
			</Card>
		</div>
	</Container>
</Section>

<style>
	.bg-gray-50 {
		background-color: var(--gr-color-gray-50);
	}
	.mb-12 {
		margin-bottom: 3rem;
	}

	.pricing-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		max-width: 900px;
		margin: 0 auto;
	}

	.price {
		display: flex;
		align-items: baseline;
		gap: 0.25rem;
		margin: 1rem 0 2rem;
	}

	.features {
		list-style: none;
		padding: 0;
		margin: 0 0 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.features li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	:global(.highlighted) {
		border-color: var(--gr-color-primary-500);
		transform: scale(1.05);
	}

	:global(.w-full) {
		width: 100%;
	}
</style>
```

## Pattern 4: FAQ Section

```svelte
<script>
	import {
		Section,
		Container,
		Heading,
		Text,
		Card,
	} from '@equaltoai/greater-components/primitives';
	import { PlusIcon } from '@equaltoai/greater-components/icons'; // Or a dedicated Accordion component if available
</script>

<Section spacing="lg">
	<Container maxWidth="md">
		<Heading level={2} align="center" class="mb-12">Frequently Asked Questions</Heading>

		<div class="faq-list">
			<Card variant="outlined" padding="md" clickable class="faq-item">
				<div class="question">
					<Heading level={3} size="base" weight="medium">How do I get started?</Heading>
					<PlusIcon />
				</div>
				<!-- Content would normally be toggled -->
				<Text color="secondary" class="mt-2"
					>Simply sign up for an account and follow the onboarding process.</Text
				>
			</Card>

			<Card variant="outlined" padding="md" clickable class="faq-item">
				<div class="question">
					<Heading level={3} size="base" weight="medium">Is there a free trial?</Heading>
					<PlusIcon />
				</div>
				<Text color="secondary" class="mt-2">Yes, we offer a 14-day free trial on all plans.</Text>
			</Card>
		</div>
	</Container>
</Section>

<style>
	.mb-12 {
		margin-bottom: 3rem;
	}
	.mt-2 {
		margin-top: 0.5rem;
	}

	.faq-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.question {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
```

## Anti-Patterns

### ❌ INCORRECT: Looking for components that don't exist

```svelte
// THESE DO NOT EXIST: import {(Grid, Flex, Nav, Table, Image)} from '@equaltoai/greater-components/primitives';
```

### ✅ CORRECT: Use HTML + Primitives

```svelte
import {(Container, Section, Heading, Text, Card, Button)} from '@equaltoai/greater-components/primitives';

<!-- Use HTML for layout structure -->
<div style="display: grid; grid-template-columns: 1fr 1fr;">
	<Container>
		<Heading>Title</Heading>
	</Container>
</div>
```

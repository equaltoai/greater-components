# Example: Complete Landing Page

This example demonstrates how to build a complete, responsive marketing landing page using Greater Components primitives. It uses a combination of semantic HTML for structure and primitives for layout, typography, and interaction.

## Code

```svelte
<script lang="ts">
	import {
		Container,
		Section,
		Heading,
		Text,
		Button,
		Card,
		ThemeSwitcher,
	} from '@equaltoai/greater-components/primitives';
	import {
		ArrowRightIcon,
		CheckIcon,
		CodeIcon,
		ZapIcon,
		ShieldIcon,
		MenuIcon,
		XIcon,
		GithubIcon,
		TwitterIcon,
	} from '@equaltoai/greater-components/icons';

	let mobileMenuOpen = $state(false);

	const features = [
		{
			title: 'Fast Development',
			desc: 'Build quickly with pre-made components that work out of the box.',
			icon: CodeIcon,
		},
		{
			title: 'High Performance',
			desc: 'Optimized for speed with zero runtime overhead for styles.',
			icon: ZapIcon,
		},
		{
			title: 'Secure by Default',
			desc: 'Built with security best practices from the ground up.',
			icon: ShieldIcon,
		},
	];

	const plans = [
		{
			name: 'Starter',
			price: '$0',
			desc: 'For individuals and hobbyists.',
			features: ['5 Projects', 'Community Support', '1GB Storage'],
			cta: 'Start Free',
			variant: 'outlined' as const,
		},
		{
			name: 'Pro',
			price: '$29',
			desc: 'For growing teams and businesses.',
			features: ['Unlimited Projects', 'Priority Support', '100GB Storage', 'Advanced Analytics'],
			cta: 'Get Pro',
			variant: 'elevated' as const,
			popular: true,
		},
		{
			name: 'Enterprise',
			price: 'Custom',
			desc: 'For large organizations.',
			features: ['SSO & Audit Logs', 'Dedicated Manager', 'Unlimited Storage', 'SLA Agreement'],
			cta: 'Contact Sales',
			variant: 'outlined' as const,
		},
	];
</script>

<div class="landing-page">
	<!-- Navigation -->
	<header class="header">
		<Container maxWidth="xl">
			<div class="nav-content">
				<div class="logo">
					<div class="logo-icon">
						<ZapIcon size={24} color="white" />
					</div>
					<Heading level={1} size="lg" class="logo-text">Acme Corp</Heading>
				</div>

				<!-- Desktop Nav -->
				<nav class="desktop-nav">
					<a href="#features" class="nav-link">Features</a>
					<a href="#pricing" class="nav-link">Pricing</a>
					<a href="#about" class="nav-link">About</a>
					<ThemeSwitcher variant="compact" />
					<Button variant="ghost">Log In</Button>
					<Button variant="solid">Sign Up</Button>
				</nav>

				<!-- Mobile Menu Toggle -->
				<button
					class="mobile-toggle"
					onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
					aria-label="Toggle menu"
				>
					{#if mobileMenuOpen}
						<XIcon />
					{:else}
						<MenuIcon />
					{/if}
				</button>
			</div>
		</Container>

		<!-- Mobile Nav -->
		{#if mobileMenuOpen}
			<div class="mobile-nav">
				<Container>
					<div class="mobile-links">
						<a href="#features" onclick={() => (mobileMenuOpen = false)}>Features</a>
						<a href="#pricing" onclick={() => (mobileMenuOpen = false)}>Pricing</a>
						<a href="#about" onclick={() => (mobileMenuOpen = false)}>About</a>
						<hr />
						<Button variant="ghost" class="w-full">Log In</Button>
						<Button variant="solid" class="w-full">Sign Up</Button>
					</div>
				</Container>
			</div>
		{/if}
	</header>

	<main>
		<!-- Hero Section -->
		<Section spacing="xl" class="hero-section">
			<Container maxWidth="lg" centered>
				<div class="hero-badge">
					<span class="badge-pill">New</span>
					<Text size="sm" weight="medium">Version 2.0 is now available</Text>
				</div>

				<Heading level={1} size="5xl" align="center" class="hero-title">
					Build faster with <span class="text-gradient">Greater Components</span>
				</Heading>

				<Text size="xl" color="secondary" align="center" class="hero-subtitle">
					The ultimate UI kit for building modern web applications. Accessible, themable, and
					production-ready primitives.
				</Text>

				<div class="hero-actions">
					<Button variant="solid" size="lg">
						Get Started
						{#snippet suffix()}<ArrowRightIcon />{/snippet}
					</Button>
					<Button variant="outline" size="lg">View Documentation</Button>
				</div>
			</Container>
		</Section>

		<!-- Features Grid -->
		<Section id="features" spacing="xl" class="bg-subtle">
			<Container maxWidth="xl">
				<div class="section-header">
					<Heading level={2} align="center">Everything you need</Heading>
					<Text color="secondary" align="center" size="lg">
						Powerful features to help you build your next big idea.
					</Text>
				</div>

				<div class="features-grid">
					{#each features as feature}
						<Card variant="elevated" padding="lg" hoverable>
							{#snippet header()}
								<div class="feature-icon">
									<feature.icon size={32} />
								</div>
								<Heading level={3} size="xl">{feature.title}</Heading>
							{/snippet}

							<Text color="secondary">
								{feature.desc}
							</Text>
						</Card>
					{/each}
				</div>
			</Container>
		</Section>

		<!-- Pricing Section -->
		<Section id="pricing" spacing="xl">
			<Container maxWidth="xl">
				<div class="section-header">
					<Heading level={2} align="center">Simple, transparent pricing</Heading>
					<Text color="secondary" align="center" size="lg">
						Choose the plan that's right for you.
					</Text>
				</div>

				<div class="pricing-grid">
					{#each plans as plan}
						<Card variant={plan.variant} padding="lg" class={plan.popular ? 'popular-plan' : ''}>
							{#snippet header()}
								<div class="plan-header">
									<Heading level={3} size="lg">{plan.name}</Heading>
									{#if plan.popular}
										<span class="popular-badge">Popular</span>
									{/if}
								</div>
								<div class="plan-price">
									<Heading level={4} size="4xl">{plan.price}</Heading>
									{#if plan.price !== 'Custom'}
										<Text color="secondary">/month</Text>
									{/if}
								</div>
								<Text size="sm" color="secondary">{plan.desc}</Text>
							{/snippet}

							<ul class="plan-features">
								{#each plan.features as feature}
									<li>
										<CheckIcon size={16} class="check-icon" />
										<Text size="sm">{feature}</Text>
									</li>
								{/each}
							</ul>

							{#snippet footer()}
								<Button variant={plan.popular ? 'solid' : 'outline'} class="w-full">
									{plan.cta}
								</Button>
							{/snippet}
						</Card>
					{/each}
				</div>
			</Container>
		</Section>

		<!-- CTA Section -->
		<Section spacing="xl" class="cta-section">
			<Container maxWidth="lg" centered>
				<div class="cta-box">
					<Heading level={2} align="center" class="text-white">Ready to get started?</Heading>
					<Text size="lg" align="center" class="text-white-dim">
						Join thousands of developers building with Greater Components today.
					</Text>
					<Button size="lg" class="bg-white text-primary">Start Building Free</Button>
				</div>
			</Container>
		</Section>
	</main>

	<!-- Footer -->
	<footer class="footer">
		<Container maxWidth="xl" padding="lg">
			<div class="footer-grid">
				<div class="footer-brand">
					<div class="logo-row">
						<ZapIcon size={20} />
						<Heading level={4} size="base">Acme Corp</Heading>
					</div>
					<Text size="sm" color="secondary">© 2025 Acme Corp. All rights reserved.</Text>
				</div>

				<div class="footer-links">
					<Heading level={5} size="sm" class="footer-title">Product</Heading>
					<a href="#">Features</a>
					<a href="#">Pricing</a>
					<a href="#">Changelog</a>
				</div>

				<div class="footer-links">
					<Heading level={5} size="sm" class="footer-title">Company</Heading>
					<a href="#">About</a>
					<a href="#">Careers</a>
					<a href="#">Blog</a>
				</div>

				<div class="footer-social">
					<Button variant="ghost" size="sm" aria-label="GitHub">
						{#snippet prefix()}<GithubIcon />{/snippet}
					</Button>
					<Button variant="ghost" size="sm" aria-label="Twitter">
						{#snippet prefix()}<TwitterIcon />{/snippet}
					</Button>
				</div>
			</div>
		</Container>
	</footer>
</div>

<style>
	/* Global Styles */
	.landing-page {
		min-height: 100vh;
		background-color: var(--gr-semantic-background-primary);
		color: var(--gr-semantic-foreground-primary);
	}

	.w-full {
		width: 100%;
	}

	/* Header */
	.header {
		position: sticky;
		top: 0;
		z-index: 50;
		background-color: var(--gr-semantic-background-primary);
		border-bottom: 1px solid var(--gr-semantic-border-subtle);
		padding: 1rem 0;
	}

	.nav-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.logo-icon {
		background: var(--gr-color-primary-600);
		padding: 0.5rem;
		border-radius: var(--gr-radii-md);
		display: flex;
	}

	/* Use global for Heading override if needed, but class works too */
	:global(.logo-text) {
		margin: 0 !important;
	}

	.desktop-nav {
		display: none;
		align-items: center;
		gap: 1.5rem;
	}

	@media (min-width: 768px) {
		.desktop-nav {
			display: flex;
		}
		.mobile-toggle {
			display: none;
		}
	}

	.nav-link {
		color: var(--gr-semantic-foreground-secondary);
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}

	.nav-link:hover {
		color: var(--gr-semantic-foreground-primary);
	}

	.mobile-toggle {
		background: none;
		border: none;
		cursor: pointer;
		color: var(--gr-semantic-foreground-primary);
	}

	.mobile-nav {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: var(--gr-semantic-background-primary);
		border-bottom: 1px solid var(--gr-semantic-border-subtle);
		padding: 1rem 0;
	}

	.mobile-links {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.mobile-links a {
		display: block;
		padding: 0.5rem 0;
		color: var(--gr-semantic-foreground-primary);
		text-decoration: none;
		font-weight: 500;
	}

	/* Hero */
	.hero-section {
		position: relative;
		overflow: hidden;
	}

	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		background: var(--gr-semantic-background-secondary);
		padding: 0.25rem 0.75rem 0.25rem 0.25rem;
		border-radius: var(--gr-radii-full);
		margin-bottom: 1.5rem;
	}

	.badge-pill {
		background: var(--gr-color-primary-600);
		color: white;
		font-size: var(--gr-typography-fontSize-xs);
		font-weight: bold;
		padding: 0.125rem 0.5rem;
		border-radius: var(--gr-radii-full);
	}

	.text-gradient {
		background: linear-gradient(to right, var(--gr-color-primary-600), var(--gr-color-primary-400));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.hero-subtitle {
		max-width: 600px;
		margin-top: 1.5rem;
		margin-bottom: 2.5rem;
	}

	.hero-actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	/* Features */
	.bg-subtle {
		background-color: var(--gr-semantic-background-secondary);
	}

	.section-header {
		max-width: 600px;
		margin: 0 auto 4rem;
		text-align: center;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.feature-icon {
		color: var(--gr-color-primary-600);
		margin-bottom: 1rem;
	}

	/* Pricing */
	.pricing-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		align-items: start;
	}

	:global(.popular-plan) {
		border-color: var(--gr-color-primary-500);
		box-shadow: var(--gr-shadows-lg);
		transform: scale(1.02);
	}

	.plan-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.popular-badge {
		background: var(--gr-color-primary-100);
		color: var(--gr-color-primary-700);
		font-size: var(--gr-typography-fontSize-xs);
		font-weight: bold;
		padding: 0.25rem 0.5rem;
		border-radius: var(--gr-radii-full);
	}

	.plan-price {
		display: flex;
		align-items: baseline;
		gap: 0.25rem;
		margin: 1rem 0 0.5rem;
	}

	.plan-features {
		list-style: none;
		padding: 0;
		margin: 0 0 2rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.plan-features li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	:global(.check-icon) {
		color: var(--gr-color-success-600);
		flex-shrink: 0;
	}

	/* CTA */
	.cta-box {
		background: var(--gr-color-primary-900);
		padding: 4rem 2rem;
		border-radius: var(--gr-radii-2xl);
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
	}

	:global(.text-white) {
		color: white !important;
	}
	:global(.text-white-dim) {
		color: rgba(255, 255, 255, 0.8) !important;
	}
	:global(.bg-white) {
		background-color: white !important;
	}
	:global(.text-primary) {
		color: var(--gr-color-primary-900) !important;
	}

	/* Footer */
	.footer {
		background-color: var(--gr-semantic-background-secondary);
		border-top: 1px solid var(--gr-semantic-border-subtle);
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr;
		gap: 4rem;
	}

	@media (max-width: 768px) {
		.footer-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
	}

	.footer-brand {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.logo-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--gr-color-primary-600);
	}

	.footer-links {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.footer-links a {
		color: var(--gr-semantic-foreground-secondary);
		text-decoration: none;
		font-size: var(--gr-typography-fontSize-sm);
		transition: color 0.2s;
	}

	.footer-links a:hover {
		color: var(--gr-semantic-foreground-primary);
	}

	:global(.footer-title) {
		margin-bottom: 0.5rem !important;
		color: var(--gr-semantic-foreground-primary);
	}

	.footer-social {
		display: flex;
		gap: 0.5rem;
	}
</style>
```

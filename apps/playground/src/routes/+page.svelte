<script lang="ts">
	import { Button, TextField, Modal } from '@equaltoai/greater-components-primitives';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { browser } from '$app/environment';

	let showModal = $state(false);
	let name = $state('');
	let email = $state('');
	let emailError = $state('');

	function validateEmail() {
		if (email && !email.includes('@')) {
			emailError = 'Please enter a valid email address';
			return false;
		}
		emailError = '';
		return true;
	}

	function handleSubmit() {
		if (validateEmail() && name && email) {
			alert(`Hello ${name}! We'll send updates to ${email}`);
			showModal = false;
			name = '';
			email = '';
		}
	}

	let theme = $state('light');

	function toggleTheme() {
		const themes = ['light', 'dark', 'highContrast'];
		const currentIndex = themes.indexOf(theme);
		theme = themes[(currentIndex + 1) % themes.length];
		if (browser) {
			document.documentElement.setAttribute('data-theme', theme);
		}
	}

	function navigateTo(path: string) {
		const target = path === '/' ? base || '/' : `${base}${path}`;
		goto(target);
	}
</script>

<div class="playground">
	<header class="header">
		<h1>Greater Components</h1>
		<p>A modern component library for the Fediverse</p>

		<div class="theme-controls">
			<Button variant="outline" size="sm" onclick={toggleTheme}>
				Switch Theme: {theme}
			</Button>
		</div>
	</header>

	<section class="hero">
		<h2>Welcome to the Playground</h2>
		<p>
			Explore our component library with live examples, interactive controls, and comprehensive
			documentation. All components are built with Svelte 5, TypeScript, and full accessibility
			support.
		</p>

		<div class="cta-buttons">
			<Button size="lg" onclick={() => (showModal = true)}>Get Started</Button>
			<Button variant="outline" size="lg" onclick={() => navigateTo('/demos/primitives')}>
				Component Demos
			</Button>
			<Button variant="outline" size="lg" onclick={() => navigateTo('/demos/icons')}>
				Icon Gallery
			</Button>
			<Button variant="outline" size="lg" onclick={() => navigateTo('/demos/forms')}>
				Form Patterns
			</Button>
			<Button variant="outline" size="lg" onclick={() => navigateTo('/timeline')}>
				Timeline Demo
			</Button>
		</div>
	</section>

	<section class="features">
		<div class="feature-grid">
			<div class="feature">
				<h3>🎨 Design Tokens</h3>
				<p>Consistent theming with light, dark, and high-contrast modes</p>
			</div>

			<div class="feature">
				<h3>♿ Accessible</h3>
				<p>WCAG 2.1 AA compliant with full keyboard navigation support</p>
			</div>

			<div class="feature">
				<h3>🚀 Modern</h3>
				<p>Built with Svelte 5 runes, TypeScript strict mode, and ESM</p>
			</div>

			<div class="feature">
				<h3>🌐 Fediverse Ready</h3>
				<p>Purpose-built for decentralized social media applications</p>
			</div>
		</div>
	</section>

	<section class="demo">
		<h2>Component Preview</h2>

		<div class="component-showcase">
			<div class="showcase-section">
				<h3>Buttons</h3>
				<div class="button-group">
					<Button variant="solid">Primary</Button>
					<Button variant="outline">Secondary</Button>
					<Button variant="ghost">Tertiary</Button>
					<Button disabled>Disabled</Button>
				</div>
			</div>

			<div class="showcase-section">
				<h3>Text Fields</h3>
				<div class="textfield-group">
					<TextField label="Name" placeholder="Enter your name" bind:value={name} />
					<TextField
						label="Email"
						type="email"
						placeholder="Enter your email"
						bind:value={email}
						invalid={!!emailError}
						errorMessage={emailError}
						onblur={validateEmail}
					/>
				</div>
			</div>
		</div>
	</section>
</div>

<Modal bind:open={showModal} title="Get Started with Greater Components">
	<div class="modal-content">
		<p>
			Welcome! Tell us a bit about yourself to get personalized updates about Greater Components.
		</p>

		<div class="form-fields">
			<TextField label="Full Name" placeholder="Enter your full name" bind:value={name} required />
			<TextField
				label="Email Address"
				type="email"
				placeholder="Enter your email"
				bind:value={email}
				invalid={!!emailError}
				errorMessage={emailError}
				onblur={validateEmail}
				required
			/>
		</div>
	</div>

	{#snippet footer()}
		<div class="modal-actions">
			<Button variant="ghost" onclick={() => (showModal = false)}>Cancel</Button>
			<Button onclick={handleSubmit} disabled={!name || !email || !!emailError}>Subscribe</Button>
		</div>
	{/snippet}
</Modal>

<style>
	.playground {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.header {
		text-align: center;
		margin-bottom: 4rem;
		padding: 2rem 0;
	}

	.header h1 {
		font-size: var(--gr-typography-fontSize-5xl);
		font-weight: var(--gr-typography-fontWeight-bold);
		margin-bottom: 1rem;
		background: linear-gradient(
			135deg,
			var(--gr-semantic-action-primary-default),
			var(--gr-semantic-action-success-default)
		);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.header p {
		font-size: var(--gr-typography-fontSize-xl);
		color: var(--gr-semantic-foreground-secondary);
		margin-bottom: 2rem;
	}

	.theme-controls {
		display: flex;
		justify-content: center;
	}

	.hero {
		text-align: center;
		margin-bottom: 4rem;
		padding: 3rem 2rem;
		background: var(--gr-semantic-background-secondary);
		border-radius: var(--gr-radii-xl);
	}

	.hero h2 {
		font-size: var(--gr-typography-fontSize-3xl);
		font-weight: var(--gr-typography-fontWeight-bold);
		margin-bottom: 1rem;
	}

	.hero p {
		font-size: var(--gr-typography-fontSize-lg);
		color: var(--gr-semantic-foreground-secondary);
		margin-bottom: 2rem;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.cta-buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.features {
		margin-bottom: 4rem;
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
		margin-top: 2rem;
	}

	.feature {
		padding: 2rem;
		background: var(--gr-semantic-background-secondary);
		border-radius: var(--gr-radii-lg);
		border: 1px solid var(--gr-semantic-border-default);
	}

	.feature h3 {
		font-size: var(--gr-typography-fontSize-lg);
		font-weight: var(--gr-typography-fontWeight-semibold);
		margin-bottom: 0.5rem;
	}

	.feature p {
		color: var(--gr-semantic-foreground-secondary);
		line-height: var(--gr-typography-lineHeight-relaxed);
	}

	.demo {
		margin-bottom: 4rem;
	}

	.demo h2 {
		font-size: var(--gr-typography-fontSize-2xl);
		font-weight: var(--gr-typography-fontWeight-bold);
		margin-bottom: 2rem;
		text-align: center;
	}

	.component-showcase {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.showcase-section {
		padding: 2rem;
		background: var(--gr-semantic-background-secondary);
		border-radius: var(--gr-radii-lg);
		border: 1px solid var(--gr-semantic-border-default);
	}

	.showcase-section h3 {
		font-size: var(--gr-typography-fontSize-lg);
		font-weight: var(--gr-typography-fontWeight-semibold);
		margin-bottom: 1rem;
	}

	.button-group {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.textfield-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.modal-content {
		padding: 1rem 0;
	}

	.form-fields {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1rem;
	}

	.modal-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.playground {
			padding: 1rem;
		}

		.header h1 {
			font-size: var(--gr-typography-fontSize-3xl);
		}

		.hero {
			padding: 2rem 1rem;
		}

		.cta-buttons {
			flex-direction: column;
			align-items: center;
		}

		.feature-grid {
			grid-template-columns: 1fr;
		}

		.component-showcase {
			grid-template-columns: 1fr;
		}

		.button-group {
			justify-content: center;
		}
	}
</style>

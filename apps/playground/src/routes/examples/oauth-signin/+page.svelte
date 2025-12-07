<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';
	import { SignInCard } from '@equaltoai/greater-components-auth';
	import { Button } from '@equaltoai/greater-components-primitives';
	import type { OAuthProvider } from '@equaltoai/greater-components-auth';

	// Mock provider icons (in real app, import from icons package)
	const GithubIcon = () => null;
	const GoogleIcon = () => null;
	const MastodonIcon = () => null;

	const providers: OAuthProvider[] = [
		{ id: 'github', name: 'GitHub', icon: GithubIcon },
		{ id: 'google', name: 'Google', icon: GoogleIcon },
		{ id: 'mastodon', name: 'Mastodon', icon: MastodonIcon },
	];

	let loading = $state(false);
	let loadingProvider = $state<string | null>(null);
	let error = $state<string | null>(null);

	async function handleSignIn(providerId: string) {
		loadingProvider = providerId;
		loading = true;
		error = null;

		// Simulate OAuth flow
		await new Promise(resolve => setTimeout(resolve, 2000));

		// Simulate random error for demo
		if (Math.random() > 0.7) {
			error = `Failed to authenticate with ${providerId}. Please try again.`;
		} else {
			alert(`Successfully signed in with ${providerId}!`);
		}

		loading = false;
		loadingProvider = null;
	}

	function handleRetry() {
		error = null;
	}

	function resetDemo() {
		loading = false;
		loadingProvider = null;
		error = null;
	}

	const basicCode = `<script>
  import { SignInCard } from '@equaltoai/greater-components-auth';
  import { GithubIcon, GoogleIcon } from '@equaltoai/greater-components-icons';

  const providers = [
    { id: 'github', name: 'GitHub', icon: GithubIcon },
    { id: 'google', name: 'Google', icon: GoogleIcon },
  ];

  let loading = $state(false);
  let loadingProvider = $state(null);
  let error = $state(null);

  async function handleSignIn(providerId) {
    loadingProvider = providerId;
    loading = true;
    try {
      await signInWithProvider(providerId);
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
      loadingProvider = null;
    }
  }
<\/script>

<SignInCard 
  title="Welcome back"
  description="Sign in to your account"
  {providers}
  onSignIn={handleSignIn}
  {loading}
  {loadingProvider}
  {error}
  onRetry={() => error = null}
/>`;

	const withFooterCode = `<SignInCard 
  title="Sign in to continue"
  {providers}
  onSignIn={handleSignIn}
>
  {#snippet footer()}
    <p>
      Don't have an account? 
      <a href="/register">Create one</a>
    </p>
  {/snippet}
</SignInCard>`;
</script>

<DemoPage
	eyebrow="Auth Components"
	title="OAuth Sign-In Card"
	description="Pre-built sign-in card with OAuth provider buttons, loading states, and error handling for authentication flows."
>
	{#snippet actions()}
		<Button variant="outline" size="sm" onclick={resetDemo}>Reset Demo</Button>
	{/snippet}

	<section class="demo-section">
		<h2>Interactive Demo</h2>
		<p>Click a provider button to simulate the OAuth flow. ~30% chance of error for demo purposes.</p>
		
		<div class="signin-demo">
			<SignInCard 
				title="Welcome back"
				description="Sign in to your account to continue"
				{providers}
				onSignIn={handleSignIn}
				{loading}
				{loadingProvider}
				{error}
				onRetry={handleRetry}
			/>
		</div>

		<CodeExample code={basicCode} language="svelte" />
	</section>

	<section class="demo-section">
		<h2>With Custom Footer</h2>
		<p>Add registration links or terms of service in the footer slot.</p>
		
		<div class="signin-demo">
			<SignInCard 
				title="Sign in to continue"
				{providers}
				onSignIn={handleSignIn}
			>
				{#snippet footer()}
					<p class="footer-text">
						Don't have an account? 
						<a href="#register">Create one</a>
					</p>
					<p class="footer-terms">
						By signing in, you agree to our 
						<a href="#terms">Terms of Service</a>
					</p>
				{/snippet}
			</SignInCard>
		</div>

		<CodeExample code={withFooterCode} language="svelte" />
	</section>

	<section class="demo-section">
		<h2>Component Props</h2>
		<table class="props-table">
			<thead>
				<tr>
					<th>Prop</th>
					<th>Type</th>
					<th>Default</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>title</code></td>
					<td>string</td>
					<td>"Sign in to continue"</td>
					<td>Card heading text</td>
				</tr>
				<tr>
					<td><code>description</code></td>
					<td>string</td>
					<td>undefined</td>
					<td>Optional subheading text</td>
				</tr>
				<tr>
					<td><code>providers</code></td>
					<td>OAuthProvider[]</td>
					<td>required</td>
					<td>Array of OAuth providers to display</td>
				</tr>
				<tr>
					<td><code>onSignIn</code></td>
					<td>(providerId: string) => Promise&lt;void&gt;</td>
					<td>required</td>
					<td>Callback when provider button is clicked</td>
				</tr>
				<tr>
					<td><code>loading</code></td>
					<td>boolean</td>
					<td>false</td>
					<td>Whether any sign-in is in progress</td>
				</tr>
				<tr>
					<td><code>loadingProvider</code></td>
					<td>string | null</td>
					<td>null</td>
					<td>ID of the provider currently loading</td>
				</tr>
				<tr>
					<td><code>error</code></td>
					<td>string | null</td>
					<td>null</td>
					<td>Error message to display</td>
				</tr>
				<tr>
					<td><code>onRetry</code></td>
					<td>() => void</td>
					<td>undefined</td>
					<td>Callback when retry button is clicked</td>
				</tr>
				<tr>
					<td><code>footer</code></td>
					<td>Snippet</td>
					<td>undefined</td>
					<td>Custom footer content slot</td>
				</tr>
			</tbody>
		</table>
	</section>

	<section class="demo-section">
		<h2>OAuthProvider Interface</h2>
		<CodeExample code={`interface OAuthProvider {
  id: string;        // Unique identifier (e.g., 'github')
  name: string;      // Display name (e.g., 'GitHub')
  icon?: Component;  // Svelte icon component
  color?: string;    // Optional brand color
}`} language="typescript" />
	</section>

	<section class="demo-section">
		<h2>Accessibility</h2>
		<ul class="a11y-list">
			<li><strong>Keyboard:</strong> All buttons are keyboard accessible with Enter/Space activation</li>
			<li><strong>Focus:</strong> Focus is managed appropriately during loading and error states</li>
			<li><strong>Screen readers:</strong> Loading states and errors are announced via live regions</li>
			<li><strong>Disabled state:</strong> Buttons are properly disabled during loading</li>
		</ul>
	</section>
</DemoPage>

<style>
	.demo-section {
		margin-bottom: 3rem;
	}

	.demo-section h2 {
		margin-bottom: 0.5rem;
		font-size: var(--gr-typography-fontSize-xl);
	}

	.demo-section > p {
		margin-bottom: 1rem;
		color: var(--gr-semantic-foreground-secondary);
	}

	.signin-demo {
		display: flex;
		justify-content: center;
		padding: 2rem;
		background: var(--gr-semantic-background-secondary);
		border-radius: var(--gr-radii-lg);
		margin-bottom: 1rem;
	}

	.footer-text,
	.footer-terms {
		text-align: center;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-semantic-foreground-secondary);
		margin: 0.5rem 0;
	}

	.footer-text a,
	.footer-terms a {
		color: var(--gr-semantic-action-primary-default);
		text-decoration: none;
	}

	.footer-text a:hover,
	.footer-terms a:hover {
		text-decoration: underline;
	}

	.props-table {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--gr-typography-fontSize-sm);
	}

	.props-table th,
	.props-table td {
		padding: 0.75rem;
		text-align: left;
		border-bottom: 1px solid var(--gr-semantic-border-default);
	}

	.props-table th {
		font-weight: 600;
		background: var(--gr-semantic-background-secondary);
	}

	.props-table code {
		background: var(--gr-semantic-background-secondary);
		padding: 0.125rem 0.375rem;
		border-radius: var(--gr-radii-sm);
	}

	.a11y-list {
		list-style: disc;
		padding-left: 1.5rem;
	}

	.a11y-list li {
		margin-bottom: 0.5rem;
	}
</style>
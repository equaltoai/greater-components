<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';
	import { UserButton } from '@equaltoai/greater-components-auth';
	import { Button } from '@equaltoai/greater-components-primitives';
	import { UserIcon, SettingsIcon, HelpCircleIcon, CreditCardIcon } from '@equaltoai/greater-components-icons';
	import type { UserMenuItem } from '@equaltoai/greater-components-auth';

	const mockUser = {
		name: 'Jane Doe',
		email: 'jane@example.com',
		imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
	};

	const mockUserNoImage = {
		name: 'John Smith',
		email: 'john@example.com',
	};

	const menuItems: UserMenuItem[] = [
		{ id: 'profile', label: 'Profile', icon: UserIcon, onClick: () => alert('Profile clicked') },
		{ id: 'settings', label: 'Settings', icon: SettingsIcon, onClick: () => alert('Settings clicked') },
		{ id: 'billing', label: 'Billing', icon: CreditCardIcon, onClick: () => alert('Billing clicked') },
		{ id: 'help', label: 'Help & Support', icon: HelpCircleIcon, onClick: () => alert('Help clicked') },
	];

	let signingOut = $state(false);

	async function handleSignOut() {
		signingOut = true;
		await new Promise(resolve => setTimeout(resolve, 1500));
		alert('Signed out successfully!');
		signingOut = false;
	}

	const dropdownCode = `<script>
  import { UserButton } from '@equaltoai/greater-components-auth';
  import { UserIcon, SettingsIcon } from '@equaltoai/greater-components-icons';

  const user = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    imageUrl: 'https://example.com/avatar.jpg'
  };

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: UserIcon, onClick: () => goto('/profile') },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, onClick: () => goto('/settings') },
  ];

  async function handleSignOut() {
    await signOut();
  }
<\/script>

<UserButton 
  {user}
  onSignOut={handleSignOut}
  {menuItems}
/>`;

	const inlineCode = `<UserButton 
  {user}
  onSignOut={handleSignOut}
  variant="inline"
/>`;

	const sizesCode = `<UserButton {user} onSignOut={handleSignOut} size="sm" />
<UserButton {user} onSignOut={handleSignOut} size="md" />
<UserButton {user} onSignOut={handleSignOut} size="lg" />`;
</script>

<DemoPage
	eyebrow="Auth Components"
	title="User Button"
	description="Authenticated user avatar with dropdown menu for profile actions and sign-out functionality."
>
	<section class="demo-section">
		<h2>Dropdown Variant (Default)</h2>
		<p>Click the avatar to open a dropdown menu with user info and actions.</p>
		
		<div class="demo-area">
			<UserButton 
				user={mockUser}
				onSignOut={handleSignOut}
				{menuItems}
				loading={signingOut}
			/>
		</div>

		<CodeExample code={dropdownCode} language="svelte" />
	</section>

	<section class="demo-section">
		<h2>Inline Variant</h2>
		<p>Displays user info inline with a sign-out button, useful for sidebars or headers.</p>
		
		<div class="demo-area inline-demo">
			<UserButton 
				user={mockUser}
				onSignOut={handleSignOut}
				variant="inline"
				loading={signingOut}
			/>
		</div>

		<CodeExample code={inlineCode} language="svelte" />
	</section>

	<section class="demo-section">
		<h2>Avatar Fallback</h2>
		<p>When no image is provided, displays initials from the user's name.</p>
		
		<div class="demo-area">
			<UserButton 
				user={mockUserNoImage}
				onSignOut={handleSignOut}
				{menuItems}
			/>
		</div>
	</section>

	<section class="demo-section">
		<h2>Size Variants</h2>
		<p>Three size options for different contexts.</p>
		
		<div class="demo-area sizes-row">
			<div class="size-item">
				<UserButton user={mockUser} onSignOut={handleSignOut} size="sm" />
				<span>sm</span>
			</div>
			<div class="size-item">
				<UserButton user={mockUser} onSignOut={handleSignOut} size="md" />
				<span>md</span>
			</div>
			<div class="size-item">
				<UserButton user={mockUser} onSignOut={handleSignOut} size="lg" />
				<span>lg</span>
			</div>
		</div>

		<CodeExample code={sizesCode} language="svelte" />
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
					<td><code>user</code></td>
					<td>User</td>
					<td>required</td>
					<td>User object with name, email, and optional imageUrl</td>
				</tr>
				<tr>
					<td><code>onSignOut</code></td>
					<td>() => Promise&lt;void&gt;</td>
					<td>required</td>
					<td>Callback when sign out is triggered</td>
				</tr>
				<tr>
					<td><code>variant</code></td>
					<td>'dropdown' | 'inline'</td>
					<td>'dropdown'</td>
					<td>Display variant</td>
				</tr>
				<tr>
					<td><code>size</code></td>
					<td>'sm' | 'md' | 'lg'</td>
					<td>'md'</td>
					<td>Avatar and button size</td>
				</tr>
				<tr>
					<td><code>menuItems</code></td>
					<td>UserMenuItem[]</td>
					<td>[]</td>
					<td>Custom menu items (dropdown variant only)</td>
				</tr>
				<tr>
					<td><code>loading</code></td>
					<td>boolean</td>
					<td>false</td>
					<td>Whether sign-out is in progress</td>
				</tr>
			</tbody>
		</table>
	</section>

	<section class="demo-section">
		<h2>UserMenuItem Interface</h2>
		<CodeExample code={`interface UserMenuItem {
  id: string;           // Unique identifier
  label: string;        // Display text
  icon?: Component;     // Optional icon component
  onClick?: () => void; // Click handler
  disabled?: boolean;   // Whether item is disabled
  href?: string;        // Optional link URL
}`} language="typescript" />
	</section>

	<section class="demo-section">
		<h2>Accessibility</h2>
		<ul class="a11y-list">
			<li><strong>Keyboard:</strong> Full keyboard navigation for dropdown menu</li>
			<li><strong>Focus:</strong> Focus returns to trigger after menu closes</li>
			<li><strong>Screen readers:</strong> Avatar has accessible label with user name</li>
			<li><strong>Loading:</strong> Sign-out loading state is announced</li>
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

	.demo-area {
		display: flex;
		justify-content: center;
		padding: 2rem;
		background: var(--gr-semantic-background-secondary);
		border-radius: var(--gr-radii-lg);
		margin-bottom: 1rem;
	}

	.inline-demo {
		justify-content: flex-start;
	}

	.sizes-row {
		gap: 3rem;
		align-items: flex-end;
	}

	.size-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.size-item span {
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-semantic-foreground-secondary);
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
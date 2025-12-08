<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';
	import { Button } from '@equaltoai/greater-components-primitives';
	import * as Menu from '@equaltoai/greater-components-primitives/components/Menu/index';
	import {
		UserIcon,
		SettingsIcon,
		LogOutIcon,
		EditIcon,
		TrashIcon,
		ChevronDownIcon,
		MoreHorizontalIcon,
	} from '@equaltoai/greater-components-icons';

	function handleAction(action: string) {
		alert(`Action: ${action}`);
	}

	const basicCode = `<script>
  import * as Menu from '@equaltoai/greater-components-primitives/components/Menu/index';
  import { Button } from '@equaltoai/greater-components-primitives';
<${'/'}script>

<Menu.Root>
  <Menu.Trigger>
    <Button>Open Menu</Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item onclick={() => handleAction('edit')}>Edit</Menu.Item>
    <Menu.Item onclick={() => handleAction('duplicate')}>Duplicate</Menu.Item>
    <Menu.Separator />
    <Menu.Item onclick={() => handleAction('delete')} variant="danger">Delete</Menu.Item>
  </Menu.Content>
</Menu.Root>`;

	const withIconsCode = `<Menu.Root>
  <Menu.Trigger>
    <Button>
      Actions
      <ChevronDownIcon size={16} />
    </Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Header>Account</Menu.Header>
    <Menu.Item onclick={handleProfile}>
      <UserIcon size={16} />
      Profile
    </Menu.Item>
    <Menu.Item onclick={handleSettings}>
      <SettingsIcon size={16} />
      Settings
    </Menu.Item>
    <Menu.Separator />
    <Menu.Item onclick={handleLogout} variant="danger">
      <LogOutIcon size={16} />
      Sign Out
    </Menu.Item>
  </Menu.Content>
</Menu.Root>`;

	const placementCode = `<Menu.Root placement="bottom-end">
  <Menu.Trigger>...</Menu.Trigger>
  <Menu.Content>...</Menu.Content>
</Menu.Root>

<!-- Available placements:
  - bottom-start (default)
  - bottom-end
  - top-start
  - top-end
  - left-start
  - left-end
  - right-start
  - right-end
-->`;

	const iconButtonCode = `<Menu.Root>
  <Menu.Trigger>
    <button class="icon-button" aria-label="More options">
      <MoreHorizontalIcon size={20} />
    </button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item>Edit</Menu.Item>
    <Menu.Item>Share</Menu.Item>
    <Menu.Item variant="danger">Delete</Menu.Item>
  </Menu.Content>
</Menu.Root>`;
</script>

<DemoPage
	eyebrow="Primitives"
	title="Dropdown Menu"
	description="Compound component pattern for building accessible dropdown menus with keyboard navigation, icons, and flexible placement."
>
	<section class="demo-section">
		<h2>Basic Menu</h2>
		<p>Simple dropdown menu with items and separator.</p>

		<div class="demo-area">
			<Menu.Root>
				<Menu.Trigger>
					<Button>Open Menu</Button>
				</Menu.Trigger>
				<Menu.Content>
					<Menu.Item onclick={() => handleAction('edit')}>Edit</Menu.Item>
					<Menu.Item onclick={() => handleAction('duplicate')}>Duplicate</Menu.Item>
					<Menu.Separator />
					<Menu.Item onclick={() => handleAction('delete')} variant="danger">Delete</Menu.Item>
				</Menu.Content>
			</Menu.Root>
		</div>

		<CodeExample code={basicCode} language="svelte" />
	</section>

	<section class="demo-section">
		<h2>With Icons and Headers</h2>
		<p>Menu items can include icons and be organized with headers.</p>

		<div class="demo-area">
			<Menu.Root>
				<Menu.Trigger>
					<Button>
						<span>Actions</span>
						<ChevronDownIcon size={16} />
					</Button>
				</Menu.Trigger>
				<Menu.Content>
					<Menu.Header>Account</Menu.Header>
					<Menu.Item onclick={() => handleAction('profile')}>
						<UserIcon size={16} />
						<span>Profile</span>
					</Menu.Item>
					<Menu.Item onclick={() => handleAction('settings')}>
						<SettingsIcon size={16} />
						<span>Settings</span>
					</Menu.Item>
					<Menu.Separator />
					<Menu.Item onclick={() => handleAction('logout')} variant="danger">
						<LogOutIcon size={16} />
						<span>Sign Out</span>
					</Menu.Item>
				</Menu.Content>
			</Menu.Root>
		</div>

		<CodeExample code={withIconsCode} language="svelte" />
	</section>

	<section class="demo-section">
		<h2>Placement Options</h2>
		<p>Control where the menu appears relative to the trigger.</p>

		<div class="placement-grid">
			<div class="placement-item">
				<Menu.Root placement="bottom-start">
					<Menu.Trigger>
						<Button variant="outline" size="sm">bottom-start</Button>
					</Menu.Trigger>
					<Menu.Content>
						<Menu.Item>Item 1</Menu.Item>
						<Menu.Item>Item 2</Menu.Item>
					</Menu.Content>
				</Menu.Root>
			</div>
			<div class="placement-item">
				<Menu.Root placement="bottom-end">
					<Menu.Trigger>
						<Button variant="outline" size="sm">bottom-end</Button>
					</Menu.Trigger>
					<Menu.Content>
						<Menu.Item>Item 1</Menu.Item>
						<Menu.Item>Item 2</Menu.Item>
					</Menu.Content>
				</Menu.Root>
			</div>
			<div class="placement-item">
				<Menu.Root placement="top-start">
					<Menu.Trigger>
						<Button variant="outline" size="sm">top-start</Button>
					</Menu.Trigger>
					<Menu.Content>
						<Menu.Item>Item 1</Menu.Item>
						<Menu.Item>Item 2</Menu.Item>
					</Menu.Content>
				</Menu.Root>
			</div>
			<div class="placement-item">
				<Menu.Root placement="top-end">
					<Menu.Trigger>
						<Button variant="outline" size="sm">top-end</Button>
					</Menu.Trigger>
					<Menu.Content>
						<Menu.Item>Item 1</Menu.Item>
						<Menu.Item>Item 2</Menu.Item>
					</Menu.Content>
				</Menu.Root>
			</div>
		</div>

		<CodeExample code={placementCode} language="svelte" />
	</section>

	<section class="demo-section">
		<h2>Icon Button Trigger</h2>
		<p>Common pattern for action menus on cards or list items.</p>

		<div class="demo-area">
			<div class="card-example">
				<span>Post Title</span>
				<Menu.Root placement="bottom-end">
					<Menu.Trigger>
						<button class="icon-button" aria-label="More options">
							<MoreHorizontalIcon size={20} />
						</button>
					</Menu.Trigger>
					<Menu.Content>
						<Menu.Item onclick={() => handleAction('edit')}>
							<EditIcon size={16} />
							<span>Edit</span>
						</Menu.Item>
						<Menu.Item onclick={() => handleAction('share')}>Share</Menu.Item>
						<Menu.Separator />
						<Menu.Item onclick={() => handleAction('delete')} variant="danger">
							<TrashIcon size={16} />
							<span>Delete</span>
						</Menu.Item>
					</Menu.Content>
				</Menu.Root>
			</div>
		</div>

		<CodeExample code={iconButtonCode} language="svelte" />
	</section>

	<section class="demo-section">
		<h2>Keyboard Navigation</h2>
		<ul class="a11y-list">
			<li>
				<strong>Enter/Space:</strong> Open menu when trigger is focused, select item when menu is open
			</li>
			<li><strong>Arrow Down:</strong> Move focus to next item (loops if enabled)</li>
			<li><strong>Arrow Up:</strong> Move focus to previous item</li>
			<li><strong>Escape:</strong> Close menu and return focus to trigger</li>
			<li><strong>Tab:</strong> Close menu and move to next focusable element</li>
			<li><strong>Home/End:</strong> Jump to first/last item</li>
		</ul>
	</section>

	<section class="demo-section">
		<h2>Compound Component API</h2>
		<table class="api-table">
			<thead>
				<tr>
					<th>Component</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>Menu.Root</code></td>
					<td>Container managing state, placement, and keyboard navigation</td>
				</tr>
				<tr>
					<td><code>Menu.Trigger</code></td>
					<td>Element that toggles the menu open/closed</td>
				</tr>
				<tr>
					<td><code>Menu.Content</code></td>
					<td>Positioned container for menu items</td>
				</tr>
				<tr>
					<td><code>Menu.Item</code></td>
					<td>Clickable menu option with optional icon and danger variant</td>
				</tr>
				<tr>
					<td><code>Menu.Header</code></td>
					<td>Non-interactive section label</td>
				</tr>
				<tr>
					<td><code>Menu.Separator</code></td>
					<td>Visual divider between item groups</td>
				</tr>
			</tbody>
		</table>
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
		padding: 2rem;
		background: var(--gr-semantic-background-secondary);
		border-radius: var(--gr-radii-lg);
		margin-bottom: 1rem;
		display: flex;
		justify-content: center;
	}

	.placement-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		padding: 2rem;
		background: var(--gr-semantic-background-secondary);
		border-radius: var(--gr-radii-lg);
		margin-bottom: 1rem;
	}

	.placement-item {
		display: flex;
		justify-content: center;
		padding: 1rem;
	}

	.card-example {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.5rem;
		background: var(--gr-semantic-background-primary);
		border: 1px solid var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-md);
		min-width: 300px;
	}

	.icon-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border: none;
		background: transparent;
		border-radius: var(--gr-radii-md);
		cursor: pointer;
		color: var(--gr-semantic-foreground-secondary);
		transition:
			background-color 0.2s,
			color 0.2s;
	}

	.icon-button:hover {
		background: var(--gr-semantic-background-secondary);
		color: var(--gr-semantic-foreground-primary);
	}

	.a11y-list {
		list-style: disc;
		padding-left: 1.5rem;
	}

	.a11y-list li {
		margin-bottom: 0.5rem;
	}

	.api-table {
		width: 100%;
		border-collapse: collapse;
	}

	.api-table th,
	.api-table td {
		padding: 0.75rem;
		text-align: left;
		border-bottom: 1px solid var(--gr-semantic-border-default);
	}

	.api-table th {
		font-weight: 600;
		background: var(--gr-semantic-background-secondary);
	}

	.api-table code {
		background: var(--gr-semantic-background-secondary);
		padding: 0.125rem 0.375rem;
		border-radius: var(--gr-radii-sm);
		font-size: 0.875em;
	}
</style>

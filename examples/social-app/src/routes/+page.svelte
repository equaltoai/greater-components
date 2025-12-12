<script lang="ts">
	// Import components from CLI-installed location
	// After running: greater add faces/social
	// Components will be at $lib/components/ui/

	// For this example, we import from npm package
	// Replace with local imports after CLI installation
	import { Button } from '@equaltoai/greater-components/primitives';

	// Mock data for demonstration
	const mockStatuses = [
		{
			id: '1',
			content: '<p>Hello, Fediverse! 👋 This is a demo of Greater Components social face.</p>',
			createdAt: new Date().toISOString(),
			account: {
				id: '1',
				username: 'demo',
				displayName: 'Demo User',
				avatar: 'https://via.placeholder.com/48',
			},
			favouritesCount: 5,
			reblogsCount: 2,
			repliesCount: 1,
		},
		{
			id: '2',
			content: '<p>Building ActivityPub applications has never been easier! 🚀</p>',
			createdAt: new Date(Date.now() - 3600000).toISOString(),
			account: {
				id: '2',
				username: 'greater',
				displayName: 'Greater Components',
				avatar: 'https://via.placeholder.com/48',
			},
			favouritesCount: 12,
			reblogsCount: 8,
			repliesCount: 3,
		},
	];

	function handleCompose() {
		console.log('Open compose modal');
	}
</script>

<svelte:head>
	<title>Home | Social App</title>
</svelte:head>

<div class="home-timeline">
	<header class="timeline-header">
		<h1>Home</h1>
		<Button variant="solid" onclick={handleCompose}>Compose</Button>
	</header>

	<div class="timeline-content">
		{#each mockStatuses as status (status.id)}
			<article class="status-card">
				<div class="status-header">
					<img src={status.account.avatar} alt={status.account.displayName} class="avatar" />
					<div class="account-info">
						<span class="display-name">{status.account.displayName}</span>
						<span class="username">@{status.account.username}</span>
					</div>
				</div>
				<div class="status-content">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html status.content}
				</div>
				<div class="status-actions">
					<button class="action-btn">
						💬 {status.repliesCount}
					</button>
					<button class="action-btn">
						🔄 {status.reblogsCount}
					</button>
					<button class="action-btn">
						⭐ {status.favouritesCount}
					</button>
				</div>
			</article>
		{/each}
	</div>

	<p class="demo-note">
		<strong>Note:</strong> This is a demo with mock data. Run <code>greater add faces/social</code> to
		install the full Status, Timeline, and Profile components.
	</p>
</div>

<style>
	.home-timeline {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-4);
	}

	.timeline-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.timeline-header h1 {
		margin: 0;
		font-size: var(--gr-typography-fontSize-xl);
	}

	.status-card {
		padding: var(--gr-spacing-4);
		border: 1px solid var(--gr-color-border);
		border-radius: var(--gr-radii-lg);
		background: var(--gr-color-surface);
	}

	.status-header {
		display: flex;
		gap: var(--gr-spacing-3);
		margin-bottom: var(--gr-spacing-3);
	}

	.avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
	}

	.account-info {
		display: flex;
		flex-direction: column;
	}

	.display-name {
		font-weight: 600;
	}

	.username {
		color: var(--gr-color-text-secondary);
		font-size: var(--gr-typography-fontSize-sm);
	}

	.status-content {
		margin-bottom: var(--gr-spacing-3);
	}

	.status-actions {
		display: flex;
		gap: var(--gr-spacing-4);
	}

	.action-btn {
		background: none;
		border: none;
		color: var(--gr-color-text-secondary);
		cursor: pointer;
		padding: var(--gr-spacing-1) var(--gr-spacing-2);
		border-radius: var(--gr-radii-md);
	}

	.action-btn:hover {
		background: var(--gr-color-surface-hover);
	}

	.demo-note {
		padding: var(--gr-spacing-4);
		background: var(--gr-color-surface-alt);
		border-radius: var(--gr-radii-md);
		font-size: var(--gr-typography-fontSize-sm);
	}

	.demo-note code {
		background: var(--gr-color-surface);
		padding: var(--gr-spacing-1) var(--gr-spacing-2);
		border-radius: var(--gr-radii-sm);
	}
</style>

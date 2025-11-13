<script lang="ts">
	import {
		ComposeCompound as Compose,
		type ComposeHandlers,
		type PostVisibility
	} from '@equaltoai/greater-components-fediverse';
	import { Button } from '@equaltoai/greater-components-primitives';
	import type { Status } from '@equaltoai/greater-components-fediverse';

	// Mock status for reply demo
	const mockStatus: Status = {
		id: '123',
		uri: 'https://example.com/status/123',
		url: 'https://example.com/status/123',
		account: {
			id: '456',
			username: 'johndoe',
			acct: 'johndoe@example.com',
			displayName: 'John Doe',
			avatar: 'https://via.placeholder.com/48',
			url: 'https://example.com/@johndoe'
		},
		content: '<p>This is a sample post to reply to!</p>',
		createdAt: new Date().toISOString(),
		visibility: 'public',
		sensitive: false,
		spoilerText: null,
		mediaAttachments: [],
		mentions: [],
		tags: [],
		favourited: false,
		reblogged: false,
		favouritesCount: 5,
		reblogsCount: 2,
		repliesCount: 1
	};

	// Track submitted posts for demo
	let submittedPosts = $state<Array<{ content: string; visibility: PostVisibility; timestamp: string }>>([]);
	let showReplyDemo = $state(false);

	// Basic compose handler
	const basicHandlers: ComposeHandlers = {
		onSubmit: async (data) => {
			console.log('Basic compose submitted:', data);
			submittedPosts = [
				...submittedPosts,
				{
					content: data.content,
					visibility: data.visibility,
					timestamp: new Date().toISOString()
				}
			];
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 500));
		}
	};

	// Reply compose handler
	const replyHandlers: ComposeHandlers = {
		onSubmit: async (data) => {
			console.log('Reply submitted:', data);
			submittedPosts = [
				...submittedPosts,
				{
					content: `Replying to ${mockStatus.account.acct}: ${data.content}`,
					visibility: data.visibility,
					timestamp: new Date().toISOString()
				}
			];
			await new Promise((resolve) => setTimeout(resolve, 500));
		}
	};

	// Media upload handler (mock)
	const mediaHandlers: ComposeHandlers = {
		onSubmit: async (data) => {
			console.log('Post with media submitted:', data);
			submittedPosts = [
				...submittedPosts,
				{
					content: `${data.content} (${data.mediaAttachments?.length || 0} attachments)`,
					visibility: data.visibility,
					timestamp: new Date().toISOString()
				}
			];
			await new Promise((resolve) => setTimeout(resolve, 1000));
		},
		onMediaUpload: async (file: File) => {
			// Simulate upload progress
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return {
				id: `media-${Date.now()}`,
				type: file.type.startsWith('image/') ? 'image' : 'video',
				url: URL.createObjectURL(file),
				previewUrl: URL.createObjectURL(file),
				description: ''
			};
		}
	};

	// Content warning handler
	const cwHandlers: ComposeHandlers = {
		onSubmit: async (data) => {
			console.log('Post with CW submitted:', data);
			submittedPosts = [
				...submittedPosts,
				{
					content: `CW: ${data.contentWarning || 'none'} | ${data.content}`,
					visibility: data.visibility,
					timestamp: new Date().toISOString()
				}
			];
			await new Promise((resolve) => setTimeout(resolve, 500));
		}
	};

	// Full featured handler
	const fullHandlers: ComposeHandlers = {
		onSubmit: async (data) => {
			console.log('Full featured post submitted:', data);
			submittedPosts = [
				...submittedPosts,
				{
					content: `${data.contentWarningEnabled ? `[CW: ${data.contentWarning}] ` : ''}${data.content} (${data.mediaAttachments?.length || 0} media)`,
					visibility: data.visibility,
					timestamp: new Date().toISOString()
				}
			];
			await new Promise((resolve) => setTimeout(resolve, 800));
		},
		onMediaUpload: async (file: File) => {
			await new Promise((resolve) => setTimeout(resolve, 800));
			return {
				id: `media-${Date.now()}`,
				type: file.type.startsWith('image/') ? 'image' : 'video',
				url: URL.createObjectURL(file),
				previewUrl: URL.createObjectURL(file),
				description: ''
			};
		}
	};
</script>

<div class="compose-demo-page">
	<header class="demo-header">
		<h1>Compose Component Demo</h1>
		<p>Interactive examples of the Compose compound component for creating posts</p>
	</header>

	<section class="demo-section">
		<h2>1. Basic Compose</h2>
		<p class="demo-description">
			Simple post composition with character count and submit button.
		</p>
		<div class="compose-container">
			<Compose.Root
				config={{
					characterLimit: 500,
					placeholder: "What's on your mind?"
				}}
				handlers={basicHandlers}
			>
				<Compose.Editor rows={4} autofocus={false} />
				<div class="compose-actions">
					<Compose.CharacterCount />
					<Compose.Submit />
				</div>
			</Compose.Root>
		</div>
	</section>

	<section class="demo-section">
		<h2>2. Compose with Visibility Selector</h2>
		<p class="demo-description">
			Post composition with visibility options (public, unlisted, private, direct).
		</p>
		<div class="compose-container">
			<Compose.Root
				config={{
					characterLimit: 500,
					defaultVisibility: 'public'
				}}
				handlers={basicHandlers}
			>
				<Compose.Editor rows={4} />
				<div class="compose-actions">
					<Compose.VisibilitySelect />
					<Compose.CharacterCount />
					<Compose.Submit />
				</div>
			</Compose.Root>
		</div>
	</section>

	<section class="demo-section">
		<h2>3. Compose with Media Upload</h2>
		<p class="demo-description">
			Post composition with media attachment support (drag & drop or click to upload).
		</p>
		<div class="compose-container">
			<Compose.Root
				config={{
					characterLimit: 500,
					allowMedia: true,
					maxMediaAttachments: 4
				}}
				handlers={mediaHandlers}
			>
				<Compose.Editor rows={4} />
				<Compose.MediaUpload />
				<div class="compose-actions">
					<Compose.CharacterCount />
					<Compose.Submit />
				</div>
			</Compose.Root>
		</div>
	</section>

	<section class="demo-section">
		<h2>4. Compose with Content Warning</h2>
		<p class="demo-description">
			Post composition with content warning (spoiler text) support.
		</p>
		<div class="compose-container">
			<Compose.Root
				config={{
					characterLimit: 500,
					allowContentWarnings: true
				}}
				handlers={cwHandlers}
			>
				<Compose.Editor rows={4} />
				<div class="compose-actions">
					<Compose.CharacterCount />
					<Compose.Submit />
				</div>
			</Compose.Root>
		</div>
	</section>

	<section class="demo-section">
		<h2>5. Reply to Post</h2>
		<p class="demo-description">
			Compose a reply to an existing post. The component automatically handles mention formatting.
		</p>
		<div class="reply-demo">
			<div class="original-post">
				<div class="post-header">
					<img src={mockStatus.account.avatar} alt={mockStatus.account.displayName} class="avatar" />
					<div class="post-author">
						<strong>{mockStatus.account.displayName}</strong>
						<span class="username">@{mockStatus.account.acct}</span>
					</div>
				</div>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<div class="post-content">{@html mockStatus.content}</div>
			</div>
			<Button variant="outline" size="sm" onclick={() => (showReplyDemo = !showReplyDemo)}>
				{showReplyDemo ? 'Hide Reply' : 'Show Reply'}
			</Button>
			{#if showReplyDemo}
				<div class="compose-container">
					<Compose.Root
						config={{
							characterLimit: 500
						}}
						initialState={{
							inReplyTo: mockStatus.id,
							content: `@${mockStatus.account.acct} `
						}}
						handlers={replyHandlers}
					>
						<Compose.Editor rows={3} />
						<div class="compose-actions">
							<Compose.CharacterCount />
							<Compose.Submit text="Reply" />
						</div>
					</Compose.Root>
				</div>
			{/if}
		</div>
	</section>

	<section class="demo-section">
		<h2>6. Full Featured Compose</h2>
		<p class="demo-description">
			Complete compose experience with all features: media, content warnings, visibility, and character counting.
		</p>
		<div class="compose-container">
			<Compose.Root
				config={{
					characterLimit: 500,
					allowMedia: true,
					maxMediaAttachments: 4,
					allowContentWarnings: true,
					defaultVisibility: 'public'
				}}
				handlers={fullHandlers}
			>
				<Compose.Editor rows={5} />
				<Compose.MediaUpload />
				<div class="compose-actions">
					<Compose.VisibilitySelect />
					<Compose.CharacterCount />
					<Compose.Submit />
				</div>
			</Compose.Root>
		</div>
	</section>

	{#if submittedPosts.length > 0}
		<section class="demo-section">
			<h2>Submitted Posts</h2>
			<div class="submitted-posts">
				{#each submittedPosts as post (post.timestamp)}
					<div class="submitted-post">
						<div class="post-meta">
							<span class="visibility-badge">{post.visibility}</span>
							<span class="timestamp">
								{new Date(post.timestamp).toLocaleTimeString()}
							</span>
						</div>
						<div class="post-content">{post.content}</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}
</div>

<style>
	.compose-demo-page {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.demo-header {
		margin-bottom: 3rem;
		text-align: center;
	}

	.demo-header h1 {
		margin: 0 0 0.5rem;
		font-size: 2rem;
		color: var(--gr-semantic-foreground-primary, #0f172a);
	}

	.demo-header p {
		margin: 0;
		color: var(--gr-semantic-foreground-secondary, #64748b);
		font-size: 1.125rem;
	}

	.demo-section {
		margin-bottom: 4rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid var(--gr-semantic-border-subtle, #e2e8f0);
	}

	.demo-section:last-child {
		border-bottom: none;
	}

	.demo-section h2 {
		margin: 0 0 0.5rem;
		font-size: 1.5rem;
		color: var(--gr-semantic-foreground-primary, #0f172a);
	}

	.demo-description {
		margin: 0 0 1.5rem;
		color: var(--gr-semantic-foreground-secondary, #64748b);
		font-size: 0.9375rem;
	}

	.compose-container {
		background: var(--gr-semantic-background-primary, #ffffff);
		border: 1px solid var(--gr-semantic-border-subtle, #e2e8f0);
		border-radius: var(--gr-radius-lg, 12px);
		padding: 1rem;
	}

	.compose-actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 1rem;
		flex-wrap: wrap;
	}

	.reply-demo {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.original-post {
		background: var(--gr-semantic-background-secondary, #f8fafc);
		border: 1px solid var(--gr-semantic-border-subtle, #e2e8f0);
		border-radius: var(--gr-radius-lg, 12px);
		padding: 1rem;
	}

	.post-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
	}

	.post-author {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.post-author strong {
		font-size: 0.9375rem;
		color: var(--gr-semantic-foreground-primary, #0f172a);
	}

	.username {
		font-size: 0.875rem;
		color: var(--gr-semantic-foreground-secondary, #64748b);
	}

	.post-content {
		color: var(--gr-semantic-foreground-primary, #0f172a);
		line-height: 1.5;
	}

	.submitted-posts {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.submitted-post {
		background: var(--gr-semantic-background-secondary, #f8fafc);
		border: 1px solid var(--gr-semantic-border-subtle, #e2e8f0);
		border-radius: var(--gr-radius-md, 8px);
		padding: 1rem;
	}

	.post-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.5rem;
	}

	.visibility-badge {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		background: var(--gr-color-primary-100, #dbeafe);
		color: var(--gr-color-primary-700, #1e40af);
		border-radius: var(--gr-radius-sm, 4px);
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.timestamp {
		font-size: 0.875rem;
		color: var(--gr-semantic-foreground-secondary, #64748b);
	}

	.submitted-post .post-content {
		color: var(--gr-semantic-foreground-primary, #0f172a);
		white-space: pre-wrap;
		word-break: break-word;
	}

	@media (max-width: 640px) {
		.compose-demo-page {
			padding: 1rem 0.5rem;
		}

		.demo-section {
			margin-bottom: 3rem;
		}

		.compose-actions {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>


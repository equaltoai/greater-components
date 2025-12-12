<script lang="ts">
	// Mock data for demonstration
	const mockArticles = [
		{
			id: '1',
			title: 'Getting Started with Greater Components',
			excerpt: 'Learn how to build beautiful Fediverse applications with Greater Components...',
			publishedAt: new Date().toISOString(),
			author: {
				name: 'Demo Author',
				avatar: 'https://via.placeholder.com/40',
			},
			readingTime: '5 min read',
			tags: ['tutorial', 'getting-started'],
		},
		{
			id: '2',
			title: 'Building a Blog with the Blog Face',
			excerpt:
				'A comprehensive guide to using the blog face components for your publishing platform...',
			publishedAt: new Date(Date.now() - 86400000).toISOString(),
			author: {
				name: 'Greater Team',
				avatar: 'https://via.placeholder.com/40',
			},
			readingTime: '8 min read',
			tags: ['blog', 'face', 'tutorial'],
		},
	];
</script>

<svelte:head>
	<title>Home | Blog App</title>
</svelte:head>

<div class="blog-home">
	<header class="page-header">
		<h1>Latest Articles</h1>
		<p>Thoughts on building for the Fediverse</p>
	</header>

	<div class="articles-list">
		{#each mockArticles as article (article.id)}
			<article class="article-card">
				<h2 class="article-title">
					<a href="/{article.id}">{article.title}</a>
				</h2>
				<p class="article-excerpt">{article.excerpt}</p>
				<div class="article-meta">
					<div class="author">
						<img src={article.author.avatar} alt={article.author.name} class="author-avatar" />
						<span>{article.author.name}</span>
					</div>
					<span class="reading-time">{article.readingTime}</span>
				</div>
				<div class="article-tags">
					{#each article.tags as tag (tag)}
						<span class="tag">{tag}</span>
					{/each}
				</div>
			</article>
		{/each}
	</div>

	<p class="demo-note">
		<strong>Note:</strong> This is a demo with mock data. Run <code>greater add faces/blog</code> to install
		the full Article, Author, and Navigation components.
	</p>
</div>

<style>
	.blog-home {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-6);
	}

	.page-header {
		text-align: center;
		margin-bottom: var(--gr-spacing-4);
	}

	.page-header h1 {
		margin: 0 0 var(--gr-spacing-2);
		font-size: var(--gr-typography-fontSize-3xl);
	}

	.page-header p {
		color: var(--gr-color-text-secondary);
		margin: 0;
	}

	.articles-list {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-6);
	}

	.article-card {
		padding: var(--gr-spacing-6);
		border: 1px solid var(--gr-color-border);
		border-radius: var(--gr-radii-lg);
		background: var(--gr-color-surface);
	}

	.article-title {
		margin: 0 0 var(--gr-spacing-3);
		font-size: var(--gr-typography-fontSize-xl);
	}

	.article-title a {
		color: var(--gr-color-text-primary);
		text-decoration: none;
	}

	.article-title a:hover {
		color: var(--gr-color-primary-600);
	}

	.article-excerpt {
		color: var(--gr-color-text-secondary);
		margin: 0 0 var(--gr-spacing-4);
		line-height: 1.6;
	}

	.article-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--gr-spacing-3);
	}

	.author {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-2);
	}

	.author-avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
	}

	.reading-time {
		color: var(--gr-color-text-secondary);
		font-size: var(--gr-typography-fontSize-sm);
	}

	.article-tags {
		display: flex;
		gap: var(--gr-spacing-2);
	}

	.tag {
		padding: var(--gr-spacing-1) var(--gr-spacing-2);
		background: var(--gr-color-surface-alt);
		border-radius: var(--gr-radii-sm);
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-text-secondary);
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

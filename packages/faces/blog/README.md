# @equaltoai/greater-components-blog

Blog/Medium-style UI components for long-form publishing applications. Part of the Greater Components library.

## Installation

```bash
# Using the Greater CLI (recommended)
greater add faces/blog

# Or install directly
pnpm add @equaltoai/greater-components-blog
```

## Quick Start

```svelte
<script>
	import { Article, Author } from '@equaltoai/greater-components-blog';
	import '@equaltoai/greater-components-blog/style.css';
</script>

<!-- Display a blog article -->
<Article.Root article={post}>
	<Article.Header />
	<Article.TableOfContents />
	<Article.Content />
	<Article.ShareBar />
	<Article.Footer />
</Article.Root>
```

## CSS Setup

Import the required CSS files in your app's entry point:

```typescript
// Import design tokens first
import '@equaltoai/greater-components/tokens/theme.css';

// Then import the blog face styles
import '@equaltoai/greater-components-blog/style.css';
```

## Component Inventory

### Article Components

| Component                 | Description                               | Props                           |
| ------------------------- | ----------------------------------------- | ------------------------------- |
| `Article.Root`            | Container for article compound component  | `article`, `config`, `handlers` |
| `Article.Header`          | Title, subtitle, metadata, featured image | -                               |
| `Article.Content`         | Rendered article body with typography     | -                               |
| `Article.Footer`          | Author card, tags, share buttons          | -                               |
| `Article.TableOfContents` | Auto-generated navigation from headings   | `position`                      |
| `Article.ReadingProgress` | Scroll progress indicator                 | `position`                      |
| `Article.ShareBar`        | Social sharing buttons                    | `platforms`                     |
| `Article.RelatedPosts`    | Related content suggestions               | `posts`, `limit`                |

### Author Components

| Component            | Description                             | Props                   |
| -------------------- | --------------------------------------- | ----------------------- |
| `Author.Root`        | Container for author compound component | `author`                |
| `Author.Card`        | Full author card with bio               | `showBio`, `showSocial` |
| `Author.Bio`         | Author biography text                   | -                       |
| `Author.Avatar`      | Author avatar image                     | `size`                  |
| `Author.SocialLinks` | Social media link buttons               | -                       |

### Publication Components

| Component                      | Description                                  | Props                   |
| ------------------------------ | -------------------------------------------- | ----------------------- |
| `Publication.Root`             | Container for publication compound component | `publication`, `config` |
| `Publication.Banner`           | Publication header banner                    | -                       |
| `Publication.Logo`             | Publication logo                             | `size`                  |
| `Publication.Description`      | Publication description                      | -                       |
| `Publication.NewsletterSignup` | Email subscription form                      | `onSubscribe`           |

### Navigation Components

| Component                 | Description                                 | Props                            |
| ------------------------- | ------------------------------------------- | -------------------------------- |
| `Navigation.Root`         | Container for navigation compound component | `archives`, `tags`, `categories` |
| `Navigation.ArchiveView`  | Month/year archive browser                  | `groupBy`                        |
| `Navigation.TagCloud`     | Tag visualization with sizing               | `maxTags`, `minSize`, `maxSize`  |
| `Navigation.CategoryList` | Hierarchical category list                  | `showCounts`                     |
| `Navigation.Breadcrumbs`  | Breadcrumb navigation                       | `items`                          |

### Editor Components

| Component                | Description                             | Props                           |
| ------------------------ | --------------------------------------- | ------------------------------- |
| `Editor.Root`            | Container for editor compound component | `article`, `config`, `handlers` |
| `Editor.Toolbar`         | Formatting controls toolbar             | `tools`                         |
| `Editor.DraftManager`    | Draft save and schedule interface       | `drafts`, `onSave`              |
| `Editor.RevisionHistory` | Version comparison view                 | `revisions`, `onRestore`        |
| `Editor.SEOMetadata`     | Title, description, social cards        | `metadata`, `onChange`          |
| `Editor.CanonicalUrl`    | Cross-posting URL management            | `url`, `onChange`               |
| `Editor.PublishControls` | Publish/schedule buttons                | `onPublish`, `onSchedule`       |

## Patterns

The blog face includes these reusable patterns:

- **ReadingTime** - Estimated reading time display
- **ProgressIndicator** - Scroll progress visualization
- **SeriesNavigation** - Multi-part article navigation
- **FeaturedImage** - Hero image with caption
- **CommentSection** - Comment display and submission
- **ReactionBar** - Article reactions (claps, likes)
- **BookmarkButton** - Save for later
- **StructuredData** - JSON-LD for SEO
- **OpenGraphMeta** - Social sharing meta tags

## Shared Module References

The blog face can integrate with these shared modules:

```bash
# Authentication (for comments, bookmarks)
greater add shared/auth

# Search (for article search)
greater add shared/search
```

## Theme Customization

### Using CSS Variables

Override design tokens to customize the theme:

```css
:root {
	/* Typography */
	--gr-blog-font-family-body: Georgia, serif;
	--gr-blog-font-family-heading: system-ui, sans-serif;

	/* Content width */
	--gr-blog-content-max-width: 720px;

	/* Reading experience */
	--gr-blog-line-height-body: 1.8;
	--gr-blog-paragraph-spacing: 1.5rem;

	/* Progress indicator */
	--gr-blog-progress-color: #3b82f6;
	--gr-blog-progress-height: 4px;

	/* Table of contents */
	--gr-blog-toc-active-color: #3b82f6;
}
```

### Theme Variants

```svelte
<script>
	import '@equaltoai/greater-components/tokens/themes/dark.css';
</script>

<!-- Set theme on root element -->
<div data-theme="dark">
	<Article.Root article={post}>
		<!-- ... -->
	</Article.Root>
</div>
```

## Usage Examples

### Basic Article Display

```svelte
<script>
	import { Article } from '@equaltoai/greater-components-blog';

	const article = {
		id: '1',
		slug: 'getting-started',
		metadata: {
			title: 'Getting Started with Greater Components',
			description: 'Learn how to build beautiful UIs...',
			publishedAt: new Date(),
			readingTime: 5,
			tags: ['tutorial', 'svelte'],
		},
		content: '<p>Your article content here...</p>',
		contentFormat: 'html',
		author: {
			id: '1',
			name: 'Jane Doe',
			avatar: '/avatars/jane.jpg',
		},
		isPublished: true,
	};
</script>

<Article.Root {article} config={{ showTableOfContents: true }}>
	<Article.ReadingProgress />
	<Article.Header />
	<div class="article-layout">
		<Article.TableOfContents />
		<Article.Content />
	</div>
	<Article.ShareBar />
	<Article.Footer />
</Article.Root>
```

### Newsletter Signup

```svelte
<script>
	import { Publication } from '@equaltoai/greater-components-blog';

	const publication = {
		id: '1',
		name: 'Tech Weekly',
		tagline: 'Your weekly dose of tech news',
		hasNewsletter: true,
		subscriberCount: 10000,
	};

	async function handleSubscribe(email: string) {
		await fetch('/api/subscribe', {
			method: 'POST',
			body: JSON.stringify({ email }),
		});
	}
</script>

<Publication.Root {publication}>
	<Publication.NewsletterSignup onSubscribe={handleSubscribe} />
</Publication.Root>
```

### Archive Navigation

```svelte
<script>
	import { Navigation } from '@equaltoai/greater-components-blog';

	const archives = [
		{ year: 2024, month: 6, count: 12, url: '/archive/2024/06' },
		{ year: 2024, month: 5, count: 8, url: '/archive/2024/05' },
	];

	const tags = [
		{ id: '1', name: 'JavaScript', slug: 'javascript', count: 45 },
		{ id: '2', name: 'Svelte', slug: 'svelte', count: 32 },
	];
</script>

<Navigation.Root {archives} {tags}>
	<Navigation.ArchiveView groupBy="month" />
	<Navigation.TagCloud maxTags={20} />
</Navigation.Root>
```

## Events

### Article Events

| Event        | Payload                 | Description             |
| ------------ | ----------------------- | ----------------------- |
| `onBookmark` | `{ article }`           | User bookmarked article |
| `onShare`    | `{ article, platform }` | User shared article     |
| `onReact`    | `{ article, reaction }` | User added reaction     |
| `onComment`  | `{ article, comment }`  | User submitted comment  |

### Editor Events

| Event        | Payload             | Description           |
| ------------ | ------------------- | --------------------- |
| `onSave`     | `{ draft }`         | Draft was saved       |
| `onPublish`  | `{ article }`       | Article was published |
| `onSchedule` | `{ article, date }` | Article was scheduled |

## Accessibility

All blog face components follow WCAG 2.1 AA guidelines:

- Proper heading hierarchy in articles
- Keyboard navigation for all interactive elements
- Screen reader announcements for progress indicators
- Focus management in editor components
- Skip links for long-form content
- Reduced motion support for animations

## License

AGPL-3.0-only

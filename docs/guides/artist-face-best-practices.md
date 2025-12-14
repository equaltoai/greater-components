# Artist Face Best Practices Guide

> Guidelines for performance, accessibility, federation, and AI transparency

## Performance Optimization

### Image Loading

#### Progressive Loading

Always use progressive loading for artwork images:

```svelte
<Artwork.Image src={artwork.imageUrl} placeholder={artwork.thumbnailUrl} loading="lazy" />
```

#### Responsive Images

Provide multiple image sizes:

```svelte
<Artwork.Image
	src={artwork.imageUrl}
	srcset={`
    ${artwork.thumbnailUrl} 200w,
    ${artwork.mediumUrl} 600w,
    ${artwork.imageUrl} 1200w
  `}
	sizes="(max-width: 600px) 200px, (max-width: 1200px) 600px, 1200px"
/>
```

### Virtual Scrolling

Enable virtual scrolling for large galleries:

```svelte
<GalleryGrid items={artworks} virtualScrolling={true} overscan={5} estimatedItemHeight={300} />
```

### Lazy Loading Components

```svelte
<script>
	import { onMount } from 'svelte';

	let MediaViewer;

	onMount(async () => {
		const module = await import('@equaltoai/greater-components-artist');
		MediaViewer = module.MediaViewer;
	});
</script>
```

### Performance Targets

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Performance: ≥ 90
- Core Web Vitals: All green

## Accessibility Implementation

### Alt Text

Always provide meaningful alt text:

```svelte
<Artwork.Image
	alt={artwork.altText ||
		`${artwork.title} by ${artwork.artist.name}. ${artwork.metadata.medium}, ${artwork.metadata.year}.`}
/>
```

### Keyboard Navigation

Ensure all interactive elements are keyboard accessible:

```svelte
<ArtworkCard
	{artwork}
	tabindex={0}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			openViewer(artwork);
		}
	}}
/>
```

### Focus Management

Manage focus in modals and viewers:

```svelte
<MediaViewer
	{artworks}
	trapFocus={true}
	returnFocusOnClose={true}
	initialFocusRef={closeButtonRef}
/>
```

### Screen Reader Announcements

```svelte
<GalleryGrid
	items={artworks}
	aria-label="Artwork gallery"
	aria-live="polite"
	announceOnLoad={true}
/>
```

### Color Contrast

Ensure sufficient contrast for overlays:

```css
.artwork-overlay {
	background: rgba(0, 0, 0, 0.7); /* Minimum 4.5:1 contrast */
	color: white;
}
```

### Reduced Motion

Respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
	.artwork-card {
		transition: none;
	}

	.gallery-animation {
		animation: none;
	}
}
```

## Federation Considerations

### ActivityPub Integration

Convert artworks to ActivityPub format:

```typescript
import { toActivityPubNote } from '@equaltoai/greater-components-artist';

const note = toActivityPubNote(artwork, {
	baseUrl: 'https://example.com',
	includeMetadata: true,
	includeAIDisclosure: true,
});
```

### URI Generation

Use consistent URI patterns:

```typescript
import { generateArtworkUri } from '@equaltoai/greater-components-artist';

const uri = generateArtworkUri(artwork, {
	baseUrl: 'https://example.com',
	format: 'activitypub',
});
// Returns: https://example.com/artwork/123
```

### Metadata Serialization

Preserve artwork metadata in federation:

```typescript
import { serializeMetadata } from '@equaltoai/greater-components-artist';

const metadata = serializeMetadata(artwork.metadata, {
	includeAIUsage: true,
	includeLicense: true,
	includeNoAI: artwork.aiPolicy?.optedOutOfTraining,
});
```

### Rights Federation

Communicate licensing and AI opt-out:

```typescript
import { serializeLicense, serializeNoAI } from '@equaltoai/greater-components-artist';

const rights = {
	license: serializeLicense(artwork.license),
	noAI: serializeNoAI(artwork.aiPolicy),
};
```

## AI Transparency Guidelines

### Always Disclose AI Usage

```svelte
<Artwork.Root {artwork}>
	<Artwork.Image />
	<Artwork.Title />
	{#if artwork.aiUsage?.usedAI}
		<Artwork.AIDisclosure usage={artwork.aiUsage} />
	{/if}
</Artwork.Root>
```

### Provide Detailed Breakdowns

```svelte
<AIDisclosure
	usage={{
		usedAI: true,
		types: ['reference-generation', 'color-suggestion'],
		tools: ['Midjourney', 'Adobe Firefly'],
		percentage: 15,
		description: 'AI was used for initial references only. All final artwork is hand-painted.',
	}}
	variant="detailed"
	expandable={true}
/>
```

### Document the Process

```svelte
<ProcessDocumentation
  steps={[
    { type: 'human', title: 'Concept Sketch', ... },
    { type: 'ai-assisted', title: 'Reference Generation', aiTool: 'Midjourney', ... },
    { type: 'human', title: 'Final Painting', ... }
  ]}
  showAIContribution={true}
/>
```

### Respect Opt-Out Preferences

```svelte
<script>
	// Check artist's AI policy before any AI features
	if (!artist.aiPolicy?.optedOutOfTraining) {
		// Safe to use AI features
	}
</script>
```

### Display No-AI Badges

```svelte
{#if !artwork.aiUsage?.usedAI}
	<HumanMadeBadge verified={true} />
{/if}

{#if artwork.aiPolicy?.optedOutOfTraining}
	<NoAITrainingBadge />
{/if}
```

## Theme Customization

### CSS Custom Properties

```css
:root {
	/* Gallery */
	--gallery-gap: 16px;
	--gallery-card-radius: 8px;

	/* Artwork */
	--artwork-overlay-bg: rgba(0, 0, 0, 0.6);
	--artwork-title-size: 1.25rem;

	/* Profile */
	--profile-banner-height: 250px;
	--profile-avatar-size: 120px;
}
```

### Dark Mode

```css
:root[data-theme='dark'] {
	--gallery-card-bg: #1a1a2e;
	--artwork-overlay-bg: rgba(0, 0, 0, 0.8);
	--profile-surface: #16213e;
}
```

### Art-First Design

Minimize UI chrome to let artwork breathe:

```css
.artwork-card {
	/* No borders or shadows by default */
	border: none;
	box-shadow: none;
}

.artwork-card:hover {
	/* Subtle interaction feedback */
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

## Error Handling

### Graceful Degradation

```svelte
<Artwork.Image
	src={artwork.imageUrl}
	fallback="/placeholder-artwork.svg"
	onerror={() => console.error('Failed to load artwork image')}
/>
```

### Loading States

```svelte
<GalleryGrid items={artworks} loading={isLoading}>
	{#snippet loading()}
		<GallerySkeleton count={12} />
	{/snippet}

	{#snippet empty()}
		<EmptyGallery message="No artworks found" />
	{/snippet}
</GalleryGrid>
```

## Testing Recommendations

### Unit Tests

```typescript
import { render } from '@testing-library/svelte';
import { Artwork } from '@equaltoai/greater-components-artist';

test('renders artwork with metadata', () => {
	const { getByText } = render(Artwork.Root, { props: { artwork } });
	expect(getByText(artwork.title)).toBeInTheDocument();
});
```

### Accessibility Tests

```typescript
import { axe } from 'jest-axe';

test('artwork card has no accessibility violations', async () => {
	const { container } = render(ArtworkCard, { props: { artwork } });
	const results = await axe(container);
	expect(results).toHaveNoViolations();
});
```

### Visual Regression Tests

```typescript
test('gallery grid matches snapshot', async () => {
	const { container } = render(GalleryGrid, { props: { items: artworks } });
	expect(container).toMatchSnapshot();
});
```

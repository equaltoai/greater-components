# Artist App Example

A complete SvelteKit application demonstrating Greater Components Artist Face usage.

## Features

- 🎨 Gallery with masonry layout and virtual scrolling
- 🖼️ Artwork display with full metadata
- 👤 Artist profile with portfolio sections
- 🔍 AI-powered discovery with color and style search
- 📝 Work-in-progress tracking
- 💬 Critique mode with annotations
- 💰 Commission workflow

## Quick Start

```bash
# Install dependencies
pnpm install

# Initialize Greater Components
greater init --face artist

# Add artist face components
greater add faces/artist

# Start development server
pnpm dev
```

## Project Structure

```
artist-app/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   └── ui/          # Greater Components (added via CLI)
│   │   │       ├── Artwork/
│   │   │       ├── Gallery/
│   │   │       ├── ArtistProfile/
│   │   │       ├── Discovery/
│   │   │       └── ...
│   │   ├── stores/
│   │   │   └── stores.ts    # App-specific stores
│   │   └── api.ts           # API integration
│   └── routes/
│       ├── +layout.svelte   # Root layout with CSS imports
│       ├── +page.svelte     # Home gallery
│       ├── artwork/
│       │   └── [id]/
│       │       └── +page.svelte  # Artwork detail
│       ├── artist/
│       │   └── [id]/
│       │       └── +page.svelte  # Artist profile
│       ├── discover/
│       │   └── +page.svelte      # Discovery page
│       ├── commission/
│       │   └── +page.svelte      # Commission workflow
│       └── upload/
│           └── +page.svelte      # Artwork upload
├── components.json          # Greater Components config
├── package.json
└── svelte.config.js
```

## Usage Examples

### Home Gallery

```svelte
<script>
	import { GalleryGrid } from '$lib/components/ui/Gallery';
	import { createGalleryStore } from '$lib/stores/stores';

	const gallery = createGalleryStore({ type: 'home' });
</script>

<GalleryGrid
	items={$gallery.items}
	loading={$gallery.loading}
	onLoadMore={() => gallery.loadMore()}
/>
```

### Artwork Display

```svelte
<script>
	import * as Artwork from '$lib/components/ui/Artwork';
</script>

<Artwork.Root {artwork}>
	<Artwork.Image />
	<Artwork.Title />
	<Artwork.Attribution />
	<Artwork.Metadata />
	<Artwork.Stats />
	<Artwork.Actions onLike={handleLike} onCollect={handleCollect} />
</Artwork.Root>
```

### Artist Profile

```svelte
<script>
	import * as ArtistProfile from '$lib/components/ui/ArtistProfile';
</script>

<ArtistProfile.Root {artist} isOwnProfile={false}>
	<ArtistProfile.HeroBanner />
	<ArtistProfile.Avatar />
	<ArtistProfile.Name />
	<ArtistProfile.Badges />
	<ArtistProfile.Statement />
	<ArtistProfile.Stats />
	<ArtistProfile.Sections />
	<ArtistProfile.Actions />
</ArtistProfile.Root>
```

### Discovery

```svelte
<script>
	import * as Discovery from '$lib/components/ui/Discovery';
	import { ColorPaletteSearch, StyleFilter } from '$lib/components/ui/Discovery';
</script>

<Discovery.Root onSearch={handleSearch}>
	<Discovery.SearchBar />
	<ColorPaletteSearch onSearch={handleColorSearch} />
	<StyleFilter onSelect={handleStyleFilter} />
	<Discovery.Results items={results} />
</Discovery.Root>
```

### Commission Workflow

```svelte
<script>
	import * as Commission from '$lib/components/ui/CreativeTools/CommissionWorkflow';
</script>

<Commission.Root {commission} role="artist">
	<Commission.Request />
	<Commission.Quote />
	<Commission.Contract />
	<Commission.Progress />
	<Commission.Delivery />
</Commission.Root>
```

## Customization

### Theme

```css
/* src/app.css */
:root {
	--artist-primary: #6366f1;
	--artist-surface: #1a1a2e;
	--artist-border: #2d2d44;
}
```

### Components Config

```json
{
	"face": "artist",
	"style": "default",
	"tailwind": false,
	"components": {
		"path": "src/lib/components/ui"
	}
}
```

## API Integration

```typescript
// src/lib/api.ts
import { createArtistAdapter } from '@equaltoai/greater-components-artist';

export const artistApi = createArtistAdapter({
	apiUrl: import.meta.env.VITE_API_URL,
	auth: {
		getToken: () => localStorage.getItem('token'),
	},
});
```

## License

MIT

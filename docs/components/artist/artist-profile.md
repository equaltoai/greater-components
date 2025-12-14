# Artist Profile Components

> Components for artist portfolios, profiles, and professional presentation

## Overview

Artist Profile components transform user profiles into legitimate portfolio experiences with customizable gallery sections, professional badges, and comprehensive statistics.

## ArtistProfile.Root

Container compound component for artist gallery/portfolio.

### Basic Usage

```svelte
<script lang="ts">
	import { ArtistProfile } from '@equaltoai/greater-components-artist';
	import type { ArtistData } from '@equaltoai/greater-components-artist/types';

	const artist: ArtistData = {
		id: 'artist-1',
		slug: 'jane-artist',
		name: 'Jane Artist',
		username: 'janeartist',
		pronouns: 'she/her',
		shortBio: 'Contemporary oil painter exploring light and shadow',
		statement: 'My work explores the interplay between natural light...',
		avatar: '/avatars/jane.jpg',
		heroBanner: '/banners/jane-hero.jpg',
		location: 'Portland, OR',
		primaryMedium: 'Oil Painting',
		mediums: ['Oil Painting', 'Watercolor', 'Mixed Media'],
		badges: [
			{ type: 'verified', label: 'Verified Artist', verified: true },
			{ type: 'pro', label: 'Pro Member', verified: true },
		],
		stats: {
			artworkCount: 127,
			followerCount: 3420,
			followingCount: 156,
			totalViews: 45000,
			totalLikes: 8900,
		},
		acceptsCommissions: true,
		commissionStatus: 'Open for commissions',
	};

	let isOwnProfile = $state(false);
</script>

<ArtistProfile.Root {artist} {isOwnProfile}>
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

### Props

| Prop           | Type              | Default  | Description         |
| -------------- | ----------------- | -------- | ------------------- |
| `artist`       | `ArtistData`      | required | Artist profile data |
| `isOwnProfile` | `boolean`         | `false`  | Viewing own profile |
| `handlers`     | `ProfileHandlers` | `{}`     | Event handlers      |

### Event Handlers

```typescript
interface ProfileHandlers {
	onFollow?: (artist: ArtistData) => void;
	onMessage?: (artist: ArtistData) => void;
	onCommission?: (artist: ArtistData) => void;
	onShare?: (artist: ArtistData) => void;
	onEdit?: () => void;
}
```

## Subcomponents

### ArtistProfile.HeroBanner

Signature artwork banner (rotating or static).

```svelte
<ArtistProfile.HeroBanner mode="static" height={300} parallax={true} />
```

| Prop               | Type                                    | Default    | Description             |
| ------------------ | --------------------------------------- | ---------- | ----------------------- |
| `mode`             | `'static' \| 'rotating' \| 'slideshow'` | `'static'` | Banner mode             |
| `height`           | `number`                                | `250`      | Banner height in pixels |
| `parallax`         | `boolean`                               | `false`    | Enable parallax effect  |
| `rotationInterval` | `number`                                | `5000`     | Rotation interval (ms)  |

### ArtistProfile.Avatar

Artist avatar with status indicator.

```svelte
<ArtistProfile.Avatar size="xl" showStatus={true} editable={isOwnProfile} />
```

| Prop         | Type                           | Default | Description          |
| ------------ | ------------------------------ | ------- | -------------------- |
| `size`       | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'xl'`  | Avatar size          |
| `showStatus` | `boolean`                      | `true`  | Show online status   |
| `editable`   | `boolean`                      | `false` | Allow avatar editing |

### ArtistProfile.Name

Display name with verification badge.

```svelte
<ArtistProfile.Name showUsername={true} showPronouns={true} />
```

### ArtistProfile.Badges

Professional badges display.

```svelte
<ArtistProfile.Badges maxVisible={5} showTooltips={true} />
```

### ArtistProfile.Statement

Rich-formatted artist statement.

```svelte
<ArtistProfile.Statement truncate={true} maxLength={300} expandable={true} />
```

### ArtistProfile.Stats

Followers, works, exhibitions, collaborations.

```svelte
<ArtistProfile.Stats show={['artworks', 'followers', 'following', 'views']} layout="horizontal" />
```

### ArtistProfile.Sections

Customizable gallery sections.

```svelte
<ArtistProfile.Sections
	sections={[
		{ id: 'featured', title: 'Featured Work', layout: 'featured' },
		{ id: 'recent', title: 'Recent Work', layout: 'grid' },
		{ id: 'collections', title: 'Collections', layout: 'row' },
	]}
	editable={isOwnProfile}
/>
```

### ArtistProfile.Actions

Follow, message, commission buttons.

```svelte
<ArtistProfile.Actions actions={['follow', 'message', 'commission', 'share']} />
```

### ArtistProfile.Edit

Profile editing mode.

```svelte
{#if isOwnProfile}
	<ArtistProfile.Edit onSave={handleSave} onCancel={handleCancel} />
{/if}
```

### ArtistProfile.Timeline

Artist activity timeline.

```svelte
<ArtistProfile.Timeline events={timelineEvents} layout="vertical" />
```

## ArtistBadge

Professional verification/credential badge.

```svelte
<script lang="ts">
	import { ArtistBadge } from '@equaltoai/greater-components-artist';
</script>

<ArtistBadge type="verified" tooltip="Verified professional artist" size="md" />

<ArtistBadge type="educator" tooltip="Art educator with 5+ years experience" />

<ArtistBadge type="institution" tooltip="Affiliated with MoMA" />
```

### Props

| Prop      | Type           | Default  | Description         |
| --------- | -------------- | -------- | ------------------- |
| `type`    | `BadgeType`    | required | Badge type          |
| `tooltip` | `string`       | -        | Explanation tooltip |
| `size`    | `'sm' \| 'md'` | `'md'`   | Badge size          |

### Badge Types

- `verified` - Verified artist identity
- `educator` - Art educator
- `institution` - Institutional affiliation
- `mentor` - Available for mentoring
- `curator` - Curator credentials
- `pro` - Professional member
- `emerging` - Emerging artist
- `established` - Established artist
- `ai-transparent` - AI usage transparency

## PortfolioSection

Customizable gallery section within a profile.

```svelte
<script lang="ts">
	import { PortfolioSection } from '@equaltoai/greater-components-artist';
</script>

<PortfolioSection
	title="Featured Work"
	description="My most celebrated pieces"
	items={featuredArtworks}
	layout="featured"
	editable={isOwnProfile}
/>
```

### Props

| Prop          | Type                            | Default  | Description         |
| ------------- | ------------------------------- | -------- | ------------------- |
| `title`       | `string`                        | required | Section title       |
| `description` | `string`                        | -        | Section description |
| `items`       | `ArtworkData[]`                 | `[]`     | Artworks in section |
| `layout`      | `'grid' \| 'row' \| 'featured'` | `'grid'` | Section layout      |
| `editable`    | `boolean`                       | `false`  | Enable editing      |

### Pre-defined Section Types

```svelte
<!-- Recent Work -->
<PortfolioSection title="Recent Work" items={recentArtworks} layout="grid" />

<!-- Featured -->
<PortfolioSection title="Featured" items={featuredArtworks} layout="featured" />

<!-- Collections -->
<PortfolioSection title="Collections" items={collections} layout="row" />

<!-- Commissions -->
<PortfolioSection title="Commission Examples" items={commissionExamples} layout="grid" />

<!-- Work in Progress -->
<PortfolioSection title="Work in Progress" items={wipArtworks} layout="row" />
```

## Edit Mode

### Enabling Edit Mode

```svelte
<script lang="ts">
	let editMode = $state(false);

	async function handleSave(updates: Partial<ArtistData>) {
		await updateProfile(updates);
		editMode = false;
	}
</script>

<ArtistProfile.Root {artist} isOwnProfile={true}>
	{#if editMode}
		<ArtistProfile.Edit onSave={handleSave} onCancel={() => (editMode = false)} />
	{:else}
		<ArtistProfile.HeroBanner />
		<ArtistProfile.Avatar />
		<!-- ... other components -->
		<button onclick={() => (editMode = true)}>Edit Profile</button>
	{/if}
</ArtistProfile.Root>
```

### Editable Fields

```svelte
<ArtistProfile.Edit>
	<ArtistProfile.Edit.Avatar />
	<ArtistProfile.Edit.Banner />
	<ArtistProfile.Edit.Name />
	<ArtistProfile.Edit.Bio />
	<ArtistProfile.Edit.Statement />
	<ArtistProfile.Edit.Location />
	<ArtistProfile.Edit.Mediums />
	<ArtistProfile.Edit.SocialLinks />
	<ArtistProfile.Edit.CommissionStatus />
</ArtistProfile.Edit>
```

## Professional Mode

Enhanced features for professional artists.

```svelte
<ArtistProfile.Root {artist} mode="professional">
	<ArtistProfile.HeroBanner />
	<ArtistProfile.Avatar />
	<ArtistProfile.Name />
	<ArtistProfile.Badges />
	<ArtistProfile.Statement />
	<ArtistProfile.Stats />

	<!-- Professional-only sections -->
	<ArtistProfile.CV />
	<ArtistProfile.Exhibitions />
	<ArtistProfile.Press />
	<ArtistProfile.ContactForm />
</ArtistProfile.Root>
```

## Accessibility

### Landmark Regions

```svelte
<ArtistProfile.Root {artist}>
	<header>
		<ArtistProfile.HeroBanner />
		<ArtistProfile.Avatar />
		<ArtistProfile.Name />
	</header>

	<main>
		<ArtistProfile.Statement />
		<ArtistProfile.Sections />
	</main>

	<aside>
		<ArtistProfile.Stats />
		<ArtistProfile.Actions />
	</aside>
</ArtistProfile.Root>
```

### Focus Management

```svelte
<ArtistProfile.Root {artist} focusOnMount={true} announceOnLoad={true} />
```

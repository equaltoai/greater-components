# Artist Profile Components (Artist Face)

> Portfolio-style artist profiles as a compound component

## Imports

```ts
import {
	ArtistProfile,
	ArtistBadge,
	PortfolioSection,
} from '@equaltoai/greater-components/faces/artist';
```

## `ArtistProfile`

`ArtistProfile` is a compound component. Use `<ArtistProfile.Root>` to set context, then compose the UI with `ArtistProfile.*`.

```svelte
<script lang="ts">
	import { ArtistProfile } from '@equaltoai/greater-components/faces/artist';

	const artist = {
		id: 'artist-1',
		displayName: 'Jane Artist',
		username: 'janeartist',
		profileUrl: '/artists/janeartist',
		avatar: '/avatars/jane.jpg',
		heroBanner: '/banners/jane-hero.jpg',
		statement: 'My work explores the interplay between natural light...',
		heroArtworks: [],
		badges: [{ type: 'verified', tooltip: 'Verified artist identity' }],
		status: 'online',
		verified: true,
		commissionStatus: 'open',
		stats: {
			followers: 3420,
			following: 156,
			works: 127,
			exhibitions: 4,
			collaborations: 12,
			totalViews: 45000,
		},
		sections: [],
		joinedAt: new Date().toISOString(),
	};
</script>

<ArtistProfile.Root {artist} isOwnProfile={false} showSocial={true}>
	<ArtistProfile.HeroBanner rotating />
	<ArtistProfile.Avatar />
	<ArtistProfile.Name showUsername linkToProfile />
	<ArtistProfile.Badges />
	<ArtistProfile.Statement />
	<ArtistProfile.Stats />
	<ArtistProfile.Actions />
	<ArtistProfile.Sections />
</ArtistProfile.Root>
```

### `ArtistProfile.Root` Props

| Prop             | Type                                     | Default     |
| ---------------- | ---------------------------------------- | ----------- |
| `artist`         | `ArtistData`                             | -           |
| `isOwnProfile`   | `boolean`                                | `false`     |
| `handlers`       | `ProfileHandlers`                        | `{}`        |
| `layout`         | `'gallery' \| 'portfolio' \| 'timeline'` | `'gallery'` |
| `showHeroBanner` | `boolean`                                | `true`      |
| `enableParallax` | `boolean`                                | `true`      |
| `showSocial`     | `boolean`                                | `true`      |
| `class`          | `string`                                 | `''`        |
| `children`       | `Snippet`                                | -           |

### Notes

- “Professional mode” is `showSocial={false}` (hides social affordances like follow in `ArtistProfile.Actions`).
- Edit UI is enabled via `isOwnProfile={true}` and `handlers` (`onEdit`, `onSave`, `onCancel`).

## Subcomponents

### `ArtistProfile.HeroBanner` Props

| Prop               | Type                             | Default |
| ------------------ | -------------------------------- | ------- |
| `height`           | `'sm' \| 'md' \| 'lg' \| 'full'` | `'md'`  |
| `rotating`         | `boolean`                        | `false` |
| `rotationInterval` | `number`                         | `5000`  |
| `class`            | `string`                         | `''`    |

### `ArtistProfile.Avatar` Props

| Prop         | Type                           | Default |
| ------------ | ------------------------------ | ------- |
| `size`       | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'lg'`  |
| `showStatus` | `boolean`                      | `true`  |
| `class`      | `string`                       | `''`    |

### `ArtistProfile.Name` Props

| Prop            | Type                         | Default |
| --------------- | ---------------------------- | ------- |
| `level`         | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1`     |
| `showUsername`  | `boolean`                    | `true`  |
| `linkToProfile` | `boolean`                    | `false` |
| `class`         | `string`                     | `''`    |

### `ArtistProfile.Badges` Props

| Prop         | Type           | Default |
| ------------ | -------------- | ------- |
| `size`       | `'sm' \| 'md'` | `'md'`  |
| `maxVisible` | `number`       | `5`     |
| `class`      | `string`       | `''`    |

### `ArtistProfile.Statement` Props

| Prop         | Type      | Default |
| ------------ | --------- | ------- |
| `maxLines`   | `number`  | `5`     |
| `expandable` | `boolean` | `true`  |
| `class`      | `string`  | `''`    |

### `ArtistProfile.Stats` Props

| Prop        | Type                    | Default                                                |
| ----------- | ----------------------- | ------------------------------------------------------ |
| `show`      | `(keyof ArtistStats)[]` | `['followers','works','exhibitions','collaborations']` |
| `clickable` | `boolean`               | `true`                                                 |
| `direction` | `'row' \| 'column'`     | `'row'`                                                |
| `class`     | `string`                | `''`                                                   |

### `ArtistProfile.Sections` Props

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | `''`    |

### `ArtistProfile.Actions` Props

| Prop             | Type                   | Default |
| ---------------- | ---------------------- | ------- |
| `showFollow`     | `boolean`              | `true`  |
| `showMessage`    | `boolean`              | `true`  |
| `showCommission` | `boolean`              | `true`  |
| `size`           | `'sm' \| 'md' \| 'lg'` | `'md'`  |
| `class`          | `string`               | `''`    |

### `ArtistProfile.Edit` Props

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | `''`    |

### `ArtistProfile.Timeline` Props

| Prop         | Type                          | Default |
| ------------ | ----------------------------- | ------- |
| `items`      | `TimelineItem[]`              | `[]`    |
| `showSocial` | `boolean`                     | `true`  |
| `onLoadMore` | `() => void \| Promise<void>` | -       |
| `hasMore`    | `boolean`                     | `false` |
| `class`      | `string`                      | `''`    |

## Standalone Components

### `ArtistBadge`

```svelte
<script lang="ts">
	import { ArtistBadge } from '@equaltoai/greater-components/faces/artist';
</script>

<ArtistBadge type="verified" tooltip="Verified artist identity" />
```

| Prop      | Type                                                                 | Default |
| --------- | -------------------------------------------------------------------- | ------- |
| `type`    | `'verified' \| 'educator' \| 'institution' \| 'mentor' \| 'curator'` | -       |
| `tooltip` | `string`                                                             | -       |
| `size`    | `'sm' \| 'md'`                                                       | `'md'`  |
| `class`   | `string`                                                             | `''`    |

### `PortfolioSection`

```svelte
<script lang="ts">
	import { PortfolioSection } from '@equaltoai/greater-components/faces/artist';
</script>

<PortfolioSection
	title="Featured Works"
	items={artworks}
	layout="featured"
	onReorder={console.log}
/>
```

| Prop          | Type                            | Default  |
| ------------- | ------------------------------- | -------- |
| `title`       | `string`                        | -        |
| `description` | `string`                        | -        |
| `items`       | `ArtworkData[]`                 | `[]`     |
| `layout`      | `'grid' \| 'row' \| 'featured'` | `'grid'` |
| `editable`    | `boolean`                       | `false`  |
| `onReorder`   | `(itemIds: string[]) => void`   | -        |
| `class`       | `string`                        | `''`     |

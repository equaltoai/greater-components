# Discovery Components (Artist Face)

> Store-driven search + filtering UI (DiscoveryEngine) plus standalone filter widgets

## Imports

```ts
import { DiscoveryEngine, ColorPaletteSearch, StyleFilter, MoodMap } from '$lib/components/Discovery';
```

## `DiscoveryEngine`

`DiscoveryEngine` is a compound component built around a `DiscoveryStore` instance (provided by you).

```svelte
<script lang="ts">
	import { DiscoveryEngine } from '$lib/components/Discovery';

	const store = /* your DiscoveryStore implementation */ null as any;
	const handlers = {
		onResultClick: (artwork) => console.log('open', artwork.id),
		onMoreLikeThis: (artwork) => console.log('similar to', artwork.id),
	};
</script>

<DiscoveryEngine.Root {store} {handlers}>
	<DiscoveryEngine.SearchBar />
	<DiscoveryEngine.Filters />
	<DiscoveryEngine.Results />
	<DiscoveryEngine.Suggestions />
</DiscoveryEngine.Root>
```

### `DiscoveryEngine.Root` Props

| Prop                 | Type                | Default |
| -------------------- | ------------------- | ------- |
| `store`              | `DiscoveryStore`    | -       |
| `handlers`           | `DiscoveryHandlers` | `{}`    |
| `enableColorSearch`  | `boolean`           | `true`  |
| `enableMoodMap`      | `boolean`           | `true`  |
| `enableStyleFilter`  | `boolean`           | `true`  |
| `enableVisualSearch` | `boolean`           | `true`  |
| `showFilters`        | `boolean`           | `true`  |
| `showSuggestions`    | `boolean`           | `true`  |
| `class`              | `string`            | `''`    |
| `children`           | `Snippet`           | -       |

### `DiscoveryEngine.SearchBar` Props

| Prop               | Type      | Default                                 |
| ------------------ | --------- | --------------------------------------- |
| `placeholder`      | `string`  | `'Search artworks, artists, styles...'` |
| `showVisualSearch` | `boolean` | `true`                                  |
| `showRecent`       | `boolean` | `true`                                  |
| `maxSuggestions`   | `number`  | `8`                                     |
| `debounceMs`       | `number`  | `300`                                   |
| `searchAsYouType`  | `boolean` | `true`                                  |
| `minSearchChars`   | `number`  | `2`                                     |
| `class`            | `string`  | `''`                                    |

### `DiscoveryEngine.Filters` Props

| Prop              | Type      | Default |
| ----------------- | --------- | ------- |
| `collapsible`     | `boolean` | `true`  |
| `defaultExpanded` | `boolean` | `false` |
| `class`           | `string`  | `''`    |

### `DiscoveryEngine.Results` Props

| Prop        | Type                            | Default  |
| ----------- | ------------------------------- | -------- |
| `layout`    | `'grid' \| 'masonry' \| 'list'` | `'grid'` |
| `columns`   | `2 \| 3 \| 4 \| 5 \| 6`         | `4`      |
| `showSort`  | `boolean`                       | `true`   |
| `showCount` | `boolean`                       | `true`   |
| `class`     | `string`                        | `''`     |

### `DiscoveryEngine.Suggestions` Props

| Prop             | Type      | Default               |
| ---------------- | --------- | --------------------- |
| `title`          | `string`  | `'Suggested for you'` |
| `maxItems`       | `number`  | `6`                   |
| `showConfidence` | `boolean` | `false`               |
| `class`          | `string`  | `''`                  |

## Standalone Filter Widgets

These components can be used independently (outside `DiscoveryEngine`), or you can use them to build your own filter UI.

### `ColorPaletteSearch`

| Prop        | Type                                      | Default |
| ----------- | ----------------------------------------- | ------- |
| `colors`    | `string[]` (bindable)                     | `[]`    |
| `tolerance` | `number` (bindable)                       | `50`    |
| `mode`      | `'any' \| 'all' \| 'dominant'` (bindable) | `'any'` |
| `maxColors` | `number`                                  | `5`     |
| `onSearch`  | `(colors: string[]) => void`              | -       |
| `class`     | `string`                                  | `''`    |

### `StyleFilter`

| Prop        | Type                           | Default |
| ----------- | ------------------------------ | ------- |
| `styles`    | `ArtStyle[]` (bindable)        | `[]`    |
| `selected`  | `string[]` (bindable)          | `[]`    |
| `showCount` | `boolean`                      | `true`  |
| `onChange`  | `(selected: string[]) => void` | -       |
| `class`     | `string`                       | `''`    |

### `MoodMap`

| Prop         | Type                                   | Default                 |
| ------------ | -------------------------------------- | ----------------------- |
| `dimensions` | `[string, string]`                     | `['Energy', 'Valence']` |
| `selection`  | `{ x: number; y: number }` (bindable)  | `{ x: 0, y: 0 }`        |
| `radius`     | `number`                               | `0.2`                   |
| `onChange`   | `(dimensions: MoodDimensions) => void` | -                       |
| `class`      | `string`                               | `''`                    |

## AI-Powered Features

### Visual Search (integration hook)

`DiscoveryEngine.SearchBar` calls `handlers.onVisualSearch(file)` when a user uploads an image. Wire this to your backend and update your store as needed.

```svelte
<script lang="ts">
	import { DiscoveryEngine } from '$lib/components/Discovery';

	const store = /* your DiscoveryStore implementation */ null as any;
	const handlers = {
		onVisualSearch: async (file: File) => {
			// Upload to your backend + update store filters/results
			console.log('visual search', file.name);
		},
	};
</script>

<DiscoveryEngine.Root {store} {handlers}>
	<DiscoveryEngine.SearchBar />
	<DiscoveryEngine.Results />
</DiscoveryEngine.Root>
```

## Search Configuration

### Filter Persistence

```svelte
<script lang="ts">
	import { DiscoveryEngine } from '$lib/components/Discovery';

	const discovery = /* your DiscoveryStore implementation */ null as any;
	// Persist filters/queries inside your store (e.g., localStorage) if desired.
</script>

<DiscoveryEngine.Root store={discovery}>
	<!-- Filters persist across sessions -->
</DiscoveryEngine.Root>
```

## Accessibility

### Keyboard Navigation

| Key          | Action               |
| ------------ | -------------------- |
| `Tab`        | Move between filters |
| `Enter`      | Apply filter         |
| `Escape`     | Clear filter         |
| `Arrow keys` | Navigate MoodMap     |

### Screen Reader Support

```svelte
<ColorPaletteSearch aria-label="Search by color palette" announceSelections={true} />

<MoodMap aria-label="Mood-based artwork discovery" announcePosition={true} />
```

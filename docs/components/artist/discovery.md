# Discovery Components

> AI-powered art discovery and search interface components

## Overview

Discovery components provide intelligent search and filtering capabilities for artwork, leveraging AI for style recognition, color palette extraction, composition analysis, and mood mapping.

## DiscoveryEngine.Root

Main container for the discovery interface.

### Basic Usage

```svelte
<script lang="ts">
	import { DiscoveryEngine } from '@equaltoai/greater-components-artist';
	import type { DiscoveryFilter } from '@equaltoai/greater-components-artist/types';

	let filters = $state<DiscoveryFilter>({});
	let results = $state([]);

	async function handleSearch(query: string, filters: DiscoveryFilter) {
		results = await searchArtworks(query, filters);
	}
</script>

<DiscoveryEngine.Root onSearch={handleSearch}>
	<DiscoveryEngine.SearchBar />
	<DiscoveryEngine.Filters />
	<DiscoveryEngine.Results items={results} />
	<DiscoveryEngine.Suggestions />
</DiscoveryEngine.Root>
```

## Subcomponents

### DiscoveryEngine.SearchBar

Text and visual search input.

```svelte
<DiscoveryEngine.SearchBar
	placeholder="Search artworks, artists, styles..."
	showVisualSearch={true}
	showVoiceSearch={true}
	onSearch={handleSearch}
/>
```

| Prop               | Type       | Default       | Description         |
| ------------------ | ---------- | ------------- | ------------------- |
| `placeholder`      | `string`   | `'Search...'` | Input placeholder   |
| `showVisualSearch` | `boolean`  | `true`        | Enable image search |
| `showVoiceSearch`  | `boolean`  | `false`       | Enable voice search |
| `suggestions`      | `string[]` | `[]`          | Search suggestions  |

### DiscoveryEngine.Filters

Combined filter panel.

```svelte
<DiscoveryEngine.Filters
	filters={['style', 'color', 'medium', 'mood', 'date']}
	layout="horizontal"
	collapsible={true}
/>
```

### DiscoveryEngine.Results

Search results with gallery layout.

```svelte
<DiscoveryEngine.Results
	items={results}
	layout="grid"
	loading={isSearching}
	emptyMessage="No artworks found"
/>
```

### DiscoveryEngine.Suggestions

AI-generated similar work suggestions.

```svelte
<DiscoveryEngine.Suggestions basedOn={selectedArtwork} count={6} title="Similar Works" />
```

## ColorPaletteSearch

Search artworks by color harmony.

### Basic Usage

```svelte
<script lang="ts">
	import { ColorPaletteSearch } from '@equaltoai/greater-components-artist';

	let selectedColors = $state<string[]>([]);

	function handleColorSearch(colors: string[]) {
		searchByColors(colors);
	}
</script>

<ColorPaletteSearch
	colors={selectedColors}
	tolerance={15}
	mode="dominant"
	onSearch={handleColorSearch}
/>
```

### Props

| Prop          | Type                           | Default | Description                      |
| ------------- | ------------------------------ | ------- | -------------------------------- |
| `colors`      | `string[]`                     | `[]`    | Selected color values            |
| `tolerance`   | `number`                       | `15`    | Color matching tolerance (0-100) |
| `mode`        | `'any' \| 'all' \| 'dominant'` | `'any'` | Match mode                       |
| `maxColors`   | `number`                       | `5`     | Maximum colors to select         |
| `showPicker`  | `boolean`                      | `true`  | Show color picker                |
| `showPresets` | `boolean`                      | `true`  | Show preset palettes             |
| `onSearch`    | `(colors: string[]) => void`   | -       | Search callback                  |

### Color Match Modes

```svelte
<!-- Match any selected color -->
<ColorPaletteSearch mode="any" />

<!-- Match all selected colors -->
<ColorPaletteSearch mode="all" />

<!-- Match dominant color -->
<ColorPaletteSearch mode="dominant" />
```

### Preset Palettes

```svelte
<ColorPaletteSearch
	presets={[
		{ name: 'Warm', colors: ['#FF6B6B', '#FFA07A', '#FFD700'] },
		{ name: 'Cool', colors: ['#4169E1', '#00CED1', '#98FB98'] },
		{ name: 'Earth', colors: ['#8B4513', '#D2691E', '#F4A460'] },
		{ name: 'Monochrome', colors: ['#2C2C2C', '#666666', '#CCCCCC'] },
	]}
/>
```

## StyleFilter

Filter artworks by artistic style/movement.

### Basic Usage

```svelte
<script lang="ts">
	import { StyleFilter } from '@equaltoai/greater-components-artist';

	let selectedStyles = $state<string[]>([]);
</script>

<StyleFilter
	selected={selectedStyles}
	showCount={true}
	onSelect={(styles) => (selectedStyles = styles)}
/>
```

### Props

| Prop          | Type         | Default     | Description              |
| ------------- | ------------ | ----------- | ------------------------ |
| `styles`      | `ArtStyle[]` | AI-detected | Available styles         |
| `selected`    | `string[]`   | `[]`        | Selected style IDs       |
| `showCount`   | `boolean`    | `true`      | Show artwork counts      |
| `multiSelect` | `boolean`    | `true`      | Allow multiple selection |
| `searchable`  | `boolean`    | `true`      | Enable style search      |

### Style Categories

```svelte
<StyleFilter
	categories={[
		{
			name: 'Traditional',
			styles: ['impressionism', 'realism', 'baroque', 'renaissance'],
		},
		{
			name: 'Modern',
			styles: ['abstract', 'minimalism', 'pop-art', 'surrealism'],
		},
		{
			name: 'Contemporary',
			styles: ['digital-art', 'mixed-media', 'installation', 'conceptual'],
		},
	]}
/>
```

## MoodMap

Visual mood/emotion-based discovery interface.

### Basic Usage

```svelte
<script lang="ts">
	import { MoodMap } from '@equaltoai/greater-components-artist';

	let selection = $state({ x: 0.5, y: 0.5 });

	function handleMoodSelect(point: { x: number; y: number }) {
		searchByMood(point);
	}
</script>

<MoodMap dimensions={['energy', 'valence']} {selection} onSelect={handleMoodSelect} />
```

### Props

| Prop          | Type                       | Default                 | Description           |
| ------------- | -------------------------- | ----------------------- | --------------------- |
| `dimensions`  | `[string, string]`         | `['energy', 'valence']` | Mood axes             |
| `selection`   | `{ x: number; y: number }` | -                       | Selected mood point   |
| `showLabels`  | `boolean`                  | `true`                  | Show axis labels      |
| `showPreview` | `boolean`                  | `true`                  | Show artwork previews |

### Mood Dimensions

```svelte
<!-- Energy vs Valence (default) -->
<MoodMap dimensions={['energy', 'valence']} />

<!-- Complexity vs Harmony -->
<MoodMap dimensions={['complexity', 'harmony']} />

<!-- Warmth vs Intensity -->
<MoodMap dimensions={['warmth', 'intensity']} />
```

### Axis Labels

```svelte
<MoodMap
	dimensions={['energy', 'valence']}
	labels={{
		xMin: 'Calm',
		xMax: 'Energetic',
		yMin: 'Melancholic',
		yMax: 'Joyful',
	}}
/>
```

## AI-Powered Features

### Visual Search

```svelte
<script lang="ts">
	async function handleImageUpload(file: File) {
		const results = await searchByImage(file);
		// Returns similar artworks based on visual analysis
	}
</script>

<DiscoveryEngine.SearchBar showVisualSearch={true} onImageUpload={handleImageUpload} />
```

### Style Recognition

```svelte
<script lang="ts">
	// AI automatically detects styles in uploaded artwork
	const detectedStyles = await analyzeArtworkStyle(imageUrl);
	// Returns: ['impressionism', 'landscape', 'oil-painting']
</script>
```

### Color Extraction

```svelte
<script lang="ts">
	// Extract dominant colors from artwork
	const palette = await extractColorPalette(imageUrl);
	// Returns: ['#2C5F2D', '#97BC62', '#F5F5DC', '#8B4513']
</script>

<ColorPaletteSearch colors={palette} />
```

### Composition Analysis

```svelte
<script lang="ts">
	// Analyze artwork composition
	const composition = await analyzeComposition(imageUrl);
	// Returns: { balance: 'asymmetric', focus: 'center', depth: 'layered' }
</script>
```

## Search Configuration

### Advanced Search

```svelte
<DiscoveryEngine.Root>
	<DiscoveryEngine.SearchBar />

	<DiscoveryEngine.AdvancedFilters>
		<DiscoveryEngine.DateRange />
		<DiscoveryEngine.MediumFilter />
		<DiscoveryEngine.DimensionFilter />
		<DiscoveryEngine.PriceRange />
		<DiscoveryEngine.LicenseFilter />
	</DiscoveryEngine.AdvancedFilters>

	<DiscoveryEngine.Results />
</DiscoveryEngine.Root>
```

### Filter Persistence

```svelte
<script lang="ts">
	import { createDiscoveryStore } from '@equaltoai/greater-components-artist/stores';

	const discovery = createDiscoveryStore({
		persistFilters: true,
		storageKey: 'discovery-filters',
	});
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

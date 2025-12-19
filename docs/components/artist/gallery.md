# Gallery Components (Artist Face)

> Grid/row/masonry layouts for displaying `ArtworkData[]`

## Imports

```ts
import { Gallery, GalleryGrid, GalleryRow, GalleryMasonry } from '$lib/components/Gallery';
```

## `Gallery` Namespace

All layouts are also exposed via a single namespace:

```svelte
<Gallery.Grid items={artworks} />
<Gallery.Row items={featured} title="Featured" />
<Gallery.Masonry items={artworks} />
```

## `GalleryGrid`

Masonry-style grid with optional clustering and automatic virtual scrolling for large sets.

```svelte
<GalleryGrid items={artworks} columns="auto" gap="md" clustering="none" onLoadMore={loadMore} />
```

| Prop               | Type                                       | Default     |
| ------------------ | ------------------------------------------ | ----------- |
| `items`            | `ArtworkData[]`                            | `[]`        |
| `columns`          | `number \| 'auto'`                         | `'auto'`    |
| `gap`              | `'sm' \| 'md' \| 'lg'`                     | `'md'`      |
| `clustering`       | `'none' \| 'artist' \| 'theme' \| 'smart'` | `'none'`    |
| `virtualScrolling` | `boolean`                                  | `false`     |
| `onLoadMore`       | `() => void`                               | -           |
| `onItemClick`      | `(item: ArtworkData) => void`              | -           |
| `scrollKey`        | `string`                                   | `'gallery'` |
| `itemRenderer`     | `Snippet<[ArtworkData, number]>`           | -           |
| `class`            | `string`                                   | `''`        |

## `GalleryRow`

Horizontal row with scroll snapping + arrow controls.

```svelte
<GalleryRow
	items={featured}
	title="Featured This Week"
	showAllLink="/gallery/featured"
	cardSize="md"
/>
```

| Prop           | Type                             | Default |
| -------------- | -------------------------------- | ------- |
| `items`        | `ArtworkData[]`                  | `[]`    |
| `title`        | `string`                         | -       |
| `showAllLink`  | `string`                         | -       |
| `cardSize`     | `'sm' \| 'md' \| 'lg'`           | `'md'`  |
| `onItemClick`  | `(item: ArtworkData) => void`    | -       |
| `itemRenderer` | `Snippet<[ArtworkData, number]>` | -       |
| `class`        | `string`                         | `''`    |

## `GalleryMasonry`

Absolute-positioned masonry layout (variable height) with optional virtual scrolling.

```svelte
<GalleryMasonry items={artworks} columnWidth={280} gap={16} onLoadMore={loadMore} />
```

| Prop               | Type                             | Default     |
| ------------------ | -------------------------------- | ----------- |
| `items`            | `ArtworkData[]`                  | `[]`        |
| `columnWidth`      | `number`                         | `280`       |
| `gap`              | `number`                         | `16`        |
| `virtualScrolling` | `boolean`                        | `false`     |
| `onLoadMore`       | `() => void`                     | -           |
| `onItemClick`      | `(item: ArtworkData) => void`    | -           |
| `scrollKey`        | `string`                         | `'masonry'` |
| `itemRenderer`     | `Snippet<[ArtworkData, number]>` | -           |
| `class`            | `string`                         | `''`        |

## Custom Rendering (`itemRenderer`)

Use a snippet prop to render each item:

```svelte
{#snippet renderItem(item, index)}
	<ArtworkCard artwork={item} variant="grid" tabindex={index === 0 ? 0 : -1} />
{/snippet}

<GalleryGrid items={artworks} itemRenderer={renderItem} />
```

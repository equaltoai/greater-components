# Monetization Components

> Components for artist monetization: tips, purchases, and institutional features

## Overview

Monetization components provide artists with tools to receive support and sell their work directly, while maintaining ethical principles of fair visibility regardless of payment.

## TipJar

Tip integration for supporting artists.

### Basic Usage

```svelte
<script lang="ts">
	import { TipJar } from '@equaltoai/greater-components-artist';

	async function handleTip(amount: number, currency: string) {
		await processTip({ artistId: artist.id, amount, currency });
	}
</script>

<TipJar {artist} presets={[5, 10, 25, 50]} currency="USD" onTip={handleTip} />
```

### Props

| Prop          | Type                                   | Default       | Description          |
| ------------- | -------------------------------------- | ------------- | -------------------- |
| `artist`      | `ArtistData`                           | required      | Artist to tip        |
| `presets`     | `number[]`                             | `[5, 10, 25]` | Preset amounts       |
| `currency`    | `string`                               | `'USD'`       | Currency code        |
| `allowCustom` | `boolean`                              | `true`        | Allow custom amounts |
| `showMessage` | `boolean`                              | `true`        | Allow tip messages   |
| `onTip`       | `(amount, currency, message?) => void` | -             | Tip callback         |

### Customization

```svelte
<TipJar
	{artist}
	presets={[1, 3, 5, 10]}
	currency="EUR"
	allowCustom={true}
	minAmount={1}
	maxAmount={500}
	showMessage={true}
	messageMaxLength={200}
/>
```

## DirectPurchase

Direct artwork purchase setup.

### Basic Usage

```svelte
<script lang="ts">
	import { DirectPurchase } from '@equaltoai/greater-components-artist';

	const purchaseOptions = {
		digital: {
			price: 25,
			currency: 'USD',
			includes: ['High-res PNG', 'Print-ready PDF'],
		},
		print: {
			sizes: [
				{ size: '8x10', price: 45 },
				{ size: '16x20', price: 85 },
				{ size: '24x36', price: 150 },
			],
			shipping: 'calculated',
		},
		original: {
			price: 1200,
			currency: 'USD',
			available: true,
		},
	};
</script>

<DirectPurchase {artwork} options={purchaseOptions} onPurchase={handlePurchase} />
```

### Props

| Prop         | Type                        | Default  | Description       |
| ------------ | --------------------------- | -------- | ----------------- |
| `artwork`    | `ArtworkData`               | required | Artwork for sale  |
| `options`    | `PurchaseOptions`           | required | Purchase options  |
| `onPurchase` | `(option, details) => void` | -        | Purchase callback |

### Purchase Types

#### Digital Download

```svelte
<DirectPurchase.Digital
	price={25}
	currency="USD"
	files={['high-res.png', 'print-ready.pdf']}
	license="personal"
/>
```

#### Print Options

```svelte
<DirectPurchase.Print
	sizes={printSizes}
	materials={['canvas', 'paper', 'metal']}
	framing={framingOptions}
	shipping={shippingCalculator}
/>
```

#### Original Artwork

```svelte
<DirectPurchase.Original price={1200} currency="USD" available={true} inquiryOnly={false} />
```

### License Options

```svelte
<DirectPurchase
	{artwork}
	licenses={[
		{ type: 'personal', price: 25, description: 'Personal use only' },
		{ type: 'commercial', price: 150, description: 'Commercial use allowed' },
		{ type: 'exclusive', price: 500, description: 'Exclusive rights' },
	]}
/>
```

## Institutional Features

Features for galleries, museums, and institutions.

### Gallery Integration

```svelte
<script lang="ts">
	import { GalleryIntegration } from '@equaltoai/greater-components-artist';
</script>

<GalleryIntegration
	gallery={galleryData}
	features={{
		exhibition: true,
		sales: true,
		commissions: true,
		licensing: true,
	}}
/>
```

### Museum Mode

```svelte
<script lang="ts">
	import { MuseumMode } from '@equaltoai/greater-components-artist';
</script>

<MuseumMode
	institution={museumData}
	collection={artworkCollection}
	features={{
		virtualTours: true,
		audioGuides: true,
		educationalContent: true,
	}}
/>
```

### Institutional Badges

```svelte
<InstitutionalBadge type="museum" institution="MoMA" verified={true} />

<InstitutionalBadge type="gallery" institution="Gagosian" verified={true} />
```

## Premium Features

### Premium Badge

```svelte
<PremiumBadge tier="pro" features={['priority-support', 'analytics', 'custom-domain']} />
```

### Protection Tools

```svelte
<ProtectionTools
	{artwork}
	features={{
		watermarking: true,
		rightClickProtection: true,
		downloadPrevention: true,
		dmcaSupport: true,
	}}
/>
```

## Accessibility

### Screen Reader Support

```svelte
<TipJar {artist} aria-label="Support {artist.name}" />

<DirectPurchase {artwork} aria-label="Purchase options for {artwork.title}" />
```

### Keyboard Navigation

| Key      | Action           |
| -------- | ---------------- |
| `Tab`    | Navigate options |
| `Enter`  | Select/confirm   |
| `Escape` | Cancel           |

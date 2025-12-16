# Monetization Components

> Components for artist monetization: tips, purchases, and institutional features

## Overview

Monetization components provide artists with tools to receive support and sell their work directly, while maintaining ethical principles of fair visibility regardless of payment.

## TipJar

Tip integration for supporting artists.

### Basic Usage

```svelte
<script lang="ts">
	import { Monetization } from '@equaltoai/greater-components/faces/artist';

	async function handleTip(amount: number, currency: string, message?: string, isAnonymous?: boolean) {
		await processTip({ artistId: artist.id, amount, currency, message, isAnonymous });
	}
</script>

<Monetization.TipJar {artist} handlers={{ onTip: handleTip }} />
```

### Props

| Prop          | Type                                   | Default       | Description          |
| ------------- | -------------------------------------- | ------------- | -------------------- |
| `artist`      | `ArtistData`                           | required      | Artist to tip        |
| `config`      | `TipJarConfig`                         | `{}`          | Tip jar configuration |
| `handlers`    | `TipJarHandlers`                       | `{}`          | Event handlers       |
| `recentTips`  | `TipData[]`                            | `[]`          | Optional recent tips |
| `class`       | `string`                               | `''`          | Custom CSS class     |

### Customization

```svelte
<Monetization.TipJar
	{artist}
	config={{
		currency: 'EUR',
		minAmount: 1,
		maxAmount: 500,
		allowCustomAmount: true,
		allowMessages: true,
		presets: [
			{ id: 'tip-1', amount: 1, currency: 'EUR', label: 'Thanks' },
			{ id: 'tip-5', amount: 5, currency: 'EUR', label: 'Support' },
		],
	}}
	handlers={{ onTip: handleTip }}
/>
```

## DirectPurchase

Direct artwork purchase setup.

### Basic Usage

```svelte
<script lang="ts">
	import { Monetization } from '@equaltoai/greater-components/faces/artist';

	const pricing = {
		original: { price: 2500, currency: 'USD', available: true },
		prints: [{ id: 'sm', size: '8x10\"', price: 45, currency: 'USD', description: 'Archival print' }],
		licenses: [{ id: 'personal', type: 'personal', price: 25, currency: 'USD', terms: 'Personal use only' }],
	};

	async function handlePurchase(options) {
		await startCheckout(options);
	}
</script>

<Monetization.DirectPurchase {artwork} {pricing} onPurchase={handlePurchase} />
```

### Props

| Prop         | Type                        | Default  | Description       |
| ------------ | --------------------------- | -------- | ----------------- |
| `artwork`    | `ArtworkData`               | required | Artwork for sale  |
| `pricing`    | `PricingData`               | required | Pricing model     |
| `onPurchase` | `(options) => void`         | -        | Purchase callback |
| `onInquiry`  | `(message) => void`         | -        | Inquiry callback  |

## InstitutionalTools

Features for galleries, museums, and institutions.

```svelte
<script lang="ts">
	import { Monetization } from '@equaltoai/greater-components/faces/artist';

	const account = {
		id: 'inst-1',
		name: 'Example Gallery',
		type: 'gallery',
		isVerified: true,
		website: 'https://example.com',
		description: 'Contemporary art gallery',
	};
</script>

<Monetization.InstitutionalTools
	{account}
	handlers={{
		onUpdateAccount: async (updates) => saveUpdates(updates),
		onAddArtist: async (artistId, role) => addArtist(artistId, role),
		onCreateExhibition: async (draft) => createExhibition(draft),
	}}
/>
```

## Premium Features

### Premium Badge

```svelte
<script lang="ts">
	import { Monetization } from '@equaltoai/greater-components/faces/artist';
</script>

<Monetization.PremiumBadge tier="pro" features={['priority-support', 'analytics', 'custom-domain']} />
```

### Protection Tools

```svelte
<script lang="ts">
	import { Monetization } from '@equaltoai/greater-components/faces/artist';
</script>

<Monetization.ProtectionTools {artwork} onReport={handleReport} onWatermark={handleWatermark} />
```

## Accessibility

### Screen Reader Support

```svelte
<Monetization.TipJar {artist} />
<Monetization.DirectPurchase {artwork} {pricing} />
```

### Keyboard Navigation

| Key      | Action           |
| -------- | ---------------- |
| `Tab`    | Navigate options |
| `Enter`  | Select/confirm   |
| `Escape` | Cancel           |

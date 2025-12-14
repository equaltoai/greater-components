# Transparency Components

> Components for AI usage disclosure, process documentation, and ethical transparency

## Overview

Transparency components ensure clear communication about AI usage in artwork creation, document the creative process, and provide artists with control over how their work is used.

## AIDisclosure

AI usage transparency badge and details.

### Basic Usage

```svelte
<script lang="ts">
	import { AIDisclosure } from '@equaltoai/greater-components-artist';

	const aiUsage = {
		usedAI: true,
		types: ['reference-generation', 'color-suggestion'],
		tools: ['Midjourney', 'Adobe Firefly'],
		percentage: 15,
		description:
			'AI was used to generate initial reference images and suggest color palettes. All final artwork is hand-painted.',
	};
</script>

<AIDisclosure usage={aiUsage} variant="badge" expandable={true} />
```

### Props

| Prop         | Type                                | Default   | Description             |
| ------------ | ----------------------------------- | --------- | ----------------------- |
| `usage`      | `AIUsageData`                       | required  | AI usage details        |
| `variant`    | `'badge' \| 'detailed' \| 'inline'` | `'badge'` | Display variant         |
| `expandable` | `boolean`                           | `true`    | Show detailed breakdown |

### Variants

#### Badge Variant

Compact badge for artwork cards.

```svelte
<AIDisclosure usage={aiUsage} variant="badge" />
```

#### Detailed Variant

Full disclosure panel.

```svelte
<AIDisclosure usage={aiUsage} variant="detailed" showTools={true} showPercentage={true} />
```

#### Inline Variant

Inline text disclosure.

```svelte
<AIDisclosure usage={aiUsage} variant="inline" />
```

### AI Usage Types

```typescript
type AIUsageType =
	| 'none' // No AI used
	| 'reference-generation' // AI-generated references
	| 'color-suggestion' // AI color palette suggestions
	| 'composition-assist' // AI composition assistance
	| 'upscaling' // AI image upscaling
	| 'background-generation' // AI-generated backgrounds
	| 'style-transfer' // AI style transfer
	| 'full-generation' // Fully AI-generated
	| 'ai-assisted' // General AI assistance
	| 'ai-collaboration'; // Human-AI collaboration
```

### No AI Badge

```svelte
<AIDisclosure usage={{ usedAI: false }} variant="badge" showNoAIBadge={true} />
```

## ProcessDocumentation

Human creativity documentation for AI-assisted work.

### Basic Usage

```svelte
<script lang="ts">
	import { ProcessDocumentation } from '@equaltoai/greater-components-artist';

	const steps = [
		{
			id: '1',
			type: 'human',
			title: 'Initial Concept Sketch',
			description: 'Hand-drawn thumbnail sketches exploring composition',
			imageUrl: '/process/sketch.jpg',
			timestamp: '2024-03-01T10:00:00Z',
		},
		{
			id: '2',
			type: 'ai-assisted',
			title: 'Reference Generation',
			description: 'Used Midjourney to generate lighting references',
			imageUrl: '/process/reference.jpg',
			aiTool: 'Midjourney',
			timestamp: '2024-03-01T11:00:00Z',
		},
		{
			id: '3',
			type: 'human',
			title: 'Final Painting',
			description: 'Hand-painted final artwork in Photoshop',
			imageUrl: '/process/final.jpg',
			timestamp: '2024-03-05T16:00:00Z',
		},
	];
</script>

<ProcessDocumentation {steps} showAIContribution={true} />
```

### Props

| Prop                 | Type                   | Default      | Description                 |
| -------------------- | ---------------------- | ------------ | --------------------------- |
| `steps`              | `ProcessStep[]`        | `[]`         | Process documentation       |
| `showAIContribution` | `boolean`              | `true`       | Highlight AI vs human steps |
| `layout`             | `'timeline' \| 'grid'` | `'timeline'` | Display layout              |

### Step Types

```typescript
interface ProcessStep {
	id: string;
	type: 'human' | 'ai-assisted' | 'ai-generated';
	title: string;
	description?: string;
	imageUrl?: string;
	aiTool?: string;
	timestamp?: string;
}
```

## Opt-Out Controls

Artist controls for AI training opt-out.

### Basic Usage

```svelte
<script lang="ts">
	import { OptOutControls } from '@equaltoai/greater-components-artist';

	let settings = $state({
		optOutOfTraining: true,
		allowStyleAnalysis: false,
		allowColorExtraction: true,
		showNoAIBadge: true,
	});
</script>

<OptOutControls {settings} onUpdate={(newSettings) => (settings = newSettings)} />
```

### Settings

```typescript
interface AIOptOutSettings {
	optOutOfTraining: boolean; // Opt out of AI training
	allowStyleAnalysis: boolean; // Allow style analysis
	allowColorExtraction: boolean; // Allow color extraction
	showNoAIBadge: boolean; // Display "No AI" badge
	licenseRestrictions: string[]; // License restrictions
}
```

### Per-Artwork Controls

```svelte
<script lang="ts">
	import { ArtworkAISettings } from '@equaltoai/greater-components-artist';
</script>

<ArtworkAISettings
	{artwork}
	settings={{
		optOutOfTraining: true,
		noDerivatives: true,
		requireAttribution: true,
	}}
/>
```

## Ethical Badges

### No AI Training Badge

```svelte
<NoAITrainingBadge tooltip="This artwork is opted out of AI training" />
```

### Human-Made Badge

```svelte
<HumanMadeBadge verified={true} tooltip="100% human-created artwork" />
```

### Ethical Sourcing Badge

```svelte
<EthicalSourcingBadge tooltip="All references ethically sourced" />
```

## Accessibility

### Screen Reader Support

```svelte
<AIDisclosure usage={aiUsage} aria-label="AI usage disclosure" announceOnExpand={true} />
```

### Keyboard Navigation

| Key     | Action                     |
| ------- | -------------------------- |
| `Enter` | Expand/collapse disclosure |
| `Tab`   | Navigate between controls  |
| `Space` | Toggle settings            |

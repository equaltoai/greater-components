# Transparency Components

> Components for AI usage disclosure, process documentation, and ethical transparency

## Overview

Transparency components ensure clear communication about AI usage in artwork creation, document the creative process, and provide artists with control over how their work is used.

## AIDisclosure

AI usage transparency badge and details (standalone).

### Basic Usage

```svelte
<script lang="ts">
	import AIDisclosure from '$lib/components/Artwork/AIDisclosure.svelte';

	const usage = {
		hasAI: true,
		tools: [
			{
				name: 'Midjourney',
				usage: 'generation',
				description: 'Initial concept reference generation',
			},
		],
		humanContribution: 85,
		aiContribution: 15,
		disclosureLevel: 'detailed',
	};
</script>

<AIDisclosure {usage} variant="badge" expandable />
```

### Props

| Prop         | Type                                | Default   | Description             |
| ------------ | ----------------------------------- | --------- | ----------------------- |
| `usage`      | `AIUsageData`                       | required  | AI usage details        |
| `variant`    | `'badge' \| 'detailed' \| 'inline'` | `'badge'` | Display variant         |
| `expandable` | `boolean`                           | `true`    | Show detailed breakdown |
| `class`      | `string`                            | `''`      | Custom CSS class        |

### Notes

- This component is standalone and does not depend on `Artwork` context.
- For disclosure tied to an `Artwork` object, use `Artwork.AIDisclosure` inside `<Artwork.Root>`.

## ProcessDocumentation

Human creativity documentation for AI-assisted work.

### Basic Usage

```svelte
<script lang="ts">
	import ProcessDocumentation from '$lib/components/Transparency/ProcessDocumentation.svelte';

	const steps = [
		{
			id: '1',
			order: 1,
			type: 'human',
			title: 'Initial concept sketch',
			description: 'Hand-drawn thumbnails exploring composition',
			timestamp: new Date().toISOString(),
		},
		{
			id: '2',
			order: 2,
			type: 'ai',
			title: 'AI-assisted references',
			description: 'Generated lighting reference options',
			timestamp: new Date().toISOString(),
		},
		{
			id: '3',
			order: 3,
			type: 'human',
			title: 'Final painting',
			description: 'Hand-painted final artwork',
			timestamp: new Date().toISOString(),
		},
	];
</script>

<ProcessDocumentation {steps} showAIContribution />
```

### Props

| Prop                 | Type            | Default              | Description                 |
| -------------------- | --------------- | -------------------- | --------------------------- |
| `steps`              | `ProcessStep[]` | `[]`                 | Process documentation       |
| `showAIContribution` | `boolean`       | `true`               | Highlight AI vs human steps |
| `title`              | `string`        | `'Creative Process'` | Header title                |
| `overview`           | `string`        | -                    | Optional overview text      |
| `totalTime`          | `string`        | -                    | Optional duration summary   |
| `enableExport`       | `boolean`       | `false`              | Enable export handler       |
| `compact`            | `boolean`       | `false`              | Compact mode                |
| `class`              | `string`        | `''`                 | Custom CSS class            |

### Step Types

```typescript
interface ProcessStep {
	id: string;
	order: number;
	type: 'human' | 'ai' | 'hybrid';
	title: string;
	description?: string;
	timestamp?: string | Date;
}
```

## AIOptOutControls

Artist controls for AI training opt-out.

### Basic Usage

```svelte
<script lang="ts">
	import AIOptOutControls from '$lib/components/Transparency/AIOptOutControls.svelte';

	let status = $state({
		discoveryAI: true,
		generativeAI: false,
		allAI: false,
	});
</script>

<AIOptOutControls currentStatus={status} onUpdate={(next) => (status = next)} />
```

### Settings

```typescript
interface GranularAIOptOutStatus {
	discoveryAI: boolean;
	generativeAI: boolean;
	allAI: boolean;
}
```

## EthicalSourcingBadge

```svelte
<script lang="ts">
	import EthicalSourcingBadge from '$lib/components/Transparency/EthicalSourcingBadge.svelte';

	const verification = {
		id: '1',
		category: 'ai-ethics',
		level: 'third-party-verified',
		title: 'Ethical AI Training',
		description: 'Model trained on ethically sourced data',
		verifiedAt: new Date(),
	};
</script>

<EthicalSourcingBadge {verification} />
```

## Accessibility

### Screen Reader Support

```svelte
<AIDisclosure {usage} />
```

### Keyboard Navigation

| Key     | Action                     |
| ------- | -------------------------- |
| `Enter` | Expand/collapse disclosure |
| `Tab`   | Navigate between controls  |
| `Space` | Toggle settings            |

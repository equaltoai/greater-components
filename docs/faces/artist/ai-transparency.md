# Artist Face: AI Transparency

> Ethical AI disclosure components for visual artists and creative platforms.

The Artist Face includes comprehensive transparency components for disclosing AI usage, documenting creative processes, and providing opt-out controls. These components help build trust and maintain ethical standards in AI-assisted art.

## Installation

```bash
npx @equaltoai/greater-components-cli add ai-disclosure process-documentation ai-opt-out-controls
```

Or install the entire transparency group:

```bash
npx @equaltoai/greater-components-cli add faces/artist
```

## Components Overview

| Component | Purpose |
|-----------|---------|
| `AIDisclosure` | Badge/inline disclosure of AI tool usage |
| `ProcessDocumentation` | Visual timeline of human vs AI contributions |
| `AIOptOutControls` | User controls for AI training preferences |
| `EthicalSourcingBadge` | Verification of ethical AI training data |

## AIDisclosure

Display AI usage information with configurable detail levels.

```svelte
<script lang="ts">
	import { Transparency } from '$lib/components/faces/artist';

	const aiUsage = {
		hasAI: true,
		percentage: 15,
		tools: [
			{ name: 'Photoshop Neural Filters', category: 'enhancement', version: '2024' },
			{ name: 'Topaz Denoise AI', category: 'noise-reduction' },
		],
		description: 'AI used for initial color grading reference, final composition is hand-painted.',
	};
</script>

<!-- Badge variant (compact) -->
<Transparency.AIDisclosure usage={aiUsage} variant="badge" />

<!-- Inline variant (single line) -->
<Transparency.AIDisclosure usage={aiUsage} variant="inline" />

<!-- Detailed variant (expandable panel) -->
<Transparency.AIDisclosure usage={aiUsage} variant="detailed" expandable />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `usage` | `AIUsageData` | required | AI usage details |
| `variant` | `'badge' \| 'inline' \| 'detailed'` | `'badge'` | Display style |
| `expandable` | `boolean` | `true` | Allow expansion for more details |

### AIUsageData Shape

```ts
interface AIUsageData {
	hasAI: boolean;
	percentage?: number; // 0-100
	tools?: Array<{
		name: string;
		category?: 'generation' | 'enhancement' | 'reference' | 'noise-reduction' | 'upscaling';
		version?: string;
		provider?: string;
	}>;
	description?: string;
	certifiedHuman?: boolean;
}
```

## ProcessDocumentation

Document the creative process with clear human vs AI contribution tracking.

```svelte
<script lang="ts">
	import { Transparency } from '$lib/components/faces/artist';

	const processSteps = [
		{
			id: '1',
			title: 'Initial Sketch',
			description: 'Hand-drawn composition studies in graphite',
			type: 'human',
			media: [{ type: 'image', url: '/process/sketch.jpg' }],
			timestamp: '2024-01-15T10:00:00Z',
		},
		{
			id: '2',
			title: 'Color Reference',
			description: 'Generated color palette suggestions',
			type: 'ai',
			tool: 'Adobe Color AI',
			timestamp: '2024-01-15T11:00:00Z',
		},
		{
			id: '3',
			title: 'Final Painting',
			description: 'Hand-painted oil on canvas, 40 hours',
			type: 'human',
			media: [{ type: 'image', url: '/process/final.jpg' }],
			timestamp: '2024-01-20T16:00:00Z',
		},
	];
</script>

<Transparency.ProcessDocumentation
	steps={processSteps}
	showAIContribution
	showTimeline
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `ProcessStep[]` | required | Process documentation steps |
| `showAIContribution` | `boolean` | `true` | Highlight AI vs human steps |
| `showTimeline` | `boolean` | `true` | Display chronological timeline |
| `showMedia` | `boolean` | `true` | Show attached images/videos |

## AIOptOutControls

Allow artists to control how their work is used for AI training.

```svelte
<script lang="ts">
	import { Transparency } from '$lib/components/faces/artist';

	let optOutStatus = $state({
		discovery: false, // Allow discovery AI (style matching, recommendations)
		generative: true, // Opt-out of generative AI training
		research: false, // Allow academic research
	});

	function handleChange(status) {
		optOutStatus = status;
		// Save to backend
	}
</script>

<Transparency.AIOptOutControls status={optOutStatus} onChange={handleChange} />
```

### Opt-Out Levels

| Level | Description |
|-------|-------------|
| `discovery` | Discovery/recommendation AI (style matching, similar artists) |
| `generative` | Generative AI training (image generation models) |
| `research` | Academic and non-commercial research |

## EthicalSourcingBadge

Display verification that AI tools used follow ethical sourcing practices.

```svelte
<script lang="ts">
	import { Transparency } from '$lib/components/faces/artist';

	const verification = {
		verified: true,
		verifier: 'ArtRights Alliance',
		verifiedAt: '2024-01-01',
		details: 'All AI tools used are trained on licensed or public domain data.',
	};
</script>

<Transparency.EthicalSourcingBadge {verification} />
```

## Integration with Artwork

Combine transparency components with artwork display:

```svelte
<Artwork.Root {artwork}>
	<Artwork.Image />
	<Artwork.Title />
	<Artwork.Attribution />
	
	{#if artwork.aiUsage?.hasAI}
		<Transparency.AIDisclosure usage={artwork.aiUsage} variant="badge" />
	{/if}
	
	<Artwork.Actions />
</Artwork.Root>
```

## Accessibility

All transparency components follow WCAG 2.1 AA guidelines:

- Clear color contrast for AI/human distinction
- Screen reader announcements for badge states
- Keyboard navigation for expandable sections
- Focus management in modals

## Best Practices

1. **Be Transparent** – Disclose AI usage even when minimal
2. **Be Specific** – Name the tools and their purpose
3. **Quantify When Possible** – Use percentage estimates
4. **Document Process** – Show the creative journey
5. **Respect Preferences** – Honor opt-out choices

## Related Documentation

- [Transparency Components API](../../components/artist/transparency.md)
- [Artist Face Best Practices](../../guides/artist-face-best-practices.md)
- [Artist Face Specification](../../design/artist-face-specification.md)

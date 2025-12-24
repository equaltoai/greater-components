# Marketing Component Examples

These components are designed for building engaging marketing pages, landing sites, and documentation.

## Badge

Use badges to highlight status, new features, or categories.

```svelte
<script>
	import { Badge } from '$lib/greater/primitives';
</script>

<!-- Hero Badge -->
<Badge variant="pill" label="New" color="primary">Greater Components 2.0 is now available!</Badge>

<!-- Status Dot -->
<div class="status">
	<Badge variant="dot" color="success" label="System Operational" />
</div>

<!-- Category Tag -->
<Badge variant="outlined" color="info" label="Documentation" />
```

## List

Create feature lists or steps with icons.

```svelte
<script>
	import { List, ListItem } from '$lib/greater/primitives';
	import { CheckIcon, XIcon } from '$lib/greater/icons';
</script>

<!-- Feature List -->
<List icon={CheckIcon} iconColor="success" spacing="md">
	<ListItem>Zero configuration required</ListItem>
	<ListItem>Fully accessible components</ListItem>
	<ListItem>Dark mode support out of the box</ListItem>
</List>

<!-- Comparison List -->
<List spacing="sm">
	<ListItem icon={CheckIcon} iconColor="success">Supported Feature</ListItem>
	<ListItem icon={XIcon} iconColor="error">Unsupported Feature</ListItem>
</List>
```

## GradientText

Add visual impact to headings.

```svelte
<script>
	import { GradientText, Heading } from '$lib/greater/primitives';
</script>

<Heading level={1} size="5xl">
	Build faster with <GradientText gradient="primary">Greater Components</GradientText>
</Heading>
```

## StepIndicator

Visualize multi-step processes or tutorials.

```svelte
<script>
	import { StepIndicator } from '$lib/greater/primitives';
</script>

<div class="steps">
	<StepIndicator number={1} state="completed" label="Sign Up" />
	<StepIndicator number={2} state="active" label="Verify" />
	<StepIndicator number={3} state="pending" label="Welcome" />
</div>
```

## IconBadge

Showcase features with consistent iconography.

```svelte
<script>
	import { IconBadge, Card, Heading, Text } from '$lib/greater/primitives';
	import { ZapIcon } from '$lib/greater/icons';
</script>

<Card>
	<IconBadge icon={ZapIcon} size="lg" color="warning" class="mb-4" />
	<Heading level={3}>Lightning Fast</Heading>
	<Text>Optimized for performance with zero runtime overhead.</Text>
</Card>
```

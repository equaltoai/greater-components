<script lang="ts">
	import ComponentDoc from '$lib/components/ComponentDoc.svelte';
	import Switch from '@equaltoai/greater-components-primitives/components/Switch.svelte';

	const props = [
		{
			name: 'checked',
			type: 'boolean',
			default: 'false',
			description: 'Two-way bindable state controlling whether the switch is on.',
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Visually dims the switch and prevents user interaction.',
		},
		{
			name: 'id',
			type: 'string',
			description: 'Native id applied to the underlying checkbox for aria-labelling.',
		},
		{
			name: 'name',
			type: 'string',
			description: 'Optional form name for POST requests.',
		},
		{
			name: 'onchange',
			type: '(checked: boolean) => void',
			description: 'Callback fired after the checked state changes.',
		},
		{
			name: 'class',
			type: 'string',
			description: 'Custom class appended to the host label for theme overrides.',
		},
	];

	const examples = [
		{
			title: 'Basic usage',
			description: 'Bind the switch to a boolean and react to changes.',
			component: Switch,
			props: { checked: true },
			code: `<script lang="ts">
  import { Switch } from '@equaltoai/greater-components-primitives';
  let autoplayMedia = $state(true);
</${'script'}>

<label for="media-toggle">Inline media</label>
<Switch id="media-toggle" bind:checked={autoplayMedia} onchange={(value) => console.log('media', value)} />`,
		},
		{
			title: 'Disabled state',
			description: 'Use disabled when the preference is locked by policy.',
			component: Switch,
			props: { disabled: true },
			code: `<Switch disabled aria-label="Preference locked" />`,
		},
	];

	const accessibility = {
		wcagLevel: 'AA',
		keyboardNav: true,
		screenReader: true,
		colorContrast: true,
		focusManagement: true,
		ariaSupport: true,
		notes: ['Renders a native checkbox under the hood, so it inherits keyboard + screen reader semantics.'],
		axeScore: 100,
	};
</script>

<svelte:head>
	<title>Switch Component - Greater Components</title>
	<meta
		name="description"
		content="Accessible toggle switch built on the primitives package. Ideal for settings panels and quick toggles."
	/>
</svelte:head>

<ComponentDoc
	name="Switch"
	description="Minimal toggle switch built on a native checkbox for instant accessibility."
	status="beta"
	version="0.2.0"
	importPath="@equaltoai/greater-components-primitives"
	{props}
	{examples}
	{accessibility}
>
	<svelte:fragment slot="do">
		<li>Associate switches with inline labels for accessible names.</li>
		<li>Pair with <code>aria-live</code> regions when toggles trigger announcements.</li>
		<li>Keep the action text concise (“Email alerts”) for screen reader brevity.</li>
	</svelte:fragment>

	<svelte:fragment slot="dont">
		<li>Don&apos;t use switches for mutually exclusive choices (use radios instead).</li>
		<li>Avoid disabling switches without providing explanatory text nearby.</li>
		<li>Don&apos;t hide switches behind hover interactions on touch devices.</li>
	</svelte:fragment>
</ComponentDoc>

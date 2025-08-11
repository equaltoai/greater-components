<script lang="ts">
	import ComponentDoc from '$lib/components/ComponentDoc.svelte';
	import Button from '@greater/primitives/components/Button.svelte';
	
	const props = [
		{
			name: 'variant',
			type: "'primary' | 'secondary' | 'ghost' | 'danger'",
			default: "'primary'",
			description: 'The visual style variant of the button'
		},
		{
			name: 'size',
			type: "'small' | 'medium' | 'large'",
			default: "'medium'",
			description: 'The size of the button'
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether the button is disabled'
		},
		{
			name: 'loading',
			type: 'boolean',
			default: 'false',
			description: 'Shows a loading spinner and disables the button'
		},
		{
			name: 'fullWidth',
			type: 'boolean',
			default: 'false',
			description: 'Makes the button expand to full width of its container'
		},
		{
			name: 'type',
			type: "'button' | 'submit' | 'reset'",
			default: "'button'",
			description: 'The HTML button type attribute'
		},
		{
			name: 'href',
			type: 'string',
			default: 'undefined',
			description: 'If provided, renders the button as an anchor element'
		}
	];
	
	const events = [
		{
			name: 'click',
			payload: 'MouseEvent',
			description: 'Fired when the button is clicked'
		},
		{
			name: 'focus',
			payload: 'FocusEvent',
			description: 'Fired when the button receives focus'
		},
		{
			name: 'blur',
			payload: 'FocusEvent',
			description: 'Fired when the button loses focus'
		}
	];
	
	const slots = [
		{
			name: 'default',
			description: 'The content of the button'
		},
		{
			name: 'icon',
			description: 'Optional icon to display before the button text'
		}
	];
	
	const examples = [
		{
			title: 'Basic Usage',
			description: 'Different button variants for various use cases',
			component: Button,
			props: { variant: 'primary' },
			code: `<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="danger">Danger Button</Button>`
		},
		{
			title: 'Sizes',
			description: 'Buttons come in three sizes',
			component: Button,
			props: { size: 'medium' },
			code: `<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>`
		},
		{
			title: 'States',
			description: 'Different button states',
			component: Button,
			props: { disabled: true },
			code: `<Button disabled>Disabled</Button>
<Button loading>Loading</Button>`
		}
	];
	
	const accessibility = {
		wcagLevel: 'AA',
		keyboardNav: true,
		screenReader: true,
		colorContrast: true,
		focusManagement: true,
		ariaSupport: true,
		reducedMotion: true,
		notes: [
			'All buttons have proper ARIA labels',
			'Focus states are clearly visible',
			'Loading state announces to screen readers',
			'Disabled buttons are properly announced'
		],
		axeScore: 100
	};
</script>

<svelte:head>
	<title>Button Component - Greater Components</title>
	<meta name="description" content="A versatile button component with multiple variants, sizes, and states. Fully accessible and customizable." />
</svelte:head>

<ComponentDoc
	name="Button"
	description="A versatile button component with multiple variants, sizes, and states. Fully accessible and customizable."
	status="stable"
	version="0.1.0"
	importPath="@greater/primitives"
	{props}
	{events}
	{slots}
	{examples}
	{accessibility}
>
	<svelte:fragment slot="do">
		<li>Use primary buttons for the main action on a page</li>
		<li>Use descriptive labels that clearly indicate the action</li>
		<li>Provide visual feedback for interactive states</li>
		<li>Use the loading state when performing async operations</li>
		<li>Maintain consistent button sizing throughout your app</li>
	</svelte:fragment>
	
	<svelte:fragment slot="dont">
		<li>Don't use more than one primary button in a section</li>
		<li>Don't disable buttons without clear indication why</li>
		<li>Don't use buttons for navigation (use links instead)</li>
		<li>Don't make buttons too small on mobile devices</li>
		<li>Don't remove focus indicators</li>
	</svelte:fragment>
	
	<svelte:fragment slot="additional">
		<section class="related-section">
			<h2>Related Components</h2>
			<ul>
				<li><a href="/components/icon-button">IconButton</a> - Button with only an icon</li>
				<li><a href="/components/button-group">ButtonGroup</a> - Group multiple buttons together</li>
				<li><a href="/components/link">Link</a> - For navigation purposes</li>
			</ul>
		</section>
	</svelte:fragment>
</ComponentDoc>

<style>
	.related-section {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid var(--doc-border);
	}
	
	.related-section h2 {
		margin-bottom: 1rem;
	}
	
	.related-section ul {
		list-style: none;
		padding: 0;
	}
	
	.related-section li {
		margin-bottom: 0.5rem;
	}
	
	.related-section a {
		color: var(--doc-link);
	}
</style>
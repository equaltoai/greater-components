import type { ComponentType } from 'svelte';

export interface PropDefinition {
	name: string;
	type: string;
	default?: string;
	required?: boolean;
	description: string;
}

export interface EventDefinition {
	name: string;
	payload?: string;
	description: string;
}

export interface SlotDefinition {
	name: string;
	props?: string;
	description: string;
}

export interface ComponentAPI {
	name: string;
	description: string;
	props: PropDefinition[];
	events: EventDefinition[];
	slots: SlotDefinition[];
	status: 'alpha' | 'beta' | 'stable' | 'deprecated';
	version: string;
}

// Component metadata registry
export const componentRegistry = new Map<string, ComponentAPI>();

// Register component metadata
export function registerComponent(name: string, api: ComponentAPI) {
	componentRegistry.set(name, api);
}

// Get component metadata
export function getComponentAPI(name: string): ComponentAPI | undefined {
	return componentRegistry.get(name);
}

// Extract props from TypeScript interface (simplified)
export function extractPropsFromInterface(interfaceCode: string): PropDefinition[] {
	const props: PropDefinition[] = [];
	const propRegex = /(\w+)(\?)?:\s*([^;]+);/g;
	let match;
	
	while ((match = propRegex.exec(interfaceCode)) !== null) {
		props.push({
			name: match[1],
			type: match[3].trim(),
			required: !match[2],
			description: '' // Would need JSDoc parsing for descriptions
		});
	}
	
	return props;
}

// Generate TypeScript interface from props
export function generateInterface(componentName: string, props: PropDefinition[]): string {
	const interfaceName = `${componentName}Props`;
	const propLines = props.map(prop => {
		const optional = prop.required ? '' : '?';
		return `\t${prop.name}${optional}: ${prop.type};`;
	});
	
	return `export interface ${interfaceName} {\n${propLines.join('\n')}\n}`;
}

// Generate documentation markdown
export function generateMarkdown(api: ComponentAPI): string {
	const sections = [];
	
	// Header
	sections.push(`# ${api.name}\n`);
	sections.push(`> ${api.description}\n`);
	sections.push(`**Status:** ${api.status} | **Version:** ${api.version}\n`);
	
	// Props
	if (api.props.length > 0) {
		sections.push('## Props\n');
		sections.push('| Property | Type | Default | Required | Description |');
		sections.push('|----------|------|---------|----------|-------------|');
		
		api.props.forEach(prop => {
			const required = prop.required ? '✓' : '';
			const defaultVal = prop.default || '—';
			sections.push(`| ${prop.name} | \`${prop.type}\` | ${defaultVal} | ${required} | ${prop.description} |`);
		});
	}
	
	// Events
	if (api.events.length > 0) {
		sections.push('\n## Events\n');
		sections.push('| Event | Payload | Description |');
		sections.push('|-------|---------|-------------|');
		
		api.events.forEach(event => {
			const payload = event.payload || '—';
			sections.push(`| ${event.name} | \`${payload}\` | ${event.description} |`);
		});
	}
	
	// Slots
	if (api.slots.length > 0) {
		sections.push('\n## Slots\n');
		sections.push('| Slot | Props | Description |');
		sections.push('|------|-------|-------------|');
		
		api.slots.forEach(slot => {
			const slotName = slot.name || 'default';
			const props = slot.props || '—';
			sections.push(`| ${slotName} | \`${props}\` | ${slot.description} |`);
		});
	}
	
	return sections.join('\n');
}

// Initialize with some component metadata
registerComponent('Button', {
	name: 'Button',
	description: 'A versatile button component with multiple variants and states',
	status: 'stable',
	version: '0.1.0',
	props: [
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
		}
	],
	events: [
		{
			name: 'click',
			payload: 'MouseEvent',
			description: 'Fired when the button is clicked'
		}
	],
	slots: [
		{
			name: 'default',
			description: 'The content of the button'
		}
	]
});

// Register more components...
registerComponent('Modal', {
	name: 'Modal',
	description: 'A modal dialog component for overlays and popups',
	status: 'stable',
	version: '0.1.0',
	props: [
		{
			name: 'open',
			type: 'boolean',
			default: 'false',
			required: true,
			description: 'Controls whether the modal is open'
		},
		{
			name: 'closeOnEscape',
			type: 'boolean',
			default: 'true',
			description: 'Close modal when Escape key is pressed'
		},
		{
			name: 'closeOnOutsideClick',
			type: 'boolean',
			default: 'true',
			description: 'Close modal when clicking outside'
		}
	],
	events: [
		{
			name: 'close',
			description: 'Fired when the modal is closed'
		}
	],
	slots: [
		{
			name: 'header',
			description: 'Modal header content'
		},
		{
			name: 'default',
			description: 'Modal body content'
		},
		{
			name: 'footer',
			description: 'Modal footer content'
		}
	]
});
/**
 * Component Registry Data
 * This is the source of truth for all components in Greater Components
 */

export interface ComponentExample {
	name: string;
	description: string;
	code: string;
}

export interface ComponentAPI {
	props?: Array<{
		name: string;
		type: string;
		default?: string;
		description: string;
		required?: boolean;
	}>;
	events?: Array<{
		name: string;
		payload?: string;
		description: string;
	}>;
	slots?: Array<{
		name: string;
		props?: string;
		description: string;
	}>;
}

export interface Component {
	name: string;
	slug: string;
	type: 'primitive' | 'compound' | 'pattern' | 'adapter';
	category: 'headless' | 'activitypub' | 'lesser' | 'adapters';
	description: string;
	longDescription: string;
	features: string[];
	dependencies: string[];
	registryDependencies: string[];
	npm: {
		package: string;
		version: string;
	};
	github: {
		url: string;
		stars?: number;
	};
	examples: ComponentExample[];
	api?: ComponentAPI;
	tags: string[];
	bundleSize?: {
		minified: string;
		gzipped: string;
	};
	accessibility: {
		wcag: 'AA' | 'AAA';
		features: string[];
	};
	status: 'stable' | 'beta' | 'alpha' | 'experimental';
	version: string;
	lastUpdated: string;
}

export const components: Component[] = [
	// ===================
	// FEEDBACK COMPONENTS
	// ===================
	{
		name: 'Alert',
		slug: 'alert',
		type: 'primitive',
		category: 'headless',
		description: 'Versatile alert/banner component for error, warning, success, and info messages',
		longDescription:
			'A fully accessible alert component for displaying contextual feedback messages. Supports four semantic variants, dismissible alerts, action buttons, and custom icons.',
		features: [
			'Four semantic variants (error, warning, success, info)',
			'Dismissible with close button',
			'Optional action button',
			'Custom icon support',
			'Animated enter/exit transitions',
			'Proper ARIA roles based on variant',
		],
		dependencies: ['svelte@^5.0.0'],
		registryDependencies: [],
		npm: {
			package: '@equaltoai/greater-components-primitives',
			version: '1.0.0',
		},
		github: {
			url: 'https://github.com/equaltoai/greater-components/tree/main/packages/primitives/src/components/Alert.svelte',
		},
		examples: [
			{
				name: 'Basic Usage',
				description: 'Alert variants for different message types',
				code: `<Alert variant="error" title="Connection Lost">
  Your session has expired. Please sign in again.
</Alert>

<Alert variant="success" title="Saved">
  Your changes have been saved successfully.
</Alert>`,
			},
		],
		api: {
			props: [
				{ name: 'variant', type: "'error' | 'warning' | 'success' | 'info'", default: "'info'", description: 'Visual variant determining color scheme and icon' },
				{ name: 'title', type: 'string', description: 'Optional title text' },
				{ name: 'dismissible', type: 'boolean', default: 'false', description: 'Whether alert can be dismissed' },
				{ name: 'onDismiss', type: '() => void', description: 'Callback when dismissed' },
				{ name: 'actionLabel', type: 'string', description: 'Optional action button label' },
				{ name: 'onAction', type: '() => void', description: 'Callback when action clicked' },
			],
		},
		tags: ['alert', 'feedback', 'notification', 'banner', 'accessibility'],
		bundleSize: { minified: '1.2 KB', gzipped: '0.6 KB' },
		accessibility: { wcag: 'AA', features: ['role="alert" for error/warning', 'role="status" for success/info', 'Keyboard accessible dismiss'] },
		status: 'stable',
		version: '1.0.0',
		lastUpdated: '2025-02-14',
	},
	{
		name: 'Spinner',
		slug: 'spinner',
		type: 'primitive',
		category: 'headless',
		description: 'Accessible loading indicator with configurable size and color',
		longDescription:
			'A lightweight, accessible spinner component for indicating loading states. Supports multiple sizes and colors with proper ARIA attributes for screen readers.',
		features: [
			'Five size options (xs, sm, md, lg, xl)',
			'Four color options (primary, current, white, gray)',
			'Accessible with role="status"',
			'Respects prefers-reduced-motion',
			'CSS-only animation',
		],
		dependencies: ['svelte@^5.0.0'],
		registryDependencies: [],
		npm: {
			package: '@equaltoai/greater-components-primitives',
			version: '1.0.0',
		},
		github: {
			url: 'https://github.com/equaltoai/greater-components/tree/main/packages/primitives/src/components/Spinner.svelte',
		},
		examples: [
			{
				name: 'Basic Usage',
				description: 'Spinner with different sizes',
				code: `<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />`,
			},
		],
		api: {
			props: [
				{ name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Size of the spinner' },
				{ name: 'color', type: "'primary' | 'current' | 'white' | 'gray'", default: "'primary'", description: 'Color of the spinner' },
				{ name: 'label', type: 'string', default: "'Loading'", description: 'Accessible label for screen readers' },
			],
		},
		tags: ['spinner', 'loading', 'indicator', 'accessibility'],
		bundleSize: { minified: '0.5 KB', gzipped: '0.3 KB' },
		accessibility: { wcag: 'AAA', features: ['role="status"', 'aria-label', 'Reduced motion support'] },
		status: 'stable',
		version: '1.0.0',
		lastUpdated: '2025-02-14',
	},
	{
		name: 'LoadingState',
		slug: 'loading-state',
		type: 'primitive',
		category: 'headless',
		description: 'Wrapper component combining Spinner with message and fullscreen overlay support',
		longDescription:
			'A higher-level loading component that wraps Spinner with optional message text and fullscreen overlay capability. Ideal for page-level loading states and async operations.',
		features: [
			'Wraps Spinner component',
			'Optional loading message',
			'Fullscreen overlay mode',
			'Custom content slot',
			'Accessible live region',
		],
		dependencies: ['svelte@^5.0.0'],
		registryDependencies: ['spinner'],
		npm: {
			package: '@equaltoai/greater-components-primitives',
			version: '1.0.0',
		},
		github: {
			url: 'https://github.com/equaltoai/greater-components/tree/main/packages/primitives/src/components/LoadingState.svelte',
		},
		examples: [
			{
				name: 'Basic Usage',
				description: 'Loading state with message',
				code: `<LoadingState message="Loading your data..." />

<LoadingState fullscreen size="lg" message="Please wait..." />`,
			},
		],
		api: {
			props: [
				{ name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Size of the spinner' },
				{ name: 'message', type: 'string', description: 'Optional message below spinner' },
				{ name: 'fullscreen', type: 'boolean', default: 'false', description: 'Display as fullscreen overlay' },
				{ name: 'label', type: 'string', default: "'Loading'", description: 'Accessible label' },
			],
		},
		tags: ['loading', 'spinner', 'overlay', 'fullscreen', 'accessibility'],
		bundleSize: { minified: '0.8 KB', gzipped: '0.4 KB' },
		accessibility: { wcag: 'AA', features: ['aria-live="polite"', 'aria-busy="true"', 'Focus trap in fullscreen'] },
		status: 'stable',
		version: '1.0.0',
		lastUpdated: '2025-02-14',
	},
	// ===================
	// HEADLESS PRIMITIVES
	// ===================
	{
		name: 'Button',
		slug: 'button',
		type: 'primitive',
		category: 'headless',
		description: 'Headless button primitive with keyboard navigation and ARIA support',
		longDescription:
			'A fully accessible button component that provides behavior and keyboard navigation without any styling. Built with Svelte 5 runes for optimal reactivity.',
		features: [
			'Full keyboard navigation',
			'ARIA attributes',
			'Disabled state handling',
			'Loading state support',
			'Custom event handlers',
			'Zero styling (bring your own)',
		],
		dependencies: ['svelte@^5.0.0'],
		registryDependencies: [],
		npm: {
			package: '@equaltoai/greater-components-headless',
			version: '1.0.0',
		},
		github: {
			url: 'https://github.com/equaltoai/greater-components/tree/main/packages/headless/src/primitives/button.ts',
			stars: 0,
		},
		examples: [
			{
				name: 'Basic Usage',
				description: 'Simple button with click handler',
				code: `<script>
  import { createButton } from '@equaltoai/greater-components-headless/button';

  const button = createButton({
    onClick: () => console.log('clicked')
  });
</script>

<button use:button.actions.button>
  Click me
</button>`,
			},
			{
				name: 'Disabled State',
				description: 'Button with disabled state',
				code: `<script>
  import { createButton } from '@equaltoai/greater-components-headless/button';

  let disabled = $state(false);

  const button = createButton({
    disabled,
    onClick: () => alert('Button clicked!')
  });
</script>

<button use:button.actions.button>
  {button.state.disabled ? 'Disabled' : 'Enabled'}
</button>`,
			},
		],
		api: {
			props: [
				{
					name: 'onClick',
					type: '() => void',
					description: 'Function called when button is clicked',
					required: false,
				},
				{
					name: 'disabled',
					type: 'boolean',
					default: 'false',
					description: 'Whether the button is disabled',
					required: false,
				},
			],
		},
		tags: ['headless', 'primitive', 'button', 'accessibility', 'interactive'],
		bundleSize: {
			minified: '0.42 KB',
			gzipped: '0.25 KB',
		},
		accessibility: {
			wcag: 'AAA',
			features: ['Keyboard navigation', 'Screen reader support', 'Focus management'],
		},
		status: 'stable',
		version: '1.0.0',
		lastUpdated: '2025-10-12',
	},

	{
		name: 'Modal',
		slug: 'modal',
		type: 'primitive',
		category: 'headless',
		description: 'Headless modal with focus trap, ESC handling, and portal support',
		longDescription:
			'A fully-featured modal primitive that handles all the complexity of focus management, keyboard navigation, and backdrop interactions. Portal rendering ensures proper stacking context.',
		features: [
			'Focus trap within modal',
			'ESC key to close',
			'Click outside to close',
			'Portal rendering',
			'Animation hooks',
			'Nested modal support',
		],
		dependencies: ['svelte@^5.0.0'],
		registryDependencies: [],
		npm: {
			package: '@equaltoai/greater-components-headless',
			version: '1.0.0',
		},
		github: {
			url: 'https://github.com/equaltoai/greater-components/tree/main/packages/headless/src/primitives/modal.ts',
		},
		examples: [
			{
				name: 'Basic Modal',
				description: 'Simple modal with open/close',
				code: `<script>
  import { createModal } from '@equaltoai/greater-components-headless/modal';

  let open = $state(false);
  const modal = createModal({ open });
</script>

<button onclick={() => open = true}>Open Modal</button>

{#if modal.state.open}
  <div use:modal.actions.overlay>
    <div use:modal.actions.content>
      <h2>Modal Title</h2>
      <p>Modal content here</p>
      <button onclick={() => open = false}>Close</button>
    </div>
  </div>
{/if}`,
			},
		],
		api: {
			props: [
				{
					name: 'open',
					type: 'boolean',
					default: 'false',
					description: 'Whether modal is open',
					required: false,
				},
				{
					name: 'closeOnEscape',
					type: 'boolean',
					default: 'true',
					description: 'Close modal when ESC is pressed',
					required: false,
				},
				{
					name: 'closeOnClickOutside',
					type: 'boolean',
					default: 'true',
					description: 'Close modal when clicking outside',
					required: false,
				},
			],
		},
		tags: ['headless', 'primitive', 'modal', 'dialog', 'overlay', 'accessibility'],
		bundleSize: {
			minified: '1.45 KB',
			gzipped: '1.19 KB',
		},
		accessibility: {
			wcag: 'AAA',
			features: ['Focus trap', 'ARIA dialog role', 'ESC key support', 'Return focus on close'],
		},
		status: 'stable',
		version: '1.0.0',
		lastUpdated: '2025-10-12',
	},

	// ===================
	// COMPOUND COMPONENTS
	// ===================
	{
		name: 'Menu',
		slug: 'menu',
		type: 'compound',
		category: 'headless',
		description: 'Compound dropdown menu with keyboard navigation and flexible placement',
		longDescription:
			'A fully-featured dropdown menu built with the compound component pattern. Includes Root, Trigger, Content, Item, Header, and Separator sub-components for maximum flexibility.',
		features: [
			'Compound component pattern',
			'Full keyboard navigation',
			'8 placement options',
			'Item icons and danger variant',
			'Section headers and separators',
			'Focus management',
			'Click outside to close',
		],
		dependencies: ['svelte@^5.0.0'],
		registryDependencies: [],
		npm: {
			package: '@equaltoai/greater-components-primitives',
			version: '1.0.0',
		},
		github: {
			url: 'https://github.com/equaltoai/greater-components/tree/main/packages/primitives/src/components/Menu',
		},
		examples: [
			{
				name: 'Basic Usage',
				description: 'Simple dropdown menu',
				code: `<Menu.Root>
  <Menu.Trigger>
    <Button>Open Menu</Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item onclick={handleEdit}>Edit</Menu.Item>
    <Menu.Separator />
    <Menu.Item onclick={handleDelete} variant="danger">Delete</Menu.Item>
  </Menu.Content>
</Menu.Root>`,
			},
		],
		api: {
			props: [
				{ name: 'open', type: 'boolean', default: 'false', description: 'Whether menu is open (bindable)' },
				{ name: 'placement', type: 'MenuPlacement', default: "'bottom-start'", description: 'Preferred placement' },
				{ name: 'offset', type: 'number', default: '4', description: 'Offset from trigger in pixels' },
				{ name: 'closeOnSelect', type: 'boolean', default: 'true', description: 'Close when item selected' },
				{ name: 'loop', type: 'boolean', default: 'true', description: 'Enable keyboard navigation loop' },
			],
		},
		tags: ['menu', 'dropdown', 'compound', 'navigation', 'accessibility'],
		bundleSize: { minified: '2.8 KB', gzipped: '1.2 KB' },
		accessibility: { wcag: 'AAA', features: ['Full keyboard navigation', 'ARIA menu role', 'Focus management', 'ESC to close'] },
		status: 'stable',
		version: '1.0.0',
		lastUpdated: '2025-02-14',
	},
	{
		name: 'Timeline',
		slug: 'timeline',
		type: 'compound',
		category: 'activitypub',
		description: 'ActivityPub timeline with virtual scrolling and real-time updates',
		longDescription:
			'A complete timeline implementation for ActivityPub feeds. Features virtual scrolling for performance, real-time updates via WebSocket, and a flexible compound component API for customization.',
		features: [
			'Virtual scrolling for 1000+ items',
			'Real-time updates via WebSocket',
			'Compound component pattern',
			'Loading & error states',
			'Infinite scroll',
			'Customizable item rendering',
		],
		dependencies: ['svelte@^5.0.0'],
		registryDependencies: [],
		npm: {
			package: '@equaltoai/greater-components-social',
			version: '1.0.0',
		},
		github: {
			url: 'https://github.com/equaltoai/greater-components/tree/main/packages/fediverse/src/components/Timeline',
		},
		examples: [
			{
				name: 'Basic Timeline',
				description: 'Simple timeline with items',
				code: `<script>
  import * as Timeline from '@equaltoai/greater-components-social/Timeline';
  
  const items = [
    { id: '1', content: 'First post' },
    { id: '2', content: 'Second post' }
  ];

  const handlers = {
    onItemClick: (item) => console.log('Clicked:', item),
    onLoadMore: () => console.log('Load more')
  };
</script>

<Timeline.Root {items} {handlers}>
  {#each items as item}
    <Timeline.Item {item} />
  {/each}
  <Timeline.LoadMore />
</Timeline.Root>`,
			},
		],
		tags: ['activitypub', 'timeline', 'feed', 'compound', 'virtual-scroll', 'real-time'],
		bundleSize: {
			minified: '4.2 KB',
			gzipped: '2.1 KB',
		},
		accessibility: {
			wcag: 'AA',
			features: ['Keyboard navigation', 'Screen reader announcements', 'Focus management'],
		},
		status: 'stable',
		version: '1.0.0',
		lastUpdated: '2025-10-12',
	},

	// ===================
	// LESSER INTEGRATION
	// ===================
	{
		name: 'Auth',
		slug: 'auth',
		type: 'compound',
		category: 'lesser',
		description: 'Complete authentication system with WebAuthn and 2FA',
		longDescription:
			'A full-featured authentication system designed for Lesser. Includes login, registration, WebAuthn, OAuth consent, two-factor authentication, and password reset flows.',
		features: [
			'Email/password login',
			'User registration',
			'WebAuthn support',
			'OAuth2 consent flow',
			'Two-factor authentication (TOTP)',
			'Backup codes',
			'Password reset',
			'Compound component pattern',
		],
		dependencies: ['svelte@^5.0.0'],
		registryDependencies: ['button'],
		npm: {
			package: '@equaltoai/greater-components-social',
			version: '1.0.0',
		},
		github: {
			url: 'https://github.com/equaltoai/greater-components/tree/main/packages/fediverse/src/components/Auth',
		},
		examples: [
			{
				name: 'Login Form',
				description: 'Complete login experience',
				code: `<script>
  import * as Auth from '@equaltoai/greater-components-social/Auth';
  
  const handlers = {
    onLogin: async ({ email, password, remember }) => {
      const result = await api.login(email, password);
      return result;
    }
  };
</script>

<Auth.Root {handlers}>
  <Auth.LoginForm />
</Auth.Root>`,
			},
		],
		tags: ['auth', 'authentication', 'lesser', 'compound', 'security', 'webauthn', '2fa'],
		bundleSize: {
			minified: '12.5 KB',
			gzipped: '4.8 KB',
		},
		accessibility: {
			wcag: 'AA',
			features: ['Form labels', 'Error announcements', 'Keyboard navigation'],
		},
		status: 'stable',
		version: '1.0.0',
		lastUpdated: '2025-10-12',
	},

	// ===================
	// ADAPTERS
	// ===================
	{
		name: 'GraphQL Adapter',
		slug: 'graphql-adapter',
		type: 'adapter',
		category: 'adapters',
		description: 'GraphQL adapter for Lesser with caching and subscriptions',
		longDescription:
			"Production-ready GraphQL client for Lesser's API. Features built-in caching with LRU eviction, request deduplication, WebSocket subscriptions, and pre-built queries/mutations.",
		features: [
			'LRU cache with TTL',
			'Request deduplication',
			'WebSocket subscriptions',
			'Auto-reconnect',
			'Pre-built queries & mutations',
			'TypeScript types',
			'Statistics & monitoring',
		],
		dependencies: [],
		registryDependencies: [],
		npm: {
			package: '@equaltoai/greater-components-social',
			version: '1.0.0',
		},
		github: {
			url: 'https://github.com/equaltoai/greater-components/tree/main/packages/fediverse/src/adapters/graphql',
		},
		examples: [
			{
				name: 'Basic Usage',
				description: 'Initialize client and fetch timeline',
				code: `import { createGraphQLClient } from '@equaltoai/greater-components-social/adapters/graphql';

const client = createGraphQLClient({
  endpoint: 'https://api.lesser.example.com/graphql',
  token: 'your-auth-token',
  enableCache: true,
  cacheTTL: 300000 // 5 minutes
});

// Fetch timeline (automatically cached)
const timeline = await client.query(GET_TIMELINE, {
  limit: 20,
  type: 'home'
});

// Subscribe to real-time updates
const unsubscribe = client.subscribe(
  TIMELINE_UPDATES,
  (event) => console.log('New activity:', event),
  { type: 'home' }
);`,
			},
		],
		tags: ['adapter', 'graphql', 'lesser', 'cache', 'websocket', 'real-time'],
		bundleSize: {
			minified: '7.01 KB',
			gzipped: '2.23 KB',
		},
		accessibility: {
			wcag: 'AAA',
			features: ['N/A - Data layer only'],
		},
		status: 'stable',
		version: '1.0.0',
		lastUpdated: '2025-10-12',
	},
];

/**
 * Get component by slug
 */
export function getComponentBySlug(slug: string): Component | undefined {
	return components.find((c) => c.slug === slug);
}

/**
 * Get components by category
 */
export function getComponentsByCategory(category: Component['category']): Component[] {
	return components.filter((c) => c.category === category);
}

/**
 * Get components by type
 */
export function getComponentsByType(type: Component['type']): Component[] {
	return components.filter((c) => c.type === type);
}

/**
 * Search components
 */
export function searchComponents(query: string): Component[] {
	const lowerQuery = query.toLowerCase();
	return components.filter(
		(c) =>
			c.name.toLowerCase().includes(lowerQuery) ||
			c.description.toLowerCase().includes(lowerQuery) ||
			c.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
	);
}

/**
 * Get component statistics
 */
export function getComponentStats() {
	return {
		total: components.length,
		byType: {
			primitive: components.filter((c) => c.type === 'primitive').length,
			compound: components.filter((c) => c.type === 'compound').length,
			pattern: components.filter((c) => c.type === 'pattern').length,
			adapter: components.filter((c) => c.type === 'adapter').length,
		},
		byCategory: {
			headless: components.filter((c) => c.category === 'headless').length,
			activitypub: components.filter((c) => c.category === 'activitypub').length,
			lesser: components.filter((c) => c.category === 'lesser').length,
			adapters: components.filter((c) => c.category === 'adapters').length,
		},
		byStatus: {
			stable: components.filter((c) => c.status === 'stable').length,
			beta: components.filter((c) => c.status === 'beta').length,
			alpha: components.filter((c) => c.status === 'alpha').length,
			experimental: components.filter((c) => c.status === 'experimental').length,
		},
	};
}

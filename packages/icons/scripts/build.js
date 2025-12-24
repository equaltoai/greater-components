import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import feather from 'feather-icons';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '../src');
const glyphsDir = path.join(srcDir, 'glyphs');
const iconsDir = path.join(srcDir, 'icons');

// Ensure directories exist
[srcDir, glyphsDir, iconsDir].forEach((dir) => {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
});

// Brand icons (OAuth providers and social media) - these use fill instead of stroke
const brandIcons = {
	google: {
		name: 'google',
		contents:
			'<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>',
	},
	apple: {
		name: 'apple',
		contents:
			'<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>',
	},
	microsoft: {
		name: 'microsoft',
		contents: '<path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>',
	},
	discord: {
		name: 'discord',
		contents:
			'<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>',
	},
};

// Fediverse-specific icons (custom SVG paths)
const fediverseIcons = {
	boost: {
		name: 'boost',
		contents:
			'<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>',
	},
	unboost: {
		name: 'unboost',
		contents:
			'<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" opacity="0.5"/><polyline points="16 6 12 2 8 6" opacity="0.5"/><line x1="12" y1="2" x2="12" y2="15" opacity="0.5"/>',
	},
	reply: {
		name: 'reply',
		contents: '<polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/>',
	},
	favorite: {
		name: 'favorite',
		contents:
			'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
	},
	unfavorite: {
		name: 'unfavorite',
		contents:
			'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none"/>',
	},
	follow: {
		name: 'follow',
		contents:
			'<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>',
	},
	unfollow: {
		name: 'unfollow',
		contents:
			'<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/>',
	},
	mention: {
		name: 'mention',
		contents:
			'<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>',
	},
	hashtag: {
		name: 'hashtag',
		contents:
			'<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>',
	},
	'less-than': {
		name: 'less-than',
		contents: '<polyline points="14 6 8 12 14 18"/>',
	},
	'greater-than': {
		name: 'greater-than',
		contents: '<polyline points="10 6 16 12 10 18"/>',
	},
	equals: {
		name: 'equals',
		contents: '<line x1="5" y1="9" x2="19" y2="9"/><line x1="5" y1="15" x2="19" y2="15"/>',
	},
	building: {
		name: 'building',
		contents:
			'<rect x="3" y="7" width="7" height="15" rx="1"/><rect x="14" y="3" width="7" height="19" rx="1"/><line x1="6" y1="11" x2="6" y2="11.01"/><line x1="6" y1="15" x2="6" y2="15.01"/><line x1="17.5" y1="7" x2="17.5" y2="7.01"/><line x1="17.5" y1="11" x2="17.5" y2="11.01"/><line x1="17.5" y1="15" x2="17.5" y2="15.01"/><line x1="17.5" y1="19" x2="17.5" y2="19.01"/>',
	},
	wallet: {
		name: 'wallet',
		contents:
			'<path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M22 12h-6a2 2 0 0 0 0 4h6"></path><circle cx="16" cy="14" r="1"></circle>',
	},
};

// Icon aliases for common names
const aliases = {
	globe: 'globe',
	world: 'globe',
	public: 'globe',
	lock: 'lock',
	private: 'lock',
	unlisted: 'eye-off',
	direct: 'mail',
	message: 'message-circle',
	comment: 'message-circle',
	share: 'share-2',
	repost: 'boost',
	reblog: 'boost',
	like: 'favorite',
	heart: 'favorite',
	star: 'star',
	bookmark: 'bookmark',
	more: 'more-horizontal',
	menu: 'menu',
	settings: 'settings',
	edit: 'edit-2',
	delete: 'trash-2',
	close: 'x',
	search: 'search',
	home: 'home',
	notifications: 'bell',
	profile: 'user',
	logout: 'log-out',
	login: 'log-in',
	less: 'less-than',
	lt: 'less-than',
	'<': 'less-than',
	greater: 'greater-than',
	gt: 'greater-than',
	'>': 'greater-than',
	equal: 'equals',
	eq: 'equals',
	'=': 'equals',
	building: 'building',
	'building-2': 'building',
	city: 'building',
	buildings: 'building',
	local: 'building',
	'list-check': 'list',
	'list-ordered': 'list',
	'clipboard-list': 'list',
};

// Generate Svelte component template for stroke-based icons
function generateComponent(iconName, svgContent) {
	return `<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';
  
  interface Props extends SVGAttributes<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    class?: string;
  }
  
  let {
    size = 24,
    color = 'currentColor',
    strokeWidth = 2,
    class: className = '',
    ...restProps
  }: Props = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke={color}
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  class="gr-icon gr-icon-${iconName} {className}"
  aria-hidden="true"
  {...restProps}
>
  ${svgContent}
</svg>`;
}

// Generate Svelte component template for fill-based brand icons
function generateBrandComponent(iconName, svgContent) {
	return `<!--
  Brand Icon - Use according to the respective company's brand guidelines.
  See the brands/index.ts file for links to official brand guidelines.
-->
<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';
  
  interface Props extends SVGAttributes<SVGSVGElement> {
    size?: number | string;
    color?: string;
    class?: string;
  }
  
  let {
    size = 24,
    color = 'currentColor',
    class: className = '',
    ...restProps
  }: Props = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill={color}
  class="gr-icon gr-icon-${iconName} {className}"
  aria-hidden="true"
  {...restProps}
>
  ${svgContent}
</svg>`;
}

// Process Feather icons
console.warn('🪶 Processing Feather icons...');
const featherIconNames = [];

for (const [name, icon] of Object.entries(feather.icons)) {
	const componentContent = generateComponent(name, icon.contents);
	const componentPath = path.join(iconsDir, `${name}.svelte`);
	fs.writeFileSync(componentPath, componentContent);
	featherIconNames.push(name);
}

// Process Fediverse icons
console.warn('🌐 Processing Fediverse icons...');
const fediverseIconNames = [];

for (const [name, icon] of Object.entries(fediverseIcons)) {
	const componentContent = generateComponent(name, icon.contents);
	const componentPath = path.join(iconsDir, `${name}.svelte`);
	fs.writeFileSync(componentPath, componentContent);
	fediverseIconNames.push(name);
}

// Process Brand icons
console.warn('🏢 Processing Brand icons...');
const brandsDir = path.join(iconsDir, 'brands');
if (!fs.existsSync(brandsDir)) {
	fs.mkdirSync(brandsDir, { recursive: true });
}
const brandIconNames = [];

for (const [name, icon] of Object.entries(brandIcons)) {
	const componentContent = generateBrandComponent(name, icon.contents);
	const componentPath = path.join(brandsDir, `${name}.svelte`);
	fs.writeFileSync(componentPath, componentContent);
	brandIconNames.push(name);
}

// Generate brands barrel export
const existingSocialIcons = [
	'github',
	'gitlab',
	'slack',
	'linkedin',
	'twitter',
	'facebook',
	'instagram',
	'youtube',
	'twitch',
];
const brandExportsContent = `/**
 * Brand Icons - OAuth Providers and Social Media
 * 
 * IMPORTANT: These are brand icons and should be used according to each
 * company's brand guidelines. See individual icon files for specific
 * licensing and usage information.
 * 
 * Brand Guidelines:
 * - Google: https://developers.google.com/identity/branding-guidelines
 * - Apple: https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple
 * - Microsoft: https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-add-branding-in-azure-ad-apps
 * - Discord: https://discord.com/branding
 * - GitHub: https://github.com/logos
 * - GitLab: https://about.gitlab.com/press/press-kit/
 * - Slack: https://slack.com/media-kit
 * - LinkedIn: https://brand.linkedin.com/
 */

// OAuth Provider Icons (new fill-based icons)
${brandIconNames
	.map((name) => {
		const pascalName = name
			.split('-')
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join('');
		return `export { default as ${pascalName}Icon } from './${name}.svelte';`;
	})
	.join('\n')}

// Re-export existing social icons from main icons directory
${existingSocialIcons
	.map((name) => {
		const pascalName = name
			.split('-')
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join('');
		return `export { default as ${pascalName}Icon } from '../${name}.svelte';`;
	})
	.join('\n')}

export const brandIconList = ${JSON.stringify([...brandIconNames, ...existingSocialIcons], null, 2)} as const;

export type BrandIconName = typeof brandIconList[number];
`;
fs.writeFileSync(path.join(brandsDir, 'index.ts'), brandExportsContent);

// Generate index file with exports
const allIconNames = [...featherIconNames, ...fediverseIconNames].sort();

const registryEntries = allIconNames.map((name) => {
	const pascalName = name
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('');
	return { name, pascalName };
});

const importsBlock = registryEntries
	.map(({ name, pascalName }) => `import ${pascalName}Icon from './icons/${name}.svelte';`)
	.join('\n');

const exportsBlock = `export {\n${registryEntries
	.map(({ pascalName }) => `  ${pascalName}Icon`)
	.join(',\n')}
};`;

const registryBlock = `const iconRegistry: Record<string, Component> = {\n${registryEntries
	.map(({ name, pascalName }) => `  '${name}': ${pascalName}Icon`)
	.join(',\n')}
} as const;`;

const indexContent = `// Auto-generated icon exports
// Do not edit manually

import type { Component } from 'svelte';
${importsBlock}

${exportsBlock}

${registryBlock}

export type IconName = ${allIconNames.map((name) => `'${name}'`).join(' | ')};

export const iconAliases: Record<string, IconName> = ${JSON.stringify(aliases, null, 2)};

export function getIcon(name: string): Component | null {
  const iconName = iconAliases[name] || name;
  return iconRegistry[iconName] ?? null;
}

export const iconList = [
${allIconNames.map((name) => `  '${name}'`).join(',\n')}
];

export const iconCategories = {
  fediverse: [
${fediverseIconNames.map((name) => `    '${name}'`).join(',\n')}
  ],
  brands: [
${[...brandIconNames, ...existingSocialIcons].map((name) => `    '${name}'`).join(',\n')}
  ],
  navigation: ['home', 'building', 'list', 'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down', 'chevron-left', 'chevron-right', 'chevron-up', 'chevron-down'],
  action: ['edit', 'edit-2', 'edit-3', 'trash', 'trash-2', 'save', 'download', 'upload', 'share', 'share-2'],
  media: ['play', 'pause', 'stop', 'skip-forward', 'skip-back', 'fast-forward', 'rewind', 'volume', 'volume-1', 'volume-2', 'volume-x'],
  communication: ['mail', 'message-circle', 'message-square', 'phone', 'phone-call', 'phone-incoming', 'phone-outgoing', 'video', 'mic', 'mic-off'],
  user: ['user', 'users', 'user-plus', 'user-minus', 'user-check', 'user-x'],
  ui: ['menu', 'more-horizontal', 'more-vertical', 'settings', 'search', 'filter', 'bell', 'bell-off', 'lock', 'unlock', 'eye', 'eye-off'],
  status: ['check', 'check-circle', 'x', 'x-circle', 'alert-circle', 'alert-triangle', 'info', 'help-circle'],
  files: ['file', 'file-text', 'folder', 'folder-open', 'paperclip', 'link', 'link-2'],
  common: Object.keys(iconAliases)
};
`;

fs.writeFileSync(path.join(srcDir, 'index.ts'), indexContent);

// Generate TypeScript declaration file
const dtsContent = `// Auto-generated type definitions
import type { Component } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface IconProps extends HTMLAttributes<SVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  class?: string;
}

export type IconComponent = Component<IconProps>;

${registryEntries
	.map(({ name, pascalName }) => `export declare const ${pascalName}Icon: IconComponent;`)
	.join('\n')}

export type IconName = ${allIconNames.map((name) => `'${name}'`).join(' | ')};

export declare const iconAliases: Record<string, IconName>;
export declare const iconList: IconName[];
export declare const iconCategories: Record<string, string[]>;
export declare function getIcon(name: string): IconComponent | null;
`;

fs.writeFileSync(path.join(srcDir, 'index.d.ts'), dtsContent);

console.warn('✅ Icons generated successfully!');
console.warn(`  - Feather icons: ${featherIconNames.length}`);
console.warn(`  - Fediverse icons: ${fediverseIconNames.length}`);
console.warn(`  - Brand icons: ${brandIconNames.length}`);
console.warn(
	`  - Total icons: ${featherIconNames.length + fediverseIconNames.length + brandIconNames.length}`
);
console.warn(`  - Aliases: ${Object.keys(aliases).length}`);

// Watch mode
if (process.argv.includes('--watch')) {
	console.warn('👀 Watching for changes...');

	const chokidar = await import('chokidar');
	const watcher = chokidar.watch([__filename], {
		persistent: true,
	});

	watcher.on('change', () => {
		console.warn('📝 Icons script changed, rebuilding...');
		process.argv = process.argv.filter((arg) => arg !== '--watch');
		import(import.meta.url);
	});
}

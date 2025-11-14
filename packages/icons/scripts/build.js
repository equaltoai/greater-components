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
[srcDir, glyphsDir, iconsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Fediverse-specific icons (custom SVG paths)
const fediverseIcons = {
  boost: {
    name: 'boost',
    contents: '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>'
  },
  unboost: {
    name: 'unboost',
    contents: '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" opacity="0.5"/><polyline points="16 6 12 2 8 6" opacity="0.5"/><line x1="12" y1="2" x2="12" y2="15" opacity="0.5"/>'
  },
  reply: {
    name: 'reply',
    contents: '<polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/>'
  },
  favorite: {
    name: 'favorite',
    contents: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>'
  },
  unfavorite: {
    name: 'unfavorite',
    contents: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none"/>'
  },
  follow: {
    name: 'follow',
    contents: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>'
  },
  unfollow: {
    name: 'unfollow',
    contents: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/>'
  },
  mention: {
    name: 'mention',
    contents: '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>'
  },
  hashtag: {
    name: 'hashtag',
    contents: '<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>'
  },
  'less-than': {
    name: 'less-than',
    contents: '<polyline points="14 6 8 12 14 18"/>'
  },
  'greater-than': {
    name: 'greater-than',
    contents: '<polyline points="10 6 16 12 10 18"/>'
  },
  equals: {
    name: 'equals',
    contents: '<line x1="5" y1="9" x2="19" y2="9"/><line x1="5" y1="15" x2="19" y2="15"/>'
  },
  building: {
    name: 'building',
    contents: '<rect x="3" y="7" width="7" height="15" rx="1"/><rect x="14" y="3" width="7" height="19" rx="1"/><line x1="6" y1="11" x2="6" y2="11.01"/><line x1="6" y1="15" x2="6" y2="15.01"/><line x1="17.5" y1="7" x2="17.5" y2="7.01"/><line x1="17.5" y1="11" x2="17.5" y2="11.01"/><line x1="17.5" y1="15" x2="17.5" y2="15.01"/><line x1="17.5" y1="19" x2="17.5" y2="19.01"/>'
  }
};

// Icon aliases for common names
const aliases = {
  'globe': 'globe',
  'world': 'globe',
  'public': 'globe',
  'lock': 'lock',
  'private': 'lock',
  'unlisted': 'eye-off',
  'direct': 'mail',
  'message': 'message-circle',
  'comment': 'message-circle',
  'share': 'share-2',
  'repost': 'boost',
  'reblog': 'boost',
  'like': 'favorite',
  'heart': 'favorite',
  'star': 'star',
  'bookmark': 'bookmark',
  'more': 'more-horizontal',
  'menu': 'menu',
  'settings': 'settings',
  'edit': 'edit-2',
  'delete': 'trash-2',
  'close': 'x',
  'search': 'search',
  'home': 'home',
  'notifications': 'bell',
  'profile': 'user',
  'logout': 'log-out',
  'login': 'log-in',
  'less': 'less-than',
  'lt': 'less-than',
  '<': 'less-than',
  'greater': 'greater-than',
  'gt': 'greater-than',
  '>': 'greater-than',
  'equal': 'equals',
  'eq': 'equals',
  '=': 'equals',
  'building': 'building',
  'building-2': 'building',
  'city': 'building',
  'buildings': 'building',
  'local': 'building',
  'list-check': 'list',
  'list-ordered': 'list',
  'clipboard-list': 'list'
};

// Generate Svelte component template
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

// Generate index file with exports
const allIconNames = [...featherIconNames, ...fediverseIconNames].sort();

const registryEntries = allIconNames.map(name => {
  const pascalName = name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  return { name, pascalName };
});

const importsBlock = registryEntries
  .map(({ name, pascalName }) => `import ${pascalName}Icon from './icons/${name}.svelte';`)
  .join('\n');

const exportsBlock = `export {\n${registryEntries
  .map(({ pascalName }) => `  ${pascalName}Icon`)
  .join(',\n')}\n};`;

const registryBlock = `const iconRegistry = {\n${registryEntries
  .map(({ name, pascalName }) => `  '${name}': ${pascalName}Icon`)
  .join(',\n')}\n} as const;`;

const indexContent = `// Auto-generated icon exports
// Do not edit manually

${importsBlock}

${exportsBlock}

${registryBlock}

export type IconName = ${allIconNames.map(name => `'${name}'`).join(' | ')};

export const iconAliases: Record<string, IconName> = ${JSON.stringify(aliases, null, 2)};

export function getIcon(name: string) {
  const iconName = iconAliases[name] || name;
  return iconRegistry[iconName] ?? null;
}

export const iconList = [
${allIconNames.map(name => `  '${name}'`).join(',\n')}
];

export const iconCategories = {
  fediverse: [
${fediverseIconNames.map(name => `    '${name}'`).join(',\n')}
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
import type { SvelteComponent } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface IconProps extends HTMLAttributes<SVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  class?: string;
}

export type IconComponent = typeof SvelteComponent<IconProps>;

${registryEntries
  .map(({ name, pascalName }) => `export declare const ${pascalName}Icon: IconComponent;`)
  .join('\n')}

export type IconName = ${allIconNames.map(name => `'${name}'`).join(' | ')};

export declare const iconAliases: Record<string, IconName>;
export declare const iconList: IconName[];
export declare const iconCategories: Record<string, string[]>;
export declare function getIcon(name: string): IconComponent | null;
`;

fs.writeFileSync(path.join(srcDir, 'index.d.ts'), dtsContent);

console.warn('✅ Icons generated successfully!');
console.warn(`  - Feather icons: ${featherIconNames.length}`);
console.warn(`  - Fediverse icons: ${fediverseIconNames.length}`);
console.warn(`  - Total icons: ${featherIconNames.length + fediverseIconNames.length}`);
console.warn(`  - Aliases: ${Object.keys(aliases).length}`);

// Watch mode
if (process.argv.includes('--watch')) {
  console.warn('👀 Watching for changes...');
  
  const chokidar = await import('chokidar');
  const watcher = chokidar.watch([__filename], {
    persistent: true
  });
  
  watcher.on('change', () => {
    console.warn('📝 Icons script changed, rebuilding...');
    process.argv = process.argv.filter(arg => arg !== '--watch');
    import(import.meta.url);
  });
}

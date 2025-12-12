/**
 * Configuration utilities for Greater Components CLI
 * Handles project configuration and component settings
 */

import { z } from 'zod';
import path from 'node:path';
import fs from 'fs-extra';

/**
 * Schema URL for JSON Schema validation
 */
export const SCHEMA_URL = 'https://greater.components.dev/schema.json';

/**
 * Current configuration schema version
 */
export const CONFIG_SCHEMA_VERSION = '1.0.0';

/**
 * Default Git ref for fetching components
 */
export const DEFAULT_REF = 'greater-v4.2.0';

/**
 * File checksum entry for tracking installed file integrity
 */
export const fileChecksumEntrySchema = z.object({
	path: z.string(),
	checksum: z.string(),
});

export type FileChecksumEntry = z.infer<typeof fileChecksumEntrySchema>;

/**
 * Installed component tracking schema
 */
export const installedComponentSchema = z.object({
	name: z.string(),
	version: z.string(),
	installedAt: z.string().datetime(),
	modified: z.boolean().optional().default(false),
	checksums: z.array(fileChecksumEntrySchema).optional().default([]),
});

export type InstalledComponent = z.infer<typeof installedComponentSchema>;

/**
 * CSS configuration schema
 */
export const cssConfigSchema = z.object({
	tokens: z.boolean().default(true),
	primitives: z.boolean().default(true),
	face: z.union([z.string(), z.null()]).default(null),
});

export type CssConfig = z.infer<typeof cssConfigSchema>;

/**
 * Component configuration schema
 * Enhanced to support Lesser Faces distribution model with Git-based versioning
 */
export const componentConfigSchema = z.object({
	$schema: z.string().optional(),
	version: z.string().default(CONFIG_SCHEMA_VERSION),
	ref: z.string().optional().default(DEFAULT_REF),
	style: z.enum(['default', 'new-york', 'minimal', 'custom']).default('default'),
	rsc: z.boolean().default(false),
	tsx: z.boolean().default(true),
	tailwind: z
		.object({
			config: z.string(),
			css: z.string(),
			baseColor: z.enum(['slate', 'gray', 'zinc', 'neutral', 'stone']).default('slate'),
			cssVariables: z.boolean().default(true),
		})
		.optional(),
	aliases: z.object({
		components: z.string().default('$lib/components'),
		utils: z.string().default('$lib/utils'),
		ui: z.string().default('$lib/components/ui'),
		lib: z.string().default('$lib'),
		hooks: z.string().default('$lib/hooks'),
	}),
	css: cssConfigSchema.optional().default({
		tokens: true,
		primitives: true,
		face: null,
	}),
	installed: z.array(installedComponentSchema).optional().default([]),
	lesserVersion: z.string().optional(),
});

export type ComponentConfig = z.infer<typeof componentConfigSchema>;

const CONFIG_FILE_NAME = 'components.json';

/**
 * Get the configuration file path for a project
 */
export function getConfigPath(cwd: string = process.cwd()): string {
	return path.join(cwd, CONFIG_FILE_NAME);
}

/**
 * Check if configuration exists
 */
export async function configExists(cwd: string = process.cwd()): Promise<boolean> {
	const configPath = getConfigPath(cwd);
	return fs.pathExists(configPath);
}

/**
 * Migration result type
 */
export interface MigrationResult {
	migrated: boolean;
	changes: string[];
	config: ComponentConfig;
}

/**
 * Check if a config needs migration to the new schema
 */
export function needsMigration(config: Record<string, unknown>): boolean {
	return (
		!config['version'] ||
		!config['ref'] ||
		!config['css'] ||
		!config['installed'] ||
		!config['$schema']
	);
}

/**
 * Migrate old config format to new schema
 * Preserves existing aliases and settings while adding new required fields
 */
export function migrateConfig(oldConfig: Record<string, unknown>): MigrationResult {
	const changes: string[] = [];

	// Start with the old config
	const newConfig: Record<string, unknown> = { ...oldConfig };

	// Add $schema if missing
	if (!newConfig['$schema']) {
		newConfig['$schema'] = SCHEMA_URL;
		changes.push('Added $schema URL');
	}

	// Add version if missing
	if (!newConfig['version']) {
		newConfig['version'] = CONFIG_SCHEMA_VERSION;
		changes.push(`Added version: ${CONFIG_SCHEMA_VERSION}`);
	}

	// Add ref if missing
	if (!newConfig['ref']) {
		newConfig['ref'] = DEFAULT_REF;
		changes.push(`Added ref: ${DEFAULT_REF}`);
	}

	// Add css config if missing
	if (!newConfig['css']) {
		newConfig['css'] = {
			tokens: true,
			primitives: true,
			face: null,
		};
		changes.push('Added css configuration');
	}

	// Add installed array if missing
	if (!newConfig['installed']) {
		newConfig['installed'] = [];
		changes.push('Added installed components tracking');
	}

	// Migrate old style values if needed
	const style = newConfig['style'] as string | undefined;
	if (style === 'new-york') {
		// Keep as-is, it's still valid
	} else if (!style || !['default', 'minimal', 'custom'].includes(style)) {
		newConfig['style'] = 'default';
		changes.push('Reset invalid style to default');
	}

	// Parse and validate the migrated config
	const validatedConfig = componentConfigSchema.parse(newConfig);

	return {
		migrated: changes.length > 0,
		changes,
		config: validatedConfig,
	};
}

/**
 * Read configuration from file
 * Automatically migrates old config formats to new schema
 */
export async function readConfig(cwd: string = process.cwd()): Promise<ComponentConfig | null> {
	const configPath = getConfigPath(cwd);

	if (!(await fs.pathExists(configPath))) {
		return null;
	}

	try {
		const content = await fs.readFile(configPath, 'utf-8');
		const json = JSON.parse(content);

		// Check if migration is needed
		if (needsMigration(json)) {
			const result = migrateConfig(json);
			// Auto-save migrated config
			if (result.migrated) {
				await writeConfig(result.config, cwd);
			}
			return result.config;
		}

		return componentConfigSchema.parse(json);
	} catch (error) {
		throw new Error(
			`Failed to read config from ${configPath}: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

/**
 * Read configuration without auto-migration
 * Useful for checking config state before migration
 */
export async function readConfigRaw(
	cwd: string = process.cwd()
): Promise<Record<string, unknown> | null> {
	const configPath = getConfigPath(cwd);

	if (!(await fs.pathExists(configPath))) {
		return null;
	}

	try {
		const content = await fs.readFile(configPath, 'utf-8');
		return JSON.parse(content);
	} catch (error) {
		throw new Error(
			`Failed to read config from ${configPath}: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

/**
 * Write configuration to file
 */
export async function writeConfig(
	config: ComponentConfig,
	cwd: string = process.cwd()
): Promise<void> {
	const configPath = getConfigPath(cwd);

	try {
		await fs.writeFile(configPath, JSON.stringify(config, null, 2));
	} catch (error) {
		throw new Error(
			`Failed to write config to ${configPath}: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

/**
 * Resolve path alias
 */
export function resolveAlias(
	alias: string,
	config: ComponentConfig,
	cwd: string = process.cwd()
): string {
	const aliases = config.aliases;

	// Map common aliases
	const aliasMap: Record<string, string> = {
		'@/components': aliases.components,
		'@/utils': aliases.utils,
		'@/ui': aliases.ui,
		'@/lib': aliases.lib,
		'@/hooks': aliases.hooks,
		'$lib/components': aliases.components,
		'$lib/utils': aliases.utils,
		$lib: aliases.lib,
	};

	const resolved = aliasMap[alias] || alias;

	// Convert Svelte aliases to file paths
	return path.join(cwd, resolved.replace(/^\$lib/, 'src/lib'));
}

/**
 * Get component installation path
 */
export function getComponentPath(
	componentName: string,
	config: ComponentConfig,
	cwd: string = process.cwd()
): string {
	const componentsDir = resolveAlias(config.aliases.ui, config, cwd);
	return path.join(componentsDir, `${componentName}.svelte`);
}

/**
 * Check if a component is already installed
 */
export function isComponentInstalled(componentName: string, config: ComponentConfig): boolean {
	return config.installed?.some((c) => c.name === componentName) ?? false;
}

/**
 * Get installed component metadata
 */
export function getInstalledComponent(
	componentName: string,
	config: ComponentConfig
): InstalledComponent | undefined {
	return config.installed?.find((c) => c.name === componentName);
}

/**
 * Add a component to the installed tracking array
 */
export function addInstalledComponent(
	config: ComponentConfig,
	componentName: string,
	version: string,
	checksums: FileChecksumEntry[] = []
): ComponentConfig {
	const now = new Date().toISOString();
	const installed = config.installed ?? [];

	// Check if already installed
	const existingIndex = installed.findIndex((c) => c.name === componentName);

	if (existingIndex >= 0) {
		// Update existing entry
		installed[existingIndex] = {
			name: componentName,
			version,
			installedAt: now,
			modified: false,
			checksums,
		};
	} else {
		// Add new entry
		installed.push({
			name: componentName,
			version,
			installedAt: now,
			modified: false,
			checksums,
		});
	}

	return {
		...config,
		installed,
	};
}

/**
 * Get checksums for an installed component
 */
export function getInstalledChecksums(
	config: ComponentConfig,
	componentName: string
): FileChecksumEntry[] {
	const installed = getInstalledComponent(componentName, config);
	return installed?.checksums ?? [];
}

/**
 * Update checksums for an installed component
 */
export function updateInstalledChecksums(
	config: ComponentConfig,
	componentName: string,
	checksums: FileChecksumEntry[]
): ComponentConfig {
	return updateInstalledComponent(config, componentName, { checksums, modified: false });
}

/**
 * Check if a file's checksum matches the installed checksum
 */
export function fileMatchesInstalledChecksum(
	config: ComponentConfig,
	componentName: string,
	filePath: string,
	currentChecksum: string
): boolean {
	const checksums = getInstalledChecksums(config, componentName);
	const entry = checksums.find((c) => c.path === filePath);
	return entry?.checksum === currentChecksum;
}

/**
 * Update an installed component's metadata
 */
export function updateInstalledComponent(
	config: ComponentConfig,
	componentName: string,
	updates: Partial<Omit<InstalledComponent, 'name'>>
): ComponentConfig {
	const installed = config.installed ?? [];
	const index = installed.findIndex((c) => c.name === componentName);

	const existingComponent = installed[index];
	if (index < 0 || !existingComponent) {
		return config; // Component not found, return unchanged
	}

	installed[index] = {
		name: existingComponent.name,
		version: existingComponent.version,
		installedAt: existingComponent.installedAt,
		modified: existingComponent.modified,
		checksums: existingComponent.checksums,
		...updates,
	};

	return {
		...config,
		installed,
	};
}

/**
 * Remove a component from the installed tracking array
 */
export function removeInstalledComponent(
	config: ComponentConfig,
	componentName: string
): ComponentConfig {
	const installed = config.installed ?? [];

	return {
		...config,
		installed: installed.filter((c) => c.name !== componentName),
	};
}

/**
 * Mark a component as locally modified
 */
export function markComponentModified(
	config: ComponentConfig,
	componentName: string,
	modified: boolean = true
): ComponentConfig {
	return updateInstalledComponent(config, componentName, { modified });
}

/**
 * Get all installed component names
 */
export function getInstalledComponentNames(config: ComponentConfig): string[] {
	return config.installed?.map((c) => c.name) ?? [];
}

/**
 * Check if any components are installed
 */
export function hasInstalledComponents(config: ComponentConfig): boolean {
	return (config.installed?.length ?? 0) > 0;
}

/**
 * Get installed components count
 */
export function getInstalledComponentsCount(config: ComponentConfig): number {
	return config.installed?.length ?? 0;
}

/**
 * Get components that have been locally modified
 */
export function getModifiedComponents(config: ComponentConfig): InstalledComponent[] {
	return config.installed?.filter((c) => c.modified) ?? [];
}

/**
 * Options for creating default configuration
 */
export interface CreateConfigOptions {
	/** Pre-selected face */
	face?: string | null;
	/** Project type for path defaults */
	projectType?: 'sveltekit' | 'vite-svelte' | 'svelte' | 'unknown';
	/** Whether project uses TypeScript */
	hasTypeScript?: boolean;
	/** Version ref to pin */
	ref?: string;
}

/**
 * Create default configuration
 * Generates a config matching the new Lesser Faces distribution model
 * Enhanced to accept optional customization parameters
 */
export function createDefaultConfig(options: CreateConfigOptions = {}): ComponentConfig {
	const isSvelteKit = options.projectType === 'sveltekit';
	const libPrefix = isSvelteKit ? '$lib' : 'src/lib';

	return {
		$schema: SCHEMA_URL,
		version: CONFIG_SCHEMA_VERSION,
		ref: options.ref || DEFAULT_REF,
		style: 'default',
		rsc: false,
		tsx: options.hasTypeScript ?? true,
		aliases: {
			components: `${libPrefix}/components`,
			utils: `${libPrefix}/utils`,
			ui: `${libPrefix}/components/ui`,
			lib: libPrefix,
			hooks: `${libPrefix}/hooks`,
		},
		css: {
			tokens: true,
			primitives: true,
			face: options.face ?? null,
		},
		installed: [],
	};
}

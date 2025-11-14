/**
 * Configuration utilities for Greater Components CLI
 * Handles project configuration and component settings
 */

import { z } from 'zod';
import path from 'node:path';
import fs from 'fs-extra';

/**
 * Component configuration schema
 */
export const componentConfigSchema = z.object({
	$schema: z.string().optional(),
	style: z.enum(['default', 'new-york']).default('default'),
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
 * Read configuration from file
 */
export async function readConfig(cwd: string = process.cwd()): Promise<ComponentConfig | null> {
	const configPath = getConfigPath(cwd);

	if (!(await fs.pathExists(configPath))) {
		return null;
	}

	try {
		const content = await fs.readFile(configPath, 'utf-8');
		const json = JSON.parse(content);
		return componentConfigSchema.parse(json);
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
 * Create default configuration
 */
export function createDefaultConfig(): ComponentConfig {
	return {
		style: 'default',
		rsc: false,
		tsx: true,
		aliases: {
			components: '$lib/components',
			utils: '$lib/utils',
			ui: '$lib/components/ui',
			lib: '$lib',
			hooks: '$lib/hooks',
		},
	};
}

/**
 * Fetch component source code from repository
 */

import type { ComponentFile, ComponentMetadata } from '../registry/index.js';

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/equaltoai/greater-components/main';

/**
 * Fetch file content from GitHub
 */
async function fetchFileContent(filePath: string): Promise<string> {
	const url = `${GITHUB_RAW_BASE}/packages/fediverse/src/${filePath}`;

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return await response.text();
	} catch (error) {
		throw new Error(
			`Failed to fetch ${filePath}: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

/**
 * Fetch all files for a component
 */
export async function fetchComponentFiles(
	component: ComponentMetadata
): Promise<ComponentFile[]> {
	const files: ComponentFile[] = [];

	for (const file of component.files) {
		try {
			const content = await fetchFileContent(file.path);
			files.push({
				...file,
				content,
			});
		} catch (error) {
			throw new Error(
				`Failed to fetch file ${file.path} for component ${component.name}: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	return files;
}

/**
 * Fetch multiple components
 */
export async function fetchComponents(
	componentNames: string[],
	registry: Record<string, ComponentMetadata>
): Promise<Map<string, ComponentFile[]>> {
	const result = new Map<string, ComponentFile[]>();

	for (const name of componentNames) {
		const component = registry[name];
		if (!component) {
			throw new Error(`Component "${name}" not found in registry`);
		}

		const files = await fetchComponentFiles(component);
		result.set(name, files);
	}

	return result;
}

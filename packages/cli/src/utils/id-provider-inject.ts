/**
 * IdProvider injection utility
 */

import { readFile, writeFile } from './files.js';
import type { ComponentConfig } from './config.js';

/**
 * Result of IdProvider injection
 */
export interface InjectionResult {
	success: boolean;
	skipped: boolean;
	error?: string;
}

/**
 * Inject IdProvider into a Svelte component
 * Wraps the template content with <IdProvider> and adds the import
 */
export async function injectIdProvider(
	filePath: string,
	config: ComponentConfig
): Promise<InjectionResult> {
	try {
		const content = await readFile(filePath);

		// Check if already injected (usage check)
		if (content.includes('<IdProvider') || content.includes('IdProvider>')) {
			return { success: true, skipped: true };
		}

		// Determine import path
		// - Vendored mode: import from the vendored core utils package location
		// - Hybrid mode: import from the umbrella package export
		const importPath =
			config.installMode === 'vendored'
				? `${config.aliases.greater.replace(/\/+$/, '')}/utils`
				: '@equaltoai/greater-components/utils';

		// Check if already imported (but maybe not used in template)
		const hasImport =
			new RegExp(
				`import\\s+.*IdProvider.*from\\s+['"]${importPath.replace(
					/[.*+?^${}()|[\]\\]/g,
					'\\$&'
				)}['"]`
			).test(content) || /import\s+.*IdProvider.*from/.test(content);

		const importStmt = `import { IdProvider } from '${importPath}';`;

		// Split content into scripts, styles, and template
		const scriptRegex = /<script(\s+[^>]*)?>([\s\S]*?)<\/script>/g;
		const styleRegex = /<style(\s+[^>]*)?>([\s\S]*?)<\/style>/g;

		const scripts: string[] = [];
		const styles: string[] = [];
		let template = content;

		// Extract scripts
		template = template.replace(scriptRegex, (match) => {
			scripts.push(match);
			return '';
		});

		// Extract styles
		template = template.replace(styleRegex, (match) => {
			styles.push(match);
			return '';
		});

		// Extract top-level Svelte special elements that must remain at the component root.
		const specialBlocks: string[] = [];
		const specialRegex =
			/<svelte:(head|options)(\s+[^>]*)?>[\s\S]*?<\/svelte:\1>|<svelte:(window|body)(\s+[^>]*)?\s*\/?>/g;
		template = template.replace(specialRegex, (match) => {
			specialBlocks.push(match);
			return '';
		});

		// Trim template to avoid excessive whitespace
		template = template.trim();

		// Wrap template
		const wrappedTemplate = `<IdProvider>\n\t${template}\n</IdProvider>`;

		// Process scripts to inject import
		// We look for the instance script (no context="module")
		let scriptBlock = scripts.find((s) => !s.includes('context="module"'));

		if (scriptBlock) {
			// Inject into existing instance script
			if (!hasImport) {
				scripts[scripts.indexOf(scriptBlock)] = scriptBlock.replace(
					/<script(\s+[^>]*)?>\s*/,
					(match) => `${match}\t${importStmt}\n`
				);
			}
		} else {
			// Create new instance script
			const newScript = `<script>\n\t${importStmt}\n</script>`;
			// Insert after module script if it exists, otherwise at start
			const moduleScriptIndex = scripts.findIndex((s) => s.includes('context="module"'));
			if (moduleScriptIndex !== -1) {
				scripts.splice(moduleScriptIndex + 1, 0, newScript);
			} else {
				scripts.unshift(newScript);
			}
		}

		// Reassemble file content
		const parts = [...scripts, ...specialBlocks, ...styles, wrappedTemplate];

		const newContent = parts.join('\n\n');

		await writeFile(filePath, newContent);
		return { success: true, skipped: false };
	} catch (error) {
		return {
			success: false,
			skipped: false,
			error: error instanceof Error ? error.message : String(error),
		};
	}
}

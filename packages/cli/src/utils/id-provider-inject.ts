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

		// Extract blocks using explicit parsing (safer than regex for CodeQL)
		const scripts: string[] = [];
		const styles: string[] = [];
		let template = content;

		// Extract script blocks by finding opening and closing tags
		template = extractBlocks(template, 'script', scripts);
		// Extract style blocks
		template = extractBlocks(template, 'style', styles);

		// Extract top-level Svelte special elements
		const specialBlocks: string[] = [];
		template = extractSvelteSpecialBlocks(template, specialBlocks);

		// Trim template to avoid excessive whitespace
		template = template.trim();

		// Wrap template
		const wrappedTemplate = `<IdProvider>\n\t${template}\n</IdProvider>`;

		// Process scripts to inject import
		// We look for the instance script (no context="module")
		const scriptBlock = scripts.find((s) => !s.includes('context="module"'));

		if (scriptBlock) {
			// Inject into existing instance script
			if (!hasImport) {
				scripts[scripts.indexOf(scriptBlock)] = scriptBlock.replace(
					/<script(\s+[^>]*)?>\s*/i,
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

/**
 * Extract blocks of a given tag type from content using indexOf.
 * Safer than regex for CodeQL analysis.
 */
function extractBlocks(content: string, tagName: string, blocks: string[]): string {
	let result = content;
	const openTag = `<${tagName}`;
	const closeTag = `</${tagName}>`;

	const searchFrom = 0;
	while (true) {
		const startIdx = result.toLowerCase().indexOf(openTag.toLowerCase(), searchFrom);
		if (startIdx === -1) break;

		// Find the end of the opening tag
		const openTagEnd = result.indexOf('>', startIdx);
		if (openTagEnd === -1) break;

		// Find the closing tag
		const closeIdx = result.toLowerCase().indexOf(closeTag.toLowerCase(), openTagEnd);
		if (closeIdx === -1) break;

		const blockEnd = closeIdx + closeTag.length;
		const block = result.substring(startIdx, blockEnd);
		blocks.push(block);

		// Remove the block from result
		result = result.substring(0, startIdx) + result.substring(blockEnd);
		// Continue searching from same position
	}

	return result;
}

/**
 * Extract Svelte special blocks like svelte:head, svelte:options, svelte:window, svelte:body
 */
function extractSvelteSpecialBlocks(content: string, blocks: string[]): string {
	let result = content;

	// Handle paired tags: svelte:head, svelte:options
	for (const tag of ['svelte:head', 'svelte:options']) {
		const openTag = `<${tag}`;
		const closeTag = `</${tag}>`;

		const searchFrom = 0;
		while (true) {
			const startIdx = result.indexOf(openTag, searchFrom);
			if (startIdx === -1) break;

			const closeIdx = result.indexOf(closeTag, startIdx);
			if (closeIdx === -1) break;

			const blockEnd = closeIdx + closeTag.length;
			blocks.push(result.substring(startIdx, blockEnd));
			result = result.substring(0, startIdx) + result.substring(blockEnd);
		}
	}

	// Handle self-closing tags: svelte:window, svelte:body
	for (const tag of ['svelte:window', 'svelte:body']) {
		const openTag = `<${tag}`;

		const searchFrom = 0;
		while (true) {
			const startIdx = result.indexOf(openTag, searchFrom);
			if (startIdx === -1) break;

			// Find end of tag (could be /> or >)
			const closeSlash = result.indexOf('/>', startIdx);
			const closeAngle = result.indexOf('>', startIdx);

			let blockEnd: number;
			if (closeSlash !== -1 && (closeAngle === -1 || closeSlash < closeAngle)) {
				blockEnd = closeSlash + 2;
			} else if (closeAngle !== -1) {
				blockEnd = closeAngle + 1;
			} else {
				break;
			}

			blocks.push(result.substring(startIdx, blockEnd));
			result = result.substring(0, startIdx) + result.substring(blockEnd);
		}
	}

	return result;
}

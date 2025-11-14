#!/usr/bin/env node
/**
 * Post-build script to rename ALL $ prefixed variables in compiled Svelte files
 * This is a failsafe to ensure no $ prefixes remain in the output
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = join(__dirname, '..', 'dist');

function renameDollarVarsInCode(code) {
	const seenVars = new Map();

	// Use replace with a function for more reliable matching
	// Parameters: (match, offset, string) when no capture groups
	const result = code.replace(/\$+[a-zA-Z0-9_]+/g, (match, offset, string) => {
		// Skip if part of another identifier
		if (offset > 0 && /\w/.test(string[offset - 1])) return match;
		if (offset + match.length < string.length && /\w/.test(string[offset + match.length]))
			return match;

		// Skip if in a string literal - use a more accurate detection
		// Check if we're inside quotes by finding the last unescaped quote before this position
		let inSingleQuote = false;
		let inDoubleQuote = false;
		let inBacktick = false;

		// Track escape state properly - count consecutive backslashes
		for (let i = 0; i < offset; i++) {
			const char = string[i];
			// Count consecutive backslashes before this character
			let backslashCount = 0;
			for (let j = i - 1; j >= 0 && string[j] === '\\'; j--) {
				backslashCount++;
			}
			// If odd number of backslashes, the quote is escaped
			const isEscaped = backslashCount % 2 === 1;

			if (!isEscaped) {
				if (char === "'" && !inDoubleQuote && !inBacktick) {
					inSingleQuote = !inSingleQuote;
				} else if (char === '"' && !inSingleQuote && !inBacktick) {
					inDoubleQuote = !inDoubleQuote;
				} else if (char === '`' && !inSingleQuote && !inDoubleQuote) {
					inBacktick = !inBacktick;
				}
			}
		}

		if (inSingleQuote || inDoubleQuote || inBacktick) return match;

		// Generate replacement
		let replacement;
		if (!seenVars.has(match)) {
			const baseName = match.replace(/^\$+/, '');
			replacement = `_${baseName}`;
			seenVars.set(match, replacement);
		} else {
			replacement = seenVars.get(match);
		}

		return replacement;
	});

	return result;
}

function processDirectory(dir) {
	try {
		const entries = readdirSync(dir);
		for (const entry of entries) {
			const fullPath = join(dir, entry);
			const stat = statSync(fullPath);

			if (stat.isDirectory()) {
				processDirectory(fullPath);
			} else if (entry.endsWith('.svelte.js') && !entry.endsWith('.map')) {
				try {
					const content = readFileSync(fullPath, 'utf8');
					const processed = renameDollarVarsInCode(content);
					if (content !== processed) {
						writeFileSync(fullPath, processed, 'utf8');
						console.log(`✅ Fixed: ${fullPath.replace(process.cwd(), '.')}`);
					}
				} catch (err) {
					console.error(`❌ Error processing ${fullPath}:`, err.message);
				}
			}
		}
	} catch (err) {
		console.error(`❌ Error reading directory ${dir}:`, err.message);
	}
}

processDirectory(distDir);
console.log('✅ Dollar variable renaming complete');

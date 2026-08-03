/**
 * Remove CSS block comments without treating comment delimiters inside quoted
 * strings as syntax. Newlines and character offsets are preserved so callers
 * can continue to report locations against the original source.
 *
 * An unterminated comment consumes the rest of the source, matching CSS comment
 * tokenization rather than leaving the trailing text visible to audits.
 *
 * @param {string} source
 * @returns {string}
 */
export function stripCssBlockComments(source) {
	let result = '';
	let quote = null;

	for (let offset = 0; offset < source.length; offset += 1) {
		const character = source[offset];

		if (quote) {
			result += character;
			if (character === '\\' && offset + 1 < source.length) {
				offset += 1;
				result += source[offset];
			} else if (character === quote) {
				quote = null;
			} else if (character === '\n' || character === '\r' || character === '\f') {
				// An unescaped line break ends a CSS string as a bad-string token.
				quote = null;
			}
			continue;
		}

		if (character === '"' || character === "'") {
			quote = character;
			result += character;
			continue;
		}

		if (character === '/' && source[offset + 1] === '*') {
			result += '  ';
			offset += 2;
			while (offset < source.length) {
				const commentCharacter = source[offset];
				if (commentCharacter === '*' && source[offset + 1] === '/') {
					result += '  ';
					offset += 1;
					break;
				}
				result += commentCharacter === '\n' || commentCharacter === '\r' ? commentCharacter : ' ';
				offset += 1;
			}
			continue;
		}

		result += character;
	}

	return result;
}

/**
 * CSS Copy Tests
 * Ensures local CSS copying can succeed even when tokens theme.css is not present in Git refs.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

// In-memory fs-extra mock
const { fsStore, fsMock } = vi.hoisted(() => {
	const fsStore = new Map<string, Buffer>();
	const fsMock = {
		ensureDir: vi.fn(async () => {}),
		pathExists: vi.fn(async (p: string) => fsStore.has(p)),
		writeFile: vi.fn(async (p: string, content: Buffer | string) => {
			fsStore.set(p, Buffer.isBuffer(content) ? content : Buffer.from(content));
		}),
	};

	return { fsStore, fsMock };
});

vi.mock('fs-extra', () => ({
	default: fsMock,
	...fsMock,
}));

vi.mock('../src/utils/git-fetch.js', () => ({
	fetchFromGitTag: vi.fn(),
}));

import { copyCssFiles } from '../src/utils/css-inject.js';
import { fetchFromGitTag } from '../src/utils/git-fetch.js';

const mockFetchFromGitTag = vi.mocked(fetchFromGitTag);

describe('copyCssFiles', () => {
	beforeEach(() => {
		fsStore.clear();
		vi.clearAllMocks();
	});

	it('generates tokens.css without relying on packages/tokens/dist/theme.css', async () => {
		mockFetchFromGitTag.mockImplementation(async (_ref: string, filePath: string) => {
			if (filePath === 'packages/tokens/src/base.json') {
				return Buffer.from(
					JSON.stringify({
						color: {
							primary: { value: '#000000' },
						},
					})
				);
			}

			if (filePath === 'packages/tokens/src/themes.json') {
				return Buffer.from(
					JSON.stringify({
						light: { semantic: { bg: { default: { value: '{color.primary}' } } } },
						dark: { semantic: { bg: { default: { value: '{color.primary}' } } } },
						highContrast: { semantic: { bg: { default: { value: '{color.primary}' } } } },
					})
				);
			}

			if (filePath === 'packages/tokens/src/animations.css') {
				return Buffer.from('/* animations */');
			}

			if (filePath === 'packages/primitives/src/theme.css') {
				return Buffer.from('/* primitives */');
			}

			if (filePath === 'packages/faces/social/src/theme.css') {
				return Buffer.from('/* social */');
			}

			throw new Error(`Unexpected fetch: ${filePath}`);
		});

		const result = await copyCssFiles({
			ref: 'greater-v0.1.3',
			cssConfig: { tokens: true, primitives: true, face: 'social' },
			libDir: '$lib',
			localDir: 'styles/greater',
			cwd: '/project',
			overwrite: false,
			skipCache: true,
		});

		expect(result.success).toBe(true);
		expect(result.copiedFiles).toEqual(
			expect.arrayContaining(['tokens.css', 'primitives.css', 'social.css'])
		);

		const tokensPath = '/project/src/lib/styles/greater/tokens.css';
		const primitivesPath = '/project/src/lib/styles/greater/primitives.css';
		const socialPath = '/project/src/lib/styles/greater/social.css';

		expect(fsStore.get(primitivesPath)?.toString()).toBe('/* primitives */');
		expect(fsStore.get(socialPath)?.toString()).toBe('/* social */');

		const tokensCss = fsStore.get(tokensPath)?.toString() ?? '';
		expect(tokensCss).toContain('--gr-color-primary: #000000;');
		expect(tokensCss).toContain('--gr-semantic-bg-default: var(--gr-color-primary);');
		expect(tokensCss).toContain('/* animations */');

		// Ensure we do not try to fetch build-only artifacts from git refs.
		const attemptedPaths = mockFetchFromGitTag.mock.calls.map((c) => String(c[1] ?? ''));
		expect(attemptedPaths).not.toContain('packages/tokens/dist/theme.css');
	});
});

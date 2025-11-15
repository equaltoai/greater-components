import { describe, expect, it, vi } from 'vitest';

vi.mock('@tanstack/svelte-virtual', () => ({
	createVirtualizer: vi.fn(),
}));

vi.mock(
	'../dist/tokens/index.js',
	() => ({
		tokens: {},
		themes: {},
		getColor: vi.fn(),
		getSemanticColor: vi.fn(),
	}),
	{ virtual: true }
);

const sanitizeMock = vi.fn((value: unknown) =>
	typeof value === 'string' ? value.replace(/<script.*?>.*?<\/script>/g, '') : ''
);

vi.mock('isomorphic-dompurify', () => ({
	default: {
		sanitize: sanitizeMock,
		addHook: vi.fn(),
		removeHook: vi.fn(),
	},
}));

vi.mock(
	'focus-trap',
	() => ({
		createFocusTrap: vi.fn(),
	}),
	{ virtual: true }
);

vi.mock(
	'tabbable',
	() => ({
		tabbable: vi.fn(() => []),
	}),
	{ virtual: true }
);

vi.mock(
	'@playwright/test',
	() => ({
		test: vi.fn(),
		expect: vi.fn(),
	}),
	{ virtual: true }
);

vi.mock(
	'axe-playwright',
	() => ({
		checkA11y: vi.fn(),
		getViolations: vi.fn(() => []),
	}),
	{ virtual: true }
);

vi.mock(
	'@testing-library/svelte',
	() => ({
		render: vi.fn(() => ({ container: document.createElement('div') })),
	}),
	{ virtual: true }
);

vi.mock(
	'../dist/cli/index.js',
	() => ({
		initCommand: {},
		addCommand: {},
		listCommand: {},
	}),
	{ virtual: true }
);

// Provide missing browser APIs for JSdom
if (!window.matchMedia) {
	// @ts-expect-error jsdom stub
	window.matchMedia = vi.fn(() => ({
		matches: false,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
	}));
}

const importPackage = async () => {
	// Ensure a fresh evaluation so exports are recomputed when coverage runs
	vi.resetModules();
	return import('../dist/index.js');
};

describe('@equaltoai/greater-components export surface', () => {
	it('exposes the aggregate entry points from sub-packages', async () => {
		const pkg = await importPackage();
		const [adapters, fediverse, headless, icons, primitives, testing, utils] = await Promise.all([
			import('../dist/adapters/index.js'),
			import('../dist/fediverse/index.js'),
			import('../dist/headless/index.js'),
			import('../dist/icons/index.js'),
			import('../dist/primitives/index.js'),
			import('../dist/testing/index.js'),
			import('../dist/utils/index.js'),
		]);

		const { adapterCache } = await import('../dist/fediverse/adapters/cache.js');
		const { generateId } = await import('../dist/headless/utils/id.js');

		const expectedKeys = ['tokens', 'themes', 'debounce', 'KeyboardShortcutManager', 'ActivityIcon'];
		expectedKeys.forEach((key) => expect(pkg).toHaveProperty(key));

		expect(typeof pkg.debounce).toBe('function');
		expect(pkg.ActivityIcon).toBeDefined();

		// Touch additional surfaced utilities to raise entry coverage
		expect(pkg.getPlatformShortcut('ctrl+s', 'cmd+s')).toBeTruthy();
		const enterEvent = { key: 'Enter' } as unknown as KeyboardEvent;
		expect(pkg.isActivationKey(enterEvent)).toBe(true);
		expect(pkg.getNavigationDirection({ key: 'ArrowLeft' } as unknown as KeyboardEvent, 'horizontal')).toBe(
			'previous'
		);
		expect(pkg.formatShortcut('ctrl+s')).toContain('Ctrl');

			adapterCache?.set?.('smoke', 'ok');

		// Utils/performance branches
			const lru = pkg.createLRUCache(2);
			lru.set('one', 1);
			lru.set('two', 2);
			lru.get('one');
			lru.set('three', 3);
			expect(lru.size()).toBeLessThanOrEqual(2);

		const pool = pkg.createResourcePool(() => ({ id: Math.random() }), 1);
		const pooled = pool.acquire();
		expect(() => pool.acquire()).toThrowError();
		pool.release(pooled);
		expect(pool.size()).toBe(1);
		pool.drain();

			vi.useFakeTimers();
			const immediateSpy = vi.fn();
			const immediate = pkg.debounceImmediate(immediateSpy, 5);
			immediate('first');
			immediate('second');
			vi.runAllTimers();
			expect(immediateSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
			vi.useRealTimers();

		const memoized = pkg.memoize((a: number, b: number) => a + b);
		expect(memoized(1, 2)).toBe(3);
		expect(memoized.cache.size).toBe(1);

		const sanitized = pkg.sanitizeHtml('<script>bad()</script><strong>ok</strong>');
		expect(sanitized).toContain('<strong>ok</strong>');
		expect(pkg.sanitizeForPreview('Long preview content that should truncate', 5).endsWith('...')).toBe(true);

		// Adapter cache helpers
		const limitSpy = vi.fn(({ fields }) =>
			fields.timeline(
				{ edges: new Array(5).fill({ node: {} }) },
				{ readField: () => new Date().toISOString() }
			)
		);
		pkg.limitCacheSize({ modify: limitSpy } as unknown as any, 'timeline', 2);
		expect(limitSpy).toHaveBeenCalled();

		const evictSpy = vi.fn(({ fields }) =>
			fields.timeline(
				{ edges: [{ node: { createdAt: new Date().toISOString() } }] },
				{ readField: (_field: string, node: { createdAt: string }) => node.createdAt }
			)
		);
		pkg.evictStaleCache({ modify: evictSpy } as unknown as any, 'timeline', 1000);
		expect(evictSpy).toHaveBeenCalled();

		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		pkg.evictStaleCache(
			{
				modify: () => {
					throw new Error('boom');
				},
			} as unknown as any,
			'timeline',
			1000
		);
		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();

		// Adapter mappers and validators
		const batchStatuses = pkg.batchMapMastodonStatuses([{} as any]);
		expect(batchStatuses.failed.length).toBeGreaterThan(0);

		const required = pkg.MapperUtils.validateRequired({ id: '1' }, ['id', 'username']);
		expect(required.valid).toBe(false);
		expect(pkg.MapperUtils.safeExtract.string(undefined, 'fallback')).toBe('fallback');

		// Fediverse helpers
		const grouped = pkg.groupNotifications([
			{
				id: 'n1',
				type: 'favourite',
				createdAt: '2024-01-01T00:00:00Z',
				account: { id: 'a1', displayName: 'Sam' },
				status: { id: 's1' },
				read: false,
			},
			{
				id: 'n2',
				type: 'favourite',
				createdAt: '2024-01-02T00:00:00Z',
				account: { id: 'a2', displayName: 'Jo' },
				status: { id: 's1' },
				read: true,
			},
		]);
		expect(grouped[0].count).toBe(2);
		expect(pkg.getGroupTitle(grouped[0]).toLowerCase()).toContain('favorite');
		expect(pkg.getVisibility({ visibility: 'private' })).toBeTruthy();

		// Testing utilities
		const score = testing.calculateA11yScore({
			wcagPassed: 1,
			wcagTotal: 1,
			axeViolations: 0,
			axeChecks: 1,
			contrastPassed: 1,
			contrastTotal: 1,
			keyboardPassed: 1,
			keyboardTotal: 1,
			focusPassed: 1,
			focusTotal: 1,
		});

		expect(score).toBeGreaterThan(0);
		expect(testing.meetsA11yThreshold(score)).toBe(true);
		expect(testing.generateTestRecommendations([{ type: 'contrast' }, { type: 'keyboard' }]).length).toBeGreaterThan(
			0
		);
		expect(testing.createComponentTestSuite({ name: 'Widget' }).tests.axe).toContain('axe');

		expect(adapters).toBeDefined();
		expect(fediverse).toBeDefined();
		expect(headless).toBeDefined();
		expect(icons.ActivityIcon).toBeDefined();
		expect(primitives).toBeDefined();
		expect(testing.DEFAULT_TEST_CONFIG).toBeDefined();
		expect(utils.debounce).toBeInstanceOf(Function);
		if (adapterCache?.get) {
			expect(adapterCache.get('smoke')).toBe('ok');
		}
		expect(generateId().startsWith('greater-')).toBe(true);
		adapterCache?.clear?.();
	});
});

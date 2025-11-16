import { describe, expect, it, vi, beforeEach } from 'vitest';

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

beforeEach(() => {
	vi.clearAllMocks();
});

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

	it('verifies all sub-package exports are accessible', async () => {
		const pkg = await importPackage();

		// Adapters exports
		expect(pkg).toHaveProperty('LesserGraphQLAdapter');
		expect(pkg).toHaveProperty('HttpPollingClient');
		expect(pkg).toHaveProperty('WebSocketClient');
		expect(pkg).toHaveProperty('TransportManager');
		expect(pkg).toHaveProperty('batchMapMastodonStatuses');
		expect(pkg).toHaveProperty('MapperUtils');

		// Fediverse exports (components)
		expect(pkg).toHaveProperty('StatusCard');
		expect(pkg).toHaveProperty('ComposeBox');
		expect(pkg).toHaveProperty('TimelineVirtualized');
		expect(pkg).toHaveProperty('ProfileHeader');
		expect(pkg).toHaveProperty('ActionBar');
		expect(pkg).toHaveProperty('ContentRenderer');
		expect(pkg).toHaveProperty('NotificationsFeed');
		expect(pkg).toHaveProperty('groupNotifications');
		expect(pkg).toHaveProperty('getGroupTitle');

		// Headless exports
		expect(pkg).toHaveProperty('createButton');
		expect(pkg).toHaveProperty('createMenu');
		expect(pkg).toHaveProperty('createModal');
		expect(pkg).toHaveProperty('createTooltip');
		expect(pkg).toHaveProperty('createTabs');

		// Icons exports
		expect(pkg).toHaveProperty('ActivityIcon');
		expect(pkg).toHaveProperty('AlertCircleIcon');
		expect(pkg).toHaveProperty('CheckIcon');
		expect(pkg).toHaveProperty('HeartIcon');

		// Primitives exports
		expect(pkg).toHaveProperty('Button');
		expect(pkg).toHaveProperty('Avatar');
		expect(pkg).toHaveProperty('ThemeProvider');
		expect(pkg).toHaveProperty('ThemeSwitcher');

		// Tokens exports
		expect(pkg).toHaveProperty('tokens');
		expect(pkg).toHaveProperty('themes');

		// Utils exports
		expect(pkg).toHaveProperty('debounce');
		expect(pkg).toHaveProperty('throttle');
		expect(pkg).toHaveProperty('sanitizeHtml');
		expect(pkg).toHaveProperty('relativeTime');
		expect(pkg).toHaveProperty('KeyboardShortcutManager');

		// Testing exports
		expect(pkg).toHaveProperty('DEFAULT_TEST_CONFIG');
		expect(pkg).toHaveProperty('calculateA11yScore');
		expect(pkg).toHaveProperty('meetsA11yThreshold');

		// CLI exports
		expect(pkg).toHaveProperty('initCommand');
		expect(pkg).toHaveProperty('addCommand');
		expect(pkg).toHaveProperty('listCommand');
	});

	it('tests adapter utilities and error handling', async () => {
		const pkg = await importPackage();

		// Test MapperUtils validation
		const invalidData = pkg.MapperUtils.validateRequired({}, ['required_field']);
		expect(invalidData.valid).toBe(false);
		expect(invalidData.missing?.includes('required_field')).toBe(true);

		const validData = pkg.MapperUtils.validateRequired({ field: 'value' }, ['field']);
		expect(validData.valid).toBe(true);

		// Test safe extraction with defaults
		expect(pkg.MapperUtils.safeExtract.string(null, 'default')).toBe('default');
		expect(pkg.MapperUtils.safeExtract.string('actual', 'default')).toBe('actual');
		expect(pkg.MapperUtils.safeExtract.number(null, 42)).toBe(42);
		expect(pkg.MapperUtils.safeExtract.number(100, 42)).toBe(100);
		expect(pkg.MapperUtils.safeExtract.boolean(null, true)).toBe(true);
		expect(pkg.MapperUtils.safeExtract.boolean(false, true)).toBe(false);

		// Test batch mapping with errors
		const invalidStatuses = [{ invalid: 'data' }];
		const batchResult = pkg.batchMapMastodonStatuses(invalidStatuses);
		expect(batchResult.failed.length).toBeGreaterThan(0);
		expect(batchResult.successful.length).toBe(0);
	});

	it('tests utils performance utilities edge cases', async () => {
		const pkg = await importPackage();

		vi.useFakeTimers();

		// Test throttle with leading/trailing options
		const leadingSpy = vi.fn();
		const leadingThrottle = pkg.throttle(leadingSpy, 100, { leading: true, trailing: false });
		leadingThrottle();
		leadingThrottle();
		expect(leadingSpy).toHaveBeenCalledTimes(1);
		vi.advanceTimersByTime(100);
		expect(leadingSpy).toHaveBeenCalledTimes(1);

		const trailingSpy = vi.fn();
		const trailingThrottle = pkg.throttle(trailingSpy, 100, { leading: false, trailing: true });
		trailingThrottle();
		expect(trailingSpy).toHaveBeenCalledTimes(0);
		vi.advanceTimersByTime(100);
		expect(trailingSpy).toHaveBeenCalledTimes(1);

		// Test debounce cancel
		const debounceSpy = vi.fn();
		const debouncedFn = pkg.debounce(debounceSpy, 50);
		debouncedFn();
		debouncedFn();
		debouncedFn();
		vi.advanceTimersByTime(50);
		expect(debounceSpy).toHaveBeenCalledTimes(1);

		// Test LRU cache eviction
		const cache = pkg.createLRUCache(2);
		cache.set('a', 1);
		cache.set('b', 2);
		cache.set('c', 3); // Should evict 'a'
		expect(cache.has('a')).toBe(false);
		expect(cache.has('b')).toBe(true);
		expect(cache.has('c')).toBe(true);

		// Test resource pool exhaustion
		const pool = pkg.createResourcePool(() => ({ value: Math.random() }), 1);
		const resource1 = pool.acquire();
		expect(() => pool.acquire()).toThrow();
		pool.release(resource1);
		const resource2 = pool.acquire();
		expect(resource2).toBeDefined();
		pool.drain();
		expect(pool.size()).toBe(0);

		vi.useRealTimers();
	});

	it('tests keyboard shortcut manager registration and lifecycle', async () => {
		const pkg = await importPackage();

		const manager = new pkg.KeyboardShortcutManager();
		const handler1 = vi.fn();
		const handler2 = vi.fn();

		// Register shortcuts - verify they can be registered without errors
		expect(() => manager.register('ctrl+s', handler1)).not.toThrow();
		expect(() => manager.register('cmd+k', handler2)).not.toThrow();

		// Unregister - verify cleanup works
		expect(() => manager.unregister('ctrl+s')).not.toThrow();

		// Destroy - verify full cleanup
		expect(() => manager.destroy()).not.toThrow();

		// Verify manager can be instantiated and destroyed multiple times
		const manager2 = new pkg.KeyboardShortcutManager();
		expect(manager2).toBeDefined();
		manager2.destroy();
	});

	it('tests sanitization with custom configurations', async () => {
		const pkg = await importPackage();

		// Test with dangerous content
		const dangerous = '<script>alert("xss")</script><p>Safe content</p>';
		const sanitized = pkg.sanitizeHtml(dangerous);
		expect(sanitized).toContain('Safe content');
		expect(sanitized).not.toContain('<script>');

		// Test preview sanitization with truncation
		const longContent = 'A'.repeat(500);
		const preview = pkg.sanitizeForPreview(longContent, 100);
		expect(preview.length).toBeLessThanOrEqual(103); // 100 + '...'
		expect(preview.endsWith('...')).toBe(true);

		// Test with empty content
		expect(pkg.sanitizeHtml('')).toBe('');
		expect(pkg.sanitizeForPreview('', 10)).toBe('');
	});

	it('tests relative time formatting edge cases', async () => {
		const pkg = await importPackage();

		const now = new Date();
		const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
		const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
		const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

		// Test various time differences
		expect(pkg.relativeTime(oneMinuteAgo)).toContain('minute');
		expect(pkg.relativeTime(oneHourAgo)).toContain('hour');
		expect(pkg.relativeTime(oneDayAgo)).toContain('day');

		// Test with string input
		expect(pkg.relativeTime(oneMinuteAgo.toISOString())).toBeTruthy();

		// Test with numeric timestamp
		expect(pkg.relativeTime(oneMinuteAgo.getTime())).toBeTruthy();
	});

	it('tests linkify mentions and hashtags', async () => {
		const pkg = await importPackage();

		const text = 'Hello @user check #topic and visit https://example.com';
		const linked = pkg.linkifyMentions(text);

		expect(linked).toContain('href');
		expect(linked).toContain('@user');
		expect(linked).toContain('#topic');

		// Test with no mentions
		const plain = 'Just plain text';
		const plainLinked = pkg.linkifyMentions(plain);
		expect(plainLinked).toBe(plain);
	});

	it('tests keyboard utilities for navigation', async () => {
		const pkg = await importPackage();

		// Test activation keys
		expect(pkg.isActivationKey({ key: 'Enter' } as KeyboardEvent)).toBe(true);
		expect(pkg.isActivationKey({ key: ' ' } as KeyboardEvent)).toBe(true);
		expect(pkg.isActivationKey({ key: 'a' } as KeyboardEvent)).toBe(false);

		// Test navigation direction
		expect(pkg.getNavigationDirection({ key: 'ArrowUp' } as KeyboardEvent, 'vertical')).toBe(
			'previous'
		);
		expect(pkg.getNavigationDirection({ key: 'ArrowDown' } as KeyboardEvent, 'vertical')).toBe(
			'next'
		);
		expect(pkg.getNavigationDirection({ key: 'ArrowLeft' } as KeyboardEvent, 'horizontal')).toBe(
			'previous'
		);
		expect(pkg.getNavigationDirection({ key: 'ArrowRight' } as KeyboardEvent, 'horizontal')).toBe(
			'next'
		);
		expect(pkg.getNavigationDirection({ key: 'Home' } as KeyboardEvent, 'vertical')).toBe('first');
		expect(pkg.getNavigationDirection({ key: 'End' } as KeyboardEvent, 'vertical')).toBe('last');

		// Test platform shortcuts
		const ctrlShortcut = pkg.getPlatformShortcut('ctrl+s', 'cmd+s');
		expect(ctrlShortcut).toBeTruthy();

		// Test shortcut formatting
		const formatted = pkg.formatShortcut('ctrl+shift+k');
		expect(formatted).toContain('Ctrl');
		expect(formatted).toContain('Shift');
		expect(formatted).toContain('K');
	});

	it('tests fediverse notification grouping and visibility', async () => {
		const pkg = await importPackage();

		// Test notification grouping
		const notifications = [
			{
				id: 'n1',
				type: 'favourite',
				createdAt: '2024-01-01T00:00:00Z',
				account: { id: 'a1', displayName: 'User1' },
				status: { id: 's1' },
				read: false,
			},
			{
				id: 'n2',
				type: 'favourite',
				createdAt: '2024-01-01T01:00:00Z',
				account: { id: 'a2', displayName: 'User2' },
				status: { id: 's1' },
				read: false,
			},
		];

		const grouped = pkg.groupNotifications(notifications);
		expect(grouped.length).toBeGreaterThan(0);
		expect(grouped[0].count).toBe(2);

		const title = pkg.getGroupTitle(grouped[0]);
		expect(title.toLowerCase()).toContain('favorite');

		// Test visibility helpers
		expect(pkg.getVisibility({ visibility: 'public' })).toBeTruthy();
		expect(pkg.getVisibility({ visibility: 'private' })).toBeTruthy();
		expect(pkg.getVisibility({ visibility: 'unlisted' })).toBeTruthy();
		expect(pkg.getVisibility({ visibility: 'direct' })).toBeTruthy();
	});

	it('tests testing utilities for a11y scoring', async () => {
		const pkg = await importPackage();

		// Test perfect score
		const perfectScore = pkg.calculateA11yScore({
			wcagPassed: 10,
			wcagTotal: 10,
			axeViolations: 0,
			axeChecks: 10,
			contrastPassed: 5,
			contrastTotal: 5,
			keyboardPassed: 5,
			keyboardTotal: 5,
			focusPassed: 5,
			focusTotal: 5,
		});
		expect(perfectScore).toBeGreaterThanOrEqual(90);
		expect(pkg.meetsA11yThreshold(perfectScore)).toBe(true);

		// Test poor score
		const poorScore = pkg.calculateA11yScore({
			wcagPassed: 1,
			wcagTotal: 10,
			axeViolations: 5,
			axeChecks: 10,
			contrastPassed: 0,
			contrastTotal: 5,
			keyboardPassed: 0,
			keyboardTotal: 5,
			focusPassed: 0,
			focusTotal: 5,
		});
		expect(poorScore).toBeLessThan(90);
		expect(pkg.meetsA11yThreshold(poorScore)).toBe(false);

		// Test recommendations
		const issues = [
			{ type: 'contrast' },
			{ type: 'keyboard' },
			{ type: 'aria' },
			{ type: 'focus' },
		];
		const recommendations = pkg.generateTestRecommendations(issues);
		expect(recommendations.length).toBeGreaterThan(0);

		// Test component test suite generation
		const suite = pkg.createComponentTestSuite({ name: 'TestComponent' });
		expect(suite.tests.axe).toBeTruthy();
		expect(suite.tests.keyboard).toBeTruthy();
		expect(suite.tests.contrast).toBeTruthy();
	});

	it('tests adapter cache helpers with edge cases', async () => {
		const pkg = await importPackage();

		// Test limitCacheSize
		const modifySpy = vi.fn(({ fields }) =>
			fields.timeline(
				{
					edges: [
						{ node: { createdAt: '2024-01-01T00:00:00Z' } },
						{ node: { createdAt: '2024-01-02T00:00:00Z' } },
						{ node: { createdAt: '2024-01-03T00:00:00Z' } },
					],
				},
				{ readField: (_field: string, node: { createdAt: string }) => node.createdAt }
			)
		);

		pkg.limitCacheSize({ modify: modifySpy } as any, 'timeline', 2);
		expect(modifySpy).toHaveBeenCalled();

		// Test evictStaleCache with recent data
		const evictSpy = vi.fn(({ fields }) =>
			fields.timeline(
				{ edges: [{ node: { createdAt: new Date().toISOString() } }] },
				{ readField: (_field: string, node: { createdAt: string }) => node.createdAt }
			)
		);

		pkg.evictStaleCache({ modify: evictSpy } as any, 'timeline', 1000 * 60 * 60);
		expect(evictSpy).toHaveBeenCalled();

		// Test error handling in cache helpers
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		pkg.limitCacheSize(
			{
				modify: () => {
					throw new Error('Cache error');
				},
			} as any,
			'timeline',
			10
		);
		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});

	it('tests memoization with cache management', async () => {
		const pkg = await importPackage();

		const expensiveOperation = vi.fn((a: number, b: number) => a + b);
		const memoized = pkg.memoize(expensiveOperation);

		// First call
		const result1 = memoized(5, 10);
		expect(result1).toBe(15);
		expect(expensiveOperation).toHaveBeenCalledTimes(1);

		// Second call with same args (should use cache)
		const result2 = memoized(5, 10);
		expect(result2).toBe(15);
		expect(expensiveOperation).toHaveBeenCalledTimes(1);

		// Call with different args
		const result3 = memoized(3, 7);
		expect(result3).toBe(10);
		expect(expensiveOperation).toHaveBeenCalledTimes(2);

		// Check cache size
		expect(memoized.cache.size).toBe(2);

		// Clear cache
		memoized.cache.clear();
		expect(memoized.cache.size).toBe(0);
	});

	it('tests headless ID generation with custom prefixes', async () => {
		const { generateId } = await import('../dist/headless/utils/id.js');

		const id1 = generateId();
		const id2 = generateId();
		expect(id1).not.toBe(id2);
		expect(id1.startsWith('greater-')).toBe(true);

		const customId = generateId('custom');
		expect(customId.startsWith('custom-')).toBe(true);
	});

	it('ensures all icon exports are valid components', async () => {
		const icons = await import('../dist/icons/index.js');

		// Verify key icons are exported
		expect(icons.ActivityIcon).toBeDefined();
		expect(icons.AlertCircleIcon).toBeDefined();
		expect(icons.CheckIcon).toBeDefined();
		expect(icons.HeartIcon).toBeDefined();
		expect(icons.HomeIcon).toBeDefined();
		expect(icons.SearchIcon).toBeDefined();
		expect(icons.SettingsIcon).toBeDefined();
		expect(icons.UserIcon).toBeDefined();
	});

	it('verifies headless primitives are functional', async () => {
		const headless = await import('../dist/headless/index.js');

		// Verify all headless exports
		expect(headless.createButton).toBeInstanceOf(Function);
		expect(headless.createMenu).toBeInstanceOf(Function);
		expect(headless.createModal).toBeInstanceOf(Function);
		expect(headless.createTooltip).toBeInstanceOf(Function);
		expect(headless.createTabs).toBeInstanceOf(Function);
		expect(headless.createAvatar).toBeInstanceOf(Function);
		expect(headless.createSkeleton).toBeInstanceOf(Function);

		// Test button creation returns an object
		const button = headless.createButton();
		expect(button).toBeDefined();
		expect(typeof button).toBe('object');

		// Test other creators return values
		expect(headless.createMenu()).toBeDefined();
		expect(headless.createModal()).toBeDefined();
		expect(headless.createTooltip()).toBeDefined();
	});

	it('tests error paths and null safety across utilities', async () => {
		const pkg = await importPackage();

		// Test with null/undefined inputs
		expect(pkg.sanitizeHtml(null as any)).toBe('');
		expect(pkg.sanitizeHtml(undefined as any)).toBe('');

		// Test MapperUtils with empty objects
		expect(pkg.MapperUtils.safeExtract.string(undefined, '')).toBe('');
		expect(pkg.MapperUtils.safeExtract.number(undefined, 0)).toBe(0);
		expect(pkg.MapperUtils.safeExtract.boolean(undefined, false)).toBe(false);

		// Test empty notifications grouping
		const emptyGroups = pkg.groupNotifications([]);
		expect(Array.isArray(emptyGroups)).toBe(true);

		// Test LRU cache with size 0
		const zeroCache = pkg.createLRUCache(0);
		zeroCache.set('key', 'value');
		expect(zeroCache.size()).toBe(0);
	});
});

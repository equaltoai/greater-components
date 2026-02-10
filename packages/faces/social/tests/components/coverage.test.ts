import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render } from '@testing-library/svelte';
import { componentsToCover } from './coverage-harness';
// const componentsToCover = {}; // Temporary override
import Wrapper from './Wrapper.svelte';

// Mock virtualizer for jsdom
vi.mock('@tanstack/svelte-virtual', () => {
	return {
		createVirtualizer: ({ count }: { count: number }) => {
			const virtualItems = Array.from({ length: count }, (_, i) => ({
				index: i,
				start: i * 100,
				size: 100,
				end: (i + 1) * 100,
				key: i,
			}));

			return {
				subscribe: (run: (val: any) => void) => {
					run({
						getVirtualItems: () => virtualItems,
						getTotalSize: () => count * 100,
					});
					return () => {};
				},
			};
		},
	};
});

describe('Component Coverage Harness', () => {
	beforeAll(() => {
		const makeAccount = (id: string) => ({
			id,
			username: id,
			acct: id,
			displayName: `User ${id}`,
			avatar: '',
			header: '',
			url: `https://example.com/@${id}`,
			statusesCount: 0,
			followersCount: 0,
			followingCount: 0,
			createdAt: new Date().toISOString(),
		});

		const makeStatus = (id: string) => ({
			id,
			uri: `https://example.com/status/${id}`,
			url: `https://example.com/status/${id}`,
			account: makeAccount('author'),
			content: 'Test status content',
			createdAt: new Date().toISOString(),
			visibility: 'public' as const,
			repliesCount: 0,
			reblogsCount: 0,
			favouritesCount: 0,
			mediaAttachments: [],
			mentions: [],
			tags: [],
		});

		const makeNotification = (id: string) => ({
			id,
			type: 'mention' as const,
			createdAt: new Date().toISOString(),
			account: makeAccount('notifier'),
			read: false,
			status: makeStatus('status-1'),
		});

		global.fetch = vi.fn().mockImplementation((url) => {
			const href = typeof url === 'string' ? url : (url?.toString?.() ?? '');

			if (href.includes('success')) {
				if (href.includes('/api/v1/notifications')) {
					return Promise.resolve({
						ok: true,
						json: () => Promise.resolve([makeNotification('notif-1')]),
					});
				}

				if (href.includes('/api/v1/timelines/')) {
					return Promise.resolve({
						ok: true,
						json: () => Promise.resolve([makeStatus('status-1')]),
					});
				}

				return Promise.resolve({
					ok: true,
					json: () => Promise.resolve({}),
				});
			}

			return Promise.resolve({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error',
			});
		});
	});

	afterAll(() => {
		vi.restoreAllMocks();
	});

	Object.entries(componentsToCover).forEach(([name, { component, scenarios }]) => {
		describe(name, () => {
			scenarios.forEach((scenario) => {
				it(`renders scenario: ${scenario.name}`, async () => {
					try {
						const { container } = render(Wrapper, {
							props: {
								Component: component,
								props: scenario.props,
								Wrapper: scenario.Wrapper,
								wrapperProps: scenario.wrapperProps,
							},
						});

						expect(container).toBeTruthy();

						if (scenario.action) {
							await scenario.action();
						}
					} catch (e) {
						console.error(`Failed to render ${name} scenario ${scenario.name}:`, e);
						throw e;
					}
				});
			});
		});
	});
});

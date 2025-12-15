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
		global.fetch = vi.fn().mockImplementation((url) => {
			if (url.toString().includes('success')) {
				return Promise.resolve({
					ok: true,
					json: () => Promise.resolve([{ id: '1', content: 'test' }]),
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

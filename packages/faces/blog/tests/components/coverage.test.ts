import { render, cleanup } from '@testing-library/svelte';
import { describe, it, afterEach, vi } from 'vitest';
import { componentsToCover } from './coverage-harness';

describe('Component Coverage', () => {
	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
	});

	Object.entries(componentsToCover).forEach(([componentName, definition]) => {
		describe(componentName, () => {
			definition.scenarios.forEach((scenario) => {
				it(`renders scenario: ${scenario.name}`, async () => {
					const { component: Component } = definition;
					const { props, Wrapper, wrapperProps, action } = scenario;

					if (Wrapper) {
						render(Wrapper, {
							props: {
								...wrapperProps,
								component: Component,
								componentProps: props,
							},
						});
					} else {
						render(Component, { props });
					}

					if (action) {
						await action();
					}
				});
			});
		});
	});
});

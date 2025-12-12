import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { componentsToCover } from './coverage-harness';
import Wrapper from './Wrapper.svelte';

describe('Component Coverage Harness', () => {
    Object.entries(componentsToCover).forEach(([name, { component, scenarios }]) => {
        describe(name, () => {
            scenarios.forEach((scenario) => {
                it(`renders scenario: ${scenario.name}`, () => {
                    try {
                        const { container } = render(Wrapper, {
                            props: {
                                Component: component,
                                props: scenario.props,
                                Wrapper: scenario.Wrapper,
                                wrapperProps: scenario.wrapperProps
                            }
                        });
                        
                        expect(container).toBeTruthy();
                    } catch (e) {
                        console.error(`Failed to render ${name} scenario ${scenario.name}:`, e);
                        throw e;
                    }
                });
            });
        });
    });
});

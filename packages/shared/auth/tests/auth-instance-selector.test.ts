import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import InstanceSelectorHarness from './fixtures/InstanceSelectorHarness.svelte';

describe('Auth.InstanceSelector', () => {
	it('renders an instance input and button', () => {
		const { getByLabelText, getByText } = render(InstanceSelectorHarness);

		expect(getByLabelText(/instance/i)).toBeTruthy();
		expect(getByText(/continue/i)).toBeTruthy();
	});
});




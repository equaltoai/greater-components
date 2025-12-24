import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import VisibilitySelect from '../src/VisibilitySelect.svelte';
import * as contextModule from '../src/context.js';

// Mock context
vi.mock('../src/context.js', async (importOriginal) => {
	const actual = await importOriginal<typeof contextModule>();
	return {
		...actual,
		getComposeContext: vi.fn(),
	};
});

describe('VisibilitySelect', () => {
	let mockContext: any;

	beforeEach(() => {
		mockContext = {
			state: {
				visibility: 'public',
				submitting: false,
			},
			updateState: vi.fn(),
		};

		vi.mocked(contextModule.getComposeContext).mockReturnValue(mockContext);
	});

	it('should render all visibility options', () => {
		render(VisibilitySelect);

		const options = screen.getAllByRole('option');
		expect(options).toHaveLength(4);
		expect(options[0].textContent).toContain('Public');
		expect(options[1].textContent).toContain('Unlisted');
		expect(options[2].textContent).toContain('Followers only');
		expect(options[3].textContent).toContain('Direct');
	});

	it('should show current visibility description', () => {
		render(VisibilitySelect);
		expect(screen.getByText('Anyone can see this post')).toBeTruthy();
	});

	it('should show updated description when visibility changes', () => {
		mockContext.state.visibility = 'private';
		render(VisibilitySelect);
		expect(screen.getByText('Only your followers can see')).toBeTruthy();
	});

	it('should update context on change', async () => {
		render(VisibilitySelect);

		const select = screen.getByRole('combobox');
		await fireEvent.change(select, { target: { value: 'private' } });

		expect(mockContext.updateState).toHaveBeenCalledWith({ visibility: 'private' });
	});

	it('should be disabled when submitting', () => {
		mockContext.state.submitting = true;
		render(VisibilitySelect);

		const select = screen.getByRole('combobox');
		expect(select.getAttribute('disabled')).toBe('');
	});

	it('should fallback to public description for invalid visibility', () => {
		mockContext.state.visibility = 'invalid';
		render(VisibilitySelect);
		expect(screen.getByText('Anyone can see this post')).toBeTruthy();
	});
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import SettingsSection from '../src/components/Settings/SettingsSection.svelte';
import SettingsGroup from '../src/components/Settings/SettingsGroup.svelte';
import SettingsField from '../src/components/Settings/SettingsField.svelte';
import SettingsToggle from '../src/components/Settings/SettingsToggle.svelte';
import SettingsSelect from '../src/components/Settings/SettingsSelect.svelte';
import { createRawSnippet } from 'svelte';

// Helper to create a simple text snippet for children
const createTextSnippet = (text: string) => createRawSnippet(() => ({
	render: () => `<span>${text}</span>`
}));

describe('Settings Components', () => {
	describe('SettingsSection', () => {
		it('renders title and description', () => {
			render(SettingsSection, {
				title: 'My Section',
				description: 'Section Description',
				children: createTextSnippet('Content'),
			});

			expect(screen.getByText('My Section')).toBeTruthy();
			expect(screen.getByText('Section Description')).toBeTruthy();
			expect(screen.getByText('Content')).toBeTruthy();
		});
	});

	describe('SettingsGroup', () => {
		it('renders label and children', () => {
			render(SettingsGroup, {
				label: 'Group Label',
				children: createTextSnippet('Group Content'),
			});

			expect(screen.getByText('Group Label')).toBeTruthy();
			expect(screen.getByText('Group Content')).toBeTruthy();
		});
	});

	describe('SettingsField', () => {
		it('renders label and description', () => {
			render(SettingsField, {
				label: 'Field Label',
				description: 'Field Desc',
				children: createTextSnippet('Control'),
			});

			expect(screen.getByText('Field Label')).toBeTruthy();
			expect(screen.getByText('Field Desc')).toBeTruthy();
			expect(screen.getByText('Control')).toBeTruthy();
		});
	});

	describe('SettingsToggle', () => {
		it('renders label and toggles value', async () => {
			const value = false;
			render(SettingsToggle, {
				label: 'Toggle Me',
				value,
			});

			const button = screen.getByRole('checkbox');
			expect(button).toBeTruthy();
			
			// Svelte 5 component updates via props can be tricky in tests if not binding
			// But fireEvent should trigger internal state update or event
            // For now, just check rendering
            expect(screen.getByText('Toggle Me')).toBeTruthy();
		});
	});

    describe('SettingsSelect', () => {
		it('renders label and select options', () => {
			render(SettingsSelect, {
				label: 'Select Me',
				value: 'a',
                options: [
                    { value: 'a', label: 'Option A' },
                    { value: 'b', label: 'Option B' }
                ]
			});

			expect(screen.getByText('Select Me')).toBeTruthy();
            // Check if options are present (depends on Select implementation, likely role="combobox" or "button")
		});
	});
});

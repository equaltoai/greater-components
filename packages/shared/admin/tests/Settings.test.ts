import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import SettingsHarness from './SettingsHarness.svelte';
import type { InstanceSettings, AdminHandlers } from '../src/context.svelte.js';

describe('Admin.Settings Component', () => {
	const mockSettings: InstanceSettings = {
		name: 'Test Instance',
		description: 'A test instance',
		registrationOpen: true,
		approvalRequired: false,
		inviteOnly: false,
		maxPostLength: 500,
		maxMediaAttachments: 4,
	};

	let handlers: AdminHandlers;

	beforeEach(() => {
		handlers = {
			onFetchSettings: vi.fn().mockResolvedValue(mockSettings),
			onUpdateSettings: vi.fn().mockResolvedValue(undefined),
		};
	});

	it('renders settings with data', async () => {
		render(SettingsHarness, { handlers });

		await waitFor(() => {
			expect(screen.getByDisplayValue('Test Instance')).toBeTruthy();
		});

		expect(screen.getByDisplayValue('A test instance')).toBeTruthy();
		expect(screen.getByText('Open Registration')).toBeTruthy(); // Checkbox label text
		
		// For checkbox state check
		const checkboxes = screen.getAllByRole('checkbox');
		// Assuming Open Registration is the first checkbox based on the source
		expect((checkboxes[0] as HTMLInputElement).checked).toBe(true);
		
		expect(screen.getByDisplayValue('500')).toBeTruthy();
	});
    // ... (rest of tests)

	it('toggles checkboxes', async () => {
		render(SettingsHarness, { handlers });

		await waitFor(() => {
			expect(screen.getByText('Open Registration')).toBeTruthy();
		});

		const checkboxes = screen.getAllByRole('checkbox');
		const checkbox = checkboxes[0] as HTMLInputElement; // Open Registration
		
		await fireEvent.click(checkbox);
		expect(checkbox.checked).toBe(false);

				await waitFor(() => {

					expect(screen.getByText('Unsaved changes')).toBeTruthy();

				});

		

				const resetButton = screen.getByText('Reset');

				await fireEvent.click(resetButton);

		

				expect(checkbox.checked).toBe(true);

				expect(screen.queryByText('Unsaved changes')).toBeNull();

			});

		

			it('saves changes', async () => {

				render(SettingsHarness, { handlers });

		

				await waitFor(() => {

					expect(screen.getByText('Open Registration')).toBeTruthy();

				});

		

				const checkboxes = screen.getAllByRole('checkbox');

				const checkbox = checkboxes[0] as HTMLInputElement;

		

				await fireEvent.click(checkbox);

		

				await waitFor(() => {

					expect(screen.getByText('Unsaved changes')).toBeTruthy();

				});

		

				const saveButton = screen.getByText('Save Changes');

				await fireEvent.click(saveButton);

		

				expect(handlers.onUpdateSettings).toHaveBeenCalledWith(

					expect.objectContaining({

						registrationOpen: false,

					})

				);

				

				await waitFor(() => {

					expect(handlers.onFetchSettings).toHaveBeenCalledTimes(2); // Initial + after save

					expect(screen.queryByText('Unsaved changes')).toBeNull();

				});

			});

		});

		
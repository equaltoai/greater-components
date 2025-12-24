import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { Monetization } from '../../../src/components/Monetization/index.ts';
import { createMockArtist } from '../../mocks/mockArtist.ts';
import { createMockInstitutionalAccount } from '../../mocks/mockMonetization.ts';

describe('Monetization Behavior', () => {
	const mockArtist = createMockArtist('m1');
	const mockInstitution = createMockInstitutionalAccount('mi1');

	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('TipJar', () => {
		it('selects preset amount', async () => {
			render(Monetization.TipJar, {
				props: {
					artist: mockArtist as any,
					config: {
						presets: [{ id: '1', amount: 10, currency: 'USD', label: 'Lunch' }],
					},
				},
			});

			const button = screen.getByText('$10.00');
			await fireEvent.click(button);

			// Check if button is pressed
			expect(button.closest('button')).toHaveAttribute('aria-pressed', 'true');

			// Submit button should text "Send $10.00"
			expect(screen.getByText('Send $10.00')).toBeInTheDocument();
		});

		it('enables submit only when valid amount selected', async () => {
			render(Monetization.TipJar, {
				props: {
					artist: mockArtist as any,
				},
			});

			const submitBtn = screen.getByRole('button', { name: /Select an amount/i });
			expect(submitBtn).toBeDisabled();

			// Select preset
			const preset = screen.getByText('$5.00');
			await fireEvent.click(preset);

			expect(submitBtn).not.toBeDisabled();
			expect(submitBtn).toHaveTextContent('Send $5.00');
		});

		it('calls onTip handler', async () => {
			const onTip = vi.fn().mockResolvedValue(undefined);
			render(Monetization.TipJar, {
				props: {
					artist: mockArtist as any,
					handlers: { onTip },
				},
			});

			await fireEvent.click(screen.getByText('$5.00'));
			await fireEvent.click(screen.getByText('Send $5.00'));

			expect(onTip).toHaveBeenCalledWith(5, 'USD', undefined, false);
		});
	});

	describe('InstitutionalTools', () => {
		it('updates account details', async () => {
			const onUpdateAccount = vi.fn().mockResolvedValue(undefined);
			render(Monetization.InstitutionalTools, {
				props: {
					account: mockInstitution,
					handlers: { onUpdateAccount },
				},
			});

			// Find inputs
			const nameInput = screen.getByLabelText(/Name/i);
			const websiteInput = screen.getByLabelText(/Website/i);
			const descInput = screen.getByLabelText(/Description/i);

			// Update values
			await fireEvent.input(nameInput, { target: { value: 'New Name' } });
			await fireEvent.input(websiteInput, { target: { value: 'https://new.example.com' } });
			await fireEvent.input(descInput, { target: { value: 'New Description' } });

			// Submit
			await fireEvent.click(screen.getByText('Update account'));

			expect(onUpdateAccount).toHaveBeenCalledWith({
				name: 'New Name',
				website: 'https://new.example.com',
				description: 'New Description',
			});
		});

		it('adds artist', async () => {
			const onAddArtist = vi.fn().mockResolvedValue(undefined);
			render(Monetization.InstitutionalTools, {
				props: {
					account: mockInstitution,
					handlers: { onAddArtist },
					config: { enableArtistManagement: true },
				},
			});

			const idInput = screen.getByLabelText('Artist ID');
			const roleSelect = screen.getByLabelText('Role');

			await fireEvent.input(idInput, { target: { value: 'artist-123' } });
			await fireEvent.change(roleSelect, { target: { value: 'represented' } });

			await fireEvent.click(screen.getByText('Add artist'));

			expect(onAddArtist).toHaveBeenCalledWith('artist-123', 'represented');
		});

		it('creates exhibition', async () => {
			const onCreateExhibition = vi.fn().mockResolvedValue(undefined);
			render(Monetization.InstitutionalTools, {
				props: {
					account: mockInstitution,
					handlers: { onCreateExhibition },
					config: { enableExhibitionManagement: true },
				},
			});

			await fireEvent.click(screen.getByText('Create exhibition'));

			expect(onCreateExhibition).toHaveBeenCalledWith({ title: 'New Exhibition' });
		});

		it('views analytics', async () => {
			const onViewAnalytics = vi.fn();
			render(Monetization.InstitutionalTools, {
				props: {
					account: mockInstitution,
					handlers: { onViewAnalytics },
					config: { enableAnalytics: true },
				},
			});

			await fireEvent.click(screen.getByText('View analytics'));

			expect(onViewAnalytics).toHaveBeenCalled();
		});

		it('does not render analytics button if disabled', () => {
			render(Monetization.InstitutionalTools, {
				props: {
					account: mockInstitution,
					config: { enableAnalytics: false },
				},
			});

			expect(screen.queryByText('View analytics')).not.toBeInTheDocument();
		});

		it('does not render artist management if disabled', () => {
			render(Monetization.InstitutionalTools, {
				props: {
					account: mockInstitution,
					config: { enableArtistManagement: false },
				},
			});

			expect(screen.queryByLabelText('Artist management')).not.toBeInTheDocument();
		});

		it('does not render exhibition management if disabled', () => {
			render(Monetization.InstitutionalTools, {
				props: {
					account: mockInstitution,
					config: { enableExhibitionManagement: false },
				},
			});

			expect(screen.queryByLabelText('Exhibition management')).not.toBeInTheDocument();
		});

		it('handles missing handlers gracefully', async () => {
			render(Monetization.InstitutionalTools, {
				props: {
					account: mockInstitution,
					// No handlers
				},
			});

			// Should render but actions shouldn't crash or should be hidden
			// In the component, actions are hidden if handlers are missing
			expect(screen.queryByText('Update account')).not.toBeInTheDocument();
			expect(screen.queryByText('Add artist')).not.toBeInTheDocument();
			expect(screen.queryByText('Create exhibition')).not.toBeInTheDocument();
			expect(screen.queryByText('View analytics')).not.toBeInTheDocument();
		});
	});
});

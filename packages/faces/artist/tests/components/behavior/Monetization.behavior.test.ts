import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { Monetization } from '../../../src/components/Monetization/index.ts';
import { createMockArtist } from '../../mocks/mockArtist.ts';

describe('Monetization Behavior', () => {
	const mockArtist = createMockArtist('m1');

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
});

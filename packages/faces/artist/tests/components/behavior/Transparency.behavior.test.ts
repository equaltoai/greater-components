import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import TransparencyTest from './TransparencyTest.svelte';

describe('Transparency Behavior', () => {
	describe('AIOptOutControls', () => {
		it('toggles setting with confirmation', async () => {
			const onUpdate = vi.fn();
			const status = { discoveryAI: true, generativeAI: false, allAI: false };

			render(TransparencyTest, {
				props: {
					component: 'AIOptOutControls',
					props: { currentStatus: status },
					handlers: { onUpdate },
				}
			});

			// Toggle Generative AI
			const toggles = screen.getAllByRole('switch');
			await fireEvent.click(toggles[1]); // Generative AI

			// Confirm dialog should appear
			const confirmBtn = screen.getByText('Confirm');
			await fireEvent.click(confirmBtn);

			expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({
				generativeAI: true
			}));
		});
	});

	describe('AIDisclosure', () => {
		it('expands details on click', async () => {
			const usage = {
				hasAI: true,
				tools: [],
				humanContribution: 50,
				aiContribution: 50,
				disclosureLevel: 'detailed',
			};

			render(TransparencyTest, {
				props: {
					component: 'AIDisclosure',
					props: { usage, variant: 'badge' },
				}
			});

			const badge = screen.getByLabelText(/AI-assisted artwork/);
			await fireEvent.click(badge);

			expect(screen.getByText('Contribution Breakdown')).toBeInTheDocument();
		});
	});
});

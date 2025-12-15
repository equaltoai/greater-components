import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	createCommissionPattern,
	getStepDisplayName,
	getStepDescription,
} from '../../src/patterns/commission.js';

describe('Commission Pattern', () => {
	describe('Factory & State', () => {
		it('initializes for client role', () => {
			const pattern = createCommissionPattern({
				role: 'client',
				onStepComplete: vi.fn(),
				onCancel: vi.fn(),
			});

			expect(pattern.state.currentStep).toBe('inquiry');
			expect(pattern.state.completedSteps).toEqual([]);
			expect(pattern.config.role).toBe('client');
		});

		it('initializes from existing commission', () => {
			const existingCommission = {
				id: 'c1',
				status: 'quoted', // should map to 'quote'
				// ... other fields
			} as any;

			const pattern = createCommissionPattern({
				role: 'artist',
				commission: existingCommission,
				onStepComplete: vi.fn(),
				onCancel: vi.fn(),
			});

			expect(pattern.state.currentStep).toBe('quote');
			// Should have 'inquiry' as completed
			expect(pattern.state.completedSteps).toContain('inquiry');
		});
	});

	describe('Step Management', () => {
		it('validates inquiry step', () => {
			const pattern = createCommissionPattern({
				role: 'client',
				onStepComplete: vi.fn(),
				onCancel: vi.fn(),
			});

			// Initially invalid (empty description/budget)
			expect(pattern.state.validateStep('inquiry')).toBe(false);
			expect(pattern.state.validationErrors.inquiry).toBeTruthy();

			// Add valid data
			pattern.state.updateStepData('inquiry', { description: 'Art', budget: '100' });
			expect(pattern.state.validateStep('inquiry')).toBe(true);
			expect(pattern.state.validationErrors.inquiry).toBeUndefined();
		});

		it('completes step and advances', async () => {
			const onStepComplete = vi.fn();
			const pattern = createCommissionPattern({
				role: 'client',
				onStepComplete,
				onCancel: vi.fn(),
			});

			// Prepare data
			pattern.state.updateStepData('inquiry', { description: 'Art', budget: '100' });

			await pattern.state.completeStep();

			expect(onStepComplete).toHaveBeenCalledWith('inquiry', expect.anything());
			expect(pattern.state.completedSteps).toContain('inquiry');
			expect(pattern.state.currentStep).toBe('quote');
		});

		it('prevents completion if invalid', async () => {
			const pattern = createCommissionPattern({
				role: 'client',
				onStepComplete: vi.fn(),
				onCancel: vi.fn(),
			});

			await expect(pattern.state.completeStep()).rejects.toThrow();
		});

		it('navigates to accessible steps', async () => {
			const pattern = createCommissionPattern({
				role: 'client',
				onStepComplete: vi.fn(),
				onCancel: vi.fn(),
			});

			// Can't jump ahead
			pattern.state.goToStep('payment');
			expect(pattern.state.currentStep).toBe('inquiry'); // Should stay

			// Complete inquiry
			pattern.state.updateStepData('inquiry', { description: 'Art', budget: '100' });
			await pattern.state.completeStep(); // Now at quote

			// Can go back
			pattern.state.goToStep('inquiry');
			expect(pattern.state.currentStep).toBe('inquiry');
		});
	});

	describe('Role & Access', () => {
		it('checks step accessibility', () => {
			const pattern = createCommissionPattern({
				role: 'client',
				onStepComplete: vi.fn(),
				onCancel: vi.fn(),
			});

			expect(pattern.state.isStepAccessible('inquiry')).toBe(true);
			expect(pattern.state.isStepAccessible('quote')).toBe(false);
		});

		it('checks role relevance', () => {
			const pattern = createCommissionPattern({
				role: 'artist',
				onStepComplete: vi.fn(),
				onCancel: vi.fn(),
			});

			// Artist handles quotes
			expect(pattern.state.isStepForRole('quote')).toBe(true);
			// Artist doesn't handle inquiry (client does)
			expect(pattern.state.isStepForRole('inquiry')).toBe(false);
		});
	});

	describe('Persistence', () => {
		let setItemSpy: any;
		let getItemSpy: any;

		beforeEach(() => {
			setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
			getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
		});

		afterEach(() => {
			vi.restoreAllMocks();
		});

		it('persists progress on destroy', () => {
			const pattern = createCommissionPattern({
				role: 'client',
				onStepComplete: vi.fn(),
				onCancel: vi.fn(),
				enablePersistence: true,
			});

			pattern.destroy();
			expect(setItemSpy).toHaveBeenCalled();
		});

		it('loads progress on init', () => {
			const mockData = {
				currentStep: 'quote',
				completedSteps: ['inquiry'],
				stepData: { inquiry: { description: 'test' } },
			};
			getItemSpy.mockReturnValue(JSON.stringify(mockData));

			const pattern = createCommissionPattern({
				role: 'client',
				onStepComplete: vi.fn(),
				onCancel: vi.fn(),
				enablePersistence: true,
			});

			expect(pattern.state.currentStep).toBe('quote');
			expect(pattern.state.stepData.inquiry.description).toBe('test');
		});
	});

	describe('Helpers', () => {
		it('returns display names', () => {
			expect(getStepDisplayName('inquiry')).toBe('Commission Request');
		});

		it('returns role-specific descriptions', () => {
			expect(getStepDescription('quote', 'artist')).toContain('Provide a quote');
			expect(getStepDescription('quote', 'client')).toContain('Review the quote');
		});
	});
});

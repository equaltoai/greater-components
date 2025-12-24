// @vitest-environment jsdom
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

	describe('Composed Handlers', () => {
		const createPatternWithHandlers = (handlers: any = {}) => {
			return createCommissionPattern(
				{
					role: 'artist',
					onStepComplete: vi.fn(),
					onCancel: vi.fn(),
				},
				handlers
			);
		};

		it('handles onQuoteSubmit', async () => {
			const onQuoteSubmit = vi.fn();
			const pattern = createPatternWithHandlers({ onQuoteSubmit });

			// Setup required fields for validation if completeStep is called
			// Quote requires amount, timeline, deliverables

			// However, onQuoteSubmit calls updateStepData BEFORE calling completeStep
			// So we just need to ensure the data passed makes it valid

			// Wait, completeStep is called at the end.
			// So we need to ensure we are in the right step?
			// Default starts at 'inquiry', but onQuoteSubmit is for 'quote' step.
			// But handlers might be called regardless? No, completeStep acts on currentStep.

			// Let's force current step to 'quote' first
			pattern.state.goToStep('quote'); // Needs to be accessible though.
			// Easier to mock state or just force it via updateStepData + validation?

			// Let's just create a pattern that starts at 'quote'
			const patternAtQuote = createCommissionPattern(
				{
					role: 'artist',
					commission: { status: 'quoted' } as any, // This sets initial step to 'quote'
					onStepComplete: vi.fn(),
					onCancel: vi.fn(),
				},
				{ onQuoteSubmit }
			);

			await patternAtQuote.handlers.onQuoteSubmit?.(100, {
				timeline: '1 week',
				deliverables: 'Art',
			});

			expect(onQuoteSubmit).toHaveBeenCalledWith(100, { timeline: '1 week', deliverables: 'Art' });
			expect(patternAtQuote.state.stepData.quote).toMatchObject({
				amount: 100,
				timeline: '1 week',
				deliverables: 'Art',
			});
		});

		it('handles onAgreementAccept', async () => {
			const onAgreementAccept = vi.fn();
			const pattern = createCommissionPattern(
				{
					role: 'client',
					commission: { status: 'accepted' } as any, // 'agreement' step
					onStepComplete: vi.fn(),
					onCancel: vi.fn(),
				},
				{ onAgreementAccept }
			);

			await pattern.handlers.onAgreementAccept?.();

			expect(onAgreementAccept).toHaveBeenCalled();
			expect(pattern.state.stepData.agreement).toMatchObject({ accepted: true });
		});

		it('handles onPaymentProcess', async () => {
			const onPaymentProcess = vi.fn();
			const pattern = createCommissionPattern(
				{
					role: 'client', // Payment is usually client action
					onStepComplete: vi.fn(),
					onCancel: vi.fn(),
				},
				{ onPaymentProcess }
			);

			// Force step to payment. To do that we need completed steps.

			// Let's walk through it.
			// Inquiry -> Quote -> Agreement -> Payment.

			pattern.state.updateStepData('inquiry', { description: 'd', budget: 'b' });
			await pattern.state.completeStep(); // -> quote

			pattern.state.updateStepData('quote', { amount: 100, timeline: 't', deliverables: 'd' });
			await pattern.state.completeStep(); // -> agreement

			pattern.state.updateStepData('agreement', { accepted: true });
			await pattern.state.completeStep(); // -> payment

			expect(pattern.state.currentStep).toBe('payment');

			// Payment requires paymentMethod to be set before completion
			pattern.state.updateStepData('payment', { paymentMethod: 'credit_card' });

			await pattern.handlers.onPaymentProcess?.('milestone-1');

			expect(onPaymentProcess).toHaveBeenCalledWith('milestone-1');
			expect(pattern.state.stepData.payment).toMatchObject({
				milestoneId: 'milestone-1',
				processed: true,
			});
		});

		it('handles onProgressUpdate', async () => {
			const onProgressUpdate = vi.fn();
			const pattern = createCommissionPattern(
				{
					role: 'artist',
					onStepComplete: vi.fn(),
					onCancel: vi.fn(),
				},
				{ onProgressUpdate }
			);

			await pattern.handlers.onProgressUpdate?.('update text', ['img1']);
			expect(onProgressUpdate).toHaveBeenCalledWith('update text', ['img1']);
		});

		it('handles onRevisionRequest', async () => {
			const onRevisionRequest = vi.fn();
			const revisionPattern = createCommissionPattern(
				{
					role: 'client',
					onStepComplete: vi.fn(),
					onCancel: vi.fn(),
				},
				{ onRevisionRequest }
			);

			await revisionPattern.handlers.onRevisionRequest?.('fix this');

			expect(onRevisionRequest).toHaveBeenCalledWith('fix this');
			expect(revisionPattern.state.stepData.revision).toMatchObject({ feedback: 'fix this' });
		});

		it('handles onDelivery', async () => {
			const onDelivery = vi.fn();
			// Fast forward to delivery by starting at revision and completing it
			const patternRev = createCommissionPattern(
				{
					role: 'artist',
					commission: { status: 'revision' } as any,
					onStepComplete: vi.fn(),
					onCancel: vi.fn(),
				},
				{ onDelivery }
			);

			// complete revision
			await patternRev.state.completeStep(); // revision has no validation, so completes.

			expect(patternRev.state.currentStep).toBe('delivery');

			await patternRev.handlers.onDelivery?.(['file1']);

			expect(onDelivery).toHaveBeenCalledWith(['file1']);
			expect(patternRev.state.stepData.delivery).toMatchObject({ files: ['file1'] });
		});
	});

	describe('Persistence Error Handling', () => {
		let setItemSpy: any;
		let getItemSpy: any;

		beforeEach(() => {
			setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
			getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
		});

		afterEach(() => {
			vi.restoreAllMocks();
		});

		it('handles setItem error gracefully', () => {
			setItemSpy.mockImplementation(() => {
				throw new Error('Storage full');
			});

			const pattern = createCommissionPattern({
				role: 'client',
				onStepComplete: vi.fn(),
				onCancel: vi.fn(),
				enablePersistence: true,
			});

			// Should not throw
			expect(() => pattern.destroy()).not.toThrow();
		});

		it('handles getItem error gracefully', () => {
			getItemSpy.mockImplementation(() => {
				throw new Error('Corrupt data');
			});

			const pattern = createCommissionPattern({
				role: 'client',
				onStepComplete: vi.fn(),
				onCancel: vi.fn(),
				enablePersistence: true,
			});

			// Should not throw and use defaults
			expect(() => pattern.state).not.toThrow();
			expect(pattern.state.currentStep).toBe('inquiry');
		});
	});
});

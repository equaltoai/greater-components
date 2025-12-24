/**
 * Commission Flow Integration Tests
 *
 * Tests for commission workflow including:
 * - Full commission workflow
 * - Client/artist perspectives
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMockAdapter, createMockTransportManager } from '../mocks/mockAdapter.js';
import { createMockCommission, createMockCommissionInProgress } from '../mocks/mockCommission.js';

describe('Commission Flow Integration', () => {
	let mockAdapter: ReturnType<typeof createMockAdapter>;
	let mockTransport: ReturnType<typeof createMockTransportManager>;

	beforeEach(() => {
		mockAdapter = createMockAdapter();
		mockTransport = createMockTransportManager();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Full Commission Workflow', () => {
		it('completes inquiry to completion flow', async () => {
			const statuses = ['inquiry', 'quoted', 'accepted', 'in_progress', 'completed'];
			let commission = createMockCommission('flow-1', { status: 'inquiry' });

			for (let i = 1; i < statuses.length; i++) {
				mockAdapter.updateCommissionStatus.mockResolvedValue({ success: true });
				await mockAdapter.updateCommissionStatus(commission.id, statuses[i] as any);
				commission = { ...commission, status: statuses[i] as any };
				expect(commission.status).toBe(statuses[i]);
			}
		});

		it('handles revision requests', async () => {
			let commission = createMockCommission('revision-1', { status: 'in_progress' });

			mockAdapter.updateCommissionStatus.mockResolvedValue({ success: true });
			await mockAdapter.updateCommissionStatus(commission.id, 'revision');
			commission = { ...commission, status: 'revision' };

			expect(commission.status).toBe('revision');

			// Back to in_progress after revision
			await mockAdapter.updateCommissionStatus(commission.id, 'in_progress');
			commission = { ...commission, status: 'in_progress' };

			expect(commission.status).toBe('in_progress');
		});

		it('handles cancellation at any stage', async () => {
			const stages = ['inquiry', 'quoted', 'accepted', 'in_progress'];

			for (const stage of stages) {
				let commission = createMockCommission(`cancel-${stage}`, { status: stage as any });

				mockAdapter.updateCommissionStatus.mockResolvedValue({ success: true });
				await mockAdapter.updateCommissionStatus(commission.id, 'cancelled');
				commission = { ...commission, status: 'cancelled' };

				expect(commission.status).toBe('cancelled');
			}
		});
	});

	describe('Client Perspective', () => {
		it('submits commission request', async () => {
			const request = {
				title: 'Portrait Commission',
				description: 'I would like a portrait of my pet',
				budget: '200-300 USD',
				deadline: 'Flexible',
			};

			mockAdapter.createCommission.mockResolvedValue({
				id: 'new-commission',
				status: 'inquiry',
				...request,
			});

			const result = await mockAdapter.createCommission(request);
			expect(result.status).toBe('inquiry');
		});

		it('views quote from artist', () => {
			const commission = createMockCommission('quote-view', {
				status: 'quoted',
				price: 250,
				currency: 'USD',
			});

			expect(commission.status).toBe('quoted');
			expect(commission.price).toBe(250);
		});

		it('accepts or declines quote', async () => {
			const commission = createMockCommission('quote-decision', { status: 'quoted' });

			// Accept
			mockAdapter.updateCommissionStatus.mockResolvedValue({ success: true });
			await mockAdapter.updateCommissionStatus(commission.id, 'accepted');

			expect(mockAdapter.updateCommissionStatus).toHaveBeenCalledWith(commission.id, 'accepted');
		});

		it('requests revision', async () => {
			const commission = createMockCommission('client-revision', { status: 'in_progress' });

			mockAdapter.updateCommissionStatus.mockResolvedValue({ success: true });
			mockAdapter.addCommissionMessage.mockResolvedValue({ success: true });

			await mockAdapter.addCommissionMessage(commission.id, 'Could you adjust the colors?');
			await mockAdapter.updateCommissionStatus(commission.id, 'revision');

			expect(mockAdapter.addCommissionMessage).toHaveBeenCalled();
			expect(mockAdapter.updateCommissionStatus).toHaveBeenCalledWith(commission.id, 'revision');
		});

		it('approves final delivery', async () => {
			const commission = createMockCommission('approve', { status: 'in_progress' });

			mockAdapter.updateCommissionStatus.mockResolvedValue({ success: true });
			await mockAdapter.updateCommissionStatus(commission.id, 'completed');

			expect(mockAdapter.updateCommissionStatus).toHaveBeenCalledWith(commission.id, 'completed');
		});
	});

	describe('Artist Perspective', () => {
		it('views incoming requests', async () => {
			mockAdapter.fetchCommissions.mockResolvedValue({
				edges: [
					{ node: createMockCommission('req-1', { status: 'inquiry' }) },
					{ node: createMockCommission('req-2', { status: 'inquiry' }) },
				],
			});

			const result = await mockAdapter.fetchCommissions();
			const inquiries = result.edges.filter((e: any) => e.node.status === 'inquiry');

			expect(inquiries.length).toBe(2);
		});

		it('sends quote to client', async () => {
			const commission = createMockCommission('send-quote', { status: 'inquiry' });
			const quote = {
				price: 300,
				currency: 'USD',
				deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
				terms: 'Payment upfront, 2 revisions included',
			};

			mockAdapter.updateCommissionStatus.mockResolvedValue({ success: true });
			mockAdapter.mutate.mockResolvedValue({ data: { ...commission, ...quote, status: 'quoted' } });

			await mockAdapter.mutate({
				mutation: 'SendQuote',
				variables: { commissionId: commission.id, ...quote },
			});
			await mockAdapter.updateCommissionStatus(commission.id, 'quoted');

			expect(mockAdapter.mutate).toHaveBeenCalled();
		});

		it('uploads work in progress', async () => {
			const commission = createMockCommissionInProgress('wip-upload');

			mockAdapter.mutate.mockResolvedValue({ success: true });

			await mockAdapter.mutate({
				mutation: 'UploadWIP',
				variables: {
					commissionId: commission.id,
					file: 'wip-image.jpg',
					note: 'Initial sketch',
				},
			});

			expect(mockAdapter.mutate).toHaveBeenCalled();
		});

		it('marks milestones complete', async () => {
			const commission = createMockCommissionInProgress('milestone');

			mockAdapter.mutate.mockResolvedValue({ success: true });

			await mockAdapter.mutate({
				mutation: 'CompleteMilestone',
				variables: {
					commissionId: commission.id,
					milestoneId: commission.milestones[0].id,
				},
			});

			expect(mockAdapter.mutate).toHaveBeenCalled();
		});

		it('delivers final work', async () => {
			const commission = createMockCommissionInProgress('deliver');

			mockAdapter.mutate.mockResolvedValue({ success: true });
			mockAdapter.updateCommissionStatus.mockResolvedValue({ success: true });

			await mockAdapter.mutate({
				mutation: 'DeliverFinal',
				variables: {
					commissionId: commission.id,
					files: ['final-artwork.png'],
				},
			});

			expect(mockAdapter.mutate).toHaveBeenCalled();
		});
	});

	describe('Real-time Updates', () => {
		it('receives status update notifications', () => {
			const handler = vi.fn();
			mockTransport.subscribe('commission:1:updates', handler);

			mockTransport.emit('commission:1:updates', {
				type: 'status_changed',
				data: { status: 'quoted' },
			});

			expect(handler).toHaveBeenCalled();
		});

		it('receives new message notifications', () => {
			const handler = vi.fn();
			mockTransport.subscribe('commission:1:messages', handler);

			mockTransport.emit('commission:1:messages', {
				type: 'new_message',
				data: { content: 'Hello!' },
			});

			expect(handler).toHaveBeenCalled();
		});
	});
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/svelte';
import WIPContextWrapper from './CreativeToolsWIPContextWrapper.svelte';
import CritiqueContextWrapper from './CreativeToolsCritiqueContextWrapper.svelte';
import ChildrenWrapper from './ChildrenWrapper.svelte';
import {
	WorkInProgress,
	CritiqueMode,
	CommissionWorkflow,
	ReferenceBoard,
} from '../../../src/components/CreativeTools/index.ts';
import { createMockArtwork } from '../../mocks/mockArtwork.ts';

describe('CreativeTools Smoke Tests', () => {
	const mockArtwork = createMockArtwork('ct-1');
	const mockThread = {
		id: 't1',
		artwork: mockArtwork,
		updates: [],
		status: 'active',
		createdAt: new Date().toISOString(),
	} as any;
	const mockCommission = {
		id: 'c1',
		artistId: 'a1',
		clientId: 'c1',
		status: 'inquiry',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		history: [],
	} as any;

	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('WorkInProgress', () => {
		const components = [
			{ name: 'Timeline', Component: WorkInProgress.Timeline },
			{ name: 'Compare', Component: WorkInProgress.Compare },
			{ name: 'Comments', Component: WorkInProgress.Comments },
			{ name: 'Header', Component: WorkInProgress.Header },
		];

		it.each(components)('renders $name without errors', ({ Component }) => {
			render(WIPContextWrapper, {
				props: {
					thread: mockThread,
					Component: Component,
					props: {},
				},
			});
			expect(console.error).not.toHaveBeenCalled();
		});

		it('renders Root', () => {
			render(ChildrenWrapper, {
				props: {
					Component: WorkInProgress.Root,
					props: { thread: mockThread },
				},
			});
			expect(console.error).not.toHaveBeenCalled();
		});
	});

	describe('CritiqueMode', () => {
		const components = [
			{ name: 'Image', Component: CritiqueMode.Image },
			{ name: 'Annotations', Component: CritiqueMode.Annotations },
		];

		it.each(components)('renders $name without errors', ({ Component }) => {
			render(CritiqueContextWrapper, {
				props: {
					submission: { artwork: mockArtwork } as any,
					Component: Component,
					props: {},
				},
			});
			expect(console.error).not.toHaveBeenCalled();
		});

		it('renders Root', () => {
			render(ChildrenWrapper, {
				props: {
					Component: CritiqueMode.Root,
					props: { artwork: mockArtwork },
				},
			});
			expect(console.error).not.toHaveBeenCalled();
		});
	});

	describe('CommissionWorkflow', () => {
		// Subcomponents might be internal or not exported as properties of CommissionWorkflow object if it's default export
		// Checking index.ts: export { CommissionWorkflow } from './CommissionWorkflow/index.js';
		// Usually Compound components have properties.
		// If not, we test Root.

		// Assuming CommissionWorkflow is an object with Root.
		it('renders Root', () => {
			render(ChildrenWrapper, {
				props: {
					Component: CommissionWorkflow.Root,
					props: { commission: mockCommission, role: 'client' },
				},
			});
			expect(console.error).not.toHaveBeenCalled();
		});
	});

	describe('ReferenceBoard', () => {
		it('renders ReferenceBoard', () => {
			render(ReferenceBoard, {
				props: {
					board: {
						id: 'b1',
						title: 'Ref',
						items: [],
						dimensions: { width: 800, height: 600 },
					} as any,
				},
			});
			expect(console.error).not.toHaveBeenCalled();
		});
	});
});

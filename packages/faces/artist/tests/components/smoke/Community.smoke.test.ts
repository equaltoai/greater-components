import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/svelte';
import CritiqueCircleContextWrapper from './CommunityCritiqueCircleContextWrapper.svelte';
import CollaborationContextWrapper from './CommunityCollaborationContextWrapper.svelte';
import ChildrenWrapper from './ChildrenWrapper.svelte';
import {
	CritiqueCircle,
	Collaboration,
	MentorMatch,
} from '../../../src/components/Community/index.ts';

describe('Community Smoke Tests', () => {
	const mockCircle = {
		id: 'cc1',
		name: 'Circle',
		members: [],
		status: 'active',
		activeSession: null,
		queue: [],
		history: [],
	} as any;

	const mockCollaboration = {
		id: 'col1',
		title: 'Collab',
		members: [],
		status: 'active',
		acceptingMembers: true,
	} as any;

	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('CritiqueCircle', () => {
		// Assuming CritiqueCircle has subcomponents like Queue, Session, etc.
		// Index exports CritiqueCircle as object.
		const components = [
			{ name: 'Queue', Component: CritiqueCircle.Queue },
			{ name: 'Session', Component: CritiqueCircle.Session },
			{ name: 'History', Component: CritiqueCircle.History },
			{ name: 'Members', Component: CritiqueCircle.Members },
		];

		it.each(components)('renders $name without errors', ({ Component }) => {
			render(CritiqueCircleContextWrapper, {
				props: {
					circle: mockCircle,
					Component: Component,
					props: {},
				},
			});
			expect(console.error).not.toHaveBeenCalled();
		});

		it('renders Root', () => {
			render(ChildrenWrapper, {
				props: {
					Component: CritiqueCircle.Root,
					props: { circle: mockCircle },
				},
			});
			expect(console.error).not.toHaveBeenCalled();
		});
	});

	describe('Collaboration', () => {
		const components = [
			{ name: 'Gallery', Component: Collaboration.Gallery },
			{ name: 'Split', Component: Collaboration.Split },
			{ name: 'Uploads', Component: Collaboration.Uploads },
			{ name: 'Contributors', Component: Collaboration.Contributors },
		];

		it.each(components)('renders $name without errors', ({ Component }) => {
			render(CollaborationContextWrapper, {
				props: {
					collaboration: mockCollaboration,
					Component: Component,
					props: {},
				},
			});
			expect(console.error).not.toHaveBeenCalled();
		});

		it('renders Root', () => {
			render(ChildrenWrapper, {
				props: {
					Component: Collaboration.Root,
					props: { collaboration: mockCollaboration },
				},
			});
			expect(console.error).not.toHaveBeenCalled();
		});
	});

	describe('MentorMatch', () => {
		it('renders MentorMatch', () => {
			render(MentorMatch, {
				props: {
					mentors: [],
					userRole: 'mentee',
				},
			});
			expect(console.error).not.toHaveBeenCalled();
		});
	});
});

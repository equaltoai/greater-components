import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import ChatThreadView from '../src/ChatThreadView.svelte';
import type { ChatMessage } from '../src/types';

describe('ChatThreadView', () => {
	const mockRootMessages: ChatMessage[] = [
		{ id: 'msg1', role: 'user', content: 'Hello', timestamp: new Date() },
		{ id: 'msg2', role: 'assistant', content: 'Hi there', timestamp: new Date() },
	];

	const mockBranchMessages: ChatMessage[] = [
		{ id: 'msg3', role: 'user', content: 'Branch message', timestamp: new Date() },
		{ id: 'msg4', role: 'assistant', content: 'Branch response', timestamp: new Date() },
	];

	const mockThread = {
		id: 'thread1',
		rootMessages: mockRootMessages,
		branches: [
			{
				id: 'branch1',
				parentMessageId: 'msg2',
				messages: mockBranchMessages,
				createdAt: new Date(),
				label: 'Test Branch',
			},
		],
		activeBranchId: undefined,
	};

	it('renders root messages when no branch is active', () => {
		render(ChatThreadView, {
			props: {
				thread: mockThread,
			},
		});

		expect(screen.getByText('Hello')).toBeTruthy();
		expect(screen.getByText('Hi there')).toBeTruthy();
		expect(screen.queryByText('Branch message')).toBeNull();
	});

	it('renders branch messages when active', () => {
		render(ChatThreadView, {
			props: {
				thread: {
					...mockThread,
					activeBranchId: 'branch1',
				},
			},
		});

		expect(screen.getByText('Hello')).toBeTruthy();
		expect(screen.getByText('Hi there')).toBeTruthy();
		expect(screen.getByText('Branch message')).toBeTruthy();
		expect(screen.getByText('Branch response')).toBeTruthy();
	});

	it('shows branch indicator when branch is active', () => {
		render(ChatThreadView, {
			props: {
				thread: {
					...mockThread,
					activeBranchId: 'branch1',
				},
			},
		});

		expect(screen.getByText('Viewing branch: Test Branch')).toBeTruthy();
	});

	it('calls onBranchSelect with empty string when returning to main', async () => {
		const onBranchSelect = vi.fn();
		render(ChatThreadView, {
			props: {
				thread: {
					...mockThread,
					activeBranchId: 'branch1',
				},
				onBranchSelect,
			},
		});

		const returnButton = screen.getByText('Return to main');
		await fireEvent.click(returnButton);

		expect(onBranchSelect).toHaveBeenCalledWith('');
	});

	it('shows branch button on assistant messages when branches enabled', () => {
		render(ChatThreadView, {
			props: {
				thread: mockThread,
				showBranches: true,
			},
		});

		const branchButtons = screen.getAllByLabelText('Create branch from this message');
		expect(branchButtons.length).toBeGreaterThan(0);
	});

	it('calls onCreateBranch when branch button clicked', async () => {
		const onCreateBranch = vi.fn();
		render(ChatThreadView, {
			props: {
				thread: mockThread,
				onCreateBranch,
			},
		});

		const branchButtons = screen.getAllByLabelText('Create branch from this message');
		await fireEvent.click(branchButtons[0]);

		expect(onCreateBranch).toHaveBeenCalledWith('msg2');
	});

	it('shows existing branches list', () => {
		render(ChatThreadView, {
			props: {
				thread: mockThread,
				showBranches: true,
			},
		});

		expect(screen.getByText('Test Branch')).toBeTruthy();
	});

	it('calls onBranchSelect when clicking a branch link', async () => {
		const onBranchSelect = vi.fn();
		render(ChatThreadView, {
			props: {
				thread: mockThread,
				onBranchSelect,
			},
		});

		const branchLink = screen.getByText('Test Branch');
		await fireEvent.click(branchLink);

		expect(onBranchSelect).toHaveBeenCalledWith('branch1');
	});
});

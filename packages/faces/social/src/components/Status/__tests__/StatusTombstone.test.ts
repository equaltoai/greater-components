import { describe, it, expect } from 'vitest';
import { mount } from 'svelte';
import StatusRoot from '../Root.svelte';
import type { Status } from '../../../types.js';

const baseStatus: Status = {
	id: 'status-1',
	uri: 'status-1',
	url: 'https://example.com/@alice/status/1',
	account: {
		id: 'account-1',
		username: 'alice',
		acct: 'alice@example.com',
		displayName: 'Alice',
		avatar: 'https://example.com/avatar.png',
		url: 'https://example.com/@alice',
		createdAt: new Date().toISOString(),
	},
	content: 'Hello world',
	createdAt: new Date().toISOString(),
	visibility: 'public',
	repliesCount: 0,
	reblogsCount: 0,
	favouritesCount: 0,
};

describe('Status.Root tombstone rendering', () => {
	it('renders tombstone messaging for deleted statuses', () => {
		const target = document.createElement('div');
		mount(StatusRoot, {
			target,
			props: { status: { ...baseStatus, isDeleted: true, deletedAt: '2024-01-02T00:00:00Z' } },
		});

		expect(target.textContent).toContain('This post has been deleted.');
	});

	it('does not render tombstone messaging for active statuses', () => {
		const target = document.createElement('div');
		mount(StatusRoot, {
			target,
			props: { status: baseStatus },
		});

		expect(target.textContent).not.toContain('This post has been deleted.');
	});
});

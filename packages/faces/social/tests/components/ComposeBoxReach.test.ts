import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import ComposeBox from '../../src/components/ComposeBox.svelte';

/**
 * Lesser v1.5.33 rejects a reply or quote whose visibility reaches wider than
 * its parent with UNPROCESSABLE_ENTITY (pkg/services/notes/reach.go). Earlier
 * releases clamped silently. The composer therefore constrains the picker so an
 * author is not led into a refusal, and explains the refusal when the parent's
 * reach narrows between render and submit.
 */

type Visibility = 'public' | 'unlisted' | 'private' | 'direct';

function parent(visibility: Visibility, acct = 'author@example.social') {
	return {
		id: 'parent-1',
		uri: 'https://example.social/statuses/parent-1',
		url: 'https://example.social/@author/parent-1',
		account: { acct, displayName: 'Author' },
		content: 'Parent post',
		createdAt: '2026-08-01T00:00:00.000Z',
		visibility,
		repliesCount: 0,
		reblogsCount: 0,
		favouritesCount: 0,
	};
}

function visibilityOptions(): HTMLOptionElement[] {
	const select = screen.getByLabelText('Post visibility') as HTMLSelectElement;
	return [...select.options];
}

function enabledVisibilities(): string[] {
	return visibilityOptions()
		.filter((option) => !option.disabled)
		.map((option) => option.value);
}

function disabledVisibilities(): string[] {
	return visibilityOptions()
		.filter((option) => option.disabled)
		.map((option) => option.value);
}

describe('ComposeBox reply/quote reach constraint (Lesser v1.5.33)', () => {
	beforeEach(() => {
		const store: Record<string, string> = {};
		Object.defineProperty(window, 'localStorage', {
			value: {
				getItem: vi.fn((key: string) => store[key] ?? null),
				setItem: vi.fn((key: string, value: string) => {
					store[key] = value;
				}),
				removeItem: vi.fn((key: string) => {
					delete store[key];
				}),
				clear: vi.fn(),
			},
			configurable: true,
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('leaves the picker unconstrained for a fresh post', () => {
		render(ComposeBox);

		expect(enabledVisibilities()).toEqual(['public', 'unlisted', 'private', 'direct']);
		expect(disabledVisibilities()).toEqual([]);
		expect(screen.queryByText(/wider audience/i)).toBeNull();
	});

	it.each([
		['public', ['public', 'unlisted', 'private', 'direct'], []],
		['unlisted', ['unlisted', 'private', 'direct'], ['public']],
		['private', ['private', 'direct'], ['public', 'unlisted']],
		['direct', ['direct'], ['public', 'unlisted', 'private']],
	] as const)(
		'constrains a reply to a %s parent to equal-or-narrower reach',
		(visibility, enabled, blocked) => {
			render(ComposeBox, { replyToStatus: parent(visibility) } as never);

			expect(enabledVisibilities()).toEqual([...enabled]);
			expect(disabledVisibilities()).toEqual([...blocked]);
		}
	);

	it('offers no public quote path for a direct parent', () => {
		render(ComposeBox, { quotedStatus: parent('direct') } as never);

		expect(enabledVisibilities()).toEqual(['direct']);
		const select = screen.getByLabelText('Post visibility') as HTMLSelectElement;
		expect(select.value).toBe('direct');
		expect(screen.getByText('Quoting @author@example.social')).toBeTruthy();
	});

	it('narrows a widening default rather than sending it', () => {
		render(ComposeBox, {
			replyToStatus: parent('private'),
			defaultVisibility: 'public',
		} as never);

		const select = screen.getByLabelText('Post visibility') as HTMLSelectElement;
		// Narrowed, never widened: `public` under a followers-only parent
		// settles on the narrowest permitted option.
		expect(select.value).toBe('direct');
		expect(enabledVisibilities()).not.toContain('public');
	});

	it('keeps a permitted default untouched', () => {
		render(ComposeBox, {
			replyToStatus: parent('unlisted'),
			defaultVisibility: 'private',
		} as never);

		expect((screen.getByLabelText('Post visibility') as HTMLSelectElement).value).toBe('private');
	});

	it('describes the constraint for assistive technology', () => {
		render(ComposeBox, { replyToStatus: parent('private'), id: 'composer' } as never);

		const select = screen.getByLabelText('Post visibility');
		const describedBy = select.getAttribute('aria-describedby');
		expect(describedBy).toBe('composer-visibility-note');

		const note = document.getElementById(describedBy ?? '');
		expect(note?.textContent).toMatch(/wider audience/i);
	});

	it('states the single permitted option for a direct parent', () => {
		render(ComposeBox, { replyToStatus: parent('direct'), id: 'composer' } as never);

		expect(document.getElementById('composer-visibility-note')?.textContent).toMatch(
			/can only be direct/i
		);
	});

	it('does not constrain when the parent reach is unreadable', () => {
		render(ComposeBox, {
			replyToStatus: { ...parent('public'), visibility: 'followers-only' },
		} as never);

		// The server stays the enforcer; a guessed constraint would block
		// legitimate choices, and a refusal is reported inline instead.
		expect(disabledVisibilities()).toEqual([]);
		expect(screen.queryByText(/wider audience/i)).toBeNull();
	});

	it('re-narrows when the parent narrows after render', async () => {
		const { rerender } = render(ComposeBox, {
			replyToStatus: parent('public'),
			defaultVisibility: 'public',
		} as never);

		expect((screen.getByLabelText('Post visibility') as HTMLSelectElement).value).toBe('public');

		await rerender({ replyToStatus: parent('direct'), defaultVisibility: 'public' } as never);

		await waitFor(() => {
			expect((screen.getByLabelText('Post visibility') as HTMLSelectElement).value).toBe('direct');
		});
		expect(enabledVisibilities()).toEqual(['direct']);
	});

	it('explains an UNPROCESSABLE_ENTITY refusal inline and keeps the draft', async () => {
		const onSubmit = vi.fn().mockRejectedValue({
			errors: [
				{
					message: 'requested visibility exceeds parent reach',
					extensions: { code: 'UNPROCESSABLE_ENTITY' },
				},
			],
		});

		render(ComposeBox, {
			replyToStatus: parent('private'),
			initialContent: 'A considered reply',
			onSubmit,
		} as never);

		await fireEvent.click(screen.getByRole('button', { name: /Reply/i }));

		const alert = await screen.findByRole('alert');
		expect(alert.textContent).toMatch(/wider audience than the post it replies to/i);

		// The author's text survives the refusal so they can retry.
		expect((screen.getByLabelText(/Reply to Author/i) as HTMLTextAreaElement).value).toBe(
			'A considered reply'
		);
	});

	it('reports an unrelated failure without blaming reach', async () => {
		const onSubmit = vi.fn().mockRejectedValue(new Error('network down'));

		render(ComposeBox, {
			replyToStatus: parent('private'),
			initialContent: 'Another reply',
			onSubmit,
		} as never);

		await fireEvent.click(screen.getByRole('button', { name: /Reply/i }));

		const alert = await screen.findByRole('alert');
		expect(alert.textContent).toMatch(/could not be sent/i);
		expect(alert.textContent).not.toMatch(/wider audience/i);
	});

	it('clears a previous error on a successful retry', async () => {
		const onSubmit = vi
			.fn()
			.mockRejectedValueOnce({ errors: [{ extensions: { code: 'UNPROCESSABLE_ENTITY' } }] })
			.mockResolvedValueOnce(undefined);

		render(ComposeBox, {
			replyToStatus: parent('private'),
			initialContent: 'Retry me',
			onSubmit,
		} as never);

		await fireEvent.click(screen.getByRole('button', { name: /Reply/i }));
		expect(await screen.findByRole('alert')).toBeTruthy();

		await fireEvent.click(screen.getByRole('button', { name: /Reply/i }));
		await waitFor(() => {
			expect(screen.queryByRole('alert')).toBeNull();
		});
	});

	it('submits the constrained visibility, never a widened one', async () => {
		const onSubmit = vi.fn().mockResolvedValue(undefined);

		render(ComposeBox, {
			replyToStatus: parent('private'),
			defaultVisibility: 'public',
			initialContent: 'Constrained reply',
			onSubmit,
		} as never);

		await fireEvent.click(screen.getByRole('button', { name: /Reply/i }));

		await waitFor(() => expect(onSubmit).toHaveBeenCalled());
		expect(onSubmit.mock.calls[0]?.[0]?.visibility).toBe('direct');
	});
});

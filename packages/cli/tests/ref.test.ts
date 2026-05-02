import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/utils/git-fetch.js', () => ({
	resolveGitRefToCommit: vi.fn(),
}));

describe('ref resolution hardening', () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
		delete process.env['GREATER_CLI_LOCAL_REPO_ROOT'];
	});

	it('pins stable Greater tags to immutable commits before fetching', async () => {
		const { resolveGitRefToCommit } = await import('../src/utils/git-fetch.js');
		vi.mocked(resolveGitRefToCommit).mockResolvedValue('0123456789abcdef0123456789abcdef01234567');

		const { resolveRefForFetch, shouldPinRef } = await import('../src/utils/ref.js');

		expect(shouldPinRef('greater-v0.8.6')).toBe(true);
		await expect(resolveRefForFetch('greater-v0.8.6')).resolves.toBe(
			'0123456789abcdef0123456789abcdef01234567'
		);
		expect(resolveGitRefToCommit).toHaveBeenCalledWith('greater-v0.8.6');
	});

	it('does not resolve refs that are already immutable commit SHAs', async () => {
		const { resolveGitRefToCommit } = await import('../src/utils/git-fetch.js');
		const { resolveRefForFetch, shouldPinRef } = await import('../src/utils/ref.js');
		const commit = '0123456789abcdef0123456789abcdef01234567';

		expect(shouldPinRef(commit)).toBe(false);
		await expect(resolveRefForFetch(commit)).resolves.toBe(commit);
		expect(resolveGitRefToCommit).not.toHaveBeenCalled();
	});

	it('fails closed when a mutable ref cannot be resolved to a commit', async () => {
		const { resolveGitRefToCommit } = await import('../src/utils/git-fetch.js');
		vi.mocked(resolveGitRefToCommit).mockResolvedValue(null);

		const { resolveRefForFetch } = await import('../src/utils/ref.js');

		await expect(resolveRefForFetch('greater-v0.8.6')).rejects.toThrow(
			'Refusing to fetch from a mutable ref'
		);
	});
});

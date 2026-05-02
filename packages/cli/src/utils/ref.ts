import { resolveGitRefToCommit } from './git-fetch.js';

const COMMIT_SHA_RE = /^[0-9a-f]{7,40}$/i;

export function isCommitSha(ref: string): boolean {
	return COMMIT_SHA_RE.test(ref.trim());
}

export function shouldPinRef(ref: string): boolean {
	if (process.env['GREATER_CLI_LOCAL_REPO_ROOT']) return false;

	const trimmed = ref.trim();
	if (!trimmed) return false;
	if (isCommitSha(trimmed)) return false;

	return true;
}

export async function resolveRefForFetch(ref: string): Promise<string> {
	if (!shouldPinRef(ref)) return ref;

	const commit = await resolveGitRefToCommit(ref);
	if (!commit || !isCommitSha(commit)) {
		throw new Error(
			`Unable to resolve git ref "${ref}" to an immutable commit SHA. Refusing to fetch from a mutable ref.`
		);
	}

	return commit;
}

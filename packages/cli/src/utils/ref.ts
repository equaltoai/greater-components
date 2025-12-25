import { resolveGitRefToCommit } from './git-fetch.js';

const COMMIT_SHA_RE = /^[0-9a-f]{7,40}$/i;
const STABLE_TAG_RE =
	/^(?:greater-v\d+\.\d+\.\d+(?:-[0-9A-Za-z-.]+)?|v\d+\.\d+\.\d+(?:-[0-9A-Za-z-.]+)?|snapshot-\d{8}-[0-9a-f]+|@equaltoai\/)/;

export function isCommitSha(ref: string): boolean {
	return COMMIT_SHA_RE.test(ref.trim());
}

export function shouldPinRef(ref: string): boolean {
	if (process.env['GREATER_CLI_LOCAL_REPO_ROOT']) return false;

	const trimmed = ref.trim();
	if (!trimmed) return false;
	if (isCommitSha(trimmed)) return false;
	if (STABLE_TAG_RE.test(trimmed)) return false;

	return true;
}

export async function resolveRefForFetch(ref: string): Promise<string> {
	if (!shouldPinRef(ref)) return ref;

	const commit = await resolveGitRefToCommit(ref);
	return commit ?? ref;
}


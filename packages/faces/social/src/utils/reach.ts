/**
 * Reply and quote reach constraints.
 *
 * Lesser v1.5.33 orders reach `public < unlisted < private/followers < direct`,
 * widest to narrowest, and *rejects* a child status whose visibility is wider
 * than the status it replies to or quotes. REST status replies, GraphQL
 * note/quote mutations, and `POST /api/v1/statuses/{id}/reblog` with a non-empty
 * comment all answer `UNPROCESSABLE_ENTITY`. Earlier releases silently clamped;
 * v1.5.33 never clamps an explicit author choice, it refuses it.
 * (docs/security/hardened-auth-visibility-rollout.md; pkg/services/notes/reach.go
 * `ValidateChildReach`.)
 *
 * The server remains the enforcer. Everything here is UX only: it narrows what
 * the composer offers so an author is not led into a request that will be
 * refused. It must never widen reach, and never presume a request will be
 * accepted.
 */

/** Status visibility, widest to narrowest — the order Lesser ranks reach by. */
export type ComposeVisibility = 'public' | 'unlisted' | 'private' | 'direct';

/** Visibility options in reach order, widest first. */
export const COMPOSE_VISIBILITY_ORDER: readonly ComposeVisibility[] = [
	'public',
	'unlisted',
	'private',
	'direct',
];

/**
 * Reach rank. Mirrors `childReachVisibilityRank` in Lesser: lower is wider.
 */
const REACH_RANK: Readonly<Record<ComposeVisibility, number>> = {
	public: 0,
	unlisted: 1,
	private: 2,
	direct: 3,
};

/** True when `value` is a visibility Lesser ranks for reach purposes. */
export function isComposeVisibility(value: unknown): value is ComposeVisibility {
	return typeof value === 'string' && value in REACH_RANK;
}

/**
 * Reach rank for a visibility, or `null` when unrecognised.
 *
 * Lesser refuses an unrecognised visibility on either side of the comparison
 * with `UNPROCESSABLE_ENTITY`, so callers must not treat `null` as "public".
 */
export function reachRank(visibility: unknown): number | null {
	return isComposeVisibility(visibility) ? REACH_RANK[visibility] : null;
}

/**
 * True when `requested` reaches a wider audience than `parent` — exactly the
 * condition Lesser rejects.
 *
 * An unrecognised visibility on either side is reported as widening so the
 * composer fails closed rather than offering an option the server will refuse.
 */
export function isReachWidening(parent: unknown, requested: unknown): boolean {
	const parentRank = reachRank(parent);
	const requestedRank = reachRank(requested);
	if (parentRank === null || requestedRank === null) {
		return true;
	}
	return requestedRank < parentRank;
}

/**
 * Visibilities a reply to / quote of `parentVisibility` may use.
 *
 * Equal or narrower passes. A `direct` parent therefore permits only `direct`:
 * there is no public quote path for a direct or conversation status. With no
 * parent (a fresh post) every option is available.
 *
 * When the parent's reach is absent or unrecognised, no constraint is applied.
 * That is deliberate, and it is not a fail-open: the server is the enforcer, so
 * the worst case is an option the server refuses — which the composer reports
 * inline. Fabricating a constraint from data we cannot read would instead block
 * choices the author is entitled to make. Note the asymmetry with
 * {@link isReachWidening}, which answers "will Lesser reject this?" and so
 * answers conservatively for the same input.
 */
export function allowedChildVisibilities(parentVisibility: unknown): readonly ComposeVisibility[] {
	const parentRank = reachRank(parentVisibility);
	if (parentRank === null) {
		return COMPOSE_VISIBILITY_ORDER;
	}
	return COMPOSE_VISIBILITY_ORDER.filter((visibility) => REACH_RANK[visibility] >= parentRank);
}

/**
 * Narrows `requested` to the nearest permitted visibility for a parent.
 *
 * Used to settle the composer's initial selection — a default of `public` under
 * a followers-only parent becomes `private`. This only ever narrows, so it
 * cannot turn an author's choice into a wider audience than they picked.
 */
export function constrainVisibility(
	parentVisibility: unknown,
	requested: unknown
): ComposeVisibility {
	const allowed = allowedChildVisibilities(parentVisibility);
	if (isComposeVisibility(requested) && allowed.includes(requested)) {
		return requested;
	}
	// `allowed` is ordered widest-first and never empty, so the last entry is
	// the narrowest permitted option.
	return allowed[allowed.length - 1] ?? 'direct';
}

/**
 * True when an error is Lesser's reach rejection.
 *
 * Reach is re-checked at submit time, so a parent's visibility can narrow
 * between render and submit and a request the composer believed valid can still
 * be refused. Recognising the code lets the composer explain that rather than
 * showing a generic failure.
 */
export function isReachRejection(error: unknown): boolean {
	return extractErrorCodes(error).includes('UNPROCESSABLE_ENTITY');
}

function codeFrom(value: unknown): string | null {
	if (!value || typeof value !== 'object') {
		return null;
	}
	const record = value as Record<string, unknown>;
	const extensions = record['extensions'];
	if (extensions && typeof extensions === 'object') {
		const code = (extensions as Record<string, unknown>)['code'];
		if (typeof code === 'string' && code.length > 0) {
			return code;
		}
	}
	const direct = record['code'];
	return typeof direct === 'string' && direct.length > 0 ? direct : null;
}

/**
 * Collects `extensions.code` values from the error shapes the composer may be
 * handed: a GraphQL error, an execution result, an Apollo error, or a REST
 * error body. Only the code enum is read.
 */
function extractErrorCodes(source: unknown): string[] {
	const codes = new Set<string>();
	const seen = new Set<unknown>();

	const walk = (value: unknown, depth: number): void => {
		if (!value || typeof value !== 'object' || depth > 4 || seen.has(value)) {
			return;
		}
		seen.add(value);

		if (Array.isArray(value)) {
			for (const entry of value) {
				const code = codeFrom(entry);
				if (code) {
					codes.add(code);
				}
				walk(entry, depth + 1);
			}
			return;
		}

		const code = codeFrom(value);
		if (code) {
			codes.add(code);
		}

		const record = value as Record<string, unknown>;
		// HTTP 422 is the REST projection of the same rejection.
		if (record['status'] === 422 || record['statusCode'] === 422) {
			codes.add('UNPROCESSABLE_ENTITY');
		}

		for (const key of [
			'errors',
			'graphQLErrors',
			'payload',
			'result',
			'networkError',
			'cause',
			'body',
		]) {
			walk(record[key], depth + 1);
		}
	};

	walk(source, 0);
	return [...codes];
}

/** Human-readable label for a visibility option. */
export function visibilityLabel(visibility: ComposeVisibility): string {
	switch (visibility) {
		case 'public':
			return 'Public';
		case 'unlisted':
			return 'Unlisted';
		case 'private':
			return 'Followers only';
		case 'direct':
			return 'Direct';
	}
}

/**
 * Credential-expiry primitives shared by the transport adapters.
 *
 * Lesser v1.5.33 re-checks credential expiry when each `subscribe` operation
 * starts and answers an expired credential with a graphql-ws Error frame
 * carrying `extensions.code = "TOKEN_EXPIRED"`. Expiry is not re-checked while
 * an established subscription is delivering, so the only moment a client sees
 * this code is at (re)subscribe time.
 *
 * Connection rows persisted before expiry persistence existed fail closed once
 * and self-heal on the next reconnect, so a single refresh-and-reconnect is the
 * correct response — not a retry loop.
 *
 * Security posture: an expiry signal is never swallowed. When the consuming app
 * has supplied no refresh callback, the adapters surface a terminal, typed
 * {@link AuthExpiredError} instead of silently churning reconnects.
 */

/** Server-defined code for an expired credential at subscribe time. */
export const AUTH_EXPIRED_CODE = 'TOKEN_EXPIRED';

/** Server-defined code for an unauthenticated principal on a gated operation. */
export const UNAUTHENTICATED_CODE = 'UNAUTHENTICATED';

/**
 * Supplies a fresh credential when the server reports the current one expired.
 *
 * Returning `null`/`undefined` (or throwing) means the app could not refresh;
 * the adapter then reports terminal auth expiry rather than reconnecting with a
 * credential already known to be stale.
 */
export type TokenRefreshCallback = () =>
	Promise<string | null | undefined> | string | null | undefined;

/** Notified when auth expiry is terminal for this transport. */
export type AuthExpiredHandler = (error: AuthExpiredError) => void;

/** Why an auth-expiry condition became terminal. */
export type AuthExpiredReason =
	/** The server reported expiry and no refresh callback was configured. */
	| 'no-refresh-callback'
	/** The refresh callback threw. */
	| 'refresh-failed'
	/** The refresh callback resolved without a usable credential. */
	| 'refresh-empty'
	/**
	 * Consecutive refreshes each produced a credential the server refused in
	 * turn, so automatic recovery is spent. Something upstream is handing out
	 * credentials this server will not accept — clock skew, an inconsistent auth
	 * node, or a refresh service minting already-expired ones.
	 */
	| 'recovery-exhausted';

/**
 * Terminal, typed auth-expiry error.
 *
 * Carries no credential material: only the server code and the reason the
 * condition could not be recovered.
 */
export class AuthExpiredError extends Error {
	readonly code = AUTH_EXPIRED_CODE;
	readonly reason: AuthExpiredReason;

	constructor(reason: AuthExpiredReason, options: { cause?: unknown } = {}) {
		super(
			authExpiredMessage(reason),
			options.cause === undefined ? undefined : { cause: options.cause }
		);
		this.name = 'AuthExpiredError';
		this.reason = reason;
	}
}

function authExpiredMessage(reason: AuthExpiredReason): string {
	switch (reason) {
		case 'no-refresh-callback':
			return 'Your session expired and no token refresh handler is configured. Sign in again to continue.';
		case 'refresh-failed':
			return 'Your session expired and refreshing it failed. Sign in again to continue.';
		case 'refresh-empty':
			return 'Your session expired and no new credential was available. Sign in again to continue.';
		case 'recovery-exhausted':
			return 'Your session expired repeatedly and could not be renewed. Sign in again to continue.';
	}
}

interface GraphQLErrorLike {
	extensions?: unknown;
}

function codeFromExtensions(extensions: unknown): string | null {
	if (!extensions || typeof extensions !== 'object') {
		return null;
	}
	const code = (extensions as Record<string, unknown>)['code'];
	return typeof code === 'string' && code.length > 0 ? code : null;
}

function collectFromErrorList(value: unknown, into: Set<string>): void {
	if (!Array.isArray(value)) {
		return;
	}
	for (const entry of value) {
		if (!entry || typeof entry !== 'object') {
			continue;
		}
		const code = codeFromExtensions((entry as GraphQLErrorLike).extensions);
		if (code) {
			into.add(code);
		}
	}
}

/**
 * Collects server-defined `extensions.code` values from the shapes Apollo and
 * graphql-ws surface: `CombinedGraphQLErrors`, a raw execution result, a
 * `graphQLErrors` array, and a nested `networkError.result`.
 *
 * Only the code enum is read. Messages and payloads are deliberately ignored so
 * callers cannot leak server detail through this path.
 */
export function extractServerErrorCodes(source: unknown): string[] {
	const codes = new Set<string>();
	const seen = new Set<unknown>();

	const walk = (value: unknown, depth: number): void => {
		if (!value || typeof value !== 'object' || depth > 4 || seen.has(value)) {
			return;
		}
		seen.add(value);

		if (Array.isArray(value)) {
			collectFromErrorList(value, codes);
			return;
		}

		const record = value as Record<string, unknown>;

		// A bare graphql-ws / GraphQL error object.
		const direct = codeFromExtensions(record['extensions']);
		if (direct) {
			codes.add(direct);
		}

		collectFromErrorList(record['errors'], codes);
		collectFromErrorList(record['graphQLErrors'], codes);

		// A graphql-ws Error frame carries its GraphQLError list under
		// `payload`; a Next frame carries an execution result there.
		walk(record['payload'], depth + 1);
		walk(record['result'], depth + 1);
		walk(record['networkError'], depth + 1);
		walk(record['cause'], depth + 1);
	};

	walk(source, 0);
	return [...codes];
}

/** True when the error carries the given server code. */
export function hasServerErrorCode(source: unknown, code: string): boolean {
	return extractServerErrorCodes(source).includes(code);
}

/** True when the error is Lesser's subscribe-time credential-expiry signal. */
export function isAuthExpiredError(source: unknown): boolean {
	if (source instanceof AuthExpiredError) {
		return true;
	}
	return hasServerErrorCode(source, AUTH_EXPIRED_CODE);
}

/**
 * The credential clock that decides which expiry signals belong to the same
 * failure episode.
 *
 * An episode is one expiry condition and the single recovery attempted for it:
 * at most one refresh and at most one reconnect. The hard part is deciding
 * which refusals are that one condition, because a single expired credential
 * produces a burst of them — one per operation the socket was carrying — spread
 * across the refresh and the reconnect that answer it.
 *
 * Ownership is therefore scoped to the *credential*, not to an error object and
 * not to a single operation. Every credential in force has a generation number;
 * every subscribe frame is issued under the generation current at the time it
 * was forwarded. A generation may drive exactly one refresh, ever, and a
 * successful refresh installs the next generation, which arms the next one.
 * A refusal carrying a superseded generation is the tail of an episode that has
 * already been recovered, so it is re-issued rather than refreshed for.
 *
 * That last rule is what makes a restored sibling safe. graphql-ws re-subscribes
 * the operations that were still active when the socket dropped, and Lesser can
 * still refuse one of those on the fresh socket — a connection row persisted
 * before expiry persistence existed fails closed exactly once and self-heals on
 * reconnect. Keying on the error object cannot see that: the sibling's refusal
 * is a brand-new object from a brand-new frame, and treating it as a new
 * condition costs a second refresh and a second `terminate()` that drops every
 * healthy subscription. Keying on the generation the operation was issued under
 * reads it correctly, as the end of the episode that already ran.
 */
export interface CredentialGenerations {
	/** The generation of the credential currently in force. */
	current(): number;

	/** Puts a freshly obtained credential in force and returns its generation. */
	advance(): number;

	/**
	 * Claims the single refresh `generation` is allowed to drive.
	 *
	 * False means no refresh may be driven for it: either the claim is already
	 * spent, or the generation has been superseded and its recovery has happened.
	 */
	claimRefresh(generation: number): boolean;
}

/** Creates a credential clock scoped to one client instance. */
export function createCredentialGenerations(): CredentialGenerations {
	let generation = 0;
	/** The newest generation whose one refresh has been claimed. */
	let claimed: number | null = null;

	return {
		current(): number {
			return generation;
		},

		advance(): number {
			generation += 1;
			return generation;
		},

		claimRefresh(target: number): boolean {
			// Only the credential actually in force may open an episode. An older
			// generation has already been replaced — the episode that replaced it
			// is the recovery — and a generation this clock has never issued is not
			// a credential at all.
			if (target !== generation) {
				return false;
			}
			if (claimed !== null && claimed >= target) {
				return false;
			}
			claimed = target;
			return true;
		},
	};
}

/**
 * Wraps a refresh callback so concurrent expiry signals collapse into a single
 * in-flight refresh.
 *
 * Lesser rejects a duplicate `connection_init` with close code 4429, so two
 * subscriptions failing with `TOKEN_EXPIRED` at the same instant must not drive
 * two independent refresh-and-reconnect cycles. Every caller awaits the same
 * promise and the reconnect happens once.
 */
export function createSingleFlightRefresh(
	refresh: TokenRefreshCallback | undefined
): () => Promise<string> {
	let inFlight: Promise<string> | null = null;

	return () => {
		if (inFlight) {
			return inFlight;
		}

		const attempt = (async (): Promise<string> => {
			if (!refresh) {
				throw new AuthExpiredError('no-refresh-callback');
			}

			let token: string | null | undefined;
			try {
				token = await refresh();
			} catch (error) {
				throw new AuthExpiredError('refresh-failed', { cause: error });
			}

			if (typeof token !== 'string' || token.length === 0) {
				throw new AuthExpiredError('refresh-empty');
			}

			return token;
		})();

		inFlight = attempt;
		// Release the slot once settled so a later expiry can refresh again,
		// without letting a rejected refresh poison subsequent attempts.
		void attempt
			.catch(() => undefined)
			.finally(() => {
				if (inFlight === attempt) {
					inFlight = null;
				}
			});

		return attempt;
	};
}

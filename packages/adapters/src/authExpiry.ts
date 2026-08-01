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
	| Promise<string | null | undefined>
	| string
	| null
	| undefined;

/** Notified when auth expiry is terminal for this transport. */
export type AuthExpiredHandler = (error: AuthExpiredError) => void;

/** Why an auth-expiry condition became terminal. */
export type AuthExpiredReason =
	/** The server reported expiry and no refresh callback was configured. */
	| 'no-refresh-callback'
	/** The refresh callback threw. */
	| 'refresh-failed'
	/** The refresh callback resolved without a usable credential. */
	| 'refresh-empty';

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
 * Tracks which credential-expiry signals already have a recovery driven for
 * them, so two links that both see one failure do not each drive their own.
 *
 * A failure episode is one expiry condition and the single recovery attempted
 * for it: at most one refresh and at most one reconnect. greater reacts to
 * `TOKEN_EXPIRED` in two places — the re-issue link on the subscription branch,
 * which owns recovery for the operation it forwards, and the error link at the
 * top of the chain, which covers every path the re-issue link cannot see. When
 * a subscription expires a second time on the freshly refreshed credential the
 * re-issue link is right to give up and propagate loudly, but that propagated
 * failure then reaches the error link, which reads it as a new condition and
 * refreshes and terminates the socket all over again. The second re-dial drops
 * every healthy subscription in service of a credential the server has just
 * refused.
 *
 * The owner marks the signal before propagating it and the error link stands
 * down. Marks are held weakly and keyed on object identity, so a genuinely new
 * expiry — a different error object, from a later episode — is never
 * suppressed, and nothing is retained once the error is collected.
 */
export interface AuthExpiryEpisodes {
	/** Records that recovery has already been driven for this expiry signal. */
	markDriven(signal: unknown): void;
	/** True when recovery for this expiry signal has already been driven. */
	wasDriven(signal: unknown): boolean;
}

/** Creates an episode ledger scoped to one client instance. */
export function createAuthExpiryEpisodes(): AuthExpiryEpisodes {
	const driven = new WeakSet<object>();

	return {
		markDriven(signal: unknown): void {
			if (signal && typeof signal === 'object') {
				driven.add(signal);
			}
		},

		wasDriven(signal: unknown): boolean {
			// A signal marked at one link can reach the next one wrapped — under
			// `networkError`, `cause`, or an execution result. Walk the same
			// wrapper keys extractServerErrorCodes reads so the mark survives it.
			const seen = new Set<unknown>();

			const walk = (value: unknown, depth: number): boolean => {
				if (!value || typeof value !== 'object' || depth > 4 || seen.has(value)) {
					return false;
				}
				seen.add(value);

				if (driven.has(value)) {
					return true;
				}

				if (Array.isArray(value)) {
					return value.some((entry) => walk(entry, depth + 1));
				}

				const record = value as Record<string, unknown>;
				return (
					walk(record['errors'], depth + 1) ||
					walk(record['graphQLErrors'], depth + 1) ||
					walk(record['payload'], depth + 1) ||
					walk(record['result'], depth + 1) ||
					walk(record['networkError'], depth + 1) ||
					walk(record['cause'], depth + 1)
				);
			};

			return walk(signal, 0);
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

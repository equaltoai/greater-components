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
export declare const AUTH_EXPIRED_CODE = 'TOKEN_EXPIRED';
/** Server-defined code for an unauthenticated principal on a gated operation. */
export declare const UNAUTHENTICATED_CODE = 'UNAUTHENTICATED';
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
export declare class AuthExpiredError extends Error {
	readonly code = 'TOKEN_EXPIRED';
	readonly reason: AuthExpiredReason;
	constructor(
		reason: AuthExpiredReason,
		options?: {
			cause?: unknown;
		}
	);
}
/**
 * Collects server-defined `extensions.code` values from the shapes Apollo and
 * graphql-ws surface: `CombinedGraphQLErrors`, a raw execution result, a
 * `graphQLErrors` array, and a nested `networkError.result`.
 *
 * Only the code enum is read. Messages and payloads are deliberately ignored so
 * callers cannot leak server detail through this path.
 */
export declare function extractServerErrorCodes(source: unknown): string[];
/** True when the error carries the given server code. */
export declare function hasServerErrorCode(source: unknown, code: string): boolean;
/** True when the error is Lesser's subscribe-time credential-expiry signal. */
export declare function isAuthExpiredError(source: unknown): boolean;
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
export declare function createCredentialGenerations(): CredentialGenerations;
/**
 * Wraps a refresh callback so concurrent expiry signals collapse into a single
 * in-flight refresh.
 *
 * Lesser rejects a duplicate `connection_init` with close code 4429, so two
 * subscriptions failing with `TOKEN_EXPIRED` at the same instant must not drive
 * two independent refresh-and-reconnect cycles. Every caller awaits the same
 * promise and the reconnect happens once.
 */
export declare function createSingleFlightRefresh(
	refresh: TokenRefreshCallback | undefined
): () => Promise<string>;
//# sourceMappingURL=authExpiry.d.ts.map

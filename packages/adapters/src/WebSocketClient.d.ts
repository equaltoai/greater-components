import type {
	WebSocketClientConfig,
	WebSocketClientState,
	WebSocketMessage,
	WebSocketEventHandler,
	TransportAdapter,
} from './types';
/**
 * WebSocketClient with automatic reconnection, heartbeat, and latency sampling
 */
export declare class WebSocketClient implements TransportAdapter<WebSocketClientState> {
	private config;
	private socket;
	/**
	 * The listeners bound to {@link socket}, kept so they can actually be
	 * detached. `handler.bind(this)` allocates a fresh function every call, so
	 * removing by re-binding removes nothing.
	 */
	private socketListeners;
	private state;
	private eventHandlers;
	private reconnectTimer;
	private heartbeatTimer;
	private heartbeatTimeoutTimer;
	private latencySamplingTimer;
	private latencySamples;
	private pendingPings;
	private isDestroyed;
	private isExplicitDisconnect;
	private readonly logger;
	/**
	 * Live credential. Seeded from config and replaced on refresh so a
	 * reconnect never re-presents a credential the server already rejected.
	 */
	private authToken;
	private readonly refreshAuthToken;
	private readonly onAuthExpired;
	/**
	 * Suppresses ordinary reconnect scheduling for the whole auth-recovery
	 * window — the refresh, the backoff between consecutive attempts, and the
	 * dial — so the refreshed reconnect is the only socket that opens.
	 */
	private isRecoveringAuth;
	/**
	 * Consecutive auth recoveries driven since the server last answered on the
	 * credential one of them produced.
	 *
	 * Opening another socket is not evidence of anything: the refusal arrives
	 * *after* the socket opens, so a fresh connection is exactly what a refusal
	 * loop keeps producing. Only server traffic on the new credential resets it.
	 */
	private authRecoveryAttempts;
	/** Spacing timer between consecutive auth-recovery dials. */
	private authRecoveryTimer;
	private authExpiryTerminal;
	constructor(config: WebSocketClientConfig);
	/**
	 * Connect to the WebSocket server
	 */
	connect(): void;
	/**
	 * Disconnect from the WebSocket server
	 */
	disconnect(): void;
	/**
	 * Destroy the client and cleanup all resources
	 */
	destroy(): void;
	/**
	 * Send a message through the WebSocket
	 */
	send(message: WebSocketMessage): void;
	/**
	 * Subscribe to WebSocket events
	 */
	on(event: string, handler: WebSocketEventHandler): () => void;
	/**
	 * Get the current state
	 */
	getState(): Readonly<WebSocketClientState>;
	/**
	 * Get average latency from recent samples
	 */
	getAverageLatency(): number | null;
	/**
	 * Binds the lifecycle listeners to the socket that is current *right now*.
	 *
	 * Two independent defences keep a superseded socket from reaching into the
	 * live connection — a real hazard on the refresh-and-reconnect path, where
	 * the refused socket is dropped while its `close` is still in flight and
	 * would otherwise run {@link handleClose} against its replacement:
	 *
	 * 1. The bound functions are retained, so {@link detachSocketListeners}
	 *    genuinely removes them.
	 * 2. Every listener re-checks socket identity before doing anything, so an
	 *    event that was already queued — or that an environment delivers after
	 *    removal — is dropped instead of acting on the current socket.
	 */
	private setupEventListeners;
	/** Detaches the listeners bound by {@link setupEventListeners}, if any. */
	private detachSocketListeners;
	private handleOpen;
	private handleClose;
	private handleError;
	private handleMessage;
	private startHeartbeat;
	private stopHeartbeat;
	private handlePong;
	private startLatencySampling;
	private stopLatencySampling;
	private addLatencySample;
	/**
	 * Refreshes the credential and reconnects once.
	 *
	 * Credential expiry is not a transport fault, so this deliberately does not
	 * consume a reconnect attempt: the connection was healthy and the server
	 * asked for re-authentication. Concurrent expiry signals collapse into one
	 * refresh (see {@link createSingleFlightRefresh}) so only a single socket —
	 * and therefore a single `connection_init` — is ever opened; Lesser rejects
	 * a duplicate init with close code 4429.
	 *
	 * With no refresh callback configured this is terminal and loud: the client
	 * stops reconnecting and emits a typed {@link AuthExpiredError}.
	 *
	 * Recovery is bounded by its own budget rather than by the reconnect budget.
	 * Not consuming a reconnect attempt is deliberate — the connection was
	 * healthy and the server asked for re-authentication — but it also means
	 * nothing else stops this path, and a server that refuses every newly minted
	 * credential would otherwise be answered forever. So consecutive recoveries
	 * are counted, spaced, and capped at {@link MAX_AUTH_RECOVERY_ATTEMPTS};
	 * exhausting the budget is terminal and typed, never silent.
	 */
	private handleAuthExpired;
	/**
	 * How long to wait before the dial that presents a freshly refreshed
	 * credential.
	 *
	 * The first recovery is immediate: one credential expiring and one refresh
	 * answering it is the ordinary case, and delaying it would delay every
	 * routine renewal. A second refusal on a credential minted seconds ago is
	 * not ordinary, so consecutive recoveries back off on the transport's own
	 * curve — the same exponential-with-jitter shape as
	 * {@link scheduleReconnect}, kept separate so neither budget spends the
	 * other's.
	 */
	private authRecoveryDelay;
	/**
	 * Ends the auth-recovery window: no dial is pending and ordinary reconnect
	 * scheduling is free again.
	 *
	 * The streak count is deliberately left alone. It is reset only by evidence
	 * that the credential is accepted, or by the app disconnecting explicitly.
	 */
	private cancelAuthRecovery;
	/**
	 * Enters the terminal auth-expiry state: stop reconnecting, record the
	 * typed error, and tell the app. Silence here would look like an ordinary
	 * disconnect and hide an expired session.
	 */
	private failAuthExpiryTerminally;
	private scheduleReconnect;
	private cleanup;
	private setState;
	private resolveError;
	private emit;
	private loadLastEventId;
	private saveLastEventId;
}
//# sourceMappingURL=WebSocketClient.d.ts.map

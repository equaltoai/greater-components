/**
 * Transport layer for real-time communication with fediverse servers
 * Supports WebSocket streaming, Server-Sent Events, and polling fallbacks
 */

import type { AIAnalysis, Notification, QuoteContext, Status } from '../types';
import type { Conversation, DirectMessage } from '@equaltoai/greater-components-messaging';
import type { ListData } from '../components/Lists/context.js';
import type { ProfileRelationship } from '../components/Profile/context.js';

type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
type TimelineStreamType = 'public' | 'home' | 'local' | 'direct' | 'list' | 'hashtag';

export interface TimelineUpdatePayload {
	stream: TimelineStreamType;
	status: Status;
	cursor?: string | null;
}

export interface ConversationUpdatePayload {
	conversation: Conversation;
	message?: DirectMessage;
	action: 'created' | 'updated' | 'deleted';
}

export interface ListUpdatePayload {
	list: ListData;
	action: 'created' | 'updated' | 'deleted';
	status?: Status;
}

export interface ActivityStreamPayload {
	activityType: string;
	actorId: string;
	objectId?: string;
	data?: Record<string, unknown>;
	stream?: string;
}

export interface RelationshipUpdatePayload {
	actorId: string;
	relationship: ProfileRelationship;
	type: 'follow' | 'unfollow' | 'block' | 'unblock' | 'mute' | 'unmute' | 'update';
	timestamp: string;
}

export interface QuoteActivityPayload {
	quoteId: string;
	quoteStatus: Status;
	originalStatus: Status;
	context?: QuoteContext;
}

export interface HashtagActivityPayload {
	hashtag: string;
	status: Status;
	metrics?: {
		favourites: number;
		reblogs: number;
		replies: number;
	};
}

export interface TrustUpdatePayload {
	edgeId: string;
	fromActorId: string;
	toActorId: string;
	score: number;
	previousScore?: number;
	category?: string;
	updatedAt: string;
}

export interface ModerationEventPayload {
	id: string;
	type: string;
	severity: SeverityLevel;
	targetId?: string;
	context?: string;
	timestamp: string;
}

export interface ModerationAlertPayload extends ModerationEventPayload {
	suggestedAction?: string;
	handled?: boolean;
}

export interface ModerationQueuePayload {
	queueId: string;
	pendingCount: number;
	nextItemId?: string;
}

export interface ThreatIntelligencePayload {
	id: string;
	threatType: string;
	severity: SeverityLevel;
	source: string;
	description: string;
	affectedInstances?: string[];
	mitigationSteps?: string[];
	timestamp: string;
}

export interface CostUpdatePayload {
	id: string;
	operation: string;
	costUSD: number;
	timestamp: string;
	breakdown?: Record<string, number>;
}

export interface CostAlertPayload {
	id: string;
	thresholdUSD: number;
	actualUSD: number;
	timestamp: string;
	message?: string;
}

export interface BudgetAlertPayload {
	id: string;
	domain: string;
	budgetUSD: number;
	spentUSD: number;
	percentUsed: number;
	timestamp: string;
}

export interface MetricsUpdatePayload {
	metricId: string;
	serviceName: string;
	metricType: string;
	timestamp: string;
	count?: number;
	average?: number;
	unit?: string;
	dimensions?: Array<{ key: string; value: string }>;
}

export interface PerformanceAlertPayload {
	id: string;
	service: string;
	metric: string;
	threshold: number;
	value: number;
	severity: SeverityLevel;
	timestamp: string;
}

export interface FederationHealthPayload {
	domain: string;
	previousStatus: string;
	currentStatus: string;
	timestamp: string;
	issues?: Array<{
		type: string;
		severity: SeverityLevel | string;
		description: string;
		impact?: string;
		detectedAt?: string;
	}>;
}

export interface InfrastructureEventPayload {
	id: string;
	type: string;
	service: string;
	description: string;
	impact?: string;
	timestamp: string;
}

export interface TransportLogger {
	debug?(message: string, context?: unknown): void;
	error?(message: string, error?: unknown): void;
}

export interface TransportConfig {
	baseUrl: string;
	accessToken?: string;
	protocol: 'websocket' | 'sse' | 'polling';
	reconnectInterval?: number;
	maxReconnectAttempts?: number;
	pollInterval?: number;
	logger?: TransportLogger;
}

type ResolvedTransportConfig = TransportConfig & {
	reconnectInterval: number;
	maxReconnectAttempts: number;
	pollInterval: number;
};

type KnownStreamingMessage =
	| { event: 'update'; payload: Status; stream?: string }
	| { event: 'delete'; payload: string; stream?: string }
	| { event: 'notification'; payload: Notification; stream?: string };

type UnknownStreamingMessage = {
	event: Exclude<string, KnownStreamingMessage['event']>;
	payload?: unknown;
	stream?: string;
};

export type StreamingMessage = KnownStreamingMessage | UnknownStreamingMessage;

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null;

const hasStringId = (value: unknown): value is { id: string } => {
	if (!isRecord(value)) {
		return false;
	}
	const id = value['id'];
	return typeof id === 'string';
};

const isStatusPayload = (payload: unknown): payload is Status =>
	hasStringId(payload) && 'account' in payload;

const isNotificationPayload = (payload: unknown): payload is Notification =>
	hasStringId(payload) && 'type' in payload;

type TransportEventHandler<T extends TransportEventType> = (data: TransportEventMap[T]) => void;
type HandlerEntry<T extends TransportEventType = TransportEventType> = Set<
	TransportEventHandler<T>
>;

export interface TransportEventMap {
	// Core events
	'status.update': Status;
	'status.delete': { id: string };
	'notification.new': Notification;
	'notification.update': Notification;
	'connection.open': void;
	'connection.close': void;
	'connection.error': Error;
	'connection.reconnecting': { attempt: number };

	// Lesser Timeline & Social events
	'timeline.update': TimelineUpdatePayload;
	'conversation.update': ConversationUpdatePayload;
	'list.update': ListUpdatePayload;
	'activity.stream': ActivityStreamPayload;
	'relationship.update': RelationshipUpdatePayload;

	// Lesser Quote Posts events
	'quote.activity': QuoteActivityPayload;

	// Lesser Hashtag events
	'hashtag.activity': HashtagActivityPayload;

	// Lesser Trust & Moderation events
	'trust.update': TrustUpdatePayload;
	'moderation.event': ModerationEventPayload;
	'moderation.alert': ModerationAlertPayload;
	'moderation.queue': ModerationQueuePayload;
	'threat.intelligence': ThreatIntelligencePayload;

	// Lesser AI Analysis events
	'ai.analysis': AIAnalysis;

	// Lesser Cost & Budget events
	'cost.update': CostUpdatePayload;
	'cost.alert': CostAlertPayload;
	'budget.alert': BudgetAlertPayload;

	// Lesser Metrics & Performance events
	'metrics.update': MetricsUpdatePayload;
	'performance.alert': PerformanceAlertPayload;

	// Lesser Federation & Infrastructure events
	'federation.health': FederationHealthPayload;
	'infrastructure.event': InfrastructureEventPayload;
}

export type TransportEventType = keyof TransportEventMap;

const noop = (): void => undefined;

const defaultLogger: Required<TransportLogger> = {
	debug: noop,
	error: noop,
};

export class TransportManager {
	private readonly config: ResolvedTransportConfig;
	private readonly logger: Required<TransportLogger>;
	private connection: WebSocket | EventSource | null = null;
	private readonly eventHandlers = new Map<TransportEventType, HandlerEntry>();
	private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
	private reconnectAttempts = 0;
	private isConnected = false;
	private pollTimer: ReturnType<typeof setInterval> | null = null;
	private lastNotificationId?: string;
	private lastStatusId?: string;

	constructor(config: TransportConfig) {
		this.config = {
			reconnectInterval: 5000,
			maxReconnectAttempts: 10,
			pollInterval: 30000,
			...config,
		};

		this.logger = {
			...defaultLogger,
			...(config.logger ?? {}),
		};
	}

	/**
	 * Connect to the streaming endpoint
	 */
	async connect(): Promise<void> {
		if (this.isConnected) {
			return;
		}

		try {
			switch (this.config.protocol) {
				case 'websocket':
					await this.connectWebSocket();
					break;
				case 'sse':
					await this.connectServerSentEvents();
					break;
				case 'polling':
					await this.connectPolling();
					break;
				default:
					throw new Error(`Unsupported protocol: ${this.config.protocol}`);
			}
		} catch (error) {
			const resolvedError = this.toError(error, 'Transport connection error');
			this.emit('connection.error', resolvedError);
			this.scheduleReconnect();
		}
	}

	/**
	 * Disconnect from the streaming endpoint
	 */
	disconnect(): void {
		this.isConnected = false;
		this.reconnectAttempts = 0;

		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = null;
		}

		if (this.pollTimer) {
			clearInterval(this.pollTimer);
			this.pollTimer = null;
		}

		if (this.connection) {
			if (this.connection instanceof WebSocket) {
				this.connection.close();
			} else if (this.connection instanceof EventSource) {
				this.connection.close();
			}
			this.connection = null;
		}

		this.emit('connection.close', undefined as TransportEventMap['connection.close']);
	}

	/**
	 * Subscribe to timeline streaming
	 */
	subscribeToTimeline(type: 'public' | 'home' | 'local' = 'public'): void {
		if (!this.isConnected) {
			throw new Error('Transport not connected');
		}

		if (this.connection instanceof WebSocket && this.connection.readyState === WebSocket.OPEN) {
			this.connection.send(
				JSON.stringify({
					type: 'subscribe',
					stream: type,
				})
			);
		}
	}

	/**
	 * Subscribe to notification streaming
	 */
	subscribeToNotifications(): void {
		if (!this.isConnected) {
			throw new Error('Transport not connected');
		}

		if (this.connection instanceof WebSocket && this.connection.readyState === WebSocket.OPEN) {
			this.connection.send(
				JSON.stringify({
					type: 'subscribe',
					stream: 'user',
				})
			);
		}
	}

	/**
	 * Subscribe to hashtag timeline
	 */
	subscribeToHashtag(hashtags: string[]): void {
		if (!this.isConnected) {
			throw new Error('Transport not connected');
		}

		if (this.connection instanceof WebSocket && this.connection.readyState === WebSocket.OPEN) {
			this.connection.send(
				JSON.stringify({
					type: 'subscribe',
					stream: 'hashtag',
					hashtags,
				})
			);
		}
	}

	/**
	 * Subscribe to list timeline
	 */
	subscribeToList(listId: string): void {
		if (!this.isConnected) {
			throw new Error('Transport not connected');
		}

		if (this.connection instanceof WebSocket && this.connection.readyState === WebSocket.OPEN) {
			this.connection.send(
				JSON.stringify({
					type: 'subscribe',
					stream: 'list',
					listId,
				})
			);
		}
	}

	/**
	 * Subscribe to admin events
	 */
	subscribeToAdminEvents(eventTypes?: string[]): void {
		if (!this.isConnected) {
			throw new Error('Transport not connected');
		}

		if (this.connection instanceof WebSocket && this.connection.readyState === WebSocket.OPEN) {
			this.connection.send(
				JSON.stringify({
					type: 'subscribe',
					stream: 'admin',
					eventTypes,
				})
			);
		}
	}

	/**
	 * Add event listener
	 */
	on<T extends TransportEventType>(event: T, handler: TransportEventHandler<T>): void {
		const handlers =
			(this.eventHandlers.get(event) as HandlerEntry<T> | undefined) ??
			new Set<TransportEventHandler<T>>();
		handlers.add(handler);
		this.eventHandlers.set(event, handlers as HandlerEntry);
	}

	/**
	 * Remove event listener
	 */
	off<T extends TransportEventType>(event: T, handler: TransportEventHandler<T>): void {
		const handlers = this.eventHandlers.get(event) as HandlerEntry<T> | undefined;
		if (handlers) {
			handlers.delete(handler);
			if (handlers.size === 0) {
				this.eventHandlers.delete(event);
			}
		}
	}

	/**
	 * Emit event to all listeners
	 */
	private emit<T extends TransportEventType>(event: T, data: TransportEventMap[T]): void {
		const handlers = this.eventHandlers.get(event) as HandlerEntry<T> | undefined;
		if (!handlers) {
			return;
		}

		handlers.forEach((handler) => {
			try {
				handler(data);
			} catch (error) {
				this.logger.error(`Error in ${event} handler`, error);
			}
		});
	}

	/**
	 * Connect via WebSocket
	 */
	private async connectWebSocket(): Promise<void> {
		const wsUrl = new URL('/api/v1/streaming', this.config.baseUrl);
		wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';

		if (this.config.accessToken) {
			wsUrl.searchParams.set('access_token', this.config.accessToken);
		}

		const ws = new WebSocket(wsUrl.toString());

		return new Promise((resolve, reject) => {
			const timeoutId = setTimeout(() => {
				ws.close();
				reject(new Error('WebSocket connection timeout'));
			}, 10000);

			ws.onopen = () => {
				clearTimeout(timeoutId);
				this.connection = ws;
				this.isConnected = true;
				this.reconnectAttempts = 0;
				this.emit('connection.open', undefined as TransportEventMap['connection.open']);
				resolve();
			};

			ws.onmessage = (event) => {
				const message = this.parseStreamingMessage(event.data);
				if (!message) {
					this.logger.debug('Discarded WebSocket message', event.data);
					return;
				}
				this.handleStreamingMessage(message);
			};

			ws.onclose = (event) => {
				clearTimeout(timeoutId);
				this.isConnected = false;
				this.connection = null;

				if (event.code !== 1000) {
					this.scheduleReconnect();
				} else {
					this.emit('connection.close', undefined as TransportEventMap['connection.close']);
				}
			};

			ws.onerror = (event) => {
				clearTimeout(timeoutId);
				const errorInstance = new Error('WebSocket error');
				this.logger.error('WebSocket error event', event);
				this.emit('connection.error', errorInstance);
				reject(errorInstance);
			};
		});
	}

	/**
	 * Connect via Server-Sent Events
	 */
	private async connectServerSentEvents(): Promise<void> {
		const sseUrl = new URL('/api/v1/streaming/public', this.config.baseUrl);

		if (this.config.accessToken) {
			sseUrl.searchParams.set('access_token', this.config.accessToken);
		}

		const eventSource = new EventSource(sseUrl.toString());

		return new Promise((resolve, reject) => {
			const timeoutId = setTimeout(() => {
				eventSource.close();
				reject(new Error('SSE connection timeout'));
			}, 10000);

			eventSource.onopen = () => {
				clearTimeout(timeoutId);
				this.connection = eventSource;
				this.isConnected = true;
				this.reconnectAttempts = 0;
				this.emit('connection.open', undefined as TransportEventMap['connection.open']);
				resolve();
			};

			eventSource.onmessage = (event) => {
				const message = this.parseStreamingMessage(event.data);
				if (!message) {
					this.logger.debug('Discarded SSE message', event.data);
					return;
				}
				this.handleStreamingMessage(message);
			};

			eventSource.onerror = (event) => {
				clearTimeout(timeoutId);
				this.isConnected = false;
				this.connection = null;
				const errorInstance = new Error('SSE error');
				this.logger.error('SSE error event', event);
				this.emit('connection.error', errorInstance);
				this.scheduleReconnect();
				reject(errorInstance);
			};
		});
	}

	/**
	 * Connect via polling
	 */
	private async connectPolling(): Promise<void> {
		this.isConnected = true;
		this.reconnectAttempts = 0;
		this.emit('connection.open', undefined as TransportEventMap['connection.open']);

		this.pollTimer = setInterval(() => {
			void this.pollForUpdates();
		}, this.config.pollInterval);
	}

	/**
	 * Poll for updates (fallback method)
	 */
	private async pollForUpdates(): Promise<void> {
		try {
			await this.pollTimeline();
			await this.pollNotifications();
		} catch (error) {
			const resolvedError = this.toError(error, 'Polling error');
			this.logger.error('Polling error', resolvedError);
			this.emit('connection.error', resolvedError);
		}
	}

	/**
	 * Poll timeline for new statuses
	 */
	private async pollTimeline(): Promise<void> {
		const url = new URL('/api/v1/timelines/public', this.config.baseUrl);

		if (this.lastStatusId) {
			url.searchParams.set('since_id', this.lastStatusId);
		}

		const headers: Record<string, string> = {};
		if (this.config.accessToken) {
			headers['Authorization'] = `Bearer ${this.config.accessToken}`;
		}

		const response = await fetch(url.toString(), { headers });

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const statuses = (await response.json()) as Status[];

		statuses.reverse().forEach((status) => {
			this.emit('status.update', status);
			this.lastStatusId = status.id;
		});
	}

	/**
	 * Poll notifications for updates
	 */
	private async pollNotifications(): Promise<void> {
		const url = new URL('/api/v1/notifications', this.config.baseUrl);

		if (this.lastNotificationId) {
			url.searchParams.set('since_id', this.lastNotificationId);
		}

		const headers: Record<string, string> = {};
		if (this.config.accessToken) {
			headers['Authorization'] = `Bearer ${this.config.accessToken}`;
		}

		const response = await fetch(url.toString(), { headers });

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const notifications = (await response.json()) as Notification[];

		notifications.reverse().forEach((notification) => {
			this.emit('notification.new', notification);
			this.lastNotificationId = notification.id;
		});
	}

	/**
	 * Handle incoming streaming messages
	 */
	private handleStreamingMessage(message: StreamingMessage): void {
		switch (message.event) {
			case 'update':
				if (isStatusPayload(message.payload)) {
					this.emit('status.update', message.payload);
				} else if (message.payload !== undefined) {
					this.logger.debug('Discarding update message with unexpected payload', message.payload);
				}
				break;
			case 'delete':
				if (typeof message.payload === 'string' && message.payload.length > 0) {
					this.emit('status.delete', { id: message.payload });
				} else if (message.payload !== undefined) {
					this.logger.debug('Discarding delete message with unexpected payload', message.payload);
				}
				break;
			case 'notification':
				if (isNotificationPayload(message.payload)) {
					this.emit('notification.new', message.payload);
				} else if (message.payload !== undefined) {
					this.logger.debug('Discarding notification with unexpected payload', message.payload);
				}
				break;
			default:
				this.logger.debug('Unhandled streaming event', message);
				break;
		}
	}

	/**
	 * Schedule reconnection attempt
	 */
	private scheduleReconnect(): void {
		if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
			this.logger.error('Max reconnection attempts reached');
			return;
		}

		this.reconnectAttempts += 1;
		this.emit('connection.reconnecting', { attempt: this.reconnectAttempts });

		this.reconnectTimer = setTimeout(() => {
			void this.connect();
		}, this.config.reconnectInterval);
	}

	/**
	 * Parse streaming message payload
	 */
	private parseStreamingMessage(raw: unknown): StreamingMessage | null {
		let payloadString: string;

		if (typeof raw === 'string') {
			payloadString = raw;
		} else if (raw instanceof ArrayBuffer) {
			if (typeof TextDecoder === 'undefined') {
				return null;
			}
			payloadString = new TextDecoder().decode(new Uint8Array(raw));
		} else if (ArrayBuffer.isView(raw)) {
			if (typeof TextDecoder === 'undefined') {
				return null;
			}
			payloadString = new TextDecoder().decode(raw);
		} else if (typeof Blob !== 'undefined' && raw instanceof Blob) {
			// Blobs are uncommon in this context; skip parsing to avoid async reader here.
			return null;
		} else {
			return null;
		}

		try {
			const parsed = JSON.parse(payloadString) as Record<string, unknown>;
			if (!parsed || typeof parsed !== 'object') {
				return null;
			}

			const { event, payload, stream } = parsed;
			if (typeof event !== 'string') {
				return null;
			}

			if (event === 'update' && payload && typeof payload === 'object') {
				return {
					event: 'update',
					payload: payload as Status,
					stream: typeof stream === 'string' ? stream : undefined,
				};
			}

			if (event === 'delete' && typeof payload === 'string') {
				return {
					event: 'delete',
					payload,
					stream: typeof stream === 'string' ? stream : undefined,
				};
			}

			if (event === 'notification' && payload && typeof payload === 'object') {
				return {
					event: 'notification',
					payload: payload as Notification,
					stream: typeof stream === 'string' ? stream : undefined,
				};
			}

			return {
				event,
				payload,
				stream: typeof stream === 'string' ? stream : undefined,
			};
		} catch (error) {
			this.logger.error('Failed to parse streaming message', error);
			return null;
		}
	}

	private toError(error: unknown, fallback: string): Error {
		if (error instanceof Error) {
			return error;
		}

		if (typeof error === 'string') {
			return new Error(error);
		}

		return new Error(fallback);
	}

	/**
	 * Get connection status
	 */
	get connected(): boolean {
		return this.isConnected;
	}

	/**
	 * Get current configuration
	 */
	get configuration(): TransportConfig {
		return { ...this.config };
	}
}

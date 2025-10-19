<script lang="ts">
	import { onMount } from 'svelte';
	import {
		createLesserGraphQLAdapter,
		type LesserGraphQLAdapter,
	} from '@equaltoai/greater-components-adapters';

	interface Props {
		useMockData?: boolean;
	}

	let { useMockData = false }: Props = $props();

	let graphqlAdapter = $state<LesserGraphQLAdapter | null>(null);
	type PushSubType = Awaited<ReturnType<LesserGraphQLAdapter['getPushSubscription']>>;
	let subscription = $state<PushSubType | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let registrationStatus = $state<'idle' | 'registering' | 'registered' | 'error'>('idle');
	let browserSubscription = $state<PushSubscription | null>(null);
	let vapidPublicKey = $state<string | null>(null);

	// Alert toggles
	let followAlerts = $state(true);
	let favouriteAlerts = $state(true);
	let reblogAlerts = $state(true);
	let mentionAlerts = $state(true);
	let pollAlerts = $state(true);
	let followRequestAlerts = $state(true);
	let statusAlerts = $state(true);
	let updateAlerts = $state(true);
	let adminSignUpAlerts = $state(false);
	let adminReportAlerts = $state(false);

	onMount(async () => {
		await initializeAdapter();
		await checkPushSupport();
		await loadSubscription();
	});

	async function initializeAdapter() {
		try {
			const lesserToken = useMockData ? null : localStorage.getItem('lesser_token') || null;

			if (!lesserToken && !useMockData) {
				error = 'No authentication token found. Please set lesser_token in localStorage.';
				return;
			}

			if (!useMockData && lesserToken) {
				graphqlAdapter = createLesserGraphQLAdapter({
					httpEndpoint: 'https://api.lesser.social/graphql',
					wsEndpoint: 'wss://api.lesser.social/graphql',
					token: lesserToken,
					debug: true,
				});

				// In a real app, fetch VAPID key from server
				vapidPublicKey = 'MOCK_VAPID_KEY_FOR_DEMO';
			}
		} catch (err) {
			console.error('Failed to initialize GraphQL adapter:', err);
			error = err instanceof Error ? err.message : 'Initialization failed';
		}
	}

	async function checkPushSupport() {
		if (
			typeof window === 'undefined' ||
			!('serviceWorker' in navigator) ||
			!('PushManager' in window)
		) {
			error = 'Push notifications are not supported in this browser';
			return false;
		}
		return true;
	}

	async function loadSubscription() {
		if (!graphqlAdapter) {
			return;
		}

		loading = true;
		error = null;

		try {
			const sub = await graphqlAdapter.getPushSubscription();
			subscription = sub;

			if (sub) {
				// Hydrate alert toggles from subscription
				followAlerts = sub.alerts.follow;
				favouriteAlerts = sub.alerts.favourite;
				reblogAlerts = sub.alerts.reblog;
				mentionAlerts = sub.alerts.mention;
				pollAlerts = sub.alerts.poll;
				followRequestAlerts = sub.alerts.followRequest;
				statusAlerts = sub.alerts.status;
				updateAlerts = sub.alerts.update;
				adminSignUpAlerts = sub.alerts.adminSignUp;
				adminReportAlerts = sub.alerts.adminReport;
				registrationStatus = 'registered';
			}
		} catch (err) {
			console.error('Failed to load subscription:', err);
			// Subscription might not exist yet, which is fine
			subscription = null;
		} finally {
			loading = false;
		}
	}

	async function registerPushNotifications() {
		if (!graphqlAdapter || !vapidPublicKey) {
			error = 'GraphQL adapter or VAPID key not available';
			return;
		}

		const supported = await checkPushSupport();
		if (!supported) {
			return;
		}

		registrationStatus = 'registering';
		error = null;

		try {
			// Request notification permission
			const permission = await Notification.requestPermission();
			if (permission !== 'granted') {
				throw new Error('Notification permission denied');
			}

			// Register service worker (in real app, this would be a proper SW file)
			const registration = await navigator.serviceWorker.register('/sw.js').catch(() => {
				// Fallback: use existing registration or create mock
				return navigator.serviceWorker.ready;
			});

			// Subscribe to push
			const pushSubscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
			});

			browserSubscription = pushSubscription;

			// Get subscription details
			const subscriptionJson = pushSubscription.toJSON();
			const keys = subscriptionJson.keys;

			if (!keys || !keys.auth || !keys.p256dh || !subscriptionJson.endpoint) {
				throw new Error('Invalid push subscription');
			}

			// Register with GraphQL API
			const registered = await graphqlAdapter.registerPushSubscription({
				endpoint: subscriptionJson.endpoint,
				keys: {
					auth: keys.auth,
					p256dh: keys.p256dh,
				},
				alerts: {
					follow: followAlerts,
					favourite: favouriteAlerts,
					reblog: reblogAlerts,
					mention: mentionAlerts,
					poll: pollAlerts,
					followRequest: followRequestAlerts,
					status: statusAlerts,
					update: updateAlerts,
					adminSignUp: adminSignUpAlerts,
					adminReport: adminReportAlerts,
				},
			});

			subscription = registered;
			registrationStatus = 'registered';
		} catch (err) {
			console.error('Failed to register push notifications:', err);
			error = err instanceof Error ? err.message : 'Registration failed';
			registrationStatus = 'error';
		}
	}

	async function updateAlertPreferences() {
		if (!graphqlAdapter || !subscription) {
			error = 'Not registered for push notifications';
			return;
		}

		loading = true;
		error = null;

		try {
			const updated = await graphqlAdapter.updatePushSubscription({
				alerts: {
					follow: followAlerts,
					favourite: favouriteAlerts,
					reblog: reblogAlerts,
					mention: mentionAlerts,
					poll: pollAlerts,
					followRequest: followRequestAlerts,
					status: statusAlerts,
					update: updateAlerts,
					adminSignUp: adminSignUpAlerts,
					adminReport: adminReportAlerts,
				},
			});

			subscription = updated;
		} catch (err) {
			console.error('Failed to update alert preferences:', err);
			error = err instanceof Error ? err.message : 'Update failed';
		} finally {
			loading = false;
		}
	}

	async function unregisterPushNotifications() {
		if (!graphqlAdapter) return;

		loading = true;
		error = null;

		try {
			// Unregister from server
			await graphqlAdapter.deletePushSubscription();

			// Unsubscribe browser subscription
			if (browserSubscription) {
				await browserSubscription.unsubscribe();
				browserSubscription = null;
			}

			subscription = null;
			registrationStatus = 'idle';
		} catch (err) {
			console.error('Failed to unregister push notifications:', err);
			error = err instanceof Error ? err.message : 'Unregister failed';
		} finally {
			loading = false;
		}
	}

	// Helper function to convert VAPID key
	function urlBase64ToUint8Array(base64String: string): Uint8Array {
		const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

		const rawData = window.atob(base64);
		const outputArray = new Uint8Array(rawData.length);

		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}
		return outputArray;
	}
</script>

<div class="push-notifications-page">
	<div class="push-container">
		<h1>Push Notifications</h1>

		<div class="status-indicator" class:registered={registrationStatus === 'registered'}>
			<strong>Status:</strong>
			{#if registrationStatus === 'idle'}
				Not registered
			{:else if registrationStatus === 'registering'}
				Registering...
			{:else if registrationStatus === 'registered'}
				✓ Registered and active
			{:else}
				Error
			{/if}
		</div>

		{#if error}
			<div class="error-banner">
				<strong>Error:</strong>
				{error}
			</div>
		{/if}

		{#if loading}
			<div class="loading">Processing...</div>
		{/if}

		{#if registrationStatus !== 'registered'}
			<div class="registration-section">
				<p>
					Enable push notifications to receive real-time updates when you're not actively using the
					app.
				</p>

				<button
					class="register-btn primary"
					onclick={registerPushNotifications}
					disabled={loading || !graphqlAdapter}
				>
					Enable Push Notifications
				</button>
			</div>
		{:else}
			<div class="alerts-section">
				<h2>Alert Preferences</h2>
				<p class="section-desc">Choose which types of notifications you want to receive</p>

				<div class="alerts-grid">
					<div class="alert-toggle">
						<label>
							<input
								type="checkbox"
								bind:checked={followAlerts}
								onchange={updateAlertPreferences}
							/>
							<div class="alert-info">
								<strong>Follows</strong>
								<span>When someone follows you</span>
							</div>
						</label>
					</div>

					<div class="alert-toggle">
						<label>
							<input
								type="checkbox"
								bind:checked={favouriteAlerts}
								onchange={updateAlertPreferences}
							/>
							<div class="alert-info">
								<strong>Favourites</strong>
								<span>When someone favourites your post</span>
							</div>
						</label>
					</div>

					<div class="alert-toggle">
						<label>
							<input
								type="checkbox"
								bind:checked={reblogAlerts}
								onchange={updateAlertPreferences}
							/>
							<div class="alert-info">
								<strong>Reblogs</strong>
								<span>When someone boosts your post</span>
							</div>
						</label>
					</div>

					<div class="alert-toggle">
						<label>
							<input
								type="checkbox"
								bind:checked={mentionAlerts}
								onchange={updateAlertPreferences}
							/>
							<div class="alert-info">
								<strong>Mentions</strong>
								<span>When someone mentions you</span>
							</div>
						</label>
					</div>

					<div class="alert-toggle">
						<label>
							<input type="checkbox" bind:checked={pollAlerts} onchange={updateAlertPreferences} />
							<div class="alert-info">
								<strong>Polls</strong>
								<span>When a poll you voted in ends</span>
							</div>
						</label>
					</div>

					<div class="alert-toggle">
						<label>
							<input
								type="checkbox"
								bind:checked={followRequestAlerts}
								onchange={updateAlertPreferences}
							/>
							<div class="alert-info">
								<strong>Follow Requests</strong>
								<span>When someone requests to follow you</span>
							</div>
						</label>
					</div>

					<div class="alert-toggle">
						<label>
							<input
								type="checkbox"
								bind:checked={statusAlerts}
								onchange={updateAlertPreferences}
							/>
							<div class="alert-info">
								<strong>New Posts</strong>
								<span>When someone you enabled notifications for posts</span>
							</div>
						</label>
					</div>

					<div class="alert-toggle">
						<label>
							<input
								type="checkbox"
								bind:checked={updateAlerts}
								onchange={updateAlertPreferences}
							/>
							<div class="alert-info">
								<strong>Post Updates</strong>
								<span>When a post you interacted with is edited</span>
							</div>
						</label>
					</div>

					<div class="alert-toggle">
						<label>
							<input
								type="checkbox"
								bind:checked={adminSignUpAlerts}
								onchange={updateAlertPreferences}
							/>
							<div class="alert-info">
								<strong>Admin: Sign-ups</strong>
								<span>When a new user signs up (admin only)</span>
							</div>
						</label>
					</div>

					<div class="alert-toggle">
						<label>
							<input
								type="checkbox"
								bind:checked={adminReportAlerts}
								onchange={updateAlertPreferences}
							/>
							<div class="alert-info">
								<strong>Admin: Reports</strong>
								<span>When a new report is filed (admin only)</span>
							</div>
						</label>
					</div>
				</div>

				<div class="danger-zone">
					<h3>Danger Zone</h3>
					<p>
						This will completely disable push notifications and remove your subscription from the
						server.
					</p>
					<button class="unregister-btn" onclick={unregisterPushNotifications} disabled={loading}>
						Disable Push Notifications
					</button>
				</div>
			</div>
		{/if}

		{#if subscription}
			<details class="subscription-details">
				<summary>Subscription Details</summary>
				<pre>{JSON.stringify(subscription, null, 2)}</pre>
			</details>
		{/if}
	</div>
</div>

<style>
	.push-notifications-page {
		min-height: 100vh;
		background: var(--gc-color-surface-100);
		padding: var(--gc-spacing-lg);
	}

	.push-container {
		max-width: 800px;
		margin: 0 auto;
		background: var(--gc-color-surface-200);
		border-radius: var(--gc-radius-lg);
		padding: var(--gc-spacing-xl);
	}

	h1 {
		margin: 0 0 var(--gc-spacing-lg) 0;
		color: var(--gc-color-text-primary);
		font-size: var(--gc-font-size-2xl);
	}

	.status-indicator {
		padding: var(--gc-spacing-md);
		border-radius: var(--gc-radius-sm);
		margin-bottom: var(--gc-spacing-lg);
		background: var(--gc-color-surface-300);
		color: var(--gc-color-text-secondary);
		border: 1px solid var(--gc-color-border-default);
	}

	.status-indicator.registered {
		background: var(--gc-color-success-100);
		color: var(--gc-color-success-700);
		border-color: var(--gc-color-success-300);
	}

	.error-banner {
		padding: var(--gc-spacing-md);
		border-radius: var(--gc-radius-sm);
		margin-bottom: var(--gc-spacing-md);
		background: var(--gc-color-error-100);
		color: var(--gc-color-error-700);
		border: 1px solid var(--gc-color-error-300);
	}

	.loading {
		padding: var(--gc-spacing-md);
		text-align: center;
		color: var(--gc-color-text-secondary);
	}

	.registration-section {
		text-align: center;
		padding: var(--gc-spacing-xl);
	}

	.registration-section p {
		margin-bottom: var(--gc-spacing-lg);
		color: var(--gc-color-text-secondary);
	}

	.register-btn {
		padding: var(--gc-spacing-md) var(--gc-spacing-lg);
		border: none;
		border-radius: var(--gc-radius-sm);
		background: var(--gc-color-primary-500);
		color: white;
		font-size: var(--gc-font-size-md);
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}

	.register-btn:hover:not(:disabled) {
		background: var(--gc-color-primary-600);
	}

	.register-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.alerts-section {
		margin-top: var(--gc-spacing-lg);
	}

	.alerts-section h2 {
		margin: 0 0 var(--gc-spacing-xs) 0;
		color: var(--gc-color-text-primary);
		font-size: var(--gc-font-size-lg);
		font-weight: 600;
	}

	.section-desc {
		margin: 0 0 var(--gc-spacing-lg) 0;
		color: var(--gc-color-text-secondary);
		font-size: var(--gc-font-size-sm);
	}

	.alerts-grid {
		display: grid;
		gap: var(--gc-spacing-sm);
	}

	.alert-toggle {
		background: var(--gc-color-surface-100);
		border: 1px solid var(--gc-color-border-default);
		border-radius: var(--gc-radius-sm);
		padding: var(--gc-spacing-md);
		transition: border-color 0.2s;
	}

	.alert-toggle:hover {
		border-color: var(--gc-color-primary-500);
	}

	.alert-toggle label {
		display: flex;
		align-items: flex-start;
		gap: var(--gc-spacing-sm);
		cursor: pointer;
	}

	.alert-toggle input[type='checkbox'] {
		width: 20px;
		height: 20px;
		margin-top: 2px;
		cursor: pointer;
		flex-shrink: 0;
	}

	.alert-info {
		flex: 1;
	}

	.alert-info strong {
		display: block;
		color: var(--gc-color-text-primary);
		font-size: var(--gc-font-size-md);
		margin-bottom: 2px;
	}

	.alert-info span {
		display: block;
		color: var(--gc-color-text-secondary);
		font-size: var(--gc-font-size-sm);
	}

	.danger-zone {
		margin-top: var(--gc-spacing-xl);
		padding: var(--gc-spacing-lg);
		background: var(--gc-color-error-50);
		border: 1px solid var(--gc-color-error-300);
		border-radius: var(--gc-radius-sm);
	}

	.danger-zone h3 {
		margin: 0 0 var(--gc-spacing-sm) 0;
		color: var(--gc-color-error-700);
		font-size: var(--gc-font-size-md);
		font-weight: 600;
	}

	.danger-zone p {
		margin: 0 0 var(--gc-spacing-md) 0;
		color: var(--gc-color-text-secondary);
		font-size: var(--gc-font-size-sm);
	}

	.unregister-btn {
		padding: var(--gc-spacing-sm) var(--gc-spacing-md);
		border: 1px solid var(--gc-color-error-500);
		border-radius: var(--gc-radius-sm);
		background: transparent;
		color: var(--gc-color-error-600);
		font-size: var(--gc-font-size-sm);
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.unregister-btn:hover:not(:disabled) {
		background: var(--gc-color-error-500);
		color: white;
	}

	.unregister-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.subscription-details {
		margin-top: var(--gc-spacing-lg);
		padding: var(--gc-spacing-md);
		background: var(--gc-color-surface-300);
		border-radius: var(--gc-radius-sm);
	}

	.subscription-details summary {
		cursor: pointer;
		font-weight: 600;
		color: var(--gc-color-text-primary);
		padding: var(--gc-spacing-sm);
	}

	.subscription-details pre {
		margin: var(--gc-spacing-md) 0 0 0;
		padding: var(--gc-spacing-md);
		background: var(--gc-color-surface-100);
		border-radius: var(--gc-radius-sm);
		overflow-x: auto;
		font-size: var(--gc-font-size-xs);
		color: var(--gc-color-text-secondary);
	}
</style>

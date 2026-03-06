<!--
Notifications.CommunicationNotificationItem - Renderer for `communication:*` notifications

Renders inbound email/SMS/voice events delivered via Lesser's notification system.
Safe by default: message previews are rendered as plain text.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { sanitizeForPreview } from '@equaltoai/greater-components-utils';

	interface CommunicationFrom {
		address: string;
		display_name?: string;
		soul_agent_id?: string;
	}

	interface CommunicationAttachment {
		id: string;
		filename: string;
		content_type: string;
		size_bytes: number;
		sha256: string;
	}

	interface CommunicationNotification {
		channel: string;
		from: CommunicationFrom;
		subject?: string;
		body?: string;
		received_at: string;
		message_id: string;
		thread_id?: string;
		in_reply_to?: string;
		to?: { address: string } | null;
		attachments?: CommunicationAttachment[];
	}

	interface LesserNotification {
		id: string;
		type: string;
		created_at: string | Date;
		read: boolean;
		communication?: CommunicationNotification | null;
	}

	interface Props {
		notification: LesserNotification;
		content?: Snippet;
		onClick?: (notification: LesserNotification) => void;
		class?: string;
	}

	let { notification, content, onClick, class: className = '' }: Props = $props();

	const comm = $derived(notification.communication ?? null);

	const channel = $derived((comm?.channel ?? '').toLowerCase());
	const iconVariant = $derived.by(() => {
		if (channel === 'email') return 'communication_email';
		if (channel === 'sms') return 'communication_sms';
		if (channel === 'voice') return 'communication_voice';
		return 'communication_inbound';
	});

	const title = $derived.by(() => {
		if (channel === 'email') return 'Inbound email';
		if (channel === 'sms') return 'Inbound SMS';
		if (channel === 'voice') return 'Voice event';
		return 'Inbound communication';
	});

	const fromLabel = $derived.by(() => {
		if (!comm) return '';
		return (comm.from.display_name || comm.from.address).trim();
	});

	const receivedAt = $derived.by(() => {
		if (!comm) return notification.created_at;
		return comm.received_at;
	});

	const bodyPreview = $derived.by(() => {
		const body = comm?.body ?? '';
		if (!body) return '';
		return sanitizeForPreview(body, 280);
	});

	const attachments = $derived(comm?.attachments ?? []);

	const iconMap: Record<string, string> = {
		communication_email:
			'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
		communication_sms:
			'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z',
		communication_voice:
			'M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.07 21 3 13.93 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.01l-2.21 2.2z',
		communication_inbound:
			'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
	};

	function formatDate(date: string | Date): string {
		const d = typeof date === 'string' ? new Date(date) : date;
		const now = Date.now();
		const diff = now - d.getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);

		if (minutes < 1) return 'just now';
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		if (days < 7) return `${days}d ago`;
		return d.toLocaleDateString();
	}

	function handleClick() {
		onClick?.(notification);
	}
</script>

{#if comm}
	<button
		class={`lesser-notification-item ${className}`}
		class:unread={!notification.read}
		type="button"
		aria-label={`${notification.type} notification`}
		onclick={handleClick}
	>
		<div class={`lesser-notification-item__icon lesser-notification-item__icon--${iconVariant}`}>
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path fill="currentColor" d={iconMap[iconVariant]} />
			</svg>
		</div>

		<div class="lesser-notification-item__content">
			{#if content}
				{@render content()}
			{:else}
				<div class="lesser-notification-item__header">
					<span class="lesser-notification-item__account">{fromLabel}</span>
					<span class="lesser-notification-item__time">{formatDate(receivedAt)}</span>
				</div>

				<div class="lesser-notification-item__body">
					<p class="lesser-notification-item__text">
						{title}
						{#if comm.from.soul_agent_id}
							<span class="communication-notification__badge">soul</span>
						{/if}
					</p>

					{#if comm.subject || bodyPreview}
						<div class="lesser-notification-item__quote">
							{#if comm.subject}
								<p class="communication-notification__subject">{comm.subject}</p>
							{/if}
							{#if bodyPreview}
								<p class="communication-notification__preview">{bodyPreview}</p>
							{/if}
						</div>
					{/if}

					{#if attachments.length}
						<div class="communication-notification__attachments">
							<strong>Attachments</strong> ({attachments.length})
							<ul class="communication-notification__attachment-list">
								{#each attachments as att (att.id)}
									<li class="communication-notification__attachment">
										<span class="communication-notification__attachment-name">{att.filename}</span>
										<span class="communication-notification__attachment-meta">
											{Math.round(att.size_bytes / 1024)} KB · {att.content_type}
										</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</button>
{/if}

<style>
	.communication-notification__badge {
		display: inline-block;
		margin-left: 0.5rem;
		font-size: 0.75rem;
		padding: 0.1rem 0.4rem;
		border-radius: 999px;
		background: var(--notification-bg-secondary, #f7f9fa);
		border: 1px solid var(--notification-border, #e1e8ed);
		color: var(--notification-text-secondary, #536471);
	}

	.communication-notification__subject {
		margin: 0 0 0.25rem;
		font-weight: 600;
	}

	.communication-notification__preview {
		margin: 0;
		color: var(--notification-text-secondary, #536471);
		white-space: pre-wrap;
	}

	.communication-notification__attachments {
		font-size: 0.875rem;
		color: var(--notification-text-secondary, #536471);
	}

	.communication-notification__attachment-list {
		margin: 0.25rem 0 0;
		padding-left: 1.25rem;
	}

	.communication-notification__attachment {
		margin: 0.15rem 0;
	}

	.communication-notification__attachment-name {
		color: var(--notification-text-primary, #0f1419);
	}

	.communication-notification__attachment-meta {
		margin-left: 0.4rem;
	}
</style>

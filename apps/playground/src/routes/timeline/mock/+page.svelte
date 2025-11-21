<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import { StatusCard } from '@equaltoai/greater-components-fediverse';
	import type { DemoPageData } from '$lib/types/demo';
	import type { Account, Status } from '@equaltoai/greater-components/fediverse/types';
	import raw from '../../../../../../sample-timeline.json' assert { type: 'json' };

	let { data }: { data: DemoPageData } = $props();

	type RawNode = {
		id: string;
		content: string;
		createdAt: string;
		visibility: string;
		sensitive?: boolean;
		spoilerText?: string | null;
		repliesCount?: number;
		likesCount?: number;
		sharesCount?: number;
		actor: {
			id?: string;
			username?: string;
			displayName?: string;
			avatar?: string | null;
		};
		boostedObject?: RawNode | null;
		inReplyTo?: { id: string; type?: string; actor?: RawNode['actor'] } | null;
		attachments?: unknown[];
		tags?: unknown[];
		mentions?: unknown[];
	};

	interface TimelineResponse {
		data?: {
			timeline?: {
				edges?: Array<{ node: RawNode }>;
			};
		};
	}

	const timelineData = raw as unknown as TimelineResponse;

	const edges: RawNode[] = timelineData?.data?.timeline?.edges?.map((edge) => edge.node) ?? [];

	const statusMap = new Map<string, Status>();

	function makeAccount(actor: RawNode['actor'] | undefined): Account {
		const username = actor?.username ?? 'unknown';
		const displayName = actor?.displayName ?? username;
		const avatar =
			actor?.avatar ??
			`https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(username)}`;

		return {
			id: actor?.id ?? username,
			username,
			acct: username,
			displayName,
			avatar,
			url: actor?.id ?? '#',
			createdAt: new Date().toISOString(),
			followersCount: 0,
			followingCount: 0,
			statusesCount: 0,
		};
	}

	function baseStatusFromNode(node: RawNode): Status {
		const account = makeAccount(node.actor);
		const url = node.id?.startsWith('http') ? node.id : `https://dev.lesser.host/status/${node.id}`;
		return {
			id: node.id,
			uri: node.id,
			url,
			account,
			content: node.content ?? '',
			createdAt: node.createdAt ?? new Date().toISOString(),
			visibility:
				(node.visibility?.toLowerCase() as Status['visibility']) ??
				('public' as Status['visibility']),
			repliesCount: node.repliesCount ?? 0,
			reblogsCount: node.sharesCount ?? 0,
			favouritesCount: node.likesCount ?? 0,
			reblogged: false,
			favourited: false,
			bookmarked: false,
			sensitive: Boolean(node.sensitive),
			spoilerText: node.spoilerText ?? undefined,
			mediaAttachments: [],
			mentions: [],
			tags: [],
			card: undefined,
			poll: undefined,
		};
	}

	// First pass: create base statuses for all nodes we know about (edges + boosted/replied objects)
	function ensureStatus(node: RawNode | undefined | null): Status | undefined {
		if (!node || !node.id) return undefined;
		if (statusMap.has(node.id)) return statusMap.get(node.id);
		const status = baseStatusFromNode(node);
		statusMap.set(node.id, status);
		return status;
	}

	edges.forEach((node) => {
		ensureStatus(node);
		ensureStatus(node.boostedObject ?? null);
		if (node.inReplyTo?.actor) {
			// create a minimal parent shell if present
			ensureStatus({
				id: node.inReplyTo.id,
				content: '',
				createdAt: node.createdAt,
				visibility: 'PUBLIC',
				actor: node.inReplyTo.actor,
				url: node.inReplyTo.id?.startsWith('http')
					? node.inReplyTo.id
					: `https://dev.lesser.host/status/${node.inReplyTo.id}`,
			});
		}
	});

	// Second pass: wire boosts and replies
	edges.forEach((node) => {
		const status = statusMap.get(node.id);
		if (!status) return;

		if (node.boostedObject?.id) {
			status.reblog = statusMap.get(node.boostedObject.id);
		}

		if (node.inReplyTo?.id) {
			status.inReplyToId = node.inReplyTo.id;
			const parent = statusMap.get(node.inReplyTo.id);
			if (parent) {
				status.inReplyToStatus = parent;
				status.inReplyToAccount = parent.account;
				status.inReplyToAccountId = parent.account.id;
			} else if (node.inReplyTo.actor) {
				const parentAccount = makeAccount(node.inReplyTo.actor);
				status.inReplyToAccount = parentAccount;
				status.inReplyToAccountId = parentAccount.id;
			}
		}
	});

	const statuses: Status[] = edges
		.map((node) => statusMap.get(node.id))
		.filter((s): s is Status => Boolean(s))
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
</script>

<DemoPage {data}>
	<div class="demo">
		<p class="lead">
			This page renders replies and boosts using the checked-in <code>sample-timeline.json</code>
			(no live network). Use it to verify that reply banners, reply hydration, and boost indicators render
			as expected.
		</p>

		<div class="timeline">
			{#each statuses as status (status.id)}
				<StatusCard {status} showActions={false} class="demo-status" />
			{/each}
		</div>
	</div>
</DemoPage>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.lead {
		margin: 0;
		color: var(--gr-color-gray-700);
	}

	.timeline {
		border: 1px solid var(--gr-color-gray-200);
		border-radius: var(--gr-radii-lg, 12px);
		overflow: hidden;
		background: white;
	}

	:global(.demo-status) {
		border-bottom: 1px solid var(--color-border, #e5e7eb);
	}

	:global(.demo-status:last-child) {
		border-bottom: none;
	}
</style>

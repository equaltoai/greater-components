<script lang="ts">
	import Root from '../src/Root.svelte';
	import type { Notification, NotificationGroup } from '../src/types.js';
	import type {
		NotificationsConfig,
		NotificationsHandlers,
		NotificationsState,
	} from '../src/context.svelte.js';

	interface Props {
		notifications?: Notification[];
		groups?: NotificationGroup[];
		config?: NotificationsConfig;
		handlers?: NotificationsHandlers;
		initialState?: Partial<NotificationsState>;
	}

	let { notifications = [], groups, config, handlers, initialState }: Props = $props();
</script>

<Root {notifications} {groups} {config} {handlers} {initialState}>
	<div data-testid="child-content">Child Content</div>
</Root>

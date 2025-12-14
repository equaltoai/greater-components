<script lang="ts">
	import Root from '../../../src/components/Profile/Root.svelte';
	import EndorsedAccounts from '../../../src/components/Profile/EndorsedAccounts.svelte';
	import type { ProfileHandlers, ProfileData } from '../../../src/components/Profile/context';

	interface Props {
		profile?: { id: string; username: string };
		handlers?: Partial<ProfileHandlers>;
		isOwnProfile?: boolean;
		endorsed?: ProfileData[];
		maxAccounts?: number;
	}

	let {
		profile = { id: '1', username: 'test' },
		handlers = {},
		isOwnProfile = false,
		endorsed = [],
		maxAccounts = 0,
	}: Props = $props();
</script>

<Root {profile} {handlers} {isOwnProfile}>
	<EndorsedAccounts {endorsed} {isOwnProfile} {maxAccounts} />
</Root>

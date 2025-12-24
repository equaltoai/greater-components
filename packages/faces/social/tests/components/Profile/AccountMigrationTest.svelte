<script lang="ts">
	import Root from '../../../src/components/Profile/Root.svelte';
	import AccountMigration from '../../../src/components/Profile/AccountMigration.svelte';
	import type {
		ProfileHandlers,
		AccountMigration as AccountMigrationType,
	} from '../../../src/components/Profile/context';

	interface Props {
		profile?: { id: string; username: string };
		handlers?: Partial<ProfileHandlers>;
		isOwnProfile?: boolean;
		migration?: AccountMigrationType | null;
	}

	let {
		profile = { id: '1', username: 'test' },
		handlers = {},
		isOwnProfile = false,
		migration = null,
	}: Props = $props();
</script>

<Root {profile} {handlers} {isOwnProfile}>
	<AccountMigration {migration} {isOwnProfile} />
</Root>

<script>
	import Root from '../../../src/components/Profile/Root.svelte';
	import Stats from '../../../src/components/Profile/Stats.svelte';
	let { profile, handlers, isOwnProfile, ...props } = $props();
</script>

<Root {profile} {handlers} {isOwnProfile}>
	<Stats {...props} />
</Root>

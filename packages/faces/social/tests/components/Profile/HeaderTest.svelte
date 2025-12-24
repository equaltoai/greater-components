<script>
	import Root from '../../../src/components/Profile/Root.svelte';
	import Header from '../../../src/components/Profile/Header.svelte';
	let { profile, handlers, isOwnProfile, ...props } = $props();
</script>

<Root {profile} {handlers} {isOwnProfile}>
	<Header {...props} />
</Root>

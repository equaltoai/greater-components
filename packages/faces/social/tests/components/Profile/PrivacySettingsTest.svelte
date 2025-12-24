<script>
	import Root from '../../../src/components/Profile/Root.svelte';
	import PrivacySettings from '../../../src/components/Profile/PrivacySettings.svelte';
	let { profile, handlers, isOwnProfile, ...props } = $props();
</script>

<Root {profile} {handlers} {isOwnProfile}>
	<PrivacySettings {...props} />
</Root>

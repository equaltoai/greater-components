<script>
	import Root from '../../../src/components/Profile/Root.svelte';
	import VerifiedFields from '../../../src/components/Profile/VerifiedFields.svelte';
	let { profile, fields, ...props } = $props();
</script>

<Root {profile}>
	<VerifiedFields {fields} {...props} />
</Root>

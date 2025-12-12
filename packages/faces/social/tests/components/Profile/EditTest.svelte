<script>
  import Root from '../../../src/components/Profile/Root.svelte';
  import Edit from '../../../src/components/Profile/Edit.svelte';
  let { profile, handlers, isOwnProfile, ...props } = $props();
</script>

<Root {profile} {handlers} {isOwnProfile}>
  <Edit {...props} />
</Root>

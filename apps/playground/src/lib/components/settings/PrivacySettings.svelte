<script>
	import {
		SettingsSection,
		SettingsToggle,
		SettingsSelect,
	} from '@equaltoai/greater-components-primitives';

	let accountPrivacy = $state('public');
	let indexable = $state(true);
	let showFollows = $state(true);
</script>

<SettingsSection title="Account Privacy" description="Control who can see your content">
	<SettingsSelect
		label="Default Post Privacy"
		bind:value={accountPrivacy}
		options={[
			{ value: 'public', label: 'Public' },
			{ value: 'unlisted', label: 'Unlisted' },
			{ value: 'private', label: 'Followers Only' },
		]}
	/>

	<SettingsToggle
		label="Allow Search Indexing"
		description="Allow search engines to index your public profile"
		bind:value={indexable}
	/>

	<SettingsToggle
		label="Show Following List"
		description="Allow others to see who you follow"
		bind:value={showFollows}
	/>
</SettingsSection>

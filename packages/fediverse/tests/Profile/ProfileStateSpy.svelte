<script lang="ts">
	import { onMount } from 'svelte';
	import { getProfileContext } from '../../src/components/Profile/context.js';
	import type { ProfileState } from '../../src/components/Profile/context.js';

	let { onStateChange = () => {} } = $props<{
		onStateChange?: (state: ProfileState) => void;
	}>();

	const { state } = getProfileContext();

	const clone = <T>(value: T): T =>
		typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));

	function notify() {
		const snapshot: ProfileState = {
			profile: state.profile ? clone(state.profile) : null,
			editMode: state.editMode,
			loading: state.loading,
			error: state.error,
			activeTab: state.activeTab,
			tabs: clone(state.tabs),
			isOwnProfile: state.isOwnProfile,
		};

		onStateChange(snapshot);
	}

	onMount(() => {
		notify();
	});

	$effect(() => {
		// Access individual properties to establish reactive dependencies
		const {
			profile,
			editMode,
			loading,
			error,
			activeTab,
			tabs,
			isOwnProfile,
		} = state;

		// Prevent unused variable warnings
		void profile;
		void editMode;
		void loading;
		void error;
		void activeTab;
		void tabs;
		void isOwnProfile;

		notify();
	});
</script>

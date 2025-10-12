<script lang="ts">
	import type { ComponentType } from 'svelte';
	import ProfileRoot from '../../src/components/Profile/Root.svelte';
	import ProfileStateSpy from './ProfileStateSpy.svelte';
	import type { ProfileData, ProfileHandlers, ProfileState } from '../../src/components/Profile/context.js';

	let {
		component,
		componentProps = {},
		profile = null,
		handlers = {},
		isOwnProfile = false,
		includeStateSpy = false,
		onStateChange = () => {},
		additionalComponents = [],
		additionalProps = [],
	} = $props<{
		component: ComponentType;
		componentProps?: Record<string, unknown>;
		profile?: ProfileData | null;
		handlers?: ProfileHandlers;
		isOwnProfile?: boolean;
		includeStateSpy?: boolean;
		onStateChange?: (state: ProfileState) => void;
		additionalComponents?: ComponentType[];
		additionalProps?: Array<Record<string, unknown>>;
	}>();
</script>

<ProfileRoot {profile} {handlers} {isOwnProfile}>
	<svelte:component this={component} {...componentProps} />
	{#if includeStateSpy}
		<ProfileStateSpy onStateChange={onStateChange} />
	{/if}
	{#if additionalComponents.length > 0}
		{#each additionalComponents as ExtraComponent, index}
			<svelte:component this={ExtraComponent} {...(additionalProps[index] ?? {})} />
		{/each}
	{/if}
</ProfileRoot>

<script lang="ts">
	import CritiqueCircleRoot from '../../../src/components/Community/CritiqueCircle/Root.svelte';
	import CritiqueCircleSession from '../../../src/components/Community/CritiqueCircle/Session.svelte';
	import CritiqueCircleQueue from '../../../src/components/Community/CritiqueCircle/Queue.svelte';
	import CollaborationRoot from '../../../src/components/Community/Collaboration/Root.svelte';
	import CollaborationUploads from '../../../src/components/Community/Collaboration/Uploads.svelte';
	import MentorMatch from '../../../src/components/Community/MentorMatch.svelte';
	import type { CritiqueCircleData, CollaborationData } from '../../../src/types/community.js';

	interface Props {
		component: 'CritiqueCircle' | 'Collaboration' | 'MentorMatch';
		circle?: CritiqueCircleData;
		collaboration?: CollaborationData;
		handlers?: any;
		membership?: any;
		role?: any;
		mode?: any;
		matches?: any;
	}

	let { component, circle, collaboration, handlers, membership, role, mode, matches }: Props = $props();
</script>

{#if component === 'CritiqueCircle' && circle}
	<CritiqueCircleRoot {circle} {membership} {handlers}>
		<CritiqueCircleSession />
		<CritiqueCircleQueue />
	</CritiqueCircleRoot>
{:else if component === 'Collaboration' && collaboration}
	<CollaborationRoot {collaboration} {role} {handlers}>
		<CollaborationUploads />
	</CollaborationRoot>
{:else if component === 'MentorMatch'}
	<MentorMatch {mode} {matches} {handlers} />
{/if}

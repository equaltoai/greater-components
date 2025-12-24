<script lang="ts">
	import CritiqueCircleRoot from '../../../src/components/Community/CritiqueCircle/Root.svelte';
	import CritiqueCircleSession from '../../../src/components/Community/CritiqueCircle/Session.svelte';
	import CritiqueCircleQueue from '../../../src/components/Community/CritiqueCircle/Queue.svelte';
	import CollaborationRoot from '../../../src/components/Community/Collaboration/Root.svelte';
	import type { CollaborationRole } from '../../../src/components/Community/Collaboration/context.js';
	import CollaborationUploads from '../../../src/components/Community/Collaboration/Uploads.svelte';
	import MentorMatchComponent from '../../../src/components/Community/MentorMatch.svelte';
	import type {
		CritiqueCircleData,
		CollaborationData,
		CritiqueCircleMemberRole,
		MentorMatch,
	} from '../../../src/types/community.js';

	interface Props {
		component: 'CritiqueCircle' | 'Collaboration' | 'MentorMatch';
		circle?: CritiqueCircleData;
		collaboration?: CollaborationData;
		handlers?: Record<string, unknown>;
		membership?: CritiqueCircleMemberRole;
		role?: CollaborationRole;
		mode?: 'find-mentor' | 'find-mentee' | 'active';
		matches?: MentorMatch[];
	}

	let { component, circle, collaboration, handlers, membership, role, mode, matches }: Props =
		$props();
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
	<MentorMatchComponent {mode} {matches} {handlers} />
{/if}

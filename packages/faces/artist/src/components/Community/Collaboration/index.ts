/**
 * Collaboration Compound Component
 *
 * A compound component for multi-artist collaboration functionality.
 * Implements REQ-COMM-002: Collaboration
 *
 * @module @equaltoai/greater-components/faces/artist/Community/Collaboration
 *
 * @example
 * ```svelte
 * <script>
 *   import { Collaboration } from '@equaltoai/greater-components/faces/artist';
 * </script>
 *
 * <Collaboration.Root {collaboration} role="contributor" {handlers}>
 *   <Collaboration.Project />
 *   <Collaboration.Contributors />
 *   <Collaboration.Uploads />
 *   <Collaboration.Gallery />
 *   <Collaboration.Split />
 * </Collaboration.Root>
 * ```
 */

import Root from './Root.svelte';
import Project from './Project.svelte';
import Contributors from './Contributors.svelte';
import Uploads from './Uploads.svelte';
import Gallery from './Gallery.svelte';
import Split from './Split.svelte';

export {
	COLLABORATION_CONTEXT_KEY,
	createCollaborationContext,
	getCollaborationContext,
	hasCollaborationContext,
	canManage,
	canContribute,
	canUpload,
	canInviteMembers,
	getStatusBadge,
	calculateTotalSplit,
	isSplitValid,
	type CollaborationContext,
	type CollaborationConfig,
	type CollaborationRole,
	type SplitAgreement,
} from './context.js';

export const Collaboration = {
	Root,
	Project,
	Contributors,
	Uploads,
	Gallery,
	Split,
};

export default Collaboration;

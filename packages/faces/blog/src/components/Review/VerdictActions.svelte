<!--
Review.VerdictActions - confirm-guarded approve / request-changes controls

Both verdicts are guarded by a confirmation dialog: recording a verdict is a
consequential, reviewer-visible act, and `CHANGES_REQUESTED` additionally
collects the notes that justify it.

The component does not talk to a transport. It calls `onSubmit` with the
contract-shaped payload and the consumer wires that to Lesser's
`submitDraftReview` mutation — see `createSubmitDraftReviewHandler` in
`@equaltoai/greater-components-adapters`. Lesser owns review policy: this
component neither decides whether a verdict is permitted nor infers the
resulting status, it reports what the server returns.

Focus management, the focus trap, Escape-to-dismiss, and backdrop handling all
come from the `Modal` primitive.
-->

<script lang="ts">
	import { Button, Modal, TextArea } from '@equaltoai/greater-components-primitives';
	import type { DraftReviewVerdict, VerdictSubmission } from '../../types.js';

	interface Props {
		/** Identifier of the draft being reviewed. */
		draftId: string;
		/**
		 * Records the verdict. Rejecting the returned promise surfaces the error
		 * in the dialog and keeps it open so the reviewer can retry.
		 */
		onSubmit: (submission: VerdictSubmission) => Promise<unknown> | unknown;
		/** Disable both verdict actions. */
		disabled?: boolean;
		/**
		 * Require notes before a `CHANGES_REQUESTED` verdict can be submitted.
		 *
		 * @defaultValue true
		 */
		requireNotesForChanges?: boolean;
		/** Label for the approve action. */
		approveLabel?: string;
		/** Label for the request-changes action. */
		requestChangesLabel?: string;
		/** Custom CSS class. */
		class?: string;
	}

	let {
		draftId,
		onSubmit,
		disabled = false,
		requireNotesForChanges = true,
		approveLabel = 'Approve',
		requestChangesLabel = 'Request changes',
		class: className = '',
	}: Props = $props();

	let pendingVerdict = $state<DraftReviewVerdict | null>(null);
	let notes = $state('');
	let submitting = $state(false);
	let errorMessage = $state('');
	let notesTouched = $state(false);

	/*
	 * Dialog visibility is its own bindable state rather than a derivation of
	 * `pendingVerdict`. Modal writes `open = false` directly on every close path
	 * — Escape, backdrop, and the header close button — and the close button is
	 * not gated by `closeOnEscape` / `closeOnBackdrop`. Binding keeps the two
	 * sides in agreement; deriving would let Modal's write and the derivation
	 * disagree whenever a close is refused (see `handleDialogClose`).
	 */
	let dialogOpen = $state(false);

	const rootClass = $derived(['gr-blog-review-verdict', className].filter(Boolean).join(' '));

	const notesId = $derived(`gr-blog-review-verdict-notes-${draftId}`);
	const errorId = $derived(`gr-blog-review-verdict-error-${draftId}`);

	const notesRequired = $derived(pendingVerdict === 'CHANGES_REQUESTED' && requireNotesForChanges);
	const notesMissing = $derived(notesRequired && notes.trim().length === 0);
	const showNotesError = $derived(notesMissing && notesTouched);

	const dialogTitle = $derived(
		pendingVerdict === 'APPROVED' ? 'Approve this draft?' : 'Request changes to this draft?'
	);

	const confirmLabel = $derived(pendingVerdict === 'APPROVED' ? approveLabel : requestChangesLabel);

	function reset() {
		pendingVerdict = null;
		notes = '';
		notesTouched = false;
		errorMessage = '';
	}

	function openDialog(verdict: DraftReviewVerdict) {
		pendingVerdict = verdict;
		notes = '';
		notesTouched = false;
		errorMessage = '';
		dialogOpen = true;
	}

	function cancel() {
		if (submitting) return;
		dialogOpen = false;
	}

	/**
	 * Runs after Modal has already closed itself.
	 *
	 * A close while a submission is in flight is not honoured: the pending
	 * verdict is kept so that a rejection can reopen the dialog with its error
	 * rather than failing silently behind a dismissed dialog.
	 */
	function handleDialogClose() {
		if (submitting) return;
		reset();
	}

	async function confirm() {
		if (pendingVerdict === null || submitting) return;

		if (notesMissing) {
			notesTouched = true;
			return;
		}

		const trimmedNotes = notes.trim();
		submitting = true;
		errorMessage = '';

		try {
			await onSubmit({
				draftId,
				verdict: pendingVerdict,
				...(trimmedNotes ? { notes: trimmedNotes } : {}),
			});
			dialogOpen = false;
			reset();
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Could not record the verdict.';
			// Reassert visibility in case the reviewer dismissed the dialog while
			// the submission was still in flight — the failure must stay visible.
			dialogOpen = true;
		} finally {
			submitting = false;
		}
	}
</script>

<div class={rootClass}>
	<Button
		variant="solid"
		size="lg"
		{disabled}
		class="gr-blog-review-verdict__approve"
		onclick={() => openDialog('APPROVED')}
	>
		{approveLabel}
	</Button>
	<Button
		variant="outline"
		size="lg"
		{disabled}
		class="gr-blog-review-verdict__request-changes"
		onclick={() => openDialog('CHANGES_REQUESTED')}
	>
		{requestChangesLabel}
	</Button>
</div>

<Modal
	bind:open={dialogOpen}
	title={dialogTitle}
	size="md"
	closeOnEscape={!submitting}
	closeOnBackdrop={!submitting}
	onClose={handleDialogClose}
	class="gr-blog-review-verdict__dialog"
>
	{#if pendingVerdict === 'APPROVED'}
		<p class="gr-blog-review-verdict__prompt">
			This records your approval against the draft. Lesser decides whether the draft can publish.
		</p>
	{:else}
		<p class="gr-blog-review-verdict__prompt">
			Describe what needs to change. Your notes are recorded with the verdict and shown to the
			author.
		</p>
	{/if}

	<TextArea
		id={notesId}
		label="Notes"
		class="gr-blog-review-verdict__field"
		rows={4}
		bind:value={notes}
		onblur={() => (notesTouched = true)}
		disabled={submitting}
		required={notesRequired}
		errorMessage={showNotesError ? 'Notes are required when requesting changes.' : undefined}
	/>

	{#if errorMessage}
		<p class="gr-blog-review-verdict__error" id={errorId} role="alert">{errorMessage}</p>
	{/if}

	{#snippet footer()}
		<Button variant="ghost" size="lg" disabled={submitting} onclick={cancel}>Cancel</Button>
		<Button
			variant="solid"
			size="lg"
			loading={submitting}
			disabled={submitting || notesMissing}
			onclick={confirm}
		>
			{confirmLabel}
		</Button>
	{/snippet}
</Modal>

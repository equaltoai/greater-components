/**
 * Types for Messaging components
 */

export type MediaCategory = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'GIFV' | 'DOCUMENT';

export type MessagingWorkflowThreadMomentKind = 'review_request' | 'approval_request' | 'decision';

export interface MessagingWorkflowThreadMoment {
	id: string;
	kind: MessagingWorkflowThreadMomentKind;
	title: string;
	summary: string;
	phase?: string;
	requestedBy?: string;
	targetLabel?: string;
	actionLabel?: string;
	decision?: 'approved' | 'changes_requested' | 'rejected';
}

export interface MessagingWorkflowConversationSummary {
	kind: 'review' | 'approval';
	title: string;
	state: 'open' | 'approved' | 'changes_requested' | 'rejected';
	phase?: string;
	dueLabel?: string;
	summary?: string;
}

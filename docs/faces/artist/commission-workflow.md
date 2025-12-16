# Artist Face: Commission Workflow

> End-to-end commission management from request to delivery.

The CommissionWorkflow components provide a complete system for managing art commissions, including request forms, quoting, progress tracking, and delivery.

## Installation

```bash
npx @equaltoai/greater-components-cli add commission-workflow
```

Or install as part of the Artist Face:

```bash
npx @equaltoai/greater-components-cli add faces/artist
```

## Commission Lifecycle

```
Request → Quote → Contract → Progress → Delivery → Review
```

| Stage | Description | Components |
|-------|-------------|------------|
| **Request** | Client submits commission request | `CommissionWorkflow.Request` |
| **Quote** | Artist provides quote and terms | `CommissionWorkflow.Quote` |
| **Contract** | Both parties agree to terms | `CommissionWorkflow.Contract` |
| **Progress** | WIP updates and communication | `CommissionWorkflow.Progress` |
| **Delivery** | Final artwork delivery | `CommissionWorkflow.Delivery` |
| **Review** | Client review and feedback | `CommissionWorkflow.Review` |

## Basic Usage

```svelte
<script lang="ts">
	import { CommissionWorkflow } from '$lib/components/faces/artist';
	import { createCommissionStore } from '$lib/stores';

	const commission = {
		id: 'comm-1',
		status: 'in-progress',
		client: { id: 'client-1', name: 'John Doe', avatar: '/avatars/john.jpg' },
		artist: { id: 'artist-1', name: 'Jane Artist' },
		description: 'Portrait painting, oil on canvas, 24x36 inches',
		price: { amount: 500, currency: 'USD' },
		deadline: '2024-03-15',
		updates: [...],
		createdAt: '2024-01-15T10:00:00Z',
	};

	const handlers = {
		onStatusChange: async (status) => updateCommission(commission.id, { status }),
		onMessageSend: async (message) => sendMessage(commission.id, message),
		onUpdateAdd: async (update) => addUpdate(commission.id, update),
	};
</script>

<CommissionWorkflow.Root {commission} role="artist" {handlers}>
	<CommissionWorkflow.Header />
	<CommissionWorkflow.Timeline />
	<CommissionWorkflow.Progress />
	<CommissionWorkflow.Actions />
</CommissionWorkflow.Root>
```

## Commission Request Form

Allow clients to submit commission requests:

```svelte
<script lang="ts">
	import { CommissionWorkflow } from '$lib/components/faces/artist';

	async function handleSubmit(request) {
		await fetch('/api/commissions', {
			method: 'POST',
			body: JSON.stringify(request),
		});
	}
</script>

<CommissionWorkflow.Request
	artistId="artist-1"
	onSubmit={handleSubmit}
	config={{
		requireBudget: true,
		requireDeadline: true,
		allowReferenceImages: true,
		maxReferenceImages: 5,
		categories: ['portrait', 'landscape', 'character', 'other'],
	}}
/>
```

### Request Form Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | `string` | Yes | Detailed commission description |
| `category` | `string` | Yes | Commission type |
| `budget` | `{ min, max, currency }` | Configurable | Budget range |
| `deadline` | `Date` | Configurable | Desired completion date |
| `references` | `File[]` | No | Reference images |
| `dimensions` | `string` | No | Desired size |
| `medium` | `string` | No | Preferred medium |

## Artist Quote

Artists can respond with quotes and terms:

```svelte
<script lang="ts">
	import { CommissionWorkflow } from '$lib/components/faces/artist';

	async function handleQuoteSend(quote) {
		await updateCommission(commission.id, {
			status: 'quoted',
			quote,
		});
	}
</script>

<CommissionWorkflow.Quote
	commission={commission}
	onSend={handleQuoteSend}
	config={{
		allowMilestones: true,
		allowRevisions: true,
		defaultRevisions: 2,
		requireDeposit: true,
		depositPercent: 50,
	}}
/>
```

### Quote Structure

```ts
interface CommissionQuote {
	price: { amount: number; currency: string };
	deposit?: { amount: number; dueDate: Date };
	milestones?: Array<{
		title: string;
		amount: number;
		dueDate: Date;
	}>;
	revisions: number;
	estimatedDelivery: Date;
	terms: string;
	validUntil: Date;
}
```

## Progress Tracking

Track work-in-progress with updates and client communication:

```svelte
<script lang="ts">
	import { CommissionWorkflow } from '$lib/components/faces/artist';

	const updates = [
		{
			id: 'update-1',
			type: 'progress',
			title: 'Initial Sketch Complete',
			description: 'Composition approved, moving to color study',
			media: [{ type: 'image', url: '/wip/sketch.jpg' }],
			progress: 25,
			createdAt: '2024-02-01T10:00:00Z',
		},
		{
			id: 'update-2',
			type: 'milestone',
			title: 'Color Study',
			progress: 50,
			createdAt: '2024-02-10T10:00:00Z',
		},
	];
</script>

<CommissionWorkflow.Progress
	{commission}
	{updates}
	role="artist"
	onAddUpdate={handleAddUpdate}
	showProgressBar
/>
```

### Update Types

| Type | Description |
|------|-------------|
| `progress` | General WIP update with optional media |
| `milestone` | Milestone completion (triggers payment if configured) |
| `revision` | Revision request or response |
| `message` | Client-artist communication |
| `approval` | Client approval required |

## Delivery

Handle final artwork delivery:

```svelte
<script lang="ts">
	import { CommissionWorkflow } from '$lib/components/faces/artist';
</script>

<CommissionWorkflow.Delivery
	{commission}
	onDeliver={handleDeliver}
	config={{
		requireWatermark: true,
		allowMultipleFormats: true,
		formats: ['png', 'psd', 'tiff'],
		includeProcessFiles: true,
	}}
/>
```

## Status Management

Commission status flow:

```ts
type CommissionStatus =
	| 'pending'      // Request submitted, awaiting artist response
	| 'quoted'       // Artist sent quote, awaiting client response
	| 'accepted'     // Client accepted, awaiting deposit
	| 'deposit-paid' // Deposit received, work can begin
	| 'in-progress'  // Work underway
	| 'revision'     // Revision requested
	| 'delivered'    // Work delivered, awaiting final payment
	| 'completed'    // Fully paid and closed
	| 'cancelled'    // Cancelled by either party
	| 'disputed';    // Payment or delivery dispute
```

## Using Commission Patterns

The Artist Face includes helper patterns for common commission workflows:

```ts
import { Patterns } from '$lib/patterns';

// Create a new commission pattern instance
const commissionPattern = Patterns.createCommissionPattern({
	onStatusChange: handleStatusChange,
	onPaymentRequired: handlePayment,
	onNotification: sendNotification,
});

// Validate status transitions
const canAccept = commissionPattern.canTransition(commission, 'accepted');

// Get available actions for current state
const actions = commissionPattern.getAvailableActions(commission, 'artist');
```

## Integration with Payment

Connect to payment providers:

```svelte
<script lang="ts">
	import { CommissionWorkflow, Monetization } from '$lib/components/faces/artist';
</script>

<CommissionWorkflow.Root {commission} role="artist">
	<CommissionWorkflow.Progress />
	
	{#if commission.status === 'deposit-paid' || commission.status === 'delivered'}
		<Monetization.DirectPurchase
			pricing={commission.quote}
			onPurchase={handlePayment}
		/>
	{/if}
</CommissionWorkflow.Root>
```

## Notifications

Commission events trigger notifications:

| Event | Artist Notification | Client Notification |
|-------|---------------------|---------------------|
| New Request | ✅ | - |
| Quote Sent | - | ✅ |
| Quote Accepted | ✅ | - |
| Deposit Paid | ✅ | ✅ |
| Progress Update | - | ✅ |
| Revision Requested | ✅ | - |
| Delivered | - | ✅ |
| Completed | ✅ | ✅ |

## Related Documentation

- [Creative Tools API](../../components/artist/creative-tools.md)
- [Monetization Components](../../components/artist/monetization.md)
- [Artist Face Best Practices](../../guides/artist-face-best-practices.md)

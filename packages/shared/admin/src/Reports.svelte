<!--
  Admin.Reports - Moderation Reports
-->
<script lang="ts">
	import { getAdminContext } from './context.svelte.js';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state: adminState, fetchReports, handlers } = getAdminContext();

	let statusFilter = $state<'pending' | 'resolved' | 'dismissed'>('pending');
	let searchQuery = $state('');
	let selectedReportId = $state<string | null>(null);
	let resolveAction = $state('suspend');
	let assigneeId = $state('');

	$effect(() => {
		selectedReportId = null;
		void fetchReports(statusFilter);
	});

	const filteredReports = $derived.by(() => {
		const query = searchQuery.trim().toLowerCase();
		const sorted = [...adminState.reports].sort(
			(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);

		if (!query) return sorted;

		return sorted.filter((report) => {
			const reporter = report.reporter.username.toLowerCase();
			const target = report.target.username.toLowerCase();
			const reason = report.reason.toLowerCase();
			return reporter.includes(query) || target.includes(query) || reason.includes(query);
		});
	});

	const selectedReport = $derived.by(() => {
		if (!selectedReportId) return null;
		return adminState.reports.find((report) => report.id === selectedReportId) ?? null;
	});

	async function handleResolve(reportId: string) {
		await handlers.onResolveReport?.(reportId, resolveAction);
		await fetchReports(statusFilter);
	}

	async function handleDismiss(reportId: string) {
		await handlers.onDismissReport?.(reportId);
		await fetchReports(statusFilter);
	}

	async function handleAssign(reportId: string, value: string) {
		if (!handlers.onAssignReport) return;
		const next = value.trim();
		await handlers.onAssignReport(reportId, next ? next : null);
		await fetchReports(statusFilter);
	}
</script>

<div class={`admin-reports ${className}`}>
	<div class="admin-reports__header">
		<h2 class="admin-reports__title">Reports</h2>

		<div class="admin-reports__controls">
			<label class="admin-reports__control">
				<span>Status</span>
				<select bind:value={statusFilter} aria-label="Filter reports by status">
					<option value="pending">Pending</option>
					<option value="resolved">Resolved</option>
					<option value="dismissed">Dismissed</option>
				</select>
			</label>

			<label class="admin-reports__control admin-reports__control--grow">
				<span>Search</span>
				<input
					type="search"
					bind:value={searchQuery}
					placeholder="Search reporter, target, or reason..."
					aria-label="Search reports"
				/>
			</label>
		</div>
	</div>

	{#if adminState.loading}
		<div class="admin-reports__loading">Loading reports...</div>
	{:else}
		<div class="admin-reports__layout">
			<div class="admin-reports__list" role="list" aria-label="Reports list">
				{#if filteredReports.length === 0}
					<div class="admin-reports__empty">No reports found.</div>
				{:else}
					{#each filteredReports as report (report.id)}
						<button
							type="button"
							class="admin-reports__card"
							class:admin-reports__card--selected={report.id === selectedReportId}
							onclick={() => (selectedReportId = report.id)}
						>
							<div class="admin-reports__card-header">
								<strong>@{report.reporter.username}</strong>
								<span>→</span>
								<strong>@{report.target.username}</strong>
								<span class={`admin-reports__badge admin-reports__badge--${report.status}`}>
									{report.status}
								</span>
							</div>
							<div class="admin-reports__reason">{report.reason}</div>
							<div class="admin-reports__meta">{new Date(report.createdAt).toLocaleString()}</div>
						</button>
					{/each}
				{/if}
			</div>

			<div class="admin-reports__detail" aria-label="Report details">
				{#if selectedReport}
					<div class="admin-reports__detail-card">
						<h3 class="admin-reports__detail-title">Report</h3>

						<dl class="admin-reports__detail-grid">
							<dt>ID</dt>
							<dd>{selectedReport.id}</dd>

							<dt>Reporter</dt>
							<dd>@{selectedReport.reporter.username}</dd>

							<dt>Target</dt>
							<dd>@{selectedReport.target.username} ({selectedReport.target.type})</dd>

							<dt>Status</dt>
							<dd>{selectedReport.status}</dd>

							<dt>Created</dt>
							<dd>{new Date(selectedReport.createdAt).toLocaleString()}</dd>

							{#if selectedReport.assignedTo}
								<dt>Assigned</dt>
								<dd>{selectedReport.assignedTo}</dd>
							{/if}
						</dl>

						<div class="admin-reports__detail-reason">
							<h4>Reason</h4>
							<p>{selectedReport.reason}</p>
						</div>

						{#if handlers.onAssignReport}
							<div class="admin-reports__assign">
								<h4>Assignment</h4>
								<div class="admin-reports__assign-row">
									<input
										type="text"
										bind:value={assigneeId}
										placeholder="Assignee id"
										aria-label="Assignee id"
									/>
									<button
										type="button"
										onclick={() => handleAssign(selectedReport.id, assigneeId)}
										disabled={!assigneeId.trim()}
									>
										Assign
									</button>
									{#if selectedReport.assignedTo}
										<button type="button" onclick={() => handleAssign(selectedReport.id, '')}>
											Unassign
										</button>
									{/if}
								</div>
							</div>
						{/if}

						{#if selectedReport.status === 'pending'}
							<div class="admin-reports__actions">
								<h4>Actions</h4>
								<div class="admin-reports__actions-row">
									<label class="admin-reports__action-field">
										<span>Resolve action</span>
										<input type="text" bind:value={resolveAction} placeholder="e.g. suspend" />
									</label>
									<button
										type="button"
										onclick={() => handleResolve(selectedReport.id)}
										disabled={!handlers.onResolveReport}
									>
										Resolve
									</button>
									<button
										type="button"
										onclick={() => handleDismiss(selectedReport.id)}
										disabled={!handlers.onDismissReport}
									>
										Dismiss
									</button>
								</div>
							</div>
						{/if}
					</div>
				{:else}
					<div class="admin-reports__detail-empty">Select a report to view details.</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

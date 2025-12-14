<!--
MentorMatch - Mentor-mentee matching interface

Implements REQ-COMM-003: Learning & Growth
- Mentor matching
- Skill badges
- Tutorial integration

@component
@example
```svelte
<MentorMatch
  mode="find-mentor"
  filters={{ styles: ['digital'], menteeLevel: 'intermediate' }}
  {handlers}
/>
```
-->

<script lang="ts">
	import type {
		MentorFilters,
		MentorMatch as MentorMatchType,
		MentorMatchHandlers,
	} from '../../types/community.js';

	interface Props {
		/**
		 * Operating mode
		 */
		mode?: 'find-mentor' | 'find-mentee' | 'active';

		/**
		 * Initial filters
		 */
		filters?: MentorFilters;

		/**
		 * Mentor matches (for find modes)
		 */
		matches?: MentorMatchType[];

		/**
		 * Event handlers
		 */
		handlers?: MentorMatchHandlers;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		mode = 'find-mentor',
		filters = {},
		matches = [],
		handlers = {},
		class: className = '',
	}: Props = $props();

	// Local filter state
	// svelte-ignore state_referenced_locally
	let localFilters = $state<MentorFilters>({ ...filters });

	// Filter options
	const experienceLevels = ['beginner', 'intermediate', 'advanced'] as const;

	// Handle filter change
	function handleFilterChange() {
		handlers.onSearch?.(localFilters);
	}

	// Handle request
	async function handleRequest(match: MentorMatchType) {
		await handlers.onRequestMentorship?.(match.mentor, 'ongoingMentorship');
	}
</script>

<div class={`mentor-match mentor-match--${mode} ${className}`}>
	<!-- Header -->
	<header class="mentor-match__header">
		<h2 class="mentor-match__title">
			{#if mode === 'find-mentor'}
				Find a Mentor
			{:else if mode === 'find-mentee'}
				Find a Mentee
			{:else}
				Active Mentorships
			{/if}
		</h2>
		<p class="mentor-match__subtitle">
			{#if mode === 'find-mentor'}
				Connect with experienced artists who can guide your growth
			{:else if mode === 'find-mentee'}
				Share your expertise with emerging artists
			{:else}
				Manage your mentorship connections
			{/if}
		</p>
	</header>

	{#if mode !== 'active'}
		<!-- Filters -->
		<div class="mentor-match__filters">
			<div class="mentor-match__filter">
				<label for="styles">Art Styles</label>
				<input
					id="styles"
					type="text"
					placeholder="e.g., digital, watercolor, oil..."
					value={localFilters.styles?.join(', ') || ''}
					oninput={(e) => {
						localFilters.styles = (e.target as HTMLInputElement).value
							.split(',')
							.map((s) => s.trim())
							.filter(Boolean);
						handleFilterChange();
					}}
				/>
			</div>

			<div class="mentor-match__filter">
				<label for="level">Experience Level</label>
				<select
					id="level"
					value={localFilters.menteeLevel || ''}
					onchange={(e) => {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						localFilters.menteeLevel = ((e.target as HTMLSelectElement).value as any) || undefined;
						handleFilterChange();
					}}
				>
					<option value="">Any level</option>
					{#each experienceLevels as level (level)}
						<option value={level}>{level}</option>
					{/each}
				</select>
			</div>

			<div class="mentor-match__filter">
				<label>
					<input
						type="checkbox"
						checked={localFilters.verifiedOnly || false}
						onchange={(e) => {
							localFilters.verifiedOnly = (e.target as HTMLInputElement).checked;
							handleFilterChange();
						}}
					/>
					Verified mentors only
				</label>
			</div>
		</div>

		<!-- Results -->
		<div class="mentor-match__results">
			{#if matches.length === 0}
				<p class="mentor-match__empty">No matches found. Try adjusting your filters.</p>
			{:else}
				{#each matches as match (match.mentor.id)}
					<article class="mentor-match__card">
						<div class="mentor-match__card-header">
							<img src={match.mentor.avatar || ''} alt="" class="mentor-match__avatar" />
							<div class="mentor-match__card-info">
								<h3 class="mentor-match__name">{match.mentor.name}</h3>
								<span class="mentor-match__username">@{match.mentor.username}</span>
								{#if match.mentor.isVerified}
									<span class="mentor-match__verified" title="Verified Mentor">✓</span>
								{/if}
							</div>
							<div class="mentor-match__score">
								<span class="mentor-match__score-value">{match.matchScore}%</span>
								<span class="mentor-match__score-label">Match</span>
							</div>
						</div>

						<!-- Matching criteria -->
						{#if match.matchingCriteria.length > 0}
							<div class="mentor-match__criteria">
								{#each match.matchingCriteria as criterion (criterion)}
									<span class="mentor-match__criterion">{criterion}</span>
								{/each}
							</div>
						{/if}

						<!-- Availability -->
						<div class="mentor-match__availability">
							<h4>Availability</h4>
							<ul>
								{#if match.availability.oneOnOne}
									<li>One-on-one sessions</li>
								{/if}
								{#if match.availability.portfolioReview}
									<li>Portfolio reviews</li>
								{/if}
								{#if match.availability.ongoingMentorship}
									<li>Ongoing mentorship</li>
								{/if}
								{#if match.availability.hoursPerWeek}
									<li>{match.availability.hoursPerWeek} hrs/week</li>
								{/if}
							</ul>
						</div>

						<!-- Rates -->
						{#if match.rates}
							<div class="mentor-match__rates">
								{#if match.rates.hourlyRate}
									<span>{match.rates.currency}{match.rates.hourlyRate}/hr</span>
								{/if}
								{#if match.rates.portfolioReviewRate}
									<span>{match.rates.currency}{match.rates.portfolioReviewRate}/review</span>
								{/if}
							</div>
						{/if}

						<!-- Reviews -->
						{#if match.reviews?.length}
							<div class="mentor-match__reviews">
								<span class="mentor-match__rating">
									★ {(
										match.reviews.reduce((sum, r) => sum + r.rating, 0) / match.reviews.length
									).toFixed(1)}
								</span>
								<span class="mentor-match__review-count">
									({match.reviews.length} review{match.reviews.length !== 1 ? 's' : ''})
								</span>
							</div>
						{/if}

						<button
							type="button"
							class="mentor-match__request-btn"
							onclick={() => handleRequest(match)}
						>
							Request {mode === 'find-mentor' ? 'Mentorship' : 'to Mentor'}
						</button>
					</article>
				{/each}
			{/if}
		</div>
	{:else}
		<!-- Active mentorships view -->
		<div class="mentor-match__active">
			<p class="mentor-match__empty">Active mentorship dashboard coming soon.</p>
		</div>
	{/if}
</div>

<style>
	.mentor-match {
		background: var(--gr-color-gray-900);
		color: var(--gr-color-gray-100);
		border-radius: var(--gr-radius-lg);
		padding: var(--gr-spacing-scale-6);
	}

	.mentor-match__header {
		margin-bottom: var(--gr-spacing-scale-6);
	}

	.mentor-match__title {
		font-size: var(--gr-font-size-2xl);
		font-weight: var(--gr-font-weight-bold);
		margin: 0 0 var(--gr-spacing-scale-2) 0;
	}

	.mentor-match__subtitle {
		color: var(--gr-color-gray-400);
		margin: 0;
	}

	.mentor-match__filters {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gr-spacing-scale-4);
		padding: var(--gr-spacing-scale-4);
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radius-lg);
		margin-bottom: var(--gr-spacing-scale-6);
	}

	.mentor-match__filter {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2);
		min-width: 200px;
	}

	.mentor-match__filter label {
		font-size: var(--gr-font-size-sm);
		font-weight: var(--gr-font-weight-medium);
		color: var(--gr-color-gray-300);
	}

	.mentor-match__filter input[type='text'],
	.mentor-match__filter select {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border: 1px solid var(--gr-color-gray-600);
		border-radius: var(--gr-radius-md);
		color: var(--gr-color-gray-100);
	}

	.mentor-match__filter input[type='checkbox'] {
		margin-right: var(--gr-spacing-scale-2);
	}

	.mentor-match__results {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: var(--gr-spacing-scale-4);
	}

	.mentor-match__empty {
		grid-column: 1 / -1;
		text-align: center;
		color: var(--gr-color-gray-400);
		padding: var(--gr-spacing-scale-8);
	}

	.mentor-match__card {
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radius-lg);
		padding: var(--gr-spacing-scale-4);
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-3);
	}

	.mentor-match__card-header {
		display: flex;
		align-items: flex-start;
		gap: var(--gr-spacing-scale-3);
	}

	.mentor-match__avatar {
		width: 56px;
		height: 56px;
		border-radius: var(--gr-radius-full);
		object-fit: cover;
		background: var(--gr-color-gray-600);
	}

	.mentor-match__card-info {
		flex: 1;
	}

	.mentor-match__name {
		font-size: var(--gr-font-size-lg);
		font-weight: var(--gr-font-weight-semibold);
		margin: 0;
	}

	.mentor-match__username {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-400);
	}

	.mentor-match__verified {
		display: inline-block;
		margin-left: var(--gr-spacing-scale-1);
		color: var(--gr-color-primary-400);
	}

	.mentor-match__score {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--gr-spacing-scale-2);
		background: var(--gr-color-primary-900);
		border-radius: var(--gr-radius-md);
	}

	.mentor-match__score-value {
		font-size: var(--gr-font-size-lg);
		font-weight: var(--gr-font-weight-bold);
		color: var(--gr-color-primary-300);
	}

	.mentor-match__score-label {
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-primary-400);
	}

	.mentor-match__criteria {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gr-spacing-scale-2);
	}

	.mentor-match__criterion {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radius-sm);
		font-size: var(--gr-font-size-xs);
	}

	.mentor-match__availability h4 {
		font-size: var(--gr-font-size-sm);
		font-weight: var(--gr-font-weight-semibold);
		margin: 0 0 var(--gr-spacing-scale-2) 0;
		color: var(--gr-color-gray-300);
	}

	.mentor-match__availability ul {
		margin: 0;
		padding-left: var(--gr-spacing-scale-4);
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-400);
	}

	.mentor-match__rates {
		display: flex;
		gap: var(--gr-spacing-scale-3);
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-success-400);
	}

	.mentor-match__reviews {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
	}

	.mentor-match__rating {
		color: var(--gr-color-warning-400);
		font-weight: var(--gr-font-weight-medium);
	}

	.mentor-match__review-count {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-400);
	}

	.mentor-match__request-btn {
		margin-top: auto;
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-primary-600);
		border: none;
		border-radius: var(--gr-radius-md);
		color: white;
		font-weight: var(--gr-font-weight-medium);
		cursor: pointer;
		transition: background 0.2s;
	}

	.mentor-match__request-btn:hover {
		background: var(--gr-color-primary-700);
	}

	@media (prefers-reduced-motion: reduce) {
		.mentor-match__request-btn {
			transition: none;
		}
	}
</style>

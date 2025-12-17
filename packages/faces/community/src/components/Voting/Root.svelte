<!--
Voting.Root - Upvote/downvote controls

@component
@example
```svelte
<Voting.Root score={post.score} userVote={post.userVote ?? 0} handlers={voteHandlers} />
```
-->

<script lang="ts">
	import type { VoteDirection, VoteHandlers } from '../../types.js';

	interface Props {
		score: number;
		userVote?: VoteDirection;
		orientation?: 'vertical' | 'horizontal';
		handlers?: Partial<VoteHandlers>;
		disabled?: boolean;
		class?: string;
	}

	let {
		score,
		userVote = 0,
		orientation = 'vertical',
		handlers = {},
		disabled = false,
		class: className = '',
	}: Props = $props();

	const voteClass = $derived(
		[
			'gr-community-vote',
			orientation === 'horizontal' && 'gr-community-vote--horizontal',
			className,
		]
			.filter(Boolean)
			.join(' ')
	);

	const scoreClass = $derived(
		[
			'gr-community-vote__score',
			score > 0 && 'gr-community-vote__score--positive',
			score < 0 && 'gr-community-vote__score--negative',
		]
			.filter(Boolean)
			.join(' ')
	);

	async function handleUpvote() {
		if (disabled) return;
		if (userVote === 1) return void (await handlers.onRemoveVote?.());
		await handlers.onUpvote?.();
	}

	async function handleDownvote() {
		if (disabled) return;
		if (userVote === -1) return void (await handlers.onRemoveVote?.());
		await handlers.onDownvote?.();
	}
</script>

<div class={voteClass}>
	<button
		type="button"
		class="gr-community-vote__button gr-community-vote__button--upvote"
		class:gr-community-vote__button--active={userVote === 1}
		{disabled}
		aria-pressed={userVote === 1}
		aria-label="Upvote"
		onclick={handleUpvote}
	>
		▲
	</button>

	<div class={scoreClass} aria-label={`Score ${score}`}>{score}</div>

	<button
		type="button"
		class="gr-community-vote__button gr-community-vote__button--downvote"
		class:gr-community-vote__button--active={userVote === -1}
		{disabled}
		aria-pressed={userVote === -1}
		aria-label="Downvote"
		onclick={handleDownvote}
	>
		▼
	</button>
</div>

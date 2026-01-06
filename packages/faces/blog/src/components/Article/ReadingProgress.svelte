<!--
Article.ReadingProgress - Scroll progress indicator

@component
-->

<script lang="ts">
	import { getArticleContext, updateScrollProgress } from './context.js';
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		/**
		 * Position of the progress bar
		 */
		position?: 'top' | 'bottom';
	}

	let { position = 'top' }: Props = $props();

	const context = getArticleContext();
	const progress = $derived(context.scrollProgress);

	let cleanup: (() => void) | undefined;

	onMount(() => {
		function handleScroll() {
			const scrollTop = window.scrollY;
			const docHeight = document.documentElement.scrollHeight - window.innerHeight;
			const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;
			updateScrollProgress(context, scrollProgress);
		}

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll(); // Initial calculation

		cleanup = () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	onDestroy(() => {
		cleanup?.();
	});
</script>

	<div
		class="gr-blog-reading-progress"
		class:gr-blog-reading-progress--bottom={position === 'bottom'}
		role="progressbar"
	aria-valuenow={Math.round(progress * 100)}
	aria-valuemin={0}
		aria-valuemax={100}
		aria-label="Reading progress"
	>
		{@const progressPercent = Math.max(0, Math.min(100, progress * 100))}
		<svg
			class="gr-blog-reading-progress__bar"
			viewBox="0 0 100 1"
			preserveAspectRatio="none"
			aria-hidden="true"
		>
			<rect class="gr-blog-reading-progress__bar-fill" x="0" y="0" width={progressPercent} height="1" />
		</svg>
	</div>

<script lang="ts">
	import { Button } from '@equaltoai/greater-components-primitives';
	import { HomeIcon } from '@equaltoai/greater-components-icons';

	let clickCount = $state(0);
</script>

<div class="button-test">
	<h1>Button Test</h1>
	
	<section>
		<h2>Basic Buttons</h2>
		<Button onclick={() => clickCount++}>
			Click me
		</Button>
		<p>Clicked {clickCount} times</p>
	</section>

	<section>
		<h2>Button with Icon in Snippet</h2>
		<Button onclick={() => clickCount++}>
			{#snippet prefix()}
				<HomeIcon size={20} />
			{/snippet}
			With Icon
		</Button>
	</section>

	<section>
		<h2>Icon Standalone</h2>
		<HomeIcon size={48} />
		<p>If you see the home icon above, icons work</p>
	</section>
</div>

<style>
	.button-test {
		padding: 2rem;
		max-width: 800px;
		margin: 0 auto;
	}

	section {
		margin: 2rem 0;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 8px;
	}

	h1 {
		margin-bottom: 2rem;
	}

	h2 {
		margin-bottom: 1rem;
	}
</style>


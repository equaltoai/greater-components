<script>
	import CodeExample from '$lib/components/CodeExample.svelte';
</script>

<svelte:head>
	<title>CSP Migration Guide - Greater Components</title>
	<meta
		name="description"
		content="Migration guide for strict CSP compatibility: Skeleton sizing, Text clamping, Container gutters, and Avatar placeholder colors."
	/>
</svelte:head>

<article class="guide-page">
	<header>
		<p class="eyebrow">Guide</p>
		<h1>CSP Migration Guide</h1>
		<p class="lead">
			If you’re upgrading from older Greater Components versions that allowed per-instance styling,
			these are the key breaking changes for strict CSP compatibility.
		</p>
	</header>

	<section>
		<h2>1) Skeleton: Preset Sizing</h2>
		<p>
			Strict CSP blocks <code>style="..."</code>, so Skeleton no longer supports arbitrary
			width/height values.
		</p>

		<CodeExample
			title="Before"
			language="svelte"
			code={`<!-- ❌ Before: arbitrary sizing -->
<Skeleton width="250px" height="80px" />
<Skeleton width={customWidth} height={customHeight} />`}
		/>

		<CodeExample
			title="After"
			language="svelte"
			code={`<!-- ✅ After: presets -->
<Skeleton width="full" height="md" />
<Skeleton width="1/2" height="lg" />

<!-- ✅ Custom sizes via external CSS -->
<Skeleton class="my-skeleton" />

<style>
  :global(.my-skeleton) {
    width: 250px;
    height: 80px;
  }
</style>`}
		/>
	</section>

	<section>
		<h2>2) Text: Bounded Line Clamping</h2>
		<p>
			Multi-line clamping is now class-based. <code>lines</code> supports 2–6 for CSP-safe presets.
		</p>

		<CodeExample
			title="Before"
			language="svelte"
			code={`<!-- ❌ Before: per-instance line clamps via inline CSS -->
<Text truncate lines={10}>…</Text>
<Text truncate lines={dynamicLines}>…</Text>`}
		/>

		<CodeExample
			title="After"
			language="svelte"
			code={`<!-- ✅ After: presets (2–6) -->
<Text truncate lines={3}>…</Text>

<!-- ✅ Custom clamp via external CSS -->
<Text truncate class="clamp-10">…</Text>

<style>
  :global(.clamp-10) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 10;
    overflow: hidden;
  }
</style>`}
		/>
	</section>

	<section>
		<h2>3) Container: Preset Gutters + External Custom Gutter</h2>
		<p>
			Container gutters are preset-only. For a custom gutter, set
			<code>--gr-container-custom-gutter</code> via external CSS on a class.
		</p>

		<CodeExample
			title="Before"
			language="svelte"
			code={`<!-- ❌ Before: custom gutter values -->
<Container gutter="2.5rem">…</Container>
<Container gutter={customGutter}>…</Container>`}
		/>

		<CodeExample
			title="After"
			language="svelte"
			code={`<!-- ✅ After: presets -->
<Container gutter="md">…</Container>
<Container gutter="lg">…</Container>

<!-- ✅ Custom gutter via external CSS -->
<Container class="custom-gutter">…</Container>

<style>
  :global(.custom-gutter) {
    --gr-container-custom-gutter: 2.5rem;
  }
</style>`}
		/>
	</section>

	<section>
		<h2>4) Avatar: Deterministic Placeholder Colors</h2>
		<p>
			Avatar placeholder colors no longer use per-instance inline CSS. Instead, the component maps
			name/label to a deterministic palette class (stable across sessions).
		</p>

		<CodeExample
			language="svelte"
			code={`<!-- ✅ No API change required -->
<Avatar name="Jane Doe" />

<!-- Placeholder color is now deterministic -->
<!-- e.g., gr-avatar--color-0 ... gr-avatar--color-11 -->`}
		/>
	</section>

	<section>
		<h2>5) Remove Any Use of the style Prop</h2>
		<p>
			Shipped Greater components do not support a <code>style</code> prop under strict CSP. If you were
			using it for token overrides, move those overrides into external CSS classes.
		</p>
		<CodeExample
			language="svelte"
			code={`<!-- ✅ Use class-based overrides -->
<Button class="brand-button">Continue</Button>

<style>
  :global(.brand-button) {
    --gr-button-bg: var(--gr-color-primary-600);
    --gr-button-bg-hover: var(--gr-color-primary-700);
  }
</style>`}
		/>
	</section>

	<section>
		<h2>Next</h2>
		<p>
			See <a href="/guides/csp-compatibility">CSP Compatibility</a> for the full strict-CSP contract and
			a component matrix.
		</p>
	</section>
</article>

<style>
	.guide-page {
		max-width: 900px;
		margin: 0 auto;
	}

	.eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-semantic-action-primary-default);
		margin: 0 0 0.5rem;
	}

	h1 {
		font-size: var(--gr-typography-fontSize-4xl);
		margin: 0 0 1rem;
	}

	.lead {
		font-size: var(--gr-typography-fontSize-lg);
		color: var(--gr-semantic-foreground-secondary);
		margin: 0 0 2rem;
		line-height: 1.6;
	}

	section {
		margin-bottom: 3rem;
	}

	h2 {
		font-size: var(--gr-typography-fontSize-2xl);
		margin: 0 0 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--gr-semantic-border-default);
	}

	p {
		margin: 0 0 1rem;
		line-height: 1.6;
	}

	code {
		background: var(--gr-semantic-background-secondary);
		padding: 0.125rem 0.375rem;
		border-radius: var(--gr-radii-sm);
		font-size: 0.9em;
	}

	a {
		color: var(--gr-semantic-action-primary-default);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}
</style>

<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';
	import { Button } from '@equaltoai/greater-components-primitives';
	import {
		SendIcon,
		CheckIcon,
		SettingsIcon,
		LoaderIcon,
		PlayIcon,
		ArrowRightIcon,
	} from '@equaltoai/greater-components-icons';
	import type { DemoPageData } from '$lib/types/demo';

	let { data }: { data: DemoPageData } = $props();

	const variants = ['solid', 'outline', 'ghost'] as const;
	const sizes = ['sm', 'md', 'lg'] as const;

	type VariantConfig = {
		id: string;
		label: string;
		variant: (typeof variants)[number];
		size: (typeof sizes)[number];
	};

	const buttonVariantData: VariantConfig[] = variants.flatMap((variant) =>
		sizes.map((size) => ({
			id: `${variant}-${size}`,
			label: `${variant.charAt(0).toUpperCase() + variant.slice(1)} · ${size.toUpperCase()}`,
			variant,
			size,
		}))
	);

	const variantSnippet = `
<div class="button-grid">
  {#each buttonVariantData as config (config.id)}
    <Button variant={config.variant} size={config.size}>
      {config.label}
    </Button>
  {/each}
</div>`;

	type IconButtonConfig = {
		id: string;
		label: string;
		variant: 'solid' | 'outline';
		affix: 'prefix' | 'suffix';
		Icon: typeof SendIcon;
	};

	const iconButtons: IconButtonConfig[] = [
		{
			id: 'primary-prefix',
			label: 'Share update',
			variant: 'solid',
			affix: 'prefix',
			Icon: SendIcon,
		},
		{
			id: 'secondary-suffix',
			label: 'Continue',
			variant: 'outline',
			affix: 'suffix',
			Icon: ArrowRightIcon,
		},
		{ id: 'success-prefix', label: 'Confirm', variant: 'solid', affix: 'prefix', Icon: CheckIcon },
	];

	const iconOnlyButtons = [
		{ id: 'settings', label: 'Open settings', Icon: SettingsIcon },
		{ id: 'play', label: 'Play media', Icon: PlayIcon },
		{ id: 'refresh', label: 'Refresh board', Icon: LoaderIcon },
	];

	const iconSnippet = `
<div class="icon-demo">
  {#each iconButtons as button (button.id)}
    <Button variant={button.variant}>
      {#if button.affix === 'prefix'}
        <button.Icon size={16} aria-hidden="true" />
      {/if}
      {button.label}
      {#if button.affix === 'suffix'}
        <button.Icon size={16} aria-hidden="true" />
      {/if}
    </Button>
  {/each}

  {#each iconOnlyButtons as item (item.id)}
    <Button aria-label={item.label} class="icon-only">
      <item.Icon size={18} aria-hidden="true" />
    </Button>
  {/each}
</div>`;

	let clickCount = $state(0);
	let saving = $state(false);
	let submissionLog = $state<string[]>(['No submissions yet']);

	async function simulateAsync() {
		if (saving) return;
		saving = true;
		await new Promise((resolve) => setTimeout(resolve, 1400));
		clickCount += 1;
		saving = false;
	}

	function handleSubmit(event: Event) {
		event.preventDefault();
		submissionLog = [`Submitted at ${new Date().toLocaleTimeString()}`, ...submissionLog].slice(
			0,
			2
		);
	}

	function handleReset() {
		submissionLog = ['Form reset via reset button', ...submissionLog].slice(0, 2);
	}

	const stateSnippet = `
<form class="button-form" onsubmit={handleSubmit} onreset={handleReset}>
  <Button type="submit" variant="solid">
    Save changes
  </Button>
  <Button type="reset" variant="outline">
    Reset form
  </Button>
  <Button type="button" loading={saving} onclick={simulateAsync}>
    Increment counter ({clickCount})
  </Button>
</form>`;
</script>

<DemoPage
	eyebrow="Component Demos"
	title={data.metadata.title}
	description={data.metadata.description}
>
	<section class="demo-section">
		<header>
			<h2>Variants &amp; Sizes</h2>
			<p>
				Solid, outline, and ghost buttons rendered directly from the published primitives package in
				every supported size.
			</p>
		</header>

		<div class="button-grid">
			{#each buttonVariantData as config (config.id)}
				<Button variant={config.variant} size={config.size} data-testid={`button-${config.id}`}>
					{config.label}
				</Button>
			{/each}
		</div>
		<p class="a11y-tip">
			Tip: Each button remains reachable via Tab order regardless of variant—confirm focus outlines
			meet contrast guidance.
		</p>

		<CodeExample
			title="Mapped button variants"
			description="Variants iterate over shared data so snippets and UI stay in sync."
			code={variantSnippet}
		/>
	</section>

	<section class="demo-section">
		<header>
			<h2>Icon Placements</h2>
			<p>
				Prefix/suffix snippets keep icon spacing aligned with the tokens package, and icon-only
				buttons carry aria-labels for assistive tech.
			</p>
		</header>

		<div class="icon-demo">
			{#each iconButtons as button (button.id)}
				<Button variant={button.variant} class="icon-affix">
					{#if button.affix === 'prefix'}
						<button.Icon size={16} aria-hidden="true" />
					{/if}
					{button.label}
					{#if button.affix === 'suffix'}
						<button.Icon size={16} aria-hidden="true" />
					{/if}
				</Button>
			{/each}
		</div>

		<div class="icon-only-row">
			{#each iconOnlyButtons as button (button.id)}
				<Button
					aria-label={button.label}
					class="icon-only"
					onclick={() => alert(`${button.label}`)}
				>
					<button.Icon size={18} aria-hidden="true" />
				</Button>
			{/each}
		</div>

		<p class="a11y-tip">
			Tip: Provide aria-labels for icon-only buttons and ensure hover/click targets are at least
			44×44px.
		</p>

		<CodeExample
			title="Icon prefix/suffix"
			description="Snippets mirror the same `Button` instances above."
			code={iconSnippet}
		/>
	</section>

	<section class="demo-section">
		<header>
			<h2>Stateful &amp; Async</h2>
			<p>
				Demonstrates button types, disabled/loading states, and a lightweight async simulation for
				user feedback.
			</p>
		</header>

		<div class="state-demo">
			<div>
				<p class="state-label">Async counter</p>
				<Button variant="solid" loading={saving} onclick={simulateAsync} data-testid="async-button">
					{saving ? 'Saving preference…' : `Increase total (${clickCount})`}
				</Button>
			</div>
			<div>
				<p class="state-label">Type handling</p>
				<form class="button-form" onsubmit={handleSubmit} onreset={handleReset}>
					<Button type="submit" variant="solid">Submit</Button>
					<Button type="reset" variant="outline">Reset</Button>
					<Button type="button" variant="ghost" onclick={() => (clickCount += 1)}
						>Secondary action</Button
					>
				</form>
				<ul class="submission-log" aria-live="polite">
					{#each submissionLog as entry (entry)}
						<li>{entry}</li>
					{/each}
				</ul>
			</div>
		</div>

		<p class="a11y-tip">
			Tip: Loading buttons automatically set `aria-busy` and remove them from tab order; communicate
			progress textually as well.
		</p>

		<CodeExample
			title="Stateful interactions"
			description="Same code powers the live example—copy to seed async tests."
			code={stateSnippet}
		/>
	</section>
</DemoPage>

<style>
	.demo-section {
		border: 1px solid var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-xl);
		padding: 2rem;
		background: var(--gr-semantic-background-primary);
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		box-shadow: 0 30px 60px rgba(15, 23, 42, 0.08);
	}

	.demo-section header h2 {
		margin-bottom: 0.25rem;
	}

	.button-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1rem;
	}

	.icon-demo,
	.icon-only-row {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	:global(.icon-only) {
		width: 48px;
		height: 48px;
		border-radius: 999px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.state-demo {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 1.5rem;
		align-items: flex-start;
	}

	.button-form {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.submission-log {
		margin: 1rem 0 0;
		padding-left: 1.25rem;
		color: var(--gr-semantic-foreground-secondary);
		font-size: var(--gr-typography-fontSize-sm);
	}

	.a11y-tip {
		margin: 0;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-semantic-foreground-secondary);
	}

	.state-label {
		margin: 0 0 0.5rem;
		font-weight: var(--gr-typography-fontWeight-medium);
	}

	@media (max-width: 640px) {
		.demo-section {
			padding: 1.5rem;
		}
	}
</style>

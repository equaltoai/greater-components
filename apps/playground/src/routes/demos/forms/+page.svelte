<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';
	import {
		TextField,
		TextArea,
		Select,
		Checkbox,
		Switch,
		FileUpload,
	} from '@equaltoai/greater-components-primitives';
	import { CheckIcon } from '@equaltoai/greater-components-icons';
	import type { DemoPageData } from '$lib/types/demo';

	let { data }: { data: DemoPageData } = $props();

	let displayName = $state('');
	let email = $state('');
	let emailTouched = $state(false);
	const isDisplayNameInvalid = $derived(
		() => displayName.trim().length > 0 && displayName.trim().length < 2
	);
	const emailValid = $derived(() => /.+@.+\..+/.test(email));

	const textInputSnippet = `
<div class="text-inputs">
  <TextField
    label="Display name"
    bind:value={displayName}
    required
    helpText="Shown on profiles and mentions."
    invalid={isDisplayNameInvalid}
    errorMessage="Use at least two characters."
  />
  <TextField
    label="Contact email"
    type="email"
    bind:value={email}
    placeholder="you@example.com"
    invalid={!emailValid && emailTouched}
    errorMessage="Enter a valid email so recovery links work."
  />
</div>`;

	let bio = $state('Greater Components ships with strong defaults.');
	const bioLimit = 280;
	const remaining = $derived(() => Math.max(0, bioLimit - bio.length));
	const dynamicRows = $derived(() => Math.min(10, Math.max(4, Math.ceil(bio.length / 60))));

	const bioSnippet = `
<label for="bio-field">Bio</label>
<TextArea
  id="bio-field"
  bind:value={bio}
  rows={dynamicRows}
  maxlength={bioLimit}
  placeholder="Share what admins should know…"
/>
<p aria-live="polite">{remaining} characters left</p>`;

	const countries = [
		{ value: '', label: 'Select a region' },
		{ value: 'us', label: 'United States' },
		{ value: 'uk', label: 'United Kingdom' },
		{ value: 'br', label: 'Brazil', disabled: true },
		{ value: 'de', label: 'Germany' },
		{ value: 'jp', label: 'Japan' },
	];

	let country = $state('');
	let radioChoice = $state<'public' | 'followers' | 'private'>('public');

	const selectSnippet = `
<label for="visibility-select">Default visibility</label>
<Select
  id="visibility-select"
  placeholder="Pick visibility"
  options={countries}
  bind:value={country}
/>
<fieldset role="radiogroup" aria-label="Audience">
  {#each ['public', 'followers', 'private'] as option}
    <label>
      <input
        type="radio"
        name="audience"
        value={option}
        bind:group={radioChoice}
      />
      {option}
    </label>
  {/each}
</fieldset>`;

	let newsletter = $state(true);
	let betaAccess = $state(false);
	let darkMode = $state(true);

	const toggleSnippet = `
<div class="toggle-stack">
  <Checkbox bind:checked={newsletter} label="Release newsletter" />
  <Checkbox bind:checked={betaAccess} label="Join beta" />
  <Switch bind:checked={darkMode} label="Dark mode" />
  <Switch checked={false} disabled label="Switch disabled" />
</div>`;

	let uploadedFiles = $state<File[]>([]);
	let dropActive = $state(false);

	function handleFileChange(list: FileList | null) {
		uploadedFiles = list ? Array.from(list) : [];
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dropActive = false;
		const dropped = event.dataTransfer?.files;
		if (dropped) {
			uploadedFiles = Array.from(dropped);
		}
	}

	const uploadSnippet = `
<div class="drop-surface" ondragover={(event) => event.preventDefault()} ondragenter={() => (dropActive = true)} ondragleave={() => (dropActive = false)} ondrop={handleDrop} role="region">
  <p class="select-label">Attachments</p>
  <FileUpload multiple accept="image/*" onchange={(files) => handleFileChange(files)} />
  <p>Drag files here or use the button.</p>
</div>
<ul>
  {#each uploadedFiles as file}
    <li>{file.name}</li>
  {/each}
</ul>`;
</script>

<DemoPage
	eyebrow="Component Demos"
	title={data.metadata.title}
	description={data.metadata.description}
>
	<section class="demo-section">
		<header>
			<h2>Text Inputs &amp; Validation</h2>
			<p>Showcases helper text, inline errors, prefix icons, and required indicators.</p>
		</header>

		<div class="text-inputs">
			<TextField
				label="Display name"
				bind:value={displayName}
				required
				helpText="Shown on profiles and mentions."
				invalid={isDisplayNameInvalid}
				errorMessage="Use at least two characters."
			>
				{#snippet suffix()}
					{#if !isDisplayNameInvalid && displayName.trim().length >= 2}
						<CheckIcon size={16} aria-hidden="true" />
					{/if}
				{/snippet}
			</TextField>

			<TextField
				label="Contact email"
				type="email"
				bind:value={email}
				placeholder="you@example.com"
				invalid={!emailValid && emailTouched}
				errorMessage="Enter a valid email so recovery links work."
				onblur={() => (emailTouched = true)}
			/>
		</div>

		<p class="a11y-tip">
			Accessible pattern: help text is tied via aria-describedby and errors announce with
			role="alert" when invalid.
		</p>

		<CodeExample
			title="TextField usage"
			description="Snippet mirrors the bindings powering this section."
			code={textInputSnippet}
		/>
	</section>

	<section class="demo-section">
		<header>
			<h2>TextArea Auto-Resize</h2>
			<p>Dynamic rows and character counting keep longer bios readable without new dependencies.</p>
		</header>

		<label class="textarea-label" for="bio-field">Bio</label>
		<TextArea
			id="bio-field"
			bind:value={bio}
			rows={dynamicRows}
			maxlength={bioLimit}
			placeholder="Share what admins should know…"
		/>
		<div class="character-meta">
			<span>{dynamicRows} rows</span>
			<span aria-live="polite">{remaining} characters left</span>
		</div>

		<p class="a11y-tip">
			Tip: keep aria-live polite for counters so screen readers announce only when values change.
		</p>

		<CodeExample
			title="Auto-resize TextArea"
			description="Rows derive from the same derived store used by the live textarea."
			code={bioSnippet}
		/>
	</section>

	<section class="demo-section">
		<header>
			<h2>Select &amp; Radio Inputs</h2>
			<p>Placeholder guidance, disabled options, and a native radio group with keyboard hints.</p>
		</header>

		<div class="choice-grid">
			<div class="select-field">
				<label class="select-label" for="visibility-select">Default visibility</label>
				<Select
					id="visibility-select"
					placeholder="Pick visibility"
					options={countries}
					bind:value={country}
				/>
			</div>
			<fieldset class="radio-group" role="radiogroup" aria-label="Audience">
				<legend>Audience</legend>
				{#each ['public', 'followers', 'private'] as option (option)}
					<label>
						<input type="radio" name="audience" value={option} bind:group={radioChoice} />
						<span class:active={radioChoice === option}>{option}</span>
					</label>
				{/each}
			</fieldset>
		</div>

		<p class="a11y-tip">
			Keyboard: Up/Down cycles radios while typing the first letter jumps via native typeahead.
			Disabled select options remain unreachable.
		</p>

		<CodeExample
			title="Select + radio"
			description="Native radio inputs pair with Greater Select for full coverage."
			code={selectSnippet}
		/>
	</section>

	<section class="demo-section">
		<header>
			<h2>Toggles &amp; Switches</h2>
			<p>Mixed checkbox and switch controls show indies vs binary preferences.</p>
		</header>

		<div class="toggle-stack">
			<Checkbox bind:checked={newsletter} label="Release newsletter" />
			<Checkbox bind:checked={betaAccess} label="Join beta" />
			<Switch bind:checked={darkMode} label="Dark mode" />
			<Switch checked={false} disabled label="Switch disabled" />
		</div>

		<p class="a11y-tip">
			Space toggles the focused checkbox or switch; disabled switches remove themselves from the tab
			order.
		</p>

		<CodeExample
			title="Checkbox + Switch"
			description="Live bindings keep snippet parity."
			code={toggleSnippet}
		/>
	</section>

	<section class="demo-section">
		<header>
			<h2>File Upload &amp; Drag-and-Drop</h2>
			<p>
				Wrap the published FileUpload control with a drag surface for richer UX while keeping drag
				events in user land.
			</p>
		</header>

		<div
			class="drop-surface"
			class:active={dropActive}
			ondragover={(event) => event.preventDefault()}
			ondragenter={() => (dropActive = true)}
			ondragleave={() => (dropActive = false)}
			ondrop={handleDrop}
			aria-label="Upload files"
			role="region"
		>
			<p class="select-label">Attachments</p>
			<FileUpload multiple accept="image/*" onchange={handleFileChange} />
			<p>Drag files here or use the button. Up to 4 files.</p>
		</div>

		{#if uploadedFiles.length > 0}
			<ul class="file-list">
				{#each uploadedFiles as file (file.name)}
					<li>
						<strong>{file.name}</strong>
						<span>{Math.round(file.size / 1024)} KB &middot; {file.type || 'Unknown type'}</span>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="placeholder">No files selected.</p>
		{/if}

		<CodeExample
			title="Drag surface + FileUpload"
			description="Drop zone delegates to FileUpload so uploads continue to flow through the published component."
			code={uploadSnippet}
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
		gap: 1.25rem;
	}

	.text-inputs {
		display: grid;
		gap: 1rem;
	}

	.textarea-label {
		font-weight: var(--gr-typography-fontWeight-medium);
		color: var(--gr-semantic-foreground-secondary);
	}

	.character-meta {
		display: flex;
		justify-content: space-between;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-semantic-foreground-secondary);
	}

	.choice-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1.5rem;
	}

	.select-field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.select-label {
		font-weight: var(--gr-typography-fontWeight-medium);
		color: var(--gr-semantic-foreground-secondary);
	}

	.radio-group {
		border: 1px solid var(--gr-semantic-border-subtle);
		border-radius: var(--gr-radii-lg);
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.radio-group label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-transform: capitalize;
	}

	.radio-group input[type='radio'] {
		accent-color: var(--gr-semantic-action-primary-default);
	}

	.radio-group span.active {
		font-weight: var(--gr-typography-fontWeight-medium);
	}

	.toggle-stack {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.drop-surface {
		border: 2px dashed var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-xl);
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		text-align: center;
		transition:
			border-color 120ms ease,
			background 120ms ease;
	}

	.drop-surface.active {
		border-color: var(--gr-semantic-action-primary-default);
		background: var(--gr-semantic-background-secondary);
	}

	.file-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.file-list li {
		display: flex;
		justify-content: space-between;
		font-size: var(--gr-typography-fontSize-sm);
		border-bottom: 1px solid var(--gr-semantic-border-subtle);
		padding-bottom: 0.25rem;
	}

	.placeholder,
	.a11y-tip {
		color: var(--gr-semantic-foreground-secondary);
		font-size: var(--gr-typography-fontSize-sm);
		margin: 0;
	}

	@media (max-width: 640px) {
		.demo-section {
			padding: 1.5rem;
		}
	}
</style>

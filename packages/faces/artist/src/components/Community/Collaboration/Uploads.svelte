<!--
Collaboration.Uploads - File upload and asset management

@component
-->

<script lang="ts">
	import { getCollaborationContext, canUpload } from './context.js';

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const ctx = getCollaborationContext();
	const { collaboration, config, handlers } = ctx;

	// Permission check
	const userCanUpload = $derived(canUpload(ctx));

	// File input ref
	let fileInput = $state<HTMLInputElement>();

	// Handle file selection
	async function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		const files = input.files;
		if (!files?.length) return;

		ctx.isUploading = true;
		try {
			for (const file of files) {
				await handlers.onUploadAsset?.(collaboration, file);
			}
		} finally {
			ctx.isUploading = false;
			if (input) {
				// Add null check for fileInput
				input.value = '';
			}
		}
	}

	// Handle drag and drop
	function handleDrop(event: DragEvent) {
		event.preventDefault();
		const files = event.dataTransfer?.files;
		if (!files?.length || !userCanUpload || !fileInput) return;

		// Trigger upload
		const dataTransfer = new DataTransfer();
		for (const file of files) {
			dataTransfer.items.add(file);
		}
		fileInput.files = dataTransfer.files;
		fileInput.dispatchEvent(new Event('change'));
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
	}
</script>

{#if config.showUploads}
	<div class={`collab-uploads ${className}`}>
		<h3 class="collab-uploads__title">Shared Assets</h3>

		<!-- Upload area -->
		{#if userCanUpload}
			<div
				class="collab-uploads__dropzone"
				class:uploading={ctx.isUploading}
				ondrop={handleDrop}
				ondragover={handleDragOver}
				role="button"
				tabindex="0"
				aria-label="Upload files"
			>
				<input
					bind:this={fileInput}
					type="file"
					multiple
					onchange={handleFileSelect}
					class="collab-uploads__input"
					accept="image/*,.psd,.ai,.svg,.pdf"
				/>
				{#if ctx.isUploading}
					<span>Uploading...</span>
				{:else}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="collab-uploads__icon">
						<path
							d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<span>Drop files here or click to upload</span>
					<span class="collab-uploads__hint">Images, PSD, AI, SVG, PDF</span>
				{/if}
			</div>
		{/if}

		<!-- Asset list -->
		<div class="collab-uploads__list">
			{#if !collaboration.sharedAssets?.length}
				<p class="collab-uploads__empty">No shared assets yet.</p>
			{:else}
				{#each collaboration.sharedAssets as asset (asset.id)}
					<button
						type="button"
						class="collab-uploads__asset"
						class:selected={ctx.selectedAsset === asset.id}
						onclick={() => (ctx.selectedAsset = ctx.selectedAsset === asset.id ? null : asset.id)}
					>
						<div class="collab-uploads__asset-preview">
							{#if asset.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)}
								<img src={asset.url} alt={asset.name} />
							{:else}
								<div class="collab-uploads__asset-icon">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
										<path
											d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
										<polyline
											points="14,2 14,8 20,8"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</div>
							{/if}
						</div>
						<div class="collab-uploads__asset-info">
							<span class="collab-uploads__asset-name">{asset.name}</span>
							<span class="collab-uploads__asset-meta">
								by {asset.uploadedBy} • {new Date(asset.uploadedAt).toLocaleDateString()}
							</span>
						</div>
					</button>
				{/each}
			{/if}
		</div>
	</div>
{/if}

<style>
	.collab-uploads {
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radius-lg);
		padding: var(--gr-spacing-scale-5);
	}

	.collab-uploads__title {
		font-size: var(--gr-font-size-lg);
		font-weight: var(--gr-font-weight-semibold);
		margin: 0 0 var(--gr-spacing-scale-4) 0;
	}

	.collab-uploads__dropzone {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-8);
		border: 2px dashed var(--gr-color-gray-600);
		border-radius: var(--gr-radius-lg);
		cursor: pointer;
		transition:
			border-color 0.2s,
			background 0.2s;
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.collab-uploads__dropzone:hover {
		border-color: var(--gr-color-primary-500);
		background: var(--gr-color-gray-700);
	}

	.collab-uploads__dropzone.uploading {
		border-color: var(--gr-color-primary-500);
		background: var(--gr-color-primary-900);
	}

	.collab-uploads__input {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
	}

	.collab-uploads__icon {
		width: 48px;
		height: 48px;
		color: var(--gr-color-gray-400);
	}

	.collab-uploads__hint {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-500);
	}

	.collab-uploads__list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: var(--gr-spacing-scale-3);
	}

	.collab-uploads__empty {
		grid-column: 1 / -1;
		text-align: center;
		color: var(--gr-color-gray-400);
		padding: var(--gr-spacing-scale-6);
	}

	.collab-uploads__asset {
		display: flex;
		flex-direction: column;
		background: var(--gr-color-gray-700);
		border: 2px solid transparent;
		border-radius: var(--gr-radius-md);
		overflow: hidden;
		cursor: pointer;
		text-align: left;
		transition: border-color 0.2s;
	}

	.collab-uploads__asset:hover {
		border-color: var(--gr-color-gray-500);
	}

	.collab-uploads__asset.selected {
		border-color: var(--gr-color-primary-500);
	}

	.collab-uploads__asset-preview {
		aspect-ratio: 1;
		background: var(--gr-color-gray-600);
		overflow: hidden;
	}

	.collab-uploads__asset-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.collab-uploads__asset-icon {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.collab-uploads__asset-icon svg {
		width: 48px;
		height: 48px;
		color: var(--gr-color-gray-400);
	}

	.collab-uploads__asset-info {
		padding: var(--gr-spacing-scale-2);
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-1);
	}

	.collab-uploads__asset-name {
		font-size: var(--gr-font-size-sm);
		font-weight: var(--gr-font-weight-medium);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.collab-uploads__asset-meta {
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-400);
	}

	@media (prefers-reduced-motion: reduce) {
		.collab-uploads__dropzone,
		.collab-uploads__asset {
			transition: none;
		}
	}
</style>

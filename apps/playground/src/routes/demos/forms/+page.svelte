<script lang="ts">
	import {
		TextField,
		TextArea,
		Select,
		Checkbox,
		Switch,
		FileUpload,
		Button,
		Avatar,
		Skeleton,
		Tooltip
	} from '@equaltoai/greater-components-primitives';

	// Form state
	let name = $state('');
	let email = $state('');
	let bio = $state('');
	let country = $state('');
	let newsletter = $state(false);
	let darkMode = $state(false);
	let notifications = $state(true);
	let files = $state<File[]>([]);

	const countries = [
		{ value: '', label: 'Select a country' },
		{ value: 'us', label: 'United States' },
		{ value: 'uk', label: 'United Kingdom' },
		{ value: 'ca', label: 'Canada' },
		{ value: 'au', label: 'Australia' },
		{ value: 'de', label: 'Germany' }
	];

	function handleSubmit() {
		console.log({ name, email, bio, country, newsletter, darkMode, notifications, files });
		alert('Form submitted! Check console for values.');
	}

	function handleFileChange(newFiles: File[]) {
		files = newFiles;
	}
</script>

<div class="forms-demo-page">
	<header>
		<h1>Form Components Demo</h1>
		<p>Interactive demonstration of all form primitives with validation and state management.</p>
	</header>

	<section class="demo-form" data-testid="form-demo">
		<h2>User Profile Form</h2>

		<div class="form-row">
			<TextField
				bind:value={name}
				label="Name"
				placeholder="Enter your name"
				required
				data-testid="name-field"
			/>
		</div>

		<div class="form-row">
			<TextField
				bind:value={email}
				type="email"
				label="Email"
				placeholder="user@example.com"
				required
				data-testid="email-field"
			/>
		</div>

		<div class="form-row">
			<TextArea
				bind:value={bio}
				label="Bio"
				placeholder="Tell us about yourself..."
				rows={4}
				data-testid="bio-field"
			/>
		</div>

		<div class="form-row">
			<Select
				bind:value={country}
				label="Country"
				options={countries}
				data-testid="country-select"
			/>
		</div>

		<div class="form-row checkbox-row">
			<Checkbox
				bind:checked={newsletter}
				label="Subscribe to newsletter"
				data-testid="newsletter-checkbox"
			/>
		</div>

		<div class="form-row switch-row">
			<Switch
				bind:checked={darkMode}
				label="Dark Mode"
				data-testid="dark-mode-switch"
			/>
		</div>

		<div class="form-row switch-row">
			<Switch
				bind:checked={notifications}
				label="Enable Notifications"
				data-testid="notifications-switch"
			/>
		</div>

		<div class="form-row">
			<FileUpload
				label="Upload Avatar"
				accept="image/*"
				multiple={false}
				onFilesChange={handleFileChange}
				data-testid="file-upload"
			/>
			{#if files.length > 0}
				<p class="file-info" data-testid="file-info">
					Selected: {files[0].name} ({Math.round(files[0].size / 1024)}KB)
				</p>
			{/if}
		</div>

		<div class="form-actions">
			<Button onclick={handleSubmit} data-testid="submit-button">
				Submit Form
			</Button>
			<Button
				variant="outline"
				onclick={() => {
					name = '';
					email = '';
					bio = '';
					country = '';
					newsletter = false;
					darkMode = false;
					notifications = true;
					files = [];
				}}
				data-testid="reset-button"
			>
				Reset
			</Button>
		</div>
	</section>

	<section class="avatar-demo" data-testid="avatar-demo">
		<h2>Avatar Component</h2>
		<div class="avatar-grid">
			<div class="avatar-item">
				<Avatar
					src="https://i.pravatar.cc/150?img=1"
					alt="User Avatar"
					size="sm"
					data-testid="avatar-small"
				/>
				<p>Small</p>
			</div>
			<div class="avatar-item">
				<Avatar
					src="https://i.pravatar.cc/150?img=2"
					alt="User Avatar"
					size="md"
					data-testid="avatar-medium"
				/>
				<p>Medium</p>
			</div>
			<div class="avatar-item">
				<Avatar
					src="https://i.pravatar.cc/150?img=3"
					alt="User Avatar"
					size="lg"
					data-testid="avatar-large"
				/>
				<p>Large</p>
			</div>
			<div class="avatar-item">
				<Avatar alt="No Image" size="md" data-testid="avatar-fallback" />
				<p>Fallback</p>
			</div>
		</div>
	</section>

	<section class="skeleton-demo" data-testid="skeleton-demo">
		<h2>Skeleton Component</h2>
		<p>Loading states for content placeholders</p>
		<div class="skeleton-examples">
			<Skeleton width="100%" height="20px" data-testid="skeleton-text" />
			<Skeleton width="60%" height="20px" />
			<Skeleton width="80%" height="40px" />
			<Skeleton variant="circle" width="50px" height="50px" data-testid="skeleton-circle" />
		</div>
	</section>

	<section class="tooltip-demo" data-testid="tooltip-demo">
		<h2>Tooltip Component</h2>
		<div class="tooltip-examples">
			<Tooltip content="This is a helpful tooltip">
				<Button data-testid="tooltip-button">Hover me</Button>
			</Tooltip>
		</div>
	</section>
</div>

<style>
	.forms-demo-page {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	header {
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	h2 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}

	section {
		margin-bottom: 3rem;
		padding: 2rem;
		border: 1px solid var(--color-border, #e0e0e0);
		border-radius: 8px;
		background: var(--color-surface, white);
	}

	.form-row {
		margin-bottom: 1.5rem;
	}

	.checkbox-row,
	.switch-row {
		display: flex;
		align-items: center;
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
	}

	.file-info {
		margin-top: 0.5rem;
		font-size: 0.875rem;
		color: var(--color-text-secondary, #666);
	}

	.avatar-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
		gap: 2rem;
	}

	.avatar-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.skeleton-examples {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.tooltip-examples {
		display: flex;
		gap: 1rem;
	}
</style>

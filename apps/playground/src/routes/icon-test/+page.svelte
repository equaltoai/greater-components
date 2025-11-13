<script lang="ts">
	import { HomeIcon, BuildingIcon, ListIcon, BellIcon, UserIcon } from '@equaltoai/greater-components-icons';
</script>

<div class="icon-test">
	<h1>Icon Test</h1>
	
	<section>
		<h2>New Icons for Navigation</h2>
		<div class="icon-grid">
			<div class="icon-card">
				<HomeIcon size={48} />
				<p>Home Icon</p>
			</div>
			<div class="icon-card highlight">
				<BuildingIcon size={48} />
				<p>Building Icon (NEW)</p>
			</div>
			<div class="icon-card highlight">
				<ListIcon size={48} />
				<p>List Icon (NEW)</p>
			</div>
			<div class="icon-card">
				<BellIcon size={48} />
				<p>Bell Icon</p>
			</div>
			<div class="icon-card">
				<UserIcon size={48} />
				<p>User Icon</p>
			</div>
		</div>
	</section>

	<section>
		<h2>Size Variations</h2>
		<div class="size-row">
			<BuildingIcon size={16} />
			<BuildingIcon size={24} />
			<BuildingIcon size={32} />
			<BuildingIcon size={48} />
			<BuildingIcon size={64} />
		</div>
	</section>

	<section>
		<h2>Usage Example</h2>
		<nav class="demo-nav">
			<button class="nav-btn active">
				<HomeIcon size={24} />
				<span>Home</span>
			</button>
			<button class="nav-btn">
				<BuildingIcon size={24} />
				<span>Local</span>
			</button>
			<button class="nav-btn">
				<ListIcon size={24} />
				<span>Lists</span>
			</button>
		</nav>
	</section>
</div>

<style>
	.icon-test {
		padding: 2rem;
		max-width: 1000px;
		margin: 0 auto;
	}

	section {
		margin: 3rem 0;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 2rem;
	}

	h2 {
		font-size: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.icon-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 2rem;
	}

	.icon-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 2rem;
		border: 2px solid #e1e8ed;
		border-radius: 12px;
		transition: all 0.2s;
	}

	.icon-card.highlight {
		border-color: #1d9bf0;
		background: #f0f9ff;
	}

	.icon-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.icon-card p {
		margin: 0;
		font-weight: 600;
		text-align: center;
	}

	.size-row {
		display: flex;
		align-items: center;
		gap: 2rem;
		padding: 2rem;
		background: #f7f9fa;
		border-radius: 8px;
	}

	.demo-nav {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-width: 300px;
	}

	.nav-btn {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.875rem 1rem;
		background: transparent;
		border: none;
		border-radius: 12px;
		font-size: 1.125rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
		text-align: left;
	}

	.nav-btn:hover {
		background: #f7f9fa;
	}

	.nav-btn.active {
		background: #dbeafe;
		color: #1d9bf0;
	}
</style>


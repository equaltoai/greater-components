<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer class="docs-footer">
	<div class="footer-container">
		<div class="footer-content">
			<div class="footer-section">
				<h3>Resources</h3>
				<ul>
					<li><a href="/guides">Documentation</a></li>
					<li><a href="/components">Components</a></li>
					<li><a href="/api">API Reference</a></li>
					<li><a href="/changelog">Changelog</a></li>
				</ul>
			</div>
			
			<div class="footer-section">
				<h3>Community</h3>
				<ul>
					<li><a href="https://github.com/greater-components/greater-components" target="_blank" rel="noopener noreferrer">GitHub</a></li>
					<li><a href="/guides/contributing">Contributing</a></li>
					<li><a href="https://discord.gg/greater-components" target="_blank" rel="noopener noreferrer">Discord</a></li>
					<li><a href="/support">Support</a></li>
				</ul>
			</div>
			
			<div class="footer-section">
				<h3>More</h3>
				<ul>
					<li><a href="/blog">Blog</a></li>
					<li><a href="/roadmap">Roadmap</a></li>
					<li><a href="/showcase">Showcase</a></li>
					<li><a href="/license">License</a></li>
				</ul>
			</div>
			
			<div class="footer-section">
				<h3>Greater Components</h3>
				<p>A comprehensive design system and component library for modern web applications.</p>
				<p class="version">Version 0.1.0</p>
			</div>
		</div>
		
		<div class="footer-bottom">
			<p>&copy; {currentYear} Greater Components. MIT License.</p>
			<p>Built with Svelte 5 and lots of care.</p>
		</div>
	</div>
</footer>

<style>
	.docs-footer {
		background: var(--doc-surface-secondary);
		border-top: 1px solid var(--doc-border);
		margin-top: 4rem;
	}
	
	.footer-container {
		max-width: var(--doc-content-max-width);
		margin: 0 auto;
		padding: 2rem 1rem;
	}
	
	.footer-content {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 2rem;
		margin-bottom: 2rem;
	}
	
	.footer-section h3 {
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.025em;
		margin-bottom: 1rem;
		opacity: 0.8;
	}
	
	.footer-section ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	
	.footer-section li {
		margin-bottom: 0.5rem;
	}
	
	.footer-section a {
		color: var(--doc-text);
		text-decoration: none;
		opacity: 0.7;
		transition: opacity 0.2s;
	}
	
	.footer-section a:hover {
		opacity: 1;
	}
	
	.footer-section p {
		margin-bottom: 0.5rem;
		opacity: 0.8;
	}
	
	.footer-section .version {
		font-size: 0.875rem;
		opacity: 0.6;
	}
	
	.footer-bottom {
		padding-top: 2rem;
		border-top: 1px solid var(--doc-border);
		display: flex;
		justify-content: space-between;
		align-items: center;
		opacity: 0.6;
		font-size: 0.875rem;
	}
	
	@media (max-width: 768px) {
		.footer-bottom {
			flex-direction: column;
			gap: 0.5rem;
			text-align: center;
		}
	}
</style>
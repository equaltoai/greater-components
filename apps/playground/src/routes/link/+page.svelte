<script lang="ts">
	import { Link, Text, Heading } from '@equaltoai/greater-components-primitives';

	let navigationLog = $state<string[]>([]);

	function fakeNavigate(ev: MouseEvent, href: string) {
		ev.preventDefault();
		navigationLog = [
			`${new Date().toLocaleTimeString()} — would navigate to: ${href}`,
			...navigationLog.slice(0, 9),
		];
	}
</script>

<div class="link-demo">
	<Heading level="1">Link primitive</Heading>
	<Text>
		Semantic anchor for in-app navigation. Preserves browser link affordances (right-click,
		middle-click, Cmd/Ctrl-click) while integrating with SPA routers via a modifier-key-gated <code
			>onnavigate</code
		> callback.
	</Text>

	<section>
		<Heading level="2">Variants &times; sizes</Heading>
		<Text>
			Four variants. Three sizes apply to all variants except <code>inline</code>.
		</Text>

		<div class="grid">
			<div class="row">
				<Heading level="3">default</Heading>
				<Link href="https://example.test/demo/default/sm" size="sm" onnavigate={fakeNavigate}
					>Small</Link
				>
				<Link href="https://example.test/demo/default/md" size="md" onnavigate={fakeNavigate}
					>Medium</Link
				>
				<Link href="https://example.test/demo/default/lg" size="lg" onnavigate={fakeNavigate}
					>Large</Link
				>
			</div>

			<div class="row">
				<Heading level="3">ghost</Heading>
				<Link
					href="https://example.test/demo/ghost/sm"
					variant="ghost"
					size="sm"
					onnavigate={fakeNavigate}>Small</Link
				>
				<Link
					href="https://example.test/demo/ghost/md"
					variant="ghost"
					size="md"
					onnavigate={fakeNavigate}>Medium</Link
				>
				<Link
					href="https://example.test/demo/ghost/lg"
					variant="ghost"
					size="lg"
					onnavigate={fakeNavigate}>Large</Link
				>
			</div>

			<div class="row">
				<Heading level="3">subtle</Heading>
				<Link
					href="https://example.test/demo/subtle/sm"
					variant="subtle"
					size="sm"
					onnavigate={fakeNavigate}>Small</Link
				>
				<Link
					href="https://example.test/demo/subtle/md"
					variant="subtle"
					size="md"
					onnavigate={fakeNavigate}>Medium</Link
				>
				<Link
					href="https://example.test/demo/subtle/lg"
					variant="subtle"
					size="lg"
					onnavigate={fakeNavigate}>Large</Link
				>
			</div>
		</div>
	</section>

	<section>
		<Heading level="2">In-app SPA navigation</Heading>
		<Text>
			Click the link below normally and the <code>onnavigate</code> callback intercepts. Cmd/Ctrl-click,
			middle-click, or right-click pass through to native browser behavior so the user can still "Open
			in new tab" etc.
		</Text>
		<div class="row">
			<Link
				href="https://example.test/portal/instances/demo-instance/budgets"
				onnavigate={fakeNavigate}
			>
				Budgets (legacy)
			</Link>
			<Link
				href="https://example.test/portal/instances/demo-instance/usage"
				onnavigate={fakeNavigate}
			>
				Usage (legacy)
			</Link>
		</div>

		<Heading level="3">Navigation log</Heading>
		{#if navigationLog.length === 0}
			<Text>No navigations yet — click a link above.</Text>
		{:else}
			<ul class="log">
				{#each navigationLog as entry (entry)}
					<li>{entry}</li>
				{/each}
			</ul>
		{/if}
	</section>

	<section>
		<Heading level="2">External link (target=_blank)</Heading>
		<Text>
			When <code>target="_blank"</code> is set without a consumer-supplied <code>rel</code>, Link
			auto-injects <code>rel="noopener noreferrer"</code> to prevent reverse tabnabbing.
		</Text>
		<div class="row">
			<Link href="https://developer.mozilla.org/" target="_blank" variant="default">
				MDN (new tab)
			</Link>
			<Link href="https://www.w3.org/TR/wai-aria-1.2/" target="_blank" variant="ghost">
				WAI-ARIA 1.2 (new tab)
			</Link>
		</div>
	</section>

	<section>
		<Heading level="2">Inline link inside body text</Heading>
		<Text>
			Use <code>variant="inline"</code> for links that appear in body text. The inline variant inherits
			font size and family from its surroundings and underlines by default.
		</Text>
		<Text>
			See the <Link
				href="https://example.test/portal/usage"
				variant="inline"
				onnavigate={fakeNavigate}>Usage</Link
			>
			page for current consumption, or
			<Link href="https://docs.example.com" target="_blank" variant="inline">
				external documentation</Link
			>
			for deeper reference. Inline links work mid-sentence without breaking the line flow.
		</Text>
	</section>

	<section>
		<Heading level="2">Active route (aria-current="page")</Heading>
		<Text>
			Consumers wire <code>aria-current="page"</code> from their router's active-route state. Link
			applies a <code>[aria-current="page"]</code> CSS hook for distinct visual treatment (bolder font-weight
			by default).
		</Text>
		<div class="row">
			<Link href="https://example.test/demo/current" aria-current="page" onnavigate={fakeNavigate}>
				Current page
			</Link>
			<Link href="https://example.test/demo/other" onnavigate={fakeNavigate}>Other page</Link>
			<Link href="https://example.test/demo/another" onnavigate={fakeNavigate}>Another page</Link>
		</div>
	</section>

	<section>
		<Heading level="2">Download attribute</Heading>
		<Text>
			Standard <code>download</code> attribute is forwarded. Useful for Trust-API public attestation JSON,
			provisioning-recovery log bundles, usage-CSV exports, etc.
		</Text>
		<div class="row">
			<Link
				href="data:text/plain;charset=utf-8,Hello%20from%20greater-components"
				download="hello.txt"
				variant="ghost"
			>
				Download hello.txt
			</Link>
		</div>
	</section>

	<section>
		<Heading level="2">Deliberate non-features</Heading>
		<Text>Two things Link intentionally does NOT do:</Text>
		<ul>
			<li>
				<strong>No Space-key activation.</strong> Space on <code>&lt;a&gt;</code> is intentionally not
				native (Space scrolls the page). Intercepting it would be an a11y anti-pattern that surprises
				users mid-typing.
			</li>
			<li>
				<strong>No <code>disabled</code> prop.</strong> Disabled navigation is an a11y anti-pattern; consumers
				should remove the link or use a different affordance when navigation is unavailable.
			</li>
		</ul>
	</section>
</div>

<style>
	.link-demo {
		padding: 2rem;
		max-width: 900px;
		margin: 0 auto;
	}

	section {
		margin: 2.5rem 0;
		padding: 1.5rem;
		border: 1px solid var(--gr-semantic-border-default, #ddd);
		border-radius: var(--gr-radii-md, 8px);
		background: var(--gr-semantic-background-primary, transparent);
	}

	.grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1rem;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
		margin: 0.75rem 0;
	}

	.log {
		font-family: var(--gr-typography-fontFamily-mono, monospace);
		font-size: 0.875rem;
		padding-left: 1.25rem;
		margin: 0.5rem 0 0;
		list-style: none;
	}

	.log li {
		padding: 0.25rem 0;
		border-bottom: 1px solid var(--gr-semantic-border-subtle, #f0f0f0);
	}

	code {
		font-family: var(--gr-typography-fontFamily-mono, monospace);
		font-size: 0.875em;
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		background: var(--gr-semantic-background-secondary, #f0f0f0);
	}
</style>

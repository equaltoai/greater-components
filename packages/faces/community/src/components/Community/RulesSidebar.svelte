<!--
Community.RulesSidebar - Display community rules
-->

<script lang="ts">
	import { getCommunityContext } from './context.js';

	const { community, config } = getCommunityContext();
</script>

{#if config.showRules && community.rules.length > 0}
	<aside class="gr-community-rules" aria-label="Community rules">
		<h2 class="gr-community-rules__title">Rules</h2>
		<div class="gr-community-rules__list">
			{#each community.rules as rule (rule.order)}
				<div class="gr-community-rule">
					<div class="gr-community-rule__number">{rule.order}</div>
					<div class="gr-community-rule__content">
						<div class="gr-community-rule__title">{rule.title}</div>
						<p class="gr-community-rule__description">{rule.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</aside>
{/if}

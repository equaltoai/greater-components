<!--
Community.Header - Community heading block
-->

<script lang="ts">
	import { getCommunityContext } from './context.js';

	const { community, config, handlers, isSubscribed } = getCommunityContext();

	async function toggleSubscription() {
		if (isSubscribed) {
			await handlers.onUnsubscribe?.(community.id);
		} else {
			await handlers.onSubscribe?.(community.id);
		}
	}
</script>

<header class="gr-community-header">
	{#if community.bannerUrl}
		<img class="gr-community-header__banner" src={community.bannerUrl} alt="" loading="lazy" />
	{:else}
		<div class="gr-community-header__banner gr-community-header__banner--placeholder" aria-hidden="true" />
	{/if}

	<div class="gr-community-header__info">
		{#if community.iconUrl}
			<img class="gr-community-header__icon" src={community.iconUrl} alt="" loading="lazy" />
		{:else}
			<div class="gr-community-header__icon" aria-hidden="true" />
		{/if}

		<div class="gr-community-header__details">
			<h1 class="gr-community-header__name">{community.title}</h1>
			<p class="gr-community-header__title">r/{community.name}</p>

			{#if config.showStats}
				<div class="gr-community-header__stats" aria-label="Community stats">
					<span>
						<span class="gr-community-header__stat-value">
							{community.stats.subscriberCount.toLocaleString()}
						</span>
						members
					</span>
					<span>
						<span class="gr-community-header__stat-value">
							{community.stats.activeCount.toLocaleString()}
						</span>
						online
					</span>
				</div>
			{/if}
		</div>

		{#if handlers.onSubscribe || handlers.onUnsubscribe}
			<button type="button" class="gr-community-header__subscribe" onclick={toggleSubscription}>
				{isSubscribed ? 'Joined' : 'Join'}
			</button>
		{/if}
	</div>
</header>

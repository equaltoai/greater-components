<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';
	import { ArtistProfile } from '@equaltoai/greater-components-artist/components/ArtistProfile';
	import { profileData } from '$lib/data/artist';
    import { page } from '$app/stores';
	
	let isEditing = $state(false);
    const username = $derived($page.params.username);

    const profileExample = `
// Dynamic route: /artist/[username]
<ArtistProfile.Root artist={profileData} isOwnProfile={false}>
  ...
</ArtistProfile.Root>`;
</script>

<DemoPage
	eyebrow="Artist Face / Profile"
	title={`Artist Profile: ${username}`}
	description="Dynamic profile view for an artist."
>
	<section class="demo-section">
		<div class="demo-container">
            <div class="profile-wrapper">
                <ArtistProfile.Root artist={profileData} isOwnProfile={false}>
                    <ArtistProfile.HeroBanner />
                    <div class="header-content">
                        <ArtistProfile.Avatar />
                        <div class="info">
                            <ArtistProfile.Name />
                            <ArtistProfile.Badges />
                            <ArtistProfile.Statement />
                        </div>
                        <ArtistProfile.Stats />
                        <div class="actions">
                            <ArtistProfile.Actions />
                        </div>
                    </div>
                    <ArtistProfile.Sections />
                </ArtistProfile.Root>
            </div>
		</div>

		<CodeExample code={profileExample} language="svelte" />
	</section>
</DemoPage>

<style>
    .demo-container {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        overflow: hidden;
    }
    
    .profile-wrapper {
        position: relative;
    }
    
    .header-content {
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
    }
    
    .info {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
    }
    
    .actions {
        display: flex;
        gap: var(--space-2);
        margin-top: var(--space-4);
    }
</style>

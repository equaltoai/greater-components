<script lang="ts">
  import { Avatar } from '@greater/primitives';

  interface Props {
    src?: string;
    alt?: string;
    name?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    shape?: 'circle' | 'square' | 'rounded';
    loading?: boolean;
    status?: 'online' | 'offline' | 'busy' | 'away';
    statusPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    showAllVariants?: boolean;
  }

  let {
    src,
    alt,
    name = 'John Doe',
    size = 'md',
    shape = 'circle',
    loading = false,
    status,
    statusPosition = 'bottom-right',
    showAllVariants = false
  }: Props = $props();

  const sampleUsers = [
    {
      name: 'Alice Johnson',
      src: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
      status: 'online'
    },
    {
      name: 'Bob Smith',
      src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      status: 'busy'
    },
    {
      name: 'Carol Williams',
      src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      status: 'away'
    },
    {
      name: 'David Brown',
      src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      status: 'offline'
    },
    {
      name: 'Emma Davis',
      src: '', // No image to test fallback
      status: 'online'
    }
  ];

  const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
  const shapes = ['circle', 'square', 'rounded'] as const;
  const statuses = ['online', 'offline', 'busy', 'away'] as const;
  const statusPositions = ['top-right', 'top-left', 'bottom-right', 'bottom-left'] as const;
</script>

{#if showAllVariants}
  <div class="demo-container">
    <div class="demo-section">
      <h3>Different Sizes</h3>
      <div class="demo-grid">
        {#each sizes as currentSize}
          <div class="demo-item">
            <Avatar 
              name="Size {currentSize.toUpperCase()}"
              size={currentSize}
              status="online"
            />
            <span class="demo-label">{currentSize}</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="demo-section">
      <h3>Different Shapes</h3>
      <div class="demo-grid">
        {#each shapes as currentShape}
          <div class="demo-item">
            <Avatar 
              name="Shape Test"
              shape={currentShape}
              size="lg"
              status="online"
            />
            <span class="demo-label">{currentShape}</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="demo-section">
      <h3>Status Indicators</h3>
      <div class="demo-grid">
        {#each statuses as currentStatus}
          <div class="demo-item">
            <Avatar 
              name="Status Test"
              size="lg"
              status={currentStatus}
            />
            <span class="demo-label">{currentStatus}</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="demo-section">
      <h3>Status Positions</h3>
      <div class="demo-grid">
        {#each statusPositions as position}
          <div class="demo-item">
            <Avatar 
              name="Position Test"
              size="lg"
              status="online"
              statusPosition={position}
            />
            <span class="demo-label">{position}</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="demo-section">
      <h3>With Images and Fallbacks</h3>
      <div class="demo-grid">
        {#each sampleUsers as user}
          <div class="demo-item">
            <Avatar 
              name={user.name}
              src={user.src || undefined}
              size="lg"
              status={user.status}
              alt="{user.name}'s avatar"
            />
            <span class="demo-label">{user.name}</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="demo-section">
      <h3>Loading States</h3>
      <div class="demo-grid">
        {#each ['sm', 'md', 'lg', 'xl'] as currentSize}
          <div class="demo-item">
            <Avatar 
              name="Loading"
              size={currentSize}
              loading={true}
            />
            <span class="demo-label">Loading {currentSize}</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="demo-section">
      <h3>Avatar Groups</h3>
      <div class="avatar-group">
        <Avatar 
          name="User 1"
          src="https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face"
          size="md"
          status="online"
        />
        <Avatar 
          name="User 2"
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
          size="md"
          status="busy"
        />
        <Avatar 
          name="User 3"
          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
          size="md"
          status="away"
        />
        <Avatar 
          name="User 4"
          size="md"
          status="offline"
        />
        <div class="avatar-more">
          <Avatar size="md">
            {#snippet fallback()}
              <span class="more-count">+5</span>
            {/snippet}
          </Avatar>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>Edge Cases</h3>
      <div class="demo-grid">
        <div class="demo-item">
          <Avatar 
            name=""
            size="lg"
          />
          <span class="demo-label">No name</span>
        </div>
        
        <div class="demo-item">
          <Avatar 
            name="X"
            size="lg"
            status="online"
          />
          <span class="demo-label">Single character</span>
        </div>
        
        <div class="demo-item">
          <Avatar 
            name="Very Long Name That Should Be Truncated"
            size="lg"
            status="busy"
          />
          <span class="demo-label">Long name</span>
        </div>
        
        <div class="demo-item">
          <Avatar 
            name="Multiple Middle Names Here"
            size="lg"
            status="away"
          />
          <span class="demo-label">Multiple words</span>
        </div>

        <div class="demo-item">
          <Avatar 
            src="https://broken-image-url.jpg"
            name="Broken Image"
            size="lg"
            status="online"
          />
          <span class="demo-label">Broken image</span>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>Custom Fallback</h3>
      <div class="demo-grid">
        <div class="demo-item">
          <Avatar size="lg" status="online">
            {#snippet fallback()}
              <div class="custom-fallback">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            {/snippet}
          </Avatar>
          <span class="demo-label">Star icon</span>
        </div>

        <div class="demo-item">
          <Avatar size="lg" status="busy">
            {#snippet fallback()}
              <div class="custom-fallback">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            {/snippet}
          </Avatar>
          <span class="demo-label">Check icon</span>
        </div>

        <div class="demo-item">
          <Avatar size="lg" status="away">
            {#snippet fallback()}
              <div class="custom-fallback">
                🏢
              </div>
            {/snippet}
          </Avatar>
          <span class="demo-label">Organization</span>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="demo-single">
    <Avatar 
      {src}
      {alt}
      {name}
      {size}
      {shape}
      {loading}
      {status}
      {statusPosition}
    />
  </div>
{/if}

<style>
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1000px;
    padding: 1rem;
  }

  .demo-section {
    padding: 2rem;
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-lg);
    background-color: var(--gr-semantic-background-primary);
  }

  .demo-section h3 {
    margin: 0 0 1.5rem 0;
    color: var(--gr-semantic-foreground-primary);
    font-size: var(--gr-typography-fontSize-xl);
    font-weight: var(--gr-typography-fontWeight-semibold);
  }

  .demo-single {
    padding: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }

  .demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1.5rem;
    align-items: start;
  }

  .demo-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    text-align: center;
  }

  .demo-label {
    font-size: var(--gr-typography-fontSize-sm);
    color: var(--gr-semantic-foreground-secondary);
    font-weight: var(--gr-typography-fontWeight-medium);
    max-width: 100%;
    word-wrap: break-word;
    line-height: var(--gr-typography-lineHeight-tight);
  }

  .avatar-group {
    display: flex;
    align-items: center;
    gap: -0.5rem; /* Negative gap for overlap */
  }

  .avatar-group > :global(*) {
    margin-right: -0.5rem;
    border: 2px solid var(--gr-semantic-background-primary);
    position: relative;
    z-index: 1;
  }

  .avatar-group > :global(*:hover) {
    z-index: 10;
    transform: scale(1.1);
    transition: transform var(--gr-motion-duration-fast) var(--gr-motion-easing-out);
  }

  .avatar-more {
    margin-left: 0.5rem;
  }

  .more-count {
    font-size: var(--gr-typography-fontSize-sm);
    font-weight: var(--gr-typography-fontWeight-bold);
    color: var(--gr-semantic-foreground-primary);
  }

  .custom-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: var(--gr-semantic-foreground-secondary);
    font-size: 1.5em;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .demo-grid {
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 1rem;
    }

    .demo-section {
      padding: 1rem;
    }

    .avatar-group {
      gap: -0.25rem;
    }

    .avatar-group > :global(*) {
      margin-right: -0.25rem;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .avatar-group > :global(*:hover) {
      transition: none;
      transform: none;
    }
  }
</style>
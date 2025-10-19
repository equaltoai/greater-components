<script lang="ts">
  import { Skeleton } from '@equaltoai/greater-components-primitives';

  interface Props {
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | 'none';
    loading?: boolean;
    showAllVariants?: boolean;
    showLoadingWrapper?: boolean;
  }

  let {
    variant = 'text',
    width = '200px',
    height,
    animation = 'pulse',
    loading = true,
    showAllVariants = false,
    showLoadingWrapper = false
  }: Props = $props();

  let demoLoading = $state(true);

  // Toggle loading state for demo
  function toggleLoading() {
    demoLoading = !demoLoading;
  }

  const variants = ['text', 'circular', 'rectangular', 'rounded'] as const;
  const animations = ['pulse', 'wave', 'none'] as const;
  const listPlaceholderIds = Array.from({ length: 5 }, (_, index) => `list-${index}`);
  const tableRowIds = Array.from({ length: 4 }, (_, index) => `row-${index}`);
</script>

{#if showLoadingWrapper}
  <div class="demo-wrapper">
    <div class="demo-controls">
      <button class="demo-button" onclick={toggleLoading}>
        {demoLoading ? 'Hide Skeleton' : 'Show Skeleton'}
      </button>
      <span class="demo-status">Loading: {demoLoading}</span>
    </div>

    <div class="demo-content">
      <Skeleton loading={demoLoading} variant="text" width="60%" height="24px">
        <h2>Article Title</h2>
      </Skeleton>

      <Skeleton loading={demoLoading} variant="text" width="40%" height="16px">
        <p class="meta">By John Doe • 5 min read</p>
      </Skeleton>

      <Skeleton loading={demoLoading} variant="rectangular" width="100%" height="200px">
        <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop" alt="Nature landscape" class="demo-image" />
      </Skeleton>

      <div class="demo-text-content">
        <Skeleton loading={demoLoading} variant="text" width="100%" height="16px">
          <p>This is the first paragraph of the article content. It contains interesting information about the topic.</p>
        </Skeleton>

        <Skeleton loading={demoLoading} variant="text" width="95%" height="16px">
          <p>Here's another paragraph that continues the discussion with more details and examples.</p>
        </Skeleton>

        <Skeleton loading={demoLoading} variant="text" width="80%" height="16px">
          <p>The final paragraph wraps up the content nicely.</p>
        </Skeleton>
      </div>
    </div>
  </div>
{:else if showAllVariants}
  <div class="demo-container">
    <div class="demo-section">
      <h3>Shape Variants</h3>
      <div class="demo-grid">
        {#each variants as currentVariant (currentVariant)}
          <div class="demo-item">
            <Skeleton
              variant={currentVariant}
              width={currentVariant === 'circular' ? '64px' : '200px'}
              height={currentVariant === 'text' ? '20px' : currentVariant === 'circular' ? '64px' : '120px'}
            />
            <span class="demo-label">{currentVariant}</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="demo-section">
      <h3>Animation Types</h3>
      <div class="demo-grid">
        {#each animations as currentAnimation (currentAnimation)}
          <div class="demo-item">
            <Skeleton
              variant="rectangular"
              width="180px"
              height="100px"
              animation={currentAnimation}
            />
            <span class="demo-label">{currentAnimation}</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="demo-section">
      <h3>Different Sizes</h3>
      <div class="demo-grid">
        <div class="demo-item">
          <Skeleton variant="circular" width="24px" />
          <span class="demo-label">Small (24px)</span>
        </div>
        <div class="demo-item">
          <Skeleton variant="circular" width="48px" />
          <span class="demo-label">Medium (48px)</span>
        </div>
        <div class="demo-item">
          <Skeleton variant="circular" width="64px" />
          <span class="demo-label">Large (64px)</span>
        </div>
        <div class="demo-item">
          <Skeleton variant="circular" width="96px" />
          <span class="demo-label">XLarge (96px)</span>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>Text Skeletons</h3>
      <div class="demo-text-group">
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="95%" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="85%" />
        <Skeleton variant="text" width="60%" />
      </div>
    </div>

    <div class="demo-section">
      <h3>Card Layout Example</h3>
      <div class="demo-card">
        <div class="demo-card-header">
          <Skeleton variant="circular" width="48px" animation="wave" />
          <div class="demo-card-info">
            <Skeleton variant="text" width="120px" height="16px" animation="wave" />
            <Skeleton variant="text" width="80px" height="14px" animation="wave" />
          </div>
        </div>
        <Skeleton variant="rectangular" width="100%" height="200px" animation="wave" />
        <div class="demo-card-content">
          <Skeleton variant="text" width="100%" height="20px" animation="wave" />
          <Skeleton variant="text" width="95%" animation="wave" />
          <Skeleton variant="text" width="85%" animation="wave" />
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>List Layout Example</h3>
      <div class="demo-list">
        {#each listPlaceholderIds as placeholderId (placeholderId)}
          <div class="demo-list-item">
            <Skeleton variant="circular" width="40px" />
            <div class="demo-list-content">
              <Skeleton variant="text" width="150px" height="16px" />
              <Skeleton variant="text" width="100px" height="14px" />
            </div>
            <Skeleton variant="text" width="60px" height="14px" />
          </div>
        {/each}
      </div>
    </div>

    <div class="demo-section">
      <h3>Table Layout Example</h3>
      <div class="demo-table">
        <div class="demo-table-header">
          <Skeleton variant="text" width="80px" height="16px" />
          <Skeleton variant="text" width="100px" height="16px" />
          <Skeleton variant="text" width="120px" height="16px" />
          <Skeleton variant="text" width="80px" height="16px" />
        </div>
        {#each tableRowIds as rowId (rowId)}
          <div class="demo-table-row">
            <Skeleton variant="text" width="70px" height="14px" />
            <Skeleton variant="text" width="90px" height="14px" />
            <Skeleton variant="text" width="110px" height="14px" />
            <Skeleton variant="text" width="60px" height="14px" />
          </div>
        {/each}
      </div>
    </div>

    <div class="demo-section">
      <h3>Interactive Loading Toggle</h3>
      <div class="demo-interactive">
        <button class="demo-button" onclick={toggleLoading}>
          {demoLoading ? 'Show Content' : 'Show Skeleton'}
        </button>
        
        <div class="demo-interactive-content">
          <Skeleton loading={demoLoading} variant="circular" width="48px">
            <div class="demo-avatar">👤</div>
          </Skeleton>
          
          <div class="demo-interactive-text">
            <Skeleton loading={demoLoading} variant="text" width="150px" height="18px">
              <h4>User Name</h4>
            </Skeleton>
            
            <Skeleton loading={demoLoading} variant="text" width="200px" height="14px">
              <p>This is some actual content that appears when loading is false.</p>
            </Skeleton>
          </div>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="demo-single">
    <Skeleton
      {variant}
      {width}
      {height}
      {animation}
      {loading}
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

  .demo-wrapper {
    max-width: 600px;
    padding: 1rem;
  }

  .demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    align-items: start;
  }

  .demo-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    text-align: center;
  }

  .demo-label {
    font-size: var(--gr-typography-fontSize-sm);
    color: var(--gr-semantic-foreground-secondary);
    font-weight: var(--gr-typography-fontWeight-medium);
    text-transform: capitalize;
  }

  .demo-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background-color: var(--gr-semantic-background-secondary);
    border-radius: var(--gr-radii-md);
  }

  .demo-button {
    padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
    font-family: var(--gr-typography-fontFamily-sans);
    font-size: var(--gr-typography-fontSize-sm);
    font-weight: var(--gr-typography-fontWeight-medium);
    color: var(--gr-color-base-white);
    background-color: var(--gr-semantic-action-primary-default);
    border: none;
    border-radius: var(--gr-radii-md);
    cursor: pointer;
    transition: background-color var(--gr-motion-duration-fast) var(--gr-motion-easing-out);
  }

  .demo-button:hover {
    background-color: var(--gr-semantic-action-primary-hover);
  }

  .demo-status {
    font-size: var(--gr-typography-fontSize-sm);
    color: var(--gr-semantic-foreground-secondary);
  }

  .demo-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .demo-text-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .demo-text-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-width: 400px;
  }

  .demo-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: var(--gr-radii-md);
  }

  .meta {
    color: var(--gr-semantic-foreground-secondary);
    font-size: var(--gr-typography-fontSize-sm);
    margin: 0;
  }

  /* Card layout */
  .demo-card {
    max-width: 400px;
    padding: 1.5rem;
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-lg);
    background-color: var(--gr-semantic-background-primary);
  }

  .demo-card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .demo-card-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }

  .demo-card-content {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* List layout */
  .demo-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 500px;
  }

  .demo-list-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-md);
    background-color: var(--gr-semantic-background-primary);
  }

  .demo-list-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* Table layout */
  .demo-table {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-width: 600px;
  }

  .demo-table-header,
  .demo-table-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 1rem;
    align-items: center;
    padding: 0.75rem 1rem;
  }

  .demo-table-header {
    background-color: var(--gr-semantic-background-secondary);
    border-radius: var(--gr-radii-md);
    font-weight: var(--gr-typography-fontWeight-semibold);
  }

  .demo-table-row {
    border-bottom: 1px solid var(--gr-semantic-border-subtle);
  }

  /* Interactive demo */
  .demo-interactive {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 400px;
  }

  .demo-interactive-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-md);
    background-color: var(--gr-semantic-background-primary);
  }

  .demo-interactive-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .demo-avatar {
    width: 48px;
    height: 48px;
    background-color: var(--gr-semantic-background-secondary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }

  .demo-interactive h4 {
    margin: 0;
    color: var(--gr-semantic-foreground-primary);
    font-size: var(--gr-typography-fontSize-lg);
  }

  .demo-interactive p {
    margin: 0;
    color: var(--gr-semantic-foreground-secondary);
    font-size: var(--gr-typography-fontSize-sm);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .demo-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .demo-section {
      padding: 1rem;
    }

    .demo-table-header,
    .demo-table-row {
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .demo-button {
      transition: none;
    }
  }
</style>

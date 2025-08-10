<script lang="ts">
  interface Props {
    category?: 'colors' | 'typography' | 'spacing' | 'all';
  }
  
  let { category = 'all' }: Props = $props();
  
  const colorTokens = [
    'base.white', 'base.black',
    'gray.50', 'gray.100', 'gray.200', 'gray.300', 'gray.400', 
    'gray.500', 'gray.600', 'gray.700', 'gray.800', 'gray.900', 'gray.950',
    'primary.50', 'primary.100', 'primary.200', 'primary.300', 'primary.400',
    'primary.500', 'primary.600', 'primary.700', 'primary.800', 'primary.900', 'primary.950',
    'success.500', 'warning.500', 'error.500'
  ];
  
  const semanticColors = [
    'semantic.background.primary', 'semantic.background.secondary', 'semantic.background.tertiary',
    'semantic.foreground.primary', 'semantic.foreground.secondary', 'semantic.foreground.tertiary',
    'semantic.border.default', 'semantic.border.subtle', 'semantic.border.strong',
    'semantic.action.primary.default', 'semantic.action.primary.hover', 'semantic.focus.ring'
  ];
  
  const typographyTokens = [
    'fontFamily.sans', 'fontFamily.serif', 'fontFamily.mono',
    'fontSize.xs', 'fontSize.sm', 'fontSize.base', 'fontSize.lg', 'fontSize.xl', 'fontSize.2xl',
    'fontWeight.normal', 'fontWeight.medium', 'fontWeight.semibold', 'fontWeight.bold',
    'lineHeight.tight', 'lineHeight.normal', 'lineHeight.relaxed'
  ];
  
  const spacingTokens = [
    '0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32'
  ];
  
  const radiusTokens = [
    'none', 'sm', 'base', 'md', 'lg', 'xl', '2xl', 'full'
  ];
  
  const shadowTokens = [
    'sm', 'base', 'md', 'lg', 'xl', '2xl', 'none'
  ];
</script>

<div class="tokens-showcase">
  {#if category === 'colors' || category === 'all'}
    <section class="token-section">
      <h2>Color Tokens</h2>
      <div class="color-grid">
        {#each colorTokens as token (token)}
          <div class="color-swatch">
            <div 
              class="color-sample" 
              style="background-color: var(--gr-color-{token.replace(/\./g, '-')})"
            ></div>
            <div class="color-info">
              <code>--gr-color-{token.replace(/\./g, '-')}</code>
              <small>{token}</small>
            </div>
          </div>
        {/each}
      </div>
      
      <h3>Semantic Colors</h3>
      <div class="color-grid">
        {#each semanticColors as token (token)}
          <div class="color-swatch">
            <div 
              class="color-sample" 
              style="background-color: var(--gr-{token.replace(/\./g, '-')})"
            ></div>
            <div class="color-info">
              <code>--gr-{token.replace(/\./g, '-')}</code>
              <small>{token}</small>
            </div>
          </div>
        {/each}
      </div>
    </section>
  {/if}
  
  {#if category === 'typography' || category === 'all'}
    <section class="token-section">
      <h2>Typography Tokens</h2>
      
      <h3>Font Families</h3>
      <div class="typography-samples">
        <div class="typography-sample" style="font-family: var(--gr-typography-fontFamily-sans)">
          <code>--gr-typography-fontFamily-sans</code>
          <p>The quick brown fox jumps over the lazy dog</p>
        </div>
        <div class="typography-sample" style="font-family: var(--gr-typography-fontFamily-serif)">
          <code>--gr-typography-fontFamily-serif</code>
          <p>The quick brown fox jumps over the lazy dog</p>
        </div>
        <div class="typography-sample" style="font-family: var(--gr-typography-fontFamily-mono)">
          <code>--gr-typography-fontFamily-mono</code>
          <p>The quick brown fox jumps over the lazy dog</p>
        </div>
      </div>
      
      <h3>Font Sizes</h3>
      <div class="typography-samples">
        {#each typographyTokens.filter(t => t.startsWith('fontSize')) as token (token)}
          <div class="typography-sample" style="font-size: var(--gr-typography-{token.replace(/\./g, '-')})">
            <code>--gr-typography-{token.replace(/\./g, '-')}</code>
            <p>Sample text</p>
          </div>
        {/each}
      </div>
    </section>
  {/if}
  
  {#if category === 'spacing' || category === 'all'}
    <section class="token-section">
      <h2>Spacing Tokens</h2>
      <div class="spacing-samples">
        {#each spacingTokens as token (token)}
          <div class="spacing-sample">
            <div 
              class="spacing-box" 
              style="width: var(--gr-spacing-scale-{token}); height: var(--gr-spacing-scale-{token})"
            ></div>
            <code>--gr-spacing-scale-{token}</code>
            <small>scale.{token}</small>
          </div>
        {/each}
      </div>
      
      <h3>Border Radius</h3>
      <div class="radius-samples">
        {#each radiusTokens as token (token)}
          <div class="radius-sample">
            <div 
              class="radius-box" 
              style="border-radius: var(--gr-radii-{token})"
            ></div>
            <code>--gr-radii-{token}</code>
          </div>
        {/each}
      </div>
      
      <h3>Shadows</h3>
      <div class="shadow-samples">
        {#each shadowTokens as token (token)}
          <div class="shadow-sample">
            <div 
              class="shadow-box" 
              style="box-shadow: var(--gr-shadows-{token})"
            ></div>
            <code>--gr-shadows-{token}</code>
          </div>
        {/each}
      </div>
    </section>
  {/if}
</div>

<style>
  .tokens-showcase {
    padding: 2rem;
    font-family: var(--gr-typography-fontFamily-sans);
    background: var(--gr-semantic-background-primary);
    color: var(--gr-semantic-foreground-primary);
  }
  
  .token-section {
    margin-bottom: 3rem;
  }
  
  .token-section h2 {
    font-size: var(--gr-typography-fontSize-2xl);
    font-weight: var(--gr-typography-fontWeight-bold);
    margin-bottom: 1.5rem;
    color: var(--gr-semantic-foreground-primary);
  }
  
  .token-section h3 {
    font-size: var(--gr-typography-fontSize-lg);
    font-weight: var(--gr-typography-fontWeight-semibold);
    margin: 2rem 0 1rem;
    color: var(--gr-semantic-foreground-secondary);
  }
  
  .color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .color-swatch {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-md);
  }
  
  .color-sample {
    width: 3rem;
    height: 3rem;
    border-radius: var(--gr-radii-base);
    border: 1px solid var(--gr-semantic-border-subtle);
    flex-shrink: 0;
  }
  
  .color-info {
    min-width: 0;
    flex: 1;
  }
  
  .color-info code {
    display: block;
    font-size: var(--gr-typography-fontSize-xs);
    font-family: var(--gr-typography-fontFamily-mono);
    color: var(--gr-semantic-foreground-primary);
    margin-bottom: 0.25rem;
  }
  
  .color-info small {
    font-size: var(--gr-typography-fontSize-xs);
    color: var(--gr-semantic-foreground-tertiary);
  }
  
  .typography-samples {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .typography-sample {
    padding: 1rem;
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-md);
  }
  
  .typography-sample code {
    display: block;
    font-size: var(--gr-typography-fontSize-xs);
    font-family: var(--gr-typography-fontFamily-mono);
    color: var(--gr-semantic-foreground-secondary);
    margin-bottom: 0.5rem;
  }
  
  .spacing-samples {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
  }
  
  .spacing-sample {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-md);
    text-align: center;
  }
  
  .spacing-box {
    background: var(--gr-semantic-action-primary-default);
    margin-bottom: 0.5rem;
  }
  
  .spacing-sample code {
    font-size: var(--gr-typography-fontSize-xs);
    font-family: var(--gr-typography-fontFamily-mono);
    margin-bottom: 0.25rem;
  }
  
  .spacing-sample small {
    font-size: var(--gr-typography-fontSize-xs);
    color: var(--gr-semantic-foreground-tertiary);
  }
  
  .radius-samples {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
  }
  
  .radius-sample {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-md);
    text-align: center;
  }
  
  .radius-box {
    width: 3rem;
    height: 3rem;
    background: var(--gr-semantic-action-primary-default);
    margin-bottom: 0.5rem;
  }
  
  .radius-sample code {
    font-size: var(--gr-typography-fontSize-xs);
    font-family: var(--gr-typography-fontFamily-mono);
  }
  
  .shadow-samples {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
  }
  
  .shadow-sample {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-md);
    text-align: center;
  }
  
  .shadow-box {
    width: 3rem;
    height: 3rem;
    background: var(--gr-semantic-background-primary);
    margin-bottom: 0.5rem;
    border: 1px solid var(--gr-semantic-border-subtle);
  }
  
  .shadow-sample code {
    font-size: var(--gr-typography-fontSize-xs);
    font-family: var(--gr-typography-fontFamily-mono);
  }
</style>
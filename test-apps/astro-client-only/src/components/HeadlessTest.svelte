<!--
  Test Component: Greater Components Headless with client:only
  
  This demonstrates the headless approach with full styling control.
-->
<script lang="ts">
  import { createButton } from '@equaltoai/greater-components-headless/button';
  
  let count = $state(0);
  let isLoading = $state(false);
  
  const incrementButton = createButton({
    type: 'button',
    onClick: async () => {
      incrementButton.helpers.setLoading(true);
      isLoading = true;
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      count++;
      
      incrementButton.helpers.setLoading(false);
      isLoading = false;
    }
  });
  
  const resetButton = createButton({
    type: 'button',
    onClick: () => {
      count = 0;
    }
  });
</script>

<div class="headless-demo">
  <h2>Headless Components Demo</h2>
  
  <div class="counter-display">
    <span class="count">{count}</span>
    <span class="label">clicks</span>
  </div>
  
  <div class="button-row">
    <button 
      use:incrementButton.actions.button 
      class="custom-button primary"
      class:loading={isLoading}
    >
      {#if isLoading}
        <span class="spinner"></span>
        Loading...
      {:else}
        Click Me!
      {/if}
    </button>
    
    <button 
      use:resetButton.actions.button 
      class="custom-button secondary"
    >
      Reset
    </button>
  </div>
  
  <div class="headless-info">
    <p><strong>💡 Headless Components:</strong></p>
    <ul>
      <li>Full styling control (100% custom CSS)</li>
      <li>Behavior provided by Greater Components</li>
      <li>Perfect for design system customization</li>
      <li>Smaller bundle size</li>
    </ul>
  </div>
</div>

<style>
  .headless-demo {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 1rem;
    padding: 2rem;
    color: white;
    margin: 2rem 0;
  }
  
  h2 {
    margin-top: 0;
    color: white;
  }
  
  .counter-display {
    text-align: center;
    margin: 2rem 0;
  }
  
  .count {
    display: block;
    font-size: 4rem;
    font-weight: bold;
    line-height: 1;
  }
  
  .label {
    display: block;
    font-size: 1.25rem;
    opacity: 0.9;
    margin-top: 0.5rem;
  }
  
  .button-row {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin: 2rem 0;
  }
  
  .custom-button {
    padding: 1rem 2rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .custom-button.primary {
    background: white;
    color: #667eea;
  }
  
  .custom-button.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
  
  .custom-button.primary:disabled,
  .custom-button.primary.loading {
    opacity: 0.7;
    cursor: wait;
  }
  
  .custom-button.secondary {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid white;
  }
  
  .custom-button.secondary:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  .spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid #667eea;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .headless-info {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-top: 2rem;
  }
  
  .headless-info p {
    margin: 0 0 0.75rem 0;
    font-size: 1.125rem;
  }
  
  .headless-info ul {
    margin: 0;
    padding-left: 1.5rem;
  }
  
  .headless-info li {
    margin: 0.5rem 0;
  }
</style>


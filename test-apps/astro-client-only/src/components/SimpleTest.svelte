<!--
  Minimal test to prove client-only works
-->
<script lang="ts">
  let count = $state(0);
</script>

<div style="padding: 2rem; background: #f0f9ff; border: 2px solid #3b82f6; border-radius: 0.5rem; margin: 2rem;">
  <h2 style="color: #1e40af; margin-top: 0;">✅ Simple Svelte 5 Runes Test</h2>
  
  <div style="font-size: 3rem; text-align: center; margin: 2rem 0;">
    {count}
  </div>
  
  <button 
    style="padding: 1rem 2rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1.125rem;"
    onclick={() => count++}
  >
    Increment
  </button>
  
  <p style="margin-top: 1rem; color: #1e3a8a;">
    If this counter works, Svelte 5 client:only is working!
  </p>
</div>


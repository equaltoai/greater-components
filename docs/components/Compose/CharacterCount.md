# Compose.CharacterCount

**Component**: Unicode-Aware Character Counter  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅

---

## 📋 Overview

`Compose.CharacterCount` displays the current character count with visual feedback as users approach or exceed the character limit. It uses Unicode-aware counting to properly handle emojis, combining characters, and grapheme clusters, ensuring accurate character counts across all languages and scripts.

### **Key Features**:
- ✅ Unicode-aware character counting (emojis, CJK, combining chars)
- ✅ Visual progress indicator (circular progress bar)
- ✅ Color-coded warnings (near limit, over limit)
- ✅ Animated transitions
- ✅ Accessible with ARIA live regions
- ✅ Shows count only when near/over limit
- ✅ Customizable display options
- ✅ Respects `prefers-reduced-motion`

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  async function handleSubmit(data) {
    await fetch('/api/statuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
</script>

<Compose.Root 
  handlers={{ onSubmit: handleSubmit }}
  config={{ characterLimit: 500 }}
>
  <Compose.Editor autofocus />
  
  <div class="footer">
    <Compose.CharacterCount />
    <Compose.Submit />
  </div>
</Compose.Root>

<style>
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
</style>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `showProgress` | `boolean` | `true` | No | Show circular progress indicator |
| `class` | `string` | `''` | No | Additional CSS class |

**Note**: Character limit and current count are inherited from the `Compose.Root` context.

---

## 📊 Display Behavior

The character count display adapts based on the current state:

### **Hidden (Default)**
```typescript
// When well under limit (< 80%)
percentage < 80
// Shows only progress circle, no text
```

### **Near Limit (Warning)**
```typescript
// When approaching limit (80% - 100%)
percentage >= 80 && percentage < 100
// Shows: "456 / 500" in warning color (orange)
```

### **Over Limit (Error)**
```typescript
// When over the limit (> 100%)
percentage > 100
// Shows: "523 / 500" in error color (red)
```

---

## 🎨 Progress Circle

The circular progress indicator provides visual feedback:

```typescript
// Circle properties
const radius = 14;
const circumference = 2 * Math.PI * radius; // ~87.96

// Progress calculation
const percentage = (characterCount / characterLimit) * 100;
const offset = circumference - (percentage / 100) * circumference;
```

**Visual States:**
- **0-79%**: Gray circle (normal)
- **80-99%**: Orange circle (warning)
- **100%+**: Red circle (error)

---

## 💡 Examples

### **Example 1: Basic Character Counter**

Simple character count with default settings:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  async function handleSubmit(data) {
    await api.createPost(data);
  }
</script>

<div class="compose-container">
  <Compose.Root 
    handlers={{ onSubmit: handleSubmit }}
    config={{ characterLimit: 500 }}
  >
    <Compose.Editor autofocus />
    
    <div class="compose-footer">
      <Compose.CharacterCount />
      <Compose.Submit />
    </div>
  </Compose.Root>
</div>

<style>
  .compose-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 12px;
  }

  .compose-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e1e8ed;
  }
</style>
```

### **Example 2: Without Progress Circle**

Show only text count:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  async function handleSubmit(data) {
    await api.createPost(data);
  }
</script>

<Compose.Root 
  handlers={{ onSubmit: handleSubmit }}
  config={{ characterLimit: 280 }}
>
  <Compose.Editor autofocus placeholder="What's happening?" />
  
  <div class="twitter-style-footer">
    {/* No progress circle, text-only display */}
    <Compose.CharacterCount showProgress={false} />
    <Compose.Submit text="Tweet" />
  </div>
</Compose.Root>

<style>
  .twitter-style-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
    margin-top: 0.75rem;
  }
</style>
```

### **Example 3: Multiple Character Limits**

Different composers with different limits:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  async function handleTweet(data) {
    await api.createTweet(data);
  }

  async function handleThread(data) {
    await api.createThread(data);
  }

  async function handleNote(data) {
    await api.createNote(data);
  }
</script>

<div class="multi-composer">
  <div class="composer-card">
    <h3>Quick Tweet (280 chars)</h3>
    <Compose.Root 
      handlers={{ onSubmit: handleTweet }}
      config={{ characterLimit: 280 }}
    >
      <Compose.Editor rows={2} />
      <div class="footer">
        <Compose.CharacterCount />
        <Compose.Submit text="Tweet" />
      </div>
    </Compose.Root>
  </div>

  <div class="composer-card">
    <h3>Thread Post (500 chars)</h3>
    <Compose.Root 
      handlers={{ onSubmit: handleThread }}
      config={{ characterLimit: 500 }}
    >
      <Compose.Editor rows={3} />
      <div class="footer">
        <Compose.CharacterCount />
        <Compose.Submit text="Post" />
      </div>
    </Compose.Root>
  </div>

  <div class="composer-card">
    <h3>Long-form Note (5000 chars)</h3>
    <Compose.Root 
      handlers={{ onSubmit: handleNote }}
      config={{ characterLimit: 5000 }}
    >
      <Compose.Editor rows={8} />
      <div class="footer">
        <Compose.CharacterCount />
        <Compose.Submit text="Publish" />
      </div>
    </Compose.Root>
  </div>
</div>

<style>
  .multi-composer {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
    padding: 2rem;
  }

  .composer-card {
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 12px;
    padding: 1.5rem;
  }

  .composer-card h3 {
    margin: 0 0 1rem;
    font-size: 1rem;
    color: #0f1419;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
</style>
```

### **Example 4: With Real-Time Feedback**

Show detailed character information:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';
  import { countWeightedCharacters } from '@equaltoai/greater-components-fediverse/Compose';

  let detailedMetrics = $state({
    count: 0,
    graphemeCount: 0,
    urls: 0,
    mentions: 0,
    hashtags: 0
  });

  function handleContentChange(content: string) {
    detailedMetrics = countWeightedCharacters(content, {
      useUrlWeighting: true,
      maxCharacters: 500
    });
  }

  async function handleSubmit(data) {
    await api.createPost(data);
  }
</script>

<div class="detailed-composer">
  <Compose.Root 
    handlers={{ onSubmit: handleSubmit }}
    config={{ characterLimit: 500 }}
  >
    <Compose.Editor 
      autofocus 
      oninput={(e) => handleContentChange(e.target.value)}
    />
    
    <div class="metrics">
      <div class="metric-group">
        <div class="metric">
          <span class="metric-label">Characters:</span>
          <span class="metric-value">{detailedMetrics.count}</span>
        </div>
        {#if detailedMetrics.urls > 0}
          <div class="metric">
            <span class="metric-label">URLs:</span>
            <span class="metric-value">{detailedMetrics.urls}</span>
          </div>
        {/if}
        {#if detailedMetrics.mentions > 0}
          <div class="metric">
            <span class="metric-label">Mentions:</span>
            <span class="metric-value">{detailedMetrics.mentions}</span>
          </div>
        {/if}
        {#if detailedMetrics.hashtags > 0}
          <div class="metric">
            <span class="metric-label">Hashtags:</span>
            <span class="metric-value">{detailedMetrics.hashtags}</span>
          </div>
        {/if}
      </div>

      <div class="actions">
        <Compose.CharacterCount />
        <Compose.Submit />
      </div>
    </div>
  </Compose.Root>
</div>

<style>
  .detailed-composer {
    max-width: 600px;
    margin: 2rem auto;
  }

  .metrics {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e1e8ed;
  }

  .metric-group {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .metric {
    display: flex;
    gap: 0.5rem;
    font-size: 0.875rem;
  }

  .metric-label {
    color: #536471;
  }

  .metric-value {
    font-weight: 600;
    color: #0f1419;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
</style>
```

### **Example 5: Custom Warning Thresholds**

Show warnings at different percentages:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  let percentage = $state(0);
  let warningLevel = $derived(
    percentage >= 90 ? 'critical' :
    percentage >= 75 ? 'warning' :
    'normal'
  );

  async function handleSubmit(data) {
    await api.createPost(data);
  }

  function updatePercentage(content: string, limit: number) {
    percentage = (content.length / limit) * 100;
  }
</script>

<div class="threshold-composer">
  <div class="warning-banner" class:show={warningLevel !== 'normal'}>
    {#if warningLevel === 'critical'}
      <span class="warning-icon">⚠️</span>
      <span>You're very close to the character limit!</span>
    {:else if warningLevel === 'warning'}
      <span class="warning-icon">💡</span>
      <span>Consider keeping it concise</span>
    {/if}
  </div>

  <Compose.Root 
    handlers={{ onSubmit: handleSubmit }}
    config={{ characterLimit: 280 }}
  >
    <Compose.Editor 
      autofocus
      oninput={(e) => updatePercentage(e.target.value, 280)}
    />
    
    <div class="footer">
      <div class="status-indicator" class:warning={warningLevel === 'warning'} class:critical={warningLevel === 'critical'}>
        {warningLevel === 'critical' ? '🔴' : warningLevel === 'warning' ? '🟡' : '🟢'}
      </div>
      <Compose.CharacterCount />
      <Compose.Submit />
    </div>
  </Compose.Root>
</div>

<style>
  .threshold-composer {
    max-width: 600px;
    margin: 2rem auto;
  }

  .warning-banner {
    display: none;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 8px;
    color: #856404;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .warning-banner.show {
    display: flex;
  }

  .warning-banner:has(.critical) {
    background: #fee;
    border-color: #dc2626;
    color: #dc2626;
  }

  .warning-icon {
    font-size: 1.25rem;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
  }

  .status-indicator {
    font-size: 1.5rem;
    transition: transform 0.2s;
  }

  .status-indicator.warning {
    animation: pulse 2s ease-in-out infinite;
  }

  .status-indicator.critical {
    animation: shake 0.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .status-indicator.warning,
    .status-indicator.critical {
      animation: none;
    }
  }
</style>
```

### **Example 6: Unicode Character Counting Demo**

Demonstrate accurate Unicode counting:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  const examples = [
    { text: 'Hello World', expected: 11, note: 'Simple ASCII text' },
    { text: 'Hello 👋 World', expected: 13, note: 'With emoji' },
    { text: 'Hello 👨‍👩‍👧‍👦 World', expected: 13, note: 'With family emoji (grapheme cluster)' },
    { text: '你好世界', expected: 4, note: 'CJK characters' },
    { text: 'Café', expected: 4, note: 'With combining character (é)' },
    { text: 'Check https://example.com/very/long/path', expected: 29, note: 'With URL (weighted as ~23 chars)' }
  ];

  let selectedExample = $state(0);

  async function handleSubmit(data) {
    await api.createPost(data);
  }

  function loadExample(index: number) {
    selectedExample = index;
    // Update editor content (would need context access)
  }
</script>

<div class="unicode-demo">
  <h2>Unicode Character Counting Demo</h2>
  
  <div class="examples">
    <h3>Try these examples:</h3>
    {#each examples as example, i}
      <button 
        class="example-btn"
        onclick={() => loadExample(i)}
      >
        <div class="example-text">{example.text}</div>
        <div class="example-info">
          <span class="expected">{example.expected} chars</span>
          <span class="note">{example.note}</span>
        </div>
      </button>
    {/each}
  </div>

  <Compose.Root 
    handlers={{ onSubmit: handleSubmit }}
    config={{ characterLimit: 100 }}
    initialState={{ content: examples[selectedExample].text }}
  >
    <Compose.Editor autofocus rows={3} />
    
    <div class="footer">
      <div class="info">
        Character counting uses <code>Intl.Segmenter</code> for accurate grapheme cluster counting
      </div>
      <Compose.CharacterCount />
    </div>
  </Compose.Root>
</div>

<style>
  .unicode-demo {
    max-width: 700px;
    margin: 2rem auto;
    padding: 2rem;
  }

  .unicode-demo h2 {
    margin: 0 0 1.5rem;
  }

  .examples {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: #f7f9fa;
    border-radius: 12px;
  }

  .examples h3 {
    margin: 0 0 1rem;
    font-size: 1rem;
    color: #536471;
  }

  .example-btn {
    display: block;
    width: 100%;
    text-align: left;
    padding: 1rem;
    margin-bottom: 0.5rem;
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .example-btn:hover {
    border-color: #1d9bf0;
    box-shadow: 0 2px 8px rgba(29, 155, 240, 0.1);
  }

  .example-text {
    font-family: monospace;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: #0f1419;
  }

  .example-info {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
  }

  .expected {
    font-weight: 600;
    color: #1d9bf0;
  }

  .note {
    color: #536471;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }

  .info {
    font-size: 0.75rem;
    color: #536471;
  }

  code {
    padding: 0.125rem 0.25rem;
    background: #f7f9fa;
    border-radius: 3px;
    font-family: monospace;
  }
</style>
```

---

## 🎨 Styling

`Compose.CharacterCount` can be styled using CSS custom properties:

```css
.compose-character-count {
  /* Text colors */
  --compose-text-secondary: #536471;
  --compose-warning-color: #f59e0b;
  --compose-error-color: #dc2626;

  /* Progress circle */
  --compose-progress-bg: #e1e8ed;

  /* Typography */
  --compose-font-size-sm: 0.875rem;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .compose-character-count {
    --compose-text-secondary: #8899a6;
    --compose-warning-color: #fbbf24;
    --compose-error-color: #ef4444;
    --compose-progress-bg: #38444d;
  }
}
```

### **Custom Styles**

```css
/* Larger counter */
:global(.large-count) {
  font-size: 1.125rem;
  font-weight: 700;
}

/* Always show count */
:global(.always-visible .compose-character-count__text) {
  display: block !important;
}

/* Different warning color */
:global(.compose-character-count--near-limit) {
  color: #8b5cf6; /* Purple instead of orange */
}

/* No progress circle */
:global(.text-only .compose-character-count__progress) {
  display: none;
}
```

---

## ♿ Accessibility

`Compose.CharacterCount` follows WCAG 2.1 AA standards:

### **ARIA Attributes**
```html
<div
  id="compose-character-count"
  role="status"
  aria-live="polite"
  aria-label="456 of 500 characters used"
>
  <!-- Content -->
</div>
```

### **Screen Reader Support**
- Character count changes announced via `aria-live="polite"`
- Full status read: "456 of 500 characters used"
- Warning state: "456 of 500 characters used, approaching limit"
- Error state: "523 of 500 characters used, over limit"

### **Visual Accessibility**
- **Normal state**: Gray (sufficient contrast 4.5:1)
- **Warning state**: Orange `#f59e0b` (high contrast)
- **Error state**: Red `#dc2626` (high contrast)
- Color is not the only indicator (text and progress also change)

### **Reduced Motion**
```css
@media (prefers-reduced-motion: reduce) {
  .compose-character-count__progress-circle {
    transition: none;
  }
}
```

---

## 🔒 Security Considerations

### **Character Counting Accuracy**

The character counter is purely informational on the client side. **Always validate on the server:**

```typescript
app.post('/api/statuses', async (req, res) => {
  const { status } = req.body;

  // Server-side length validation
  const length = [...status].length; // Unicode-aware

  if (length > 500) {
    return res.status(422).json({
      error: 'Content exceeds character limit',
      limit: 500,
      actual: length
    });
  }

  // Proceed with creation
  await db.statuses.create({ content: status });
  res.json({ success: true });
});
```

### **Unicode Normalization**

Different Unicode representations can have the same visual appearance:

```typescript
// NFC normalization on server
const normalized = status.normalize('NFC');
const length = [...normalized].length;
```

### **Emoji ZWJ Sequences**

Some emojis are composed of multiple codepoints joined by Zero-Width Joiners:

```typescript
// Example: Family emoji
'👨‍👩‍👧‍👦'.length // 11 (wrong!)
[...'👨‍👩‍👧‍👦'].length // 7 (wrong!)

// Correct using Intl.Segmenter
const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
[...segmenter.segment('👨‍👩‍👧‍👦')].length // 1 (correct!)
```

---

## 🧪 Testing

### **Component Testing**

```typescript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { Compose } from '@equaltoai/greater-components-fediverse';

describe('Compose.CharacterCount', () => {
  it('renders with character count', () => {
    render(Compose.Root, {
      props: {
        config: { characterLimit: 500 }
      }
    });

    const counter = screen.getByRole('status');
    expect(counter).toBeInTheDocument();
  });

  it('updates count on input', async () => {
    render(Compose.Root, {
      props: {
        config: { characterLimit: 100 }
      }
    });

    const editor = screen.getByRole('textbox');
    await fireEvent.input(editor, {
      target: { value: 'Hello World' }
    });

    // Character count should update
    const counter = screen.getByRole('status');
    expect(counter).toHaveAttribute('aria-label', '11 of 100 characters used');
  });

  it('shows warning near limit', async () => {
    render(Compose.Root, {
      props: {
        config: { characterLimit: 50 }
      }
    });

    const editor = screen.getByRole('textbox');
    // 45 characters (90% of limit)
    await fireEvent.input(editor, {
      target: { value: 'a'.repeat(45) }
    });

    const counter = screen.getByRole('status');
    expect(counter).toHaveClass('compose-character-count--near-limit');
  });

  it('shows error when over limit', async () => {
    render(Compose.Root, {
      props: {
        config: { characterLimit: 20 }
      }
    });

    const editor = screen.getByRole('textbox');
    await fireEvent.input(editor, {
      target: { value: 'This is way over the limit' }
    });

    const counter = screen.getByRole('status');
    expect(counter).toHaveClass('compose-character-count--over-limit');
  });

  it('counts Unicode correctly', async () => {
    render(Compose.Root, {
      props: {
        config: { characterLimit: 100 }
      }
    });

    const editor = screen.getByRole('textbox');
    
    // Emoji counting
    await fireEvent.input(editor, {
      target: { value: 'Hello 👋 World' }
    });

    const counter = screen.getByRole('status');
    // Should be 13, not 15
    expect(counter).toHaveAttribute('aria-label', '13 of 100 characters used');
  });

  it('handles progress circle visibility', () => {
    const { rerender } = render(Compose.Root, {
      props: {
        showProgress: true
      }
    });

    let progress = screen.queryByClass('compose-character-count__progress');
    expect(progress).toBeInTheDocument();

    rerender({
      props: {
        showProgress: false
      }
    });

    progress = screen.queryByClass('compose-character-count__progress');
    expect(progress).not.toBeInTheDocument();
  });
});
```

### **Unicode Counting Tests**

```typescript
import { countWeightedCharacters } from '@equaltoai/greater-components-fediverse/Compose';

describe('Unicode Character Counting', () => {
  it('counts ASCII correctly', () => {
    const result = countWeightedCharacters('Hello World');
    expect(result.count).toBe(11);
  });

  it('counts emojis as single characters', () => {
    const result = countWeightedCharacters('Hello 👋 World');
    expect(result.count).toBe(13);
  });

  it('counts family emoji as single character', () => {
    const result = countWeightedCharacters('Family: 👨‍👩‍👧‍👦');
    expect(result.count).toBe(9); // "Family: " (8) + emoji (1)
  });

  it('counts CJK characters correctly', () => {
    const result = countWeightedCharacters('你好世界');
    expect(result.count).toBe(4);
  });

  it('weights URLs correctly', () => {
    const result = countWeightedCharacters(
      'Check https://example.com/very/long/url/path',
      { useUrlWeighting: true, urlWeight: 23 }
    );
    // "Check " (6) + URL (23) = 29
    expect(result.count).toBe(29);
  });

  it('counts combining characters correctly', () => {
    const result = countWeightedCharacters('Café'); // é is e + combining acute
    expect(result.count).toBe(4);
  });
});
```

---

## 🔗 Related Components

- [Compose.Root](./Root.md) - Context provider (required parent)
- [Compose.Editor](./Editor.md) - Text editor
- [Compose.Submit](./Submit.md) - Submit button
- [UnicodeCounter Utility](./UnicodeCounter.md) - Character counting utilities

---

## 📚 See Also

- [Compose Component Group README](./README.md)
- [UnicodeCounter Utility Documentation](./UnicodeCounter.md)
- [Accessibility Guidelines](../../accessibility.md)
- [Unicode Grapheme Clusters](https://unicode.org/reports/tr29/)

---

## ❓ FAQ

### **Q: Why does the count differ from `.length`?**

JavaScript's `.length` counts UTF-16 code units, not user-perceived characters:

```javascript
'👋'.length // 2 (wrong!)
[...'👋'].length // 2 (still wrong!)
// Correct with Intl.Segmenter: 1
```

### **Q: How are URLs counted?**

URLs are weighted (default 23 characters like Twitter) regardless of actual length:

```javascript
'https://example.com/very/long/path'.length // 35
// With URL weighting: 23
```

### **Q: Can I customize the warning threshold?**

The warning threshold is fixed at 80%. To customize, you'd need to use the character count value and create custom logic:

```svelte
<script>
  import { getComposeContext } from '@equaltoai/greater-components-fediverse/Compose';
  const context = getComposeContext();
  
  const percentage = $derived(
    (context.state.characterCount / context.config.characterLimit) * 100
  );
  const customWarning = $derived(percentage >= 75); // 75% instead of 80%
</script>
```

### **Q: Does it work offline?**

Yes! Character counting is entirely client-side and requires no network connection.

### **Q: What about right-to-left languages?**

The character counter works correctly with RTL languages (Arabic, Hebrew, etc.). The visual layout will follow the document's text direction.

---

**Need help?** Check the [Troubleshooting Guide](../../troubleshooting/README.md) or open an issue on [GitHub](https://github.com/lesserphp/greater-components).


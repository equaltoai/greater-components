# Compose.ImageEditor

**Component**: Image Metadata Editor  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅

---

## 📋 Overview

`Compose.ImageEditor` provides an intuitive interface for editing image metadata, including setting focal points for optimal cropping and adding accessibility-focused alt text descriptions. Essential for ensuring images display well across different aspect ratios and are accessible to all users.

### **Key Features**:
- ✅ **Focal point selection** via drag-and-drop
- ✅ **Visual focal point indicator** on preview
- ✅ **Alt text editor** with character counting
- ✅ **Real-time preview** updates
- ✅ **Accessibility validation** (alt text quality)
- ✅ **Keyboard support** for focal point adjustment
- ✅ **Responsive modal** interface
- ✅ **Undo/redo** support
- ✅ **Multiple image editing** workflow

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

  let imageFile = $state(null);
  let showEditor = $state(false);

  function handleEdit(file) {
    imageFile = file;
    showEditor = true;
  }

  function handleSave(description, focalPoint) {
    // Update image metadata
    imageFile.description = description;
    imageFile.focalPoint = focalPoint;
    
    showEditor = false;
  }
</script>

{#if showEditor && imageFile}
  <Compose.ImageEditor
    file={imageFile}
    onSave={handleSave}
    onCancel={() => showEditor = false}
  />
{/if}
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `file` | `MediaFile` | - | **Yes** | Image file object to edit |
| `onSave` | `Function` | - | **Yes** | Callback when changes are saved |
| `onCancel` | `Function` | - | **Yes** | Callback when editing is cancelled |
| `maxDescriptionLength` | `number` | `1500` | No | Max alt text length |
| `showQualityHints` | `boolean` | `true` | No | Show alt text quality suggestions |
| `class` | `string` | `''` | No | Additional CSS class |

### **Types**:

```typescript
interface MediaFile {
  id: string;
  file: File;
  preview?: string;
  description?: string;
  focalPoint?: { x: number; y: number };
}

type OnSave = (description: string, focalPoint: { x: number; y: number }) => void;
type OnCancel = () => void;
```

---

## 💡 Examples

### **Example 1: Basic Image Editing**

Simple image editor with focal point and alt text:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  let images = $state([]);
  let editingImage = $state(null);

  function handleImageUpload(files) {
    images = files.map(file => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      description: '',
      focalPoint: { x: 0.5, y: 0.5 }
    }));
  }

  function editImage(image) {
    editingImage = image;
  }

  function saveEdits(description, focalPoint) {
    editingImage.description = description;
    editingImage.focalPoint = focalPoint;
    editingImage = null;
  }
</script>

<div class="image-composer">
  <input
    type="file"
    accept="image/*"
    multiple
    onchange={(e) => handleImageUpload(Array.from(e.target.files))}
  />

  <div class="image-grid">
    {#each images as image}
      <div class="image-card">
        <img src={image.preview} alt={image.description || 'Uploaded image'} />
        <button onclick={() => editImage(image)}>
          Edit
        </button>
      </div>
    {/each}
  </div>

  {#if editingImage}
    <Compose.ImageEditor
      file={editingImage}
      onSave={saveEdits}
      onCancel={() => editingImage = null}
    />
  {/if}
</div>

<style>
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .image-card {
    position: relative;
    border: 1px solid #e1e8ed;
    border-radius: 8px;
    overflow: hidden;
  }

  .image-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .image-card button {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
</style>
```

### **Example 2: With Alt Text Validation**

Validate alt text quality:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  let editingImage = $state(null);
  let altTextQuality = $state({ score: 0, suggestions: [] });

  function validateAltText(description) {
    const suggestions = [];
    let score = 0;

    if (description.length === 0) {
      suggestions.push('Alt text is required for accessibility');
      return { score: 0, suggestions };
    }

    if (description.length < 10) {
      suggestions.push('Alt text should be more descriptive (at least 10 characters)');
    } else {
      score += 25;
    }

    if (description.toLowerCase().includes('image of') || 
        description.toLowerCase().includes('picture of')) {
      suggestions.push('Avoid phrases like "image of" or "picture of"');
    } else {
      score += 25;
    }

    if (/[A-Z]/.test(description[0])) {
      score += 25;
    } else {
      suggestions.push('Start with a capital letter');
    }

    if (description.includes('.')) {
      score += 25;
    } else {
      suggestions.push('End with proper punctuation');
    }

    return { score, suggestions };
  }

  function handleDescriptionChange(description) {
    altTextQuality = validateAltText(description);
  }

  function saveEdits(description, focalPoint) {
    if (altTextQuality.score < 50) {
      const proceed = confirm(
        'Alt text quality is low. Save anyway?\n\n' +
        altTextQuality.suggestions.join('\n')
      );
      if (!proceed) return;
    }

    editingImage.description = description;
    editingImage.focalPoint = focalPoint;
    editingImage = null;
  }
</script>

{#if editingImage}
  <Compose.ImageEditor
    file={editingImage}
    onSave={saveEdits}
    onCancel={() => editingImage = null}
    onDescriptionChange={handleDescriptionChange}
  >
    <div slot="quality-indicator" class="quality-bar">
      <div class="quality-fill" style="width: {altTextQuality.score}%"></div>
      <span>Quality: {altTextQuality.score}%</span>
    </div>
    
    {#if altTextQuality.suggestions.length > 0}
      <div class="quality-suggestions">
        <h4>Suggestions:</h4>
        <ul>
          {#each altTextQuality.suggestions as suggestion}
            <li>{suggestion}</li>
          {/each}
        </ul>
      </div>
    {/if}
  </Compose.ImageEditor>
{/if}

<style>
  .quality-bar {
    height: 6px;
    background: #e1e8ed;
    border-radius: 3px;
    overflow: hidden;
    position: relative;
    margin-bottom: 1rem;
  }

  .quality-fill {
    height: 100%;
    background: linear-gradient(to right, #ef4444, #fbbf24, #10b981);
    transition: width 0.3s ease;
  }

  .quality-suggestions {
    padding: 1rem;
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .quality-suggestions h4 {
    margin: 0 0 0.5rem;
    font-size: 0.875rem;
  }

  .quality-suggestions ul {
    margin: 0;
    padding-left: 1.5rem;
    font-size: 0.875rem;
  }
</style>
```

### **Example 3: Keyboard Navigation for Focal Point**

Adjust focal point with arrow keys:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  let editingImage = $state(null);
  let focalPoint = $state({ x: 0.5, y: 0.5 });

  function handleKeyboardAdjustment(event) {
    const STEP = 0.05; // 5% adjustment

    switch (event.key) {
      case 'ArrowLeft':
        focalPoint.x = Math.max(0, focalPoint.x - STEP);
        break;
      case 'ArrowRight':
        focalPoint.x = Math.min(1, focalPoint.x + STEP);
        break;
      case 'ArrowUp':
        focalPoint.y = Math.max(0, focalPoint.y - STEP);
        break;
      case 'ArrowDown':
        focalPoint.y = Math.min(1, focalPoint.y + STEP);
        break;
      case 'Enter':
        // Center focal point
        focalPoint = { x: 0.5, y: 0.5 };
        break;
    }
  }

  function saveEdits(description, focalPoint) {
    editingImage.description = description;
    editingImage.focalPoint = focalPoint;
    editingImage = null;
  }
</script>

{#if editingImage}
  <div 
    role="application"
    tabindex="0"
    onkeydown={handleKeyboardAdjustment}
    class="keyboard-editor"
  >
    <div class="hint">
      Use arrow keys to adjust focal point, Enter to center
    </div>
    
    <Compose.ImageEditor
      file={editingImage}
      bind:focalPoint
      onSave={saveEdits}
      onCancel={() => editingImage = null}
    />
  </div>
{/if}

<style>
  .keyboard-editor {
    outline: none;
  }

  .keyboard-editor:focus-within {
    box-shadow: 0 0 0 2px #1d9bf0;
    border-radius: 12px;
  }

  .hint {
    padding: 0.75rem 1rem;
    background: #e8f5fd;
    border: 1px solid #1d9bf0;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    text-align: center;
  }
</style>
```

### **Example 4: Batch Editing Multiple Images**

Edit multiple images in sequence:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  let images = $state([]);
  let currentIndex = $state(0);
  let showEditor = $state(false);

  function startBatchEdit() {
    if (images.length === 0) return;
    currentIndex = 0;
    showEditor = true;
  }

  function saveAndNext(description, focalPoint) {
    images[currentIndex].description = description;
    images[currentIndex].focalPoint = focalPoint;

    if (currentIndex < images.length - 1) {
      currentIndex++;
    } else {
      showEditor = false;
      alert('All images edited!');
    }
  }

  function skipImage() {
    if (currentIndex < images.length - 1) {
      currentIndex++;
    } else {
      showEditor = false;
    }
  }
</script>

<div class="batch-editor">
  {#if !showEditor}
    <button onclick={startBatchEdit}>
      Edit All Images ({images.length})
    </button>
  {/if}

  {#if showEditor}
    <div class="batch-progress">
      <span>Image {currentIndex + 1} of {images.length}</span>
      <div class="progress-bar">
        <div 
          class="progress-fill"
          style="width: {((currentIndex + 1) / images.length) * 100}%"
        ></div>
      </div>
    </div>

    <Compose.ImageEditor
      file={images[currentIndex]}
      onSave={saveAndNext}
      onCancel={() => showEditor = false}
    >
      <div slot="actions">
        <button onclick={skipImage} class="skip-btn">
          Skip
        </button>
      </div>
    </Compose.ImageEditor>
  {/if}
</div>

<style>
  .batch-progress {
    padding: 1rem;
    margin-bottom: 1rem;
    background: #f7f9fa;
    border-radius: 8px;
  }

  .progress-bar {
    height: 6px;
    background: #e1e8ed;
    border-radius: 3px;
    overflow: hidden;
    margin-top: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background: #1d9bf0;
    transition: width 0.3s ease;
  }

  .skip-btn {
    padding: 0.75rem 1.5rem;
    background: transparent;
    border: 1px solid #cfd9de;
    border-radius: 9999px;
    cursor: pointer;
  }
</style>
```

### **Example 5: AI-Powered Alt Text Suggestions**

Generate alt text suggestions using AI:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  let editingImage = $state(null);
  let aiSuggestions = $state([]);
  let generatingAI = $state(false);

  async function generateAltTextSuggestions(imageFile) {
    generatingAI = true;
    
    try {
      // Convert image to base64
      const base64 = await fileToBase64(imageFile);

      // Call AI vision API
      const response = await fetch('/api/ai/describe-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 })
      });

      const data = await response.json();
      aiSuggestions = data.suggestions || [];
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      aiSuggestions = [];
    } finally {
      generatingAI = false;
    }
  }

  async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function applyAISuggestion(suggestion) {
    // Apply to description field
    editingImage.description = suggestion;
  }

  function saveEdits(description, focalPoint) {
    editingImage.description = description;
    editingImage.focalPoint = focalPoint;
    editingImage = null;
  }
</script>

{#if editingImage}
  <Compose.ImageEditor
    file={editingImage}
    onSave={saveEdits}
    onCancel={() => editingImage = null}
  >
    <div slot="ai-suggestions" class="ai-panel">
      <div class="ai-header">
        <h4>🤖 AI Suggestions</h4>
        <button 
          onclick={() => generateAltTextSuggestions(editingImage.file)}
          disabled={generatingAI}
        >
          {generatingAI ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {#if aiSuggestions.length > 0}
        <ul class="suggestions-list">
          {#each aiSuggestions as suggestion}
            <li>
              <span>{suggestion}</span>
              <button onclick={() => applyAISuggestion(suggestion)}>
                Use
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </Compose.ImageEditor>
{/if}

<style>
  .ai-panel {
    padding: 1rem;
    background: #f0fdf4;
    border: 1px solid #10b981;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .ai-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .ai-header h4 {
    margin: 0;
    font-size: 0.875rem;
  }

  .ai-header button {
    padding: 0.5rem 1rem;
    background: #10b981;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    cursor: pointer;
  }

  .ai-header button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .suggestions-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .suggestions-list li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: white;
    border-radius: 6px;
    margin-bottom: 0.5rem;
  }

  .suggestions-list span {
    flex: 1;
    font-size: 0.875rem;
  }

  .suggestions-list button {
    padding: 0.25rem 0.75rem;
    background: #10b981;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 0.75rem;
    cursor: pointer;
  }
</style>
```

### **Example 6: Image Cropping Preview**

Show how the image will look with the focal point:

```svelte
<script lang="ts">
  import { Compose } from '@equaltoai/greater-components-fediverse';

  let editingImage = $state(null);
  let focalPoint = $state({ x: 0.5, y: 0.5 });
  let previewAspectRatio = $state('16:9');

  const aspectRatios = {
    '16:9': { width: 16, height: 9 },
    '4:3': { width: 4, height: 3 },
    '1:1': { width: 1, height: 1 },
    '9:16': { width: 9, height: 16 }
  };

  function saveEdits(description, focalPoint) {
    editingImage.description = description;
    editingImage.focalPoint = focalPoint;
    editingImage = null;
  }
</script>

{#if editingImage}
  <div class="editor-with-preview">
    <div class="preview-controls">
      <h4>Preview as:</h4>
      {#each Object.keys(aspectRatios) as ratio}
        <button
          class:active={previewAspectRatio === ratio}
          onclick={() => previewAspectRatio = ratio}
        >
          {ratio}
        </button>
      {/each}
    </div>

    <div class="preview-container">
      <div 
        class="crop-preview"
        style="aspect-ratio: {aspectRatios[previewAspectRatio].width} / {aspectRatios[previewAspectRatio].height}"
      >
        <img 
          src={editingImage.preview}
          alt="Preview"
          style="object-position: {focalPoint.x * 100}% {focalPoint.y * 100}%"
        />
      </div>
    </div>

    <Compose.ImageEditor
      file={editingImage}
      bind:focalPoint
      onSave={saveEdits}
      onCancel={() => editingImage = null}
    />
  </div>
{/if}

<style>
  .editor-with-preview {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .preview-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .preview-controls h4 {
    margin: 0;
    font-size: 0.875rem;
  }

  .preview-controls button {
    padding: 0.5rem 0.75rem;
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 6px;
    font-size: 0.75rem;
    cursor: pointer;
  }

  .preview-controls button.active {
    background: #1d9bf0;
    color: white;
    border-color: #1d9bf0;
  }

  .crop-preview {
    width: 100%;
    overflow: hidden;
    border: 1px solid #e1e8ed;
    border-radius: 8px;
  }

  .crop-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
```

---

## 🎨 Styling

```css
.image-editor {
  /* Modal */
  --modal-bg: white;
  --modal-overlay: rgba(0, 0, 0, 0.6);
  --modal-radius: 16px;
  --modal-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

  /* Image container */
  --image-bg: #f7f9fa;
  --image-border: #e1e8ed;

  /* Focal point indicator */
  --focal-indicator-color: #1d9bf0;
  --focal-indicator-size: 40px;

  /* Input fields */
  --input-bg: white;
  --input-border: #cfd9de;
  --input-focus: #1d9bf0;
  --input-radius: 8px;

  /* Buttons */
  --button-primary: #1d9bf0;
  --button-secondary: transparent;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .image-editor {
    --modal-bg: #15202b;
    --modal-overlay: rgba(0, 0, 0, 0.8);
    --image-bg: #1c2938;
    --image-border: #38444d;
    --input-bg: #1c2938;
    --input-border: #38444d;
  }
}
```

---

## ♿ Accessibility

### **Alt Text Best Practices**

Provide guidelines for good alt text:

- **Be specific**: "Golden retriever playing fetch in a park" not "dog"
- **Context matters**: Describe what's important for the post
- **Skip "image of"**: Start with the content directly
- **Use punctuation**: Helps screen readers pause naturally
- **Aim for 100-150 characters**: Descriptive but concise
- **Decorative images**: Use empty alt text (`alt=""`) if purely decorative

### **Keyboard Support**
- Tab through all controls
- Arrow keys to adjust focal point
- Enter to save, Escape to cancel

### **Screen Reader Support**
```html
<div role="dialog" aria-label="Edit image" aria-modal="true">
  <label for="alt-text">
    Alt text (required for accessibility)
  </label>
  <textarea
    id="alt-text"
    aria-describedby="alt-text-hint"
    aria-required="true"
  ></textarea>
  <p id="alt-text-hint" class="sr-only">
    Describe what's visible in the image. Aim for 100-150 characters.
  </p>
</div>
```

---

## 🧪 Testing

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { Compose } from '@equaltoai/greater-components-fediverse';

describe('ImageEditor', () => {
  const mockFile = {
    id: '1',
    file: new File(['content'], 'test.jpg', { type: 'image/jpeg' }),
    preview: 'data:image/jpeg;base64,test',
    description: '',
    focalPoint: { x: 0.5, y: 0.5 }
  };

  it('renders image editor', () => {
    render(Compose.ImageEditor, {
      props: {
        file: mockFile,
        onSave: vi.fn(),
        onCancel: vi.fn()
      }
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('updates alt text', async () => {
    const handleSave = vi.fn();

    render(Compose.ImageEditor, {
      props: {
        file: mockFile,
        onSave: handleSave,
        onCancel: vi.fn()
      }
    });

    const textarea = screen.getByLabelText(/alt text/i);
    await fireEvent.input(textarea, {
      target: { value: 'A beautiful sunset' }
    });

    const saveButton = screen.getByText(/save/i);
    await fireEvent.click(saveButton);

    expect(handleSave).toHaveBeenCalledWith(
      'A beautiful sunset',
      expect.any(Object)
    );
  });

  it('updates focal point on click', async () => {
    const handleSave = vi.fn();

    render(Compose.ImageEditor, {
      props: {
        file: mockFile,
        onSave: handleSave,
        onCancel: vi.fn()
      }
    });

    const imageContainer = screen.getByTestId('focal-point-selector');
    
    await fireEvent.click(imageContainer, {
      offsetX: 100,
      offsetY: 50
    });

    const saveButton = screen.getByText(/save/i);
    await fireEvent.click(saveButton);

    expect(handleSave).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        x: expect.any(Number),
        y: expect.any(Number)
      })
    );
  });

  it('cancels editing', async () => {
    const handleCancel = vi.fn();

    render(Compose.ImageEditor, {
      props: {
        file: mockFile,
        onSave: vi.fn(),
        onCancel: handleCancel
      }
    });

    const cancelButton = screen.getByText(/cancel/i);
    await fireEvent.click(cancelButton);

    expect(handleCancel).toHaveBeenCalled();
  });
});
```

---

## 🔗 Related Components

- [Compose.MediaUpload](./MediaUpload.md) - Upload media files
- [MediaUploadHandler Utility](./MediaUploadHandler.md) - Media utilities

---

## 📚 See Also

- [Compose Component Group README](./README.md)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [Alt Text Best Practices](https://www.w3.org/WAI/tutorials/images/)

---

## ❓ FAQ

### **Q: What's a focal point?**

A focal point indicates the most important part of an image. When the image is cropped to different aspect ratios, the focal point stays visible.

### **Q: How do I write good alt text?**

Follow these guidelines:
- Describe what's visible
- Include relevant context
- Be specific but concise (100-150 chars)
- Skip "image of" or "picture of"
- Use proper grammar and punctuation

### **Q: Should all images have alt text?**

Yes, except for purely decorative images. If an image conveys information or context, it needs alt text.

### **Q: Can I use emoji in alt text?**

Yes, but use sparingly and only when they add meaning. Screen readers will read them out.

### **Q: What about complex images like charts?**

For complex images, provide a short alt text and a longer description elsewhere (or in the post text).

---

**Need help?** Check the [Troubleshooting Guide](../../troubleshooting/README.md) or open an issue on [GitHub](https://github.com/lesserphp/greater-components).


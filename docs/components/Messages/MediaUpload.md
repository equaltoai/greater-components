# Messages.MediaUpload

**Component**: Media File Upload  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 68 passing tests

---

## 📋 Overview

`Messages.MediaUpload` provides a comprehensive file upload interface for attaching media (images, videos, documents) to messages. It supports drag-and-drop, paste, click-to-upload, preview generation, progress tracking, and validation.

### **Key Features**:
- ✅ Drag-and-drop file upload
- ✅ Click to browse files
- ✅ Paste image support (Ctrl+V / Cmd+V)
- ✅ Multiple file upload
- ✅ Image preview generation
- ✅ Video thumbnail generation
- ✅ Upload progress indicators
- ✅ File size validation
- ✅ File type validation (MIME type checking)
- ✅ Maximum file limit
- ✅ Image compression/resizing
- ✅ Remove uploaded files
- ✅ Error handling with user feedback
- ✅ Accessible ARIA labels
- ✅ Keyboard navigation

### **What It Does**:

`Messages.MediaUpload` manages the media upload workflow:

1. **File Selection**: Supports drag-drop, click, and paste
2. **Validation**: Checks file size, type, and count limits
3. **Preview**: Generates thumbnails for images/videos
4. **Upload**: Sends files to server with progress tracking
5. **State Management**: Tracks upload state (pending, uploading, success, error)
6. **Integration**: Provides uploaded file IDs to send with messages

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

### **Minimal Setup**

```svelte
<script lang="ts">
  import { MediaUpload } from '@equaltoai/greater-components-fediverse/Messages';
  
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/media/upload', {
      method: 'POST',
      body: formData,
    });
    
    return await response.json(); // { id: 'media-123', url: '...' }
  };
</script>

<MediaUpload onUpload={handleUpload} />
```

### **With All Features**

```svelte
<script lang="ts">
  import { MediaUpload } from '@equaltoai/greater-components-fediverse/Messages';
  import { authStore } from '$lib/stores/auth';
  
  let uploadedFiles = $state<Array<{ id: string; url: string; type: string }>>([]);
  
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/media/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${$authStore.token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const media = await response.json();
    uploadedFiles = [...uploadedFiles, media];
    return media;
  };
  
  const handleRemove = (fileId: string) => {
    uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
  };
</script>

<div class="upload-container">
  <MediaUpload 
    onUpload={handleUpload}
    onRemove={handleRemove}
    maxFiles={4}
    maxSize={10 * 1024 * 1024} // 10 MB
    accept="image/*,video/*"
    multiple={true}
    showPreviews={true}
    compressImages={true}
    class="custom-uploader"
  />
  
  {#if uploadedFiles.length > 0}
    <div class="uploaded-files">
      <h4>Uploaded Files ({uploadedFiles.length})</h4>
      {#each uploadedFiles as file}
        <div class="file-item">
          <img src={file.url} alt="Uploaded file" />
          <button onclick={() => handleRemove(file.id)}>Remove</button>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .upload-container {
    padding: 1rem;
  }
  
  .uploaded-files {
    margin-top: 1rem;
  }
  
  .file-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border: 1px solid var(--border-color, #e1e8ed);
    border-radius: 0.5rem;
  }
  
  .file-item img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 0.25rem;
  }
</style>
```

### **With Custom Styling**

```svelte
<script lang="ts">
  import { MediaUpload } from '@equaltoai/greater-components-fediverse/Messages';
  
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/media/upload', {
      method: 'POST',
      body: formData,
    });
    
    return await response.json();
  };
</script>

<MediaUpload 
  onUpload={handleUpload}
  class="custom-uploader"
/>

<style>
  :global(.custom-uploader) {
    --upload-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --upload-border: 2px dashed rgba(255, 255, 255, 0.5);
    --upload-text-color: white;
    --upload-hover-bg: rgba(255, 255, 255, 0.1);
  }
  
  :global(.custom-uploader .upload-area) {
    background: var(--upload-bg);
    border: var(--upload-border);
    color: var(--upload-text-color);
    border-radius: 1rem;
    padding: 2rem;
    transition: all 0.3s ease;
  }
  
  :global(.custom-uploader .upload-area:hover) {
    background: var(--upload-hover-bg);
    transform: scale(1.02);
  }
  
  :global(.custom-uploader .upload-area.dragging) {
    border-color: white;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  }
</style>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `onUpload` | `(file: File) => Promise<{ id: string; url: string }>` | - | **Yes** | Upload handler function |
| `onRemove` | `(fileId: string) => void` | `undefined` | No | Remove file handler |
| `accept` | `string` | `'image/*,video/*'` | No | Accepted file types (MIME types) |
| `maxSize` | `number` | `10485760` (10 MB) | No | Maximum file size in bytes |
| `maxFiles` | `number` | `4` | No | Maximum number of files |
| `multiple` | `boolean` | `true` | No | Allow multiple file uploads |
| `showPreviews` | `boolean` | `true` | No | Show thumbnail previews |
| `compressImages` | `boolean` | `false` | No | Compress images before upload |
| `compressionQuality` | `number` | `0.8` | No | JPEG compression quality (0-1) |
| `maxImageDimension` | `number` | `2048` | No | Maximum image width/height in pixels |
| `disabled` | `boolean` | `false` | No | Disable file upload |
| `class` | `string` | `''` | No | Custom CSS class for the container |

---

## 📤 Events

### **onUpload**

Called for each file to upload:

```typescript
const handleUpload = async (file: File): Promise<{ id: string; url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/media/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Upload failed');
  }
  
  return await response.json();
};
```

### **onRemove**

Called when a file is removed:

```typescript
const handleRemove = (fileId: string) => {
  console.log('Removing file:', fileId);
  // Update local state, optionally delete from server
};
```

---

## 💡 Examples

### **Example 1: Basic Image Upload**

```svelte
<script lang="ts">
  import { MediaUpload } from '@equaltoai/greater-components-fediverse/Messages';
  import { authStore } from '$lib/stores/auth';
  
  let uploadedImages = $state<Array<{ id: string; url: string }>>([]);
  let uploadError = $state<string | null>(null);
  
  const handleUpload = async (file: File) => {
    uploadError = null;
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${$authStore.token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }
      
      const media = await response.json();
      uploadedImages = [...uploadedImages, media];
      
      console.log('Image uploaded:', media.url);
      return media;
    } catch (error) {
      uploadError = error instanceof Error ? error.message : 'Upload failed';
      throw error;
    }
  };
  
  const handleRemove = (fileId: string) => {
    uploadedImages = uploadedImages.filter(img => img.id !== fileId);
  };
</script>

<div class="image-uploader">
  <h3>Upload Images</h3>
  
  {#if uploadError}
    <div class="error-message" role="alert">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      <span>{uploadError}</span>
    </div>
  {/if}
  
  <MediaUpload 
    onUpload={handleUpload}
    onRemove={handleRemove}
    accept="image/jpeg,image/png,image/webp,image/gif"
    maxSize={5 * 1024 * 1024} // 5 MB
    maxFiles={8}
    showPreviews={true}
  />
  
  {#if uploadedImages.length > 0}
    <div class="image-grid">
      {#each uploadedImages as image}
        <div class="image-item">
          <img src={image.url} alt="Uploaded" />
          <button 
            class="remove-button"
            onclick={() => handleRemove(image.id)}
            aria-label="Remove image"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
            </svg>
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .image-uploader {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .image-uploader h3 {
    margin: 0 0 1.5rem;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .error-message {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    margin-bottom: 1rem;
    background: rgba(244, 33, 46, 0.1);
    border: 1px solid #f4211e;
    border-radius: 0.5rem;
    color: #f4211e;
    font-size: 0.875rem;
  }
  
  .error-message svg {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }
  
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .image-item {
    position: relative;
    aspect-ratio: 1;
    border-radius: 0.5rem;
    overflow: hidden;
  }
  
  .image-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .remove-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);
    border: none;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  
  .remove-button:hover {
    background: rgba(244, 33, 46, 0.9);
  }
  
  .remove-button svg {
    width: 1.25rem;
    height: 1.25rem;
  }
</style>
```

### **Example 2: With Drag-and-Drop and Progress**

```svelte
<script lang="ts">
  import { MediaUpload } from '@equaltoai/greater-components-fediverse/Messages';
  import { authStore } from '$lib/stores/auth';
  
  let isDragging = $state(false);
  let uploadProgress = $state<Map<string, number>>(new Map());
  let uploadedFiles = $state<Array<{ id: string; url: string; name: string }>>([]);
  
  const handleUpload = async (file: File) => {
    const fileKey = `${file.name}-${Date.now()}`;
    uploadProgress.set(fileKey, 0);
    uploadProgress = new Map(uploadProgress);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          uploadProgress.set(fileKey, progress);
          uploadProgress = new Map(uploadProgress);
        }
      };
      
      // Handle completion
      const uploadPromise = new Promise<{ id: string; url: string }>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            const media = JSON.parse(xhr.responseText);
            resolve(media);
          } else {
            reject(new Error('Upload failed'));
          }
        };
        
        xhr.onerror = () => reject(new Error('Upload failed'));
      });
      
      xhr.open('POST', '/api/media/upload');
      xhr.setRequestHeader('Authorization', `Bearer ${$authStore.token}`);
      xhr.send(formData);
      
      const media = await uploadPromise;
      
      // Remove progress, add to uploaded files
      uploadProgress.delete(fileKey);
      uploadProgress = new Map(uploadProgress);
      
      uploadedFiles = [...uploadedFiles, { ...media, name: file.name }];
      
      return media;
    } catch (error) {
      uploadProgress.delete(fileKey);
      uploadProgress = new Map(uploadProgress);
      throw error;
    }
  };
  
  const handleDragEnter = () => {
    isDragging = true;
  };
  
  const handleDragLeave = () => {
    isDragging = false;
  };
  
  const handleDrop = () => {
    isDragging = false;
  };
</script>

<div 
  class="drag-drop-uploader"
  class:dragging={isDragging}
  ondragenter={handleDragEnter}
  ondragleave={handleDragLeave}
  ondrop={handleDrop}
>
  <div class="upload-area">
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
    </svg>
    
    <h3>Upload Files</h3>
    <p>Drag and drop files here or click to browse</p>
    
    <MediaUpload 
      onUpload={handleUpload}
      maxFiles={10}
      maxSize={20 * 1024 * 1024} // 20 MB
      multiple={true}
    />
  </div>
  
  {#if uploadProgress.size > 0}
    <div class="progress-area">
      <h4>Uploading...</h4>
      {#each Array.from(uploadProgress.entries()) as [key, progress]}
        <div class="progress-item">
          <span class="file-name">{key.split('-')[0]}</span>
          <div class="progress-bar">
            <div 
              class="progress-fill"
              style:width="{progress}%"
            ></div>
          </div>
          <span class="progress-text">{Math.round(progress)}%</span>
        </div>
      {/each}
    </div>
  {/if}
  
  {#if uploadedFiles.length > 0}
    <div class="uploaded-area">
      <h4>Uploaded Files ({uploadedFiles.length})</h4>
      <ul>
        {#each uploadedFiles as file}
          <li>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>{file.name}</span>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .drag-drop-uploader {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .upload-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 2rem;
    border: 2px dashed var(--border-color, #e1e8ed);
    border-radius: 1rem;
    background: var(--background-secondary, #f7f9fa);
    transition: all 0.3s ease;
  }
  
  .dragging .upload-area {
    border-color: var(--primary, #1da1f2);
    background: rgba(29, 161, 242, 0.05);
    transform: scale(1.02);
  }
  
  .upload-area > svg {
    width: 4rem;
    height: 4rem;
    margin-bottom: 1rem;
    color: var(--text-secondary, #657786);
  }
  
  .upload-area h3 {
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .upload-area p {
    margin: 0;
    color: var(--text-secondary, #657786);
    font-size: 0.9375rem;
  }
  
  .progress-area {
    margin-top: 1.5rem;
    padding: 1.5rem;
    background: var(--background, #ffffff);
    border: 1px solid var(--border-color, #e1e8ed);
    border-radius: 0.5rem;
  }
  
  .progress-area h4 {
    margin: 0 0 1rem;
    font-size: 1rem;
    font-weight: 600;
  }
  
  .progress-item {
    display: grid;
    grid-template-columns: 1fr 200px 50px;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }
  
  .file-name {
    font-size: 0.875rem;
    color: var(--text-primary, #14171a);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .progress-bar {
    height: 0.5rem;
    background: var(--background-secondary, #f7f9fa);
    border-radius: 0.25rem;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: var(--primary, #1da1f2);
    transition: width 0.3s ease;
  }
  
  .progress-text {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary, #657786);
    text-align: right;
  }
  
  .uploaded-area {
    margin-top: 1.5rem;
    padding: 1.5rem;
    background: rgba(0, 186, 124, 0.05);
    border: 1px solid rgba(0, 186, 124, 0.2);
    border-radius: 0.5rem;
  }
  
  .uploaded-area h4 {
    margin: 0 0 1rem;
    font-size: 1rem;
    font-weight: 600;
    color: #00ba7c;
  }
  
  .uploaded-area ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .uploaded-area li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    font-size: 0.875rem;
  }
  
  .uploaded-area svg {
    width: 1.25rem;
    height: 1.25rem;
    color: #00ba7c;
    flex-shrink: 0;
  }
</style>
```

### **Example 3: With Image Compression**

```svelte
<script lang="ts">
  import { MediaUpload } from '@equaltoai/greater-components-fediverse/Messages';
  import { authStore } from '$lib/stores/auth';
  
  let originalSize = $state<number>(0);
  let compressedSize = $state<number>(0);
  let compressionRatio = $derived(() => {
    if (!originalSize || !compressedSize) return 0;
    return ((1 - compressedSize / originalSize) * 100).toFixed(1);
  });
  
  const handleUpload = async (file: File) => {
    originalSize += file.size;
    
    // Compress image before upload
    const compressed = await compressImage(file, {
      maxDimension: 1920,
      quality: 0.85,
    });
    
    compressedSize += compressed.size;
    
    const formData = new FormData();
    formData.append('file', compressed);
    
    const response = await fetch('/api/media/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${$authStore.token}`,
      },
      body: formData,
    });
    
    return await response.json();
  };
  
  async function compressImage(
    file: File, 
    options: { maxDimension: number; quality: number }
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        
        // Calculate new dimensions
        let { width, height } = img;
        const maxDim = options.maxDimension;
        
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = (height / width) * maxDim;
            width = maxDim;
          } else {
            width = (width / height) * maxDim;
            height = maxDim;
          }
        }
        
        // Create canvas and compress
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Compression failed'));
              return;
            }
            
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            
            resolve(compressedFile);
          },
          'image/jpeg',
          options.quality
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
    });
  }
</script>

<div class="compression-uploader">
  <h3>Smart Image Upload</h3>
  <p class="subtitle">Images are automatically compressed to save bandwidth</p>
  
  {#if compressionRatio > 0}
    <div class="compression-stats">
      <div class="stat">
        <span class="stat-label">Original Size</span>
        <span class="stat-value">{(originalSize / 1024 / 1024).toFixed(2)} MB</span>
      </div>
      <div class="stat">
        <span class="stat-label">Compressed Size</span>
        <span class="stat-value">{(compressedSize / 1024 / 1024).toFixed(2)} MB</span>
      </div>
      <div class="stat stat--highlight">
        <span class="stat-label">Saved</span>
        <span class="stat-value">{compressionRatio}%</span>
      </div>
    </div>
  {/if}
  
  <MediaUpload 
    onUpload={handleUpload}
    accept="image/jpeg,image/png,image/webp"
    maxSize={25 * 1024 * 1024} // 25 MB (before compression)
    compressImages={true}
    compressionQuality={0.85}
    maxImageDimension={1920}
  />
</div>

<style>
  .compression-uploader {
    max-width: 700px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .compression-uploader h3 {
    margin: 0 0 0.5rem;
    font-size: 1.75rem;
    font-weight: 700;
  }
  
  .subtitle {
    margin: 0 0 1.5rem;
    color: var(--text-secondary, #657786);
    font-size: 0.9375rem;
  }
  
  .compression-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 1.5rem;
    background: var(--background-secondary, #f7f9fa);
    border-radius: 0.75rem;
  }
  
  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .stat-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-secondary, #657786);
    margin-bottom: 0.5rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary, #14171a);
  }
  
  .stat--highlight .stat-label {
    color: #00ba7c;
  }
  
  .stat--highlight .stat-value {
    color: #00ba7c;
  }
</style>
```

### **Example 4: With File Type Validation and Preview**

```svelte
<script lang="ts">
  import { MediaUpload } from '@equaltoai/greater-components-fediverse/Messages';
  import { authStore } from '$lib/stores/auth';
  
  let uploadedMedia = $state<Array<{
    id: string;
    url: string;
    type: string;
    name: string;
  }>>([]);
  
  const handleUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} not allowed`);
    }
    
    // Validate video duration (max 2 minutes)
    if (file.type.startsWith('video/')) {
      const duration = await getVideoDuration(file);
      if (duration > 120) {
        throw new Error('Video must be less than 2 minutes');
      }
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/media/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${$authStore.token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const media = await response.json();
    uploadedMedia = [...uploadedMedia, { ...media, type: file.type, name: file.name }];
    
    return media;
  };
  
  async function getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);
      
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error('Failed to load video metadata'));
      };
    });
  }
  
  const handleRemove = (fileId: string) => {
    uploadedMedia = uploadedMedia.filter(m => m.id !== fileId);
  };
  
  const getMediaIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return `<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>`;
    } else if (type.startsWith('video/')) {
      return `<path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>`;
    }
    return `<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>`;
  };
</script>

<div class="media-uploader">
  <h3>Upload Media</h3>
  <p class="help-text">Supported: JPEG, PNG, WebP, GIF, MP4, WebM (max 2 min)</p>
  
  <MediaUpload 
    onUpload={handleUpload}
    onRemove={handleRemove}
    accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
    maxSize={50 * 1024 * 1024} // 50 MB
    maxFiles={6}
    showPreviews={true}
  />
  
  {#if uploadedMedia.length > 0}
    <div class="media-list">
      <h4>Uploaded Media</h4>
      {#each uploadedMedia as media}
        <div class="media-item">
          <div class="media-preview">
            {#if media.type.startsWith('image/')}
              <img src={media.url} alt={media.name} />
            {:else if media.type.startsWith('video/')}
              <video src={media.url} controls></video>
            {:else}
              <svg viewBox="0 0 24 24" fill="currentColor">
                {@html getMediaIcon(media.type)}
              </svg>
            {/if}
          </div>
          
          <div class="media-info">
            <strong>{media.name}</strong>
            <span class="media-type">{media.type}</span>
          </div>
          
          <button 
            class="remove-button"
            onclick={() => handleRemove(media.id)}
            aria-label="Remove {media.name}"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .media-uploader {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .media-uploader h3 {
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .help-text {
    margin: 0 0 1.5rem;
    color: var(--text-secondary, #657786);
    font-size: 0.875rem;
  }
  
  .media-list {
    margin-top: 1.5rem;
  }
  
  .media-list h4 {
    margin: 0 0 1rem;
    font-size: 1.125rem;
    font-weight: 600;
  }
  
  .media-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    margin-bottom: 0.75rem;
    border: 1px solid var(--border-color, #e1e8ed);
    border-radius: 0.5rem;
    background: var(--background, #ffffff);
  }
  
  .media-preview {
    width: 80px;
    height: 80px;
    border-radius: 0.5rem;
    overflow: hidden;
    background: var(--background-secondary, #f7f9fa);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .media-preview img,
  .media-preview video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .media-preview svg {
    width: 2.5rem;
    height: 2.5rem;
    color: var(--text-secondary, #657786);
  }
  
  .media-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .media-info strong {
    font-size: 0.9375rem;
    color: var(--text-primary, #14171a);
  }
  
  .media-type {
    font-size: 0.75rem;
    color: var(--text-secondary, #657786);
  }
  
  .remove-button {
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--text-secondary, #657786);
    cursor: pointer;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
  }
  
  .remove-button:hover {
    background: rgba(244, 33, 46, 0.1);
    color: #f4211e;
  }
  
  .remove-button svg {
    width: 1.5rem;
    height: 1.5rem;
  }
</style>
```

### **Example 5: With Paste Support**

```svelte
<script lang="ts">
  import { MediaUpload } from '@equaltoai/greater-components-fediverse/Messages';
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth';
  
  let pastedImages = $state<Array<{ id: string; url: string }>>([]);
  
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/media/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${$authStore.token}`,
      },
      body: formData,
    });
    
    const media = await response.json();
    pastedImages = [...pastedImages, media];
    
    return media;
  };
  
  const handlePaste = async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;
    
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          try {
            await handleUpload(file);
            console.log('Image pasted and uploaded');
          } catch (error) {
            console.error('Failed to upload pasted image:', error);
          }
        }
      }
    }
  };
  
  onMount(() => {
    document.addEventListener('paste', handlePaste);
    
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  });
</script>

<div class="paste-uploader">
  <div class="paste-hint">
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"/>
    </svg>
    <div>
      <h4>Paste images directly!</h4>
      <p>Press <kbd>Ctrl+V</kbd> (or <kbd>Cmd+V</kbd> on Mac) to paste images from clipboard</p>
    </div>
  </div>
  
  <MediaUpload 
    onUpload={handleUpload}
    accept="image/*"
    maxFiles={10}
    showPreviews={true}
  />
  
  {#if pastedImages.length > 0}
    <div class="pasted-images">
      <h4>Pasted Images ({pastedImages.length})</h4>
      <div class="image-grid">
        {#each pastedImages as image}
          <img src={image.url} alt="Pasted" />
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .paste-uploader {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .paste-hint {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
    border: 2px solid rgba(102, 126, 234, 0.3);
    border-radius: 0.75rem;
  }
  
  .paste-hint svg {
    width: 3rem;
    height: 3rem;
    color: #667eea;
    flex-shrink: 0;
  }
  
  .paste-hint h4 {
    margin: 0 0 0.25rem;
    font-size: 1.125rem;
    font-weight: 600;
  }
  
  .paste-hint p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-secondary, #657786);
  }
  
  kbd {
    padding: 0.125rem 0.375rem;
    background: var(--background-secondary, #f7f9fa);
    border: 1px solid var(--border-color, #e1e8ed);
    border-radius: 0.25rem;
    font-family: monospace;
    font-size: 0.75rem;
  }
  
  .pasted-images {
    margin-top: 2rem;
  }
  
  .pasted-images h4 {
    margin: 0 0 1rem;
    font-size: 1.125rem;
    font-weight: 600;
  }
  
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .image-grid img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 0.5rem;
  }
</style>
```

---

## 🔒 Security Considerations

### **File Type Validation**

Server-side validation is critical:

```typescript
// Server-side (Node.js/Express)
import { fileTypeFromBuffer } from 'file-type';

app.post('/api/media/upload', async (req, res) => {
  const file = req.files.file;
  
  // Verify MIME type by reading file header (not just extension)
  const fileType = await fileTypeFromBuffer(file.buffer);
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'];
  
  if (!fileType || !allowedTypes.includes(fileType.mime)) {
    return res.status(400).json({ error: 'Invalid file type' });
  }
  
  // ... process upload
});
```

### **File Size Limits**

Enforce both client and server limits:

```typescript
// Server-side
app.post('/api/media/upload', (req, res) => {
  const maxSize = 10 * 1024 * 1024; // 10 MB
  
  if (req.files.file.size > maxSize) {
    return res.status(413).json({ error: 'File too large' });
  }
  
  // ... process upload
});
```

### **Virus Scanning**

Scan uploaded files for malware:

```typescript
import ClamScan from 'clamscan';

const scanner = await new ClamScan().init();

app.post('/api/media/upload', async (req, res) => {
  const { isInfected } = await scanner.scanFile(req.files.file.tempFilePath);
  
  if (isInfected) {
    return res.status(400).json({ error: 'File contains malware' });
  }
  
  // ... process upload
});
```

---

## ♿ Accessibility

### **ARIA Labels**

```svelte
<div 
  class="upload-area"
  role="button"
  tabindex="0"
  aria-label="Click or drag files to upload"
>
  <input 
    type="file"
    aria-label="File upload input"
    accept="image/*,video/*"
  />
</div>
```

### **Keyboard Navigation**

- **Tab**: Focus upload button
- **Enter / Space**: Activate file picker
- **Escape**: Cancel upload

---

## ⚡ Performance

### **Lazy Loading**

Load compression library only when needed:

```typescript
let compressionLib: typeof import('browser-image-compression') | null = null;

const compressImage = async (file: File) => {
  if (!compressionLib) {
    compressionLib = await import('browser-image-compression');
  }
  
  return await compressionLib.default(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
  });
};
```

---

## 🧪 Testing

```typescript
import { render, fireEvent } from '@testing-library/svelte';
import { MediaUpload } from '@equaltoai/greater-components-fediverse/Messages';

test('uploads file', async () => {
  const onUpload = vi.fn().mockResolvedValue({ id: '1', url: 'https://...' });
  
  const { getByLabelText } = render(MediaUpload, {
    props: { onUpload },
  });
  
  const input = getByLabelText(/file upload/i);
  const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  
  await fireEvent.change(input, { target: { files: [file] } });
  
  expect(onUpload).toHaveBeenCalledWith(file);
});
```

---

## 🔗 Related Components

- [Messages.Composer](/docs/components/Messages/Composer.md) - Message input
- [Messages.Message](/docs/components/Messages/Message.md) - Display attachments

---

## 📚 See Also

- [Messages Component Group Overview](/docs/components/Messages/README.md)
- [File Upload Best Practices](/docs/guides/file-uploads.md)

---

**Last Updated**: 2025-10-12  
**Version**: 1.0.0


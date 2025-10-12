# Compose Utilities: MediaUploadHandler

**Module**: Media File Processing Utility  
**Package**: `@greater/fediverse`  
**Export**: `Compose.MediaUploadHandler` or direct imports

---

## 📋 Overview

The `MediaUploadHandler` utility provides comprehensive media file processing capabilities including validation, preview generation, thumbnail creation, and metadata extraction for images, videos, and audio files.

### **Key Features**:
- ✅ **File validation** (type, size, dimensions)
- ✅ **Preview generation** for all media types
- ✅ **Thumbnail generation** for videos
- ✅ **Metadata extraction** (dimensions, duration)
- ✅ **MIME type detection**
- ✅ **File size formatting**
- ✅ **Memory management** (cleanup object URLs)
- ✅ **TypeScript** fully typed
- ✅ **Zero dependencies**

---

## 📦 Installation

```bash
npm install @greater/fediverse
```

---

## 🔧 API Reference

### **Types**

```typescript
interface MediaUploadConfig {
  /** Maximum file size in bytes (default: 10MB) */
  maxFileSize?: number;
  
  /** Allowed MIME types (default: images/videos/audio) */
  allowedTypes?: string[];
  
  /** Maximum image dimensions */
  maxImageDimensions?: { width: number; height: number };
  
  /** Maximum video duration in seconds */
  maxVideoDuration?: number;
}

interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video' | 'audio' | 'unknown';
  preview?: string;
  thumbnail?: string;
  dimensions?: { width: number; height: number };
  duration?: number;
  error?: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}
```

### **Functions**

#### **detectMediaType()**

Detect media type from MIME type.

```typescript
function detectMediaType(file: File): 'image' | 'video' | 'audio' | 'unknown'
```

**Parameters**:
- `file`: File to detect type for

**Returns**: Media type string.

**Example**:
```typescript
import { detectMediaType } from '@greater/fediverse/Compose';

const file = new File(['...'], 'photo.jpg', { type: 'image/jpeg' });
console.log(detectMediaType(file)); // "image"
```

---

#### **formatFileSize()**

Format file size in human-readable format.

```typescript
function formatFileSize(bytes: number): string
```

**Parameters**:
- `bytes`: File size in bytes

**Returns**: Formatted string (e.g., "2.5 MB").

**Example**:
```typescript
import { formatFileSize } from '@greater/fediverse/Compose';

console.log(formatFileSize(1024));           // "1 KB"
console.log(formatFileSize(1048576));        // "1 MB"
console.log(formatFileSize(2500000));        // "2.4 MB"
console.log(formatFileSize(1073741824));     // "1 GB"
```

---

#### **validateFile()**

Validate a single file against configuration.

```typescript
function validateFile(
  file: File,
  config?: MediaUploadConfig
): ValidationResult
```

**Parameters**:
- `file`: File to validate
- `config`: Validation configuration

**Returns**: Validation result with errors.

**Example**:
```typescript
import { validateFile } from '@greater/fediverse/Compose';

const file = new File(['...'], 'photo.jpg', { type: 'image/jpeg' });
const result = validateFile(file, {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png']
});

if (result.valid) {
  console.log('File is valid');
} else {
  console.error('Validation errors:', result.errors);
}
```

---

#### **validateFiles()**

Validate multiple files.

```typescript
function validateFiles(
  files: File[],
  config?: MediaUploadConfig
): ValidationResult
```

**Parameters**:
- `files`: Array of files to validate
- `config`: Validation configuration

**Returns**: Combined validation result.

**Example**:
```typescript
import { validateFiles } from '@greater/fediverse/Compose';

const files = [file1, file2, file3];
const result = validateFiles(files, {
  maxFileSize: 10 * 1024 * 1024
});

if (!result.valid) {
  alert('Some files are invalid:\n' + result.errors.join('\n'));
}
```

---

#### **createPreviewUrl()**

Create a preview URL for a file.

```typescript
function createPreviewUrl(file: File): string
```

**Parameters**:
- `file`: File to create preview for

**Returns**: Object URL for preview.

**Example**:
```typescript
import { createPreviewUrl } from '@greater/fediverse/Compose';

const file = new File(['...'], 'photo.jpg', { type: 'image/jpeg' });
const previewUrl = createPreviewUrl(file);

// Use in img tag
const img = document.createElement('img');
img.src = previewUrl;

// Don't forget to cleanup!
// URL.revokeObjectURL(previewUrl);
```

---

#### **generateThumbnail()**

Generate a thumbnail for a video file.

```typescript
function generateThumbnail(
  file: File,
  timeSeconds: number = 1
): Promise<string>
```

**Parameters**:
- `file`: Video file
- `timeSeconds`: Time position for thumbnail (default: 1 second)

**Returns**: Promise resolving to thumbnail data URL.

**Example**:
```typescript
import { generateThumbnail } from '@greater/fediverse/Compose';

const videoFile = new File(['...'], 'video.mp4', { type: 'video/mp4' });
const thumbnail = await generateThumbnail(videoFile, 2); // 2 seconds in

img.src = thumbnail; // data:image/png;base64,...
```

---

#### **getImageDimensions()**

Get dimensions of an image file.

```typescript
function getImageDimensions(file: File): Promise<{
  width: number;
  height: number;
}>
```

**Parameters**:
- `file`: Image file

**Returns**: Promise resolving to dimensions.

**Example**:
```typescript
import { getImageDimensions } from '@greater/fediverse/Compose';

const imageFile = new File(['...'], 'photo.jpg', { type: 'image/jpeg' });
const { width, height } = await getImageDimensions(imageFile);

console.log(`Image is ${width}x${height}px`);
```

---

#### **getVideoDuration()**

Get duration of a video file.

```typescript
function getVideoDuration(file: File): Promise<number>
```

**Parameters**:
- `file`: Video file

**Returns**: Promise resolving to duration in seconds.

**Example**:
```typescript
import { getVideoDuration } from '@greater/fediverse/Compose';

const videoFile = new File(['...'], 'video.mp4', { type: 'video/mp4' });
const duration = await getVideoDuration(videoFile);

console.log(`Video is ${duration.toFixed(1)} seconds long`);
```

---

#### **processFile()**

Process a file (validate, generate preview, extract metadata).

```typescript
function processFile(
  file: File,
  config?: MediaUploadConfig
): Promise<MediaFile>
```

**Parameters**:
- `file`: File to process
- `config`: Processing configuration

**Returns**: Promise resolving to processed MediaFile object.

**Example**:
```typescript
import { processFile } from '@greater/fediverse/Compose';

const file = new File(['...'], 'photo.jpg', { type: 'image/jpeg' });
const mediaFile = await processFile(file);

console.log(mediaFile);
// {
//   id: "uuid",
//   file: File,
//   type: "image",
//   preview: "blob:...",
//   dimensions: { width: 1920, height: 1080 }
// }
```

---

#### **processFiles()**

Process multiple files.

```typescript
function processFiles(
  files: File[],
  config?: MediaUploadConfig
): Promise<MediaFile[]>
```

**Parameters**:
- `files`: Array of files to process
- `config`: Processing configuration

**Returns**: Promise resolving to array of processed MediaFile objects.

**Example**:
```typescript
import { processFiles } from '@greater/fediverse/Compose';

const files = [file1, file2, file3];
const mediaFiles = await processFiles(files);

mediaFiles.forEach(mf => {
  if (mf.error) {
    console.error(`Error processing ${mf.file.name}:`, mf.error);
  } else {
    console.log(`Processed ${mf.file.name}: ${mf.type}`);
  }
});
```

---

#### **cleanupMediaFile()**

Cleanup object URLs for a media file.

```typescript
function cleanupMediaFile(mediaFile: MediaFile): void
```

**Parameters**:
- `mediaFile`: Media file to cleanup

**Example**:
```typescript
import { cleanupMediaFile } from '@greater/fediverse/Compose';

// After upload is complete
cleanupMediaFile(mediaFile);
```

---

#### **cleanupMediaFiles()**

Cleanup object URLs for multiple media files.

```typescript
function cleanupMediaFiles(mediaFiles: MediaFile[]): void
```

**Parameters**:
- `mediaFiles`: Array of media files to cleanup

**Example**:
```typescript
import { cleanupMediaFiles } from '@greater/fediverse/Compose';

// Cleanup all files
cleanupMediaFiles(allMediaFiles);
```

---

## 💡 Usage Examples

### **Example 1: File Upload with Validation**

Handle file input with validation:

```typescript
import { processFiles, validateFiles } from '@greater/fediverse/Compose';

const input = document.querySelector('input[type="file"]');
const config = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif']
};

input.addEventListener('change', async (e) => {
  const files = Array.from(e.target.files);
  
  // Validate first
  const validation = validateFiles(files, config);
  if (!validation.valid) {
    alert('Validation failed:\n' + validation.errors.join('\n'));
    return;
  }
  
  // Process files
  const mediaFiles = await processFiles(files, config);
  
  // Display previews
  displayPreviews(mediaFiles);
});

function displayPreviews(mediaFiles) {
  const container = document.querySelector('.previews');
  container.innerHTML = '';
  
  mediaFiles.forEach(mf => {
    const img = document.createElement('img');
    img.src = mf.preview;
    img.alt = mf.file.name;
    container.appendChild(img);
  });
}
```

### **Example 2: Video Thumbnail Generation**

Generate and display video thumbnails:

```typescript
import { generateThumbnail, getVideoDuration } from '@greater/fediverse/Compose';

async function handleVideoUpload(videoFile) {
  try {
    // Get duration
    const duration = await getVideoDuration(videoFile);
    console.log(`Video duration: ${duration.toFixed(1)}s`);
    
    // Generate thumbnail from middle of video
    const midpoint = duration / 2;
    const thumbnail = await generateThumbnail(videoFile, midpoint);
    
    // Display thumbnail
    const img = document.createElement('img');
    img.src = thumbnail;
    img.alt = 'Video thumbnail';
    document.querySelector('.thumbnails').appendChild(img);
    
  } catch (error) {
    console.error('Failed to process video:', error);
  }
}
```

### **Example 3: Image Dimension Validation**

Validate image dimensions:

```typescript
import { getImageDimensions, validateFile } from '@greater/fediverse/Compose';

async function validateImageDimensions(file) {
  // Basic validation
  const basicValidation = validateFile(file);
  if (!basicValidation.valid) {
    return basicValidation;
  }
  
  // Check dimensions
  try {
    const { width, height } = await getImageDimensions(file);
    
    const errors = [];
    
    if (width < 200 || height < 200) {
      errors.push('Image must be at least 200x200 pixels');
    }
    
    if (width > 4000 || height > 4000) {
      errors.push('Image must not exceed 4000x4000 pixels');
    }
    
    const aspectRatio = width / height;
    if (aspectRatio < 0.5 || aspectRatio > 2) {
      errors.push('Image aspect ratio must be between 1:2 and 2:1');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  } catch (error) {
    return {
      valid: false,
      errors: ['Failed to load image']
    };
  }
}
```

### **Example 4: Drag & Drop with Progress**

Handle drag & drop uploads:

```typescript
import { processFiles } from '@greater/fediverse/Compose';

const dropZone = document.querySelector('.drop-zone');

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragging');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragging');
});

dropZone.addEventListener('drop', async (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragging');
  
  const files = Array.from(e.dataTransfer.files);
  
  // Show progress
  const progress = document.querySelector('.progress');
  progress.textContent = 'Processing files...';
  
  try {
    const mediaFiles = await processFiles(files);
    
    progress.textContent = `Processed ${mediaFiles.length} file(s)`;
    displayFiles(mediaFiles);
  } catch (error) {
    progress.textContent = 'Error processing files';
    console.error(error);
  }
});
```

### **Example 5: Multiple File Type Handling**

Handle different media types differently:

```typescript
import {
  detectMediaType,
  processFile,
  generateThumbnail,
  getImageDimensions,
  getVideoDuration
} from '@greater/fediverse/Compose';

async function processMediaFile(file) {
  const type = detectMediaType(file);
  const mediaFile = await processFile(file);
  
  switch (type) {
    case 'image':
      const dimensions = await getImageDimensions(file);
      console.log(`Image: ${dimensions.width}x${dimensions.height}`);
      break;
      
    case 'video':
      const duration = await getVideoDuration(file);
      const thumbnail = await generateThumbnail(file);
      console.log(`Video: ${duration.toFixed(1)}s`);
      mediaFile.thumbnail = thumbnail;
      break;
      
    case 'audio':
      console.log('Audio file uploaded');
      break;
      
    default:
      console.warn('Unknown file type');
  }
  
  return mediaFile;
}
```

### **Example 6: Memory Management**

Properly cleanup resources:

```typescript
import { processFiles, cleanupMediaFiles } from '@greater/fediverse/Compose';

let currentMediaFiles = [];

async function loadNewFiles(files) {
  // Cleanup old files first
  if (currentMediaFiles.length > 0) {
    cleanupMediaFiles(currentMediaFiles);
  }
  
  // Process new files
  currentMediaFiles = await processFiles(files);
  displayFiles(currentMediaFiles);
}

// Cleanup when component unmounts
window.addEventListener('beforeunload', () => {
  cleanupMediaFiles(currentMediaFiles);
});
```

### **Example 7: File Size Warnings**

Show warnings for large files:

```typescript
import { formatFileSize, validateFile } from '@greater/fediverse/Compose';

function checkFileSize(file) {
  const size = file.size;
  const formatted = formatFileSize(size);
  
  // Warn for files over 5MB
  if (size > 5 * 1024 * 1024) {
    const proceed = confirm(
      `This file is ${formatted}. Large files may take longer to upload. Continue?`
    );
    return proceed;
  }
  
  return true;
}

input.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  
  if (!checkFileSize(file)) {
    input.value = ''; // Clear selection
    return;
  }
  
  // Continue with upload...
});
```

### **Example 8: Batch Processing with Error Handling**

Process multiple files with individual error handling:

```typescript
import { processFile } from '@greater/fediverse/Compose';

async function batchProcessFiles(files) {
  const results = await Promise.allSettled(
    files.map(file => processFile(file))
  );
  
  const successful = [];
  const failed = [];
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      successful.push(result.value);
    } else {
      failed.push({
        file: files[index],
        error: result.reason
      });
    }
  });
  
  if (failed.length > 0) {
    console.warn(`Failed to process ${failed.length} file(s):`);
    failed.forEach(f => {
      console.error(`- ${f.file.name}: ${f.error}`);
    });
  }
  
  return { successful, failed };
}
```

---

## 🧪 Testing

```typescript
import { describe, it, expect } from 'vitest';
import {
  detectMediaType,
  formatFileSize,
  validateFile,
  getImageDimensions,
  generateThumbnail
} from '@greater/fediverse/Compose';

describe('MediaUploadHandler', () => {
  describe('detectMediaType', () => {
    it('detects image types', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      expect(detectMediaType(file)).toBe('image');
    });

    it('detects video types', () => {
      const file = new File([''], 'test.mp4', { type: 'video/mp4' });
      expect(detectMediaType(file)).toBe('video');
    });

    it('detects audio types', () => {
      const file = new File([''], 'test.mp3', { type: 'audio/mpeg' });
      expect(detectMediaType(file)).toBe('audio');
    });

    it('returns unknown for unrecognized types', () => {
      const file = new File([''], 'test.pdf', { type: 'application/pdf' });
      expect(detectMediaType(file)).toBe('unknown');
    });
  });

  describe('formatFileSize', () => {
    it('formats bytes', () => {
      expect(formatFileSize(500)).toBe('500 B');
    });

    it('formats kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
    });

    it('formats megabytes', () => {
      expect(formatFileSize(1048576)).toBe('1 MB');
    });

    it('formats gigabytes', () => {
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });

    it('rounds to 1 decimal place', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });
  });

  describe('validateFile', () => {
    it('validates file type', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const result = validateFile(file, {
        allowedTypes: ['image/jpeg', 'image/png']
      });
      expect(result.valid).toBe(true);
    });

    it('rejects invalid file type', () => {
      const file = new File([''], 'test.pdf', { type: 'application/pdf' });
      const result = validateFile(file, {
        allowedTypes: ['image/jpeg', 'image/png']
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('File type not allowed: application/pdf');
    });

    it('validates file size', () => {
      const largeFile = new File([new ArrayBuffer(11 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg'
      });
      const result = validateFile(largeFile, {
        maxFileSize: 10 * 1024 * 1024
      });
      expect(result.valid).toBe(false);
    });
  });

  describe('getImageDimensions', () => {
    it('returns dimensions for valid image', async () => {
      // Create a small 1x1 pixel image
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 50;
      const blob = await new Promise(resolve => canvas.toBlob(resolve));
      const file = new File([blob], 'test.png', { type: 'image/png' });

      const dimensions = await getImageDimensions(file);
      expect(dimensions.width).toBe(100);
      expect(dimensions.height).toBe(50);
    });
  });
});
```

---

## 🔒 Security Considerations

### **File Type Validation**

Always validate file types on both client and server:

```typescript
// Client-side
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

// Server-side (critical!)
const fileType = require('file-type');

app.post('/upload', async (req, res) => {
  const buffer = await fs.readFile(req.file.path);
  const type = await fileType.fromBuffer(buffer);
  
  if (!type || !ALLOWED_MIME_TYPES.includes(type.mime)) {
    return res.status(400).json({ error: 'Invalid file type' });
  }
  
  // Process file...
});
```

### **File Size Limits**

Enforce strict size limits:

```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

if (file.size > MAX_FILE_SIZE) {
  throw new Error('File too large');
}
```

---

## 🔗 Related

- [Compose.MediaUpload](./MediaUpload.md) - Component using this utility
- [Compose.ImageEditor](./ImageEditor.md) - Image editing component

---

## 📚 See Also

- [Compose Component Group README](./README.md)
- [File API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/File)

---

## ❓ FAQ

### **Q: How do I compress images before upload?**

Use the Canvas API:

```typescript
async function compressImage(file, maxWidth = 1920) {
  const img = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  const scale = Math.min(1, maxWidth / img.width);
  
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  return new Promise(resolve => {
    canvas.toBlob(resolve, 'image/jpeg', 0.9);
  });
}
```

### **Q: Can I extract EXIF data from images?**

Yes, use a library like `exif-js`:

```typescript
import EXIF from 'exif-js';

EXIF.getData(file, function() {
  const orientation = EXIF.getTag(this, 'Orientation');
  const dateTime = EXIF.getTag(this, 'DateTime');
});
```

### **Q: How do I handle memory leaks from object URLs?**

Always revoke object URLs when done:

```typescript
const url = URL.createObjectURL(file);
// Use the URL...
URL.revokeObjectURL(url); // Clean up!
```

---

**Need help?** Check the [Troubleshooting Guide](../../troubleshooting/README.md) or open an issue on [GitHub](https://github.com/lesserphp/greater-components).


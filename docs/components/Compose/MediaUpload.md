# Compose.MediaUpload

**Component**: Media Upload with Drag & Drop  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅

---

## 📋 Overview

`Compose.MediaUpload` provides a comprehensive media upload interface with drag-and-drop support, file validation, progress tracking, and preview generation for images, videos, and audio files. Perfect for enriching posts with multimedia content.

### **Key Features**:

- ✅ **Drag & drop** file upload
- ✅ **Multiple file support** (up to configurable max)
- ✅ **File validation** (type, size, dimensions)
- ✅ **Preview generation** for images and videos
- ✅ **Upload progress tracking** per file
- ✅ **Thumbnail generation** for videos
- ✅ **Image editing** integration (focal point, alt text)
- ✅ **Paste support** (Ctrl/Cmd+V to paste images)
- ✅ **Automatic cleanup** of object URLs
- ✅ **Responsive grid layout**

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

	async function handleUpload(files) {
		const formData = new FormData();
		files.forEach((file) => formData.append('files', file.file));

		const response = await fetch('/api/media', {
			method: 'POST',
			body: formData,
		});

		return response.json(); // Returns media IDs
	}

	async function handleRemove(fileId) {
		await fetch(`/api/media/${fileId}`, { method: 'DELETE' });
	}
</script>

<Compose.Root>
	<Compose.Editor autofocus />

	<Compose.MediaUpload
		onUpload={handleUpload}
		onRemove={handleRemove}
		maxFiles={4}
		maxFileSize={10 * 1024 * 1024}
	/>

	<Compose.Submit />
</Compose.Root>
```

---

## 🎛️ Props

| Prop           | Type       | Default             | Required | Description                             |
| -------------- | ---------- | ------------------- | -------- | --------------------------------------- |
| `onUpload`     | `Function` | -                   | **Yes**  | Callback when files are ready to upload |
| `onRemove`     | `Function` | -                   | No       | Callback when a file is removed         |
| `maxFiles`     | `number`   | `4`                 | No       | Maximum number of files                 |
| `maxFileSize`  | `number`   | `10MB`              | No       | Max file size in bytes                  |
| `allowedTypes` | `string[]` | Images/Videos/Audio | No       | Allowed MIME types                      |
| `showPreviews` | `boolean`  | `true`              | No       | Show file previews                      |
| `compact`      | `boolean`  | `false`             | No       | Compact layout mode                     |
| `class`        | `string`   | `''`                | No       | Additional CSS class                    |

### **Types**:

```typescript
interface MediaFile {
	id: string;
	file: File;
	type: 'image' | 'video' | 'audio' | 'unknown';
	preview?: string;
	thumbnail?: string;
	progress?: number;
	error?: string;
	description?: string;
	focalPoint?: { x: number; y: number };
}

type OnUpload = (files: MediaFile[]) => Promise<string[]>; // Returns media IDs
type OnRemove = (fileId: string) => Promise<void>;
```

---

## 💡 Examples

### **Example 1: Basic Image Upload**

Simple image upload with previews:

```svelte
<script lang="ts">
	import { Compose } from '@equaltoai/greater-components-fediverse';

	async function handleUpload(files) {
		console.log('Uploading files:', files);

		const mediaIds = [];
		for (const file of files) {
			const formData = new FormData();
			formData.append('file', file.file);

			const response = await fetch('/api/v1/media', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				body: formData,
			});

			const media = await response.json();
			mediaIds.push(media.id);
		}

		return mediaIds;
	}

	async function handleSubmit(data) {
		await api.createStatus({
			status: data.content,
			media_ids: data.mediaIds,
		});
	}
</script>

<div class="composer-with-media">
	<Compose.Root handlers={{ onSubmit: handleSubmit }}>
		<Compose.Editor autofocus placeholder="What's on your mind?" />

		<Compose.MediaUpload
			onUpload={handleUpload}
			maxFiles={4}
			maxFileSize={8 * 1024 * 1024}
			allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
		/>

		<div class="footer">
			<Compose.CharacterCount />
			<Compose.Submit />
		</div>
	</Compose.Root>
</div>

<style>
	.composer-with-media {
		max-width: 600px;
		margin: 2rem auto;
		padding: 1.5rem;
		background: white;
		border: 1px solid #e1e8ed;
		border-radius: 12px;
	}

	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
	}
</style>
```

### **Example 2: With Upload Progress**

Show progress bars for each uploading file:

```svelte
<script lang="ts">
	import { Compose } from '@equaltoai/greater-components-fediverse';

	async function handleUploadWithProgress(files) {
		const uploads = files.map(async (file) => {
			return new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				const formData = new FormData();
				formData.append('file', file.file);

				xhr.upload.addEventListener('progress', (e) => {
					if (e.lengthComputable) {
						const progress = (e.loaded / e.total) * 100;
						// Update file progress
						file.progress = progress;
					}
				});

				xhr.addEventListener('load', () => {
					if (xhr.status >= 200 && xhr.status < 300) {
						const media = JSON.parse(xhr.responseText);
						resolve(media.id);
					} else {
						reject(new Error('Upload failed'));
					}
				});

				xhr.addEventListener('error', () => reject(new Error('Network error')));

				xhr.open('POST', '/api/v1/media');
				xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
				xhr.send(formData);
			});
		});

		return Promise.all(uploads);
	}

	async function handleSubmit(data) {
		await api.createStatus({
			status: data.content,
			media_ids: data.mediaIds,
		});
	}
</script>

<Compose.Root handlers={{ onSubmit: handleSubmit }}>
	<Compose.Editor autofocus />

	<Compose.MediaUpload onUpload={handleUploadWithProgress} maxFiles={4} showPreviews={true} />

	<Compose.Submit />
</Compose.Root>
```

### **Example 3: Video Upload with Thumbnail**

Upload videos and generate thumbnails:

```svelte
<script lang="ts">
	import { Compose } from '@equaltoai/greater-components-fediverse';
	import {
		generateThumbnail,
		getVideoDuration,
	} from '@equaltoai/greater-components-fediverse/Compose';

	async function handleVideoUpload(files) {
		const processedFiles = await Promise.all(
			files.map(async (file) => {
				if (file.type === 'video') {
					// Generate thumbnail
					const thumbnail = await generateThumbnail(file.file);
					file.thumbnail = thumbnail;

					// Get duration
					const duration = await getVideoDuration(file.file);
					console.log(`Video duration: ${duration}s`);
				}
				return file;
			})
		);

		// Upload to server
		const mediaIds = await uploadFiles(processedFiles);
		return mediaIds;
	}

	async function uploadFiles(files) {
		const ids = [];
		for (const file of files) {
			const formData = new FormData();
			formData.append('file', file.file);
			if (file.thumbnail) {
				formData.append('thumbnail', file.thumbnail);
			}

			const response = await fetch('/api/v1/media', {
				method: 'POST',
				body: formData,
			});

			const media = await response.json();
			ids.push(media.id);
		}
		return ids;
	}
</script>

<Compose.Root>
	<Compose.Editor />

	<Compose.MediaUpload
		onUpload={handleVideoUpload}
		maxFiles={1}
		maxFileSize={100 * 1024 * 1024}
		allowedTypes={['video/mp4', 'video/webm', 'video/quicktime']}
	/>

	<Compose.Submit />
</Compose.Root>
```

### **Example 4: Drag & Drop Zone**

Custom styled drop zone:

```svelte
<script lang="ts">
	import { Compose } from '@equaltoai/greater-components-fediverse';

	let isDragging = $state(false);

	async function handleUpload(files) {
		return uploadToServer(files);
	}
</script>

<div class="custom-drop-zone" class:dragging={isDragging}>
	<Compose.Root>
		<Compose.Editor />

		<Compose.MediaUpload onUpload={handleUpload} bind:isDragging class="drop-area">
			<div slot="dropzone" class="drop-message">
				{#if isDragging}
					<div class="drag-active">
						<span class="icon">📁</span>
						<p>Drop files here</p>
					</div>
				{:else}
					<div class="drag-inactive">
						<span class="icon">🖼️</span>
						<p>Drag & drop images or videos</p>
						<button>Browse files</button>
					</div>
				{/if}
			</div>
		</Compose.MediaUpload>

		<Compose.Submit />
	</Compose.Root>
</div>

<style>
	.custom-drop-zone {
		padding: 2rem;
		border: 2px dashed #e1e8ed;
		border-radius: 12px;
		transition: border-color 0.2s;
	}

	.custom-drop-zone.dragging {
		border-color: #1d9bf0;
		background: #e8f5fd;
	}

	.drop-message {
		padding: 3rem;
		text-align: center;
	}

	.icon {
		font-size: 3rem;
		display: block;
		margin-bottom: 1rem;
	}

	.drop-message p {
		margin: 0 0 1rem;
		color: #536471;
	}

	.drop-message button {
		padding: 0.75rem 1.5rem;
		background: #1d9bf0;
		color: white;
		border: none;
		border-radius: 9999px;
		font-weight: 700;
		cursor: pointer;
	}
</style>
```

### **Example 5: Image Editing Integration**

Add alt text and focal points:

```svelte
<script lang="ts">
	import { Compose } from '@equaltoai/greater-components-fediverse';

	let selectedFile = $state(null);

	async function handleUpload(files) {
		return uploadFiles(files);
	}

	function editImage(file) {
		selectedFile = file;
	}

	function saveImageEdits(description, focalPoint) {
		selectedFile.description = description;
		selectedFile.focalPoint = focalPoint;
		selectedFile = null;
	}
</script>

<Compose.Root>
	<Compose.Editor />

	<Compose.MediaUpload onUpload={handleUpload} onEdit={editImage} maxFiles={4} />

	{#if selectedFile}
		<Compose.ImageEditor
			file={selectedFile}
			onSave={saveImageEdits}
			onCancel={() => (selectedFile = null)}
		/>
	{/if}

	<Compose.Submit />
</Compose.Root>
```

### **Example 6: File Validation with Custom Rules**

Implement custom validation:

```svelte
<script lang="ts">
	import { Compose } from '@equaltoai/greater-components-fediverse';
	import { validateFile } from '@equaltoai/greater-components-fediverse/Compose';

	async function handleUpload(files) {
		// Additional custom validation
		for (const file of files) {
			// Check dimensions for images
			if (file.type === 'image') {
				const dimensions = await getImageDimensions(file.file);
				if (dimensions.width < 200 || dimensions.height < 200) {
					throw new Error('Images must be at least 200x200 pixels');
				}
			}

			// Check video duration
			if (file.type === 'video') {
				const duration = await getVideoDuration(file.file);
				if (duration > 300) {
					throw new Error('Videos must be 5 minutes or less');
				}
			}
		}

		return uploadToServer(files);
	}

	async function getImageDimensions(file) {
		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => {
				resolve({ width: img.width, height: img.height });
			};
			img.src = URL.createObjectURL(file);
		});
	}

	async function getVideoDuration(file) {
		return new Promise((resolve) => {
			const video = document.createElement('video');
			video.onloadedmetadata = () => {
				resolve(video.duration);
				URL.revokeObjectURL(video.src);
			};
			video.src = URL.createObjectURL(file);
		});
	}
</script>

<Compose.Root>
	<Compose.Editor />

	<Compose.MediaUpload
		onUpload={handleUpload}
		maxFiles={4}
		maxFileSize={20 * 1024 * 1024}
		validate={validateFile}
	/>

	<Compose.Submit />
</Compose.Root>
```

---

## 🎨 Styling

```css
.media-upload {
	/* Drop zone */
	--drop-bg: #f7f9fa;
	--drop-border: #cfd9de;
	--drop-border-active: #1d9bf0;
	--drop-bg-active: #e8f5fd;
	--drop-radius: 12px;

	/* Preview grid */
	--preview-gap: 0.5rem;
	--preview-radius: 8px;
	--preview-bg: #e1e8ed;

	/* Progress bar */
	--progress-bg: #e1e8ed;
	--progress-fill: #1d9bf0;

	/* Buttons */
	--button-bg: white;
	--button-border: #cfd9de;
	--button-hover: #eff3f4;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
	.media-upload {
		--drop-bg: #1c2938;
		--drop-border: #38444d;
		--drop-bg-active: rgba(29, 155, 240, 0.1);
		--preview-bg: #38444d;
		--progress-bg: #38444d;
		--button-bg: #1c2938;
		--button-border: #38444d;
		--button-hover: #273340;
	}
}
```

---

## ♿ Accessibility

### **Keyboard Support**

- File input is keyboard accessible
- Tab through edit/remove buttons
- Enter/Space to activate buttons

### **Screen Reader Support**

```svelte
<input
	type="file"
	multiple
	accept="image/*,video/*"
	aria-label="Upload media files"
	aria-describedby="file-requirements"
/>

<p id="file-requirements" class="sr-only">
	Maximum 4 files, up to 10MB each. Supported formats: JPEG, PNG, GIF, MP4, WebM
</p>
```

### **Visual Feedback**

- Clear drag & drop indicators
- Progress bars for uploads
- Error messages for failed uploads
- Preview images with alt text

---

## 🔒 Security Considerations

### **File Type Validation**

Always validate on both client and server:

```typescript
// Client-side
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];

function validateFileType(file: File): boolean {
	if (!ALLOWED_TYPES.includes(file.type)) {
		throw new Error(`File type ${file.type} not allowed`);
	}
	return true;
}

// Server-side (critical!)
app.post('/api/media', upload.single('file'), (req, res) => {
	const file = req.file;

	// Verify MIME type
	if (!ALLOWED_TYPES.includes(file.mimetype)) {
		return res.status(400).json({ error: 'Invalid file type' });
	}

	// Check magic bytes (not just extension)
	const buffer = fs.readFileSync(file.path);
	const actualType = fileTypeFromBuffer(buffer);
	if (!actualType || !ALLOWED_TYPES.includes(actualType.mime)) {
		return res.status(400).json({ error: 'File content mismatch' });
	}

	// Process file...
});
```

### **File Size Limits**

Enforce strict size limits:

```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateFileSize(file: File): boolean {
	if (file.size > MAX_FILE_SIZE) {
		throw new Error(`File too large: ${formatFileSize(file.size)}`);
	}
	return true;
}
```

### **Content Scanning**

Scan uploads for malware:

```typescript
// Server-side
const ClamScan = require('clamscan');

app.post('/api/media', upload.single('file'), async (req, res) => {
	const clamscan = await new ClamScan().init();

	const { isInfected, viruses } = await clamscan.isInfected(req.file.path);

	if (isInfected) {
		fs.unlinkSync(req.file.path);
		return res.status(400).json({ error: 'Malware detected' });
	}

	// Process file...
});
```

---

## 🧪 Testing

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { Compose } from '@equaltoai/greater-components-fediverse';

describe('MediaUpload', () => {
	it('accepts file selection', async () => {
		const handleUpload = vi.fn().mockResolvedValue(['id1']);

		render(Compose.MediaUpload, {
			props: {
				onUpload: handleUpload,
			},
		});

		const input = screen.getByLabelText(/upload/i);
		const file = new File(['content'], 'test.png', { type: 'image/png' });

		await fireEvent.change(input, { target: { files: [file] } });

		await waitFor(() => {
			expect(screen.getByAltText(/test\.png/i)).toBeInTheDocument();
		});
	});

	it('validates file types', async () => {
		render(Compose.MediaUpload, {
			props: {
				onUpload: vi.fn(),
				allowedTypes: ['image/jpeg', 'image/png'],
			},
		});

		const input = screen.getByLabelText(/upload/i);
		const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

		await fireEvent.change(input, { target: { files: [file] } });

		await waitFor(() => {
			expect(screen.getByText(/file type not allowed/i)).toBeInTheDocument();
		});
	});

	it('validates file size', async () => {
		render(Compose.MediaUpload, {
			props: {
				onUpload: vi.fn(),
				maxFileSize: 1024 * 1024, // 1MB
			},
		});

		const input = screen.getByLabelText(/upload/i);
		const largeFile = new File([new ArrayBuffer(2 * 1024 * 1024)], 'large.png', {
			type: 'image/png',
		});

		await fireEvent.change(input, { target: { files: [largeFile] } });

		await waitFor(() => {
			expect(screen.getByText(/file too large/i)).toBeInTheDocument();
		});
	});

	it('removes files', async () => {
		const handleRemove = vi.fn();

		render(Compose.MediaUpload, {
			props: {
				onUpload: vi.fn().mockResolvedValue(['id1']),
				onRemove: handleRemove,
			},
		});

		const input = screen.getByLabelText(/upload/i);
		const file = new File(['content'], 'test.png', { type: 'image/png' });

		await fireEvent.change(input, { target: { files: [file] } });

		await waitFor(() => {
			expect(screen.getByAltText(/test\.png/i)).toBeInTheDocument();
		});

		const removeBtn = screen.getByLabelText(/remove/i);
		await fireEvent.click(removeBtn);

		await waitFor(() => {
			expect(handleRemove).toHaveBeenCalled();
		});
	});

	it('handles drag and drop', async () => {
		render(Compose.MediaUpload, {
			props: {
				onUpload: vi.fn().mockResolvedValue(['id1']),
			},
		});

		const dropZone = screen.getByTestId('drop-zone');
		const file = new File(['content'], 'test.png', { type: 'image/png' });

		await fireEvent.dragEnter(dropZone);
		expect(dropZone).toHaveClass('dragging');

		await fireEvent.drop(dropZone, {
			dataTransfer: { files: [file] },
		});

		await waitFor(() => {
			expect(screen.getByAltText(/test\.png/i)).toBeInTheDocument();
		});
	});
});
```

---

## 🔗 Related Components

- [Compose.Root](./Root.md) - Parent context provider
- [Compose.ImageEditor](./ImageEditor.md) - Edit uploaded images
- [MediaUploadHandler Utility](./MediaUploadHandler.md) - Upload utilities

---

## 📚 See Also

- [Compose Component Group README](./README.md)
- [MediaUploadHandler Documentation](./MediaUploadHandler.md)
- [Getting Started Guide](../../GETTING_STARTED.md)

---

## ❓ FAQ

### **Q: What file types are supported?**

By default: JPEG, PNG, GIF, WebP (images), MP4, WebM (video), MP3, OGG (audio). Customize via `allowedTypes` prop.

### **Q: How do I handle large files?**

Implement chunked uploads:

```typescript
async function uploadLargeFile(file) {
	const chunkSize = 1024 * 1024; // 1MB chunks
	const chunks = Math.ceil(file.size / chunkSize);

	for (let i = 0; i < chunks; i++) {
		const start = i * chunkSize;
		const end = Math.min(start + chunkSize, file.size);
		const chunk = file.slice(start, end);

		await uploadChunk(chunk, i, chunks);
	}
}
```

### **Q: Can I compress images before upload?**

Yes, use browser APIs:

```typescript
async function compressImage(file) {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	const img = await createImageBitmap(file);

	canvas.width = img.width * 0.5;
	canvas.height = img.height * 0.5;

	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	return new Promise((resolve) => {
		canvas.toBlob(resolve, 'image/jpeg', 0.8);
	});
}
```

### **Q: How do I handle paste events?**

MediaUpload automatically handles paste. Or implement custom:

```typescript
document.addEventListener('paste', async (e) => {
	const items = e.clipboardData?.items;
	for (const item of items) {
		if (item.type.startsWith('image/')) {
			const file = item.getAsFile();
			await handleUpload([{ file, type: 'image' }]);
		}
	}
});
```

---

**Need help?** Check the [Troubleshooting Guide](../../troubleshooting/README.md) or open an issue on [GitHub](https://github.com/lesserphp/greater-components).

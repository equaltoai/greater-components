# Status.Media

**Component**: Media Attachments Display  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 48 passing tests

---

## 📋 Overview

`Status.Media` displays media attachments for a status, including images, videos, audio, and GIFs. It automatically handles different media types, provides optimized layouts for multiple attachments, supports lazy loading, and ensures accessibility.

### **Key Features**:
- ✅ **Multiple Media Types** - Images, videos, audio, GIFs
- ✅ **Smart Layouts** - Optimized grids for 1-4+ attachments
- ✅ **Lazy Loading** - Load images only when visible
- ✅ **Responsive** - Mobile-optimized layouts
- ✅ **Accessibility** - Alt text and ARIA labels
- ✅ **Lightbox Support** - Click to expand images
- ✅ **Video Controls** - Play/pause, mute, fullscreen
- ✅ **Blurhash** - Placeholder images while loading

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import { Status } from '@equaltoai/greater-components-fediverse';
  import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

  const status: GenericStatus = {
    id: '1',
    content: '<p>Check out these photos!</p>',
    account: mockAccount,
    createdAt: new Date().toISOString(),
    reblogsCount: 25,
    favouritesCount: 150,
    repliesCount: 12,
    mediaAttachments: [
      {
        id: '1',
        type: 'image',
        url: 'https://example.com/photo1.jpg',
        previewUrl: 'https://example.com/photo1-preview.jpg',
        description: 'Beautiful sunset over the ocean',
        meta: {
          original: { width: 1920, height: 1080, aspect: 1.777 }
        }
      },
      {
        id: '2',
        type: 'image',
        url: 'https://example.com/photo2.jpg',
        previewUrl: 'https://example.com/photo2-preview.jpg',
        description: 'Mountain landscape',
        meta: {
          original: { width: 1920, height: 1080, aspect: 1.777 }
        }
      }
    ]
  };
</script>

<Status.Root {status}>
  <Status.Header />
  <Status.Content />
  <Status.Media />
  <Status.Actions />
</Status.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `media` | `Snippet` | Default media renderer | No | Custom media rendering |
| `class` | `string` | `''` | No | Custom CSS class |

---

## 💡 Examples

### Example 1: Single Image

Display a single image with full width:

```svelte
<script lang="ts">
  import { Status } from '@equaltoai/greater-components-fediverse';
  import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

  const statusWithImage: GenericStatus = {
    id: '1',
    content: '<p>Gorgeous sunset tonight! 🌅</p>',
    account: mockAccount,
    createdAt: new Date().toISOString(),
    reblogsCount: 50,
    favouritesCount: 200,
    repliesCount: 15,
    mediaAttachments: [
      {
        id: '1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        previewUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
        description: 'Sunset over mountains with orange and pink sky',
        meta: {
          original: { width: 4000, height: 3000, aspect: 1.333 },
          small: { width: 600, height: 450, aspect: 1.333 }
        },
        blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj'
      }
    ],
    sensitive: false
  };

  let showLightbox = $state(false);
</script>

<Status.Root status={statusWithImage}>
  <Status.Header />
  <Status.Content />
  
  <Status.Media />
  
  <Status.Actions />
</Status.Root>

<style>
  /* Single image takes full width */
  :global(.status-media--single) {
    grid-template-columns: 1fr;
    max-height: 600px;
  }

  :global(.status-media--single .status-media__image) {
    object-fit: contain;
    max-height: 600px;
    cursor: pointer;
  }

  :global(.status-media--single .status-media__image:hover) {
    opacity: 0.95;
  }
</style>
```

---

### Example 2: Multiple Images (2-4 Images)

Display multiple images in an optimized grid:

```svelte
<script lang="ts">
  import { Status } from '@equaltoai/greater-components-fediverse';
  import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

  const statusWithMultipleImages: GenericStatus = {
    id: '1',
    content: '<p>Weekend photo dump! 📸</p>',
    account: mockAccount,
    createdAt: new Date().toISOString(),
    reblogsCount: 30,
    favouritesCount: 120,
    repliesCount: 8,
    mediaAttachments: [
      {
        id: '1',
        type: 'image',
        url: 'https://example.com/photo1.jpg',
        previewUrl: 'https://example.com/photo1-preview.jpg',
        description: 'Photo 1',
        meta: { original: { width: 1920, height: 1080, aspect: 1.777 } }
      },
      {
        id: '2',
        type: 'image',
        url: 'https://example.com/photo2.jpg',
        previewUrl: 'https://example.com/photo2-preview.jpg',
        description: 'Photo 2',
        meta: { original: { width: 1920, height: 1080, aspect: 1.777 } }
      },
      {
        id: '3',
        type: 'image',
        url: 'https://example.com/photo3.jpg',
        previewUrl: 'https://example.com/photo3-preview.jpg',
        description: 'Photo 3',
        meta: { original: { width: 1920, height: 1080, aspect: 1.777 } }
      },
      {
        id: '4',
        type: 'image',
        url: 'https://example.com/photo4.jpg',
        previewUrl: 'https://example.com/photo4-preview.jpg',
        description: 'Photo 4',
        meta: { original: { width: 1920, height: 1080, aspect: 1.777 } }
      }
    ]
  };
</script>

<Status.Root status={statusWithMultipleImages}>
  <Status.Header />
  <Status.Content />
  
  <!-- Automatically creates 2x2 grid for 4 images -->
  <Status.Media />
  
  <Status.Actions />
</Status.Root>

<style>
  /* Layout for multiple images */
  /* 2 images: side by side */
  :global(.status-media:has(.status-media__item:nth-child(2):last-child)) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* 3 images: 2 top, 1 bottom full width */
  :global(.status-media:has(.status-media__item:nth-child(3):last-child)) {
    grid-template-columns: repeat(2, 1fr);
  }

  :global(.status-media:has(.status-media__item:nth-child(3):last-child) .status-media__item:nth-child(3)) {
    grid-column: span 2;
  }

  /* 4 images: 2x2 grid */
  :global(.status-media:has(.status-media__item:nth-child(4):last-child)) {
    grid-template-columns: repeat(2, 1fr);
  }
</style>
```

---

### Example 3: Video with Controls

Display video with play/pause controls:

```svelte
<script lang="ts">
  import { Status } from '@equaltoai/greater-components-fediverse';
  import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

  const statusWithVideo: GenericStatus = {
    id: '1',
    content: '<p>Check out this amazing video! 🎬</p>',
    account: mockAccount,
    createdAt: new Date().toISOString(),
    reblogsCount: 100,
    favouritesCount: 500,
    repliesCount: 50,
    mediaAttachments: [
      {
        id: '1',
        type: 'video',
        url: 'https://example.com/video.mp4',
        previewUrl: 'https://example.com/video-thumbnail.jpg',
        description: 'Demo video showing product features',
        meta: {
          original: {
            width: 1920,
            height: 1080,
            duration: 120, // 2 minutes
            bitrate: 5000000
          }
        }
      }
    ]
  };

  let isPlaying = $state(false);
  let isMuted = $state(true);

  function handlePlayPause(video: HTMLVideoElement) {
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    isPlaying = !isPlaying;
  }

  function handleMuteToggle(video: HTMLVideoElement) {
    video.muted = !video.muted;
    isMuted = video.muted;
  }
</script>

<Status.Root status={statusWithVideo}>
  <Status.Header />
  <Status.Content />
  
  <Status.Media>
    {#snippet media()}
      {#each statusWithVideo.mediaAttachments as attachment (attachment.id)}
        {#if attachment.type === 'video'}
          <div class="video-container">
            <video
              bind:this={videoElement}
              src={attachment.url}
              poster={attachment.previewUrl}
              class="status-video"
              preload="metadata"
              aria-label={attachment.description || 'Video'}
              onplay={() => isPlaying = true}
              onpause={() => isPlaying = false}
            >
              <track kind="captions" />
            </video>
            
            <div class="video-controls">
              <button 
                class="control-btn play-pause"
                onclick={() => handlePlayPause(videoElement)}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {#if isPlaying}
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                {:else}
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                {/if}
              </button>
              
              <button 
                class="control-btn mute-toggle"
                onclick={() => handleMuteToggle(videoElement)}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {#if isMuted}
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                {:else}
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                {/if}
              </button>
            </div>
          </div>
        {/if}
      {/each}
    {/snippet}
  </Status.Media>
  
  <Status.Actions />
</Status.Root>

<style>
  .video-container {
    position: relative;
    background: #000;
    border-radius: 8px;
    overflow: hidden;
  }

  .status-video {
    width: 100%;
    height: 100%;
    display: block;
  }

  .video-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    display: flex;
    gap: 0.5rem;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .video-container:hover .video-controls {
    opacity: 1;
  }

  .control-btn {
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.6);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .control-btn:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  .play-pause {
    padding: 1rem;
  }

  @media (prefers-reduced-motion: reduce) {
    .video-controls {
      transition: none;
    }
  }
</style>
```

---

### Example 4: GIF/Animated Content

Display GIFs with autoplay:

```svelte
<script lang="ts">
  import { Status } from '@equaltoai/greater-components-fediverse';
  import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

  const statusWithGif: GenericStatus = {
    id: '1',
    content: '<p>Mood right now 😂</p>',
    account: mockAccount,
    createdAt: new Date().toISOString(),
    reblogsCount: 75,
    favouritesCount: 300,
    repliesCount: 25,
    mediaAttachments: [
      {
        id: '1',
        type: 'gifv', // GIF as video (better performance)
        url: 'https://example.com/funny.mp4',
        previewUrl: 'https://example.com/funny-preview.jpg',
        description: 'Funny reaction GIF',
        meta: {
          original: { width: 480, height: 270, duration: 3 }
        }
      }
    ]
  };
</script>

<Status.Root status={statusWithGif}>
  <Status.Header />
  <Status.Content />
  
  <!-- GIFs auto-play with loop and no controls -->
  <Status.Media />
  
  <Status.Actions />
</Status.Root>

<style>
  /* GIF styling */
  :global(.status-media__video[data-type="gifv"]) {
    cursor: pointer;
  }

  /* Add GIF badge */
  :global(.status-media__item:has(video[data-type="gifv"])::before) {
    content: 'GIF';
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    padding: 0.25rem 0.5rem;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    border-radius: 4px;
    z-index: 10;
  }
</style>
```

---

### Example 5: Audio Player

Display audio with custom controls:

```svelte
<script lang="ts">
  import { Status } from '@equaltoai/greater-components-fediverse';
  import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

  const statusWithAudio: GenericStatus = {
    id: '1',
    content: '<p>New podcast episode out now! 🎙️</p>',
    account: mockAccount,
    createdAt: new Date().toISOString(),
    reblogsCount: 20,
    favouritesCount: 80,
    repliesCount: 10,
    mediaAttachments: [
      {
        id: '1',
        type: 'audio',
        url: 'https://example.com/podcast-episode.mp3',
        previewUrl: 'https://example.com/podcast-cover.jpg',
        description: 'Podcast episode: Web Development Tips',
        meta: {
          original: {
            duration: 3600, // 1 hour
            bitrate: 128000
          }
        }
      }
    ]
  };

  let isPlaying = $state(false);
  let currentTime = $state(0);
  let duration = $state(0);
  let audioElement: HTMLAudioElement;

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function handlePlayPause() {
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
  }

  function handleSeek(event: MouseEvent) {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    audioElement.currentTime = percent * duration;
  }
</script>

<Status.Root status={statusWithAudio}>
  <Status.Header />
  <Status.Content />
  
  <Status.Media>
    {#snippet media()}
      <div class="audio-player">
        <div class="audio-cover">
          <img 
            src={statusWithAudio.mediaAttachments[0].previewUrl}
            alt="Podcast cover"
          />
        </div>
        
        <div class="audio-controls">
          <audio
            bind:this={audioElement}
            src={statusWithAudio.mediaAttachments[0].url}
            onplay={() => isPlaying = true}
            onpause={() => isPlaying = false}
            ontimeupdate={() => currentTime = audioElement.currentTime}
            onloadedmetadata={() => duration = audioElement.duration}
          >
            <track kind="captions" />
          </audio>
          
          <button 
            class="play-pause-btn"
            onclick={handlePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {#if isPlaying}
              <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            {:else}
              <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            {/if}
          </button>
          
          <div class="audio-progress-container">
            <div class="audio-times">
              <span class="time-current">{formatTime(currentTime)}</span>
              <span class="time-duration">{formatTime(duration)}</span>
            </div>
            
            <div 
              class="audio-progress-bar"
              onclick={handleSeek}
              role="slider"
              aria-label="Audio progress"
              aria-valuemin="0"
              aria-valuemax={duration}
              aria-valuenow={currentTime}
            >
              <div 
                class="audio-progress-fill"
                style="width: {(currentTime / duration) * 100}%"
              ></div>
            </div>
          </div>
        </div>
      </div>
    {/snippet}
  </Status.Media>
  
  <Status.Actions />
</Status.Root>

<style>
  .audio-player {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: #f7f9fa;
    border-radius: 12px;
    margin: 0.5rem 0;
  }

  .audio-cover {
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    border-radius: 8px;
    overflow: hidden;
  }

  .audio-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .audio-controls {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.75rem;
  }

  .play-pause-btn {
    align-self: flex-start;
    padding: 0.5rem;
    background: #1d9bf0;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .play-pause-btn:hover {
    background: #1a8cd8;
  }

  .audio-progress-container {
    flex: 1;
  }

  .audio-times {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: #536471;
    font-weight: 600;
  }

  .audio-progress-bar {
    height: 6px;
    background: #e1e8ed;
    border-radius: 3px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .audio-progress-fill {
    height: 100%;
    background: #1d9bf0;
    transition: width 0.1s linear;
  }

  @media (max-width: 640px) {
    .audio-player {
      flex-direction: column;
    }

    .audio-cover {
      width: 100%;
      height: 200px;
    }
  }
</style>
```

---

### Example 6: Sensitive Media with Blur

Hide sensitive media behind warning:

```svelte
<script lang="ts">
  import { Status } from '@equaltoai/greater-components-fediverse';
  import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

  const sensitiveStatus: GenericStatus = {
    id: '1',
    content: '<p>⚠️ Warning: Graphic content</p>',
    account: mockAccount,
    createdAt: new Date().toISOString(),
    reblogsCount: 5,
    favouritesCount: 10,
    repliesCount: 2,
    sensitive: true,
    spoilerText: 'CW: Graphic imagery',
    mediaAttachments: [
      {
        id: '1',
        type: 'image',
        url: 'https://example.com/sensitive.jpg',
        previewUrl: 'https://example.com/sensitive-preview.jpg',
        description: 'Sensitive content',
        meta: { original: { width: 1920, height: 1080, aspect: 1.777 } }
      }
    ]
  };

  let showSensitiveMedia = $state(false);
</script>

<Status.Root status={sensitiveStatus}>
  <Status.Header />
  <Status.Content />
  
  <Status.Media>
    {#snippet media()}
      <div class="sensitive-media-container">
        {#if !showSensitiveMedia}
          <div class="sensitive-overlay">
            <div class="sensitive-warning">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
              </svg>
              <h3>Sensitive Content</h3>
              <p>{sensitiveStatus.spoilerText}</p>
              <button 
                class="show-media-btn"
                onclick={() => showSensitiveMedia = true}
              >
                Show Media
              </button>
            </div>
          </div>
        {/if}
        
        <div class:hidden={!showSensitiveMedia} class:blurred={!showSensitiveMedia}>
          {#each sensitiveStatus.mediaAttachments as attachment}
            <img 
              src={attachment.previewUrl}
              alt={attachment.description || ''}
              loading="lazy"
            />
          {/each}
        </div>
      </div>
    {/snippet}
  </Status.Media>
  
  <Status.Actions />
</Status.Root>

<style>
  .sensitive-media-container {
    position: relative;
    min-height: 200px;
  }

  .sensitive-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.9);
    z-index: 10;
    border-radius: 12px;
  }

  .sensitive-warning {
    text-align: center;
    color: white;
    padding: 2rem;
  }

  .sensitive-warning svg {
    color: #fbbf24;
    margin-bottom: 1rem;
  }

  .sensitive-warning h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
  }

  .sensitive-warning p {
    margin: 0 0 1.5rem 0;
    color: #e5e7eb;
  }

  .show-media-btn {
    padding: 0.75rem 2rem;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 9999px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .show-media-btn:hover {
    background: #dc2626;
  }

  .blurred {
    filter: blur(40px);
  }

  .hidden {
    visibility: hidden;
  }
</style>
```

---

## 🎨 Styling

### CSS Custom Properties

```css
.status-media {
  --status-spacing-xs: 0.25rem;
  --status-spacing-sm: 0.5rem;
  --status-bg-secondary: #f7f9fa;
  --status-radius-md: 8px;
}
```

### Layout Grids

```css
/* Default: 2-column grid */
.status-media {
  display: grid;
  gap: var(--status-spacing-xs, 0.25rem);
  grid-template-columns: repeat(2, 1fr);
  margin: var(--status-spacing-sm, 0.5rem) 0;
  border-radius: var(--status-radius-md, 8px);
  overflow: hidden;
}

/* Single image: full width */
.status-media--single {
  grid-template-columns: 1fr;
  max-height: 600px;
}

/* Responsive */
@media (max-width: 640px) {
  .status-media {
    grid-template-columns: 1fr;
  }
}
```

---

## ♿ Accessibility

### Alt Text

```html
<img 
  src="photo.jpg" 
  alt="Sunset over ocean with orange and pink clouds"
  loading="lazy"
/>
```

### Video Captions

```html
<video src="video.mp4" controls>
  <track kind="captions" src="captions.vtt" srclang="en" label="English" />
</video>
```

### Keyboard Navigation

- Images: Focusable in lightbox view
- Videos: Native controls accessible via keyboard
- Audio: Custom controls keyboard-accessible

---

## 🧪 Testing

```typescript
import { render, screen } from '@testing-library/svelte';
import { Status } from '@equaltoai/greater-components-fediverse';

describe('Status.Media', () => {
  it('renders images', () => {
    const status = mockStatus({
      mediaAttachments: [{
        id: '1',
        type: 'image',
        url: 'photo.jpg',
        previewUrl: 'photo-preview.jpg',
        description: 'Test image'
      }]
    });

    render(Status.Root, { props: { status } });

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'photo-preview.jpg');
    expect(img).toHaveAttribute('alt', 'Test image');
  });

  it('renders video with controls', () => {
    const status = mockStatus({
      mediaAttachments: [{
        id: '1',
        type: 'video',
        url: 'video.mp4',
        previewUrl: 'thumbnail.jpg',
        description: 'Test video'
      }]
    });

    render(Status.Root, { props: { status } });

    expect(screen.getByRole('video')).toBeInTheDocument();
  });

  it('hides sensitive media by default', () => {
    const status = mockStatus({
      sensitive: true,
      mediaAttachments: [mockAttachment()]
    });

    render(Status.Root, { props: { status } });

    expect(screen.getByText(/sensitive content/i)).toBeInTheDocument();
  });
});
```

---

## 🔗 Related Components

- [Status.Root](./Root.md) - Status context provider
- [Status.Content](./Content.md) - Post content
- [Status.Actions](./Actions.md) - Interaction buttons

---

## 📚 See Also

- [Status Components README](./README.md)
- [Media Handling Guide](../../guides/media-handling.md)
- [Image Optimization](../../guides/image-optimization.md)

---

**Last Updated**: October 12, 2025  
**Version**: 1.0.0


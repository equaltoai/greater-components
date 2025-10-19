# Profile.Edit

**Component**: Profile Editing Form  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 38 passing tests

---

## 📋 Overview

`Profile.Edit` provides a comprehensive profile editing form with support for display name, bio, avatar, header image, and custom fields. It includes real-time validation, image preview, character counting, and error handling.

### **Key Features**:
- ✅ Complete profile editing interface
- ✅ Image upload with preview (avatar and header)
- ✅ Custom fields management (add, edit, remove, reorder)
- ✅ Real-time character counting for bio
- ✅ Client-side validation
- ✅ Image preview before upload
- ✅ Loading states and error handling
- ✅ Cancel and save actions
- ✅ Accessible with keyboard navigation

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import * as Profile from '@equaltoai/greater-components-fediverse/Profile';

  const profile = {
    id: '123',
    username: 'alice',
    displayName: 'Alice Wonder',
    bio: 'Developer & open source enthusiast',
    avatar: 'https://example.com/avatar.jpg',
    header: 'https://example.com/header.jpg',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910,
    fields: [
      { name: 'Website', value: 'https://alice.dev' },
      { name: 'GitHub', value: 'https://github.com/alice' }
    ]
  };

  const handlers = {
    onSave: async (editData) => {
      console.log('Saving profile:', editData);
      // Save to server
    },
    onAvatarUpload: async (file) => {
      console.log('Uploading avatar:', file);
      // Upload and return URL
      return 'https://example.com/new-avatar.jpg';
    },
    onHeaderUpload: async (file) => {
      console.log('Uploading header:', file);
      // Upload and return URL
      return 'https://example.com/new-header.jpg';
    }
  };
</script>

<Profile.Root {profile} {handlers} isOwnProfile={true}>
  <Profile.Edit maxFields={4} maxBioLength={500} />
</Profile.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `maxFields` | `number` | `4` | No | Maximum number of custom fields allowed |
| `maxBioLength` | `number` | `500` | No | Maximum character length for bio |
| `class` | `string` | `''` | No | Custom CSS class |

---

## 📤 Events

The component uses context handlers from Profile.Root:

| Handler | Parameters | Description |
|---------|------------|-------------|
| `onSave` | `editData: ProfileEditData` | Called when save button clicked |
| `onAvatarUpload` | `file: File` | Called to upload avatar, returns URL |
| `onHeaderUpload` | `file: File` | Called to upload header, returns URL |

### **ProfileEditData Interface**

```typescript
interface ProfileEditData {
  displayName?: string;
  bio?: string;
  avatar?: File | string;
  header?: File | string;
  fields?: ProfileField[];
}
```

---

## 💡 Examples

### **Example 1: Basic Profile Editing**

Simple profile editing with validation:

```svelte
<script lang="ts">
  import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
  import type { ProfileData, ProfileEditData } from '@equaltoai/greater-components-fediverse/Profile';

  let profile = $state<ProfileData>({
    id: '123',
    username: 'alice',
    displayName: 'Alice Wonder',
    bio: 'Developer & open source enthusiast\n\nBuilding decentralized web applications',
    avatar: 'https://cdn.example.com/avatars/alice.jpg',
    header: 'https://cdn.example.com/headers/alice.jpg',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910,
    fields: [
      { name: 'Website', value: 'https://alice.dev' },
      { name: 'GitHub', value: 'https://github.com/alice' }
    ]
  });

  let editMode = $state(false);
  let saving = $state(false);
  let error = $state<string | null>(null);

  const handlers = {
    onSave: async (editData: ProfileEditData) => {
      saving = true;
      error = null;

      try {
        const response = await fetch('/api/profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify(editData)
        });

        if (!response.ok) {
          throw new Error('Failed to update profile');
        }

        const updated = await response.json();
        profile = updated;
        editMode = false;
      } catch (err) {
        error = err instanceof Error ? err.message : 'Update failed';
        throw err;
      } finally {
        saving = false;
      }
    },

    onAvatarUpload: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Avatar upload failed');
      }

      const { url } = await response.json();
      return url;
    },

    onHeaderUpload: async (file: File) => {
      const formData = new FormData();
      formData.append('header', file);

      const response = await fetch('/api/profile/header', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Header upload failed');
      }

      const { url } = await response.json();
      return url;
    }
  };

  function getAuthToken(): string {
    return localStorage.getItem('auth_token') || '';
  }
</script>

<div class="profile-edit-container">
  {#if error}
    <div class="error-alert" role="alert">
      <strong>Error:</strong> {error}
      <button onclick={() => error = null}>Dismiss</button>
    </div>
  {/if}

  {#if saving}
    <div class="saving-overlay">
      <div class="spinner"></div>
      <p>Saving profile...</p>
    </div>
  {/if}

  <Profile.Root {profile} {handlers} isOwnProfile={true}>
    {#if editMode}
      <Profile.Edit maxFields={4} maxBioLength={500} />
    {:else}
      <Profile.Header />
      <button 
        class="edit-button" 
        onclick={() => editMode = true}
      >
        Edit Profile
      </button>
    {/if}
  </Profile.Root>
</div>

<style>
  .profile-edit-container {
    position: relative;
    max-width: 600px;
    margin: 0 auto;
  }

  .error-alert {
    padding: 1rem;
    margin-bottom: 1rem;
    background: #fee;
    border: 1px solid #fcc;
    border-radius: 0.5rem;
    color: #c00;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .error-alert button {
    padding: 0.25rem 0.75rem;
    background: white;
    border: 1px solid #c00;
    border-radius: 0.25rem;
    color: #c00;
    cursor: pointer;
  }

  .saving-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    z-index: 100;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #eff3f4;
    border-top-color: #1d9bf0;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .edit-button {
    padding: 0.75rem 1.5rem;
    margin: 1rem 0;
    background: #1d9bf0;
    color: white;
    border: none;
    border-radius: 9999px;
    font-weight: 600;
    cursor: pointer;
  }

  .edit-button:hover {
    background: #1a8cd8;
  }
</style>
```

### **Example 2: With Image Compression**

Compress images before upload to reduce bandwidth:

```svelte
<script lang="ts">
  import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
  import imageCompression from 'browser-image-compression';

  const profile = {
    id: '123',
    username: 'alice',
    displayName: 'Alice Wonder',
    bio: 'Developer',
    avatar: 'https://example.com/avatar.jpg',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910
  };

  async function compressImage(file: File, maxSizeMB: number): Promise<File> {
    const options = {
      maxSizeMB,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
      fileType: 'image/jpeg'
    };

    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Image compression failed:', error);
      return file;
    }
  }

  const handlers = {
    onSave: async (editData) => {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }
    },

    onAvatarUpload: async (file: File) => {
      // Compress avatar to max 1MB
      const compressed = await compressImage(file, 1);
      
      console.log('Original size:', file.size, 'bytes');
      console.log('Compressed size:', compressed.size, 'bytes');

      const formData = new FormData();
      formData.append('avatar', compressed, compressed.name);

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await response.json();
      return url;
    },

    onHeaderUpload: async (file: File) => {
      // Compress header to max 2MB
      const compressed = await compressImage(file, 2);

      const formData = new FormData();
      formData.append('header', compressed, compressed.name);

      const response = await fetch('/api/profile/header', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await response.json();
      return url;
    }
  };
</script>

<Profile.Root {profile} {handlers} isOwnProfile={true}>
  <Profile.Edit />
</Profile.Root>
```

### **Example 3: With Auto-Save Draft**

Automatically save drafts to prevent data loss:

```svelte
<script lang="ts">
  import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
  import { debounce } from 'lodash-es';
  import type { ProfileEditData } from '@equaltoai/greater-components-fediverse/Profile';

  const profile = {
    id: '123',
    username: 'alice',
    displayName: 'Alice Wonder',
    bio: 'Developer',
    avatar: 'https://example.com/avatar.jpg',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910,
    fields: []
  };

  // Load draft from localStorage
  let draft = $state<Partial<ProfileEditData> | null>(
    JSON.parse(localStorage.getItem('profile-draft') || 'null')
  );

  let lastSaved = $state<Date | null>(null);

  // Auto-save draft
  const saveDraft = debounce((data: ProfileEditData) => {
    localStorage.setItem('profile-draft', JSON.stringify(data));
    lastSaved = new Date();
  }, 1000);

  // Clear draft on successful save
  function clearDraft() {
    localStorage.removeItem('profile-draft');
    draft = null;
    lastSaved = null;
  }

  const handlers = {
    onSave: async (editData: ProfileEditData) => {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      // Clear draft on successful save
      clearDraft();
    },

    onAvatarUpload: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await response.json();
      
      // Save draft with new avatar URL
      saveDraft({ avatar: url });
      
      return url;
    },

    onHeaderUpload: async (file: File) => {
      const formData = new FormData();
      formData.append('header', file);

      const response = await fetch('/api/profile/header', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await response.json();
      
      // Save draft with new header URL
      saveDraft({ header: url });
      
      return url;
    }
  };

  // Apply draft if exists
  $effect(() => {
    if (draft) {
      profile.displayName = draft.displayName || profile.displayName;
      profile.bio = draft.bio || profile.bio;
      profile.fields = draft.fields || profile.fields || [];
    }
  });
</script>

<div class="edit-with-draft">
  {#if draft && lastSaved}
    <div class="draft-indicator">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
      </svg>
      <span>
        Draft saved {lastSaved.toLocaleTimeString()}
      </span>
      <button onclick={clearDraft}>Discard</button>
    </div>
  {/if}

  <Profile.Root {profile} {handlers} isOwnProfile={true}>
    <Profile.Edit />
  </Profile.Root>
</div>

<style>
  .edit-with-draft {
    max-width: 600px;
    margin: 0 auto;
  }

  .draft-indicator {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    color: #856404;
  }

  .draft-indicator svg {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }

  .draft-indicator button {
    margin-left: auto;
    padding: 0.25rem 0.75rem;
    background: white;
    border: 1px solid #856404;
    border-radius: 0.25rem;
    color: #856404;
    cursor: pointer;
    font-size: 0.8125rem;
  }

  .draft-indicator button:hover {
    background: #f8f9fa;
  }
</style>
```

### **Example 4: With Server-Side Image Processing**

Upload images to server for processing:

```svelte
<script lang="ts">
  import * as Profile from '@equaltoai/greater-components-fediverse/Profile';

  const profile = {
    id: '123',
    username: 'alice',
    displayName: 'Alice Wonder',
    bio: 'Developer',
    avatar: 'https://example.com/avatar.jpg',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910
  };

  let uploadProgress = $state<{ [key: string]: number }>({});

  const handlers = {
    onSave: async (editData) => {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }
    },

    onAvatarUpload: async (file: File) => {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      const formData = new FormData();
      formData.append('avatar', file);

      // Upload with progress tracking
      return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            uploadProgress['avatar'] = Math.round((e.loaded / e.total) * 100);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const { url } = JSON.parse(xhr.responseText);
            uploadProgress['avatar'] = 100;
            setTimeout(() => {
              delete uploadProgress['avatar'];
            }, 1000);
            resolve(url);
          } else {
            reject(new Error('Upload failed'));
          }
        };

        xhr.onerror = () => reject(new Error('Upload failed'));

        xhr.open('POST', '/api/profile/avatar');
        xhr.setRequestHeader('Authorization', `Bearer ${getAuthToken()}`);
        xhr.send(formData);
      });
    },

    onHeaderUpload: async (file: File) => {
      // Similar to avatar upload with progress
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      const formData = new FormData();
      formData.append('header', file);

      return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            uploadProgress['header'] = Math.round((e.loaded / e.total) * 100);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const { url } = JSON.parse(xhr.responseText);
            uploadProgress['header'] = 100;
            setTimeout(() => {
              delete uploadProgress['header'];
            }, 1000);
            resolve(url);
          } else {
            reject(new Error('Upload failed'));
          }
        };

        xhr.onerror = () => reject(new Error('Upload failed'));

        xhr.open('POST', '/api/profile/header');
        xhr.setRequestHeader('Authorization', `Bearer ${getAuthToken()}`);
        xhr.send(formData);
      });
    }
  };

  function getAuthToken(): string {
    return localStorage.getItem('auth_token') || '';
  }
</script>

<div class="edit-with-progress">
  {#if Object.keys(uploadProgress).length > 0}
    <div class="upload-progress">
      {#each Object.entries(uploadProgress) as [type, progress]}
        <div class="progress-item">
          <span>Uploading {type}...</span>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              style="width: {progress}%"
            ></div>
          </div>
          <span>{progress}%</span>
        </div>
      {/each}
    </div>
  {/if}

  <Profile.Root {profile} {handlers} isOwnProfile={true}>
    <Profile.Edit />
  </Profile.Root>
</div>

<style>
  .edit-with-progress {
    max-width: 600px;
    margin: 0 auto;
  }

  .upload-progress {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    max-width: 300px;
    padding: 1rem;
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 0.75rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
  }

  .progress-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .progress-item span {
    font-size: 0.875rem;
    color: #536471;
  }

  .progress-bar {
    height: 8px;
    background: #eff3f4;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: #1d9bf0;
    transition: width 0.3s;
  }
</style>
```

### **Example 5: With Field Validation and Hints**

Add validation and helpful hints for users:

```svelte
<script lang="ts">
  import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
  import type { ProfileEditData, ProfileField } from '@equaltoai/greater-components-fediverse/Profile';

  const profile = {
    id: '123',
    username: 'alice',
    displayName: 'Alice Wonder',
    bio: 'Developer',
    avatar: 'https://example.com/avatar.jpg',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910,
    fields: [
      { name: 'Website', value: 'https://alice.dev' }
    ]
  };

  let validationErrors = $state<{ [key: string]: string }>({});
  let showHints = $state(true);

  function validateEditData(data: ProfileEditData): boolean {
    validationErrors = {};

    // Validate display name
    if (!data.displayName || data.displayName.trim().length === 0) {
      validationErrors['displayName'] = 'Display name is required';
    } else if (data.displayName.length > 50) {
      validationErrors['displayName'] = 'Display name must be 50 characters or less';
    }

    // Validate bio
    if (data.bio && data.bio.length > 500) {
      validationErrors['bio'] = 'Bio must be 500 characters or less';
    }

    // Validate fields
    if (data.fields) {
      data.fields.forEach((field, index) => {
        if (field.name && !field.value) {
          validationErrors[`field-${index}-value`] = 'Field value is required';
        }
        if (field.value && !field.name) {
          validationErrors[`field-${index}-name`] = 'Field name is required';
        }
        if (field.name && field.name.length > 30) {
          validationErrors[`field-${index}-name`] = 'Field name must be 30 characters or less';
        }
        if (field.value && field.value.length > 100) {
          validationErrors[`field-${index}-value`] = 'Field value must be 100 characters or less';
        }
      });
    }

    return Object.keys(validationErrors).length === 0;
  }

  const handlers = {
    onSave: async (editData: ProfileEditData) => {
      // Validate before save
      if (!validateEditData(editData)) {
        throw new Error('Please fix validation errors');
      }

      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Update failed');
      }
    },

    onAvatarUpload: async (file: File) => {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Avatar must be JPEG, PNG, WebP, or GIF');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Avatar must be less than 5MB');
      }

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Avatar upload failed');
      }

      const { url } = await response.json();
      return url;
    },

    onHeaderUpload: async (file: File) => {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Header must be JPEG, PNG, or WebP');
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Header must be less than 10MB');
      }

      const formData = new FormData();
      formData.append('header', file);

      const response = await fetch('/api/profile/header', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Header upload failed');
      }

      const { url } = await response.json();
      return url;
    }
  };
</script>

<div class="edit-with-validation">
  {#if showHints}
    <div class="hints-panel">
      <div class="hints-header">
        <h3>Profile Tips</h3>
        <button onclick={() => showHints = false}>×</button>
      </div>
      <ul>
        <li>Choose a clear, recognizable avatar</li>
        <li>Write a concise bio (max 500 characters)</li>
        <li>Add custom fields for links and info</li>
        <li>Verify your website with rel="me"</li>
        <li>Use header image for personal branding</li>
      </ul>
    </div>
  {/if}

  {#if Object.keys(validationErrors).length > 0}
    <div class="validation-errors" role="alert">
      <h4>Please fix the following errors:</h4>
      <ul>
        {#each Object.values(validationErrors) as error}
          <li>{error}</li>
        {/each}
      </ul>
    </div>
  {/if}

  <Profile.Root {profile} {handlers} isOwnProfile={true}>
    <Profile.Edit maxFields={4} maxBioLength={500} />
  </Profile.Root>
</div>

<style>
  .edit-with-validation {
    max-width: 800px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 250px;
    gap: 2rem;
  }

  .hints-panel {
    padding: 1rem;
    background: #f7f9fa;
    border: 1px solid #eff3f4;
    border-radius: 0.75rem;
    height: fit-content;
    position: sticky;
    top: 1rem;
  }

  .hints-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .hints-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #0f1419;
  }

  .hints-header button {
    padding: 0;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #536471;
    cursor: pointer;
    line-height: 1;
  }

  .hints-panel ul {
    margin: 0;
    padding-left: 1.25rem;
    color: #536471;
    font-size: 0.875rem;
  }

  .hints-panel li {
    margin: 0.5rem 0;
  }

  .validation-errors {
    padding: 1rem;
    background: #fee;
    border: 1px solid #fcc;
    border-radius: 0.5rem;
    color: #c00;
    grid-column: span 2;
  }

  .validation-errors h4 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
  }

  .validation-errors ul {
    margin: 0;
    padding-left: 1.25rem;
  }

  .validation-errors li {
    margin: 0.25rem 0;
  }

  @media (max-width: 768px) {
    .edit-with-validation {
      grid-template-columns: 1fr;
    }

    .hints-panel {
      position: static;
    }
  }
</style>
```

---

## 🔒 Security Considerations

### **Server-Side Validation**

Always validate profile updates on the server:

```typescript
// server/api/profile.ts
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

const ProfileUpdateSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  fields: z.array(
    z.object({
      name: z.string().min(1).max(30),
      value: z.string().min(1).max(100)
    })
  ).max(4).optional()
});

export async function PATCH(request: Request) {
  // Authentication
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Parse and validate
  const body = await request.json();
  const validated = ProfileUpdateSchema.parse(body);

  // Sanitize HTML
  const sanitized = {
    ...validated,
    bio: validated.bio ? DOMPurify.sanitize(validated.bio, {
      ALLOWED_TAGS: ['a', 'br', 'p', 'strong', 'em'],
      ALLOWED_ATTR: ['href', 'rel'],
      ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|#)/
    }) : undefined,
    fields: validated.fields?.map(field => ({
      name: DOMPurify.sanitize(field.name, { ALLOWED_TAGS: [] }),
      value: DOMPurify.sanitize(field.value, {
        ALLOWED_TAGS: ['a'],
        ALLOWED_ATTR: ['href', 'rel'],
        ALLOWED_URI_REGEXP: /^https?:/
      })
    }))
  };

  // Rate limiting check
  const canUpdate = await checkRateLimit(`profile-update:${userId}`);
  if (!canUpdate) {
    return new Response('Rate limit exceeded', { status: 429 });
  }

  // Update profile
  const updated = await db.profiles.update({
    where: { userId },
    data: sanitized
  });

  // Audit log
  await db.auditLogs.create({
    data: {
      userId,
      action: 'profile.update',
      details: JSON.stringify(sanitized),
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date()
    }
  });

  return new Response(JSON.stringify(updated), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### **Image Upload Security**

Secure image upload handling:

```typescript
// server/api/upload-avatar.ts
import sharp from 'sharp';
import { nanoid } from 'nanoid';
import { put } from '@vercel/blob';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: Request) {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('avatar') as File;

  // Validate file
  if (!file) {
    return new Response('No file provided', { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return new Response('Invalid file type', { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return new Response('File too large', { status: 400 });
  }

  // Process image
  const buffer = await file.arrayBuffer();
  const processed = await sharp(Buffer.from(buffer))
    .resize(400, 400, {
      fit: 'cover',
      position: 'center'
    })
    .jpeg({ quality: 90 })
    .toBuffer();

  // Generate unique filename
  const filename = `avatars/${userId}/${nanoid()}.jpg`;

  // Upload to storage
  const blob = await put(filename, processed, {
    access: 'public',
    contentType: 'image/jpeg'
  });

  // Update profile
  await db.profiles.update({
    where: { userId },
    data: { avatar: blob.url }
  });

  // Log upload
  await db.auditLogs.create({
    data: {
      userId,
      action: 'profile.avatar.upload',
      details: JSON.stringify({ 
        size: processed.length, 
        url: blob.url 
      }),
      timestamp: new Date()
    }
  });

  return new Response(JSON.stringify({ url: blob.url }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

---

## 🎨 Styling

The Edit component provides extensive styling options:

```css
/* Edit form styles */
.profile-edit {
  --edit-bg: var(--bg-primary, #ffffff);
  --edit-border: var(--border-color, #e1e8ed);
  --edit-input-bg: var(--bg-primary, #ffffff);
  --edit-input-border: var(--border-color, #cfd9de);
  --edit-input-focus: var(--primary-color, #1d9bf0);
  --edit-error-color: #f4211e;
  --edit-success-color: #00ba7c;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .profile-edit {
    --edit-bg: #15202b;
    --edit-border: #38444d;
    --edit-input-bg: #192734;
    --edit-input-border: #38444d;
  }
}
```

---

## ♿ Accessibility

The Edit component is fully accessible:

- ✅ **Form Labels**: All inputs have proper labels
- ✅ **Error Messages**: Errors announced to screen readers
- ✅ **Focus Management**: Logical tab order
- ✅ **Keyboard Navigation**: Full keyboard support
- ✅ **ARIA Attributes**: Proper ARIA labels and descriptions
- ✅ **File Inputs**: Accessible file selection

---

## 🧪 Testing

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import * as Profile from '@equaltoai/greater-components-fediverse/Profile';

describe('Profile.Edit', () => {
  const mockProfile = {
    id: '1',
    username: 'alice',
    displayName: 'Alice',
    bio: 'Developer',
    followersCount: 100,
    followingCount: 50,
    statusesCount: 200
  };

  it('displays edit form', () => {
    render(Profile.Root, {
      props: {
        profile: mockProfile,
        handlers: {},
        isOwnProfile: true
      }
    });

    expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bio/i)).toBeInTheDocument();
  });

  it('calls onSave with edited data', async () => {
    const onSave = vi.fn();

    render(Profile.Root, {
      props: {
        profile: mockProfile,
        handlers: { onSave },
        isOwnProfile: true
      }
    });

    const displayNameInput = screen.getByLabelText(/display name/i);
    await fireEvent.input(displayNameInput, { target: { value: 'Alice Updated' } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    await fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        displayName: 'Alice Updated'
      })
    );
  });

  it('shows character count for bio', () => {
    render(Profile.Root, {
      props: {
        profile: mockProfile,
        handlers: {},
        isOwnProfile: true
      }
    });

    expect(screen.getByText(/0\/500/i)).toBeInTheDocument();
  });

  it('prevents save when bio exceeds limit', async () => {
    const onSave = vi.fn();

    render(Profile.Root, {
      props: {
        profile: mockProfile,
        handlers: { onSave },
        isOwnProfile: true
      }
    });

    const bioInput = screen.getByLabelText(/bio/i);
    const longBio = 'a'.repeat(501);
    await fireEvent.input(bioInput, { target: { value: longBio } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    expect(saveButton).toBeDisabled();
  });
});
```

---

## 🔗 Related Components

- [Profile.Root](./Root.md) - Context provider
- [Profile.Header](./Header.md) - Profile header display
- [Profile.Fields](./Fields.md) - Custom fields display

---

## 📚 See Also

- [Profile Components Overview](./README.md)
- [Form Validation Best Practices](../../patterns/VALIDATION.md)
- [Image Upload Guidelines](../../patterns/IMAGE_UPLOAD.md)


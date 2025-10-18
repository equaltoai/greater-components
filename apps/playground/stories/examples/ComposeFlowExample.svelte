<script lang="ts">
  import { onMount } from 'svelte';
  import {
    ComposeBox,
    TransportManager,
    MockTransport,
    MastodonTransport,
    type Transport,
    type Status
  } from '@greater-components/fediverse';

  type Draft = {
    id: string;
    content: string;
    timestamp: string;
  };

  type MediaAsset = {
    id: string;
    url: string;
    type: 'image' | 'video';
  };

  type PollOption = {
    id: string;
    value: string;
  };

  type PostVisibility = 'public' | 'unlisted' | 'private' | 'direct';

  interface PostPayload {
    status: string;
    visibility: PostVisibility;
    spoiler_text?: string;
    media_ids?: string[];
    poll?: {
      options: string[];
      expires_in: number;
    };
    scheduled_at?: string;
  }

  interface Props {
    useMockData?: boolean;
    showMediaUpload?: boolean;
    showPollCreation?: boolean;
    enableDrafts?: boolean;
    showContentWarning?: boolean;
    showVisibilitySelector?: boolean;
    showScheduling?: boolean;
    maxLength?: number;
    showEmojiPicker?: boolean;
    showFormatting?: boolean;
  }

  let {
    useMockData = true,
    showMediaUpload = true,
    showPollCreation = true,
    enableDrafts = true,
    showContentWarning = true,
    showVisibilitySelector = true,
    showScheduling = true,
    maxLength = 500,
    showEmojiPicker = true,
    showFormatting = true
  }: Props = $props();

  const createId = () =>
    globalThis.crypto?.randomUUID?.() ??
    `compose-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  const createPollOption = (value = ''): PollOption => ({
    id: createId(),
    value
  });

  const visibilityOptions: PostVisibility[] = ['public', 'unlisted', 'private', 'direct'];

  let transport = $state<Transport | null>(null);
  let composing = $state(true);
  let drafts = $state<Draft[]>([]);
  let selectedDraft = $state<string | null>(null);
  let uploadedMedia = $state<MediaAsset[]>([]);
  let postHistory = $state<Status[]>([]);
  let isPosting = $state(false);
  let showDraftsPanel = $state(false);
  let showMediaLibrary = $state(false);
  let showSchedulePanel = $state(false);
  let scheduledDate = $state<string>('');
  let scheduledTime = $state<string>('');
  let contentWarning = $state('');
  let visibility = $state<PostVisibility>('public');
  let pollOptions = $state<PollOption[]>([createPollOption(), createPollOption()]);
  let pollDuration = $state(86400); // 24 hours in seconds
  let showPoll = $state(false);
  let characterCount = $state(0);
  let content = $state('');

  // Mock media library
  const mediaLibrary: MediaAsset[] = [
    { id: '1', url: 'https://picsum.photos/400/300?random=1', type: 'image' },
    { id: '2', url: 'https://picsum.photos/400/300?random=2', type: 'image' },
    { id: '3', url: 'https://picsum.photos/400/300?random=3', type: 'image' },
    { id: '4', url: 'https://picsum.photos/400/300?random=4', type: 'image' }
  ];

  // Emoji shortcuts
  const quickEmojis = ['😀', '❤️', '👍', '😂', '🎉', '🔥', '✨', '💯', '🙌', '👏'];

  onMount(() => {
    initializeTransport();
    loadDrafts();

    return () => {
      if (transport) {
        TransportManager.disconnect();
      }
    };
  });

  async function initializeTransport() {
    try {
      if (useMockData) {
        transport = new MockTransport();
        await TransportManager.initialize(transport);
      } else {
        const token = localStorage.getItem('mastodon_token') || '';
        if (token) {
          transport = new MastodonTransport('https://mastodon.social', token);
          await TransportManager.initialize(transport);
        } else {
          transport = new MockTransport();
          await TransportManager.initialize(transport);
        }
      }
    } catch (error) {
      console.error('Failed to initialize transport:', error);
    }
  }

  function loadDrafts() {
    if (!enableDrafts) return;
    
    const savedDrafts = localStorage.getItem('compose_drafts');
    if (savedDrafts) {
      try {
        const parsed = JSON.parse(savedDrafts) as Partial<Draft>[];
        drafts = parsed.map((draft) => ({
          id: draft.id ?? createId(),
          content: draft.content ?? '',
          timestamp: draft.timestamp ?? new Date().toISOString()
        }));
      } catch {
        drafts = [];
      }
    }
  }

  function saveDraft() {
    if (!enableDrafts || !content.trim()) return;
    
    const draft: Draft = {
      id: createId(),
      content,
      timestamp: new Date().toISOString()
    };
    
    drafts = [...drafts, draft];
    localStorage.setItem('compose_drafts', JSON.stringify(drafts));
    
    // Show confirmation
    alert('Draft saved!');
  }

  function loadDraft(draftId: string) {
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
      content = draft.content;
      selectedDraft = draftId;
      showDraftsPanel = false;
    }
  }

  function deleteDraft(draftId: string) {
    drafts = drafts.filter(d => d.id !== draftId);
    localStorage.setItem('compose_drafts', JSON.stringify(drafts));
  }

  async function handlePost(event: CustomEvent<{ content: string; visibility: string; mediaIds?: string[] }>) {
    if (!transport || isPosting) return;
    
    isPosting = true;
    
    try {
      const selectedVisibility = resolveVisibility(event.detail.visibility);
      const postData: PostPayload = {
        status: event.detail.content,
        visibility: selectedVisibility
      };
      
      // Add content warning if enabled
      if (showContentWarning && contentWarning) {
        postData.spoiler_text = contentWarning;
      }
      
      // Add media if uploaded
      if (uploadedMedia.length > 0) {
        postData.media_ids = uploadedMedia.map(m => m.id);
      }
      
      // Add poll if created
      const filledPollOptions = pollOptions.filter(option => option.value.trim());
      if (showPoll && filledPollOptions.length >= 2) {
        postData.poll = {
          options: filledPollOptions.map(option => option.value.trim()),
          expires_in: pollDuration
        };
      }
      
      // Handle scheduling
      if (showScheduling && scheduledDate && scheduledTime) {
        postData.scheduled_at = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
      }
      
      const newStatus = await transport.postStatus(postData);
      postHistory = [newStatus, ...postHistory];
      
      // Reset form
      content = '';
      contentWarning = '';
      uploadedMedia = [];
      pollOptions = [createPollOption(), createPollOption()];
      showPoll = false;
      scheduledDate = '';
      scheduledTime = '';
      
      // Delete draft if it was loaded
      if (selectedDraft) {
        deleteDraft(selectedDraft);
        selectedDraft = null;
      }
      
      composing = false;
      
      // Show success message
      setTimeout(() => {
        alert('Posted successfully!');
        composing = true;
      }, 100);
    } catch (error) {
      console.error('Failed to post:', error);
      alert('Failed to post. Please try again.');
    } finally {
      isPosting = false;
    }
  }

  async function handleMediaUpload(file: File) {
    if (!showMediaUpload) return;
    
    // Simulate upload
    const mockId = Date.now().toString();
    const mockUrl = URL.createObjectURL(file);
    
    uploadedMedia = [...uploadedMedia, {
      id: mockId,
      url: mockUrl,
      type: file.type.startsWith('image/') ? 'image' : 'video'
    }];
  }

  function removeMedia(mediaId: string) {
    uploadedMedia = uploadedMedia.filter(m => m.id !== mediaId);
  }

  function addPollOption() {
    if (pollOptions.length < 4) {
      pollOptions = [...pollOptions, createPollOption()];
    }
  }

  function removePollOption(optionId: string) {
    if (pollOptions.length > 2) {
      pollOptions = pollOptions.filter(option => option.id !== optionId);
    }
  }

  function updatePollOptionValue(optionId: string, value: string) {
    pollOptions = pollOptions.map(option =>
      option.id === optionId ? { ...option, value } : option
    );
  }

  function resolveVisibility(value: string): PostVisibility {
    return visibilityOptions.includes(value as PostVisibility) ? (value as PostVisibility) : 'public';
  }

  function insertEmoji(emoji: string) {
    content += emoji;
    characterCount = content.length;
  }

  function applyFormatting(format: string) {
    if (!showFormatting) return;
    
    const textarea = document.querySelector('textarea');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        break;
    }
    
    content = content.substring(0, start) + formattedText + content.substring(end);
  }

  $effect(() => {
    characterCount = content.length;
  });
</script>

<div class="compose-flow-container">
  <div class="compose-wrapper">
    {#if composing}
      <!-- Main Compose Area -->
      <div class="compose-main">
        <h2>Compose Post</h2>
        
        <!-- Content Warning -->
        {#if showContentWarning}
          <div class="content-warning-field">
            <input
              type="text"
              placeholder="Content warning (optional)"
              bind:value={contentWarning}
              class="warning-input"
            />
          </div>
        {/if}
        
        <!-- Main Compose Box -->
        <div class="compose-box-wrapper">
          <ComposeBox
            on:post={handlePost}
            placeholder="What's on your mind?"
            maxLength={maxLength}
            showPollButton={showPollCreation}
            showMediaButton={showMediaUpload}
            enableDrafts={false}
            bind:value={content}
          />
          
          <!-- Character Count -->
          <div class="character-count" class:warning={characterCount > maxLength * 0.9}>
            {characterCount} / {maxLength}
          </div>
        </div>
        
        <!-- Formatting Toolbar -->
        {#if showFormatting}
          <div class="formatting-toolbar">
            <button onclick={() => applyFormatting('bold')} title="Bold">
              <strong>B</strong>
            </button>
            <button onclick={() => applyFormatting('italic')} title="Italic">
              <em>I</em>
            </button>
            <button onclick={() => applyFormatting('code')} title="Code">
              {'</>'}
            </button>
            <button onclick={() => applyFormatting('link')} title="Link">
              🔗
            </button>
          </div>
        {/if}
        
        <!-- Emoji Picker -->
        {#if showEmojiPicker}
          <div class="emoji-picker">
            <div class="quick-emojis">
              {#each quickEmojis as emoji (emoji)}
                <button 
                  class="emoji-button"
                  onclick={() => insertEmoji(emoji)}
                >
                  {emoji}
                </button>
              {/each}
            </div>
          </div>
        {/if}
        
        <!-- Media Upload -->
        {#if showMediaUpload}
          <div class="media-section">
            <div class="media-controls">
              <label class="upload-button">
                📷 Upload Media
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onchange={(e) => {
                    const files = Array.from(e.currentTarget.files || []);
                    files.forEach(handleMediaUpload);
                  }}
                  style="display: none;"
                />
              </label>
              
              <button onclick={() => showMediaLibrary = !showMediaLibrary}>
                🖼️ Media Library
              </button>
            </div>
            
            {#if showMediaLibrary}
              <div class="media-library">
                {#each mediaLibrary as media (media.id)}
                  <button 
                    class="media-thumb"
                    onclick={() => {
                      uploadedMedia = [...uploadedMedia, media];
                      showMediaLibrary = false;
                    }}
                  >
                    <img src={media.url} alt="Media" />
                  </button>
                {/each}
              </div>
            {/if}
            
            {#if uploadedMedia.length > 0}
              <div class="uploaded-media">
                {#each uploadedMedia as media (media.id)}
                  <div class="media-preview">
                    <img src={media.url} alt="Uploaded" />
                    <button 
                      class="remove-media"
                      onclick={() => removeMedia(media.id)}
                    >
                      ✕
                    </button>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
        
        <!-- Poll Creation -->
        {#if showPollCreation && showPoll}
          <div class="poll-section">
            <h3>Create Poll</h3>
            
            <div class="poll-options">
              {#each pollOptions as option, index (option.id)}
                <div class="poll-option">
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option.value}
                    oninput={(event) => updatePollOptionValue(option.id, (event.currentTarget as HTMLInputElement).value)}
                    class="option-input"
                  />
                  {#if pollOptions.length > 2}
                    <button 
                      onclick={() => removePollOption(option.id)}
                      class="remove-option"
                    >
                      ✕
                    </button>
                  {/if}
                </div>
              {/each}
            </div>
            
            {#if pollOptions.length < 4}
              <button onclick={addPollOption} class="add-option">
                + Add Option
              </button>
            {/if}
            
            <div class="poll-duration">
              <label>
                Duration:
                <select bind:value={pollDuration}>
                  <option value={300}>5 minutes</option>
                  <option value={1800}>30 minutes</option>
                  <option value={3600}>1 hour</option>
                  <option value={21600}>6 hours</option>
                  <option value={86400}>1 day</option>
                  <option value={259200}>3 days</option>
                  <option value={604800}>7 days</option>
                </select>
              </label>
            </div>
          </div>
        {/if}
        
        <!-- Visibility Selector -->
        {#if showVisibilitySelector}
          <div class="visibility-section">
            <label>
              Visibility:
              <select bind:value={visibility} class="visibility-select">
                <option value="public">🌐 Public</option>
                <option value="unlisted">🔓 Unlisted</option>
                <option value="private">🔒 Followers Only</option>
                <option value="direct">✉️ Direct Message</option>
              </select>
            </label>
          </div>
        {/if}
        
        <!-- Scheduling -->
        {#if showScheduling}
          <div class="scheduling-section">
            <button 
              onclick={() => showSchedulePanel = !showSchedulePanel}
              class="schedule-toggle"
            >
              📅 Schedule Post
            </button>
            
            {#if showSchedulePanel}
              <div class="schedule-panel">
                <input
                  type="date"
                  bind:value={scheduledDate}
                  min={new Date().toISOString().split('T')[0]}
                />
                <input
                  type="time"
                  bind:value={scheduledTime}
                />
              </div>
            {/if}
          </div>
        {/if}
        
        <!-- Action Buttons -->
        <div class="compose-actions">
          {#if showPollCreation}
            <button 
              onclick={() => showPoll = !showPoll}
              class="poll-toggle"
              class:active={showPoll}
            >
              📊 {showPoll ? 'Remove' : 'Add'} Poll
            </button>
          {/if}
          
          {#if enableDrafts}
            <button onclick={saveDraft} class="save-draft">
              💾 Save Draft
            </button>
            
            <button 
              onclick={() => showDraftsPanel = !showDraftsPanel}
              class="load-draft"
            >
              📁 Load Draft ({drafts.length})
            </button>
          {/if}
          
          <button 
            onclick={() => composing = false}
            class="cancel-button"
          >
            Cancel
          </button>
          
          <button 
            class="post-button"
            disabled={isPosting || !content.trim()}
          >
            {isPosting ? 'Posting...' : scheduledDate ? 'Schedule' : 'Post'}
          </button>
        </div>
      </div>
      
      <!-- Drafts Panel -->
      {#if enableDrafts && showDraftsPanel}
        <aside class="drafts-panel">
          <h3>Saved Drafts</h3>
          
          {#if drafts.length === 0}
            <p class="no-drafts">No saved drafts</p>
          {:else}
            <div class="drafts-list">
              {#each drafts as draft (draft.id)}
                <div class="draft-item">
                  <div class="draft-preview">
                    {draft.content.substring(0, 100)}...
                  </div>
                  <div class="draft-meta">
                    {new Date(draft.timestamp).toLocaleString()}
                  </div>
                  <div class="draft-actions">
                    <button onclick={() => loadDraft(draft.id)}>
                      Load
                    </button>
                    <button onclick={() => deleteDraft(draft.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </aside>
      {/if}
    {:else}
      <!-- Success State -->
      <div class="success-state">
        <h2>✅ Posted Successfully!</h2>
        
        {#if postHistory.length > 0}
          <div class="recent-posts">
            <h3>Recent Posts</h3>
            {#each postHistory as post (post.id)}
              <div class="post-preview">
                <div class="post-content">
                  {post.content.substring(0, 200)}
                </div>
                <div class="post-meta">
                  {new Date(post.created_at).toLocaleString()}
                </div>
              </div>
            {/each}
          </div>
        {/if}
        
        <button onclick={() => composing = true} class="compose-another">
          Compose Another
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .compose-flow-container {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--gc-spacing-lg);
  }

  .compose-wrapper {
    background: var(--gc-color-surface-100);
    border-radius: var(--gc-radius-lg);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .compose-main {
    padding: var(--gc-spacing-lg);
  }

  .compose-main h2 {
    margin: 0 0 var(--gc-spacing-md) 0;
    color: var(--gc-color-text-primary);
  }

  .content-warning-field {
    margin-bottom: var(--gc-spacing-md);
  }

  .warning-input {
    width: 100%;
    padding: var(--gc-spacing-sm);
    border: 1px solid var(--gc-color-border-default);
    border-radius: var(--gc-radius-sm);
    background: var(--gc-color-surface-200);
    font-size: var(--gc-font-size-md);
  }

  .compose-box-wrapper {
    position: relative;
    margin-bottom: var(--gc-spacing-md);
  }

  .character-count {
    position: absolute;
    bottom: var(--gc-spacing-sm);
    right: var(--gc-spacing-sm);
    font-size: var(--gc-font-size-sm);
    color: var(--gc-color-text-secondary);
  }

  .character-count.warning {
    color: var(--gc-color-error-600);
    font-weight: 600;
  }

  .formatting-toolbar {
    display: flex;
    gap: var(--gc-spacing-xs);
    margin-bottom: var(--gc-spacing-md);
    padding: var(--gc-spacing-sm);
    background: var(--gc-color-surface-200);
    border-radius: var(--gc-radius-sm);
  }

  .formatting-toolbar button {
    padding: var(--gc-spacing-xs) var(--gc-spacing-sm);
    border: 1px solid var(--gc-color-border-default);
    border-radius: var(--gc-radius-xs);
    background: var(--gc-color-surface-100);
    cursor: pointer;
    font-size: var(--gc-font-size-sm);
  }

  .emoji-picker {
    margin-bottom: var(--gc-spacing-md);
  }

  .quick-emojis {
    display: flex;
    gap: var(--gc-spacing-xs);
    flex-wrap: wrap;
  }

  .emoji-button {
    padding: var(--gc-spacing-xs);
    border: 1px solid var(--gc-color-border-subtle);
    border-radius: var(--gc-radius-xs);
    background: var(--gc-color-surface-200);
    cursor: pointer;
    font-size: var(--gc-font-size-lg);
    transition: all 0.2s;
  }

  .emoji-button:hover {
    background: var(--gc-color-primary-100);
    transform: scale(1.2);
  }

  .media-section {
    margin-bottom: var(--gc-spacing-md);
  }

  .media-controls {
    display: flex;
    gap: var(--gc-spacing-sm);
    margin-bottom: var(--gc-spacing-sm);
  }

  .upload-button,
  .media-controls button {
    padding: var(--gc-spacing-sm) var(--gc-spacing-md);
    border: 1px solid var(--gc-color-border-default);
    border-radius: var(--gc-radius-sm);
    background: var(--gc-color-surface-200);
    cursor: pointer;
    font-size: var(--gc-font-size-sm);
  }

  .media-library {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--gc-spacing-sm);
    padding: var(--gc-spacing-md);
    background: var(--gc-color-surface-200);
    border-radius: var(--gc-radius-sm);
    margin-bottom: var(--gc-spacing-md);
  }

  .media-thumb {
    aspect-ratio: 1;
    border: none;
    border-radius: var(--gc-radius-sm);
    overflow: hidden;
    cursor: pointer;
  }

  .media-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .uploaded-media {
    display: flex;
    gap: var(--gc-spacing-sm);
    flex-wrap: wrap;
  }

  .media-preview {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: var(--gc-radius-sm);
    overflow: hidden;
  }

  .media-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .remove-media {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 24px;
    height: 24px;
    border: none;
    border-radius: var(--gc-radius-full);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .poll-section {
    padding: var(--gc-spacing-md);
    background: var(--gc-color-surface-200);
    border-radius: var(--gc-radius-sm);
    margin-bottom: var(--gc-spacing-md);
  }

  .poll-section h3 {
    margin: 0 0 var(--gc-spacing-sm) 0;
    font-size: var(--gc-font-size-md);
  }

  .poll-options {
    display: flex;
    flex-direction: column;
    gap: var(--gc-spacing-sm);
    margin-bottom: var(--gc-spacing-sm);
  }

  .poll-option {
    display: flex;
    gap: var(--gc-spacing-xs);
  }

  .option-input {
    flex: 1;
    padding: var(--gc-spacing-sm);
    border: 1px solid var(--gc-color-border-default);
    border-radius: var(--gc-radius-sm);
    background: var(--gc-color-surface-100);
  }

  .remove-option {
    padding: var(--gc-spacing-xs) var(--gc-spacing-sm);
    border: none;
    background: var(--gc-color-error-100);
    color: var(--gc-color-error-600);
    border-radius: var(--gc-radius-xs);
    cursor: pointer;
  }

  .add-option {
    padding: var(--gc-spacing-sm);
    border: 1px dashed var(--gc-color-border-default);
    border-radius: var(--gc-radius-sm);
    background: transparent;
    color: var(--gc-color-primary-600);
    cursor: pointer;
  }

  .poll-duration label {
    display: flex;
    align-items: center;
    gap: var(--gc-spacing-sm);
    font-size: var(--gc-font-size-sm);
  }

  .visibility-section,
  .scheduling-section {
    margin-bottom: var(--gc-spacing-md);
  }

  .visibility-select {
    margin-left: var(--gc-spacing-sm);
    padding: var(--gc-spacing-xs) var(--gc-spacing-sm);
    border: 1px solid var(--gc-color-border-default);
    border-radius: var(--gc-radius-sm);
    background: var(--gc-color-surface-200);
  }

  .schedule-toggle {
    padding: var(--gc-spacing-sm) var(--gc-spacing-md);
    border: 1px solid var(--gc-color-border-default);
    border-radius: var(--gc-radius-sm);
    background: var(--gc-color-surface-200);
    cursor: pointer;
  }

  .schedule-panel {
    display: flex;
    gap: var(--gc-spacing-sm);
    margin-top: var(--gc-spacing-sm);
  }

  .schedule-panel input {
    padding: var(--gc-spacing-sm);
    border: 1px solid var(--gc-color-border-default);
    border-radius: var(--gc-radius-sm);
    background: var(--gc-color-surface-200);
  }

  .compose-actions {
    display: flex;
    gap: var(--gc-spacing-sm);
    justify-content: flex-end;
    margin-top: var(--gc-spacing-lg);
  }

  .poll-toggle,
  .save-draft,
  .load-draft,
  .cancel-button,
  .post-button {
    padding: var(--gc-spacing-sm) var(--gc-spacing-md);
    border: 1px solid var(--gc-color-border-default);
    border-radius: var(--gc-radius-sm);
    background: var(--gc-color-surface-200);
    cursor: pointer;
    font-size: var(--gc-font-size-sm);
  }

  .poll-toggle.active {
    background: var(--gc-color-primary-100);
    color: var(--gc-color-primary-700);
  }

  .post-button {
    background: var(--gc-color-primary-500);
    color: white;
    border-color: var(--gc-color-primary-500);
  }

  .post-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .drafts-panel {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 300px;
    background: var(--gc-color-surface-200);
    border-left: 1px solid var(--gc-color-border-default);
    padding: var(--gc-spacing-md);
    overflow-y: auto;
  }

  .drafts-panel h3 {
    margin: 0 0 var(--gc-spacing-md) 0;
    font-size: var(--gc-font-size-md);
  }

  .no-drafts {
    color: var(--gc-color-text-secondary);
    text-align: center;
    padding: var(--gc-spacing-lg);
  }

  .drafts-list {
    display: flex;
    flex-direction: column;
    gap: var(--gc-spacing-sm);
  }

  .draft-item {
    padding: var(--gc-spacing-sm);
    background: var(--gc-color-surface-100);
    border-radius: var(--gc-radius-sm);
  }

  .draft-preview {
    font-size: var(--gc-font-size-sm);
    color: var(--gc-color-text-primary);
    margin-bottom: var(--gc-spacing-xs);
  }

  .draft-meta {
    font-size: var(--gc-font-size-xs);
    color: var(--gc-color-text-secondary);
    margin-bottom: var(--gc-spacing-xs);
  }

  .draft-actions {
    display: flex;
    gap: var(--gc-spacing-xs);
  }

  .draft-actions button {
    padding: var(--gc-spacing-xs);
    border: 1px solid var(--gc-color-border-subtle);
    border-radius: var(--gc-radius-xs);
    background: var(--gc-color-surface-200);
    cursor: pointer;
    font-size: var(--gc-font-size-xs);
  }

  .success-state {
    padding: var(--gc-spacing-xl);
    text-align: center;
  }

  .success-state h2 {
    color: var(--gc-color-success-600);
    margin-bottom: var(--gc-spacing-lg);
  }

  .recent-posts {
    margin: var(--gc-spacing-lg) 0;
  }

  .recent-posts h3 {
    margin-bottom: var(--gc-spacing-md);
    color: var(--gc-color-text-primary);
  }

  .post-preview {
    padding: var(--gc-spacing-md);
    background: var(--gc-color-surface-200);
    border-radius: var(--gc-radius-sm);
    margin-bottom: var(--gc-spacing-sm);
    text-align: left;
  }

  .post-content {
    color: var(--gc-color-text-primary);
    margin-bottom: var(--gc-spacing-xs);
  }

  .post-meta {
    font-size: var(--gc-font-size-xs);
    color: var(--gc-color-text-secondary);
  }

  .compose-another {
    padding: var(--gc-spacing-md) var(--gc-spacing-lg);
    background: var(--gc-color-primary-500);
    color: white;
    border: none;
    border-radius: var(--gc-radius-sm);
    cursor: pointer;
    font-size: var(--gc-font-size-md);
  }

  @media (max-width: 768px) {
    .compose-flow-container {
      padding: var(--gc-spacing-sm);
    }

    .media-library {
      grid-template-columns: repeat(3, 1fr);
    }

    .drafts-panel {
      position: fixed;
      width: 100%;
    }

    .compose-actions {
      flex-wrap: wrap;
    }
  }
</style>
